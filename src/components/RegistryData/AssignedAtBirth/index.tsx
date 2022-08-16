import { useContext } from 'react';
import Select, { InputActionMeta } from 'react-select';

import DataContext from '../../../contexts/DataContext';

import DropdownIndicator from './DropdownIndicator';
import SingleValue from './SingleValue';
import Control from './Control';
import Input from './Input';

function AssignedAtBirth() {
  const options = [
    { value: 'FEMALE', label: 'Feminino' },
    { value: 'MALE', label: 'Masculino' },
    { value: 'INTERSEXO', label: 'Intersexo' },
    { value: 'OTHER', label: 'Outro' },
  ];

  const { selectAssigned, setSelectAssigned } = useContext(DataContext);

  return (
    <>
      <Select
        options={options}
        components={{ Control, DropdownIndicator, Input, SingleValue }}
        isClearable={true}
        isSearchable={true}
        menuIsOpen={selectAssigned}
        openMenuOnFocus={true}
        openMenuOnClick={true}
        tabSelectsValue={true}
        blurInputOnSelect={true}
        backspaceRemovesValue={true}
        menuShouldScrollIntoView={false}
        className='select-wrapper'
        classNamePrefix='select-wrapper'
        placeholder='Selecionar'
        onInputChange={handleInputChange}
        onBlur={handleInputBlur}
      />
    </>
  );

  function handleInputChange(_newValue: string, actionMeta: InputActionMeta) {
    if (!selectAssigned && actionMeta.action === 'input-change')
      setSelectAssigned(true);
  }

  function handleInputBlur() {
    setSelectAssigned(false);
  }
}

export default AssignedAtBirth;
