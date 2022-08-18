import Select, { ActionMeta, InputActionMeta } from 'react-select';
import { useContext } from 'react';

import DataContext from '../../../contexts/DataContext';

import DropdownIndicator from './DropdownIndicator';
import SingleValue from './SingleValue';
import Control from './Control';
import Input from './Input';

function CustomSelect() {
  const options = [
    { value: 'FEMALE', label: 'Feminino' },
    { value: 'MALE', label: 'Masculino' },
    { value: 'INTERSEXO', label: 'Intersexo' },
    { value: 'SELF_DESCRIBED', label: 'Prefiro descrever' },
  ];

  const {
    registryData,
    setRegistryData,
    selectAssigned,
    updateHeight,
    setUpdateHeight,
    setSelectAssigned,
    setHasAssignedCleared: setHasCleared,
  } = useContext(DataContext);

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
      setRegistryData({ ...registryData, assigned_at_birth: '' });
      setSelectAssigned(false);
      setHasCleared(true);
      setUpdateHeight(!updateHeight);
    }
  }

  function handleInputBlur() {
    setSelectAssigned(false);
    setUpdateHeight(!updateHeight);
  }
}

export default CustomSelect;
