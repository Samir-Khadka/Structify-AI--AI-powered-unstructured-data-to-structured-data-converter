export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  userId: string
  originalFilename: string
  fileType: string
  fileSize: number
  filePath: string
  uploadDate: Date
  processingStatus: 'pending' | 'processing' | 'completed' | 'error'
}

export interface ProcessingResult {
  id: string
  documentId: string
  extractedData: string // JSON string
  processingTime: number
  accuracyMetrics?: string
  createdAt: Date
}

export interface ExportHistory {
  id: string
  processingResultId: string
  userId: string
  exportFormat: string
  exportDate: Date
  destination?: string
}

export interface ExtractedData {
  columns: string[]
  data: Record<string, any>[]
  accuracy: number
}

export interface ProcessingStatus {
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress?: number
  message?: string
  error?: string
}

export interface FileUploadResponse {
  success: boolean
  document?: {
    id: string
    filename: string
    type: string
    size: number
    status: string
  }
  error?: string
}

export interface AIProcessingResult {
  success: boolean
  filename: string
  fileType: string
  extractedData: ExtractedData
  processingTime: number
}