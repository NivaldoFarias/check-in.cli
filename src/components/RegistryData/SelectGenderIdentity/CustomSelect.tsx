import Select, {
  ActionMeta,
  InputActionMeta,
  StylesConfig,
  ValueContainerProps,
} from 'react-select';
import { MouseEvent, TouchEvent, useContext } from 'react';

import DataContext from '../../../contexts/DataContext';
import SingleValue from './SingleValue';
import Input from './Input';
import { components } from 'react-select';

function CustomSelect() {
  const options = [
    { value: 'WOMAN', label: 'Mulher' },
    { value: 'MAN', label: 'Homem' },
    { value: 'NON_BINARY', label: 'Não-binário' },
    { value: 'GENDER_FLUID', label: 'Gênero-fluido' },
    { value: 'SELF_DESCRIBED', label: 'Prefiro descrever' },
    { value: 'NO_INFO', label: 'Prefiro não informar' },
  ];
  const customStyles: StylesConfig<any> = {
    dropdownIndicator: (provided, _state) => ({
      ...provided,
      transform: selectGender ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    noOptionsMessage: (provided, _state) => ({
      ...provided,
      letterSpacing: '0px',
      textShadow: 'none',
    }),
  };

  const {
    registryData,
    setRegistryData,
    selectGender,
    updateHeight,
    setUpdateHeight,
    setSelectGender,
    hasGenderCleared: hasCleared,
    setHasGenderCleared: setHasCleared,
  } = useContext(DataContext);

  const ValueContainer = (props: ValueContainerProps) => {
    const { children } = props;
    return (
      <div
        className='value-container-on-click'
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <components.ValueContainer {...props}>
          {children}
        </components.ValueContainer>
      </div>
    );
  };

  return (
    <Select
      options={options}
      styles={customStyles}
      menuIsOpen={selectGender}
      components={{ ValueContainer, Input, SingleValue }}
      noOptionsMessage={() => 'Nenhum termo encontrado'}
      isClearable={true}
      isSearchable={false}
      openMenuOnFocus={true}
      tabSelectsValue={true}
      blurInputOnSelect={true}
      backspaceRemovesValue={true}
      menuShouldScrollIntoView={false}
      placeholder='Selecionar'
      className='select-wrapper'
      classNamePrefix='select-wrapper'
      onFocus={handleInputFocus}
      onChange={handleSelectChange}
      onInputChange={handleInputChange}
    />
  );

  function handleInputFocus() {
    if (!selectGender && !hasCleared) {
      setSelectGender(true);
      setUpdateHeight(true);
    }
  }

  function handleClick(_e: MouseEvent) {
    if (!selectGender) setSelectGender(true);
  }

  function handleTouchStart(e: TouchEvent) {
    e.stopPropagation();
  }

  function handleTouchEnd(e: TouchEvent) {
    e.stopPropagation();
  }

  function handleInputChange(_newValue: string, actionMeta: InputActionMeta) {
    if (!selectGender && actionMeta.action === 'input-change') {
      setSelectGender(true);
    } else if (
      actionMeta.action === 'input-blur' ||
      actionMeta.action === 'menu-close'
    ) {
      setSelectGender(false);
    }

    setUpdateHeight(!updateHeight);
  }

  function handleSelectChange(_newValue: string, actionMeta: ActionMeta<any>) {
    if (actionMeta.action === 'clear') {
      setRegistryData({ ...registryData, gender: '' });
      setHasCleared(true);
      setSelectGender(false);
      setUpdateHeight(!updateHeight);
    }
  }
}

export default CustomSelect;
