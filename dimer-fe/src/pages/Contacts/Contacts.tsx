import { Button, InputAdornment, TextField, debounce } from "@mui/material";
import { ChangeEvent, Suspense, useState } from "react";
import { ContactList } from "src/components/Contacts/ContactList/ContactList";
import { ErrorBoundary } from "react-error-boundary";
import { Search } from "@mui/icons-material";
import styles from 'src/pages/Contacts/Contacts.module.scss';

const Contacts = () => {
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
          <ContactList searchString={searchString} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export { Contacts };

