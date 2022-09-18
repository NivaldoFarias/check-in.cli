import { AddressContextType } from '../../types/addresses';
export const hasAutoFilled = {
  street: false,
  number: false,
  complement: false,
  neighborhood: false,
  city: false,
  state: false,
  postal_code: false,
};

export const data = {
  validCEP: false,
  expandSection: false,
  hasFired: false,
  hasAutoFilled,
  alertCEPText: 'Insira apenas números',
  setValidCEP: () => {},
  setSectionState: () => {},
  setHasFired: () => {},
  setHasAutoFilled: () => {},
  setAlertCEPText: () => {},
};

export const functions = {
  toggleSection: () => {},
  getAddressData: () => {},
};

export const handlers = {
  handleReset: () => {},
  handleError: () => {},
  handleKeyDown: () => {},
  handleInputBlur: () => {},
  handleInputFocus: () => {},
  handleInputChange: () => {},
};

export const refs = {
  streetRef: null,
  numberRef: null,
  complementRef: null,
  neighborhoodRef: null,
  cityRef: null,
  stateRef: null,
  postal_codeRef: null,
  sectionRef: null,
};

const initialValue: AddressContextType = {
  data,
  functions,
  handlers,
  refs,
};

export default initialValue;
