import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

const CategoryNode = ({ category, onSelect }) => {
  const isRoot = category.CCodigoPadre === null;
  const [isExpanded, setIsExpanded] = useState(isRoot);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const nodeStyle = isRoot 
    ? { border: '1px solid #E2E8F0', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }
    : { marginLeft: '1.5rem', marginTop: '0.5rem' };

  return (
    <div style={nodeStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {!category.esHoja ? (
          <button 
            onClick={toggleExpand}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              fontSize: '0.9rem', color: '#334155', padding: '0.2rem'
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        ) : (
          <span style={{ width: '1.2rem', display: 'inline-block' }}></span>
        )}
        <span style={{ color: '#334155', fontFamily: 'Nunito', fontSize: '1rem', flex: 1 }}>
          {category.CNombre}
        </span>
        {category.esHoja && (
          <button 
            style={{ 
              backgroundColor: '#4A7BB0', 
              color: '#1E293B', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: '4px',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              fontFamily: 'Nunito'
            }}
            onClick={() => onSelect(category.CCodigo)}
          >
            Seleccionar
          </button>
        )}
      </div>
      {isExpanded && category.subcategorias && category.subcategorias.length > 0 && (
        <div style={{ borderLeft: '1px solid #E2E8F0', marginLeft: '0.6rem' }}>
          {category.subcategorias.map(sub => (
            <CategoryNode key={sub.CCodigo} category={sub} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export const SelectCategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [errorState, setErrorState] = useState(null); // '400', '404', '500'

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await productService.getCategorias();
        setCategories(data);
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
    fetchCategorias();
  }, []);

  const handleSelect = (cCodigo) => {
    navigate('/buscar-producto', { state: { CCodigo: cCodigo } });
  };

  const handleBack = () => {
    navigate('/home-consumidor', { replace: true });
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
        maxWidth: '700px',
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
          Seleccionar una Categoria
        </h3>

        <div style={{ marginTop: '1rem' }}>
          {categories.length > 0 ? (
            categories.map(cat => (
              <CategoryNode key={cat.CCodigo} category={cat} onSelect={handleSelect} />
            ))
          ) : (
            <p style={{ textAlign: 'center', fontFamily: 'Nunito', color: '#64748b' }}>Cargando categorías...</p>
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
