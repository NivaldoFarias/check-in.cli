import Select, { ActionMeta, InputActionMeta } from 'react-select';
import { useContext } from 'react';

import DropdownIndicator from './DropdownIndicator';
import SingleValue from './SingleValue';
import Control from './Control';
import Input from './Input';
import DataContext from '../../../contexts/DataContext';

function CustomSelect() {
  const options = [
    { value: 'WOMAN', label: 'Mulher' },
    { value: 'MAN', label: 'Homem' },
    { value: 'NON_BINARY', label: 'Não-binário' },
    { value: 'GENDER_FLUID', label: 'Gênero-fluido' },
    { value: 'SELF_DESCRIBED', label: 'Prefiro descrever' },
    { value: 'NO_INFO', label: 'Prefiro não informar' },
  ];

  const {
    selectGender,
    updateHeight,
    setUpdateHeight,
    setSelectGender,
    setHasGenderCleared: setHasCleared,
  } = useContext(DataContext);

  return (
    <Select
      options={options}
      components={{ Control, DropdownIndicator, Input, SingleValue }}
      isClearable={true}
      isSearchable={true}
      onChange={handleInputChange}
      menuIsOpen={selectGender}
      openMenuOnFocus={true}
      openMenuOnClick={true}
      blurInputOnSelect={true}
      tabSelectsValue={true}
      backspaceRemovesValue={true}
      menuShouldScrollIntoView={false}
      className='select-wrapper'
      classNamePrefix='select-wrapper'
      placeholder='Selecionar'
      onInputChange={handleInputChange}
      onBlur={handleInputBlur}
    />
  );

  function handleInputChange(
    _newValue: string,
    actionMeta: InputActionMeta | ActionMeta<any>,
  ) {
    if (!selectGender && actionMeta.action === 'input-change')
      setSelectGender(true);
    else if (actionMeta.action === 'clear') {
      setSelectGender(false);
      setHasCleared(true);
    }
    setUpdateHeight(!updateHeight);
  }

  function handleInputBlur() {
    setSelectGender(false);
    setUpdateHeight(!updateHeight);
  }
}

export default CustomSelect;
