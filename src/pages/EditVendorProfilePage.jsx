import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { perfilService } from '../services/perfilService';
import { DataInconsistencyModal } from '../components/modals/DataInconsistencyModal';
import { UserAlreadyExistsModal } from '../components/modals/UserAlreadyExistsModal';
import { ServerErrorModal } from '../components/modals/ServerErrorModal';

/**
 * UI-14: Pantalla de modificación de perfil para Vendedor.
 * - Pre-carga los datos del usuario autenticado via GET /api/perfil/me.
 * - Formulario en grilla de 2 columnas con resaltado dinámico de campos inválidos.
 * - Manejo completo de errores de la API REST del CU-04.
 * - Acceso exclusivo para rol "Vendedor" (guard en App.jsx via ProtectedRoute).
 */
export const EditVendorProfilePage = () => {
  const navigate = useNavigate();

  // Estado del formulario — nombres exactos del DTO del backend
  const [formData, setFormData] = useState({
    unombre: '',
    uapellido: '',
    vtelefono: '',
    uemail: '',
    nuevaContrasenna: '',
  });

  // Lista de campos con error devueltos por la API
  // Lista de campos con error devueltos por la API
  const [invalidFields, setInvalidFields] = useState([]);
  const [showPassword, setShowPassword] = useState(false);


  // Modal activo: 'DATA_INCONSISTENCY' | 'USER_ALREADY_EXISTS' | 'SERVER_ERROR' | null
  const [activeModal, setActiveModal] = useState(null);

  // Estado de carga para bloquear el botón durante la petición
  const [isLoading, setIsLoading] = useState(false);

  // Estado de carga inicial del perfil
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // ─── Pre-carga de datos al montar el componente ───────────────────────────
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfil = await perfilService.obtenerPerfilMe();
        setFormData({
          unombre: perfil.unombre || '',
          uapellido: perfil.uapellido || '',
          vtelefono: perfil.vtelefono || '',
          uemail: perfil.uemail || '',
          nuevaContrasenna: '',
        });
      } catch (error) {
        const status = error?.response?.status;
        const errorCode = error?.response?.data?.errorCode;

        if (status === 403 || status === 401 || errorCode === 'ACCESS_DENIED') {
          navigate('/login');
          return;
        }
        // Error de red o 500 — mostrar modal de error del servidor
        setActiveModal('SERVER_ERROR');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    cargarPerfil();
  }, [navigate]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => setActiveModal(null);

  /**
   * Devuelve el estilo de borde del input según si el campo está en la lista de errores.
   * @param {string} fieldName - Nombre exacto del campo DTO.
   */
  const getInputBorder = (fieldName) =>
    invalidFields.includes(fieldName)
      ? '2px solid #EF4444'
      : '1px solid #94A3B8';

  // ─── Manejo del envío del formulario ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setInvalidFields([]);
    setActiveModal(null);

    // Enviar null si el campo de contraseña está vacío
    const payload = {
      ...formData,
      nuevaContrasenna: formData.nuevaContrasenna.trim() === '' ? null : formData.nuevaContrasenna,
    };

    try {
      await perfilService.modificarPerfilVendedor(payload);
      // 204 No Content — camino feliz: redirigir al Home Vendedor (UI-05)
      navigate('/home-vendedor');
    } catch (error) {
      const status = error?.response?.status;
      const errorCode = error?.response?.data?.errorCode;
      const apiInvalidFields = error?.response?.data?.invalidFields || [];

      if (status === 403 || status === 401 || errorCode === 'ACCESS_DENIED') {
        navigate('/login');
        return;
      }

      if (status === 400) {
        if (errorCode === 'DATA_INCONSISTENCY') {
          setInvalidFields(apiInvalidFields);
          setActiveModal('DATA_INCONSISTENCY');
        } else if (errorCode === 'USER_ALREADY_EXISTS') {
          setInvalidFields(apiInvalidFields);
          setActiveModal('USER_ALREADY_EXISTS');
        }
      } else {
        // 500 u otro error inesperado
        setActiveModal('SERVER_ERROR');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Estilos ──────────────────────────────────────────────────────────────
  const styles = {
    page: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem 1rem',
      backgroundColor: '#CBD5E1',
    },
    card: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
      padding: '2.5rem 3rem',
      width: '100%',
      maxWidth: '700px',
      fontFamily: "'Nunito', sans-serif",
    },
    h1: {
      textAlign: 'center',
      color: '#4A7BB0',
      fontSize: '2rem',
      fontWeight: 800,
      marginBottom: '0.25rem',
    },
    h2: {
      textAlign: 'center',
      color: '#1E293B',
      fontSize: '1.4rem',
      fontWeight: 700,
      marginBottom: '0.5rem',
    },
    subtitle: {
      textAlign: 'center',
      color: '#334155',
      fontSize: '0.95rem',
      marginBottom: '2rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.25rem',
      marginBottom: '1.25rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontWeight: 600,
      fontSize: '0.88rem',
      color: '#334155',
      marginBottom: '0.4rem',
    },
    passwordRow: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    passwordGroup: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '340px',
    },
    labelCenter: {
      fontWeight: 600,
      fontSize: '0.88rem',
      color: '#334155',
      marginBottom: '0.4rem',
      textAlign: 'center',
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'center',
    },
    submitBtn: {
      backgroundColor: '#4A7BB0',
      color: '#1E293B',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem 3rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      fontFamily: "'Nunito', sans-serif",
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    loadingMsg: {
      textAlign: 'center',
      color: '#334155',
      fontSize: '1rem',
      padding: '2rem',
    },
  };

  const inputStyle = (fieldName) => ({
    border: getInputBorder(fieldName),
    borderRadius: '8px',
    padding: '0.65rem 1rem',
    fontSize: '1rem',
    fontFamily: "'Nunito', sans-serif",
    color: '#334155',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s ease',
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Encabezado */}
        <h1 style={styles.h1}>MendoHard</h1>
        <h2 style={styles.h2}>Modificar Perfil</h2>
        <p style={styles.subtitle}>Modifique los datos deseados</p>

        {isLoadingProfile ? (
          <p style={styles.loadingMsg}>Cargando datos del perfil...</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Fila 1: Nombre | Apellido */}
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label htmlFor="unombre" style={styles.label}>
                  Modificar el Nombre
                </label>
                <input
                  id="unombre"
                  type="text"
                  name="unombre"
                  value={formData.unombre}
                  onChange={handleChange}
                  style={inputStyle('unombre')}
                  autoComplete="given-name"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="uapellido" style={styles.label}>
                  Modificar el Apellido
                </label>
                <input
                  id="uapellido"
                  type="text"
                  name="uapellido"
                  value={formData.uapellido}
                  onChange={handleChange}
                  style={inputStyle('uapellido')}
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Fila 2: Teléfono | Email */}
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label htmlFor="vtelefono" style={styles.label}>
                  Modificar el Telefono
                </label>
                <input
                  id="vtelefono"
                  type="tel"
                  name="vtelefono"
                  value={formData.vtelefono}
                  onChange={handleChange}
                  style={inputStyle('vtelefono')}
                  autoComplete="tel"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="uemail" style={styles.label}>
                  Modificar el Email
                </label>
                <input
                  id="uemail"
                  type="email"
                  name="uemail"
                  value={formData.uemail}
                  onChange={handleChange}
                  style={inputStyle('uemail')}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Fila 3: Contraseña (centrada, ancho parcial) */}
            <div style={styles.passwordRow}>
              <div style={styles.passwordGroup}>
                <label htmlFor="nuevaContrasenna" style={styles.labelCenter}>
                  En caso de querer (opcional), ingrese nueva Contraseña
                </label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    id="nuevaContrasenna"
                    type={showPassword ? "text" : "password"}
                    name="nuevaContrasenna"
                    value={formData.nuevaContrasenna}
                    onChange={handleChange}
                    style={{ ...inputStyle('nuevaContrasenna'), paddingRight: '2.5rem' }}
                    autoComplete="new-password"
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

            {/* Botón Registrar */}
            <div style={styles.buttonRow}>
              <button
                id="btn-registrar-perfil-vendedor"
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.submitBtn,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? 'Guardando...' : 'Registrar'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Modales de error */}
      <DataInconsistencyModal
        isOpen={activeModal === 'DATA_INCONSISTENCY'}
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
    </div>
  );
};
