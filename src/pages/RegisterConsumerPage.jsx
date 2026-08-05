import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { DataInconsistencyModal } from '../components/modals/DataInconsistencyModal';
import { PasswordMismatchModal } from '../components/modals/PasswordMismatchModal';
import { UserAlreadyExistsModal } from '../components/modals/UserAlreadyExistsModal';

export const RegisterConsumerPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    CApodo: '',
    UNombre: '',
    UApellido: '',
    Contrasena: '',
    ConfirmacionContrasena: '',
    UEmail: ''
  });

  // Modals state
  const [showDataInconsistency, setShowDataInconsistency] = useState(false);
  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);
  const [showUserAlreadyExists, setShowUserAlreadyExists] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (invalidFields.includes(e.target.name)) {
      setInvalidFields(invalidFields.filter(f => f !== e.target.name));
    }
  };

  const getInputStyle = (fieldName) => ({
    width: '100%', 
    padding: '0.75rem', 
    borderRadius: '8px', 
    border: invalidFields.includes(fieldName) ? '2px solid #EF4444' : '1px solid #94A3B8', 
    color: '#334155', 
    boxSizing: 'border-box'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validar campos obligatorios en Frontend
    const emptyFields = Object.keys(formData).filter(key => !formData[key] || !formData[key].trim());

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields);
      setShowDataInconsistency(true);
      return;
    }

    // 2. Validar contraseñas
    if (formData.Contrasena !== formData.ConfirmacionContrasena) {
      setInvalidFields(['Contrasena', 'ConfirmacionContrasena']);
      setShowPasswordMismatch(true);
      return;
    }

    // 3. Enviar a la API
    try {
      await authService.registerConsumidor(formData);
      navigate('/login');
    } catch (error) {
      const errorCode = error.response?.data?.errorCode;
      const backendInvalidFields = error.response?.data?.invalidFields || error.invalidFields || [];
      
      if (error.response?.status === 400 && errorCode === 'PASSWORD_MISMATCH') {
        setInvalidFields(['Contrasena', 'ConfirmacionContrasena']);
        setShowPasswordMismatch(true);
      } else if (error.response?.status === 400 && errorCode === 'USER_ALREADY_EXISTS') {
        setInvalidFields(backendInvalidFields);
        setShowUserAlreadyExists(true);
      } else {
        setInvalidFields(backendInvalidFields);
        setShowDataInconsistency(true);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#CBD5E1', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', fontFamily: 'Nunito' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '600px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#1E293B', textAlign: 'center', marginBottom: '0.5rem', fontWeight: 'bold' }}>MendoHard</h1>
        <h2 style={{ color: '#334155', textAlign: 'center', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Registrarse</h2>
        <p style={{ color: '#334155', textAlign: 'center', marginBottom: '2rem' }}>Ingrese los datos correspondiente como comprador</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Fila 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar el Apodo</label>
            <input 
              type="text" 
              name="CApodo" 
              placeholder="Ej: JuaniHard" 
              value={formData.CApodo} 
              onChange={handleChange} 
              style={getInputStyle('CApodo')}
            />
          </div>

          {/* Fila 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar el Nombre</label>
              <input 
                type="text" 
                name="UNombre" 
                placeholder="Ej: Juan" 
                value={formData.UNombre} 
                onChange={handleChange} 
                style={getInputStyle('UNombre')}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar el Apellido</label>
              <input 
                type="text" 
                name="UApellido" 
                placeholder="Ej: Pérez" 
                value={formData.UApellido} 
                onChange={handleChange} 
                style={getInputStyle('UApellido')}
              />
            </div>
          </div>

          {/* Fila 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar la Contraseña</label>
              <input 
                type="password" 
                name="Contrasena" 
                placeholder="••••••••" 
                value={formData.Contrasena} 
                onChange={handleChange} 
                style={getInputStyle('Contrasena')}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar el Email</label>
              <input 
                type="email" 
                name="UEmail" 
                placeholder="ejemplo@correo.com" 
                value={formData.UEmail} 
                onChange={handleChange} 
                style={getInputStyle('UEmail')}
              />
            </div>
          </div>

          {/* Fila 4 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Confirmar Contraseña</label>
              <input 
                type="password" 
                name="ConfirmacionContrasena" 
                placeholder="••••••••" 
                value={formData.ConfirmacionContrasena} 
                onChange={handleChange} 
                style={getInputStyle('ConfirmacionContrasena')}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                style={{ backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', cursor: 'pointer', fontFamily: 'Nunito', fontSize: '1rem' }}
              >
                Registrar
              </button>
            </div>
          </div>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button onClick={() => navigate('/registrarse')} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Nunito' }}>
            Volver
          </button>
        </div>
      </div>

      <DataInconsistencyModal isOpen={showDataInconsistency} onClose={() => setShowDataInconsistency(false)} />
      <PasswordMismatchModal isOpen={showPasswordMismatch} onClose={() => setShowPasswordMismatch(false)} />
      <UserAlreadyExistsModal isOpen={showUserAlreadyExists} onClose={() => setShowUserAlreadyExists(false)} />
    </div>
  );
};
