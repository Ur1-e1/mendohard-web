import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { authService } from '../services/authService';
import { DataInconsistencyModal } from '../components/modals/DataInconsistencyModal';
import { PasswordMismatchModal } from '../components/modals/PasswordMismatchModal';
import { UserAlreadyExistsModal } from '../components/modals/UserAlreadyExistsModal';

// Fix for default Leaflet icon not showing properly in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clics en el mapa y centrado automático
const LocationMarker = ({ position, setPosition }) => {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker 
      position={position} 
      draggable={true} 
      eventHandlers={{
        dragend: (e) => {
          setPosition(e.target.getLatLng());
        },
      }}
    />
  );
};

export const RegisterVendorPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    VCuit: '',
    VTelefono: '',
    UNombre: '',
    UApellido: '',
    VRazonSocial: '',
    UEmail: '',
    VCategoriaFiscal: '',
    Contrasena: '',
    ConfirmacionContrasena: '',
    CNombreFantasia: '',
    CTelefono: '',
    CDireccionCalle: '',
    CNumeroEnCalle: '',
    CHorarioAtencion: '',
    DCodigo: ''
  });
  const [position, setPosition] = useState({ lat: -32.89084, lng: -68.82717 }); // Mendoza default
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Ubicaciones
  const [ubicaciones, setUbicaciones] = useState([]);
  const [paises, setPaises] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  
  const [selectedPais, setSelectedPais] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');

  // Modals
  const [showDataInconsistency, setShowDataInconsistency] = useState(false);
  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);
  const [showUserAlreadyExists, setShowUserAlreadyExists] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const data = await authService.getUbicacionesVendedor();
        setUbicaciones(data);
        
        // Extraer países únicos
        const uniquePaises = [];
        const paisesMap = new Map();
        data.forEach(item => {
          if (!paisesMap.has(item.PCodigo)) {
            paisesMap.set(item.PCodigo, true);
            uniquePaises.push({ PCodigo: item.PCodigo, PNombre: item.PNombre });
          }
        });
        setPaises(uniquePaises);
      } catch (error) {
        console.error("Error al cargar ubicaciones:", error);
      }
    };
    fetchUbicaciones();
  }, []);

  useEffect(() => {
    if (selectedPais) {
      const filteredProvincias = [];
      const provMap = new Map();
      ubicaciones.filter(u => String(u.PCodigo) === String(selectedPais)).forEach(item => {
        if (!provMap.has(item.ProCodigo)) {
          provMap.set(item.ProCodigo, true);
          filteredProvincias.push({ ProCodigo: item.ProCodigo, ProNombre: item.ProNombre });
        }
      });
      setProvincias(filteredProvincias);
      setSelectedProvincia('');
      setDepartamentos([]);
      setFormData(prev => ({ ...prev, DCodigo: '' }));
    }
  }, [selectedPais, ubicaciones]);

  useEffect(() => {
    if (selectedProvincia) {
      const filteredDeptos = ubicaciones
        .filter(u => String(u.ProCodigo) === String(selectedProvincia))
        .map(item => ({ DCodigo: item.DCodigo, DNombre: item.DNombre }));
      setDepartamentos(filteredDeptos);
      setFormData(prev => ({ ...prev, DCodigo: '' }));
    }
  }, [selectedProvincia, ubicaciones]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (invalidFields.includes(e.target.name)) {
      setInvalidFields(invalidFields.filter(f => f !== e.target.name));
    }
  };

  const getInputStyle = (fieldName) => ({
    width: '100%', 
    padding: '0.75rem', 
    borderRadius: '8px', 
    border: invalidFields.includes(fieldName) ? '2px solid #EF4444' : '1px solid #94A3B8', 
    color: '#334155', 
    boxSizing: 'border-box', 
    fontFamily: 'Nunito'
  });

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err);
          alert("No se pudo obtener la ubicación. Por favor, asegúrese de dar permisos.");
        }
      );
    } else {
      alert("Geolocalización no es soportada por su navegador.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validar campos obligatorios en Frontend
    const requiredFields = [
      'VCuit', 'VTelefono', 'UNombre', 'UApellido', 'VRazonSocial', 'UEmail',
      'VCategoriaFiscal', 'Contrasena', 'ConfirmacionContrasena', 'CNombreFantasia',
      'CTelefono', 'CDireccionCalle', 'CNumeroEnCalle', 'CHorarioAtencion', 'DCodigo'
    ];

    const emptyFields = requiredFields.filter(field => !formData[field] || !String(formData[field]).trim());

    if (emptyFields.length > 0 || !position) {
      setInvalidFields(emptyFields);
      setShowDataInconsistency(true);
      return;
    }

    // 2. Validar contraseñas
    if (formData.Contrasena !== formData.ConfirmacionContrasena) {
      setInvalidFields(['Contrasena', 'ConfirmacionContrasena']);
      setShowPasswordMismatch(true);
      return;
    }

    // 3. Preparar payload y Enviar
    const payload = {
      ...formData,
      CLatitud: String(position.lat),
      CLongitud: String(position.lng)
    };

    try {
      await authService.registerVendedor(payload);
      navigate('/login');
    } catch (error) {
      const errorCode = error.response?.data?.errorCode;
      const backendInvalidFields = error.response?.data?.invalidFields || error.invalidFields || [];
      
      if (error.response?.status === 400 && errorCode === 'PASSWORD_MISMATCH') {
        setInvalidFields(['Contrasena', 'ConfirmacionContrasena']);
        setShowPasswordMismatch(true);
      } else if (error.response?.status === 400 && errorCode === 'USER_ALREADY_EXISTS') {
        setInvalidFields(backendInvalidFields);
        setShowUserAlreadyExists(true);
      } else {
        setInvalidFields(backendInvalidFields);
        setShowDataInconsistency(true);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#CBD5E1', minHeight: '100vh', padding: '2rem 1rem', fontFamily: 'Nunito', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '800px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#1E293B', textAlign: 'center', marginBottom: '0.5rem', fontWeight: 'bold' }}>MendoHard</h1>
        <h2 style={{ color: '#334155', textAlign: 'center', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Registrarse</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* SECCIÓN 1: DATOS DEL VENDEDOR */}
          <section>
            <h3 style={{ color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>Ingrese los datos correspondiente como Vendedor</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar el CUIT</label>
                <input type="text" name="VCuit" placeholder="Ej: 20301234568" value={formData.VCuit} onChange={handleChange} style={getInputStyle('VCuit')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar un teléfono</label>
                <input type="text" name="VTelefono" placeholder="Ej: 2615551234" value={formData.VTelefono} onChange={handleChange} style={getInputStyle('VTelefono')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar el Nombre (Como sale en DNI)</label>
                <input type="text" name="UNombre" placeholder="Ej: Carlos" value={formData.UNombre} onChange={handleChange} style={getInputStyle('UNombre')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar el Apellido (Como sale en DNI)</label>
                <input type="text" name="UApellido" placeholder="Ej: López" value={formData.UApellido} onChange={handleChange} style={getInputStyle('UApellido')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar la Razón Social</label>
                <input type="text" name="VRazonSocial" placeholder="Ej: López e Hijos S.A." value={formData.VRazonSocial} onChange={handleChange} style={getInputStyle('VRazonSocial')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar el Email</label>
                <input type="email" name="UEmail" placeholder="carlos@comercio.com" value={formData.UEmail} onChange={handleChange} style={getInputStyle('UEmail')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar la Categoría Fiscal</label>
                <input type="text" name="VCategoriaFiscal" placeholder="Ej: Responsable Inscripto" value={formData.VCategoriaFiscal} onChange={handleChange} style={getInputStyle('VCategoriaFiscal')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar Contraseña</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input type={showPassword ? "text" : "password"} name="Contrasena" placeholder="••••••••" value={formData.Contrasena} onChange={handleChange} style={{ ...getInputStyle('Contrasena'), paddingRight: '2.5rem' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.25rem'
                    }}
                    tabIndex={-1}
                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Confirmar Contraseña</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input type={showConfirmPassword ? "text" : "password"} name="ConfirmacionContrasena" placeholder="••••••••" value={formData.ConfirmacionContrasena} onChange={handleChange} style={{ ...getInputStyle('ConfirmacionContrasena'), paddingRight: '2.5rem' }} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.25rem'
                    }}
                    tabIndex={-1}
                    title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: DATOS DEL COMERCIO */}
          <section>
            <h3 style={{ color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>Ingrese los datos correspondiente a un Comercio</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar el Nombre Fantasía</label>
                <input type="text" name="CNombreFantasia" placeholder="Ej: Hardware Mendoza" value={formData.CNombreFantasia} onChange={handleChange} style={getInputStyle('CNombreFantasia')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar un teléfono del comercio</label>
                <input type="text" name="CTelefono" placeholder="Ej: 2614449876" value={formData.CTelefono} onChange={handleChange} style={getInputStyle('CTelefono')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar la Dirección Calle (Nombre calle)</label>
                <input type="text" name="CDireccionCalle" placeholder="Ej: San Martín" value={formData.CDireccionCalle} onChange={handleChange} style={getInputStyle('CDireccionCalle')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar número del comercio en la calle</label>
                <input type="text" name="CNumeroEnCalle" placeholder="Ej: 1050" value={formData.CNumeroEnCalle} onChange={handleChange} style={getInputStyle('CNumeroEnCalle')} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Ingresar horario atención (Tal como la ingresa, va a ser mostrada a los posibles Compradores)</label>
                <input type="text" name="CHorarioAtencion" placeholder="Ej: Lunes a Viernes de 09:00 a 18:00 hs" value={formData.CHorarioAtencion} onChange={handleChange} style={getInputStyle('CHorarioAtencion')} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>País</label>
                <select 
                  value={selectedPais} 
                  onChange={(e) => {
                    setSelectedPais(e.target.value);
                  }} 
                  style={getInputStyle('selectedPais')}
                >
                  <option value="">Seleccione País</option>
                  {paises.map(p => <option key={p.PCodigo} value={p.PCodigo}>{p.PNombre}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Provincia</label>
                <select 
                  value={selectedProvincia} 
                  onChange={(e) => {
                    setSelectedProvincia(e.target.value);
                  }} 
                  style={getInputStyle('selectedProvincia')}
                  disabled={!selectedPais}
                >
                  <option value="">Seleccione Provincia</option>
                  {provincias.map(p => <option key={p.ProCodigo} value={p.ProCodigo}>{p.ProNombre}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: '#334155', fontSize: '0.9rem', fontWeight: 'bold' }}>Departamento</label>
                <select 
                  name="DCodigo"
                  value={formData.DCodigo} 
                  onChange={handleChange} 
                  style={getInputStyle('DCodigo')}
                  disabled={!selectedProvincia}
                >
                  <option value="">Seleccione Departamento</option>
                {departamentos.map(d => <option key={d.DCodigo} value={d.DCodigo}>{d.DNombre}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: MAPA */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ color: '#334155', fontWeight: 'bold' }}>Ubicación en Mapa</label>
              <button 
                type="button" 
                onClick={handleGeolocation} 
                style={{ background: 'none', border: '1px solid #4A7BB0', color: '#4A7BB0', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Usar mi ubicación actual
              </button>
            </div>
            
            <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: invalidFields.includes('CLatitud') || invalidFields.includes('CLongitud') ? '2px solid #EF4444' : '1px solid #94A3B8' }}>
              <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button 
              type="submit" 
              style={{ backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '1rem 3rem', cursor: 'pointer', fontFamily: 'Nunito', fontSize: '1.1rem' }}
            >
              Registrar
            </button>
          </div>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button onClick={() => navigate('/registrarse')} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Nunito' }}>
            Volver
          </button>
        </div>
      </div>

      <DataInconsistencyModal isOpen={showDataInconsistency} onClose={() => setShowDataInconsistency(false)} />
      <PasswordMismatchModal isOpen={showPasswordMismatch} onClose={() => setShowPasswordMismatch(false)} />
      <UserAlreadyExistsModal isOpen={showUserAlreadyExists} onClose={() => setShowUserAlreadyExists(false)} />
    </div>
  );
};
