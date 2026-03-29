'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Upload, Trash2, Copy, AlertCircle, FileText, Video, Image as ImageIcon, Loader } from 'lucide-react'
import { uploadToBlob, deleteFromBlob } from '@/lib/blob'

interface Asset {
  id: string
  file_name: string
  file_type: 'image' | 'video' | 'document'
  file_size: number
  file_url: string
  uploaded_by_name: string
  created_at: string
  is_public: boolean
  description?: string
}

export default function AssetsPage() {
  const { data: session } = useSession()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    fetchAssets()
  }, [filterType])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      setError(null)

      let url = '/api/assets'
      if (filterType !== 'all') {
        url += `?file_type=${filterType}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch assets')

      const data = await response.json()
      setAssets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assets')
    } finally {
      setLoading(false)
    }
  }

  const getFileType = (file: File): 'image' | 'video' | 'document' | null => {
    const type = file.type.split('/')[0]
    if (type === 'image') return 'image'
    if (type === 'video') return 'video'
    if (file.type === 'text/plain' || file.type === 'application/pdf') return 'document'
    return null
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const fileType = getFileType(file)

    if (!fileType) {
      setError('Invalid file type. Allowed: images, videos, text files, PDFs')
      return
    }

    try {
      setUploading(true)
      setError(null)

      // Upload to Vercel Blob
      const fileUrl = await uploadToBlob(file, 'assets')

      // Save to database
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_name: file.name,
          file_type: fileType,
          file_size: file.size,
          file_url: fileUrl,
          branch_id: (session?.user as any)?.branch_id,
          description: description || null,
          is_public: isPublic,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save asset')
      }

      setSuccess('Asset uploaded successfully!')
      setDescription('')
      setIsPublic(false)
      await fetchAssets()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload asset')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteAsset = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return

    try {
      setError(null)

      // Delete from database
      const response = await fetch(`/api/assets?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete asset')
      }

      setSuccess('Asset deleted successfully')
      await fetchAssets()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete asset')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setSuccess('URL copied to clipboard!')
    setTimeout(() => setSuccess(null), 2000)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-500" />
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />
      case 'document':
        return <FileText className="w-5 h-5 text-green-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">Asset Management</h1>
        <p className="text-gray-600">Upload and manage images, videos, and documents</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✓ {success}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-8 border-2 border-dashed border-primary/30 hover:border-primary/60 transition">
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-center w-full cursor-pointer group">
              <div className="text-center group-hover:text-primary transition">
                <Upload className="w-12 h-12 mx-auto mb-2 text-primary/50 group-hover:text-primary transition" />
                <p className="font-semibold text-neutral-800 mb-1">Drop files here or click to upload</p>
                <p className="text-sm text-gray-600">Supported: Images, Videos, Documents (PDF, TXT)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,.pdf,.txt"
                disabled={uploading}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="label-text mb-2">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this asset..."
              className="input-field"
            />
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-neutral-800 font-medium">Make this asset public</span>
            </label>
            <span className="text-xs text-gray-500">(Anyone can access via link)</span>
          </div>

          {uploading && (
            <div className="flex items-center justify-center gap-2 py-2">
              <Loader className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'image', 'video', 'document'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filterType === type
                ? 'bg-primary text-white shadow-lg'
                : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
            }`}
          >
            {type === 'all' ? 'All Assets' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <Upload className="w-8 h-8 text-primary" />
            </div>
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No assets found. Upload one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-neutral-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800">File</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800">Uploaded By</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(asset.file_type)}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate text-neutral-900">{asset.file_name}</p>
                          {asset.description && <p className="text-xs text-gray-500 truncate">{asset.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatFileSize(asset.file_size)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                        {asset.file_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{asset.uploaded_by_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(asset.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          asset.is_public
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {asset.is_public ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(asset.file_url)}
                          className="p-2 hover:bg-neutral-200 rounded transition text-gray-600"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id, asset.file_url)}
                          className="p-2 hover:bg-red-100 rounded transition text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
