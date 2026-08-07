import { useState, useEffect } from 'react';
import { getUbicaciones, registrarComercio } from '../../services/commerceService';

export const SelectCommerceLocationModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  onSuccess, 
  setInvalidFields, 
  setModalDataInconsistency,
  setModalNotFound,
  setModalServerError 
}) => {
  const [ubicaciones, setUbicaciones] = useState([]);
  
  const [selectedPais, setSelectedPais] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset dropdowns when opened
      setSelectedPais('');
      setSelectedProvincia('');
      setSelectedDepartamento('');
      
      const fetchUbicaciones = async () => {
        try {
          const data = await getUbicaciones();
          setUbicaciones(data || []);
        } catch (error) {
          console.error("Error fetching ubicaciones", error);
        }
      };
      fetchUbicaciones();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Derivar listas únicas
  const paises = Array.from(new Map(ubicaciones.map(u => [u.paisCodigo, { codigo: u.paisCodigo, nombre: u.paisNombre }])).values());
  
  const provincias = Array.from(new Map(
    ubicaciones
      .filter(u => u.paisCodigo === selectedPais)
      .map(u => [u.provinciaCodigo, { codigo: u.provinciaCodigo, nombre: u.provinciaNombre }])
  ).values());
  
  const departamentos = Array.from(new Map(
    ubicaciones
      .filter(u => u.paisCodigo === selectedPais && u.provinciaCodigo === selectedProvincia)
      .map(u => [u.departamentoCodigo, { codigo: u.departamentoCodigo, nombre: u.departamentoNombre }])
  ).values());

  const handlePaisChange = (e) => {
    setSelectedPais(e.target.value);
    setSelectedProvincia('');
    setSelectedDepartamento('');
  };

  const handleProvinciaChange = (e) => {
    setSelectedProvincia(e.target.value);
    setSelectedDepartamento('');
  };

  const handleDepartamentoChange = (e) => {
    setSelectedDepartamento(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedDepartamento) return;
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
        departamentoCodigo: selectedDepartamento
      };

      await registrarComercio(payload);
      
      // Success HTTP 201
      onSuccess(); // resets UI-32 form
      onClose(); // closes this modal

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.errorCode === 'DATA_INCONSISTENCY') {
          // Pass invalid fields to parent
          setInvalidFields(data.invalidFields || []);
          // Set message for DataInconsistencyModal
          setModalDataInconsistency({ isOpen: true, message: data.message || 'Datos inconsistentes' });
          onClose(); // Close this modal so user can fix issues on main form
        } else if (status === 404 && data.errorCode === 'RESOURCE_NOT_FOUND') {
          setModalNotFound(true);
          onClose();
        } else if (status === 500 || data.errorCode === 'INTERNAL_SERVER_ERROR') {
          setModalServerError(true);
          onClose();
        } else {
          // generic error
          alert("Error al registrar comercio: " + (data.message || 'Error desconocido'));
        }
      } else {
        alert("Error de conexión con el servidor.");
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      fontFamily: 'Nunito, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#CBD5E1',
        border: '2px solid #1E293B',
        borderRadius: '1rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E293B',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#1E293B'
          }}
        >
          ✕
        </button>

        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#1E293B',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Seleccionar País, Provincia y Departamento
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>País</label>
            <select
              value={selectedPais}
              onChange={handlePaisChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1E293B' }}
            >
              <option value="">Seleccione un país</option>
              {paises.map(p => (
                <option key={p.codigo} value={p.codigo}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>Provincia</label>
            <select
              value={selectedProvincia}
              onChange={handleProvinciaChange}
              disabled={!selectedPais}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1E293B', opacity: !selectedPais ? 0.6 : 1 }}
            >
              <option value="">Seleccione una provincia</option>
              {provincias.map(p => (
                <option key={p.codigo} value={p.codigo}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>Departamento</label>
            <select
              value={selectedDepartamento}
              onChange={handleDepartamentoChange}
              disabled={!selectedProvincia}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1E293B', opacity: !selectedProvincia ? 0.6 : 1 }}
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map(d => (
                <option key={d.codigo} value={d.codigo}>{d.nombre}</option>
              ))}
            </select>
          </div>

        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedDepartamento || loading}
          style={{
            marginTop: '2rem',
            backgroundColor: '#4A7BB0',
            color: '#1E293B',
            fontWeight: 'bold',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: (!selectedDepartamento || loading) ? 'not-allowed' : 'pointer',
            opacity: (!selectedDepartamento || loading) ? 0.7 : 1,
            width: '100%',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Registrando...' : 'Registrar Comercio'}
        </button>

      </div>
    </div>
  );
};
