import { FocusEvent, MouseEvent, useState } from 'react';
import Select, { components, DropdownIndicatorProps } from 'react-select';
import type { Props, ControlProps } from 'react-select';

function Insurance(props: Props<any>) {
  const [insurance, setInsurance] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const options = [
    { value: 'ALLIANZ_SAUDE', label: 'Allianz Saúde' },
    { value: 'AMEPLAN_SAUDE', label: 'Ameplan Saúde' },
    { value: 'AMIL_FACIL', label: 'Amil Fácil' },
    { value: 'AMIL_SAUDE', label: 'Amil Saúde' },
    { value: 'ATIVIA', label: 'Ativia' },
    { value: 'BIOSAUDE', label: 'BioSaude' },
    { value: 'BIOVIDA_SAUDE', label: 'Biovida Saúde' },
    { value: 'BLUE_MED_SAUDE', label: 'Blue Med Saúde' },
    { value: 'CLASSES_LABORIOSAS', label: 'Classes Laboriosas' },
    { value: 'CUIDAR_ME', label: 'cuidar.me' },
    { value: 'CRUZ_AZUL_SAUDE', label: 'Cruz Azul Saúde' },
    { value: 'GS_SAUDE', label: 'GS Saúde' },
    { value: 'GOLDEN_CROSS', label: 'Golden Cross' },
    { value: 'HAPVIDA', label: 'Hapvida' },
    { value: 'HEALTH_SANTARIS', label: 'Health Santaris' },
    { value: 'INTERCLINICAS_SAUDE', label: 'Interclínicas Saúde' },
    { value: 'KIPP_SAUDE', label: 'Kipp Saúde' },
    { value: 'MEDICAL_HEALTH', label: 'Medical Health' },
    { value: 'MEDSENIOR', label: 'MedSênior' },
    { value: 'MED_TOUR_SAUDE', label: 'Med Tour Saúde' },
    { value: 'NOTRE_DAME_INTERMEDICA', label: 'NotreDame Intermédica' },
    { value: 'PLANSAUDE', label: 'PlanSaúde' },
    { value: 'PLENA_SAUDE', label: 'Plena Saúde' },
    { value: 'PORTO_SEGURO_SAUDE', label: 'Porto Seguro Saúde' },
    { value: 'PREVENT_SENIOR', label: 'Prevent Sênior' },
    { value: 'QSAUDE', label: 'Qsaúde' },
    { value: 'SANTA_HELENA_SAUDE', label: 'Santa helena Saúde' },
    { value: 'SAO_CRISTOVAO_SAUDE', label: 'São Cristovão Saúde' },
    { value: 'SAO_MIGUEL_SAUDE', label: 'São Miguel Saúde' },
    { value: 'SEGUROS_UNIMED', label: 'Seguros Unimed' },
    { value: 'SOMPO_SAUDE', label: 'Sompo Saúde' },
    { value: 'SUL_AMERICA_SAUDE', label: 'SulAmérica Saúde' },
    { value: 'TOTAL_MEDCARE_SAUDE', label: 'Total MedCare Saúde' },
    { value: 'TRASMONTANO_SAUDE', label: 'Transmontano Saúde' },
    { value: 'UNIHOSP_SAUDE', label: 'UniHosp Saúde' },
    { value: 'UNIMED_NACIONAL', label: 'Unimed Nacional' },
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
        isSearchable={true}
        menuIsOpen={isOpen}
        openMenuOnFocus={true}
        openMenuOnClick={true}
        blurInputOnSelect={true}
        tabSelectsValue={true}
        backspaceRemovesValue={true}
        menuShouldScrollIntoView={false}
        className='select-insurance'
        classNamePrefix='select-insurance'
        placeholder='Selecione o convênio'
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </>
  );

  function handleInputFocus() {
    setIsOpen(true);
  }

  function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
    setIsOpen(false);
    setInsurance(e.target.value);
  }
}

export default Insurance;
