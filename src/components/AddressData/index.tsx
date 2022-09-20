import { useContext, useMemo, useEffect } from "react";

import { MdCalendarViewDay, MdViewHeadline } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import AddressContext from "../../contexts/AddressContext";
import DataContext from "../../contexts/DataContext";

import Neighborhood from "./Neighborhood";
import Complement from "./Complement";
import PostalCode from "./PostalCode";
import Street from "./Street";
import Number from "./Number";
import State from "./State";
import City from "./City";

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
    [expandSection, updateHeight]
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
        postal_codeRef?.current?.matches(":-internal-autofill-selected") &&
        !hasAutoFilled.postal_code
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, postal_code: true });
      }

      if (
        streetRef?.current &&
        streetRef?.current?.matches(":-internal-autofill-selected") &&
        !hasAutoFilled.street
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, street: true });
      }

      if (
        numberRef?.current &&
        numberRef?.current?.matches(":-internal-autofill-selected") &&
        !hasAutoFilled.number
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, number: true });
      }

      if (
        complementRef?.current &&
        complementRef?.current?.matches(":-internal-autofill-selected") &&
        !hasAutoFilled.complement
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, complement: true });
      }

      if (
        neighborhoodRef?.current &&
        neighborhoodRef?.current?.matches(":-internal-autofill-selected") &&
        !hasAutoFilled.neighborhood
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, neighborhood: true });
      }

      if (
        cityRef?.current &&
        cityRef?.current?.matches(":-internal-autofill-selected") &&
        !hasAutoFilled.city
      ) {
        setSectionState(true);
        setHasAutoFilled({ ...hasAutoFilled, city: true });
      }

      if (
        stateRef?.current &&
        stateRef?.current?.matches(":-internal-autofill-selected") &&
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
      setAlertCEPText("CEP inválido");
      setValidCEP(regexCEP.test(formData?.postal_code));
    } else {
      if (alertCEPText !== "Insira apenas números")
        setAlertCEPText("Insira apenas números");
      setValidCEP(onlyNumbersRegex.test(formData?.postal_code));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.postal_code]);

  const addressDataComponent = buildAddressDataComponent();

  return (
    <section className="section-container">
      <div className="section-header">
        <h2 className="section-header__subtitle" onClick={toggleSection}>
          Dados Locais
        </h2>
        {expandSection ? (
          <MdCalendarViewDay
            onClick={toggleSection}
            className={`section-header__icon${expandSection ? "--active" : ""}`}
          />
        ) : (
          <>
            <MdViewHeadline
              onClick={toggleSection}
              className={`section-header__icon${
                isSectionComplete.address ? "--complete" : ""
              }`}
            />
            {isSectionComplete.address ? (
              <IoMdCheckmarkCircleOutline className="section-header__complete-checkmark" />
            ) : null}
          </>
        )}
      </div>
      <div className="register-data-section" style={{ height }}>
        {addressDataComponent}
      </div>
    </section>
  );

  function buildAddressDataComponent() {
    return (
      <div ref={sectionRef} className="form-group">
        <PostalCode />
        <Street />
        <Number />
        <Neighborhood />
        <City />
        <State />
        <Complement />
      </div>
    );
  }
}

export default AddressData;
