import { createPortal } from 'react-dom';
import { useSnackbar } from '../context/SnackbarContext';

export function Snackbar() {
  const { snackbar } = useSnackbar();

  if (!snackbar.open) return null;

  const container = document.getElementById('snackbar-root');
  if (!container) return null;

  // Configurações de estilo - AJUSTADO
  const CONTAINER_STYLES = {
    // POSIÇÃO FIXA ABAIXO DO HEADER/BOTÕES
    position: 'fixed',
    top: '70px', // ↓ Aumentado para ficar ABAIXO dos botões
    right: '24px',
    // LAYOUT
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    // HIERARQUIA
    zIndex: 999999,
    // RESET DE POSIÇÃO
    left: 'auto',
    bottom: 'auto',
    width: 'auto',
    height: 'auto',
    justifyContent: 'flex-start',
    margin: 0,
    padding: 0,
    transform: 'none',
    pointerEvents: 'none'
  };

  // Estilo base da mensagem
  const BASE_MESSAGE_STYLES = {
    minWidth: '280px',
    maxWidth: '360px',
    padding: '14px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    pointerEvents: 'auto',
    marginBottom: '10px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.4',
    wordBreak: 'break-word',
    animation: 'snackbarSlideIn 0.3s ease-out'
  };

  // Cores por tipo
  const TYPE_COLORS = {
    success: '#16a34a',
    error: '#dc2626', 
    warning: '#d97706',
    info: '#2563eb'
  };

  return createPortal(
    <div style={CONTAINER_STYLES}>
      <div 
        style={{
          ...BASE_MESSAGE_STYLES,
          backgroundColor: TYPE_COLORS[snackbar.type] || TYPE_COLORS.info
        }}
      >
        {snackbar.message}
      </div>
    </div>,
    container
  );
}