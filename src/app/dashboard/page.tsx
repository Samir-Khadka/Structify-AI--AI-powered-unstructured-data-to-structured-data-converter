'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Upload,
  FileText,
  Download,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  Search,
  Filter,
  LogOut,
  User,
  Camera,
  X
} from 'lucide-react'
import { APIService, pythonAPI, nextAPI } from '@/lib/api/client'
import { API_CONFIG } from '@/lib/api/config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Document {
  id: string
  filename: string
  type: string
  size: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  uploadDate: string
  processingProgress?: number
  extractedRows?: number
  error?: string
  processingResult?: any
}

interface ProcessingResult {
  id: string
  documentId: string
  data: any[]
  columns: string[]
  accuracy: number
  processingTime: number
}

// ... inside component ...



export default function Dashboard() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<any[]>([])

  // Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedUser, setEditedUser] = useState({ name: '', email: '', avatar: '/avatars/01.png' })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // Load user info on mount (client-side only)
  useEffect(() => {

    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setUserEmail(user.email || user.name || 'User')
          setUserId(user.id)
          setEditedUser({
            name: user.name || '',
            email: user.email || '',
            avatar: user.avatar || '/avatars/01.png'
          })
          setIsLoading(false)

          // Fetch user's documents
          nextAPI.getDocuments(user.id).then(response => {
            if (response.documents) {
              const mappedDocs: Document[] = response.documents.map((d: any) => {
                let procResult: any = undefined;
                let rows: number | undefined = undefined;

                if (d.processingResults?.[0]) {
                  try {
                    const pr = d.processingResults[0];
                    const extracted = JSON.parse(pr.extractedData);
                    rows = extracted.data?.length;

                    // Construct result object matching the structure expected by handleViewResults
                    procResult = {
                      extracted_data: extracted,
                      processing_time: pr.processingTime,
                      accuracy: pr.accuracyMetrics ? JSON.parse(pr.accuracyMetrics).accuracy : 0
                    };
                  } catch (e) {
                    console.error('Error parsing processing result', e);
                  }
                }

                return {
                  id: d.id,
                  filename: d.originalFilename,
                  type: d.fileType,
                  size: d.fileSize,
                  status: d.processingStatus,
                  uploadDate: d.uploadDate,
                  processingResult: procResult,
                  extractedRows: rows
                }
              })
              setDocuments(mappedDocs)
            }
          })
        } catch (error) {
          console.error('Error parsing user data:', error)
          router.push('/auth')
        }
      } else {
        // No user found, redirect to auth
        router.push('/auth')
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Brain className="h-12 w-12 text-blue-600 animate-pulse mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h2>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    router.push('/auth')
  }

  const handleSave = async () => {
    if (!selectedDocument || !processingResult) return

    // Update local state
    setProcessingResult({
      ...processingResult,
      data: editedData
    })

    // In a real app, we would save to backend here
    // await nextAPI.updateDocumentData(selectedDocument.id, editedData)

    setIsEditing(false)
  }

  const handleEditChange = (rowIndex: number, colKey: string, value: string) => {
    const newData = [...editedData]
    newData[rowIndex] = { ...newData[rowIndex], [colKey]: value }
    setEditedData(newData)
  }

  const handleProfileSave = () => {
    // In a real app, upload avatarFile if present
    const newAvatar = avatarFile ? URL.createObjectURL(avatarFile) : editedUser.avatar

    // Update local storage
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : {}
      const updatedUser = { ...user, ...editedUser, avatar: newAvatar }
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }

    // Update state
    setUserEmail(editedUser.email)
    // Close dialog
    setIsProfileOpen(false)
    setIsEditingProfile(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      // Create preview
      setEditedUser(prev => ({ ...prev, avatar: URL.createObjectURL(file) }))
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setEditedUser(prev => ({ ...prev, avatar: '' })) // Or default
  }

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true)

    for (const file of files) {
      // Validate file
      if (!API_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
        alert(`Unsupported file type: ${file.type}`)
        continue
      }

      if (file.size > API_CONFIG.MAX_FILE_SIZE) {
        alert(`File too large: ${file.name}. Maximum size is 50MB`)
        continue
      }

      // 1. Upload Document
      let dbDoc;
      try {
        const uploadRes = await nextAPI.uploadDocument(file, userId)
        if (uploadRes.success) {
          dbDoc = uploadRes.document
        }
      } catch (err) {
        console.error('Upload failed', err)
        continue;
      }

      if (!dbDoc) continue;

      const newDoc: Document = {
        id: dbDoc.id,
        filename: dbDoc.filename,
        type: dbDoc.type,
        size: dbDoc.size,
        status: 'processing', // Initially pending, but we update immediately
        uploadDate: new Date().toISOString()
      }

      setDocuments(prev => [newDoc, ...prev])

      try {
        // 2. Process with AI service
        const result = await APIService.processDocument(file)

        // 3. Save Results
        await nextAPI.saveProcessingResult(dbDoc.id, result)

        // 4. Update UI
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === dbDoc.id
              ? {
                ...doc,
                status: 'completed',
                processingProgress: 100,
                extractedRows: result.row_count,
                processingResult: result
              }
              : doc
          )
        )

      } catch (error) {
        console.error('Processing failed:', error)
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === dbDoc.id
              ? { ...doc, status: 'error', error: error instanceof Error ? error.message : 'Processing failed' }
              : doc
          )
        )
      }
    }

    setIsUploading(false)
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />
      case 'processing':
        return <Brain className="h-4 w-4 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: Document['status']) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'default',
      error: 'destructive'
    } as const

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleViewResults = (doc: Document) => {
    setSelectedDocument(doc)

    // Use actual processing results if available
    if (doc.processingResult) {
      setProcessingResult({
        id: Date.now().toString(),
        documentId: doc.id,
        data: doc.processingResult.extracted_data.data || [],
        columns: doc.processingResult.extracted_data.columns || [],
        accuracy: doc.processingResult.accuracy || 85,
        processingTime: doc.processingResult.processing_time || 0
      })
      setEditedData(doc.processingResult.extracted_data.data || [])
    } else {
      // Fallback mock data
      const mockResult: ProcessingResult = {
        id: Date.now().toString(),
        documentId: doc.id,
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com', amount: '$1,234.56', date: '2024-01-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', amount: '$2,345.67', date: '2024-01-16' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', amount: '$3,456.78', date: '2024-01-17' },
          { id: 4, name: 'Alice Brown', email: 'alice@example.com', amount: '$4,567.89', date: '2024-01-18' },
          { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', amount: '$5,678.90', date: '2024-01-19' }
        ],
        columns: ['ID', 'Name', 'Email', 'Amount', 'Date'],
        accuracy: 94.5,
        processingTime: 12.3
      }
      setProcessingResult(mockResult)
    }
  }

  const handleExport = (format: 'csv' | 'excel' | 'google-sheets', doc?: Document) => {
    // Determine which data to use: passed doc, or currently selected doc/result
    const sourceData = doc?.processingResult?.extracted_data?.data || processingResult?.data
    const sourceColumns = doc?.processingResult?.extracted_data?.columns || processingResult?.columns || []
    const filename = doc?.filename || selectedDocument?.filename || 'export'

    if (!sourceData || !Array.isArray(sourceData)) {
      console.error('No data to export')
      return
    }

    if (format === 'csv') {
      // Convert JSON to CSV
      const headers = sourceColumns.join(',')
      const rows = sourceData.map(row =>
        sourceColumns.map(col => {
          const val = row[col] || ''
          // Escape quotes and wrap in quotes if contains comma
          const stringVal = String(val).replace(/"/g, '""')
          return stringVal.includes(',') ? `"${stringVal}"` : stringVal
        }).join(',')
      )
      const csvContent = [headers, ...rows].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename.replace(/\.[^/.]+$/, "")}_extracted.csv`
      link.click()
      URL.revokeObjectURL(url)
    } else {
      // For JSON/Excel/Other (Mock implementation for now, just dumps JSON)
      const dataStr = JSON.stringify(sourceData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename.replace(/\.[^/.]+$/, "")}_extracted.json`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleDelete = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId))
    if (selectedDocument?.id === docId) {
      setSelectedDocument(null)
      setProcessingResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFileUpload(files)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">StructifyAI Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="@user" />
                      <AvatarFallback>{userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Upload PDFs, text files, or CSVs for AI-powered data extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isUploading
                    ? 'border-blue-400 bg-blue-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.txt,.csv,.xls,.xlsx"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    {isUploading ? (
                      <p className="text-lg text-blue-600">Uploading files...</p>
                    ) : (
                      <div>
                        <p className="text-lg text-gray-600 mb-2">
                          Drag & drop files here, or click to select
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports PDF, TXT, CSV, XLS, XLSX (Max 50MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                {isUploading && (
                  <div className="mt-4">
                    <Progress value={100} className="w-full" />
                    <p className="text-sm text-gray-600 mt-2">Uploading files...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents ({filteredDocuments.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No documents found</p>
                    <p className="text-sm text-gray-500">Upload some documents to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.filename}</p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(doc.size)} • {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(doc.status)}
                          {doc.status === 'processing' && doc.processingProgress && (
                            <div className="w-24">
                              <Progress value={doc.processingProgress} className="h-2" />
                            </div>
                          )}
                          {doc.status === 'completed' && (
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewResults(doc)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExport('csv', doc)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Export
                              </Button>
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Processing Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Documents</span>
                  <span className="font-semibold">{documents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {documents.filter(d => d.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Processing</span>
                  <span className="font-semibold text-blue-600">
                    {documents.filter(d => d.status === 'processing').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Rows Extracted</span>
                  <span className="font-semibold">
                    {documents
                      .filter(d => d.extractedRows)
                      .reduce((sum, d) => sum + (d.extractedRows || 0), 0)
                      .toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.slice(-5).reverse().map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-3 text-sm">
                      {getStatusIcon(doc.status)}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{doc.filename}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.uploadDate).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Edit Dialog */}
        {/* Profile Edit Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={(open) => {
          setIsProfileOpen(open)
          if (!open) {
            setIsEditingProfile(false)
            setAvatarFile(null) // Reset pending avatar
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditingProfile ? 'Edit Profile' : 'Profile'}</DialogTitle>
              <DialogDescription>
                {isEditingProfile ? "Make changes to your profile here. Click save when you're done." : "View your profile details."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : editedUser.avatar} />
                    <AvatarFallback>{editedUser.name ? editedUser.name.charAt(0) : 'U'}</AvatarFallback>
                  </Avatar>
                  {isEditingProfile && (
                    <div className="absolute bottom-0 right-0 flex gap-1">
                      <label htmlFor="avatar-upload" className="cursor-pointer bg-primary text-primary-foreground rounded-full p-1.5 shadow-sm hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                      {editedUser.avatar && (
                        <button onClick={handleRemoveAvatar} className="bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-sm hover:bg-destructive/90 transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="col-span-3"
                  readOnly={!isEditingProfile}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="col-span-3"
                  readOnly={!isEditingProfile}
                />
              </div>
            </div>
            <DialogFooter>
              {isEditingProfile ? (
                <Button onClick={handleProfileSave}>Save changes</Button>
              ) : (
                <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Results Modal */}
        {selectedDocument && processingResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Extracted Data</h2>
                    <p className="text-gray-600">{selectedDocument.filename}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      Accuracy: {processingResult.accuracy}%
                    </Badge>
                    <Badge variant="secondary">
                      {processingResult.processingTime}s
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDocument(null)
                        setProcessingResult(null)
                      }}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6 overflow-auto max-h-[60vh]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button onClick={() => handleExport('csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" onClick={() => handleExport('excel')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                          Save Changes
                        </Button>
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => {
                        setEditedData(processingResult.data)
                        setIsEditing(true)
                      }}>
                        Edit Data
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {processingResult.columns.map((col, index) => (
                          <TableHead key={index}>{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(isEditing ? editedData : processingResult.data).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {processingResult.columns.map((col, colIndex) => (
                            <TableCell key={colIndex}>
                              {isEditing ? (
                                <Input
                                  value={row[col] || ''}
                                  onChange={(e) => handleEditChange(rowIndex, col, e.target.value)}
                                  className="h-8"
                                />
                              ) : (
                                String(row[col] || '')
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}