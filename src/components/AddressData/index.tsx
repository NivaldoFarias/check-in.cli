import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
  useRef,
  KeyboardEvent,
} from 'react';

import { HiOutlineViewList } from 'react-icons/hi';
import { MdCalendarViewDay } from 'react-icons/md';
import { RiSendPlaneFill } from 'react-icons/ri';

import { getRandomInt } from '../../utils/functions.util';
import DataContext from '../../contexts/DataContext';
import axios from 'axios';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function AddressData() {
  const [expandSection, setSectionState] = useState<boolean>(false);
  const [height, setHeight] = useState<number | string>(0);
  const [hasFired, setHasFired] = useState<boolean>(false);

  const inputRef = useRef<InputRef>({
    street: null,
    number: null,
    complement: null,
    neighborhood: null,
    city: null,
    state: null,
    country: null,
    postal_code: null,
  });
  const sectionRef = useRef<HTMLFormElement>(null);

  const {
    addressData: formData,
    setAddressData: setFormData,
    updateHeight,
    setHasSubmitted,
  } = useContext(DataContext);

  useEffect(() => {
    if (sectionRef.current) {
      if (expandSection) {
        setHeight(sectionRef.current.getBoundingClientRect().height);
      } else setHeight(0);
    }
  }, [expandSection, updateHeight]);

  const addressDataComponent = buildAddressDataComponent();

  return (
    <section className='section-container'>
      <div className='section-header'>
        <h2 className='section-header__subtitle' onClick={toggleSection}>
          Dados Gerais
        </h2>
        {expandSection ? (
          <MdCalendarViewDay
            onClick={toggleSection}
            className='section-header__icon'
          />
        ) : (
          <HiOutlineViewList
            onClick={toggleSection}
            className='section-header__icon'
          />
        )}
      </div>
      <div className='register-data-section' style={{ height }}>
        {addressDataComponent}
      </div>
    </section>
  );

  function toggleSection() {
    setSectionState(!expandSection);
  }

  async function getAddressData(value?: string | undefined) {
    if (hasFired) return null;

    const replaceRegex = /(\-|\s)/gi;
    const input = formData?.postal_code.replaceAll(replaceRegex, '');
    const optInput = value?.replaceAll(replaceRegex, '');

    const cep = optInput ?? input;
    const API_URL = `https://viacep.com.br/ws/${cep}/json/`;
    try {
      setHasFired(true);
      const response = await axios.get(API_URL);
      return console.log(response.data);
    } catch (error) {
      setHasFired(false);
      return console.log(error);
    }
  }

  function buildAddressDataComponent() {
    const onlyNumbersRegex = /^[\d\-\s]*$/;

    const alertCEPText =
      formData?.postal_code.length === 9
        ? `CEP inválido`
        : `Insira apenas números`;
    const regexCEP = /^\d{5}-\d{3}$/;
    const validCEP = regexCEP.test(formData.postal_code);

    return (
      <form ref={sectionRef} className='form-group' onSubmit={handleSubmit}>
        <section className='input-section postal-code-input'>
          <RiSendPlaneFill
            className='postal-code-input__submit-icon'
            onClick={() => getAddressData()}
          />
          <input
            type='text'
            name='postal_code'
            maxLength={9}
            value={formData?.postal_code}
            className='input-field input-spacedout-field'
            ref={(element) => (inputRef.current['postal_code'] = element)}
            onChange={handleCEPInput}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Insira seu CEP</label>
          <p className={showAlertCEP()}>{alertCEPText}</p>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='street'
            maxLength={40}
            value={formData?.street}
            ref={(element) => (inputRef.current['street'] = element)}
            className='input-field input-spacedout-field'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Logradouro</label>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='number'
            maxLength={10}
            value={formData?.number}
            ref={(element) => (inputRef.current['number'] = element)}
            className='input-field input-spacedout-field'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Número</label>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='complement'
            maxLength={25}
            value={formData?.complement}
            className='input-field input-spacedout-field'
            ref={(element) => (inputRef.current['complement'] = element)}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Complemento</label>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='neighborhood'
            maxLength={40}
            value={formData?.neighborhood}
            ref={(element) => (inputRef.current['neighborhood'] = element)}
            className='input-field input-spacedout-field'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Bairro</label>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='city'
            maxLength={10}
            value={formData?.city}
            ref={(element) => (inputRef.current['city'] = element)}
            className='input-field input-spacedout-field'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Número</label>
        </section>
      </form>
    );

    function handleCEPInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

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

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setHasSubmitted(true);
      setTimeout(() => null, getRandomInt(750, 2000));
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'Enter') {
        getAddressData();
      }
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
      return inputRef.current[e.target.name]?.classList.add(
        'input-field--focused',
      );
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (e.target.name === 'postal_code' && validCEP) {
        getAddressData();
      }
      return inputRef.current[e.target.name]?.classList.remove(
        'input-field--focused',
      );
    }

    function showAlertCEP() {
      const containsOnlyNumbers = onlyNumbersRegex.test(formData?.postal_code);
      const transparent = containsOnlyNumbers
        ? formData?.postal_code.length === 9
          ? validCEP
            ? 'color-transparent'
            : ''
          : 'color-transparent'
        : '';

      return `alert-text cpf-alert ${transparent}`;
    }
  }
}

export default AddressData;
