import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import { HiOutlineViewList } from 'react-icons/hi';
import { MdCalendarViewDay } from 'react-icons/md';

import { getRandomInt } from '../../utils/functions.util';
import DataContext from '../../contexts/DataContext';
import SelectAssignedAtBirth from './SelectAssignedAtBirth';
import SelectGenderIdentity from './SelectGenderIdentity';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function RegistryData() {
  const [expandSection, setSectionState] = useState<boolean>(false);
  const [height, setHeight] = useState<number | string>(0);

  const {
    registryData: formData,
    setRegistryData: setFormData,
    selectGender,
    updateHeight,
    selectAssigned,
    setHasSubmitted,
  } = useContext(DataContext);

  const inputRef = useRef<InputRef>({
    gender: null,
    assigned_at_birth: null,
    rg: null,
    personal_number: null,
    household_number: null,
  });
  const sectionRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      if (expandSection) {
        setHeight(sectionRef.current.getBoundingClientRect().height);
      } else setHeight(0);
    }
  }, [expandSection, selectGender, selectAssigned, updateHeight]);

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
        {registryDataComponent}
      </div>
    </section>
  );

  function toggleSection() {
    setSectionState(!expandSection);
  }

  function buildRegistryDataComponent() {
    const alertPhonenumber =
      formData?.personal_number.length === 15
        ? `Telefone inválido`
        : `Insira apenas números`;

    const alertHouseholdNumber =
      formData?.household_number.length === 14
        ? `Telefone residencial inválido`
        : `Insira apenas números`;

    return (
      <form ref={sectionRef} className='form-group' onSubmit={handleSubmit}>
        <section className='input-section'>
          <input
            type='text'
            name='rg'
            maxLength={25}
            value={formData?.rg}
            className='input-field input-spacedout-field'
            ref={(element) => (inputRef.current['rg'] = element)}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>RG</label>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='personal_number'
            maxLength={15}
            value={formData?.personal_number}
            ref={(element) => (inputRef.current['personal_number'] = element)}
            className='input-field input-spacedout-field'
            onChange={handlePhoneInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Telefone pessoal</label>
          <p className={showAlertPhonenumber()}>{alertPhonenumber}</p>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='household_number'
            maxLength={14}
            value={formData?.household_number}
            ref={(element) => (inputRef.current['household_number'] = element)}
            className='input-field input-spacedout-field'
            onChange={handleHousePhoneInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Telefone residencial</label>
          <p className={showAlertHousePhonenumber()}>{alertHouseholdNumber}</p>
        </section>
        <SelectAssignedAtBirth />
        <SelectGenderIdentity />
      </form>
    );

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setHasSubmitted(true);
      setTimeout(() => null, getRandomInt(750, 2000));
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
      if (e.target.name === 'birthdate') return null;
      return inputRef.current[e.target.name]?.classList.add(
        'input-field--focused',
      );
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (e.target.name === 'birthdate') return null;
      return inputRef.current[e.target.name]?.classList.remove(
        'input-field--focused',
      );
    }

    function handlePhoneInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      if (value.length === 1) {
        setFormData({
          ...formData,
          personal_number: '(' + (value === '(' ? '' : value),
        });
      } else if (value.length === 4) {
        setFormData({
          ...formData,
          personal_number:
            value.slice(0, -1) +
            ') ' +
            (value.slice(-1) === ')' ? '' : value.slice(-1)),
        });
      } else if (value.length === 11) {
        setFormData({
          ...formData,
          personal_number:
            value.slice(0, -1) +
            '-' +
            (value.slice(-1) === '-' ? '' : value.slice(-1)),
        });
      } else
        setFormData({
          ...formData,
          personal_number:
            value.slice(0, -1) +
            (value.slice(-1) === ' ' ? '' : value.slice(-1)),
        });
    }

    function handleHousePhoneInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      if (value.length === 1) {
        setFormData({
          ...formData,
          household_number: '(' + (value === '(' ? '' : value),
        });
      } else if (value.length === 4) {
        setFormData({
          ...formData,
          household_number:
            value.slice(0, -1) +
            ') ' +
            (value.slice(-1) === ')' ? '' : value.slice(-1)),
        });
      } else if (value.length === 10) {
        setFormData({
          ...formData,
          household_number:
            value.slice(0, -1) +
            '-' +
            (value.slice(-1) === '-' ? '' : value.slice(-1)),
        });
      } else
        setFormData({
          ...formData,
          household_number:
            value.slice(0, -1) +
            (value.slice(-1) === ' ' ? '' : value.slice(-1)),
        });
    }

    function showAlertPhonenumber() {
      const phoneRegex = /^(\((\d{2})\)\s9)([1-9])(\d{3})-(\d{4})$/;
      const validPhonenumber = phoneRegex.test(formData?.personal_number);

      const inputRegex = /^[0-9()-\s]*$/;
      const containsOnlyNumbers = inputRegex.test(formData?.personal_number);
      const transparent = containsOnlyNumbers
        ? formData?.personal_number.length === 15
          ? validPhonenumber
            ? 'color-transparent'
            : ''
          : 'color-transparent'
        : '';

      return `alert-text phonenumber-alert ${transparent}`;
    }

    function showAlertHousePhonenumber() {
      const phoneRegex = /^(\((\d{2})\)\s)(\d{4})-(\d{4})$/;
      const validPhonenumber = phoneRegex.test(formData?.household_number);

      const inputRegex = /^[0-9()-\s]*$/;
      const containsOnlyNumbers = inputRegex.test(formData?.household_number);
      const transparent = containsOnlyNumbers
        ? formData?.household_number.length === 14
          ? validPhonenumber
            ? 'color-transparent'
            : ''
          : 'color-transparent'
        : '';

      return `alert-text housenumber-alert ${transparent}`;
    }
  }
}

export default RegistryData;
