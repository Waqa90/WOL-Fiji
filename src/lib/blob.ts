import { put, del } from '@vercel/blob'

/**
 * Upload a file to Vercel Blob storage
 * @param file File object from form input
 * @param folder Folder path in blob storage (e.g., 'musicians', 'assets')
 * @returns URL of the uploaded file
 */
export async function uploadToBlob(file: File, folder: string): Promise<string> {
  try {
    const filename = `${folder}/${Date.now()}-${file.name}`
    const blob = await put(filename, file, {
      access: 'public',
    })
    return blob.url
  } catch (error) {
    console.error('Blob upload failed:', error)
    throw new Error('Failed to upload file to storage')
  }
}

/**
 * Delete a file from Vercel Blob storage
 * @param url Full URL of the blob file
 */
export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url)
  } catch (error) {
    console.error('Blob delete failed:', error)
    throw new Error('Failed to delete file from storage')
  }
}
