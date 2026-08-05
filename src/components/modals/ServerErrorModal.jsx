import React from 'react';

/**
 * Modal UI para errores de servidor (HTTP 500) o fallos de red.
 * Sigue el mismo sistema de diseño que los modales existentes del proyecto.
 * Props: { isOpen: boolean, onClose: () => void }
 */
export const ServerErrorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      {/* Tarjeta del Modal */}
      <div style={{
        backgroundColor: '#CBD5E1',
        border: '2px solid #1E293B',
        borderRadius: '1rem',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Botón de Cierre (X) */}
        <button
          onClick={onClose}
          id="server-error-modal-close"
          aria-label="Cerrar modal de error del servidor"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E293B',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#1E293B'
          }}
        >
          ✕
        </button>

        {/* Título */}
        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#1E293B',
          marginTop: '0.25rem',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          Error del Sistema
        </h2>

        {/* Mensaje */}
        <p style={{
          fontSize: '1rem',
          color: '#334155',
          marginBottom: '1.5rem',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Ocurrió un error interno en el servidor. Por favor, intente nuevamente más tarde.
        </p>

        {/* Botón Aceptar */}
        <button
          onClick={onClose}
          id="server-error-modal-accept"
          style={{
            backgroundColor: '#4A7BB0',
            border: '1px solid #1E293B',
            borderRadius: '8px',
            padding: '8px 28px',
            color: '#1E293B',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};
