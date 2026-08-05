import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { responsableService } from '../services/responsableService';
import { DataInconsistencyModal } from '../components/modals/DataInconsistencyModal';
import { PasswordMismatchModal } from '../components/modals/PasswordMismatchModal';
import { UserAlreadyExistsModal } from '../components/modals/UserAlreadyExistsModal';
import { ServerErrorModal } from '../components/modals/ServerErrorModal';

/**
 * UI-12: Pantalla de registro de nuevo Responsable MendoHard.
 * Formulario en grilla de 2 columnas con resaltado dinámico de campos inválidos
 * y manejo completo de errores de la API REST.
 */
export const RegisterResponsablePage = () => {
  const navigate = useNavigate();

  // Estado del formulario — nombres de campo mapeados exactamente al DTO del backend
  const [formData, setFormData] = useState({
    uNombre: '',
    uApellido: '',
    uEmail: '',
    rmhLegajo: '',
    contrasenna: '',
    confirmacionContrasenna: '',
  });

  // Lista de nombres de campos con error devueltos por la API
  const [invalidFields, setInvalidFields] = useState([]);

  // Modal activo: 'DATA_INCONSISTENCY' | 'PASSWORD_MISMATCH' | 'USER_ALREADY_EXISTS' | 'SERVER_ERROR' | null
  const [activeModal, setActiveModal] = useState(null);

  // Estado de carga para bloquear el botón durante la petición
  const [isLoading, setIsLoading] = useState(false);

  // Helpers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => setActiveModal(null);

  /**
   * Devuelve el estilo de borde del input según si el campo está en la lista de errores.
   * @param {string} fieldName - Nombre del campo a evaluar.
   */
  const getInputBorder = (fieldName) =>
    invalidFields.includes(fieldName)
      ? '2px solid #EF4444'
      : '1px solid #94A3B8';

  // Manejo de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setInvalidFields([]);
    setActiveModal(null);

    try {
      await responsableService.registrarResponsable(formData);
      // 201 CREATED — redirigir al Home del Responsable
      navigate('/home-responsable');
    } catch (error) {
      const status = error?.response?.status;
      const errorCode = error?.response?.data?.errorCode;
      const apiInvalidFields = error?.response?.data?.invalidFields || [];

      if (status === 403 || errorCode === 'ACCESS_DENIED') {
        // Token expirado o sin permisos — redirigir a login
        navigate('/login');
        return;
      }

      if (status === 400) {
        if (errorCode === 'DATA_INCONSISTENCY') {
          setInvalidFields(apiInvalidFields);
          setActiveModal('DATA_INCONSISTENCY');
        } else if (errorCode === 'PASSWORD_MISMATCH') {
          setInvalidFields(['contrasenna', 'confirmacionContrasenna']);
          setActiveModal('PASSWORD_MISMATCH');
        } else if (errorCode === 'USER_ALREADY_EXISTS') {
          setInvalidFields(apiInvalidFields);
          setActiveModal('USER_ALREADY_EXISTS');
        } else {
          // 400 genérico inesperado — tratar como error de servidor
          setActiveModal('SERVER_ERROR');
        }
      } else {
        // 500, fallo de red u otro error no contemplado
        setActiveModal('SERVER_ERROR');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos reutilizables
  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '0.6rem 0.75rem',
    border: getInputBorder(fieldName),
    borderRadius: '0.5rem',
    backgroundColor: '#FFFFFF',
    fontSize: '0.95rem',
    fontFamily: 'Nunito, sans-serif',
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  });

  const labelStyle = {
    display: 'block',
    marginBottom: '0.3rem',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#334155',
  };

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  };

  return (
    <>
      {/* Canvas / Fondo de pantalla */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#CBD5E1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        fontFamily: 'Nunito, sans-serif',
      }}>
        {/* Tarjeta / Contenedor Principal */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '1rem',
          padding: '2.5rem 2rem',
          width: '100%',
          maxWidth: '720px',
          boxShadow: '0 4px 24px rgba(30, 41, 59, 0.10)',
        }}>
          {/* Encabezado */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#334155',
              margin: 0,
              lineHeight: 1.2,
            }}>
              MendoHard
            </h1>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#334155',
              margin: '0.4rem 0 0.5rem',
            }}>
              Registrar Nuevo Administrador
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748B',
              margin: 0,
            }}>
              Ingrese los datos correspondiente al nuevo Responsable MendoHard
            </p>
          </div>

          {/* Formulario en grilla de 2 columnas */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              {/* ===== COLUMNA IZQUIERDA ===== */}

              {/* uNombre */}
              <div style={fieldGroupStyle}>
                <label htmlFor="uNombre" style={labelStyle}>
                  Ingresar el Nombre
                </label>
                <input
                  id="uNombre"
                  name="uNombre"
                  type="text"
                  value={formData.uNombre}
                  onChange={handleChange}
                  placeholder="Ej: Carlos"
                  style={inputStyle('uNombre')}
                  autoComplete="given-name"
                />
              </div>

              {/* ===== COLUMNA DERECHA ===== */}

              {/* uApellido */}
              <div style={fieldGroupStyle}>
                <label htmlFor="uApellido" style={labelStyle}>
                  Ingresar el Apellido
                </label>
                <input
                  id="uApellido"
                  name="uApellido"
                  type="text"
                  value={formData.uApellido}
                  onChange={handleChange}
                  placeholder="Ej: Ramírez"
                  style={inputStyle('uApellido')}
                  autoComplete="family-name"
                />
              </div>

              {/* uEmail */}
              <div style={fieldGroupStyle}>
                <label htmlFor="uEmail" style={labelStyle}>
                  Ingresar el Email
                </label>
                <input
                  id="uEmail"
                  name="uEmail"
                  type="email"
                  value={formData.uEmail}
                  onChange={handleChange}
                  placeholder="Ej: carlos.ramirez@mendohard.com"
                  style={inputStyle('uEmail')}
                  autoComplete="email"
                />
              </div>

              {/* rmhLegajo */}
              <div style={fieldGroupStyle}>
                <label htmlFor="rmhLegajo" style={labelStyle}>
                  Ingresar el Legajo
                </label>
                <input
                  id="rmhLegajo"
                  name="rmhLegajo"
                  type="text"
                  value={formData.rmhLegajo}
                  onChange={handleChange}
                  placeholder="Ej: LEG-2025-001"
                  style={inputStyle('rmhLegajo')}
                  autoComplete="off"
                />
              </div>

              {/* contrasenna */}
              <div style={fieldGroupStyle}>
                <label htmlFor="contrasenna" style={labelStyle}>
                  Ingresar la Contraseña
                </label>
                <input
                  id="contrasenna"
                  name="contrasenna"
                  type="password"
                  value={formData.contrasenna}
                  onChange={handleChange}
                  placeholder="Ej: MiClave@Segura123"
                  style={inputStyle('contrasenna')}
                  autoComplete="new-password"
                />
              </div>

              {/* confirmacionContrasenna */}
              <div style={fieldGroupStyle}>
                <label htmlFor="confirmacionContrasenna" style={labelStyle}>
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmacionContrasenna"
                  name="confirmacionContrasenna"
                  type="password"
                  value={formData.confirmacionContrasenna}
                  onChange={handleChange}
                  placeholder="Ej: MiClave@Segura123"
                  style={inputStyle('confirmacionContrasenna')}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Botón Principal — centrado */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                id="btn-registrar-responsable"
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#7BA7CC' : '#4A7BB0',
                  border: '1px solid #1E293B',
                  borderRadius: '0.5rem',
                  padding: '0.65rem 3rem',
                  color: '#1E293B',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  fontFamily: 'Nunito, sans-serif',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease',
                  minWidth: '160px',
                }}
              >
                {isLoading ? 'Registrando...' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== MODALES ===== */}
      <DataInconsistencyModal
        isOpen={activeModal === 'DATA_INCONSISTENCY'}
        onClose={closeModal}
      />
      <PasswordMismatchModal
        isOpen={activeModal === 'PASSWORD_MISMATCH'}
        onClose={closeModal}
      />
      <UserAlreadyExistsModal
        isOpen={activeModal === 'USER_ALREADY_EXISTS'}
        onClose={closeModal}
      />
      <ServerErrorModal
        isOpen={activeModal === 'SERVER_ERROR'}
        onClose={closeModal}
      />
    </>
  );
};
