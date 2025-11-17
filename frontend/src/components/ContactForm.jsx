import { useState } from 'react'
import { uploadAPI } from '../services/api'
import './ContactForm.css'

function ContactForm({ contact, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: contact?.nombre || '',
    apellido: contact?.apellido || '',
    email: contact?.email || '',
    telefono: contact?.telefono || '',
    empresa: contact?.empresa || '',
    cargo: contact?.cargo || '',
    direccion: contact?.direccion || '',
    notas: contact?.notas || '',
    foto_tarjeta_url: contact?.foto_tarjeta_url || '',
  })

  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 5MB')
      return
    }

    try {
      setUploading(true)
      setError(null)
      const response = await uploadAPI.uploadImage(file)
      setFormData((prev) => ({
        ...prev,
        foto_tarjeta_url: response.data.url,
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      alert('Nombre y apellido son requeridos')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Error al guardar el contacto')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{contact ? 'Editar Contacto' : 'Nuevo Contacto'}</h2>
      </div>

      <div className="form-body">
        {error && (
          <div className="form-error">
            <p>{error}</p>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">
              Apellido <span className="required">*</span>
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="empresa">Empresa</label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cargo">Cargo</label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notas">Notas</label>
          <textarea
            id="notas"
            name="notas"
            rows="3"
            value={formData.notas}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="foto_tarjeta">Foto de Tarjeta</label>
          <div className="file-upload">
            {formData.foto_tarjeta_url && (
              <div className="image-preview">
                <img src={formData.foto_tarjeta_url} alt="Preview" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, foto_tarjeta_url: '' }))
                  }
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="file"
              id="foto_tarjeta"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading && <p className="upload-status">Subiendo imagen...</p>}
          </div>
        </div>
      </div>

      <div className="form-footer">
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="submit-button"
          disabled={submitting || uploading}
        >
          {submitting ? 'Guardando...' : contact ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}

export default ContactForm
