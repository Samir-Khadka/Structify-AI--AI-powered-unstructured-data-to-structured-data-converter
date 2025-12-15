// API configuration for connecting to Python backend
export const API_CONFIG = {
  // Python FastAPI backend
  PYTHON_API_URL: process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000',
  
  // Next.js API routes (fallback)
  NEXT_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  
  // File upload settings
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_FORMATS: [
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
}

// API endpoints
export const ENDPOINTS = {
  // Python backend endpoints
  PYTHON: {
    HEALTH: '/health',
    PROCESS: '/process',
    FORMATS: '/formats'
  },
  
  // Next.js API endpoints
  NEXT: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register'
    },
    DOCUMENTS: '/documents'
  }
}