import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { contactsAPI } from '../services/api'
import ContactCard from '../components/ContactCard'
import ContactForm from '../components/ContactForm'
import './Dashboard.css'

function Dashboard({ session }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await contactsAPI.getAll()
      setContacts(response.data)
    } catch (error) {
      console.error('Error loading contacts:', error)
      setError('Error al cargar los contactos')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleAddContact = () => {
    setEditingContact(null)
    setShowForm(true)
  }

  const handleEditContact = (contact) => {
    setEditingContact(contact)
    setShowForm(true)
  }

  const handleDeleteContact = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este contacto?')) {
      return
    }

    try {
      await contactsAPI.delete(id)
      setContacts(contacts.filter((c) => c.id !== id))
    } catch (error) {
      console.error('Error deleting contact:', error)
      alert('Error al eliminar el contacto')
    }
  }

  const handleFormSubmit = async (contactData) => {
    try {
      if (editingContact) {
        const response = await contactsAPI.update(editingContact.id, contactData)
        setContacts(contacts.map((c) => (c.id === editingContact.id ? response.data : c)))
      } else {
        const response = await contactsAPI.create(contactData)
        setContacts([response.data, ...contacts])
      }
      setShowForm(false)
      setEditingContact(null)
    } catch (error) {
      console.error('Error saving contact:', error)
      throw error
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingContact(null)
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🍺 Beerzen</h1>
            <p className="user-email">{session?.user?.email}</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="contacts-header">
          <h2>Mis Contactos</h2>
          <button className="add-button" onClick={handleAddContact}>
            + Agregar Contacto
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        {showForm && (
          <div className="modal-overlay" onClick={handleFormCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <ContactForm
                contact={editingContact}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando contactos...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="empty-state">
            <p>📇</p>
            <h3>No tienes contactos aún</h3>
            <p>Agrega tu primer contacto para comenzar</p>
          </div>
        ) : (
          <div className="contacts-grid">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
