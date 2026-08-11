import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gestionarRolesService } from '../services/gestionarRolesService';

export const GestionarRolesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOptionClick = async (opcion, routeTarget) => {
    try {
      setLoading(true);
      await gestionarRolesService.registrarOpcionNavegacion(opcion);
      if (routeTarget) {
        navigate(routeTarget, { replace: true });
      }
    } catch (error) {
      console.error('Error al registrar opción:', error);
      // Opcional: mostrar un modal de error si el servidor falla (ej: 500)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#CBD5E1',
      padding: '1rem',
      fontFamily: 'Nunito, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#1E293B', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>MendoHard</h1>
        <h2 style={{ color: '#334155', fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>Gestionar Roles / Permisos</h2>
        <p style={{ color: '#64748B', marginBottom: '2rem', textAlign: 'center' }}>Seleccionar una de estas opciones</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <button 
            className="btn-primary"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              backgroundColor: '#4A7BB0', 
              color: '#1E293B', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'not-allowed'
            }}
            title="Módulo proyectado para la Versión 2.0 (Gobernanza de Seguridad)"
          >
            Dar de alta, modificar o dar de baja un Rol
          </button>
          <button 
            className="btn-primary"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              backgroundColor: '#4A7BB0', 
              color: '#1E293B', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'not-allowed'
            }}
            title="Módulo proyectado para la Versión 2.0 (Gobernanza de Seguridad)"
          >
            Dar de alta, modificar o dar de baja un Permiso
          </button>
          <button 
            className="btn-primary"
            onClick={() => handleOptionClick('Asignar Permiso', '/gestionar-roles/asignar')}
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 'bold', backgroundColor: '#4A7BB0', color: '#1E293B', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Asignar Permiso
          </button>
          <button 
            className="btn-primary"
            onClick={() => handleOptionClick('Quitar Permiso', '/gestionar-roles/quitar')}
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 'bold', backgroundColor: '#4A7BB0', color: '#1E293B', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Quitar Permiso
          </button>
        </div>
      </div>
    </div>
  );
};
