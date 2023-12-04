import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { ReactNode } from 'react';

interface GenericDialogProps {
  open: boolean;
  title?: string;
  contentText?: string;
  children?: ReactNode;
  primaryActionText: string;
  onCancel: () => void;
  onPrimaryAction: () => void;
}

const GenericDialog = ({
  open,
  title,
  contentText,
  children,
  primaryActionText,
  onCancel,
  onPrimaryAction
}: GenericDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {contentText && <DialogContentText>{contentText}</DialogContentText>}
        {children}
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onPrimaryAction}>{primaryActionText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export { GenericDialog as Dialog };
export type { GenericDialogProps as DialogProps };
