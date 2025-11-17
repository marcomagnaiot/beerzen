import axios from 'axios'
import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api'

const api = axios.create({
  baseURL: API_URL,
})

// Add auth token to all requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Contacts API
export const contactsAPI = {
  getAll: () => api.get('/contacts'),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (contact) => api.post('/contacts', contact),
  update: (id, contact) => api.put(`/contacts/${id}`, contact),
  delete: (id) => api.delete(`/contacts/${id}`),
}

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default api
