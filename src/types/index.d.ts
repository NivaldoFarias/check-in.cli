declare module 'react-mobile-datepicker';

type Commons = {
  full_name: string;
  social_name: string;
  birthdate: string;
  insurance: string;
};
type Registries = {
  gender: string;
  cpf: string;
  assigned_at_birth: string;
  described_idendity?: string;
  described_assigned?: string;
  phone_number: string;
};
type Addresses = {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
};
type Forms = {
  common: Commons;
  registry: Registries;
  address: Addresses;
};

export { Commons, Registries, Addresses, Forms };
