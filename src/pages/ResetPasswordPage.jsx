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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="reset-nueva-contrasena"
                  type={showPassword ? "text" : "password"}
                  value={nuevaContrasena}
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle('nuevaContrasena'), paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem'
                  }}
                  tabIndex={-1}
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  )}
                </button>
              </div>
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
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                id="reset-confirmacion"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmacionContrasena}
                onChange={(e) => setConfirmacionContrasena(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle('confirmacionContrasena'), paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.25rem'
                }}
                tabIndex={-1}
                title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                )}
              </button>
            </div>
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
