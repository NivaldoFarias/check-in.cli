import { MouseEvent, TouchEvent, useContext, useState, useEffect } from 'react';
import Select, {
  ActionMeta,
  components,
  InputActionMeta,
  InputProps,
  StylesConfig,
  ValueContainerProps,
} from 'react-select';

import DataContext from '../../contexts/DataContext';
import SingleValue from './SingleValue';

function Insurance({ updateHeight, setUpdateHeight }: any) {
  const [hasCleared, setHasCleared] = useState<boolean>(false);

  const options = [
    { value: 'PRIVATE', label: 'Particular (N/A)' },
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
  const customStyles: StylesConfig<any> = {
    dropdownIndicator: (provided, _state) => ({
      ...provided,
      transform: selectInsurance ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    noOptionsMessage: (provided, _state) => ({
      ...provided,
      letterSpacing: '0px',
      textShadow: 'none',
    }),
  };

  const { selectInsurance, setSelectInsurance, commonData, setCommonData } =
    useContext(DataContext);

  const ValueContainer = (props: ValueContainerProps) => {
    const { children } = props;
    return (
      <div
        className='value-container-on-click'
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <components.ValueContainer {...props}>
          {children}
        </components.ValueContainer>
      </div>
    );
  };

  const Input = (props: InputProps) => {
    const { children } = props;

    return (
      <components.Input autoFocus={selectInsurance} {...props}>
        {children}
      </components.Input>
    );
  };

  useEffect(() => {
    if (hasCleared) {
      setTimeout(() => setHasCleared(false), 200);
    }
  }, [hasCleared]);

  return (
    <Select
      options={options}
      styles={customStyles}
      menuIsOpen={selectInsurance}
      components={{ ValueContainer, Input, SingleValue }}
      noOptionsMessage={() => 'Nenhuma opção encontrada'}
      isClearable={true}
      isSearchable={true}
      openMenuOnFocus={true}
      tabSelectsValue={true}
      blurInputOnSelect={true}
      backspaceRemovesValue={true}
      menuShouldScrollIntoView={true}
      className='select-wrapper'
      classNamePrefix='select-wrapper'
      placeholder='Selecione o convênio'
      onFocus={handleInputFocus}
      onChange={handleSelectChange}
      onInputChange={handleInputChange}
    />
  );

  function handleInputFocus() {
    if (!selectInsurance && !hasCleared) {
      setSelectInsurance(true);
      setUpdateHeight(true);
    }
  }

  function handleClick(_e: MouseEvent) {
    if (!selectInsurance) {
      setSelectInsurance(true);
      setUpdateHeight('scroll');
    }
  }

  function handleTouchStart(e: TouchEvent) {
    e.stopPropagation();
  }

  function handleTouchEnd(e: TouchEvent) {
    e.stopPropagation();
  }

  function handleInputChange(_newValue: string, actionMeta: InputActionMeta) {
    if (actionMeta.action === 'input-blur') {
      if (selectInsurance) setSelectInsurance(false);
      setHasCleared(false);
    }
    if (actionMeta.action === 'menu-close' && selectInsurance) {
      setSelectInsurance(false);
      setHasCleared(false);
    }
    setUpdateHeight(!updateHeight);
  }

  function handleSelectChange(_newValue: string, actionMeta: ActionMeta<any>) {
    if (actionMeta.action === 'clear') {
      setCommonData({ ...commonData, insurance: '' });
      setHasCleared(true);
      setSelectInsurance(false);
      setUpdateHeight(!updateHeight);
    }
  }
}

export default Insurance;

// TODO STYLES: add disabled class after select
