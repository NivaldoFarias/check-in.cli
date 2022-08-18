import {
  ChangeEvent,
  FocusEvent,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { HiOutlineViewList } from 'react-icons/hi';
import { MdCalendarViewDay } from 'react-icons/md';

import DataContext from '../../contexts/DataContext';
import { time } from '../../utils/constants.util';
import Insurance from './Insurances';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function CommonData() {
  const [countDateInputs, setCountDateInputs] = useState<number>(0);
  const [expandSection, setSectionState] = useState<boolean>(false);
  const [height, setHeight] = useState<number | string>(0);

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
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      if (expandSection) {
        setHeight(sectionRef.current.getBoundingClientRect().height);
      } else setHeight(0);
    }
  }, [expandSection, selectInsurance]);

  useEffect(() => {
    const birthdateIsSet = countDateInputs >= 4;
    const socialNameIsSet = formData?.first_name?.length > 0;
    const fullNameIsSet = formData?.full_name?.length > 3;
    const insuranceIsSet = formData?.insurance?.length > 0;
    const isComplete =
      birthdateIsSet && socialNameIsSet && fullNameIsSet && insuranceIsSet;

    if (isComplete) {
      setIsSectionComplete({
        ...isSectionComplete,
        common: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

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
          <HiOutlineViewList
            onClick={toggleSection}
            className='section-header__icon'
          />
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
          <input
            ref={(element) => (inputRef.current['first_name'] = element)}
            type='text'
            value={formData?.first_name}
            name='first_name'
            minLength={1}
            maxLength={25}
            pattern='^(?!-)(?!.*-$)[a-zãẽĩõũáéíóúâêîôûàèìòùäöüẞç]{1,25}$'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className='input-field'
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>
            Primeiro nome{' '}
            <span className='tidy-field'>&nbsp;(nome próprio)</span>
          </label>
        </section>
        <section className='input-section'>
          <input
            type='text'
            minLength={1}
            maxLength={35}
            name='full_name'
            className='input-field'
            value={formData?.full_name}
            ref={(element) => (inputRef.current['full_name'] = element)}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
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
        <section className='input-section'>
          <p className='input-section__label'>Convênio</p>
          <Insurance updateValue={updateValue} />
        </section>
      </div>
    );

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
      return inputRef.current[e.target.name]?.classList.add(
        'input-field--active',
      );
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (e.target.value.length === 0 && e.target.name !== 'birthdate') {
        return inputRef.current[e.target.name]?.classList.remove(
          'input-field--active',
        );
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

    function updateValue(value: string) {
      setFormData({ ...formData, insurance: value });
    }
  }
}

export default CommonData;
