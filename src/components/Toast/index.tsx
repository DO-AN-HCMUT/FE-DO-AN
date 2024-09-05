import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';

/* eslint-disable no-tabs */
type ToastProps = {
  type: 'success' | 'error';
  message: string;
};
export default function Toast(props: ToastProps) {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.type} variant='filled' sx={{ width: '100%' }}>
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
