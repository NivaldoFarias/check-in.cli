import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdLayersClear } from 'react-icons/md';

import DataContext from '../../contexts/DataContext';
import { AddressBooleanStates, InputRef } from './index';

type ComponentProps = {
  hasFired: boolean;
  setHasFired: Dispatch<SetStateAction<boolean>>;
  validCEP: boolean;
  alertCEPText: string;
  setAlertCEPText: Dispatch<SetStateAction<string>>;
  hasAutoFilled: AddressBooleanStates;
  setHasAutoFilled: Dispatch<SetStateAction<AddressBooleanStates>>;
  inputRef: MutableRefObject<InputRef>;
  getAddressData: (value?: string | undefined) => Promise<void | null>;
  handleInputFocus: (e: FocusEvent<HTMLInputElement>) => any;
  handleInputBlur: (e: FocusEvent<HTMLInputElement>) => void | null;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
};

export default function PostalCode(props: ComponentProps) {
  const {
    hasFired,
    setHasFired,
    validCEP,
    alertCEPText,
    setAlertCEPText,
    hasAutoFilled,
    setHasAutoFilled,
    inputRef,
    getAddressData,
    handleInputFocus,
    handleKeyDown,
    handleInputBlur,
  } = props;

  const [forceAlert, setForceAlert] = useState<boolean>(false);

  const { addressData: formData, setAddressData: setFormData } =
    useContext(DataContext);

  const onlyNumbersRegex = /^[\d\-\s]*$/;

  return (
    <section className='input-section postal-code-input'>
      <FaMapMarkerAlt
        className={`postal-code-input__submit-icon ${
          hasFired && formData?.postal_code?.length > 0
            ? 'postal-code-input__submit-icon--active'
            : ''
        }`}
        onClick={handleClick}
      />
      <MdLayersClear
        className={`input-section__reset-icon position-left ${
          hasAutoFilled.postal_code && formData?.postal_code?.length > 0
            ? ''
            : 'hidden'
        }`}
        onClick={handleHardReset}
      />
      <input
        type='text'
        minLength={5}
        maxLength={9}
        name='postal_code'
        pattern='^[\d\-\s]*$'
        value={formData?.postal_code}
        className={`input-field input-spacedout-field ${
          hasAutoFilled.postal_code && formData?.postal_code.length > 0
            ? 'input-field--active'
            : ''
        }`}
        ref={(element) => (inputRef.current['postal_code'] = element)}
        onChange={handleCEPInput}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        required
        disabled={hasAutoFilled.postal_code && formData?.postal_code.length > 0}
      />
      <span className='highlight'></span>
      <span className='bar'></span>
      <label className='label-text input-spacedout-field'>CEP</label>
      <p className={alertCEPTextClassName()}>{alertCEPText}</p>
    </section>
  );

  function handleClick(_e: MouseEvent<HTMLOrSVGElement>) {
    if (formData?.postal_code.length !== 9) {
      setAlertCEPText('Campo obrigatório');
      setForceAlert(true);
    } else getAddressData();
  }

  function alertCEPTextClassName() {
    const containsOnlyNumbers = onlyNumbersRegex.test(formData?.postal_code);
    const transparent = containsOnlyNumbers
      ? formData?.postal_code.length === 9
        ? validCEP
          ? 'color-transparent'
          : ''
        : forceAlert
        ? ''
        : 'color-transparent'
      : '';

    return `alert-text cpf-alert ${transparent}`;
  }

  function handleHardReset() {
    setFormData({
      postal_code: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      complement: '',
    });
    setHasFired(false);
    setHasAutoFilled({
      postal_code: false,
      street: false,
      number: false,
      complement: false,
      neighborhood: false,
      city: false,
      state: false,
    });
  }

  function handleCEPInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    if (forceAlert && alertCEPText === 'Campo obrigatório') {
      setAlertCEPText('Insira um CEP válido');
      if (onlyNumbersRegex.test(formData?.postal_code)) setForceAlert(false);
    }

    if (value.length === 6) {
      setFormData({
        ...formData,
        postal_code:
          value.slice(0, -1) +
          '-' +
          (value.slice(-1) === '-' ? '' : value.slice(-1)),
      });
    } else setFormData({ ...formData, postal_code: value });

    if (
      value.length === 9 ||
      (value.length === 8 && onlyNumbersRegex.test(value))
    )
      getAddressData(value);
  }
}
