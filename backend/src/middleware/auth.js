import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' })
    }

    const token = authHeader.split(' ')[1]

    if (!JWT_SECRET) {
      console.error('SUPABASE_JWT_SECRET is not configured')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Attach user info to request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
    }

    next()
  } catch (error) {
    console.error('Auth error:', error)

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }

    return res.status(401).json({ error: 'Authentication failed' })
  }
}
