import { createContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Typography, Slide, AlertColor } from '@mui/material';

type SnackbarContextType = {
  showSnackbar: (value: string, variant: AlertColor) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const handleClose = (): void => {
    setOpen(false);
  };

  const showSnackbar: SnackbarContextType['showSnackbar'] = useCallback(
    (value, variant = 'info') => {
      setMessage(value);
      setSeverity(variant);
      setOpen(true);
    },
    [],
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          elevation={6}
          variant="filled"
          sx={{
            minWidth: 300,
            color: 'white',
          }}
        >
          <Typography variant="body1">{message}</Typography>
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
