import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendedorService } from '../../services/vendedorService';

import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

export const ValidateVendorListPage = () => {
  const navigate = useNavigate();
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showDataInconsistency, setShowDataInconsistency] = useState(false);
  const [showResourceNotFound, setShowResourceNotFound] = useState(false);
  const [showServerError, setShowServerError] = useState(false);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const data = await vendedorService.getVendedoresPendientes();
        setVendedores(data);
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          if (status === 400) setShowDataInconsistency(true);
          else if (status === 404) setShowResourceNotFound(true);
          else if (status === 500) setShowServerError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVendedores();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#CBD5E1',
      padding: '2rem',
      fontFamily: 'Nunito, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* TARJETA MADRE CONTENEDORA */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '1000px',
        padding: '2.5rem 2rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1E293B', margin: '0' }}>MendoHard</h1>
        <h2 style={{ fontSize: '1.5rem', color: '#334155', margin: '0.5rem 0' }}>Validar Vendedor</h2>
        <span style={{ fontSize: '1.2rem', color: '#475569', fontWeight: '600' }}>Seleccionar un Vendedor</span>
      </div>

      {/* Lista de Vendedores */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {vendedores.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#334155', fontSize: '1.2rem', fontWeight: 'bold' }}>
            No hay vendedores pendientes de validación.
          </p>
        ) : (
          vendedores.map((vendedor) => (
            <div key={vendedor.uCodigo} style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ color: '#334155', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {vendedor.uNombre} {vendedor.uApellido}
                </span>
                <span style={{ color: '#334155' }}>Teléfono: {vendedor.vTelefono}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ color: '#334155' }}>Cuil: {vendedor.vCuit}</span>
                <span style={{ color: '#334155' }}>Razón social: {vendedor.vRazonSocial || '-'}</span>
                <span style={{ color: '#334155' }}>Categoría fiscal: {vendedor.vCategoriaFiscal}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ color: '#334155' }}>Email: {vendedor.uEmail}</span>
                
                <button 
                  onClick={() => navigate(`/admin/validar-vendedor/${vendedor.uCodigo}`)}
                  style={{
                    backgroundColor: '#4A7BB0',
                    color: '#1E293B',
                    fontWeight: 'bold',
                    padding: '0.5rem 1.5rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.9'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  Seleccionar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      </div> {/* FIN TARJETA MADRE */}

      {/* Modales */}
      <DataInconsistencyModal isOpen={showDataInconsistency} onClose={() => setShowDataInconsistency(false)} />
      <ResourceNotFoundModal isOpen={showResourceNotFound} onClose={() => setShowResourceNotFound(false)} />
      <ServerErrorModal isOpen={showServerError} onClose={() => setShowServerError(false)} />
    </div>
  );
};
