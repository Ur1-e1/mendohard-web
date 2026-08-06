import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gestionarRolesService } from '../../services/gestionarRolesService';
import { ServerErrorModal } from './ServerErrorModal';
import { DataInconsistencyModal } from './DataInconsistencyModal';

export const AsignarPermisoModal = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [showServerError, setShowServerError] = useState(false);
  const [showDataInconsistency, setShowDataInconsistency] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await gestionarRolesService.getRolesActivos();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles', error);
        if (error.response?.data?.errorCode === 'DATA_INCONSISTENCY') {
          setShowDataInconsistency(true);
        } else {
          setShowServerError(true);
        }
      }
    };
    fetchRoles();
  }, []);

  const handleNext = () => {
    if (!selectedRol) {
      setInvalidFields(['RCodigo']);
      return;
    }
    setInvalidFields([]);
    navigate('/gestionar-roles/asignar/permiso', { state: { rCodigo: selectedRol }, replace: true });
  };

  const handleClose = () => {
    navigate('/gestionar-roles', { replace: true });
  };

  const handleInitialErrorClose = () => {
    navigate('/gestionar-roles', { replace: true });
  };

  const isInvalid = invalidFields.includes('RCodigo');

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#CBD5E1', fontFamily: 'Nunito' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <button onClick={handleClose} style={{
            position: 'absolute', top: '12px', right: '12px', backgroundColor: '#FFFFFF', border: '2px solid #1E293B', borderRadius: '4px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold', color: '#1E293B'
          }}>✕</button>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1E293B', marginBottom: '1.5rem', textAlign: 'center' }}>
            Asignar Permiso
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem' }}>
            <label style={{ marginBottom: '0.5rem', color: '#1E293B', fontWeight: 'bold' }}>Seleccionar un Rol:</label>
            <select 
              value={selectedRol}
              onChange={(e) => {
                setSelectedRol(e.target.value);
                if (e.target.value) setInvalidFields([]);
              }}
              style={{
                padding: '0.5rem',
                border: isInvalid ? '2px solid #EF4444' : '1px solid #94A3B8',
                borderRadius: '4px',
                fontFamily: 'Nunito',
                fontSize: '1rem',
                backgroundColor: '#FFFFFF',
                color: '#1E293B'
              }}
            >
              <option value="">Rol</option>
              {roles.map(rol => (
                <option key={rol.RCodigo} value={rol.RCodigo}>{rol.RNombre}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleNext}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 'bold', backgroundColor: '#4A7BB0', color: '#1E293B', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Siguiente
          </button>
        </div>
      </div>
      <ServerErrorModal isOpen={showServerError} onClose={handleInitialErrorClose} />
      <DataInconsistencyModal isOpen={showDataInconsistency} onClose={handleInitialErrorClose} />
    </>
  );
};
