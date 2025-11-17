import express from 'express'
import multer from 'multer'
import { supabaseAdmin, STORAGE_BUCKET } from '../config/supabase.js'

const router = express.Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

// Upload image to Supabase Storage
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const userId = req.user.id
    const file = req.file
    const fileExt = file.originalname.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName)

    res.json({
      message: 'File uploaded successfully',
      url: publicUrlData.publicUrl,
      path: data.path,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    res.status(500).json({ error: 'Error uploading file' })
  }
})

export default router
