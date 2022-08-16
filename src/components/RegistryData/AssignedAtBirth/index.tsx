import { useContext } from 'react';
import Select from 'react-select';

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
        blurInputOnSelect={true}
        tabSelectsValue={true}
        backspaceRemovesValue={true}
        menuShouldScrollIntoView={false}
        className='select-wrapper'
        classNamePrefix='select-wrapper'
        placeholder='Selecionar'
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </>
  );

  function handleInputFocus() {
    setSelectAssigned(true);
  }

  function handleInputBlur() {
    setSelectAssigned(false);
  }
}

export default AssignedAtBirth;
