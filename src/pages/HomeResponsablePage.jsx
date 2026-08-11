import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';

export const HomeResponsablePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nombre = user?.nombreCompleto || 'Usuario';
  
  const [metricas, setMetricas] = useState({
    vendedoresPendientes: 0,
    usuariosTotales: 0,
    comerciosActivos: 0
  });

  useEffect(() => {
    let mounted = true;
    dashboardService.getMetricasResponsable()
      .then((data) => {
        if (mounted) {
          setMetricas({
            vendedoresPendientes: data.vendedoresPendientes || 0,
            usuariosTotales: data.usuariosTotales || 0,
            comerciosActivos: data.comerciosActivos || 0
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching dashboard metrics', error);
      });
    
    return () => {
      mounted = false;
    };
  }, []);

  const { vendedoresPendientes, usuariosTotales, comerciosActivos } = metricas;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1rem', gap: '1rem', overflow: 'hidden' }}>
      
      {/* Contenedor Superior (Tarjetero Principal) */}
      <div className="card" style={{ width: '100%', maxWidth: '900px', position: 'relative', padding: '1.5rem' }}>
        
        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', position: 'relative' }}>
          <h1 style={{ color: 'var(--btn-primary)', margin: 0, textAlign: 'center' }}>MendoHard</h1>
          <button 
            className="btn-primary" 
            id="btn-registrar-administrador"
            onClick={() => navigate('/responsable/registrar')}
            style={{ position: 'absolute', right: 0, padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Registrar nuevo administrador
          </button>
        </div>

        <h2 style={{ marginBottom: '1rem', color: '#1E293B', textAlign: 'left', fontWeight: 700 }}>
          Buen día {nombre}
        </h2>
        
        {/* Sección de Métricas (3 Columnas) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1rem', alignItems: 'start' }}>
          
          {/* Columna 1: Vendedores Pendientes */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#1E293B', fontWeight: 600, textAlign: 'center' }}>Vendedores Pendientes</span>
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid var(--border-light)', 
              borderRadius: '8px', 
              width: '100%',
              padding: '1.5rem', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>
                {vendedoresPendientes}
              </span>
            </div>
            <button className="btn-primary" style={{ width: '100%', fontSize: '0.95rem' }} onClick={() => navigate('/admin/validar-vendedor')}>Validar vendedor</button>
          </div>

          {/* Columna 2: Usuarios Totales */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#1E293B', fontWeight: 600, textAlign: 'center' }}>Usuarios Totales</span>
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid var(--border-light)', 
              borderRadius: '8px', 
              width: '100%',
              padding: '1.5rem', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>
                {usuariosTotales}
              </span>
            </div>
          </div>

          {/* Columna 3: Comercios Activos */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#1E293B', fontWeight: 600, textAlign: 'center' }}>Comercios Activos</span>
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid var(--border-light)', 
              borderRadius: '8px', 
              width: '100%',
              padding: '1.5rem', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>
                {comerciosActivos}
              </span>
            </div>
            <button className="btn-primary" style={{ width: '100%', fontSize: '0.95rem' }} onClick={() => navigate('/admin/validar-comercio')}>Validar comercio</button>
          </div>

        </div>
        
        {/* Botón de cerrar sesión alineado abajo */}
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--border-error)', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Nunito', fontSize: '0.9rem' }}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Segundo Contenedor (Panel de Acciones Inferior) */}
      <div className="card" style={{ width: '100%', maxWidth: '900px', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 0.5rem' }} onClick={() => navigate('/usuarios/inhabilitar')}>Inhabilitar Usuario</button>
          <button 
            className="btn-primary" 
            style={{ 
              fontSize: '0.85rem', 
              padding: '0.6rem 0.5rem',
              cursor: 'not-allowed'
            }}
            title="Módulo proyectado para la Versión 2.0 (Gobernanza de Seguridad)"
          >
            Gestionar la manera en que se persisten las claves
          </button>
          <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 0.5rem' }} onClick={() => navigate('/gestionar-roles')}>Gestionar Roles / Permisos</button>
          <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 0.5rem' }} onClick={() => navigate('/admin/componentes')}>Gestionar Componentes de Hardware</button>
        </div>
      </div>

    </div>
  );
};
