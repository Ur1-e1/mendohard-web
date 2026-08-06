import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { recuperarCredencialService } from '../services/recuperarCredencialService';
import { DataInconsistencyModal } from '../components/modals/DataInconsistencyModal';
import { ServerErrorModal } from '../components/modals/ServerErrorModal';

/**
 * UI-15 — Pantalla: Solicitar Recuperación de Credencial.
 * CU-05, Paso 1: El usuario ingresa su email para recibir el código OTP.
 * Ruta pública: /recuperar-credencial
 */
export const RequestRecoveryPage = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado de validación visual
  const [emailInvalid, setEmailInvalid] = useState(false);

  // Estado de modales
  const [showDataInconsistencyModal, setShowDataInconsistencyModal] = useState(false);
  const [showServerErrorModal, setShowServerErrorModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Reset de errores previos
    setEmailInvalid(false);
    setShowDataInconsistencyModal(false);
    setShowServerErrorModal(false);

    setIsLoading(true);

    try {
      await recuperarCredencialService.solicitarRecuperacion(email);

      // 200 OK — Navegar a UI-16 pasando el email en el state de navegación
      navigate('/recuperar-credencial/restablecer', { state: { email } });

    } catch (error) {
      if (error.response && error.response.data) {
        const { errorCode } = error.response.data;

        // DATA_INCONSISTENCY (400): email inválido o vacío
        if (error.response.status === 400 && errorCode === 'DATA_INCONSISTENCY') {
          setEmailInvalid(true);
          setShowDataInconsistencyModal(true);
        } else if (error.response.status === 500) {
          // INTERNAL_SERVER_ERROR (500)
          setShowServerErrorModal(true);
        } else {
          // Cualquier otro error inesperado del servidor
          setShowServerErrorModal(true);
        }
      } else {
        // Error de red u otro error sin respuesta HTTP
        setShowServerErrorModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeModals = () => {
    setShowDataInconsistencyModal(false);
    setShowServerErrorModal(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#CBD5E1'
    }}>
      {/* Tarjeta principal */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
        padding: '2rem',
        width: '100%',
        maxWidth: '420px',
        fontFamily: 'Nunito, sans-serif'
      }}>
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h1 style={{
            color: '#4A7BB0',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '0.25rem',
            fontFamily: 'Nunito, sans-serif'
          }}>
            MendoHard
          </h1>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#334155',
            fontFamily: 'Nunito, sans-serif'
          }}>
            Recuperar Credencial
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#334155',
            marginTop: '0.75rem',
            lineHeight: '1.5',
            fontFamily: 'Nunito, sans-serif'
          }}>
            Ingrese el correo electrónico asociado a su cuenta para recibir un código de seguridad.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.25rem' }}>
            <label
              htmlFor="recovery-email"
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                color: '#334155',
                fontFamily: 'Nunito, sans-serif'
              }}
            >
              Ingrese su Email Registrado
            </label>
            <input
              id="recovery-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              style={{
                border: emailInvalid ? '2px solid #EF4444' : '1px solid #94A3B8',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                fontFamily: 'Nunito, sans-serif',
                color: '#334155',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => {
                if (!emailInvalid) e.target.style.borderColor = '#4A7BB0';
              }}
              onBlur={(e) => {
                if (!emailInvalid) e.target.style.borderColor = '#94A3B8';
              }}
            />
          </div>

          {/* Botón Siguiente */}
          <button
            id="recovery-submit-btn"
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#4A7BB0',
              color: '#1E293B',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              fontFamily: 'Nunito, sans-serif',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'background-color 0.2s ease, transform 0.1s ease',
              marginTop: '0.5rem'
            }}
            onMouseEnter={(e) => { if (!isLoading) e.target.style.backgroundColor = '#3a638f'; }}
            onMouseLeave={(e) => { if (!isLoading) e.target.style.backgroundColor = '#4A7BB0'; }}
          >
            {isLoading ? 'Enviando...' : 'Siguiente'}
          </button>
        </form>

        {/* Link de retorno */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/login"
            style={{
              fontSize: '0.875rem',
              color: '#4A7BB0',
              fontFamily: 'Nunito, sans-serif',
              textDecoration: 'underline'
            }}
          >
            Volver al Inicio de Sesión
          </Link>
        </div>
      </div>

      {/* Modales */}
      <DataInconsistencyModal
        isOpen={showDataInconsistencyModal}
        onClose={closeModals}
      />
      <ServerErrorModal
        isOpen={showServerErrorModal}
        onClose={closeModals}
      />
    </div>
  );
};
