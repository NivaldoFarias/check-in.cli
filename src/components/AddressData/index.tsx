import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
  useRef,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import { confirmAlert } from 'react-confirm-alert';

import { HiOutlineViewList } from 'react-icons/hi';
import { MdCalendarViewDay, MdFormatClear } from 'react-icons/md';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { getRandomInt } from '../../utils/functions.util';
import DataContext from '../../contexts/DataContext';
import axios from 'axios';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

const STATES_MAP: { [x: string]: string } = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goías',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso o Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeio',
  RN: 'Rio Grande o Norte',
  RS: 'Rio Grande o Sul',
  RO: 'Rondônia',
  RR: 'Roraíma',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
};

function AddressData() {
  const [expandSection, setSectionState] = useState<boolean>(false);
  const [height, setHeight] = useState<number | string>(0);

  const [hasFired, setHasFired] = useState<boolean>(false);
  const [forceAlert, setForceAlert] = useState<boolean>(false);
  const [hasAutoFilled, setHasAutoFilled] = useState<boolean>(false);

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

  const [alertCEPText, setAlertCEPText] = useState<string>(
    formData?.postal_code.length === 9
      ? `CEP inválido`
      : `Insira apenas números`,
  );
  const addressDataComponent = buildAddressDataComponent();

  return (
    <section className='section-container'>
      <div className='section-header'>
        <h2 className='section-header__subtitle' onClick={toggleSection}>
          Dados Locais
        </h2>
        {expandSection ? (
          <MdCalendarViewDay
            onClick={toggleSection}
            className={`section-header__icon${expandSection ? '--active' : ''}`}
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

  function handleError(error: any) {
    confirmAlert({
      message: `${
        error.response?.data?.message ?? 'Ops! Parece que algo deu errado'
      }.\n\n Por favor, tente novamente.`,
      buttons: [
        {
          label: 'OK',
          onClick: () => null,
        },
      ],
    });
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
      let {
        data: {
          logradouro: street,
          bairro: neighborhood,
          localidade: city,
          uf: state,
        },
      } = await axios.get(API_URL);

      if (street.includes('Avenida')) street = street.replace('Avenida', 'Av.');
      state = STATES_MAP[state] ?? state;

      setHasAutoFilled(true);
      setFormData({
        ...formData,
        postal_code: cep,
        street,
        neighborhood,
        city,
        state,
      });
      inputRef.current.street?.classList.add('input-field--focused');
      inputRef.current.neighborhood?.classList.add('input-field--focused');
      inputRef.current.city?.classList.add('input-field--focused');
      inputRef.current.state?.classList.add('input-field--focused');
    } catch (error) {
      setHasFired(false);
      return handleError(error);
    }
  }

  function buildAddressDataComponent() {
    const onlyNumbersRegex = /^[\d\-\s]*$/;
    const regexCEP = /^\d{5}-\d{3}$/;
    const validCEP = regexCEP.test(formData.postal_code);

    return (
      <form ref={sectionRef} className='form-group' onSubmit={handleSubmit}>
        <section className='input-section postal-code-input'>
          <FaMapMarkerAlt
            className={`postal-code-input__submit-icon${
              hasFired ? '--active' : ''
            }`}
            onClick={handleClick}
          />
          <MdFormatClear
            className={`postal-code-input__reset-icon ${
              hasFired ? '' : 'hidden'
            }`}
            onClick={handleReset}
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
            disabled={hasAutoFilled && formData?.postal_code.length > 0}
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text input-spacedout-field'>CEP</label>
          <p className={alertCEPTextClassName()}>{alertCEPText}</p>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='street'
            maxLength={40}
            value={formData?.street}
            ref={(element) => (inputRef.current['street'] = element)}
            className='input-field'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasAutoFilled && formData?.street.length > 0}
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
            disabled={hasAutoFilled && formData?.number.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Número</label>
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
            disabled={hasAutoFilled && formData?.neighborhood.length > 0}
            required
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
            disabled={hasAutoFilled && formData?.city.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Cidade</label>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='state'
            maxLength={10}
            value={formData?.state}
            ref={(element) => (inputRef.current['state'] = element)}
            className='input-field input-spacedout-field'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasAutoFilled && formData?.state.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Estado</label>
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
            disabled={hasAutoFilled && formData?.complement.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Complemento</label>
        </section>
      </form>
    );

    function handleReset(_e: MouseEvent<HTMLOrSVGElement>) {
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
      setHasAutoFilled(false);
      setAlertCEPText('');

      inputRef.current.neighborhood?.classList.remove('input-field--focused');
      inputRef.current.postal_code?.classList.remove('input-field--focused');
      inputRef.current.complement?.classList.remove('input-field--focused');
      inputRef.current.number?.classList.remove('input-field--focused');
      inputRef.current.street?.classList.remove('input-field--focused');
      inputRef.current.city?.classList.remove('input-field--focused');
      inputRef.current.state?.classList.remove('input-field--focused');
    }

    function handleClick(_e: MouseEvent<HTMLOrSVGElement>) {
      if (formData.postal_code.length !== 9) {
        setAlertCEPText('Campo obrigatório');
        setForceAlert(true);
      } else getAddressData();
    }

    function handleCEPInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      if (forceAlert && alertCEPText === 'Campo obrigatório') {
        setAlertCEPText('Insira um CEP válido');
        if (onlyNumbersRegex.test(formData.postal_code)) setForceAlert(false);
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
  }
}

export default AddressData;
