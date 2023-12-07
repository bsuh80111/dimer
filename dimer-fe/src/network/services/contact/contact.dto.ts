import { Contact, ContactDeleteResult, ContactList, ContactUpsertResult } from 'src/models/Contact';
import { ResponseBody } from 'src/network/httpClient';

/* DTOs and transformer functions for the Contact model. */

interface ContactDTO {
  id: string;
  userName: string;
  userNameIndex: string;
  phoneNumber: string;
  lastUpdate: string;
}

interface ContactListDTO extends ResponseBody {
  totalUserCount: number;
  users: ContactDTO[];
  lastEvaluatedUserKey?: string;
}

type ContactUpsertPayloadDTO = Partial<Omit<ContactDTO, 'userNameIndex' | 'lastUpdate'>>;

interface ContactUpsertResponseDTO extends ResponseBody {
  user: ContactDTO;
  totalUserCount: number;
}

interface ContactDeleteResponseDTO extends ResponseBody {
  deletedUser: ContactDTO;
  totalUserCount: number;
}

const transformContactListDTO = ({ totalUserCount, lastEvaluatedUserKey, users }: ContactListDTO): ContactList => {
  return {
    totalContactCount: totalUserCount,
    lastEvaluatedUserKey,
    contacts: users.map(transformContactDTO)
  };
};

const transformContactDTO = (contact: ContactDTO): Contact => {
  return {
    id: contact.id,
    name: contact.userName,
    phoneNumber: contact.phoneNumber,
    lastUpdate: new Date(contact.lastUpdate)
  };
};

const transformContactUpsertPayloadDTO = ({ id, name, phoneNumber }: Partial<Contact>): ContactUpsertPayloadDTO => {
  return { id, userName: name, phoneNumber };
};

const transformContactUpsertResponseDTO = (response: ContactUpsertResponseDTO): ContactUpsertResult => {
  return {
    contact: transformContactDTO(response.user),
    totalContactCount: response.totalUserCount
  };
};

const transformContactDeleteResponseDTO = (response: ContactDeleteResponseDTO): ContactDeleteResult => {
  return {
    deletedContact: transformContactDTO(response.deletedUser),
    totalContactCount: response.totalUserCount
  };
};

export {
  transformContactDTO,
  transformContactListDTO,
  transformContactUpsertPayloadDTO,
  transformContactUpsertResponseDTO,
  transformContactDeleteResponseDTO
};
export type { 
  ContactDTO,
  ContactListDTO,
  ContactUpsertPayloadDTO,
  ContactUpsertResponseDTO,
  ContactDeleteResponseDTO
};
