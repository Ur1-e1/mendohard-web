import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../../services/productoService';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';
import { AltaExitosaModal } from '../../components/modals/abm-producto/AltaExitosaModal';
import { ImagePreviewModal } from '../../components/modals/abm-producto/ImagePreviewModal';

export const AltaComponentePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreTecnico: '',
    imagenUrl: '',
    categoriaCodigo: ''
  });
  const [especificaciones, setEspecificaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Modals
  const [showAltaExitosa, setShowAltaExitosa] = useState(false);
  const [showDataInconsistency, setShowDataInconsistency] = useState(false);
  const [showServerError, setShowServerError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [invalidFields, setInvalidFields] = useState([]);
  const [dataInconsistencyMessage, setDataInconsistencyMessage] = useState('');

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/admin/componentes', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  useEffect(() => {
    // Load categories
    productoService.obtenerCategoriasActivas()
      .then(data => setCategorias(data))
      .catch(err => console.error('Error al cargar categorias', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Quitar de invalid fields si el usuario modifica
    if (invalidFields.includes(name)) {
      setInvalidFields(prev => prev.filter(f => f !== name));
    }
  };

  const getStyleForField = (fieldName) => ({
    width: '100%',
    padding: '0.75rem',
    border: invalidFields.includes(fieldName) ? '2px solid #EF4444' : '1px solid #94A3B8',
    borderRadius: '4px',
    fontFamily: 'Nunito',
    fontSize: '1rem',
    boxSizing: 'border-box'
  });

  // Especificaciones
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);

  const handleAddOrUpdateSpec = () => {
    if (!specKey.trim() || !specValue.trim()) return;
    
    if (editingIndex >= 0) {
      const newSpecs = [...especificaciones];
      newSpecs[editingIndex] = { key: specKey.trim(), value: specValue.trim() };
      setEspecificaciones(newSpecs);
      setEditingIndex(-1);
    } else {
      setEspecificaciones(prev => [...prev, { key: specKey.trim(), value: specValue.trim() }]);
    }
    setSpecKey('');
    setSpecValue('');
    if (invalidFields.includes('especificaciones')) {
      setInvalidFields(prev => prev.filter(f => f !== 'especificaciones'));
    }
  };

  const handleDeleteSpec = (index) => {
    setEspecificaciones(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(-1);
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleEditSpec = (index) => {
    setEditingIndex(index);
    setSpecKey(especificaciones[index].key);
    setSpecValue(especificaciones[index].value);
  };

  const handleSubmit = async () => {
    try {
      // Build request body
      const specsMap = especificaciones.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});

      const payload = {
        ...formData,
        especificaciones: specsMap
      };

      await productoService.crearProducto(payload);
      setShowAltaExitosa(true);
      
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.errorCode === 'DATA_INCONSISTENCY') {
        const fields = error.response.data.invalidFields || [];
        setInvalidFields(fields);
        setDataInconsistencyMessage(error.response.data.message || 'Datos ingresados no válidos');
        setShowDataInconsistency(true);
      } else {
        setShowServerError(true);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nombreTecnico: '', imagenUrl: '', categoriaCodigo: '' });
    setEspecificaciones([]);
    setInvalidFields([]);
    setShowAltaExitosa(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#CBD5E1', fontFamily: 'Nunito', padding: '2rem' }}>
      {/* CONTENEDOR PRINCIPAL BLANCO */}
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1rem',
        padding: '2.5rem', width: '100%', maxWidth: '1000px', margin: '0 auto',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', gap: '2rem'
      }}>
        
        {/* HEADER */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <button 
            onClick={() => navigate('/admin/componentes', { replace: true })}
            style={{
              position: 'absolute', left: 0,
              backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
              color: '#334155', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center'
            }}
          >
            &#8592; Atrás
          </button>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <h1 style={{ margin: 0, color: '#334155', fontSize: '1.5rem', fontWeight: 800 }}>MendoHard - Dar de Alta</h1>
            <h2 style={{ margin: 0, color: '#334155', fontSize: '1.2rem', fontWeight: 600 }}>Ingrese los datos correspondiente al nuevo Componente de Hardware</h2>
          </div>
        </div>

        {/* GRID DE COLUMNAS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          
          {/* COLUMNA IZQUIERDA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Ingresar el Nombre Tecnico
            </label>
            <input 
              type="text" 
              name="nombreTecnico"
              value={formData.nombreTecnico}
              onChange={handleChange}
              placeholder="Ej: Intel Core i9-14900K"
              style={getStyleForField('nombreTecnico')}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Ingresar el Url de Imagen General
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                name="imagenUrl"
                value={formData.imagenUrl}
                onChange={handleChange}
                placeholder="Ej: https://midominio.com/imagen.png"
                style={{ ...getStyleForField('imagenUrl'), flex: 1 }}
              />
              <button 
                onClick={() => setShowPreview(true)}
                disabled={!formData.imagenUrl}
                style={{
                  backgroundColor: '#4A7BB0', border: 'none', borderRadius: '4px', padding: '0 1rem', cursor: formData.imagenUrl ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Vista previa"
              >
                {/* Icono de cámara simple SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#334155', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Selecciona la categoría a la que corresponde
            </label>
            <select 
              name="categoriaCodigo"
              value={formData.categoriaCodigo}
              onChange={handleChange}
              style={getStyleForField('categoriaCodigo')}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map(cat => (
                <option key={cat.codigo} value={cat.codigo}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', position: 'relative' }}>
          <label style={{ display: 'block', color: '#334155', fontWeight: 'bold' }}>
            Ingresar Especificaciones
          </label>
          <div style={{
            flex: 1, border: invalidFields.includes('especificaciones') ? '2px solid #EF4444' : '1px solid #94A3B8', borderRadius: '4px',
            padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto'
          }}>
            {/* Controles para añadir/modificar esp. */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <input 
                type="text" 
                placeholder="Clave (Ej: RAM)" 
                value={specKey}
                onChange={e => setSpecKey(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', border: '1px solid #94A3B8', borderRadius: '4px' }}
              />
              <input 
                type="text" 
                placeholder="Valor (Ej: 16GB)" 
                value={specValue}
                onChange={e => setSpecValue(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', border: '1px solid #94A3B8', borderRadius: '4px' }}
              />
            </div>
            
            <button 
              onClick={handleAddOrUpdateSpec}
              style={{
                alignSelf: 'flex-start', backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold',
                border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer'
              }}
            >
              {editingIndex >= 0 ? 'Modificar Especificación' : 'Agregar Especificación'}
            </button>

            <hr style={{ width: '100%', borderColor: '#E2E8F0' }} />

            {/* Grilla dinámica de specs */}
            {especificaciones.length === 0 ? (
              <p style={{ color: '#94A3B8', textAlign: 'center' }}>No hay especificaciones agregadas.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {especificaciones.map((spec, index) => (
                  <li key={index} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: '#F8FAFC', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E2E8F0'
                  }}>
                    <span style={{ color: '#334155' }}><strong>{spec.key}:</strong> {spec.value}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleEditSpec(index)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#4A7BB0', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Modificar
                      </button>
                      <button 
                        onClick={() => handleDeleteSpec(index)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button 
              onClick={handleSubmit}
              style={{
                backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', border: 'none',
                borderRadius: '4px', padding: '0.75rem 2rem', cursor: 'pointer', fontSize: '1rem'
              }}
            >
              Registrar
            </button>
          </div>
        </div>

        </div>
      </div>

      {/* Modals */}
      {showAltaExitosa && <AltaExitosaModal onClose={resetForm} onAccept={resetForm} />}
      <DataInconsistencyModal 
        isOpen={showDataInconsistency} 
        onClose={() => setShowDataInconsistency(false)} 
        message={dataInconsistencyMessage} 
      />
      <ServerErrorModal 
        isOpen={showServerError} 
        onClose={() => setShowServerError(false)} 
      />
      {showPreview && <ImagePreviewModal imageUrl={formData.imagenUrl} onClose={() => setShowPreview(false)} />}
    </div>
  );
};
