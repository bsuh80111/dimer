import { Button, Stack, TextField } from '@mui/material';
import { Contact, ContactUpsertResult } from 'src/models/Contact';
import { FormEvent, useRef } from 'react';
import { upsertContact } from 'src/network/services/contact/contact.service';
import { useMutation } from '@tanstack/react-query';

interface ContactFormProps {
  contact?: Contact;
  onSuccess: (result: ContactUpsertResult) => void;
  onCancel: () => void;
}

const ContactForm = ({
  contact,
  onSuccess,
  onCancel
}: ContactFormProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: upsertContact,
    onSuccess: (data) => {
      console.log('success', data);
      onSuccess(data);
    }
  });

  const nameField = useRef<HTMLInputElement>(null);
  const phoneNumberField = useRef<HTMLInputElement>(null);

  const saveContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ 
      contact: {
        id: contact?.id,
        name: nameField.current?.value,
        phoneNumber: phoneNumberField.current?.value
      }
    });
  };

  return (
    <form
      onSubmit={saveContact}
    >
      <Stack
        direction={'column'}
        gap={'12px'}
      >
        <TextField
          inputRef={nameField}
          type='text'
          id='contact-name-field'
          name='name'
          label='Name'
          disabled={isPending}
          defaultValue={contact?.name}
          fullWidth={true}
          inputMode='text'
          autoFocus
        />
        <TextField
          inputRef={phoneNumberField}
          type='tel'
          id='contact-number-field'
          name='phoneNumber'
          label='Phone Number'
          disabled={isPending}
          defaultValue={contact?.phoneNumber}
          inputMode='tel'
          fullWidth={true}
        />

        <Stack
          direction='row'
          gap='8px'
          justifyContent='flex-end'
        >
          <Button
            type='button'
            disabled={isPending}
            onClick={onCancel}
          >Cancel</Button>
          <Button
            type='submit'
            variant='contained'
            disabled={isPending}
          >Save</Button>
        </Stack>
      </Stack>
    </form>
  );
};

export { ContactForm };
export type { ContactFormProps };
