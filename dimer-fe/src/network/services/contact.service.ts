import { get } from 'src/network/httpClient';

interface ContactListDTO {
  totalUserCount: number;
  users: ContactDTO[];
  lastEvaluatedUserKey?: string;
}

interface ContactDTO {
  id: string;
  userName: string;
  userNameIndex: string;
  phoneNumber: string;
  lastUpdate: string;
}

interface ContactList {
  totalContactCount: number;
  lastEvaluatedUserKey?: string;
  contacts: Contact[];
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  lastUpdate: Date;
}

interface GetContactsParams {
  searchString?: string;
  lastEvaluatedUserKey?: string;
}

/**
 * Retreives contact list from the server.
 * @param GetContactsParams "Cursor" (for infinite scroll) and/or filter string parameters.
 * @returns Contact list object containing contacts, total count, and "cursor" for infinite scroll.
 */
const getAllContacts = async ({ searchString, lastEvaluatedUserKey }: GetContactsParams): Promise<ContactList> => {
  return await get<ContactListDTO, ContactList>({
    route: '/user',
    urlParams: { 'name': searchString, lastEvaluatedUserKey },
    transform: ({ totalUserCount, lastEvaluatedUserKey, users }) => {
      return {
        totalContactCount: totalUserCount,
        lastEvaluatedUserKey,
        contacts: users.map((u) => ({
          id: u.id,
          name: u.userName,
          phoneNumber: u.phoneNumber,
          lastUpdate: new Date(u.lastUpdate)
        }))
      };
    }
  }) as ContactList;
};

export { getAllContacts };
export type { Contact, ContactList };
