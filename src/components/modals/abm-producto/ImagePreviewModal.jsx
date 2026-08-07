import React, { useState } from 'react';

export const ImagePreviewModal = ({ imageUrl, onClose }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
    }}>
      <div style={{
        backgroundColor: '#CBD5E1', border: '2px solid #1E293B', borderRadius: '1rem',
        padding: '1.5rem', width: '480px', maxWidth: '90%', display: 'flex', flexDirection: 'column', fontFamily: 'Nunito'
      }}>
        
        {/* ENCABEZADO FLEX */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#334155', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Vista Previa de Imagen
          </h3>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#FFFFFF', border: '2px solid #1E293B', borderRadius: '6px',
              width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', fontWeight: 'bold', color: '#1E293B', flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* CUERPO - IMAGEN O ERROR */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt="Vista previa" 
              onError={() => setImageError(true)}
              style={{
                maxWidth: '100%', maxHeight: '60vh', width: '100%', objectFit: 'contain',
                backgroundColor: '#FFFFFF', borderRadius: '0.5rem', padding: '0.5rem', border: '1px solid #E2E8F0'
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              backgroundColor: '#F1F5F9', border: '1px dashed #94A3B8', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center'
            }}>
              <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</span>
              <span style={{ color: '#475569', fontWeight: 600 }}>No se pudo cargar la imagen.</span>
              <span style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>Verifique que la URL sea válida y de acceso público.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
