import { MdFormatClear } from "react-icons/md";
import { useContext } from "react";

import AddressContext from "../../contexts/AddressContext";
import DataContext from "../../contexts/DataContext";

export default function Number() {
  const { addressData: formData } = useContext(DataContext);

  const {
    data: { hasAutoFilled },
    handlers: {
      handleInputChange,
      handleInputBlur,
      handleInputFocus,
      handleReset,
    },
    refs: { numberRef },
  } = useContext(AddressContext);

  return (
    <section className="input-section">
      <MdFormatClear
        className={`input-section__reset-icon ${
          hasAutoFilled.number && formData?.number?.length > 0 ? "" : "hidden"
        }`}
        onClick={() => handleReset("number")}
      />
      <input
        type="text"
        name="number"
        maxLength={10}
        inputMode="numeric"
        value={formData?.number}
        ref={numberRef}
        className={`input-field input-spacedout-field ${
          hasAutoFilled.number && formData?.number.length > 0
            ? "input-field--active"
            : ""
        }`}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={hasAutoFilled.number && formData?.number.length > 0}
        required
      />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className="label-text">Número</label>
    </section>
  );
}
