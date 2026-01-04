import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef
} from 'react';

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'info'
  });

  const timerRef = useRef(null);

  const show = useCallback((message, type = 'info') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setSnackbar({ open: true, message, type });

    timerRef.current = setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 4000);
  }, []);

  const value = {
    success: msg => show(msg, 'success'),
    error: msg => show(msg, 'error'),
    warning: msg => show(msg, 'warning'),
    info: msg => show(msg, 'info'),
    snackbar
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
}
