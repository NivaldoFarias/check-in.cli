import {
  ChangeEvent,
  FocusEvent,
  useContext,
  useState,
  useMemo,
  useRef,
} from 'react';

import {
  MdViewHeadline,
  MdCalendarViewDay,
  MdFormatClear,
} from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

import DataContext from '../../contexts/DataContext';
import { time } from '../../utils/constants.util';
import Insurance from './Insurances';
import useAutoFill from '../../hooks/useAutoFill';

export type InputRef = {
  full_name: HTMLInputElement | null;
  first_name: HTMLInputElement | null;
  insurance: HTMLInputElement | null;
  birthdate: HTMLInputElement | null;
  fallbackBirthdate: HTMLInputElement | null;
};

function CommonData() {
  const [countDateInputs, setCountDateInputs] = useState<number>(0);
  const [expandSection, setSectionState] = useState<boolean>(false);
  const [hasFirstNameAutoFilled, setHasFirstNameAutoFilled] =
    useState<boolean>(false);
  const [hasFullNameAutoFilled, setHasFullNameAutoFilled] =
    useState<boolean>(false);
  const [updateHeight, setUpdateHeight] = useState<boolean | string>(false);

  const {
    isSectionComplete,
    setIsSectionComplete,
    commonData: formData,
    setCommonData: setFormData,
    selectInsurance,
  } = useContext(DataContext);

  const inputRef = useRef<InputRef>({
    full_name: null,
    first_name: null,
    insurance: null,
    birthdate: null,
    fallbackBirthdate: null,
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  const height = useMemo(() => {
    return sectionRef?.current && expandSection
      ? sectionRef.current.getBoundingClientRect().height
      : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandSection, selectInsurance, formData?.insurance, updateHeight]);

  useMemo(() => {
    const birthdateIsSet = countDateInputs >= 4;
    const socialNameIsSet = formData?.first_name?.length > 0;
    const fullNameIsSet = formData?.full_name?.length > 3;
    const insuranceIsSet =
      formData?.insurance?.length > 0 &&
      (formData?.insurance === 'PRIVATE' ||
        formData?.insurance_code?.length > 4);

    const isComplete =
      birthdateIsSet && socialNameIsSet && fullNameIsSet && insuranceIsSet;
    if (isComplete && !isSectionComplete.common) {
      setIsSectionComplete({
        ...isSectionComplete,
        common: true,
      });
    } else if (!isComplete && isSectionComplete.common)
      setIsSectionComplete({
        ...isSectionComplete,
        common: false,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData,
    isSectionComplete?.common,
    hasFirstNameAutoFilled,
    hasFullNameAutoFilled,
  ]);

  useMemo(() => {
    if (
      sectionRef?.current &&
      typeof updateHeight === 'string' &&
      updateHeight === 'scroll'
    ) {
      sectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [sectionRef, updateHeight]);

  useAutoFill({
    inputRef,
    hasFirstNameAutoFilled,
    setSectionState,
    setHasFirstNameAutoFilled,
    hasFullNameAutoFilled,
    setHasFullNameAutoFilled,
  });

  const commonDataComponent = buildCommonDataComponent();

  return (
    <section className='section-container'>
      <div className='section-header'>
        <h2 className='section-header__subtitle' onClick={toggleSection}>
          Dados Básicos
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
                isSectionComplete.common ? '--complete' : ''
              }`}
            />
            {isSectionComplete.common ? (
              <IoMdCheckmarkCircleOutline className='section-header__complete-checkmark' />
            ) : null}
          </>
        )}
      </div>
      <div className='register-data-section' style={{ height }}>
        {commonDataComponent}
      </div>
    </section>
  );

  function toggleSection() {
    setSectionState(!expandSection);
  }

  function buildCommonDataComponent() {
    const alertBirthdate = `Insira uma data válida`;

    return (
      <div ref={sectionRef} className='form-group'>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasFirstNameAutoFilled && formData.first_name?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={() => handleReset('first_name')}
          />
          <input
            ref={(element) => (inputRef.current['first_name'] = element)}
            type='text'
            value={formData?.first_name}
            name='first_name'
            minLength={1}
            maxLength={25}
            pattern='^(?!-)(?!.*-$)[a-zA-ZãÃẽẼĩĨõÕũŨáÁéÉíÍóÓúÚâÂêÊîÎôÔûÛàÀèÈìÌòÒùÙäÄöÖüÜẞçÇ]+$'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className={`input-field ${
              hasFirstNameAutoFilled && formData.first_name.length > 0
                ? 'input-field--active'
                : ''
            }`}
            disabled={hasFirstNameAutoFilled && formData.first_name.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>
            Nome <span className='tidy-field'>&nbsp;(apelido)</span>
          </label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasFullNameAutoFilled && formData.full_name?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={() => handleReset('full_name')}
          />
          <input
            type='text'
            minLength={1}
            maxLength={35}
            name='full_name'
            className={`input-field tidy-field ${
              hasFullNameAutoFilled && formData.full_name.length > 0
                ? 'input-field--active'
                : ''
            }`}
            value={formData?.full_name}
            ref={(element) => (inputRef.current['full_name'] = element)}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasFullNameAutoFilled && formData.full_name.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Nome Completo</label>
        </section>
        <section className='input-section'>
          <input
            type='date'
            name='birthdate'
            min={time.MIN_DATE}
            max={time.CURRRENT_DATE}
            value={formData?.birthdate}
            pattern='\d{4}-\d{2}-\d{2}'
            ref={(element) => (inputRef.current['birthdate'] = element)}
            className='input-field input-field--active input-spacedout-field input-date-field'
            onChange={handleBirthdateInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Data de nascimento</label>
          <p className={showAlertBirthdate()}>{alertBirthdate}</p>
        </section>
        <Insurance
          updateHeight={updateHeight}
          setUpdateHeight={setUpdateHeight}
        />
      </div>
    );

    function handleReset(name: 'full_name' | 'first_name') {
      setFormData({
        ...formData,
        [name]: '',
      });
      if (name === 'full_name') setHasFullNameAutoFilled(false);
      else if (name === 'first_name') setHasFirstNameAutoFilled(false);
    }

    function handleBirthdateInput(e: ChangeEvent<HTMLInputElement>) {
      setCountDateInputs(countDateInputs + 1);
      const { value } = e.target;

      if (value.length === 3 || value.length === 6) {
        setFormData({
          ...formData,
          birthdate:
            value.slice(0, -1) +
            '/' +
            (value.slice(-1) === '/' ? '' : value.slice(-1)),
        });
      } else {
        setFormData({ ...formData, birthdate: value });
      }
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
      if (e.target.name === 'birthdate') return null;
      return inputRef.current[
        e.target.name as
          | 'full_name'
          | 'first_name'
          | 'birthdate'
          | 'insurance'
          | 'fallbackBirthdate'
      ]?.classList.add('input-field--active');
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (e.target.value.length === 0 && e.target.name !== 'birthdate') {
        return inputRef.current[
          e.target.name as
            | 'full_name'
            | 'first_name'
            | 'birthdate'
            | 'insurance'
            | 'fallbackBirthdate'
        ]?.classList.remove('input-field--active');
      } else return null;
    }

    function showAlertBirthdate() {
      const input = formData?.birthdate ?? '';
      const millenium = input[0];
      const century = input[1];
      const decade = input[2];
      const year = input[3];

      const validNineteenthCentury = millenium === '1' && century === '9';
      const validTwentiethCentury =
        millenium === '2' &&
        century === '0' &&
        (decade === '0' ||
          decade === '1' ||
          (decade === '2' && (year === '0' || year === '1' || year === '2')));
      const isInputSet = countDateInputs >= 4;

      const validInput =
        (isInputSet && (validNineteenthCentury || validTwentiethCentury)) ||
        !isInputSet;

      const transparent = validInput ? 'color-transparent' : '';

      return `alert-text birthday-alert ${transparent}`;
    }
  }
}

export default CommonData;
