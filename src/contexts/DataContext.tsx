import { useState, createContext } from 'react';
import DataContextGroup, {
  Addresses,
  Commons,
  Forms,
  Registries,
} from '../types';

const initialDataContextValue = {
  isSectionComplete: {
    common: false,
    registry: false,
    address: false,
  },
  setIsSectionComplete: () => {},
  selectInsurance: false,
  setSelectInsurance: () => {},
  hasGenderCleared: false,
  setHasGenderCleared: () => {},
  selectGender: false,
  setSelectGender: () => {},
  selectAssigned: false,
  setSelectAssigned: () => {},
  hasAssignedCleared: false,
  setHasAssignedCleared: () => {},
  updateHeight: false,
  setUpdateHeight: () => {},
  commonData: {
    full_name: '',
    first_name: '',
    insurance: '',
    birthdate: '',
  },
  setCommonData: () => {},
  registryData: {
    gender: '',
    described_identity: '',
    assigned_at_birth: '',
    described_assigned: '',
    cpf: '',
    phone_number: '',
  },
  setRegistryData: () => {},
  addressData: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    postal_code: '',
  },
  setAddressData: () => {},
  formData: {
    common: {
      full_name: '',
      first_name: '',
      insurance: '',
      birthdate: '',
    },
    registry: {
      gender: '',
      described_identity: '',
      assigned_at_birth: '',
      described_assigned: '',
      cpf: '',
      phone_number: '',
    },
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: '',
    },
  },
  setFormData: () => {},
  hasSubmitted: false,
  setHasSubmitted: () => {},
};

const DataContext = createContext<DataContextGroup>(initialDataContextValue);

function DataProvider(props: any) {
  const { children } = props;
  const [selectInsurance, setSelectInsurance] = useState<boolean>(false);
  const [selectGender, setSelectGender] = useState<boolean>(false);
  const [selectAssigned, setSelectAssigned] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const [updateHeight, setUpdateHeight] = useState<boolean>(false);

  const [hasGenderCleared, setHasGenderCleared] = useState<boolean>(false);
  const [hasAssignedCleared, setHasAssignedCleared] = useState<boolean>(false);

  const [isSectionComplete, setIsSectionComplete] = useState({
    common: false,
    registry: false,
    address: false,
  });

  const [commonData, setCommonData] = useState<Commons>({
    full_name: '',
    first_name: '',
    insurance: '',
    birthdate: '',
  });
  const [registryData, setRegistryData] = useState<Registries>({
    gender: '',
    described_identity: '',
    assigned_at_birth: '',
    described_assigned: '',
    cpf: '',
    phone_number: '',
  });
  const [addressData, setAddressData] = useState<Addresses>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const [formData, setFormData] = useState<Forms>({
    common: commonData,
    registry: registryData,
    address: addressData,
  });

  return (
    <DataContext.Provider
      value={{
        isSectionComplete,
        setIsSectionComplete,
        selectInsurance,
        setSelectInsurance,
        hasGenderCleared,
        setHasGenderCleared,
        selectGender,
        setSelectGender,
        selectAssigned,
        setSelectAssigned,
        hasAssignedCleared,
        setHasAssignedCleared,
        updateHeight,
        setUpdateHeight,
        commonData,
        setCommonData,
        registryData,
        setRegistryData,
        formData,
        addressData,
        setAddressData,
        setFormData,
        hasSubmitted,
        setHasSubmitted,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataProvider };
export default DataContext;
