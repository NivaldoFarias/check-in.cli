import { useState, createContext } from 'react';
import DataContextGroup from '../types';
import { generate } from 'gerador-validador-cpf';
import useLocalStorage from '../hooks/useLocalStorage';

const initialDataContextValue = {
  mockData: undefined,
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
    insurance_code: '',
    birthdate: '',
    password: '',
    cpf: '',
  },
  setCommonData: () => {},
  registryData: {
    gender: '',
    assigned_at_birth: '',
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
  hasSubmitted: false,
  setHasSubmitted: () => {},
};

const DataContext = createContext<DataContextGroup>(initialDataContextValue);

export function DataProvider(props: any) {
  const { children } = props;
  const [selectInsurance, setSelectInsurance] = useState<boolean>(false);
  const [selectGender, setSelectGender] = useState<boolean>(false);
  const [selectAssigned, setSelectAssigned] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const [updateHeight, setUpdateHeight] = useState<boolean>(false);

  const [hasGenderCleared, setHasGenderCleared] = useState<boolean>(false);
  const [hasAssignedCleared, setHasAssignedCleared] = useState<boolean>(false);

  const mockData =
    process.env.NODE_ENV === 'test'
      ? {
          common: {
            first_name: 'Nivaldo',
            full_name: 'Nivaldo Farias Garcia',
            birthdate: '2000-10-08',
            cpf: generate(),
            insurance: 'PRIVATE',
            insurance_code: '',
            password: '123456',
          },
          registry: {
            phone_number: '83993355144',
            gender: 'MALE',
            assigned_at_birth: 'MAN',
          },
          address: {
            postal_code: '58039151',
            street: 'Av. Infante Dom Henrique',
            number: '406',
            neighborhood: 'Tambaú',
            city: 'João Pessoa',
            complement: 'Apto 201',
            state: 'Paraíba',
          },
        }
      : undefined;

  const [isSectionComplete, setIsSectionComplete] = useState({
    common: false,
    registry: false,
    address: false,
  });

  const [commonData, setCommonData] = useLocalStorage('commonData', {
    full_name: '',
    first_name: '',
    insurance: '',
    insurance_code: '',
    birthdate: '',
    password: '',
    cpf: '',
  });
  const [registryData, setRegistryData] = useLocalStorage('registryData', {
    gender: '',
    described_identity: undefined,
    assigned_at_birth: '',
    described_assigned: undefined,
    phone_number: '',
  });
  const [addressData, setAddressData] = useLocalStorage('addressData', {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    postal_code: '',
  });

  return (
    <DataContext.Provider
      value={{
        mockData,
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
        addressData,
        setAddressData,
        hasSubmitted,
        setHasSubmitted,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;

// TODO refactor: split Contexts into cleaner, smaller Contexts
