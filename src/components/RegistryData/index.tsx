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
import GenderIdentity from './GenderIdentity';
import AssignedAtBirth from './AssignedAtBirth';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function RegistryData() {
  const [expandSection, setSectionState] = useState<boolean>(false);
  const [height, setHeight] = useState<number | string>(0);
  const [showOptionalGenderInput, setShowOptionalGenderInput] =
    useState<boolean>(false);
  const [showOptionalAssignedInput, setShowOptionalAssignedInput] =
    useState<boolean>(false);

  const {
    registryData: formData,
    setRegistryData: setFormData,
    selectGender,
    hasGenderCleared,
    setHasGenderCleared,
    hasAssignedCleared,
    setHasAssignedCleared,
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
    if (formData.gender === 'SELF_DESCRIBED') {
      setShowOptionalGenderInput(true);
    } else setShowOptionalGenderInput(false);
  }, [formData.gender, selectGender]);

  useEffect(() => {
    if (formData.assigned_at_birth === 'OTHER') {
      setShowOptionalAssignedInput(true);
    } else setShowOptionalAssignedInput(false);
  }, [formData.assigned_at_birth, selectAssigned]);

  useEffect(() => {
    if (sectionRef.current) {
      if (expandSection) {
        setHeight(sectionRef.current.getBoundingClientRect().height);
      } else setHeight(0);
    }
  }, [
    expandSection,
    selectGender,
    selectAssigned,
    showOptionalGenderInput,
    showOptionalAssignedInput,
    hasGenderCleared,
    hasAssignedCleared,
  ]);

  useEffect(() => {
    if (hasGenderCleared) {
      if (showOptionalGenderInput) {
        setShowOptionalGenderInput(false);
      }
      setHasGenderCleared(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGenderCleared]);

  useEffect(() => {
    if (hasAssignedCleared) {
      if (showOptionalAssignedInput) {
        setShowOptionalAssignedInput(false);
      }
      setHasAssignedCleared(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAssignedCleared]);

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
            maxLength={25}
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
          <label className='label-text'>Telefone pessoal</label>
        </section>
        <section className='input-section'>
          <input
            type='text'
            name='household_number'
            maxLength={25}
            value={formData?.household_number}
            ref={(element) => (inputRef.current['household_number'] = element)}
            className='input-field input-spacedout-field'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Telefone residencial</label>
        </section>
        <section className='input-section assigned-at-birth'>
          <p className='input-section__label'>Sexo biológico</p>
          <AssignedAtBirth />
        </section>
        <section
          className={`input-section ${
            showOptionalAssignedInput ? '' : 'hidden'
          }`}
        >
          <input
            type='text'
            name='described_assigned'
            maxLength={30}
            value={formData?.described_assigned}
            ref={(element) =>
              (inputRef.current['described_assigned'] = element)
            }
            className='input-field input-spacedout-field'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Sexo biológico</label>
        </section>
        <section className='input-section gender-identity'>
          <p className='input-section__label'>Identidade de gênero</p>
          <GenderIdentity />
        </section>
        <section
          className={`input-section ${showOptionalGenderInput ? '' : 'hidden'}`}
        >
          <input
            type='text'
            name='described_identity'
            maxLength={30}
            value={formData?.described_identity}
            ref={(element) =>
              (inputRef.current['described_identity'] = element)
            }
            className='input-field input-spacedout-field'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Identidade de gênero</label>
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
