/* Models to be used by the UI */

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  lastUpdate: Date;
}

interface ContactList {
  totalContactCount: number;
  lastEvaluatedUserKey?: string;
  contacts: Contact[];
}

interface ContactUpsertResult {
  totalContactCount: number;
  contact: Contact;
}

interface ContactDeleteResult {
  totalContactCount: number;
  deletedContact: Contact;
}

export type {
  Contact,
  ContactList,
  ContactUpsertResult,
  ContactDeleteResult
};
