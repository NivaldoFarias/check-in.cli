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

function SelectAssignedAtBirth() {
  const [showOptionalInput, setShowOptionalInput] = useState<boolean>(false);

  const {
    registryData: formData,
    setRegistryData: setFormData,
    selectAssigned,
    setUpdateHeight,
    updateHeight,
    setHasAssignedCleared: setHasCleared,
    hasAssignedCleared: shasCleared,
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
    if (formData.assigned_at_birth === 'OTHER') {
      setShowOptionalInput(true);
    } else setShowOptionalInput(false);
    setUpdateHeight(!updateHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.assigned_at_birth, selectAssigned]);

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

  const selectAssignedAtBirthComponent = buildSelectAssignedAtBirthComponent();

  return selectAssignedAtBirthComponent;

  function buildSelectAssignedAtBirthComponent() {
    return (
      <>
        <section className='input-section assigned-at-birth'>
          <p className='input-section__label'>Sexo biológico</p>
          <CustomSelect />
        </section>
        <section
          className={`input-section ${showOptionalInput ? '' : 'hidden'}`}
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

export default SelectAssignedAtBirth;
