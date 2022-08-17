import { useState, createContext } from 'react';
import { Addresses, Commons, Forms, Registries } from '../types';

const DataContext = createContext<{ [x: string]: any }>({});

function DataProvider(props: any) {
  const { children } = props;
  const [selectInsurance, setSelectInsurance] = useState<boolean>(false);
  const [selectGender, setSelectGender] = useState<boolean>(false);
  const [selectAssigned, setSelectAssigned] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const [updateHeight, setUpdateHeight] = useState<boolean>(false);

  const [hasGenderCleared, setHasGenderCleared] = useState<boolean>(false);
  const [hasAssignedCleared, setHasAssignedCleared] = useState<boolean>(false);

  const [commonData, setCommonData] = useState<Commons>({
    full_name: '',
    social_name: '',
    insurance: '',
    birthdate: '',
  });
  const [registryData, setRegistryData] = useState<Registries>({
    gender: '',
    described_idendity: '',
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
