import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { consultasStockService } from '../../services/consultasStockService';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

// Función para crear un icono custom con SVG
const getCustomIcon = (color) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36" height="36" style="filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.3));">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

const getStockState = (ultimaConsulta) => {
  if (!ultimaConsulta || ultimaConsulta.ECSNombre === 'ConsultaExpirada') {
    return { color: '#64748B', label: 'A este comercio nadie le preguntó', bg: '#F1F5F9' }; // Gris
  }
  if (ultimaConsulta.ECSNombre === 'StockPendiente') {
    return { color: '#EAB308', label: 'Stock Pendiente', bg: '#FEF08A' }; // Amarillo/Naranja
  }
  if (ultimaConsulta.ECSNombre === 'SinStock') {
    return { color: '#EF4444', label: 'Sin Stock', bg: '#FECACA' }; // Rojo
  }
  if (ultimaConsulta.ECSNombre === 'StockDisponible') {
    const nsNombre = ultimaConsulta.NSNombre?.toLowerCase() || '';
    if (nsNombre === 'bajo' || nsNombre === 'poco') {
      return { color: '#F97316', label: 'Poco Stock', bg: '#FFEDD5' }; // Naranja
    }
    if (nsNombre === 'medio') {
      return { color: '#84CC16', label: 'Stock Medio', bg: '#ECFCCB' }; // Verde claro
    }
    // Alto, Mucho o null
    return { color: '#22C55E', label: 'Con Stock', bg: '#DCFCE7' }; // Verde intenso
  }
  return { color: '#64748B', label: 'Desconocido', bg: '#F1F5F9' };
};

export const StockMapPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pCodigo = searchParams.get('pCodigo');

  const [comercios, setComercios] = useState([]);
  const [selectedCommerce, setSelectedCommerce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);

  useEffect(() => {
    if (!pCodigo) {
      navigate('/buscar-categoria', { replace: true });
      return;
    }

    const fetchMapData = async () => {
      setLoading(true);
      try {
        const data = await consultasStockService.getMapaStock(pCodigo);
        setComercios(data);
      } catch (err) {
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
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [pCodigo, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const selectedState = selectedCommerce ? getStockState(selectedCommerce.ultimaConsulta) : null;

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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Nunito', color: '#64748B' }}>
            Cargando mapa de stock...
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '2rem', height: '600px' }}>
            {/* Map Column */}
            <div style={{ flex: 2, borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative' }}>
              <MapContainer 
                center={[-32.89084, -68.82717]} // Mendoza center default
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {comercios.map((item) => {
                  const comercioData = item.comercio || item;
                  const ultimaConsultaData = item.ultimaConsulta;
                  const stateInfo = getStockState(ultimaConsultaData);
                  const lat = Number(comercioData?.CLatitud);
                  const lng = Number(comercioData?.CLongitud);

                  if (isNaN(lat) || isNaN(lng)) return null;

                  return (
                    <Marker 
                      key={comercioData?.CCodigo || Math.random()} 
                      position={[lat, lng]}
                      icon={getCustomIcon(stateInfo.color)}
                      eventHandlers={{
                        click: () => setSelectedCommerce(item),
                      }}
                    >
                      <Popup>
                        <strong style={{ fontFamily: 'Nunito', color: '#334155' }}>
                          {comercioData?.CNombreFantasia}
                        </strong>
                        <br />
                        <span style={{ color: stateInfo.color, fontWeight: 'bold' }}>
                          {stateInfo.label}
                        </span>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Details Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
              <div style={{ 
                border: '1px solid #E2E8F0', 
                borderRadius: '8px', 
                padding: '1.5rem',
                backgroundColor: '#F8FAFC',
                flexShrink: 0
              }}>
                <h4 style={{ fontFamily: 'Nunito', color: '#334155', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.5rem' }}>
                  Detalles del Comercio
                </h4>
                {selectedCommerce ? (
                  <div style={{ fontFamily: 'Nunito', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p><strong>Nombre:</strong> {selectedCommerce.comercio?.CNombreFantasia || selectedCommerce.CNombreFantasia}</p>
                    <p><strong>Teléfono:</strong> {selectedCommerce.comercio?.CTelefono || selectedCommerce.CTelefono}</p>
                    <p><strong>Calle:</strong> {selectedCommerce.comercio?.CDireccionCalle || selectedCommerce.CDireccionCalle}</p>
                    <p><strong>Numero:</strong> {selectedCommerce.comercio?.CNumeroEnCalle || selectedCommerce.CNumeroEnCalle}</p>
                    <p><strong>Horario:</strong> {selectedCommerce.comercio?.CHorarioAtencion || selectedCommerce.CHorarioAtencion}</p>
                  </div>
                ) : (
                  <p style={{ fontFamily: 'Nunito', color: '#64748B', fontStyle: 'italic' }}>
                    Haga clic en un marcador en el mapa para ver los detalles.
                  </p>
                )}
              </div>

              {selectedCommerce && (
                <div style={{ 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px', 
                  padding: '1.5rem',
                  backgroundColor: '#FFFFFF',
                  flexShrink: 0,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <h4 style={{ fontFamily: 'Nunito', color: '#334155', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.5rem' }}>
                    Consulta
                  </h4>
                  <div style={{ fontFamily: 'Nunito', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <p><strong>Fecha respuesta:</strong> {selectedCommerce.ultimaConsulta?.CSFechaHoraRespuesta || "-"}</p>
                    <p><strong>Marcas disponibles:</strong> {selectedCommerce.ultimaConsulta?.CSMarcasRespuesta || "-"}</p>
                    <p><strong>Descripcion:</strong> {selectedCommerce.ultimaConsulta?.CSDescripcionRespuesta || "-"}</p>
                    <p><strong>Precio:</strong> {selectedCommerce.ultimaConsulta?.CSPrecioRespuesta ? `$ ${selectedCommerce.ultimaConsulta.CSPrecioRespuesta}` : "-"}</p>
                    
                    {/* Badge */}
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.8rem',
                      backgroundColor: selectedState.bg,
                      border: `1px solid ${selectedState.color}`,
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: selectedState.color,
                      fontSize: '1.1rem'
                    }}>
                      {selectedState.label}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <DataInconsistencyModal isOpen={errorState === '400'} onClose={() => setErrorState(null)} />
      <ResourceNotFoundModal isOpen={errorState === '404'} message={errorMessage} onClose={() => navigate(-1)} />
      <ServerErrorModal isOpen={errorState === '500'} onClose={() => navigate(-1)} />
    </div>
  );
};
