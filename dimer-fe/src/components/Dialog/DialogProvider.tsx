import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { PropsWithChildren, ReactNode, createContext, useState } from 'react';

interface DialogContextProps {
  openDialog: (params: DialogParams) => void;
  closeDialog: () => void;
}

interface DialogParams {
  title?: string;
  dialogContent: string | ReactNode;
  showDialogActions?: boolean;
  warningDialog?: boolean;
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
    showDialogActions: false,
    warningDialog: false
  });

  const openDialog = (params: DialogParams) => {
    setDialogParams({ ...dialogParams, ...params });
    setOpen(true);
  };

  const closeDialog = () => {
    resetDialog();
    setOpen(false);
  };

  const handleCancel = () => {
    dialogParams.onCancel?.();
    closeDialog();
  };

  const handlePrimaryAction = () => {
    dialogParams.onPrimaryAction?.();
    closeDialog();
  };

  const resetDialog = () => {
    setDialogParams({
      dialogContent: '',
      showDialogActions: false,
      warningDialog: false
    });
  };

  return (
    <DialogContext.Provider value={{
      openDialog,
      closeDialog
    }}>
      <Dialog
        open={open}
        maxWidth={'sm'}
        fullWidth={true}
        onClose={closeDialog}
      >
        {dialogParams.title && <DialogTitle>{dialogParams.title}</DialogTitle>}
        <DialogContent>
          <Box paddingTop={'8px'}>
            {typeof dialogParams.dialogContent === 'string' && <DialogContentText>{dialogParams.dialogContent}</DialogContentText>}
            {typeof dialogParams.dialogContent !== 'string' && dialogParams.dialogContent}
          </Box>
        </DialogContent>


        {dialogParams.showDialogActions &&
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              variant='contained'
              onClick={handlePrimaryAction}
              color={dialogParams.warningDialog ? 'error' : 'primary'}
            >{dialogParams.primaryActionText}</Button>
          </DialogActions>
        }
      </Dialog>

      {children}
    </DialogContext.Provider>
  );
};

export { DialogContext, DialogProvider };
export type { DialogParams };
