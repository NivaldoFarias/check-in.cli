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

import { getRandomInt } from '../utils/functions.util';
import DataContext from '../contexts/DataContext';
import { time } from '../utils/constants.util';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function RegistryData() {
  const [expandSection, setSectionState] = useState<boolean>(false);
  const [height, setHeight] = useState<number | string>(0);

  const {
    registryData: formData,
    setRegistryData: setFormData,
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
  }, [expandSection]);

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
    return (
      <form ref={sectionRef} className='form-group' onSubmit={handleSubmit}>
        <section className='input-section'>
          <input
            type='text'
            maxLength={20}
            name='gender'
            className='input-field'
            value={formData?.gender}
            ref={(element) => (inputRef.current['gender'] = element)}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Identidade de gênero</label>
        </section>
        <section className='input-section'>
          <input
            ref={(element) => (inputRef.current['assigned_at_birth'] = element)}
            type='text'
            value={formData?.assigned_at_birth}
            name='assigned_at_birth'
            maxLength={25}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className='input-field'
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Sexo biológico</label>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='rg'
            maxLength={14}
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
            min={time.MIN_DATE}
            max={time.CURRRENT_DATE}
            value={formData?.personal_number}
            ref={(element) => (inputRef.current['personal_number'] = element)}
            className='input-field input-spacedout-field'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Data de nascimento</label>
        </section>
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
  }
}

export default RegistryData;
