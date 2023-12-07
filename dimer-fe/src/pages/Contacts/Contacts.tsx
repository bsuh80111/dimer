import { Button, InputAdornment, TextField, debounce } from '@mui/material';
import { ChangeEvent, Suspense, useContext, useRef, useState } from 'react';
import { ContactList, ContactListRef } from 'src/components/Contacts/ContactList/ContactList';
import { ContactForm } from 'src/components/Contacts/ContactForm/ContactForm';
import { DialogContext } from 'src/components/Dialog/DialogProvider';
import { ErrorBoundary } from 'react-error-boundary';
import { Search } from '@mui/icons-material';
import styles from 'src/pages/Contacts/Contacts.module.scss';

const Contacts = () => {
  const contactTable = useRef<ContactListRef>(null);
  const dialogContext = useContext(DialogContext);
  const [searchString, setSearchString] = useState<string | undefined>();

  /**
   * Debounces user input into the search box
   */
  const handleSearchInput = debounce((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setSearchString(event.target.value);
    } else {
      setSearchString(undefined);
    }
  }, 1000);

  return (
    <>
      <header className={styles['contact-page']}>
        <h1>Contacts</h1>
      </header>

      {/* Contact Table Options */}
      <div className={styles.options}>
        <Button
          type="button"
          color="primary"
          variant="contained"
          onClick={() => {
            dialogContext.openDialog({
              dialogContent: (
                <ContactForm
                  onCancel={dialogContext.closeDialog}
                  onSuccess={(result) => {
                    dialogContext.closeDialog();
                    contactTable.current?.appendContact(result.contact);
                    contactTable.current?.setTotalContactCount(result.totalContactCount);
                  }}
                />
              ),
              title: 'Add Contact',
              showDialogActions: false
            });
          }}
        >Add Contact</Button>

        <TextField
          color="secondary"
          label="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          variant="standard"
          onChange={handleSearchInput}
        />
      </div>

      {/* Contact List Table */}
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading</div>}>
          <ContactList searchString={searchString} ref={contactTable} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export { Contacts };

