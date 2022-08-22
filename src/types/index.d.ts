import { Dispatch, SetStateAction } from 'react';

declare module 'react-mobile-datepicker';

interface Commons {
  full_name: string;
  first_name: string;
  birthdate: string;
  insurance: string;
  password: string;
  cpf: string;
}
interface Registries {
  gender: string;
  assigned_at_birth: string;
  described_identity?: string;
  described_assigned?: string;
  phone_number: string;
}
interface Addresses {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
}

interface IsSectionCompleteState {
  common: boolean;
  registry: boolean;
  address: boolean;
}

type DispatchBoolean = Dispatch<SetStateAction<boolean>>;

type DataContextGroup = {
  isSectionComplete: IsSectionCompleteState;
  setIsSectionComplete: Dispatch<SetStateAction<IsSectionCompleteState>>;
  selectInsurance: boolean;
  setSelectInsurance: DispatchBoolean;
  selectGender: boolean;
  setSelectGender: DispatchBoolean;
  selectAssigned: boolean;
  setSelectAssigned: DispatchBoolean;
  hasSubmitted: boolean;
  setHasSubmitted: DispatchBoolean;
  updateHeight: boolean;
  setUpdateHeight: DispatchBoolean;
  hasGenderCleared: boolean;
  setHasGenderCleared: DispatchBoolean;
  hasAssignedCleared: boolean;
  setHasAssignedCleared: DispatchBoolean;
  commonData: Commons;
  setCommonData: Dispatch<SetStateAction<Commons>>;
  registryData: Registries;
  setRegistryData: Dispatch<SetStateAction<Registries>>;
  addressData: Addresses;
  setAddressData: Dispatch<SetStateAction<Addresses>>;
};

export { Commons, Registries, Addresses, Forms };
export default DataContextGroup;
