import { useState } from 'react';
import Select from 'react-select';

function Insurance() {
  const [insurance, setInsurance] = useState<any>();
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  return (
    <>
      <Select
        options={options}
        defaultValue={insurance}
        isClearable={true}
        isSearchable={true}
        tabSelectsValue={true}
        backspaceRemovesValue={true}
        className='select-insurance'
        classNamePrefix='select-insurance'
        placeholder='Selecione o convênio'
        onInputChange={handleInputChange}
      />
    </>
  );

  function handleInputChange(input: string) {
    setInsurance(input);
  }
}

export default Insurance;
