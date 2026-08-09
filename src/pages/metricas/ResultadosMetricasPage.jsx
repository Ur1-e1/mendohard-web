import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ResultadosMetricasPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const metricasData = location.state?.metricasData;

  useEffect(() => {
    if (!metricasData) {
      // Si no hay datos (ej. refresco de página), volver al selector de rango
      navigate('/vendedor/metricas/rango', { replace: true });
    }
  }, [metricasData, navigate]);

  if (!metricasData) return null;

  const componentes = metricasData.componentesMasDemandados || [];
  const demanda = metricasData.demandaInsatisfechaPorZona || [];

  const renderEspecificacion = (especificacion) => {
    if (!especificacion) return '-';
    
    let obj = especificacion;
    if (typeof especificacion === 'string') {
      try {
        obj = JSON.parse(especificacion);
      } catch (e) {
        return especificacion;
      }
    }

    if (typeof obj === 'object' && obj !== null) {
      try {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '-';
        return (
          <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '0.2rem', whiteSpace: 'normal' }}>
            {keys.map((key, i) => (
              <span key={key} style={{ display: 'inline-block' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>{key}:</span> {String(obj[key])}
                {i < keys.length - 1 && <span style={{ margin: '0 0.3rem', color: '#94A3B8' }}>•</span>}
              </span>
            ))}
          </div>
        );
      } catch (e) {
        return '-';
      }
    }
    
    return String(especificacion) || '-';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#CBD5E1', // Canvas/Fondo general
      padding: '2rem'
    }}>
      {/* Contenedor Principal Flotante (Rectángulo Grande) */}
      <div 
        className="card"
        style={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
        }}
      >
        {/* Encabezado Superior */}
        <div style={{ position: 'relative', marginBottom: '2rem', textAlign: 'center' }}>
          {/* Botón Volver (Esquina superior derecha) */}
          <button
            onClick={() => navigate('/home-vendedor')}
            className="btn-primary"
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              backgroundColor: '#4A7BB0',
              color: '#1E293B',
              fontWeight: 'bold',
              padding: '0.5rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif'
            }}
          >
            Volver
          </button>

          <h1 style={{ color: '#334155', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>MendoHard</h1>
          <h2 style={{ color: '#334155', margin: '0.5rem 0 0 0', fontSize: '1.25rem', fontWeight: 'normal' }}>Metricas</h2>
        </div>

        {/* Contenedor de Tablas */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'space-between',
          marginTop: '2rem'
        }}>
          
          {/* Tabla 1: Componentes más Demandados */}
          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <h3 style={{ color: '#1E293B', marginBottom: '1rem', fontSize: '1.1rem' }}>Tabla:Componentes mas Demandados</h3>
            <div style={{
              border: '1px solid #E2E8F0',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Nunito, sans-serif' }}>
                  <thead style={{ backgroundColor: '#F1F5F9', position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #E2E8F0', color: '#334155', fontWeight: 600 }}>Nombre</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #E2E8F0', color: '#334155', fontWeight: 600 }}>Cantidad</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #E2E8F0', color: '#334155', fontWeight: 600 }}>Especificacion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {componentes.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.75rem', color: '#475569' }}>{item.nombre}</td>
                        <td style={{ padding: '0.75rem', color: '#475569' }}>{item.cantidad}</td>
                        <td style={{ padding: '0.75rem', color: '#475569' }}>{renderEspecificacion(item.especificacion)}</td>
                      </tr>
                    ))}
                    {componentes.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8' }}>No hay datos disponibles</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tabla 2: Demanda Insatisfecha por Zona */}
          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <h3 style={{ color: '#1E293B', marginBottom: '1rem', fontSize: '1.1rem' }}>Tabla: Demanda Insatisfecha por Zona</h3>
            <div style={{
              border: '1px solid #E2E8F0',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Nunito, sans-serif' }}>
                  <thead style={{ backgroundColor: '#F1F5F9', position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #E2E8F0', color: '#334155', fontWeight: 600 }}>Nombre</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #E2E8F0', color: '#334155', fontWeight: 600 }}>Cantidad</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #E2E8F0', color: '#334155', fontWeight: 600 }}>Departamento</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #E2E8F0', color: '#334155', fontWeight: 600 }}>Especificacion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demanda.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.75rem', color: '#475569' }}>{item.nombre}</td>
                        <td style={{ padding: '0.75rem', color: '#475569' }}>{item.cantidad}</td>
                        <td style={{ padding: '0.75rem', color: '#475569' }}>{item.departamento}</td>
                        <td style={{ padding: '0.75rem', color: '#475569' }}>{renderEspecificacion(item.especificacion)}</td>
                      </tr>
                    ))}
                    {demanda.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8' }}>No hay datos disponibles</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
