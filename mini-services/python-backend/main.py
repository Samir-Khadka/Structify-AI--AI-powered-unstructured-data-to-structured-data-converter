from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import tempfile
import shutil
from typing import List, Optional, Dict, Any
import json
import pandas as pd
import pdfplumber
import spacy
import pytesseract
from PIL import Image
import cv2
import numpy as np
from pydantic import BaseModel
import logging
import time
import io
import re

# Try to import optional dependencies
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import optional dependencies
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None
    logger.warning("PyMuPDF not available. OCR functionality will be limited")

# Initialize FastAPI app
app = FastAPI(
    title="StructifyAI Python Backend",
    description="AI-powered document processing backend",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for NLP models
nlp = None
spacy_model = None

# Pydantic models
class ProcessingResult(BaseModel):
    success: bool
    filename: str
    file_type: str
    extracted_data: Dict[str, Any]
    processing_time: float
    accuracy: float
    row_count: int
    column_count: int

class ProcessingStatus(BaseModel):
    status: str
    progress: float
    message: str

# Initialize NLP models
async def initialize_nlp_models():
    global nlp, spacy_model
    try:
        # Load spaCy model
        logger.info("Loading spaCy model...")
        spacy_model = spacy.load("en_core_web_sm")
        logger.info("spaCy model loaded successfully")
    except OSError:
        logger.warning("spaCy model not found. Using basic text processing")
        spacy_model = None

# File processing functions
class DocumentProcessor:
    def __init__(self):
        self.supported_formats = {
            'application/pdf': self._process_pdf,
            'text/plain': self._process_text,
            'text/csv': self._process_csv,
            'application/vnd.ms-excel': self._process_excel,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': self._process_excel
        }
    
    async def process_file(self, file_path: str, file_type: str, filename: str) -> ProcessingResult:
        """Process uploaded file and extract structured data"""
        start_time = time.time()
        
        try:
            if file_type not in self.supported_formats:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_type}")
            
            processor = self.supported_formats[file_type]
            extracted_data = await processor(file_path)
            
            processing_time = time.time() - start_time
            
            # Calculate accuracy (simulated)
            accuracy = self._calculate_accuracy(extracted_data)
            
            return ProcessingResult(
                success=True,
                filename=filename,
                file_type=file_type,
                extracted_data=extracted_data,
                processing_time=processing_time,
                accuracy=accuracy,
                row_count=len(extracted_data.get('data', [])),
                column_count=len(extracted_data.get('columns', []))
            )
            
        except Exception as e:
            logger.error(f"Error processing file {filename}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    
    async def _process_pdf(self, file_path: str) -> Dict[str, Any]:
        """Process PDF file using pdfplumber"""
        try:
            import pdfplumber
            
            all_data = []
            all_columns = []
            
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    # Extract tables
                    tables = page.extract_tables()
                    for table in tables:
                        if table and len(table) > 1:
                            # Clean table data
                            cleaned_table = []
                            for row in table:
                                cleaned_row = [str(cell) if cell is not None else "" for cell in row]
                                cleaned_table.append(cleaned_row)
                            
                            if cleaned_table:
                                df = pd.DataFrame(cleaned_table[1:], columns=cleaned_table[0])
                                all_data.append(df)
                    
                    # Extract text if no tables found
                    if not tables:
                        text = page.extract_text()
                        if text:
                            text_data = self._extract_entities_from_text(text)
                            if text_data:
                                all_data.append(pd.DataFrame(text_data))
            
            if all_data:
                combined_df = pd.concat(all_data, ignore_index=True)
                return {
                    'columns': list(combined_df.columns),
                    'data': combined_df.fillna('').to_dict('records'),
                    'extraction_method': 'pdfplumber_tables'
                }
            else:
                # Fallback to OCR
                return await self._process_pdf_with_ocr(file_path)
                
        except Exception as e:
            logger.error(f"Error processing PDF with pdfplumber: {str(e)}")
            # Fallback to OCR
            return await self._process_pdf_with_ocr(file_path)
    
    async def _process_pdf_with_ocr(self, file_path: str) -> Dict[str, Any]:
        """Process PDF using OCR for scanned documents"""
        try:
            if not fitz:
                # Fallback to basic text processing
                return await self._process_pdf_basic(file_path)
            
            doc = fitz.open(file_path)
            all_text = ""
            
            for page in doc:
                # Convert page to image
                pix = page.get_pixmap()
                img_data = pix.tobytes("png")
                img = Image.open(io.BytesIO(img_data))
                
                # Perform OCR
                text = pytesseract.image_to_string(img)
                all_text += text + "\n"
            
            # Process extracted text
            text_data = self._extract_entities_from_text(all_text)
            
            if text_data:
                df = pd.DataFrame(text_data)
                return {
                    'columns': list(df.columns),
                    'data': df.to_dict('records'),
                    'extraction_method': 'ocr'
                }
            else:
                # Fallback: line-by-line extraction
                lines = [line.strip() for line in all_text.split('\n') if line.strip()]
                return {
                    'columns': ['Line Number', 'Content'],
                    'data': [{'Line Number': i+1, 'Content': line} for i, line in enumerate(lines)],
                    'extraction_method': 'ocr_lines'
                }
                
        except Exception as e:
            logger.error(f"Error in OCR processing: {str(e)}")
            # Fallback to basic processing
            return await self._process_pdf_basic(file_path)
    
    async def _process_pdf_basic(self, file_path: str) -> Dict[str, Any]:
        """Basic PDF processing fallback"""
        try:
            with pdfplumber.open(file_path) as pdf:
                all_text = ""
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        all_text += text + "\n"
            
            lines = [line.strip() for line in all_text.split('\n') if line.strip()]
            return {
                'columns': ['Line Number', 'Content', 'Word Count'],
                'data': [
                    {
                        'Line Number': i+1,
                        'Content': line,
                        'Word Count': len(line.split())
                    } for i, line in enumerate(lines)
                ],
                'extraction_method': 'basic_text'
            }
            
        except Exception as e:
            logger.error(f"Error in basic PDF processing: {str(e)}")
            raise e
    
    async def _process_text(self, file_path: str) -> Dict[str, Any]:
        """Process text file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
            
            # Extract entities and patterns
            text_data = self._extract_entities_from_text(text)
            
            if text_data:
                df = pd.DataFrame(text_data)
                return {
                    'columns': list(df.columns),
                    'data': df.to_dict('records'),
                    'extraction_method': 'nlp_entities'
                }
            else:
                # Fallback: split into structured format
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                return {
                    'columns': ['Line Number', 'Content', 'Word Count'],
                    'data': [
                        {
                            'Line Number': i+1,
                            'Content': line,
                            'Word Count': len(line.split())
                        } for i, line in enumerate(lines)
                    ],
                    'extraction_method': 'line_based'
                }
                
        except Exception as e:
            logger.error(f"Error processing text file: {str(e)}")
            raise e
    
    async def _process_csv(self, file_path: str) -> Dict[str, Any]:
        """Process CSV file"""
        try:
            df = pd.read_csv(file_path)
            
            # Clean data
            df = df.fillna('')
            
            return {
                'columns': list(df.columns),
                'data': df.to_dict('records'),
                'extraction_method': 'csv_parser'
            }
            
        except Exception as e:
            logger.error(f"Error processing CSV file: {str(e)}")
            raise e
    
    async def _process_excel(self, file_path: str) -> Dict[str, Any]:
        """Process Excel file"""
        try:
            try:
                # Try with openpyxl first (default for xlsx)
                df = pd.read_excel(file_path, engine='openpyxl')
            except Exception:
                # Fallback to default or other engines if needed
                df = pd.read_excel(file_path)
            
            # Clean data
            df = df.fillna('')
            
            return {
                'columns': list(df.columns),
                'data': df.to_dict('records'),
                'extraction_method': 'excel_parser'
            }
            
        except Exception as e:
            logger.error(f"Error processing Excel file: {str(e)}")
            raise e
    
    def _extract_entities_from_text(self, text: str) -> List[Dict[str, Any]]:
        """Extract named entities from text using spaCy"""
        if not spacy_model:
            return []
        
        try:
            doc = spacy_model(text)
            entities = []
            
            for ent in doc.ents:
                entities.append({
                    'Entity': ent.text,
                    'Label': ent.label_,
                    'Start': ent.start_char,
                    'End': ent.end_char,
                    'Description': spacy.explain(ent.label_) if spacy.explain(ent.label_) else ent.label_
                })
            
            # Also extract patterns like emails, phone numbers, dates
            import re
            
            # Email pattern
            emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
            for email in emails:
                entities.append({
                    'Entity': email,
                    'Label': 'EMAIL',
                    'Start': text.find(email),
                    'End': text.find(email) + len(email),
                    'Description': 'Email address'
                })
            
            # Phone pattern
            phones = re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text)
            for phone in phones:
                entities.append({
                    'Entity': phone,
                    'Label': 'PHONE',
                    'Start': text.find(phone),
                    'End': text.find(phone) + len(phone),
                    'Description': 'Phone number'
                })
            
            return entities
            
        except Exception as e:
            logger.error(f"Error extracting entities: {str(e)}")
            return []
    
    def _calculate_accuracy(self, extracted_data: Dict[str, Any]) -> float:
        """Calculate processing accuracy (simulated)"""
        try:
            data_count = len(extracted_data.get('data', []))
            column_count = len(extracted_data.get('columns', []))
            
            # Base accuracy
            base_accuracy = 85.0
            
            # Bonus for structured data
            if data_count > 0:
                base_accuracy += min(10, data_count / 10)
            
            # Bonus for multiple columns
            if column_count > 1:
                base_accuracy += min(5, column_count)
            
            return min(99.5, base_accuracy)
            
        except Exception:
            return 85.0

# Initialize processor
processor = DocumentProcessor()

# API Routes
@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    await initialize_nlp_models()
    logger.info("StructifyAI Python Backend started successfully")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "StructifyAI Python Backend",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "spacy_loaded": spacy_model is not None,
        "supported_formats": list(processor.supported_formats.keys())
    }

@app.post("/process", response_model=ProcessingResult)
async def process_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """Process uploaded document"""
    
    # Validate file size (50MB max)
    if file.size and file.size > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 50MB")
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name
    
    try:
        # Process the file
        result = await processor.process_file(
            temp_file_path, 
            file.content_type or "application/octet-stream", 
            file.filename or "unknown"
        )
        
        # Schedule cleanup
        background_tasks.add_task(os.unlink, temp_file_path)
        
        return result
        
    except Exception as e:
        # Cleanup on error
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        raise e

@app.get("/formats")
async def get_supported_formats():
    """Get list of supported file formats"""
    return {
        "supported_formats": list(processor.supported_formats.keys()),
        "max_file_size": "50MB",
        "processing_methods": [
            "pdfplumber_tables",
            "ocr",
            "nlp_entities",
            "csv_parser",
            "excel_parser"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )