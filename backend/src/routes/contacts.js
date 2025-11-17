import express from 'express'
import { supabaseAdmin } from '../config/supabase.js'

const router = express.Router()

// Get all contacts for the authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ error: 'Error fetching contacts' })
  }
})

// Get single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Contact not found' })
      }
      throw error
    }

    res.json(data)
  } catch (error) {
    console.error('Error fetching contact:', error)
    res.status(500).json({ error: 'Error fetching contact' })
  }
})

// Create new contact
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id
    const contactData = {
      ...req.body,
      user_id: userId,
    }

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert([contactData])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error('Error creating contact:', error)
    res.status(500).json({ error: 'Error creating contact' })
  }
})

// Update contact
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // First check if contact exists and belongs to user
    const { data: existing } = await supabaseAdmin
      .from('contacts')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (!existing) {
      return res.status(404).json({ error: 'Contact not found' })
    }

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .update(req.body)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('Error updating contact:', error)
    res.status(500).json({ error: 'Error updating contact' })
  }
})

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const { error } = await supabaseAdmin
      .from('contacts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact:', error)
    res.status(500).json({ error: 'Error deleting contact' })
  }
})

export default router
