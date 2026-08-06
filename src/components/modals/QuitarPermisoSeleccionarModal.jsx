import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gestionarRolesService } from '../../services/gestionarRolesService';
import { DataInconsistencyModal } from './DataInconsistencyModal';
import { ServerErrorModal } from './ServerErrorModal';

export const QuitarPermisoSeleccionarModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rCodigo = location.state?.rCodigo;

  const [permisos, setPermisos] = useState([]);
  const [selectedPermiso, setSelectedPermiso] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);
  const [showDataInconsistency, setShowDataInconsistency] = useState(false);
  const [showServerError, setShowServerError] = useState(false);
  const [isInitialError, setIsInitialError] = useState(false);

  useEffect(() => {
    if (!rCodigo) {
      navigate('/gestionar-roles/quitar', { replace: true });
      return;
    }
    const fetchPermisos = async () => {
      try {
        const data = await gestionarRolesService.getPermisosByRol(rCodigo);
        setPermisos(data);
      } catch (error) {
        console.error('Error fetching permisos del rol', error);
        setIsInitialError(true);
        if (error.response?.data?.errorCode === 'DATA_INCONSISTENCY') {
          setShowDataInconsistency(true);
        } else {
          setShowServerError(true);
        }
      }
    };
    fetchPermisos();
  }, [rCodigo, navigate]);

  const handleQuitar = async () => {
    if (!selectedPermiso) {
      setInvalidFields(['PCodigo']);
      return;
    }

    try {
      await gestionarRolesService.quitarPermiso(rCodigo, selectedPermiso);
      navigate('/gestionar-roles', { replace: true });
    } catch (error) {
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.errorCode === 'DATA_INCONSISTENCY') {
          setIsInitialError(false);
          if (data.invalidFields && data.invalidFields.includes('PCodigo')) {
            setInvalidFields(['PCodigo']);
          } else {
            setShowDataInconsistency(true);
          }
        } else {
          console.error('Error quitando permiso:', error);
        }
      }
    }
  };

  const handleClose = () => {
    navigate('/gestionar-roles', { replace: true });
  };

  const handleDataInconsistencyClose = () => {
    setShowDataInconsistency(false);
    if (isInitialError) {
      navigate('/gestionar-roles', { replace: true });
    }
  };

  const handleServerErrorClose = () => {
    setShowServerError(false);
    navigate('/gestionar-roles', { replace: true });
  };

  const isInvalid = invalidFields.includes('PCodigo');

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
            Quitar Permiso
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem' }}>
            <label style={{ marginBottom: '0.5rem', color: '#1E293B', fontWeight: 'bold' }}>Seleccionar un Permiso:</label>
            <select
              value={selectedPermiso}
              onChange={(e) => {
                setSelectedPermiso(e.target.value);
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
              <option value="">Permiso</option>
              {permisos.map(permiso => (
                <option key={permiso.PCodigo} value={permiso.PCodigo}>{permiso.PNombre}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleQuitar}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 'bold', backgroundColor: '#4A7BB0', color: '#1E293B', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Quitar
          </button>
        </div>
      </div>

      <DataInconsistencyModal isOpen={showDataInconsistency} onClose={handleDataInconsistencyClose} />
      <ServerErrorModal isOpen={showServerError} onClose={handleServerErrorClose} />
    </>
  );
};
