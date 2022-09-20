import { MdFormatClear } from "react-icons/md";
import { useContext } from "react";

import AddressContext from "../../contexts/AddressContext";
import DataContext from "../../contexts/DataContext";

export default function City() {
  const { addressData: formData } = useContext(DataContext);

  const {
    data: { hasAutoFilled },
    handlers: {
      handleInputChange,
      handleInputBlur,
      handleInputFocus,
      handleReset,
    },
    refs: { cityRef },
  } = useContext(AddressContext);

  return (
    <section className="input-section">
      <MdFormatClear
        className={`input-section__reset-icon ${
          hasAutoFilled.city && formData?.city?.length > 0 ? "" : "hidden"
        }`}
        onClick={() => handleReset("city")}
      />
      <input
        type="text"
        name="city"
        maxLength={10}
        value={formData?.city}
        ref={cityRef}
        className={`input-field input-spacedout-field ${
          hasAutoFilled.city && formData?.city.length > 0
            ? "input-field--active"
            : ""
        }`}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={hasAutoFilled.city && formData?.city.length > 0}
        required
      />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className="label-text">Cidade</label>
    </section>
  );
}
