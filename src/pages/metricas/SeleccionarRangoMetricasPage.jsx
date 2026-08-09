import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { metricasService } from '../../services/metricasService';
import { useAuth } from '../../context/AuthContext';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

export const SeleccionarRangoMetricasPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  
  // Modals state
  const [isDataInconsistencyOpen, setIsDataInconsistencyOpen] = useState(false);
  const [serverErrorType, setServerErrorType] = useState(null); // 'INTERNAL_SERVER_ERROR'
  const [serverErrorMessage, setServerErrorMessage] = useState('');

  const handleCloseModal = () => {
    navigate('/home-vendedor');
  };

  const handleNext = async () => {
    setInvalidFields([]);
    
    // Validación local básica
    const localInvalidFields = [];
    if (!fechaDesde) localInvalidFields.push('fechaDesde');
    if (!fechaHasta) localInvalidFields.push('fechaHasta');
    if (fechaDesde && fechaHasta && new Date(fechaDesde) > new Date(fechaHasta)) {
      localInvalidFields.push('fechaDesde', 'fechaHasta');
    }

    if (localInvalidFields.length > 0) {
      setInvalidFields(localInvalidFields);
      setIsDataInconsistencyOpen(true);
      return;
    }

    setLoading(true);
    try {
      const data = await metricasService.obtenerMetricas(fechaDesde, fechaHasta);
      // Navegamos pasando los datos por el state
      navigate('/vendedor/metricas/resultados', { state: { metricasData: data } });
    } catch (error) {
      const status = error.response?.status;
      const errorCode = error.response?.data?.errorCode;
      const invalidFieldsBackend = error.response?.data?.invalidFields || [];
      const message = error.response?.data?.message || 'Ocurrió un error inesperado.';

      if (status === 400 || errorCode === 'DATA_INCONSISTENCY') {
        setInvalidFields(invalidFieldsBackend.length > 0 ? invalidFieldsBackend : ['fechaDesde', 'fechaHasta']);
        setIsDataInconsistencyOpen(true);
      } else if (status === 403 || errorCode === 'ACCESS_DENIED') {
        logout();
        navigate('/login', { replace: true });
      } else if (status === 500 || errorCode === 'INTERNAL_SERVER_ERROR') {
        setServerErrorType('INTERNAL_SERVER_ERROR');
        setServerErrorMessage(message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(30, 41, 59, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div 
        className="card" 
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#CBD5E1', // Fondo de tarjeta modal
          border: '2px solid #1E293B',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // Sombra sutil
          position: 'relative',
          padding: '2.5rem'
        }}
      >
        {/* Botón Cierre (Cruz X) */}
        <button
          onClick={handleCloseModal}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '32px',
            height: '32px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #1E293B',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#1E293B'
          }}
          aria-label="Cerrar"
        >
          X
        </button>

        {/* Título Centrado */}
        <h2 style={{
          color: '#334155',
          textAlign: 'center',
          fontSize: '1.25rem',
          fontWeight: 600,
          marginTop: '1rem',
          marginBottom: '2rem',
          lineHeight: 1.5
        }}>
          Ingresar rango temporal para el análisis de métricas
        </h2>

        {/* Formulario */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          {/* Fecha Desde */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
            <label style={{ color: '#334155', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
              Fecha Desde
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: invalidFields.includes('fechaDesde') ? '2px solid #EF4444' : '1px solid #94A3B8',
                outline: 'none',
                fontFamily: 'Nunito, sans-serif'
              }}
            />
          </div>

          {/* Fecha Hasta */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
            <label style={{ color: '#334155', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
              Fecha Hasta
            </label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: invalidFields.includes('fechaHasta') ? '2px solid #EF4444' : '1px solid #94A3B8',
                outline: 'none',
                fontFamily: 'Nunito, sans-serif'
              }}
            />
          </div>
        </div>

        {/* Botón Principal Siguiente */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={loading}
            style={{
              backgroundColor: '#4A7BB0',
              color: '#1E293B',
              fontWeight: 'bold',
              padding: '0.75rem 3rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'Nunito, sans-serif',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Cargando...' : 'Siguiente'}
          </button>
        </div>
      </div>

      {/* Modales */}
      <DataInconsistencyModal
        isOpen={isDataInconsistencyOpen}
        onClose={() => setIsDataInconsistencyOpen(false)}
      />

      {serverErrorType === 'INTERNAL_SERVER_ERROR' && (
        <ServerErrorModal
          message={serverErrorMessage}
          onClose={() => setServerErrorType(null)}
        />
      )}
    </div>
  );
};
