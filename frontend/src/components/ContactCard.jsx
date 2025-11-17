import './ContactCard.css'

function ContactCard({ contact, onEdit, onDelete }) {
  const getInitials = () => {
    const first = contact.nombre?.charAt(0) || ''
    const last = contact.apellido?.charAt(0) || ''
    return (first + last).toUpperCase() || '?'
  }

  return (
    <div className="contact-card">
      <div className="card-header">
        {contact.foto_tarjeta_url ? (
          <img
            src={contact.foto_tarjeta_url}
            alt="Tarjeta"
            className="card-image"
          />
        ) : (
          <div className="card-avatar">{getInitials()}</div>
        )}
      </div>

      <div className="card-body">
        <h3 className="contact-name">
          {contact.nombre} {contact.apellido}
        </h3>

        {contact.empresa && (
          <p className="contact-empresa">
            <span className="icon">🏢</span>
            {contact.empresa}
            {contact.cargo && ` - ${contact.cargo}`}
          </p>
        )}

        {contact.email && (
          <p className="contact-detail">
            <span className="icon">📧</span>
            {contact.email}
          </p>
        )}

        {contact.telefono && (
          <p className="contact-detail">
            <span className="icon">📱</span>
            {contact.telefono}
          </p>
        )}

        {contact.direccion && (
          <p className="contact-detail">
            <span className="icon">📍</span>
            {contact.direccion}
          </p>
        )}

        {contact.notas && (
          <p className="contact-notes">
            <span className="icon">📝</span>
            {contact.notas}
          </p>
        )}
      </div>

      <div className="card-actions">
        <button className="edit-button" onClick={() => onEdit(contact)}>
          ✏️ Editar
        </button>
        <button className="delete-button" onClick={() => onDelete(contact.id)}>
          🗑️ Eliminar
        </button>
      </div>
    </div>
  )
}

export default ContactCard
