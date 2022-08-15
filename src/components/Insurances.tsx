import { MouseEvent, useState } from 'react';
import Select, { components, DropdownIndicatorProps } from 'react-select';
import type { Props, ControlProps } from 'react-select';

function Insurance(props: Props<any>) {
  const [insurance, setInsurance] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  const Control = (props: ControlProps) => {
    const { children } = props;

    return (
      <div onClick={handleClick}>
        <components.Control {...props}>{children}</components.Control>
      </div>
    );

    function handleClick(e: MouseEvent<HTMLElement>) {
      e.preventDefault();
      setIsOpen(!isOpen);
      console.log(isOpen);
    }
  };

  const DropdownIndicator = (props: DropdownIndicatorProps) => {
    const { children } = props;
    const dropdownStyles = {
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    };

    return (
      <div style={dropdownStyles}>
        <components.DropdownIndicator {...props}>
          {children}
        </components.DropdownIndicator>
      </div>
    );
  };

  return (
    <>
      <Select
        {...props}
        options={options}
        components={{ Control, DropdownIndicator }}
        defaultValue={insurance}
        isClearable={true}
        isSearchable={false}
        menuIsOpen={isOpen}
        openMenuOnFocus={true}
        openMenuOnClick={true}
        tabSelectsValue={true}
        backspaceRemovesValue={true}
        className='select-insurance'
        classNamePrefix='select-insurance'
        placeholder='Selecione o convênio'
        onInputChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </>
  );

  function handleInputChange(input: string) {
    setInsurance(input);
  }

  function handleInputFocus() {
    setIsOpen(true);
  }

  function handleInputBlur() {
    setIsOpen(false);
  }
}

export default Insurance;
