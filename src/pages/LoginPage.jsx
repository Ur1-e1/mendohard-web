import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { DataInconsistencyModal } from '../components/modals/DataInconsistencyModal';
import { InvalidPasswordModal } from '../components/modals/InvalidPasswordModal';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  
  // States for error handling
  const [invalidFields, setInvalidFields] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  
  // Modals state
  const [showDataInconsistencyModal, setShowDataInconsistencyModal] = useState(false);
  const [showInvalidPasswordModal, setShowInvalidPasswordModal] = useState(false);
  const [fallidosCount, setFallidosCount] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getHomePathByRole = (rolNombre) => {
    switch (rolNombre) {
      case 'Consumidor':
        return '/home-consumidor';
      case 'Vendedor':
        return '/home-vendedor';
      case 'Responsable MendoHard':
        return '/home-responsable';
      default:
        return '/login';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const newInvalidFields = [];
    if (!email.trim()) newInvalidFields.push('email');
    if (!contraseña.trim()) newInvalidFields.push('contraseña');

    if (newInvalidFields.length > 0) {
      setInvalidFields(newInvalidFields);
      setShowDataInconsistencyModal(true);
      return;
    }

    // Reset errors before submit
    setInvalidFields([]);
    setShowDataInconsistencyModal(false);
    setShowInvalidPasswordModal(false);

    try {
      const response = await api.post('/auth/iniciar-sesion', { email, contraseña });

      // 200 OK - Exito
      login(response.data);
      
      const { rolNombre } = response.data;
      const from = location.state?.from?.pathname;
      const homePath = getHomePathByRole(rolNombre);
      navigate(from || homePath, { replace: true });
      
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        const errorCode = errorData.errorCode;
        const invalidFieldsArray = errorData.invalidFields || [];
        const extraData = errorData.extraData;

        // Caso 1: Validación de Datos / Inconsistencia
        if (error.response.status === 400 && errorCode === 'DATA_INCONSISTENCY') {
          setInvalidFields(invalidFieldsArray);
          setShowDataInconsistencyModal(true);
        }
        // Casos de INVALID_CREDENTIALS
        else if (error.response.status === 401 && errorCode === 'INVALID_CREDENTIALS') {
          if (!extraData || Object.keys(extraData).length === 0) {
            // Caso 2: Usuario/Email Incorrecto, Inactivo o Sin Permisos (invalidFields vacio, sin extraData)
            setInvalidFields(['email', 'contraseña']); // Marcar ambos campos según requerimiento
            setShowDataInconsistencyModal(true);
          } else if (invalidFieldsArray.includes('contraseña') && extraData && extraData.cantidad !== undefined) {
            // Caso 3: Contraseña Incorrecta con Intentos Fallidos
            setInvalidFields(['contraseña']); // Marcar solo contraseña
            setFallidosCount(extraData.cantidad);
            setShowInvalidPasswordModal(true);
          }
        }
        // Caso 4: Intentos Máximos Alcanzados
        else if (error.response.status === 400 && errorCode === 'MAX_LOGIN_ATTEMPTS_REACHED') {
          setInvalidFields(['email', 'contraseña']);
          setIsSubmitDisabled(true);
          setFallidosCount(10);
          setShowInvalidPasswordModal(true);
        }
      } else {
        // Error de red u otro error inesperado (fallback a algo básico para que no se rompa)
        console.error("Error al iniciar sesión", error);
        setInvalidFields(['email', 'contraseña']);
        setShowDataInconsistencyModal(true);
      }
    }
  };

  const closeModals = () => {
    setShowDataInconsistencyModal(false);
    setShowInvalidPasswordModal(false);
  };

  const isInvalid = (fieldName) => invalidFields.includes(fieldName);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--btn-primary)', marginBottom: '0.5rem' }}>MendoHard</h1>
          <h2 style={{ fontSize: '1.5rem' }}>Iniciar Sesión</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Ingresar el Email</label>
            <input 
              type="email"
              className={`form-input ${isInvalid('email') ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ingresar la Contraseña</label>
            <input 
              type="password"
              className={`form-input ${isInvalid('contraseña') ? 'is-invalid' : ''}`}
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="********"
            />
            <div style={{ textAlign: 'left', marginTop: '0.5rem' }}>
              <Link to="/recuperar-credencial" style={{ fontSize: '0.85rem' }}>
                ¿Se olvido la contraseña?
              </Link>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSubmitDisabled}
          >
            Ingresar
          </button>
        </form>

        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
          <Link to="/registrarse" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Registrarse
          </Link>
        </div>
      </div>

      <DataInconsistencyModal 
        isOpen={showDataInconsistencyModal} 
        onClose={closeModals} 
      />
      
      <InvalidPasswordModal 
        isOpen={showInvalidPasswordModal} 
        onClose={closeModals} 
        fallidos={fallidosCount} 
      />
    </div>
  );
};
