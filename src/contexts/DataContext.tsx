import { useState, createContext } from 'react';

const DataContext = createContext<{ [x: string]: any }>({});

function DataProvider(props: any) {
  const { children } = props;
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const [commonData, setCommonData] = useState({
    cpf: '',
    full_name: '',
    social_name: '',
    insurance: '',
    birthdate: '',
  });
  const [registryData, setRegistryData] = useState({
    gender: '',
    assigned_at_birth: '',
    rg: '',
    personal_number: '',
    household_number: '',
  });
  const [addressData, setAddressData] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
  });
  const [formData, setFormData] = useState({
    common: commonData,
    registry: registryData,
    address: addressData,
  });

  return (
    <DataContext.Provider
      value={{
        modalIsOpen,
        setModalIsOpen,
        commonData,
        setCommonData,
        formData,
        registryData,
        setRegistryData,
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
