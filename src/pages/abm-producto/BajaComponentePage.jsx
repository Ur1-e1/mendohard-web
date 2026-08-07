import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../../services/productoService';
import { BajaExitosaModal } from '../../components/modals/abm-producto/BajaExitosaModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

export const BajaComponentePage = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showExitosa, setShowExitosa] = useState(false);
  const [showServerError, setShowServerError] = useState(false);

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/admin/componentes', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const cargarProductos = () => {
    productoService.obtenerProductosActivos()
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos', err));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleDarDeBaja = async (codigo) => {
    try {
      await productoService.deshabilitarProducto(codigo);
      setShowExitosa(true);
    } catch (error) {
      console.error('Error al deshabilitar producto', error);
      setShowServerError(true);
    }
  };

  const handleSuccessClose = () => {
    setShowExitosa(false);
    cargarProductos(); // Recarga la lista, desaparece el dado de baja
  };

  const filteredProductos = productos.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      p.nombreTecnico.toLowerCase().includes(term) ||
      (p.codigo && p.codigo.toString().includes(term)) ||
      (p.categoriaNombre && p.categoriaNombre.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#CBD5E1', fontFamily: 'Nunito', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* WRAPPER BLANCO */}
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '1rem',
        padding: '2.5rem', width: '100%', maxWidth: '1000px', margin: '0 auto',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
      
      {/* HEADER */}
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
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
          <h1 style={{ margin: 0, color: '#334155', fontSize: '1.5rem', fontWeight: 800 }}>MendoHard - Dar de baja un Componente de Hardware</h1>
          <h2 style={{ margin: 0, color: '#334155', fontSize: '1.2rem', fontWeight: 600 }}>Seleccionar un Componente para Darlo de baja</h2>
        </div>
      </div>

      {/* BUSCADOR */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Buscar por código, nombre o categoría..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%', padding: '0.75rem', border: '1px solid #94A3B8', borderRadius: '4px',
            fontFamily: 'Nunito', fontSize: '1rem', boxSizing: 'border-box'
          }}
        />
      </div>

      {/* LISTADO DE PRODUCTOS */}
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredProductos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#334155' }}>No se encontraron productos activos.</p>
        ) : (
          filteredProductos.map(producto => (
            <div key={producto.codigo} style={{
              backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.5rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem'
            }}>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontSize: '1.2rem' }}>{producto.nombreTecnico}</h3>
                <p style={{ margin: '0 0 0.5rem 0', color: '#334155' }}><strong>Categoría:</strong> {producto.categoriaNombre}</p>
                <div style={{ color: '#475569', fontSize: '0.9rem' }}>
                  <strong>Especificaciones:</strong>
                  {producto.especificaciones ? (
                    <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                      {Object.entries(producto.especificaciones).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                      ))}
                    </ul>
                  ) : ' No disponibles'}
                </div>
              </div>

              <div style={{ width: '120px', height: '120px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', borderRadius: '8px', overflow: 'hidden' }}>
                {producto.imagenUrl ? (
                  <img src={producto.imagenUrl} alt={producto.nombreTecnico} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} 
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Sin imagen</span>
                )}
              </div>

              <div style={{ flexShrink: 0 }}>
                <button 
                  onClick={() => handleDarDeBaja(producto.codigo)}
                  style={{
                    backgroundColor: '#4A7BB0', color: '#1E293B', fontWeight: 'bold', border: 'none',
                    borderRadius: '4px', padding: '0.75rem 2rem', cursor: 'pointer', fontSize: '1rem'
                  }}
                >
                  Dar de Baja
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      </div>
      
      {/* MODALS */}
      {showExitosa && <BajaExitosaModal onClose={handleSuccessClose} onAccept={handleSuccessClose} />}
      <ServerErrorModal isOpen={showServerError} onClose={() => setShowServerError(false)} />
    </div>
  );
};
