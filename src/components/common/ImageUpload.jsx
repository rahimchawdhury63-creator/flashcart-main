// ImageUpload.jsx — Image picker that uploads to ImgBB and returns the hosted URL.
import React, { useState, useRef } from 'react'
import { uploadImage } from '../../utils/imgbb'
import { IconPlus } from '../svgs'
import toast from 'react-hot-toast'

/**
 * @param {string} value - current image URL (preview)
 * @param {(url:string)=>void} onUploaded - called with hosted URL after upload
 * @param {string} label
 */
export default function ImageUpload({ value, onUploaded, label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  // Handle file selection -> upload -> report URL.
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onUploaded?.(url)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? <span className="spinner" /> : <IconPlus size={18} />}
        {uploading ? 'Uploading...' : label}
      </button>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      {value && (
        <img
          src={value}
          alt="Uploaded preview"
          className="mt-2"
          style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 'var(--radius-btn)', display: 'block' }}
        />
      )}
    </div>
  )
}
