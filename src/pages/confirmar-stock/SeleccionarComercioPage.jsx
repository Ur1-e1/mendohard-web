import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmarStockService } from '../../services/confirmarStockService';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

export const SeleccionarComercioPage = () => {
  const navigate = useNavigate();
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para modales de error
  const [showDataInconsistency, setShowDataInconsistency] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [showServerError, setShowServerError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchComercios = async () => {
      try {
        const data = await confirmarStockService.listarComerciosVendedor();
        setComercios(data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComercios();
  }, []);

  const handleApiError = (error) => {
    if (error.response && error.response.data) {
      const { errorCode, message } = error.response.data;
      setErrorMessage(message || 'Ha ocurrido un error inesperado.');
      
      if (errorCode === 'DATA_INCONSISTENCY' || error.response.status === 400) {
        setShowDataInconsistency(true);
      } else if (errorCode === 'RESOURCE_NOT_FOUND' || error.response.status === 404) {
        setShowNotFound(true);
      } else {
        setShowServerError(true);
      }
    } else {
      setErrorMessage('Error de conexión con el servidor.');
      setShowServerError(true);
    }
  };

  const handleSelect = (cCodigo) => {
    navigate(`/vendedor/comercios/${cCodigo}/consultas`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#CBD5E1',
      padding: '2rem',
      fontFamily: 'Nunito, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '2rem 3rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#4A7BB0', margin: 0, fontSize: '2rem', fontWeight: 800 }}>MendoHard</h1>
          <h2 style={{ color: '#1E293B', margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>Confirmar Stock</h2>
          <h3 style={{ color: '#64748B', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Seleccionar un Comercio</h3>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748B' }}>Cargando comercios...</p>
        ) : comercios.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748B' }}>No tienes comercios registrados.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {comercios.map(comercio => (
              <div key={comercio.cCodigo} style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#1E293B', fontSize: '1.25rem' }}>{comercio.cNombreFantasia}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem', color: '#475569' }}>
                  <div><strong>Teléfono:</strong> {comercio.cTelefono}</div>
                  <div><strong>Horario:</strong> {comercio.cHorarioAtencion}</div>
                  <div><strong>Dirección:</strong> {comercio.cDireccionCalle}</div>
                  <div><strong>Número:</strong> {comercio.cNumeroEnCalle}</div>
                  <div><strong>País:</strong> {comercio.pNombre}</div>
                  <div><strong>Provincia:</strong> {comercio.proNombre}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Departamento:</strong> {comercio.dNombre}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={() => handleSelect(comercio.cCodigo)}
                    style={{
                      backgroundColor: '#4A7BB0',
                      color: '#1E293B',
                      fontWeight: 'bold',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontFamily: 'Nunito, sans-serif'
                    }}
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDataInconsistency && (
        <DataInconsistencyModal
          isOpen={showDataInconsistency}
          message={errorMessage}
          onClose={() => setShowDataInconsistency(false)}
        />
      )}
      {showNotFound && (
        <ResourceNotFoundModal
          isOpen={showNotFound}
          message={errorMessage}
          onClose={() => {
            setShowNotFound(false);
            navigate(-1);
          }}
        />
      )}
      {showServerError && (
        <ServerErrorModal
          isOpen={showServerError}
          message={errorMessage}
          onClose={() => setShowServerError(false)}
        />
      )}
    </div>
  );
};
