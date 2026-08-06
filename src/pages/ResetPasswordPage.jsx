import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { recuperarCredencialService } from '../services/recuperarCredencialService';
import { DataInconsistencyModal } from '../components/modals/DataInconsistencyModal';
import { PasswordMismatchModal } from '../components/modals/PasswordMismatchModal';
import { PasswordRestoredModal } from '../components/modals/PasswordRestoredModal';
import { OtpInvalidModal } from '../components/modals/OtpInvalidModal';
import { ServerErrorModal } from '../components/modals/ServerErrorModal';

/**
 * UI-16 — Pantalla: Restablecer Credencial.
 * CU-05, Paso 2: El usuario ingresa el código OTP y su nueva contraseña.
 * Ruta pública: /recuperar-credencial/restablecer
 * Requiere email en location.state (pasado desde UI-15).
 */
export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Email recibido desde UI-15 vía React Router state
  const email = location.state?.email || '';

  // Si no hay email en el state (acceso directo), redirigir a UI-15
  useEffect(() => {
    if (!email) {
      navigate('/recuperar-credencial', { replace: true });
    }
  }, [email, navigate]);

  // Estado del formulario
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmacionContrasena, setConfirmacionContrasena] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado de validación visual por campo
  const [invalidFields, setInvalidFields] = useState([]);

  // Estado de modales
  const [showDataInconsistencyModal, setShowDataInconsistencyModal] = useState(false);
  const [showPasswordMismatchModal, setShowPasswordMismatchModal] = useState(false);
  const [showPasswordRestoredModal, setShowPasswordRestoredModal] = useState(false);
  const [showOtpInvalidModal, setShowOtpInvalidModal] = useState(false);
  const [showServerErrorModal, setShowServerErrorModal] = useState(false);

  const isInvalid = (fieldName) => invalidFields.includes(fieldName);

  const inputStyle = (fieldName) => ({
    border: isInvalid(fieldName) ? '2px solid #EF4444' : '1px solid #94A3B8',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    fontFamily: 'Nunito, sans-serif',
    color: '#334155',
    outline: 'none',
    width: '100%',
    backgroundColor: '#FFFFFF',
    transition: 'border-color 0.2s ease'
  });

  const closeAllModals = () => {
    setShowDataInconsistencyModal(false);
    setShowPasswordMismatchModal(false);
    setShowServerErrorModal(false);
    // Nota: PasswordRestored y OtpInvalid tienen onClose con navegación (ver handlers)
  };

  const handlePasswordRestoredClose = () => {
    setShowPasswordRestoredModal(false);
    navigate('/login', { replace: true });
  };

  const handleOtpInvalidClose = () => {
    setShowOtpInvalidModal(false);
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Reset de errores previos
    setInvalidFields([]);
    closeAllModals();

    setIsLoading(true);

    try {
      await recuperarCredencialService.restablecerCredencial({
        email,
        codigoIngresado,
        nuevaContrasena,
        confirmacionContrasena,
      });

      // 200 OK — Contraseña restablecida con éxito
      setShowPasswordRestoredModal(true);

    } catch (error) {
      if (error.response && error.response.data) {
        const { errorCode, invalidFields: serverInvalidFields = [] } = error.response.data;
        const status = error.response.status;

        if (status === 400 && errorCode === 'DATA_INCONSISTENCY') {
          // Campos inválidos / faltantes — borde rojo en los campos indicados por el servidor
          setInvalidFields(serverInvalidFields);
          setShowDataInconsistencyModal(true);

        } else if (status === 400 && errorCode === 'PASSWORD_MISMATCH') {
          // Contraseñas no coinciden
          setInvalidFields(['nuevaContrasena', 'confirmacionContrasena']);
          setShowPasswordMismatchModal(true);

        } else if (status === 400 && errorCode === 'OTP_INVALID') {
          // OTP expirado, no existe en RAM, o superó los 3 intentos
          setShowOtpInvalidModal(true);

        } else if (status === 500) {
          setShowServerErrorModal(true);

        } else {
          // Cualquier otro error inesperado
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

  if (!email) return null; // Evitar render mientras ocurre el redirect

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
        maxWidth: '560px',
        fontFamily: 'Nunito, sans-serif'
      }}>
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
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
            marginBottom: '0.75rem',
            fontFamily: 'Nunito, sans-serif'
          }}>
            Restablecer Credencial
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#334155',
            lineHeight: '1.55',
            fontFamily: 'Nunito, sans-serif'
          }}>
            Si el correo electrónico ingresado corresponde a un usuario activo, se ha enviado un
            código de seguridad. Revise su bandeja de entrada e ingrese los datos correspondientes.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Fila 1: Grid 2 columnas — Código OTP + Nueva Contraseña */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            {/* Columna izquierda: Código OTP */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label
                htmlFor="reset-codigo"
                style={{
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#334155',
                  fontFamily: 'Nunito, sans-serif'
                }}
              >
                Ingrese el Código
              </label>
              <input
                id="reset-codigo"
                type="text"
                inputMode="numeric"
                value={codigoIngresado}
                onChange={(e) => setCodigoIngresado(e.target.value)}
                placeholder="123456"
                style={inputStyle('codigoIngresado')}
              />
            </div>

            {/* Columna derecha: Nueva Contraseña */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label
                htmlFor="reset-nueva-contrasena"
                style={{
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#334155',
                  fontFamily: 'Nunito, sans-serif'
                }}
              >
                Ingrese la Nueva Contraseña
              </label>
              <input
                id="reset-nueva-contrasena"
                type="password"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                placeholder="••••••••"
                style={inputStyle('nuevaContrasena')}
              />
            </div>
          </div>

          {/* Fila 2: Confirmación Contraseña — ancho completo */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem' }}>
            <label
              htmlFor="reset-confirmacion"
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                color: '#334155',
                fontFamily: 'Nunito, sans-serif'
              }}
            >
              Confirmación Contraseña
            </label>
            <input
              id="reset-confirmacion"
              type="password"
              value={confirmacionContrasena}
              onChange={(e) => setConfirmacionContrasena(e.target.value)}
              placeholder="••••••••"
              style={inputStyle('confirmacionContrasena')}
            />
          </div>

          {/* Botón Siguiente — centrado */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              id="reset-submit-btn"
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: '#4A7BB0',
                color: '#1E293B',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 2.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                fontFamily: 'Nunito, sans-serif',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'background-color 0.2s ease, transform 0.1s ease'
              }}
              onMouseEnter={(e) => { if (!isLoading) e.target.style.backgroundColor = '#3a638f'; }}
              onMouseLeave={(e) => { if (!isLoading) e.target.style.backgroundColor = '#4A7BB0'; }}
            >
              {isLoading ? 'Procesando...' : 'Siguiente'}
            </button>
          </div>
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

      {/* ===== MODALES ===== */}

      {/* UI-03: DATA_INCONSISTENCY */}
      <DataInconsistencyModal
        isOpen={showDataInconsistencyModal}
        onClose={closeAllModals}
      />

      {/* UI-09: PASSWORD_MISMATCH */}
      <PasswordMismatchModal
        isOpen={showPasswordMismatchModal}
        onClose={closeAllModals}
      />

      {/* UI-17: Contraseña restablecida con éxito → redirige a /login */}
      <PasswordRestoredModal
        isOpen={showPasswordRestoredModal}
        onClose={handlePasswordRestoredClose}
      />

      {/* UI-18: OTP inválido o expirado → redirige a /login */}
      <OtpInvalidModal
        isOpen={showOtpInvalidModal}
        onClose={handleOtpInvalidClose}
      />

      {/* Server Error: INTERNAL_SERVER_ERROR 500 */}
      <ServerErrorModal
        isOpen={showServerErrorModal}
        onClose={closeAllModals}
      />
    </div>
  );
};
