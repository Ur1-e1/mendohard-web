import { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';
import { SelectCommerceLocationModal } from './SelectCommerceLocationModal';

// Solucionar el problema del icono por defecto de Leaflet en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const RegisterCommercePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreFantasia: '',
    telefono: '',
    direccionCalle: '',
    numeroEnCalle: '',
    horarioAtencion: '',
  });

  const [position, setPosition] = useState({ lat: -32.889458, lng: -68.845839 }); // Centro de Mendoza por defecto
  
  const [invalidFields, setInvalidFields] = useState([]);
  const [modalDataInconsistency, setModalDataInconsistency] = useState({ isOpen: false, message: '' });
  const [modalNotFound, setModalNotFound] = useState(false);
  const [modalServerError, setModalServerError] = useState(false);
  const [modalLocationOpen, setModalLocationOpen] = useState(false);

  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setPosition({ lat: latLng.lat, lng: latLng.lng });
        }
      },
    }),
    [],
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err);
          alert("No se pudo obtener su ubicación actual.");
        }
      );
    } else {
      alert("Geolocalización no soportada por el navegador.");
    }
  };

  const handleSiguiente = (e) => {
    e.preventDefault();
    // Validaciones locales (opcional pero requerido para no enviar basura, aunque el backend valida)
    setInvalidFields([]);
    setModalLocationOpen(true);
  };

  const getBorderColor = (fieldName) => {
    return invalidFields.includes(fieldName) ? '2px solid #EF4444' : '1px solid #CBD5E1';
  };

  const resetForm = () => {
    setFormData({
      nombreFantasia: '',
      telefono: '',
      direccionCalle: '',
      numeroEnCalle: '',
      horarioAtencion: '',
    });
    setPosition({ lat: -32.889458, lng: -68.845839 });
    setInvalidFields([]);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <div style={{ backgroundColor: '#CBD5E1', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', fontFamily: 'Nunito, sans-serif' }}>
      
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '900px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
        
        {/* Botón Atrás (Eliminado según requerimiento) */}

        <h2 style={{ textAlign: 'center', color: '#1E293B', marginBottom: '2rem' }}>Registrar Comercio</h2>

        <form onSubmit={handleSiguiente}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            
            {/* Columna Izquierda: Formulario */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ingresar el Nombre Fantasía</label>
                <input 
                  type="text" 
                  name="nombreFantasia" 
                  value={formData.nombreFantasia} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Tech Store Mendoza"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: getBorderColor('nombreFantasia') }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ingresar el Teléfono</label>
                <input 
                  type="tel" 
                  name="telefono" 
                  value={formData.telefono} 
                  onChange={handleInputChange} 
                  placeholder="Ej: 2614789321"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: getBorderColor('telefono') }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ingresar la calle</label>
                <input 
                  type="text" 
                  name="direccionCalle" 
                  value={formData.direccionCalle} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Av. San Martín"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: getBorderColor('direccionCalle') }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ingresar el número en calle</label>
                <input 
                  type="text" 
                  name="numeroEnCalle" 
                  value={formData.numeroEnCalle} 
                  onChange={handleInputChange} 
                  placeholder="Ej: 1650"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: getBorderColor('numeroEnCalle') }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ingresar horario atención (Tal como la ingresa, va a ser mostrada a los posible Compradores)</label>
                <input 
                  type="text" 
                  name="horarioAtencion" 
                  value={formData.horarioAtencion} 
                  onChange={handleInputChange} 
                  placeholder="Ej: Lunes a Viernes 09:00 a 18:00"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: getBorderColor('horarioAtencion') }}
                />
              </div>
            </div>

            {/* Columna Derecha: Mapa */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ flexGrow: 1, border: invalidFields.includes('latitud') || invalidFields.includes('longitud') ? '2px solid #EF4444' : '1px solid #CBD5E1', borderRadius: '0.5rem', overflow: 'hidden', minHeight: '350px' }}>
                <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapClickHandler />
                  <Marker
                    draggable={true}
                    eventHandlers={eventHandlers}
                    position={[position.lat, position.lng]}
                    ref={markerRef}
                  >
                  </Marker>
                </MapContainer>
              </div>
              <button 
                type="button" 
                onClick={useCurrentLocation}
                style={{ backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
              >
                Usar mi ubicación actual
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button 
              type="submit"
              style={{ backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', padding: '0.75rem 2rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
            >
              Siguiente
            </button>
          </div>
        </form>

      </div>

      <SelectCommerceLocationModal
        isOpen={modalLocationOpen}
        onClose={() => setModalLocationOpen(false)}
        formData={{ ...formData, latitud: position.lat, longitud: position.lng }}
        onSuccess={resetForm}
        setInvalidFields={setInvalidFields}
        setModalDataInconsistency={setModalDataInconsistency}
        setModalNotFound={setModalNotFound}
        setModalServerError={setModalServerError}
      />

      <DataInconsistencyModal 
        isOpen={modalDataInconsistency.isOpen} 
        onClose={() => setModalDataInconsistency({ isOpen: false, message: '' })} 
        message={modalDataInconsistency.message} 
      />
      
      <ResourceNotFoundModal 
        isOpen={modalNotFound} 
        onClose={() => setModalNotFound(false)} 
      />
      
      <ServerErrorModal 
        isOpen={modalServerError} 
        onClose={() => setModalServerError(false)} 
      />

    </div>
  );
};
