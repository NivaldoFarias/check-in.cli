import { Dispatch, SetStateAction } from 'react';

declare module 'react-mobile-datepicker';

export interface Commons {
  full_name: string;
  first_name: string;
  birthdate: string;
  insurance: string;
  insurance_code: string;
  password: string;
  cpf: string;
}
export interface Registries {
  gender: string;
  assigned_at_birth: string;
  described_identity?: string;
  described_assigned?: string;
  phone_number: string;
}
export interface Addresses {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
}

export type Forms = {
  common: Commons;
  registry: Registries;
  address: Addresses;
};

export interface IsSectionCompleteState {
  common: boolean;
  registry: boolean;
  address: boolean;
}

export type DispatchBoolean = Dispatch<SetStateAction<boolean>>;

type DataContextGroup = {
  mockData: Forms | undefined;
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

export default DataContextGroup;
