'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, Table, Download, Brain, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">StructifyAI</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="#features">Features</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="#how-it-works">How it Works</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Unstructured Data into
              <span className="text-blue-600"> Structured Insights</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Convert PDFs, text files, and CSVs into organized, analyzable data using advanced AI and NLP technologies. 
              Export seamlessly to Excel, CSV, or Google Sheets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <Link href="/dashboard">
                  <Upload className="mr-2 h-5 w-5" />
                  Start Converting
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <Link href="#demo">
                  <FileText className="mr-2 h-5 w-5" />
                  View Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Data Processing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to convert unstructured documents into actionable data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>AI-Powered Processing</CardTitle>
                <CardDescription>
                  Advanced natural language processing and machine learning for accurate data extraction
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <FileText className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Multi-Format Support</CardTitle>
                <CardDescription>
                  Process PDFs, text files, and CSVs with intelligent format detection and optimization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Table className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Smart Table Extraction</CardTitle>
                <CardDescription>
                  Automatically identify and extract tabular data with structure preservation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Download className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Multiple Export Options</CardTitle>
                <CardDescription>
                  Export to CSV, Excel, or directly to Google Sheets with customizable formatting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Real-time Processing</CardTitle>
                <CardDescription>
                  Watch your documents being processed with live progress updates and status indicators
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your data is processed securely with enterprise-grade encryption and privacy controls
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How StructifyAI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your documents in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Documents</h3>
              <p className="text-gray-600">
                Drag and drop your PDFs, text files, or CSVs into our secure upload interface
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Processing</h3>
              <p className="text-gray-600">
                Our AI analyzes the structure and extracts data with high accuracy and context understanding
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Export Results</h3>
              <p className="text-gray-600">
                Review and edit the extracted data, then export in your preferred format
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See StructifyAI in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the capabilities of our AI-powered data conversion platform
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="export">Export Options</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Document Processing Dashboard</CardTitle>
                  <CardDescription>
                    Manage your documents and track processing progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Recent Uploads</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded">
                          <span className="text-sm">financial_report.pdf</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded">
                          <span className="text-sm">customer_data.csv</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Processing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="processing" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>AI Processing Pipeline</CardTitle>
                  <CardDescription>
                    Advanced extraction with real-time progress tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Document Analysis</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data Extraction</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Structure Recognition</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="export" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>
                    Choose your preferred output format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      CSV Format
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Table className="h-6 w-6 mb-2" />
                      Excel Workbook
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Download className="h-6 w-6 mb-2" />
                      Google Sheets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who are saving hours of manual data entry with StructifyAI
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
              <Link href="/dashboard">
                Get Started Now
                <Upload className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">StructifyAI</h3>
              </div>
              <p className="text-sm">
                Transforming unstructured data into structured insights with AI-powered technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white">How it Works</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#documentation" className="hover:text-white">Documentation</Link></li>
                <li><Link href="#api" className="hover:text-white">API Reference</Link></li>
                <li><Link href="#contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 StructifyAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}