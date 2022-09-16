import {
  ChangeEvent,
  FocusEvent,
  useContext,
  useState,
  useRef,
  KeyboardEvent,
  useMemo,
} from 'react';
import { confirmAlert } from 'react-confirm-alert';

import {
  MdCalendarViewDay,
  MdViewHeadline,
  MdFormatClear,
} from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

import DataContext from '../../contexts/DataContext';
import axios from 'axios';
import PostalCode from './PostalCode';

export type AddressStrings =
  | 'street'
  | 'number'
  | 'complement'
  | 'neighborhood'
  | 'city'
  | 'state'
  | 'postal_code';
export type InputRef = {
  [x in AddressStrings]: HTMLInputElement | null;
};
export type AddressBooleanStates = {
  postal_code: boolean;
  street: boolean;
  number: boolean;
  complement: boolean;
  neighborhood: boolean;
  city: boolean;
  state: boolean;
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

// TODO refactor: component has too many responsibilities

function AddressData() {
  const [validCEP, setValidCEP] = useState<boolean>(false);
  const [expandSection, setSectionState] = useState<boolean>(false);

  const [hasFired, setHasFired] = useState<boolean>(false);
  const [hasAutoFilled, setHasAutoFilled] = useState<AddressBooleanStates>({
    postal_code: false,
    street: false,
    number: false,
    complement: false,
    neighborhood: false,
    city: false,
    state: false,
  });
  const [alertCEPText, setAlertCEPText] = useState<string>(
    'Insira apenas números',
  );

  const inputRef = useRef<InputRef>({
    street: null,
    number: null,
    complement: null,
    neighborhood: null,
    city: null,
    state: null,
    postal_code: null,
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const {
    isSectionComplete,
    setIsSectionComplete,
    addressData: formData,
    setAddressData: setFormData,
    updateHeight,
  } = useContext(DataContext);

  useMemo(() => {
    const cepIsSet = formData?.postal_code?.length > 5;
    const streetIsSet = formData?.street?.length > 3;
    const numberIsSet = formData?.number?.length > 0;
    const neighborhoodIsSet = formData?.neighborhood?.length > 3;
    const cityIsSet = formData?.city?.length > 3;
    const stateIsSet = formData?.state?.length > 0;
    const isComplete =
      cepIsSet &&
      streetIsSet &&
      numberIsSet &&
      neighborhoodIsSet &&
      cityIsSet &&
      stateIsSet;

    if (isComplete && !isSectionComplete.address) {
      setIsSectionComplete({
        ...isSectionComplete,
        address: true,
      });
    } else if (!isComplete && isSectionComplete.address)
      setIsSectionComplete({
        ...isSectionComplete,
        address: false,
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, hasAutoFilled]);

  useMemo(() => {
    const interval = setInterval(() => {
      if (
        inputRef.current?.postal_code &&
        inputRef.current?.postal_code?.matches(
          ':-internal-autofill-selected',
        ) &&
        !hasAutoFilled.postal_code
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, postal_code: true });
      }

      if (
        inputRef.current?.street &&
        inputRef.current?.street?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.street
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, street: true });
      }

      if (
        inputRef.current?.number &&
        inputRef.current?.number?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.number
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, number: true });
      }

      if (
        inputRef.current?.complement &&
        inputRef.current?.complement?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.complement
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, complement: true });
      }

      if (
        inputRef.current?.neighborhood &&
        inputRef.current?.neighborhood?.matches(
          ':-internal-autofill-selected',
        ) &&
        !hasAutoFilled.neighborhood
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, neighborhood: true });
      }

      if (
        inputRef.current?.city &&
        inputRef.current?.city?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.city
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, city: true });
      }

      if (
        inputRef.current?.state &&
        inputRef.current?.state?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.state
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, state: true });
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 500);

    if (
      hasAutoFilled.city &&
      hasAutoFilled.state &&
      hasAutoFilled.postal_code &&
      hasAutoFilled.street &&
      hasAutoFilled.number &&
      hasAutoFilled.complement &&
      hasAutoFilled.neighborhood
    ) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAutoFilled]);

  const height = useMemo(
    () =>
      sectionRef?.current && expandSection
        ? sectionRef.current.getBoundingClientRect().height
        : 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expandSection, updateHeight],
  );

  useMemo(() => {
    const onlyNumbersRegex = /^[\d\-\s]*$/;
    const regexCEP = /^\d{5}-\d{3}$/;

    if (formData?.postal_code.length === 9) {
      setAlertCEPText('CEP inválido');
      setValidCEP(regexCEP.test(formData?.postal_code));
    } else {
      if (alertCEPText !== 'Insira apenas números')
        setAlertCEPText('Insira apenas números');
      setValidCEP(onlyNumbersRegex.test(formData?.postal_code));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.postal_code]);

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
          <>
            <MdViewHeadline
              onClick={toggleSection}
              className={`section-header__icon${
                isSectionComplete.address ? '--complete' : ''
              }`}
            />
            {isSectionComplete.address ? (
              <IoMdCheckmarkCircleOutline className='section-header__complete-checkmark' />
            ) : null}
          </>
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
      }. Por favor, tente novamente.`,
      buttons: [
        {
          label: 'OK',
          onClick: () => null,
        },
      ],
    });
  }

  async function getAddressData(value?: string | undefined) {
    if (hasFired || !validCEP) return null;

    const replaceRegex = /(\-|\s)/gi;
    const input = formData?.postal_code.replaceAll(replaceRegex, '');
    const optInput = value?.replaceAll(replaceRegex, '');

    if (input.length !== 8 && optInput?.length !== 8) return null;

    const cep = optInput?.length === 8 ? optInput : input;
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
      const postal_code = `${cep.substring(0, 5)}-${cep.substring(5)}`;

      setFormData({
        ...formData,
        postal_code,
        street,
        neighborhood,
        city,
        state,
      });
      setHasAutoFilled({
        ...hasAutoFilled,
        neighborhood: true,
        postal_code: true,
        street: true,
        city: true,
        state: true,
      });
    } catch (error) {
      setHasFired(false);
      setValidCEP(false);
      return handleError(error);
    }
  }

  function buildAddressDataComponent() {
    return (
      <div ref={sectionRef} className='form-group'>
        <PostalCode
          hasFired={hasFired}
          setHasFired={setHasFired}
          validCEP={validCEP}
          alertCEPText={alertCEPText}
          setAlertCEPText={setAlertCEPText}
          hasAutoFilled={hasAutoFilled}
          setHasAutoFilled={setHasAutoFilled}
          inputRef={inputRef}
          getAddressData={getAddressData}
          handleInputFocus={handleInputFocus}
          handleInputBlur={handleInputBlur}
          handleKeyDown={handleKeyDown}
        />
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.street && formData?.street?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={() => handleReset('street')}
          />
          <input
            type='text'
            name='street'
            maxLength={40}
            value={formData?.street}
            ref={(element) => (inputRef.current['street'] = element)}
            className={`input-field ${
              hasAutoFilled.street && formData?.street.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasAutoFilled.street && formData?.street.length > 0}
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Logradouro</label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.number && formData?.number?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={() => handleReset('number')}
          />
          <input
            type='text'
            name='number'
            maxLength={10}
            inputMode='numeric'
            value={formData?.number}
            ref={(element) => (inputRef.current['number'] = element)}
            className={`input-field input-spacedout-field ${
              hasAutoFilled.number && formData?.number.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasAutoFilled.number && formData?.number.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Número</label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.neighborhood && formData?.neighborhood?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={() => handleReset('neighborhood')}
          />
          <input
            type='text'
            name='neighborhood'
            maxLength={40}
            value={formData?.neighborhood}
            ref={(element) => (inputRef.current['neighborhood'] = element)}
            className={`input-field input-spacedout-field ${
              hasAutoFilled.neighborhood && formData?.neighborhood.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={
              hasAutoFilled.neighborhood && formData?.neighborhood.length > 0
            }
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Bairro</label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.city && formData?.city?.length > 0 ? '' : 'hidden'
            }`}
            onClick={() => handleReset('city')}
          />
          <input
            type='text'
            name='city'
            maxLength={10}
            value={formData?.city}
            ref={(element) => (inputRef.current['city'] = element)}
            className={`input-field input-spacedout-field ${
              hasAutoFilled.city && formData?.city.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasAutoFilled.city && formData?.city.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Cidade</label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.state && formData?.state?.length > 0 ? '' : 'hidden'
            }`}
            onClick={() => handleReset('state')}
          />
          <input
            type='text'
            name='state'
            maxLength={10}
            value={formData?.state}
            ref={(element) => (inputRef.current['state'] = element)}
            className={`input-field input-spacedout-field ${
              hasAutoFilled.state && formData?.state.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasAutoFilled.state && formData?.state.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Estado</label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.complement && formData?.complement?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={() => handleReset('complement')}
          />
          <input
            type='text'
            name='complement'
            maxLength={25}
            value={formData?.complement}
            className={`input-field input-spacedout-field ${
              hasAutoFilled.complement && formData?.complement.length > 0
                ? 'input-field--active'
                : ''
            }`}
            ref={(element) => (inputRef.current['complement'] = element)}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={
              hasAutoFilled.complement && formData?.complement.length > 0
            }
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Complemento</label>
        </section>
      </div>
    );

    function handleReset(name: AddressStrings) {
      setFormData({
        ...formData,
        [name]: '',
      });
      setHasAutoFilled({ ...hasAutoFilled, [name]: false });
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'Enter') {
        getAddressData();
      }
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setFormData({
        ...formData,
        [e.target.name as AddressStrings]: e.target.value,
      });
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
      return inputRef.current[e.target.name as AddressStrings]?.classList.add(
        'input-field--active',
      );
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (
        e.target.name === 'postal_code' &&
        formData?.postal_code.length === 9 &&
        validCEP
      ) {
        getAddressData();
      }

      if (e.target.value.length !== 0) return null;

      return inputRef.current[
        e.target.name as AddressStrings
      ]?.classList.remove('input-field--active');
    }
  }
}

export default AddressData;
