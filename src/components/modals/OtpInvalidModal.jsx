import React from 'react';

/**
 * UI-18 — Modal: Código OTP inválido o expirado.
 * CU-05: Recuperar Credencial — Error OTP_INVALID (Status 400).
 * Ocurre cuando: OTP expiró (>10 min), no existe en RAM, o superó los 3 intentos.
 * Props:
 *   isOpen  {boolean} — controla visibilidad
 *   onClose {Function} — callback; el padre debe navegar a /login al llamarlo
 */
export const OtpInvalidModal = ({ isOpen, onClose }) => {
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
      {/* Tarjeta del modal — Design System MendoHard */}
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
        {/* Botón de cierre (X) — esquina superior derecha */}
        <button
          id="otp-invalid-modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
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
          Código de verificación inválido
        </h2>

        {/* Mensaje principal */}
        <p style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: '#1E293B',
          marginBottom: '1.5rem',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          El código de verificación ingresado es incorrecto o ha expirado.
        </p>

        {/* Botón Aceptar — centrado — redirige a /login (vía onClose del padre) */}
        <button
          id="otp-invalid-modal-accept"
          onClick={onClose}
          style={{
            backgroundColor: '#4A7BB0',
            border: '1px solid #1E293B',
            borderRadius: '8px',
            padding: '8px 32px',
            color: '#1E293B',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif'
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};
