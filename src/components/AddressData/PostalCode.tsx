import { FaMapMarkerAlt } from "react-icons/fa";
import { MdLayersClear } from "react-icons/md";
import { useContext, useMemo } from "react";

import AddressContext from "../../contexts/AddressContext";
import DataContext from "../../contexts/DataContext";

export default function PostalCode() {
  const { addressData: formData } = useContext(DataContext);

  const {
    data: {
      hasFired,
      hasAutoFilled,
      alertCEPText,
      setAlertCEPText,
      setValidCEP,
    },
    functions: { alertCEPTextClassName },
    handlers: {
      handleKeyDown,
      handleInputBlur,
      handleInputFocus,
      handleClick,
      handleCEPInput,
      handleHardReset,
    },
    refs: { postal_codeRef },
  } = useContext(AddressContext);

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

  return (
    <section className="input-section postal-code-input">
      <FaMapMarkerAlt
        className={`postal-code-input__submit-icon ${
          hasFired && formData?.postal_code?.length > 0
            ? "postal-code-input__submit-icon--active"
            : ""
        }`}
        onClick={handleClick}
      />
      <MdLayersClear
        className={`input-section__reset-icon position-left ${
          hasAutoFilled.postal_code && formData?.postal_code?.length > 0
            ? ""
            : "hidden"
        }`}
        onClick={handleHardReset}
      />
      <input
        type="text"
        minLength={5}
        maxLength={9}
        name="postal_code"
        pattern="^[\d\-\s]*$"
        value={formData?.postal_code}
        className={`input-field input-spacedout-field ${
          hasAutoFilled.postal_code && formData?.postal_code.length > 0
            ? "input-field--active"
            : ""
        }`}
        ref={postal_codeRef}
        onChange={handleCEPInput}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        required
        disabled={hasAutoFilled.postal_code && formData?.postal_code.length > 0}
      />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className="label-text input-spacedout-field">CEP</label>
      <p className={alertCEPTextClassName()}>{alertCEPText}</p>
    </section>
  );
}
