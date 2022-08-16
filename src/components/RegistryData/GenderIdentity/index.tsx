import { useContext } from 'react';
import Select from 'react-select';

import DataContext from '../../../contexts/DataContext';

import DropdownIndicator from './DropdownIndicator';
import SingleValue from './SingleValue';
import Control from './Control';
import Input from './Input';

function GenderIdentity() {
  const options = [
    { value: 'WOMAN', label: 'Mulher' },
    { value: 'MAN', label: 'Homem' },
    { value: 'NON_BINARY', label: 'Não-binário' },
    { value: 'GENDER_FLUID', label: 'Gênero-fluido' },
    { value: 'SELF_DESCRIBED', label: 'Prefiro descrever' },
    { value: 'NO_INFO', label: 'Prefiro não informar' },
  ];

  const { selectGender, setSelectGender } = useContext(DataContext);

  return (
    <>
      <Select
        options={options}
        components={{ Control, DropdownIndicator, Input, SingleValue }}
        isClearable={true}
        isSearchable={true}
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
        onInputChange={(newValue: string) => console.log(newValue)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </>
  );

  function handleInputFocus() {
    setSelectGender(true);
  }

  function handleInputBlur() {
    setSelectGender(false);
  }
}

export default GenderIdentity;
