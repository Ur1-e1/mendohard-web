import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

const ProductImage = ({ url, alt }) => {
  const [hasError, setHasError] = useState(false);
  
  if (!url || hasError) {
    return <span style={{ color: '#94A3B8', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>Sin Imagen</span>;
  }
  return (
    <img 
      src={url} 
      alt={alt} 
      onError={() => setHasError(true)} 
      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
    />
  );
};

export const SelectProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cCodigo = location.state?.CCodigo;

  const [products, setProducts] = useState([]);
  const [errorState, setErrorState] = useState(null); // '400', '404', '500'

  useEffect(() => {
    if (!cCodigo) {
      // Si no hay código de categoría, volver a la búsqueda
      navigate('/buscar-categoria', { replace: true });
      return;
    }

    const fetchProducts = async () => {
      try {
        const data = await productService.getProductosPorCategoria(cCodigo);
        setProducts(data);
      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          if (status === 400) setErrorState('400');
          else if (status === 404) setErrorState('404');
          else if (status === 500) setErrorState('500');
        } else {
          setErrorState('500');
        }
      }
    };
    fetchProducts();
  }, [cCodigo, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatSpecs = (specs) => {
    if (!specs) return 'No hay especificaciones disponibles.';
    // specs es un objeto Map/JSON (clave-valor)
    try {
      const parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs;
      return Object.entries(parsedSpecs).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '0.2rem' }}>
          <strong>{key}:</strong> {value}
        </div>
      ));
    } catch (e) {
      return 'Especificaciones en formato incorrecto.';
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
        maxWidth: '800px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        position: 'relative'
      }}>
        {/* Back Button */}
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
          Buscar Componente de Hardware
        </h2>
        <h3 style={{ fontFamily: 'Nunito', color: '#334155', textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 'normal' }}>
          Seleccionar un Componente para consultar Stock
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.PCodigo} 
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  fontFamily: 'Nunito',
                  color: '#334155'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  {/* Info Column */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
                      <strong>Nombre:</strong> {product.PNombreTecnico}
                    </h4>
                    <div>
                      <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Especificaciones:</strong>
                      <div style={{ fontSize: '0.95rem', color: '#475569' }}>
                        {formatSpecs(product.PEspecificaciones)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Column */}
                  <div style={{ width: '150px', height: '150px', flexShrink: 0, border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
                    <ProductImage url={product.PImagenUrl} alt={product.PNombreTecnico} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <button 
                    style={{ 
                      backgroundColor: '#4A7BB0', 
                      color: '#1E293B', 
                      fontWeight: 'bold', 
                      border: 'none', 
                      borderRadius: '4px',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontFamily: 'Nunito'
                    }}
                    onClick={() => {}}
                  >
                    Consultar Stock
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', fontFamily: 'Nunito', color: '#64748b' }}>No se encontraron productos en esta categoría.</p>
          )}
        </div>
      </div>

      {/* Modals de Error */}
      {errorState === '400' && (
        <DataInconsistencyModal onClose={() => setErrorState(null)} />
      )}
      {errorState === '404' && (
        <ResourceNotFoundModal onClose={() => setErrorState(null)} />
      )}
      {errorState === '500' && (
        <ServerErrorModal onClose={() => setErrorState(null)} />
      )}
    </div>
  );
};
