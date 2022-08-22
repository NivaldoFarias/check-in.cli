import Select, {
  components,
  ActionMeta,
  InputActionMeta,
  StylesConfig,
  ValueContainerProps,
} from 'react-select';
import { MouseEvent, TouchEvent, useContext } from 'react';

import DataContext from '../../../contexts/DataContext';

import SingleValue from './SingleValue';
import Input from './Input';

function CustomSelect() {
  const options = [
    { value: 'FEMALE', label: 'Feminino' },
    { value: 'MALE', label: 'Masculino' },
    { value: 'INTERSEXO', label: 'Intersexo' },
    { value: 'SELF_DESCRIBED', label: 'Prefiro descrever' },
  ];
  const customStyles: StylesConfig<any> = {
    dropdownIndicator: (provided, _state) => ({
      ...provided,
      transform: selectAssigned ? 'rotate(180deg)' : 'rotate(0deg)',
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
    selectAssigned,
    updateHeight,
    setUpdateHeight,
    setSelectAssigned,
    hasAssignedCleared: hasCleared,
    setHasAssignedCleared: setHasCleared,
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
    <>
      <Select
        options={options}
        styles={customStyles}
        menuIsOpen={selectAssigned}
        components={{ ValueContainer, Input, SingleValue }}
        isClearable={true}
        isSearchable={false}
        openMenuOnFocus={true}
        openMenuOnClick={true}
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
    </>
  );

  function handleInputFocus() {
    if (!selectAssigned && !hasCleared) {
      setSelectAssigned(true);
      setUpdateHeight(true);
    }
  }

  function handleClick(_e: MouseEvent) {
    if (!selectAssigned) setSelectAssigned(true);
  }

  function handleTouchStart(e: TouchEvent) {
    e.stopPropagation();
  }

  function handleTouchEnd(e: TouchEvent) {
    e.stopPropagation();
  }

  function handleInputChange(_newValue: string, actionMeta: InputActionMeta) {
    if (!selectAssigned && actionMeta.action === 'input-change') {
      setSelectAssigned(true);
    } else if (
      actionMeta.action === 'input-blur' ||
      actionMeta.action === 'menu-close'
    ) {
      setSelectAssigned(false);
    }

    setUpdateHeight(!updateHeight);
  }

  function handleSelectChange(_newValue: string, actionMeta: ActionMeta<any>) {
    if (actionMeta.action === 'clear') {
      setRegistryData({ ...registryData, gender: '' });
      setHasCleared(true);
      setSelectAssigned(false);
      setUpdateHeight(!updateHeight);
    }
  }
}

export default CustomSelect;
