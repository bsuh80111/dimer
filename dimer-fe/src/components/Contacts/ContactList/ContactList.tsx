import { Button, IconButton, LinearProgress, Menu, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { deleteContact, getAllContacts } from 'src/network/services/contact/contact.service';
import { forwardRef, startTransition, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { useMutation, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import { Contact } from 'src/models/Contact';
import { ContactForm } from 'src/components/Contacts/ContactForm/ContactForm';
import { DialogContext } from 'src/components/Dialog/DialogProvider';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ContactListProps {
  searchString?: string;
}

interface ContactListRef {
  appendContact: (contact: Contact) => void;
  setTotalContactCount: (count: number) => void;
}

const ContactList = forwardRef<ContactListRef, ContactListProps>(({
  searchString
}: ContactListProps, ref) => {
  const dialogContext = useContext(DialogContext);
  const {
    data,
    hasNextPage,
    isFetching,
    fetchNextPage
  } = useSuspenseInfiniteQuery({
    queryKey: ['contacts', searchString],
    queryFn: ({ pageParam }) => getAllContacts({ searchString, lastEvaluatedUserKey: pageParam }),
    initialPageParam: '',
    getNextPageParam: (lastPage,) => lastPage.lastEvaluatedUserKey,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: deleteContact,
    onSuccess: (data) => {
      const index = _contacts.findIndex((c) => c.id === data.deletedContact.id);
      if (index) {
        _setContacts(_contacts.toSpliced(index, 1));
        _setTotalContactCount(data.totalContactCount);
      }
    }
  });
  const [_contacts, _setContacts] = useState<Contact[]>([]);
  const [_totalContactCount, _setTotalContactCount] = useState<number>(0);
  const [_selectedContact, _setSelectedContact] = useState<Contact>();
  const [_menuAnchor, _setMenuAnchor] = useState<null | HTMLElement>(null); // Element to anchor the menu element onto

  /**
   * Opens the options menu
   * @param event Click event containing the target button element to anchor the menu
   */
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, contact: Contact) => {
    _setSelectedContact(contact);
    _setMenuAnchor(event.currentTarget);
  };

  /**
   * Closes the expanded options menu
   */
  const closeMenu = () => {
    _setMenuAnchor(null);
  };

  /**
   * Open dialog to edit contact
   */
  const handleEditContact = () => {
    dialogContext.openDialog({
      dialogContent: (
        <ContactForm
          contact={_selectedContact}
          onCancel={dialogContext.closeDialog}
          onSuccess={(result) => {
            dialogContext.closeDialog();
            const index = _contacts.findIndex((c) => c.id === result.contact.id);
            if (index >= 0) {
              const contactsCopy = [..._contacts];
              contactsCopy.splice(index, 1, result.contact);
              _setContacts(contactsCopy);
            }
          }} />
      ),
      title: 'Edit Contact',
      showDialogActions: false
    });
  };

  /**
   * Opens dialog to confirm contact delete
   */
  const handleDeleteContact = () => {
    dialogContext.openDialog({
      dialogContent: `Are you sure you want to delete ${_selectedContact?.name ?? 'this contact'}?`,
      showDialogActions: true,
      warningDialog: true,
      onCancel: () => _setSelectedContact(undefined),
      onPrimaryAction: () => {
        if (_selectedContact) {
          mutate(_selectedContact.id);
        }
      },
      primaryActionText: 'Delete'
    });
  };

  const setTotalContactCount = (count: number) => {
    _setTotalContactCount(count);
  };

  const appendContact = (contact: Contact) => {
    _setContacts([..._contacts, contact]);
  };

  /**
   * Compiles the "paginated" contacts list retrieved from the server into one list
   */
  useEffect(() => {
    if (data?.pages) {
      if (data?.pages.length === 0) {
        console.log('zero data');
        _setContacts(data.pages[0].contacts);
      } else {
        // Merge results and check for duplicates
        const allContacts = data.pages.reduce<Contact[]>((allContacts, contactList) => {
          for (let i = 0; i < contactList.contacts.length; i++) {
            const contactToPush = contactList.contacts[i];
            if (!allContacts.find((c) => c.id === contactToPush.id)) {
              allContacts.push(contactToPush);
            }
          }
          return allContacts;
        }, []);
        _setContacts(allContacts);
        setTotalContactCount(data.pages[data.pages.length - 1].totalContactCount); // Set contact count to most recent total
      }
    }
  }, [data]);

  useImperativeHandle(ref, () => ({
    appendContact,
    setTotalContactCount
  }));

  return (
    <article>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell align='right'></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            _contacts.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.phoneNumber}</TableCell>
                <TableCell align='right'>
                  <IconButton
                    onClick={(e) => openMenu(e, c)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      {/* Options menu -- only need to create one instance and change the anchor element */}
      <Menu
        anchorEl={_menuAnchor}
        open={Boolean(_menuAnchor)}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'top'
        }}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        onClose={closeMenu}
      >
        <MenuItem onClick={() => {
          handleEditContact();
          closeMenu();
        }}>Edit</MenuItem>
        <MenuItem onClick={() => {
          handleDeleteContact();
          closeMenu();
        }}><Typography color={'error'}>Delete</Typography></MenuItem>
      </Menu>

      {/* If contact list is paginated, display option to load more */}
      <Stack justifyContent='center'>
        {(isFetching || isPending) &&
          <LinearProgress color='secondary' />
        }
        {!isFetching && hasNextPage &&
          <Button
            variant='text'
            size='large'
            color='secondary'
            startIcon={<AddIcon />}
            onClick={() => startTransition(() => { fetchNextPage(); })}
          >
            Load More Contacts
          </Button>
        }
      </Stack>

      {data?.pages[0]?.totalContactCount &&
        <p style={{ textAlign: 'right' }}>Total: {_totalContactCount}</p>
      }
    </article>
  );
});

export { ContactList };
export type { ContactListProps, ContactListRef };
