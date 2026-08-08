import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { consultasStockService } from '../../services/consultasStockService';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

// Fix para los iconos de leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const SpecificStorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pCodigo = location.state?.pCodigo;

  const [comercios, setComercios] = useState([]);
  const [selectedCommerce, setSelectedCommerce] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  if (!pCodigo) {
    return <Navigate to="/buscar-categoria" replace />;
  }

  useEffect(() => {
    const fetchComercios = async () => {
      try {
        const data = await consultasStockService.getComercios();
        setComercios(data);
      } catch (err) {
        handleError(err);
      }
    };
    fetchComercios();
  }, []);

  const handleError = (err) => {
    console.error("Error en la petición:", err);
    
    if (!err.response) {
      // Error de red, desconexión o servidor caído
      setErrorState('500');
      return;
    }

    const { status, data } = err.response;

    if (status === 401 || status === 403) {
      // Token expirado o acceso denegado -> Redirección inmediata
      navigate('/login', { replace: true });
    } else if (status === 400) {
      // DATA_INCONSISTENCY
      setErrorState('400');
      if (data?.invalidFields) {
        setInvalidFields(data.invalidFields);
      }
    } else if (status === 404) {
      // RESOURCE_NOT_FOUND
      setErrorState('404');
      setErrorMessage(data?.message || 'Recurso no encontrado');
    } else {
      // 500 INTERNAL_SERVER_ERROR o cualquier otro estado no controlado
      setErrorState('500');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelect = async () => {
    if (!selectedCommerce) return;
    setLoading(true);
    try {
      await consultasStockService.consultarStockEspecifico(pCodigo, selectedCommerce.CCodigo);
      // Al ser exitoso, redirigimos limpiamente a UI-46
      navigate(`/consultar-stock/mapa?pCodigo=${pCodigo}`, { replace: true });
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#CBD5E1', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '2rem' 
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '1200px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <button 
          onClick={handleBack}
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: '#334155'
          }}
        >
          ← Atrás
        </button>

        <h1 style={{ fontFamily: 'Nunito', color: '#334155', textAlign: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
          MendoHard
        </h1>
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 'bold', color: '#334155', textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
          Consultar Stock
        </h2>
        <h3 style={{ fontFamily: 'Nunito', color: '#334155', textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 'normal' }}>
          Seleccione un Comercio:
        </h3>

        <div style={{ display: 'flex', gap: '2rem', height: '500px' }}>
          {/* Map Column */}
          <div style={{ flex: 2, borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <MapContainer 
              center={[-32.89084, -68.82717]} // Mendoza center default
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {comercios.map((comercio) => (
                <Marker 
                  key={comercio.CCodigo} 
                  position={[comercio.CLatitud, comercio.CLongitud]}
                  icon={redIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedCommerce(comercio);
                    },
                  }}
                />
              ))}
            </MapContainer>
          </div>

          {/* Details Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
              border: '1px solid #E2E8F0', 
              borderRadius: '8px', 
              padding: '1.5rem',
              backgroundColor: '#F8FAFC',
              flex: 1
            }}>
              <h4 style={{ fontFamily: 'Nunito', color: '#334155', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.5rem' }}>
                Detalles del Comercio
              </h4>
              {selectedCommerce ? (
                <div style={{ fontFamily: 'Nunito', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p><strong>Nombre:</strong> {selectedCommerce.CNombreFantasia}</p>
                  <p><strong>Teléfono:</strong> {selectedCommerce.CTelefono}</p>
                  <p><strong>Calle:</strong> {selectedCommerce.CDireccionCalle}</p>
                  <p><strong>Numero:</strong> {selectedCommerce.CNumeroEnCalle}</p>
                  <p><strong>Horario:</strong> {selectedCommerce.CHorarioAtencion}</p>
                </div>
              ) : (
                <p style={{ fontFamily: 'Nunito', color: '#64748B', fontStyle: 'italic' }}>
                  Haga clic en un marcador rojo en el mapa para ver los detalles.
                </p>
              )}
            </div>

            <button 
              onClick={handleSelect}
              disabled={!selectedCommerce || loading}
              style={{
                backgroundColor: !selectedCommerce || loading ? '#94A3B8' : '#4A7BB0',
                color: !selectedCommerce || loading ? '#E2E8F0' : '#1E293B',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '4px',
                padding: '1rem',
                fontSize: '1.1rem',
                cursor: !selectedCommerce || loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Nunito'
              }}
            >
              {loading ? 'Consultando...' : 'Seleccionar'}
            </button>
          </div>
        </div>
      </div>

      <DataInconsistencyModal isOpen={errorState === '400'} onClose={() => setErrorState(null)} />
      <ResourceNotFoundModal isOpen={errorState === '404'} message={errorMessage} onClose={() => navigate(-1)} />
      <ServerErrorModal isOpen={errorState === '500'} onClose={() => navigate(-1)} />
    </div>
  );
};
