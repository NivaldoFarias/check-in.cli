import { useContext, useMemo, useEffect } from 'react';

import {
  MdCalendarViewDay,
  MdViewHeadline,
  MdFormatClear,
} from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

import DataContext from '../../contexts/DataContext';
import PostalCode from './PostalCode';
import AddressContext from '../../contexts/AddressContext';

// TODO refactor: component has too many responsibilities

function AddressData() {
  const {
    isSectionComplete,
    setIsSectionComplete,
    addressData: formData,
    updateHeight,
  } = useContext(DataContext);
  const {
    data: {
      setValidCEP,
      expandSection,
      setSectionState,
      hasAutoFilled,
      setHasAutoFilled,
      alertCEPText,
      setAlertCEPText,
    },
    functions: { toggleSection },
    handlers: {
      handleReset,
      handleInputBlur,
      handleInputFocus,
      handleInputChange,
    },
    refs: {
      streetRef,
      numberRef,
      complementRef,
      neighborhoodRef,
      cityRef,
      stateRef,
      postal_codeRef,
      sectionRef,
    },
  } = useContext(AddressContext);

  const height = useMemo(
    () =>
      sectionRef?.current && expandSection
        ? sectionRef.current.getBoundingClientRect().height
        : 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expandSection, updateHeight],
  );

  useMemo(() => {
    const cepIsSet = formData?.postal_code?.length > 5;
    const streetIsSet = formData?.street?.length > 3;
    const numberIsSet = formData?.number?.length > 0;
    const neighborhoodIsSet = formData?.neighborhood?.length > 3;
    const cityIsSet = formData?.city?.length > 3;
    const stateIsSet = formData?.state?.length > 0;
    const isComplete =
      cepIsSet &&
      streetIsSet &&
      numberIsSet &&
      neighborhoodIsSet &&
      cityIsSet &&
      stateIsSet;

    if (isComplete && !isSectionComplete.address) {
      setIsSectionComplete({
        ...isSectionComplete,
        address: true,
      });
    } else if (!isComplete && isSectionComplete.address)
      setIsSectionComplete({
        ...isSectionComplete,
        address: false,
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, hasAutoFilled]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        postal_codeRef?.current &&
        postal_codeRef?.current?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.postal_code
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, postal_code: true });
      }

      if (
        streetRef?.current &&
        streetRef?.current?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.street
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, street: true });
      }

      if (
        numberRef?.current &&
        numberRef?.current?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.number
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, number: true });
      }

      if (
        complementRef?.current &&
        complementRef?.current?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.complement
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, complement: true });
      }

      if (
        neighborhoodRef?.current &&
        neighborhoodRef?.current?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.neighborhood
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, neighborhood: true });
      }

      if (
        cityRef?.current &&
        cityRef?.current?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.city
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, city: true });
      }

      if (
        stateRef?.current &&
        stateRef?.current?.matches(':-internal-autofill-selected') &&
        !hasAutoFilled.state
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, state: true });
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 500);

    if (
      hasAutoFilled.city &&
      hasAutoFilled.state &&
      hasAutoFilled.postal_code &&
      hasAutoFilled.street &&
      hasAutoFilled.number &&
      hasAutoFilled.complement &&
      hasAutoFilled.neighborhood
    ) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAutoFilled]);

  useMemo(() => {
    const onlyNumbersRegex = /^[\d\-\s]*$/;
    const regexCEP = /^\d{5}-\d{3}$/;

    if (formData?.postal_code.length === 9) {
      setAlertCEPText('CEP inválido');
      setValidCEP(regexCEP.test(formData?.postal_code));
    } else {
      if (alertCEPText !== 'Insira apenas números')
        setAlertCEPText('Insira apenas números');
      setValidCEP(onlyNumbersRegex.test(formData?.postal_code));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.postal_code]);

  const addressDataComponent = buildAddressDataComponent();

  return (
    <section className='section-container'>
      <div className='section-header'>
        <h2 className='section-header__subtitle' onClick={toggleSection}>
          Dados Locais
        </h2>
        {expandSection ? (
          <MdCalendarViewDay
            onClick={toggleSection}
            className={`section-header__icon${expandSection ? '--active' : ''}`}
          />
        ) : (
          <>
            <MdViewHeadline
              onClick={toggleSection}
              className={`section-header__icon${
                isSectionComplete.address ? '--complete' : ''
              }`}
            />
            {isSectionComplete.address ? (
              <IoMdCheckmarkCircleOutline className='section-header__complete-checkmark' />
            ) : null}
          </>
        )}
      </div>
      <div className='register-data-section' style={{ height }}>
        {addressDataComponent}
      </div>
    </section>
  );

  function buildAddressDataComponent() {
    return (
      <div ref={sectionRef} className='form-group'>
        <PostalCode />
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.street && formData?.street?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={() => handleReset('street')}
          />
          <input
            type='text'
            name='street'
            maxLength={40}
            value={formData?.street}
            ref={streetRef}
            className={`input-field ${
              hasAutoFilled.street && formData?.street.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasAutoFilled.street && formData?.street.length > 0}
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Logradouro</label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.number && formData?.number?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={() => handleReset('number')}
          />
          <input
            type='text'
            name='number'
            maxLength={10}
            inputMode='numeric'
            value={formData?.number}
            ref={numberRef}
            className={`input-field input-spacedout-field ${
              hasAutoFilled.number && formData?.number.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasAutoFilled.number && formData?.number.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Número</label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.neighborhood && formData?.neighborhood?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={() => handleReset('neighborhood')}
          />
          <input
            type='text'
            name='neighborhood'
            maxLength={40}
            value={formData?.neighborhood}
            ref={neighborhoodRef}
            className={`input-field input-spacedout-field ${
              hasAutoFilled.neighborhood && formData?.neighborhood.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={
              hasAutoFilled.neighborhood && formData?.neighborhood.length > 0
            }
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Bairro</label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.city && formData?.city?.length > 0 ? '' : 'hidden'
            }`}
            onClick={() => handleReset('city')}
          />
          <input
            type='text'
            name='city'
            maxLength={10}
            value={formData?.city}
            ref={cityRef}
            className={`input-field input-spacedout-field ${
              hasAutoFilled.city && formData?.city.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasAutoFilled.city && formData?.city.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Cidade</label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.state && formData?.state?.length > 0 ? '' : 'hidden'
            }`}
            onClick={() => handleReset('state')}
          />
          <input
            type='text'
            name='state'
            maxLength={10}
            value={formData?.state}
            ref={stateRef}
            className={`input-field input-spacedout-field ${
              hasAutoFilled.state && formData?.state.length > 0
                ? 'input-field--active'
                : ''
            }`}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasAutoFilled.state && formData?.state.length > 0}
            required
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Estado</label>
        </section>
        <section className='input-section'>
          <MdFormatClear
            className={`input-section__reset-icon ${
              hasAutoFilled.complement && formData?.complement?.length > 0
                ? ''
                : 'hidden'
            }`}
            onClick={() => handleReset('complement')}
          />
          <input
            type='text'
            name='complement'
            maxLength={25}
            value={formData?.complement}
            className={`input-field input-spacedout-field ${
              hasAutoFilled.complement && formData?.complement.length > 0
                ? 'input-field--active'
                : ''
            }`}
            ref={complementRef}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={
              hasAutoFilled.complement && formData?.complement.length > 0
            }
          />
          <span className='highlight'></span>
          <span className='bar'></span>
          <label className='label-text'>Complemento</label>
        </section>
      </div>
    );
  }
}

export default AddressData;
