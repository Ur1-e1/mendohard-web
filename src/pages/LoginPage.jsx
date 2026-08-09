import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { DataInconsistencyModal } from '../components/modals/DataInconsistencyModal';
import { InvalidPasswordModal } from '../components/modals/InvalidPasswordModal';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // States for error handling
  const [invalidFields, setInvalidFields] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
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
    setLoginError('');
    setShowDataInconsistencyModal(false);
    setShowInvalidPasswordModal(false);
    setIsLoading(true);

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
        const { errorCode, invalidFields, extraData, message } = error.response.data;
        const invalidFieldsArray = invalidFields || [];

        if (errorCode === 'INVALID_CREDENTIALS' && extraData && extraData.cantidad !== undefined) {
          // Escenario A: Contraseña incorrecta (Email válido)
          setInvalidFields(invalidFieldsArray.length > 0 ? invalidFieldsArray : ['contraseña']);
          setFallidosCount(extraData.cantidad);
          setShowInvalidPasswordModal(true);
        } else if (errorCode === 'MAX_LOGIN_ATTEMPTS_REACHED') {
          // Escenario B: Máximo de intentos alcanzados
          setInvalidFields(['email', 'contraseña']);
          setIsSubmitDisabled(true);
          setFallidosCount(10);
          setShowInvalidPasswordModal(true);
        } else if (errorCode === 'INVALID_CREDENTIALS' && !extraData) {
          // Escenario C: Usuario Inhabilitado / Credenciales Inválidas Generales
          setInvalidFields(['email', 'contraseña']);
          setLoginError('Email o contraseña no válidos / Cuenta inhabilitada');
        } else if (error.response.status === 400 && errorCode === 'DATA_INCONSISTENCY') {
          // Otro posible error
          setInvalidFields(invalidFieldsArray);
          setShowDataInconsistencyModal(true);
        } else {
          console.error("Error al iniciar sesión", error);
          setInvalidFields(['email', 'contraseña']);
          setShowDataInconsistencyModal(true);
        }
      } else {
        console.error("Error de red", error);
        setInvalidFields(['email', 'contraseña']);
        setShowDataInconsistencyModal(true);
      }
    } finally {
      setIsLoading(false);
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
              style={isInvalid('email') ? { border: '2px solid #EF4444' } : {}}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ingresar la Contraseña</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"}
                className={`form-input ${isInvalid('contraseña') ? 'is-invalid' : ''}`}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingRight: '2.5rem',
                  ...(isInvalid('contraseña') ? { border: '2px solid #EF4444' } : {})
                }}
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="********"
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
            {loginError && (
              <div style={{ color: '#EF4444', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                {loginError}
              </div>
            )}
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
            disabled={isSubmitDisabled || isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
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
