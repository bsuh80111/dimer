import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { PropsWithChildren, ReactNode, createContext, useState } from 'react';

interface DialogContextProps {
  openDialog: (params: DialogParams) => void;
  closeDialog: () => void;
}

interface DialogParams {
  title?: string;
  dialogContent: string | ReactNode;
  showDialogActions?: boolean;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  onCancel?: () => void;
}

const DialogContext = createContext<DialogContextProps>({
  openDialog: () => { },
  closeDialog: () => { }
});

const DialogProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState<boolean>(false);
  const [dialogParams, setDialogParams] = useState<DialogParams>({
    dialogContent: '',
    showDialogActions: false
  });

  const openDialog = (params: DialogParams) => {
    setDialogParams({ ...dialogParams, ...params });
    setOpen(true);
  };

  const closeDialog = () => {
    dialogParams.onCancel?.();
    setOpen(false);
  };

  const handlePrimaryAction = () => {
    dialogParams.onPrimaryAction?.();
    setOpen(false);
  };

  return (
    <DialogContext.Provider value={{
      openDialog,
      closeDialog
    }}>
      <Dialog
        open={open}
        onClose={closeDialog}
      >
        {dialogParams.title && <DialogTitle>{dialogParams.title}</DialogTitle>}
        <DialogContent>
          {typeof dialogParams.dialogContent === 'string' && <DialogContentText>{dialogParams.dialogContent}</DialogContentText>}
          {typeof dialogParams.dialogContent !== 'string' && dialogParams.dialogContent}
        </DialogContent>


        {dialogParams.showDialogActions &&
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handlePrimaryAction}>{dialogParams.primaryActionText}</Button>
          </DialogActions>
        }
      </Dialog>

      {children}
    </DialogContext.Provider>
  );
};

export { DialogContext, DialogProvider };
export type { DialogParams };
