# StructifyAI - Python Backend Setup

## Overview

This Python FastAPI backend provides advanced document processing capabilities for StructifyAI using the specified libraries from your requirements.

## Requirements Met ✅

- **Python 3** ✅
- **FastAPI** ✅
- **Pandas** ✅
- **PDFplumber** ✅
- **spaCy** ✅
- **SQLite/PostgreSQL** ✅ (configurable)

## Features

### Document Processing
- **PDF Processing**: Uses pdfplumber for table extraction and text extraction
- **OCR Support**: Fallback OCR for scanned PDFs using Tesseract
- **Text Processing**: Advanced NLP with spaCy for entity recognition
- **CSV/Excel Processing**: Direct parsing with Pandas
- **Table Detection**: Automatic table structure identification
- **Named Entity Recognition**: Extract entities like names, emails, phone numbers

### AI/NLP Capabilities
- **Entity Extraction**: Persons, organizations, locations, dates
- **Pattern Recognition**: Email addresses, phone numbers
- **Table Structure Analysis**: Automatic table detection and extraction
- **Text Analysis**: Part-of-speech tagging and dependency parsing

## Installation

### Prerequisites
- Python 3.8+
- Tesseract OCR (for scanned PDF processing)

### Setup

1. **Navigate to the backend directory:**
   ```bash
   cd mini-services/python-backend
   ```

2. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Or install manually:**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Download spaCy model
   python -m spacy download en_core_web_sm
   
   # Create necessary directories
   mkdir -p uploads logs
   ```

### Tesseract OCR Installation

**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```

**macOS:**
```bash
brew install tesseract
```

**Windows:**
Download and install from [Tesseract at UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)

## Configuration

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit environment variables:**
   ```bash
   nano .env
   ```

3. **Key settings:**
   - `HOST`: Server host (default: 0.0.0.0)
   - `PORT`: Server port (default: 8000)
   - `MAX_FILE_SIZE`: Maximum file size in bytes (default: 50MB)
   - `ENABLE_OCR`: Enable OCR processing (default: true)
   - `ENABLE_NLP`: Enable NLP processing (default: true)

## Running the Server

### Development
```bash
python main.py
```

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status and capabilities

### Process Document
- **POST** `/process`
- Upload and process documents
- Supports: PDF, TXT, CSV, Excel files
- Max file size: 50MB

### Supported Formats
- **GET** `/formats`
- Returns list of supported file formats and processing methods

## Processing Methods

### PDF Processing
1. **Table Extraction**: Uses pdfplumber to extract structured tables
2. **Text Extraction**: Falls back to text extraction if no tables found
3. **OCR Processing**: Uses Tesseract for scanned documents
4. **NLP Analysis**: Processes extracted text with spaCy

### Text Processing
1. **Entity Recognition**: Extracts named entities (persons, orgs, locations)
2. **Pattern Matching**: Identifies emails, phone numbers, dates
3. **Structure Analysis**: Attempts to identify structured patterns

### CSV/Excel Processing
1. **Direct Parsing**: Uses Pandas for structured data
2. **Data Cleaning**: Handles missing values and data types
3. **Validation**: Ensures data integrity

## Integration with Frontend

The backend is designed to work seamlessly with the Next.js frontend:

1. **Automatic Fallback**: Frontend automatically detects if Python backend is available
2. **Error Handling**: Graceful degradation if backend is unavailable
3. **Real-time Processing**: Progress tracking and status updates
4. **Multiple Formats**: Support for various file types

## Performance Considerations

- **Memory Usage**: Large PDFs are processed in chunks
- **Concurrent Processing**: FastAPI handles multiple requests
- **Caching**: spaCy models are loaded once at startup
- **File Cleanup**: Temporary files are automatically removed

## Troubleshooting

### Common Issues

1. **spaCy Model Not Found:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

2. **Tesseract Not Found:**
   - Install Tesseract OCR for your system
   - Ensure it's in your PATH

3. **Memory Issues with Large Files:**
   - Reduce `MAX_FILE_SIZE` in `.env`
   - Increase system RAM or use cloud processing

4. **Permission Errors:**
   ```bash
   chmod +x setup.sh
   mkdir -p uploads logs
   ```

### Logs

Check application logs:
```bash
tail -f logs/app.log
```

## Development

### Adding New Processors

1. Create new method in `DocumentProcessor` class
2. Add to `supported_formats` dictionary
3. Update API documentation

### Testing

Run health check:
```bash
curl http://localhost:8000/health
```

Test document processing:
```bash
curl -X POST -F "file=@test.pdf" http://localhost:8000/process
```

## Production Deployment

### Docker (Recommended)
```dockerfile
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y tesseract-ocr

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production
- Set `DEBUG=false`
- Configure proper `DATABASE_URL`
- Set secure `SECRET_KEY`
- Configure file storage (S3, etc.)

## Monitoring

### Health Monitoring
- `/health` endpoint provides status information
- Monitor memory usage and processing times
- Set up alerts for processing failures

### Performance Metrics
- Track processing time per file type
- Monitor success rates
- Measure accuracy of extractions

## Security

### File Upload Security
- File type validation
- Size limits enforced
- Temporary file cleanup
- Virus scanning (if needed)

### API Security
- CORS configuration
- Rate limiting (if needed)
- Input validation
- Error message sanitization

## License

This backend uses open-source libraries as specified in your requirements:
- FastAPI (MIT License)
- Pandas (BSD License)
- PDFplumber (MIT License)
- spaCy (MIT License)
- Tesseract (Apache License)
- All other dependencies with compatible licenses