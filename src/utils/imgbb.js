// imgbb.js — Image upload utility using the ImgBB API.
// All user-uploaded images (profile photos, store logos, item images, review photos)
// go through ImgBB and the returned URL is saved to Firestore.

// ImgBB credentials (free tier).
const IMGBB_API_KEY = 'fdbfbcfd3bc5189e50a50c574515298d'
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`

/**
 * Convert a File/Blob object into a base64 string (without the data URL prefix).
 * ImgBB expects the raw base64 payload, not a data URL.
 * @param {File|Blob} file
 * @returns {Promise<string>} base64 string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // reader.result looks like "data:image/png;base64,XXXX" — strip the prefix.
      const result = String(reader.result)
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

/**
 * Upload an image file to ImgBB and return the hosted URL.
 * Uses the base64 body format (NOT multipart) per project spec.
 * @param {File|Blob} file - the image file to upload
 * @returns {Promise<string>} the hosted image URL
 */
export async function uploadImage(file) {
  if (!file) throw new Error('No file provided for upload.')

  // Basic client-side validation.
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.')
  }
  // Limit to 5MB to keep uploads fast on mobile data.
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image too large. Maximum size is 5MB.')
  }

  const base64 = await fileToBase64(file)

  // ImgBB accepts form-encoded body with the base64 in the `image` field.
  const formData = new FormData()
  formData.append('image', base64)

  const response = await fetch(IMGBB_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Image upload failed. Please try again.')
  }

  const data = await response.json()
  if (!data?.success || !data?.data?.url) {
    throw new Error('Image upload returned an invalid response.')
  }

  // Return the direct image URL to be stored in Firestore.
  return data.data.url
}
