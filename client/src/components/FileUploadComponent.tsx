import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { useAppStore } from '../stores/appStore'
import { s3Service, lambdaService } from '../services/aws-services'

interface FileUploadComponentProps {
  projectId?: string
}

export function FileUploadComponent({ projectId }: FileUploadComponentProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { addDocument, updateDocument } = useAppStore()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      await uploadFile(file)
    }
  }, [projectId])

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true)
      
      // Upload to AWS S3
      const s3Upload = await s3Service.uploadDocument(file, projectId)
      
      // Create document record with AWS S3 details
      const documentData = {
        filename: file.name.replace(/\s+/g, '_'),
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        filePath: s3Upload.url,
        s3Key: s3Upload.key,
        status: 'processing' as const,
        processingProgress: 25,
        projectId: projectId
      }

      const documentId = addDocument(documentData)
      
      // Trigger AWS Lambda NLP processing
      const reader = new FileReader()
      reader.onload = async (e) => {
        const content = e.target?.result as string
        if (content) {
          try {
            const nlpResults = await lambdaService.invokeNLPAnalyzer(content)
            
            // Update document with NLP results
            updateDocument(documentId, {
              status: 'completed',
              processingProgress: 100,
              entities: nlpResults.entities,
              semanticTags: nlpResults.semanticTags,
              confidence: nlpResults.confidence,
              metadata: {
                sentiment: nlpResults.sentiment,
                processedAt: new Date().toISOString(),
                awsLambdaProcessed: true
              }
            })
            
            console.log(`AWS Processing Complete:`, {
              documentId,
              s3Key: s3Upload.key,
              entities: nlpResults.entities.length,
              confidence: nlpResults.confidence
            })
          } catch (error) {
            console.error('AWS Lambda processing failed:', error)
            updateDocument(documentId, {
              status: 'failed',
              processingProgress: 0
            })
          }
        }
      }
      reader.readAsText(file)
      
    } catch (error) {
      console.error('AWS S3 upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: isUploading
  })

  const getBorderColor = () => {
    if (isDragReject) return 'border-red-400'
    if (isDragActive) return 'border-blue-400'
    return 'border-gray-300'
  }

  const getBgColor = () => {
    if (isDragReject) return 'bg-red-50'
    if (isDragActive) return 'bg-blue-50'
    return ''
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${getBorderColor()} ${getBgColor()}`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop files here' : 'Upload Documents'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Drag and drop files or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports PDF, DOCX, TXT files up to 50MB
          </p>
        </div>
        {isUploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  )
}