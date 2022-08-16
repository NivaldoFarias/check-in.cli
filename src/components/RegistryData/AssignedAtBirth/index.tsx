import { useContext } from 'react';
import Select, { ActionMeta, InputActionMeta } from 'react-select';

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

  const { selectAssigned, setSelectAssigned, setHasAssignedCleared } =
    useContext(DataContext);

  return (
    <>
      <Select
        options={options}
        components={{ Control, DropdownIndicator, Input, SingleValue }}
        isClearable={true}
        isSearchable={true}
        menuIsOpen={selectAssigned}
        onChange={handleInputChange}
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

  function handleInputChange(
    _newValue: string,
    actionMeta: InputActionMeta | ActionMeta<any>,
  ) {
    if (!selectAssigned && actionMeta.action === 'input-change')
      setSelectAssigned(true);
    else if (actionMeta.action === 'clear') {
      setSelectAssigned(false);
      setHasAssignedCleared(true);
    }
  }

  function handleInputBlur() {
    setSelectAssigned(false);
  }
}

export default AssignedAtBirth;
