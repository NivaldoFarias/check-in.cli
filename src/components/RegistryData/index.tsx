import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
  useRef,
  MouseEvent,
} from 'react';

import { HiOutlineViewList } from 'react-icons/hi';
import { MdCalendarViewDay } from 'react-icons/md';
import { AiFillIdcard } from 'react-icons/ai';
import { FaMobile } from 'react-icons/fa';

import { getRandomInt } from '../../utils/functions.util';
import DataContext from '../../contexts/DataContext';
import SelectAssignedAtBirth from './SelectAssignedAtBirth';
import SelectGenderIdentity from './SelectGenderIdentity';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function RegistryData(props: any) {
  const { validCpf } = props;
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
    cpf: null,
    phone_number: null,
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
        {registryDataComponent}
      </div>
    </section>
  );

  function toggleSection() {
    setSectionState(!expandSection);
  }

  function buildRegistryDataComponent() {
    const alertCpf =
      formData?.cpf.length === 14 ? `CPF inválido` : `Insira apenas números`;
    const alertPhonenumber =
      formData?.phone_number.length === 15
        ? `Telefone inválido`
        : `Insira apenas números`;

    return (
      <form ref={sectionRef} className='form-group' onSubmit={handleSubmit}>
        <section className='input-section'>
          <AiFillIdcard className='input-section__cpf-icon' />
          <input
            type='text'
            name='cpf'
            maxLength={14}
            value={formData?.cpf}
            className='input-field input-spacedout-field'
            ref={(element) => (inputRef.current['cpf'] = element)}
            onChange={handleCPFInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text input-spacedout-field'>CPF</label>
          <p className={showAlertCpf()}>{alertCpf}</p>
        </section>
        <section className='input-section'>
          <FaMobile className='input-section__phone-icon' />
          <input
            type='text'
            name='phone_number'
            maxLength={15}
            value={formData?.phone_number}
            ref={(element) => (inputRef.current['phone_number'] = element)}
            className='input-field input-spacedout-field'
            onChange={handlePhoneInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Número de telefone</label>
          <p className={showAlertPhonenumber()}>{alertPhonenumber}</p>
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
      const phoneRegex = /^(\((\d{2})\)\s9)([1-9])(\d{3})-(\d{4})$/;
      const validPhonenumber = phoneRegex.test(formData?.phone_number);

      const inputRegex = /^[0-9()-\s]*$/;
      const containsOnlyNumbers = inputRegex.test(formData?.phone_number);
      const transparent = containsOnlyNumbers
        ? formData?.phone_number.length === 15
          ? validPhonenumber
            ? 'color-transparent'
            : ''
          : 'color-transparent'
        : '';

      return `alert-text phonenumber-alert ${transparent}`;
    }

    function showAlertCpf() {
      const cpfRegex = /^[0-9.-\s]*$/;
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
