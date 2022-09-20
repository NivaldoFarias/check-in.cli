import { MdFormatClear } from "react-icons/md";
import { useContext } from "react";

import AddressContext from "../../contexts/AddressContext";
import DataContext from "../../contexts/DataContext";

export default function Street() {
  const { addressData: formData } = useContext(DataContext);

  const {
    data: { hasAutoFilled },
    handlers: {
      handleInputChange,
      handleInputBlur,
      handleInputFocus,
      handleReset,
    },
    refs: { streetRef },
  } = useContext(AddressContext);

  return (
    <section className="input-section">
      <MdFormatClear
        className={`input-section__reset-icon ${
          hasAutoFilled.street && formData?.street?.length > 0 ? "" : "hidden"
        }`}
        onClick={() => handleReset("street")}
      />
      <input
        type="text"
        name="street"
        maxLength={40}
        value={formData?.street}
        ref={streetRef}
        className={`input-field ${
          hasAutoFilled.street && formData?.street.length > 0
            ? "input-field--active"
            : ""
        }`}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={hasAutoFilled.street && formData?.street.length > 0}
      />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className="label-text">Logradouro</label>
    </section>
  );
}
