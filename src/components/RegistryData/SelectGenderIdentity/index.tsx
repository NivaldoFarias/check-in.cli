import {
  ChangeEvent,
  FocusEvent,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import DataContext from '../../../contexts/DataContext';
import CustomSelect from './CustomSelect';

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

function SelectGenderIdentity() {
  const [showOptionalInput, setShowOptionalInput] = useState<boolean>(false);

  const {
    registryData: formData,
    setRegistryData: setFormData,
    selectGender,
    setUpdateHeight,
    updateHeight,
    setHasGenderCleared: setHasCleared,
    hasGenderCleared: shasCleared,
  } = useContext(DataContext);

  const inputRef = useRef<InputRef>({
    gender: null,
    assigned_at_birth: null,
    rg: null,
    personal_number: null,
    household_number: null,
    described_identity: null,
  });

  useEffect(() => {
    if (formData.gender === 'SELF_DESCRIBED') {
      setShowOptionalInput(true);
    } else setShowOptionalInput(false);
    setUpdateHeight(!updateHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.gender, selectGender]);

  useEffect(() => {
    if (shasCleared) {
      if (showOptionalInput) {
        setShowOptionalInput(false);
      }
      setHasCleared(false);
      setUpdateHeight(!updateHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shasCleared]);

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
      </>
    );

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
      return inputRef.current[e.target.name]?.classList.add(
        'input-field--focused',
      );
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      return inputRef.current[e.target.name]?.classList.remove(
        'input-field--focused',
      );
    }
  }
}

export default SelectGenderIdentity;
