import {
  ChangeEvent,
  FocusEvent,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import { MdFormatClear } from 'react-icons/md';
import DataContext from '../../../contexts/DataContext';
import CustomSelect from './CustomSelect';

function SelectGenderIdentity() {
  const [showOptionalInput, setShowOptionalInput] = useState<boolean>(false);
  const [hasAutoFilled, setHasAutoFilled] = useState<boolean>(false);

  const {
    registryData: formData,
    setRegistryData: setFormData,
    selectGender,
    setUpdateHeight,
    updateHeight,
    setHasGenderCleared: setHasCleared,
    hasGenderCleared: hasCleared,
  } = useContext(DataContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formData.gender === 'SELF_DESCRIBED') {
      setShowOptionalInput(true);
    } else setShowOptionalInput(false);
    setUpdateHeight(!updateHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.gender, selectGender]);

  useEffect(() => {
    if (hasCleared) {
      if (showOptionalInput) {
        setShowOptionalInput(false);
      }
      setHasCleared(false);
      setUpdateHeight(!updateHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCleared]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        inputRef.current &&
        inputRef.current?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled
      ) {
        setHasAutoFilled(true);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 500);

    if (hasAutoFilled) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAutoFilled]);

  const selectGenderIdentityComponent = buildSelectGenderIdentityComponent();

  return selectGenderIdentityComponent;

  function buildSelectGenderIdentityComponent() {
    return (
      <>
        <section className='input-section gender-identity'>
          <p className='input-section__label'>Identidade de gênero</p>
          <CustomSelect />
        </section>
        <section
          className={`input-section ${showOptionalInput ? '' : 'hidden'}`}
        >
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled ? '' : 'hidden'
            }`}
            onClick={handleReset}
          />
          <input
            type='text'
            name='described_identity'
            maxLength={40}
            value={formData?.described_identity}
            ref={inputRef}
            className={`input-field ${
              hasAutoFilled &&
              !!formData.described_identity &&
              formData.described_identity.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={
              hasAutoFilled &&
              !!formData.described_identity &&
              formData?.described_identity.length > 0
            }
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Identidate de gênero</label>
        </section>
      </>
    );

    function handleReset() {
      setFormData({
        ...formData,
        described_identity: '',
      });
      setHasAutoFilled(false);
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleInputFocus(_e: FocusEvent<HTMLInputElement>) {
      return inputRef.current?.classList.add('input-field--active');
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (e.target.value.length !== 0) return null;

      return inputRef.current?.classList.remove('input-field--active');
    }
  }
}

export default SelectGenderIdentity;
