import {
  ChangeEvent,
  FocusEvent,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  MdViewHeadline,
  MdCalendarViewDay,
  MdFormatClear,
} from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { AiFillIdcard } from 'react-icons/ai';
import { FaMobile } from 'react-icons/fa';
import { validate } from 'gerador-validador-cpf';

import DataContext from '../../contexts/DataContext';
import SelectAssignedAtBirth from './SelectAssignedAtBirth';
import SelectGenderIdentity from './SelectGenderIdentity';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

// TODO refactor: component has too many responsibilities

function RegistryData() {
  const [validCpf, setValidCpf] = useState<boolean>(true);
  const [expandSection, setSectionState] = useState<boolean>(false);
  const [height, setHeight] = useState<number | string>(0);
  const [hasCpfAutoFilled, setHasCpfAutoFilled] = useState<boolean>(false);
  const [hasPhoneNumberAutoFilled, setHasPhoneNumberAutoFilled] =
    useState<boolean>(false);

  const {
    isSectionComplete,
    setIsSectionComplete,
    registryData: formData,
    setRegistryData: setFormData,
    selectGender,
    updateHeight,
    selectAssigned,
  } = useContext(DataContext);

  const inputRef = useRef<InputRef>({
    gender: null,
    assigned_at_birth: null,
    cpf: null,
    phone_number: null,
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formData?.cpf.length === 14) {
      setValidCpf(validate(formData?.cpf));
    } else setValidCpf(true);
  }, [formData.cpf]);

  useEffect(() => {
    const cpfIsSet = validCpf;
    const phoneNumberIsSet = formData?.phone_number?.length > 6;
    const assignedIsSet =
      (formData?.assigned_at_birth.length > 0 &&
        formData?.assigned_at_birth !== 'SELF_DESCRIBED') ||
      (formData?.assigned_at_birth === 'SELF_DESCRIBED' &&
        formData?.described_assigned &&
        formData?.described_assigned.length > 0);
    const genderIsSet =
      (formData?.gender.length > 0 && formData?.gender !== 'SELF_DESCRIBED') ||
      (formData?.gender === 'SELF_DESCRIBED' &&
        formData?.described_identity &&
        formData?.described_identity.length > 0);

    const isComplete =
      cpfIsSet && phoneNumberIsSet && assignedIsSet && genderIsSet;

    if (isComplete && !isSectionComplete.registry) {
      setIsSectionComplete({
        ...isSectionComplete,
        registry: true,
      });
    } else if (!isComplete && isSectionComplete.registry)
      setIsSectionComplete({
        ...isSectionComplete,
        registry: false,
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, hasCpfAutoFilled, hasPhoneNumberAutoFilled]);

  useEffect(() => {
    if (sectionRef.current) {
      if (expandSection) {
        setHeight(sectionRef.current.getBoundingClientRect().height);
      } else setHeight(0);
    }
  }, [expandSection, selectGender, selectAssigned, updateHeight]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        inputRef.current.cpf &&
        inputRef.current?.cpf?.matches(':-internal-autofill-selected') &&
        !hasCpfAutoFilled
      ) {
        setSectionState(true);
        setHasCpfAutoFilled(true);
      }

      if (
        inputRef.current.phone_number &&
        inputRef.current?.phone_number?.matches(
          ':-internal-autofill-selected',
        ) &&
        !hasPhoneNumberAutoFilled
      ) {
        setSectionState(true);
        setHasPhoneNumberAutoFilled(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 500);

    if (hasCpfAutoFilled && hasPhoneNumberAutoFilled) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [hasCpfAutoFilled, hasPhoneNumberAutoFilled]);

  const registryDataComponent = buildRegistryDataComponent();

  return (
    <section className='section-container'>
      <div className='section-header'>
        <h2 className='section-header__subtitle' onClick={toggleSection}>
          Dados Pessoais
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
                isSectionComplete.registry ? '--complete' : ''
              }`}
            />
            {isSectionComplete.registry ? (
              <IoMdCheckmarkCircleOutline className='section-header__complete-checkmark' />
            ) : null}
          </>
        )}
      </div>
      <div className='register-data-section' style={{ height }}>
        {registryDataComponent}
      </div>
    </section>
  );

  function toggleSection() {
    setSectionState(!expandSection);
  }

  function buildRegistryDataComponent() {
    const cpfRegex = /^[\d\.\-\s]*$/;
    const inputRegex = /^[\d()-\+\s]*$/;
    const phoneRegex =
      /^((\((\d{2})\)\s9)([1-9])(\d{3})-(\d{4}))|(\+?\d{4}9[1-9]\d*)$/gi;

    const alertCpf =
      formData?.cpf.length === 14 ? `CPF inválido` : `Insira apenas números`;
    const alertPhonenumber =
      formData?.phone_number.length >= 13
        ? `Telefone inválido`
        : `Insira apenas números`;

    return (
      <div ref={sectionRef} className='form-group'>
        <section
          className={`input-section  ${
            cpfRegex.test(formData?.cpf)
              ? validCpf
                ? ''
                : 'push-bottom'
              : 'push-bottom'
          }`}
        >
          <MdFormatClear
            className={`input-section__reset-icon position-left ${
              hasCpfAutoFilled && formData.cpf?.length > 0 ? '' : 'hidden'
            }`}
            onClick={handleResetCpf}
          />
          <AiFillIdcard
            className={`input-section__cpf-icon ${
              hasCpfAutoFilled && formData.cpf?.length > 0
                ? 'input-section__cpf-icon--active'
                : ''
            } ${validCpf ? '' : 'input-section__cpf-icon--invalid'}`}
          />
          <input
            type='text'
            name='cpf'
            minLength={14}
            maxLength={14}
            pattern='^[\d\.\-\s]*$'
            value={formData?.cpf}
            className={`input-field input-spacedout-field ${
              hasCpfAutoFilled && formData.cpf.length > 0
                ? 'input-field--active'
                : ''
            }`}
            ref={(element) => (inputRef.current['cpf'] = element)}
            onChange={handleCPFInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasCpfAutoFilled && formData.cpf.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text input-spacedout-field'>CPF</label>
          <p className={showAlertCpf()}>{alertCpf}</p>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon position-left ${
              hasPhoneNumberAutoFilled && formData.phone_number?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={handleResetPhoneNumber}
          />
          <FaMobile
            className={`input-section__phone-icon ${
              hasPhoneNumberAutoFilled && formData.phone_number?.length > 0
                ? 'input-section__phone-icon--active'
                : ''
            }`}
          />
          <input
            type='text'
            name='phone_number'
            maxLength={15}
            pattern='^[\d()-\+\s]*$'
            value={formData?.phone_number}
            ref={(element) => (inputRef.current['phone_number'] = element)}
            className={`input-field input-spacedout-field ${
              hasPhoneNumberAutoFilled && formData.phone_number.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handlePhoneInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={
              hasPhoneNumberAutoFilled && formData.phone_number.length > 0
            }
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Número de telefone</label>
          <p className={showAlertPhonenumber()}>{alertPhonenumber}</p>
        </section>
        <SelectAssignedAtBirth />
        <SelectGenderIdentity />
      </div>
    );

    function handleResetCpf() {
      setFormData({
        ...formData,
        cpf: '',
      });
      setHasCpfAutoFilled(false);
    }

    function handleResetPhoneNumber() {
      setFormData({
        ...formData,
        phone_number: '',
      });
      setHasPhoneNumberAutoFilled(false);
    }

    function handleCPFInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      if (value.length === 4 || value.length === 8) {
        setFormData({
          ...formData,
          cpf:
            value.slice(0, -1) +
            '.' +
            (value.slice(-1) === '.' ? '' : value.slice(-1)),
        });
      } else if (value.length === 12) {
        setFormData({
          ...formData,
          cpf:
            value.slice(0, -1) +
            '-' +
            (value.slice(-1) === '-' ? '' : value.slice(-1)),
        });
      } else {
        setFormData({ ...formData, cpf: value });
      }
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
      return inputRef.current[e.target.name]?.classList.add(
        'input-field--active',
      );
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (e.target.value.length !== 0) return null;

      return inputRef.current[e.target.name]?.classList.remove(
        'input-field--active',
      );
    }

    function handlePhoneInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      if (value.length === 1) {
        setFormData({
          ...formData,
          phone_number: '(' + (value === '(' ? '' : value),
        });
      } else if (value.length === 4) {
        setFormData({
          ...formData,
          phone_number:
            value.slice(0, -1) +
            ') ' +
            (value.slice(-1) === ')' ? '' : value.slice(-1)),
        });
      } else if (value.length === 11) {
        setFormData({
          ...formData,
          phone_number:
            value.slice(0, -1) +
            '-' +
            (value.slice(-1) === '-' ? '' : value.slice(-1)),
        });
      } else
        setFormData({
          ...formData,
          phone_number:
            value.slice(0, -1) +
            (value.slice(-1) === ' ' ? '' : value.slice(-1)),
        });
    }

    function showAlertPhonenumber() {
      const validPhonenumber = phoneRegex.test(formData?.phone_number);
      const containsOnlyNumbers = inputRegex.test(formData?.phone_number);
      const transparent = containsOnlyNumbers
        ? formData?.phone_number.length >= 14
          ? validPhonenumber
            ? 'color-transparent'
            : ''
          : 'color-transparent'
        : '';

      return `alert-text phonenumber-alert ${transparent}`;
    }

    function showAlertCpf() {
      const containsOnlyNumbers = cpfRegex.test(formData?.cpf);
      const transparent = containsOnlyNumbers
        ? validCpf
          ? 'color-transparent'
          : ''
        : '';

      return `alert-text cpf-alert ${transparent}`;
    }
  }
}

export default RegistryData;
