import { API_CONFIG, ENDPOINTS } from './config'

// API client for Python FastAPI backend
export class PythonAPI {
  private baseURL: string

  constructor() {
    this.baseURL = API_CONFIG.PYTHON_API_URL
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}${ENDPOINTS.PYTHON.HEALTH}`)
      return await response.json()
    } catch (error) {
      console.error('Python API health check failed:', error)
      throw error
    }
  }

  // Process document
  async processDocument(file: File): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${this.baseURL}${ENDPOINTS.PYTHON.PROCESS}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Processing failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Document processing failed:', error)
      throw error
    }
  }

  // Get supported formats
  async getSupportedFormats() {
    try {
      const response = await fetch(`${this.baseURL}${ENDPOINTS.PYTHON.FORMATS}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to get supported formats:', error)
      throw error
    }
  }
}

// API client for Next.js backend
export class NextAPI {
  private baseURL: string

  constructor() {
    this.baseURL = API_CONFIG.NEXT_API_URL
  }

  // Authentication
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseURL}${ENDPOINTS.NEXT.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      return await response.json()
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async register(email: string, password: string, name?: string) {
    try {
      const response = await fetch(`${this.baseURL}${ENDPOINTS.NEXT.AUTH.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      return await response.json()
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  // Documents
  async getDocuments(userId: string) {
    try {
      const response = await fetch(`${this.baseURL}${ENDPOINTS.NEXT.DOCUMENTS}?userId=${userId}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to get documents:', error)
      throw error
    }
  }

  async uploadDocument(file: File, userId: string) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)

      const response = await fetch(`${this.baseURL}${ENDPOINTS.NEXT.DOCUMENTS}`, {
        method: 'POST',
        body: formData,
      })

      return await response.json()
    } catch (error) {
      console.error('Document upload failed:', error)
      throw error
    }
  }
  async saveProcessingResult(documentId: string, result: any) {
    try {
      const response = await fetch(`${this.baseURL}${ENDPOINTS.NEXT.DOCUMENTS}/${documentId}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extractedData: result.extracted_data,
          processingTime: result.processing_time,
          accuracy: result.accuracy
        }),
      })

      return await response.json()
    } catch (error) {
      console.error('Failed to save processing results:', error)
      throw error
    }
  }
}

// Export instances
export const pythonAPI = new PythonAPI()
export const nextAPI = new NextAPI()

// Unified API service
export class APIService {
  // Check if Python backend is available
  static async isPythonBackendAvailable(): Promise<boolean> {
    try {
      await pythonAPI.healthCheck()
      return true
    } catch {
      return false
    }
  }

  // Process document with fallback
  static async processDocument(file: File) {
    let errorDetail = 'Backend unavailable (Health check failed)';

    try {
      // Try Python backend first
      await pythonAPI.healthCheck();
      return await pythonAPI.processDocument(file)
    } catch (error) {
      console.warn('Python backend failed, falling back to Next.js processing', error)
      if (error instanceof Error) {
        errorDetail = error.message;
      } else {
        errorDetail = String(error);
      }
    }

    // Fallback to Next.js processing (mock implementation)
    return {
      success: true,
      filename: file.name,
      file_type: file.type,
      extracted_data: {
        columns: ['Status', 'Error Details'],
        data: [
          { 'Status': 'Using Fallback (Backend Failed)', 'Error Details': errorDetail }
        ]
      },
      processing_time: 1.0,
      accuracy: 0.0,
      row_count: 1,
      column_count: 2
    }
  }
}