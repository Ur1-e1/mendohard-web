import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inhabilitarService } from '../../services/inhabilitarService';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

export const DisableVendorPage = () => {
  const navigate = useNavigate();
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isDataInconsistencyModalOpen, setIsDataInconsistencyModalOpen] = useState(false);
  const [isResourceNotFoundModalOpen, setIsResourceNotFoundModalOpen] = useState(false);
  const [isServerErrorModalOpen, setIsServerErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchVendedores();
  }, []);

  const fetchVendedores = async () => {
    try {
      setLoading(true);
      const data = await inhabilitarService.getVendedoresActivos();
      setVendedores(data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionar = async (uCodigo) => {
    try {
      await inhabilitarService.inhabilitarVendedor(uCodigo);
      // Redirigir si éxito (204)
      navigate('/usuarios/inhabilitar');
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const status = error.response.status;
      const errorCode = error.response.data?.errorCode;
      const message = error.response.data?.message;

      if (status === 400 && errorCode === 'DATA_INCONSISTENCY') {
        setErrorMessage(message || 'Datos ingresados no validos');
        setIsDataInconsistencyModalOpen(true);
      } else if (status === 404 && errorCode === 'RESOURCE_NOT_FOUND') {
        setErrorMessage(message || 'El usuario seleccionado no existe o ya se encuentra inhabilitado.');
        setIsResourceNotFoundModalOpen(true);
      } else if (status >= 500) {
        setIsServerErrorModalOpen(true);
      } else if (status === 401 || status === 403) {
        // Manejado por api.js
      } else {
        setIsServerErrorModalOpen(true);
      }
    } else {
      setIsServerErrorModalOpen(true);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#CBD5E1',
      fontFamily: 'Nunito, sans-serif',
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '2rem',
        width: '100%',
        maxWidth: '800px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{
          color: '#334155',
          margin: '0 0 0.5rem 0',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          MendoHard
        </h1>
        
        <h2 style={{
          color: '#334155',
          margin: '0 0 1.5rem 0',
          fontSize: '1.25rem',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Inhabilitar Usuario
        </h2>
        
        <p style={{
          color: '#334155',
          margin: '0 0 2rem 0',
          fontSize: '1rem',
          textAlign: 'center'
        }}>
          Seleccionar un Vendedor a inhabilitar
        </p>

        {loading ? (
          <p style={{ color: '#334155' }}>Cargando vendedores...</p>
        ) : vendedores.length === 0 ? (
          <p style={{ color: '#334155', fontWeight: 'bold' }}>No hay vendedores activos para inhabilitar.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            {vendedores.map((vendedor) => (
              <div key={vendedor.uCodigo} style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                backgroundColor: '#F8FAFC'
              }}>
                {/* Fila 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1E293B', fontWeight: 'bold' }}>
                  <span>{vendedor.uNombre} {vendedor.uApellido}</span>
                  <span>Teléfono: {vendedor.vTelefono}</span>
                </div>
                {/* Fila 2 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#334155', fontSize: '0.9rem' }}>
                  <span>Cuil: {vendedor.vCuit}</span>
                  <span>Razón social: {vendedor.vRazonSocial}</span>
                  <span>Categoría fiscal: {vendedor.vCategoriaFiscal}</span>
                </div>
                {/* Fila 3 */}
                <div style={{ color: '#334155', fontSize: '0.9rem' }}>
                  Email: {vendedor.uEmail}
                </div>
                
                {/* Botón */}
                <button
                  onClick={() => handleSeleccionar(vendedor.uCodigo)}
                  style={{
                    marginTop: '0.5rem',
                    backgroundColor: '#4A7BB0',
                    color: '#1E293B',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    alignSelf: 'flex-end'
                  }}
                >
                  Seleccionar
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/usuarios/inhabilitar')}
          style={{
            marginTop: '1.5rem',
            background: 'none',
            border: 'none',
            color: '#4A7BB0',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Volver atrás
        </button>
      </div>

      <DataInconsistencyModal 
        isOpen={isDataInconsistencyModalOpen} 
        onClose={() => setIsDataInconsistencyModalOpen(false)} 
      />
      <ResourceNotFoundModal 
        isOpen={isResourceNotFoundModalOpen} 
        onClose={() => setIsResourceNotFoundModalOpen(false)} 
        message={errorMessage} 
      />
      <ServerErrorModal 
        isOpen={isServerErrorModalOpen} 
        onClose={() => setIsServerErrorModalOpen(false)} 
      />
    </div>
  );
};
