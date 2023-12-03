import { Button, IconButton, LinearProgress, Menu, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Contact, getAllContacts } from 'src/network/services/contact.service';
import { startTransition, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

interface ContactListProps {
  searchString?: string;
}

const ContactList = ({
  searchString
}: ContactListProps) => {
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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null); // Element to anchor the menu element onto

  /**
   * Opens the options menu
   * @param event Click event containing the target button element to anchor the menu
   */
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  /**
   * Closes the expanded options menu
   */
  const closeMenu = () => {
    setMenuAnchor(null);
  };

  /**
   * Compiles the "paginated" contacts list retrieved from the server into one list
   */
  useEffect(() => {
    if (data?.pages) {
      if (data?.pages.length === 0) {
        setContacts(data.pages[0].contacts);
      } else {
        setContacts(
          data.pages.reduce<Contact[]>((allContacts, contact) => {
            allContacts.push(...contact.contacts);
            return allContacts;
          }, [])
        );
      }
    }
  }, [data]);

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
            contacts.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.phoneNumber}</TableCell>
                <TableCell align='right'>
                  <IconButton
                    onClick={openMenu}
                  >
                    <MoreVertIcon />
                  </IconButton>

                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
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
                    <MenuItem onClick={closeMenu}>Edit</MenuItem>
                    <MenuItem onClick={closeMenu}><Typography color={'error'}>Delete</Typography></MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      {/* If contact list is paginated, display option to load more */}
      <Stack justifyContent='center'>
        {isFetching &&
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
        <p style={{ textAlign: 'right' }}>Total: {data.pages[0].totalContactCount}</p>
      }
    </article>
  );
};

export { ContactList };
export type { ContactListProps };
