import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vendedorService } from '../../services/vendedorService';

import { DataInconsistencyModal } from '../../components/modals/DataInconsistencyModal';
import { ResourceNotFoundModal } from '../../components/modals/ResourceNotFoundModal';
import { ServerErrorModal } from '../../components/modals/ServerErrorModal';

export const ValidateVendorDetailPage = () => {
  const navigate = useNavigate();
  const { uCodigo } = useParams();
  const [vendedor, setVendedor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showDataInconsistency, setShowDataInconsistency] = useState(false);
  const [showResourceNotFound, setShowResourceNotFound] = useState(false);
  const [showServerError, setShowServerError] = useState(false);

  useEffect(() => {
    const fetchVendedor = async () => {
      try {
        const data = await vendedorService.getVendedorPendienteByCodigo(uCodigo);
        setVendedor(data);
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
    fetchVendedor();
  }, [uCodigo]);

  const handleDecision = async (decision) => {
    try {
      await vendedorService.validarVendedor(uCodigo, decision);
      navigate('/admin/validar-vendedor', { replace: true });
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) setShowDataInconsistency(true);
        else if (status === 404) setShowResourceNotFound(true);
        else if (status === 500) setShowServerError(true);
      }
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    if (Array.isArray(fecha)) {
      // Assuming [YYYY, MM, DD]
      const [year, month, day] = fecha;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return fecha; // If it's already a string "YYYY-MM-DD"
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>;
  }

  if (!vendedor) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        No se pudo cargar la información del vendedor.
        <br/>
        <button onClick={() => navigate('/admin/validar-vendedor', { replace: true })} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Volver</button>
      </div>
    );
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
        <span style={{ fontSize: '1.2rem', color: '#475569', fontWeight: '600' }}>¿Acepta o Rechaza a Vendedor seleccionado?</span>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Tarjeta 1: Datos del Vendedor */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1E293B', fontSize: '1.2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>Datos del Vendedor</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: '#334155', fontWeight: 'bold' }}>{vendedor.uNombre} {vendedor.uApellido}</span>
            <span style={{ color: '#334155' }}>Teléfono: {vendedor.vTelefono}</span>
            <span style={{ color: '#334155' }}>Email: {vendedor.uEmail}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: '#334155' }}>Cuil: {vendedor.vCuit}</span>
            <span style={{ color: '#334155' }}>Razón social: {vendedor.vRazonSocial || '-'}</span>
            <span style={{ color: '#334155' }}>Categoría fiscal: {vendedor.vCategoriaFiscal}</span>
          </div>
        </div>

        {/* Tarjeta 2: Datos del Comercio */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1E293B', fontSize: '1.2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>Datos del Comercio</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: '#334155', fontWeight: 'bold' }}>Comercio: {vendedor.cNombreFantasia}</span>
            <span style={{ color: '#334155' }}>Teléfono: {vendedor.cTelefono}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: '#334155' }}>Latitud: {vendedor.cLatitud}</span>
            <span style={{ color: '#334155' }}>Longitud: {vendedor.cLongitud}</span>
            <span style={{ color: '#334155' }}>Fecha Solicitud: {formatFecha(vendedor.cFechaSolicitud)}</span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '1rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: '#334155' }}>Horario atención: {vendedor.cHorarioAtencion}</span>
            <span style={{ color: '#334155' }}>País: {vendedor.pNombre}</span>
            <span style={{ color: '#334155' }}>Provincia: {vendedor.proNombre}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: '#334155' }}>Dirección Calle: {vendedor.cDireccionCalle}</span>
            <span style={{ color: '#334155' }}>Departamento: {vendedor.dNombre}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: '#334155' }}>Numero: {vendedor.cNumeroEnCalle}</span>
          </div>
        </div>

        {/* Botones de Decisión */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
          <button 
            onClick={() => handleDecision('Aceptar')}
            style={{
              backgroundColor: '#86EFAC',
              color: '#1E293B',
              fontWeight: 'bold',
              padding: '0.75rem 2rem',
              border: '1px solid #4ADE80',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              minWidth: '120px',
              transition: 'opacity 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Aceptar
          </button>
          
          <button 
            onClick={() => handleDecision('Rechazar')}
            style={{
              backgroundColor: '#FCA5A5',
              color: '#1E293B',
              fontWeight: 'bold',
              padding: '0.75rem 2rem',
              border: '1px solid #F87171',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              minWidth: '120px',
              transition: 'opacity 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Rechazar
          </button>
        </div>

      </div>

      </div> {/* FIN TARJETA MADRE */}

      {/* Modales */}
      <DataInconsistencyModal isOpen={showDataInconsistency} onClose={() => setShowDataInconsistency(false)} />
      <ResourceNotFoundModal isOpen={showResourceNotFound} onClose={() => setShowResourceNotFound(false)} />
      <ServerErrorModal isOpen={showServerError} onClose={() => setShowServerError(false)} />
    </div>
  );
};
