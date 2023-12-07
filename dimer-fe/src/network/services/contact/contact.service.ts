import { Contact, ContactDeleteResult, ContactList, ContactUpsertResult } from 'src/models/Contact';
import { ContactDeleteResponseDTO, ContactListDTO, ContactUpsertPayloadDTO, ContactUpsertResponseDTO, transformContactDeleteResponseDTO, transformContactListDTO, transformContactUpsertPayloadDTO, transformContactUpsertResponseDTO } from 'src/network/services/contact/contact.dto';
import { deleteRequest, getRequest, postRequest } from 'src/network/httpClient';


interface GetContactsParams {
  searchString?: string;
  lastEvaluatedUserKey?: string;
}

interface UpsertContactParams {
  contact: Partial<Contact>;
}

/**
 * Retreives contact list from the server.
 * @param GetContactsParams "Cursor" (for infinite scroll) and/or filter string parameters.
 * @returns Contact list object containing contacts, total count, and "cursor" for infinite scroll.
 */
const getAllContacts = async ({ searchString, lastEvaluatedUserKey }: GetContactsParams): Promise<ContactList> => {
  return await getRequest<ContactListDTO, ContactList>({
    route: '/user',
    urlParams: { 'name': searchString, lastEvaluatedUserKey },
    transformResponse: transformContactListDTO
  }) as ContactList;
};

/**
 * Upserts contact.
 * @param UpsertContactParams 
 * @returns ContactUpsertResult object containing the upserted contact and updated total contact count.
 */
const upsertContact = async ({
  contact
}: UpsertContactParams): Promise<ContactUpsertResult> => {
  return await postRequest<Partial<Contact>, ContactUpsertPayloadDTO, ContactUpsertResponseDTO, ContactUpsertResult>({
    body: contact,
    route: '/user',
    transformBody: transformContactUpsertPayloadDTO,
    transformResponse: transformContactUpsertResponseDTO
  }) as ContactUpsertResult;
};

/**
 * Deletes contact.
 * @param contactId ID of the contact to delete.
 * @returns ContactDeleteResult object containing deleted contact and updated total contact count.
 */
const deleteContact = async (contactId: string): Promise<ContactDeleteResult> => {
  return await deleteRequest<ContactDeleteResponseDTO, ContactDeleteResult>({
    route: `/user/${contactId}`,
    transformResponse: transformContactDeleteResponseDTO
  }) as ContactDeleteResult;
};

export {
  getAllContacts,
  upsertContact,
  deleteContact
};
export type {
  GetContactsParams,
  UpsertContactParams
};
