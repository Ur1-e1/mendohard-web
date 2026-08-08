import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { confirmarStockService } from '../../services/confirmarStockService';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

export const ConfirmarStockPage = () => {
  const navigate = useNavigate();
  const { csContador } = useParams();

  const [nivelesStock, setNivelesStock] = useState([]);
  const [formData, setFormData] = useState({
    csMarcasRespuesta: '',
    csDescripcionRespuesta: '',
    csPrecioRespuesta: '',
    csCantidadRespuesta: ''
  });
  const [invalidFields, setInvalidFields] = useState([]);

  // Estados para evaluación dinámica
  const [dynamicLevel, setDynamicLevel] = useState(null);

  // Estados para modales
  const [showDataInconsistency, setShowDataInconsistency] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [showServerError, setShowServerError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchNiveles = async () => {
      try {
        const data = await confirmarStockService.obtenerNivelesStock(csContador);
        setNivelesStock(data);
      } catch (error) {
        handleApiError(error);
      }
    };
    if (csContador) {
      fetchNiveles();
    }
  }, [csContador]);

  // Lógica de Evaluación Dinámica
  useEffect(() => {
    const cantidad = parseInt(formData.csCantidadRespuesta, 10);
    if (!isNaN(cantidad) && cantidad >= 0 && nivelesStock.length > 0) {
      const nivel = nivelesStock.find(n => cantidad >= n.nsCantidadDesde && cantidad <= n.nsCantidadHasta);
      setDynamicLevel(nivel || null);
    } else {
      setDynamicLevel(null);
    }
  }, [formData.csCantidadRespuesta, nivelesStock]);

  const handleApiError = (error) => {
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      const { errorCode, message } = errorData;
      setErrorMessage(message || 'Ha ocurrido un error inesperado.');
      
      if (errorCode === 'DATA_INCONSISTENCY' || error.response.status === 400) {
        let fieldsToMark = [];

        if (errorData?.invalidFields && errorData.invalidFields.length > 0) {
          fieldsToMark = errorData.invalidFields;
        } else if (errorData?.message) {
          const msg = errorData.message.toLowerCase();
          if (msg.includes("marca") || msg.includes("marcas")) fieldsToMark.push("csMarcasRespuesta");
          if (msg.includes("precio")) fieldsToMark.push("csPrecioRespuesta");
          if (msg.includes("descripción") || msg.includes("descripcion")) fieldsToMark.push("csDescripcionRespuesta");
          if (msg.includes("cantidad") || msg.includes("stock")) fieldsToMark.push("csCantidadRespuesta");
        }

        setInvalidFields(fieldsToMark);
        setErrorMessage(errorData?.message || "Datos ingresados no válidos");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error visual si el usuario vuelve a escribir
    if (invalidFields.includes(name)) {
      setInvalidFields(prev => prev.filter(f => f !== name));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInvalidFields([]);
    
    try {
      const payload = {
        csMarcasRespuesta: formData.csMarcasRespuesta ? formData.csMarcasRespuesta.trim() : null,
        csDescripcionRespuesta: formData.csDescripcionRespuesta,
        csPrecioRespuesta: formData.csPrecioRespuesta !== '' ? parseFloat(formData.csPrecioRespuesta) : null,
        csCantidadRespuesta: formData.csCantidadRespuesta !== '' ? parseInt(formData.csCantidadRespuesta, 10) : null
      };

      await confirmarStockService.confirmarStock(csContador, payload);
      
      // Éxito - retroceder limpiamente en el historial
      navigate(-1);
    } catch (error) {
      handleApiError(error);
    }
  };

  const getInputStyle = (fieldName) => ({
    width: '100%',
    padding: '0.75rem',
    border: invalidFields.includes(fieldName) ? '2px solid #EF4444' : '1px solid #94A3B8',
    borderRadius: '6px',
    fontFamily: 'Nunito, sans-serif',
    fontSize: '1rem',
    boxSizing: 'border-box'
  });

  const getDynamicLevelColor = (nsNombre) => {
    const lowerName = nsNombre.toLowerCase();
    if (lowerName.includes('bajo') || lowerName.includes('poco')) return '#F97316'; // Naranja
    if (lowerName.includes('medio')) return '#84CC16'; // Verde Claro
    if (lowerName.includes('alto') || lowerName.includes('mucho')) return '#22C55E'; // Verde Intenso
    return '#64748B'; // Default gris si no hay coincidencia exacta
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
        maxWidth: '600px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '2rem 3rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#4A7BB0', margin: 0, fontSize: '2rem', fontWeight: 800 }}>MendoHard</h1>
          <h2 style={{ color: '#1E293B', margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>Confirmar Stock</h2>
          <h3 style={{ color: '#64748B', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Ingresar datos de Consulta</h3>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', color: '#334155', fontWeight: 600 }}>Ingresar Marcas</label>
            <input
              type="text"
              name="csMarcasRespuesta"
              placeholder="Ej: Samsung, Kingston"
              value={formData.csMarcasRespuesta}
              onChange={handleChange}
              style={getInputStyle('csMarcasRespuesta')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', color: '#334155', fontWeight: 600 }}>Ingresar una Descripcion *</label>
            <textarea
              name="csDescripcionRespuesta"
              placeholder="Ej: Unidades en stock para entrega inmediata"
              value={formData.csDescripcionRespuesta}
              onChange={handleChange}
              style={{ ...getInputStyle('csDescripcionRespuesta'), resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', color: '#334155', fontWeight: 600 }}>Ingresar Precio</label>
            <input
              type="number"
              step="0.01"
              name="csPrecioRespuesta"
              placeholder="Ej: 89999.99"
              value={formData.csPrecioRespuesta}
              onChange={handleChange}
              style={getInputStyle('csPrecioRespuesta')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', color: '#334155', fontWeight: 600 }}>Ingrese una cantidad Stock *</label>
            <input
              type="number"
              min="0"
              name="csCantidadRespuesta"
              placeholder="Ej: 5"
              value={formData.csCantidadRespuesta}
              onChange={handleChange}
              style={getInputStyle('csCantidadRespuesta')}
            />
            {dynamicLevel && formData.csCantidadRespuesta !== '' && (
              <div style={{ 
                marginTop: '0.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: getDynamicLevelColor(dynamicLevel.nsNombre),
                fontWeight: 600
              }}>
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '1.25rem', 
                  height: '1.25rem', 
                  borderRadius: '50%', 
                  border: '1px solid currentColor',
                  fontSize: '0.8rem'
                }}>i</span>
                Esa cantidad de Stock se considera {dynamicLevel.nsNombre}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: 'transparent',
                color: '#4A7BB0',
                border: '1px solid #4A7BB0',
                padding: '0.75rem 2rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                fontFamily: 'Nunito, sans-serif'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
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
              Confirmar
            </button>
          </div>
        </form>
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
