import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { consultasStockService } from '../../services/consultasStockService';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para actualizar el centro del mapa cuando cambia la posicion
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const ClosestStoresPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pCodigo = location.state?.pCodigo;

  const [position, setPosition] = useState({ lat: -32.89084, lng: -68.82717 });
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const markerRef = useRef(null);

  if (!pCodigo) {
    return <Navigate to="/buscar-categoria" replace />;
  }

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

  const handleNext = async () => {
    setLoading(true);
    setInvalidFields([]);
    try {
      await consultasStockService.consultarStockCercanos(pCodigo, position.lat, position.lng);
      navigate(`/consultar-stock/mapa?pCodigo=${pCodigo}`, { replace: true });
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  };

  const handleUseGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err);
          alert("No se pudo obtener la ubicación. Por favor, asegúrese de haber dado los permisos necesarios.");
        }
      );
    } else {
      alert("Su navegador no soporta geolocalización.");
    }
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );

  const hasMapError = invalidFields.includes('CSLatitudDemanda') || invalidFields.includes('CSLongitudDemanda');

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
        maxWidth: '800px',
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
          Seleccione una zona para consultar stock a los 5 Comercios mas cercanos
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleUseGeolocation}
              style={{
                backgroundColor: '#4A7BB0',
                color: '#1E293B',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontFamily: 'Nunito',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              Usar mi ubicación actual
            </button>
          </div>

          <div style={{ 
            height: '400px', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            border: hasMapError ? '2px solid #EF4444' : '1px solid #E2E8F0' 
          }}>
            <MapContainer 
              center={[position.lat, position.lng]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <ChangeView center={[position.lat, position.lng]} />
              <MapClickHandler onMapClick={(lat, lng) => setPosition({ lat, lng })} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker 
                draggable={true}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}
              />
            </MapContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={handleNext}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#94A3B8' : '#4A7BB0',
                color: loading ? '#E2E8F0' : '#1E293B',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '4px',
                padding: '1rem 3rem',
                fontSize: '1.1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Nunito',
                marginTop: '1rem'
              }}
            >
              {loading ? 'Consultando...' : 'Siguiente'}
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
