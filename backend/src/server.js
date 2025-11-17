import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { authMiddleware } from './middleware/auth.js'
import contactsRouter from './routes/contacts.js'
import uploadRouter from './routes/upload.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3030
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Middleware
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes (protected)
app.use('/api/contacts', authMiddleware, contactsRouter)
app.use('/api/upload', authMiddleware, uploadRouter)

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(frontendPath))

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🍺 Beerzen API running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Frontend URL: ${FRONTEND_URL}`)
})

export default app
