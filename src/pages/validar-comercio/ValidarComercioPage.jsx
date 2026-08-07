import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarComercioService } from '../../services/validarComercioService';
import { ConfirmarValidacionModal } from '../../components/modals/ConfirmarValidacionModal';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

export const ValidarComercioPage = () => {
  const navigate = useNavigate();
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComercio, setSelectedComercio] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Modals state
  const [errorModal, setErrorModal] = useState({ type: null, message: '' });

  const fetchComercios = () => {
    setLoading(true);
    validarComercioService.consultarComerciosPendientes()
      .then((data) => {
        setComercios(data);
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchComercios();
  }, []);

  const handleError = (error) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.errorCode;
    const message = error.response?.data?.message || 'Ocurrió un error inesperado.';

    if (status === 400 || errorCode === 'DATA_INCONSISTENCY') {
      setErrorModal({ type: 'DATA_INCONSISTENCY', message });
    } else if (status === 404 || errorCode === 'RESOURCE_NOT_FOUND') {
      setErrorModal({ type: 'RESOURCE_NOT_FOUND', message });
    } else if (status === 500 || errorCode === 'INTERNAL_SERVER_ERROR') {
      setErrorModal({ type: 'INTERNAL_SERVER_ERROR', message });
    } else {
      console.error(error);
    }
  };

  const handleSelect = (comercio) => {
    setSelectedComercio(comercio);
    setShowConfirmModal(true);
  };

  const handleModalSuccess = () => {
    setShowConfirmModal(false);
    setSelectedComercio(null);
    fetchComercios(); // Refrescar lista
  };

  const handleModalError = (error) => {
    setShowConfirmModal(false);
    setSelectedComercio(null);
    handleError(error);
  };

  const closeErrorModal = () => {
    setErrorModal({ type: null, message: '' });
  };

  return (
    <div style={{ backgroundColor: '#CBD5E1', minHeight: '100vh', padding: '2rem', fontFamily: 'Nunito, sans-serif', display: 'flex', justifyContent: 'center' }}>
      
      {/* Contenedor Principal (Tarjeta MendoHard) */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        border: '1px solid #E2E8F0', 
        borderRadius: '1.5rem', 
        padding: '2rem', 
        width: '100%', 
        maxWidth: '900px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
      }}>
        
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#334155', fontWeight: 'bold', margin: 0, fontSize: '2.5rem' }}>MendoHard</h1>
          <h2 style={{ color: '#334155', fontWeight: 'normal', margin: '0.5rem 0' }}>Validar Comercio</h2>
          <div style={{ color: '#334155', fontSize: '1.2rem', marginBottom: '1rem' }}>Seleccionar un Comercio</div>
          <hr style={{ borderTop: '1px solid #334155', width: '50%', margin: '0 auto' }} />
        </div>

        {/* Lista de Comercios */}
        <div style={{ width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#334155' }}>Cargando...</div>
        ) : comercios.length === 0 ? (
          <div style={{ 
            backgroundColor: '#FFFFFF', padding: '2rem', textAlign: 'center', 
            borderRadius: '1rem', color: '#334155', border: '1px solid #E2E8F0' 
          }}>
            No hay comercios pendientes de validación.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {comercios.map(comercio => (
              <div key={comercio.cCodigo} style={{
                backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0',
                borderRadius: '1rem', padding: '1.5rem', display: 'flex',
                flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}>
                {/* Sección Superior (Datos del Vendedor) */}
                <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: '1.1rem' }}>Datos del Vendedor</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: '#475569', fontSize: '0.95rem' }}>
                    <div><strong>Vendedor:</strong> {comercio.uNombre} {comercio.uApellido}</div>
                    <div><strong>Teléfono:</strong> {comercio.vTelefono}</div>
                    <div><strong>Email:</strong> {comercio.uEmail}</div>
                    <div><strong>Cuil:</strong> {comercio.vCuit}</div>
                    <div><strong>Razón social:</strong> {comercio.vRazonSocial}</div>
                    <div><strong>Categoría fiscal:</strong> {comercio.vCategoriaFiscal}</div>
                  </div>
                </div>

                {/* Sección Inferior (Datos del Comercio) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: '1.1rem' }}>Datos del Comercio</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: '#475569', fontSize: '0.95rem' }}>
                      <div><strong>Comercio:</strong> {comercio.cNombreFantasia}</div>
                      <div><strong>Teléfono:</strong> {comercio.cTelefono}</div>
                      <div><strong>Latitud:</strong> {comercio.cLatitud}</div>
                      <div><strong>Longitud:</strong> {comercio.cLongitud}</div>
                      <div><strong>Fecha Solicitud:</strong> {comercio.cFechaSolicitud}</div>
                      <div><strong>Horario atención:</strong> {comercio.cHorarioAtencion}</div>
                      <div><strong>País:</strong> {comercio.pNombre}</div>
                      <div><strong>Provincia:</strong> {comercio.proNombre}</div>
                      <div><strong>Dirección Calle:</strong> {comercio.cDireccionCalle}</div>
                      <div><strong>Departamento:</strong> {comercio.dNombre}</div>
                      <div><strong>Numero:</strong> {comercio.cNumeroEnCalle}</div>
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleSelect(comercio)}
                      style={{
                        backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold',
                        border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px',
                        cursor: 'pointer', fontFamily: 'Nunito, sans-serif'
                      }}
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmarValidacionModal
          comercio={selectedComercio}
          onClose={() => { setShowConfirmModal(false); setSelectedComercio(null); }}
          onSuccess={handleModalSuccess}
          onError={handleModalError}
        />
      )}

      {errorModal.type === 'DATA_INCONSISTENCY' && (
        <DataInconsistencyModal 
          isOpen={true} 
          onClose={closeErrorModal} 
          message={errorModal.message} 
        />
      )}
      {errorModal.type === 'RESOURCE_NOT_FOUND' && (
        <ResourceNotFoundModal 
          isOpen={true} 
          onClose={closeErrorModal} 
          message={errorModal.message} 
        />
      )}
      {errorModal.type === 'INTERNAL_SERVER_ERROR' && (
        <ServerErrorModal 
          isOpen={true} 
          onClose={closeErrorModal} 
          message={errorModal.message} 
        />
      )}
    </div>
  );
};
