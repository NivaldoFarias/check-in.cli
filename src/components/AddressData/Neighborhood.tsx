import { MdFormatClear } from "react-icons/md";
import { useContext } from "react";

import AddressContext from "../../contexts/AddressContext";
import DataContext from "../../contexts/DataContext";

export default function Neighborhood() {
  const { addressData: formData } = useContext(DataContext);

  const {
    data: { hasAutoFilled },
    handlers: {
      handleInputChange,
      handleInputBlur,
      handleInputFocus,
      handleReset,
    },
    refs: { neighborhoodRef },
  } = useContext(AddressContext);

  return (
    <section className="input-section">
      <MdFormatClear
        className={`input-section__reset-icon ${
          hasAutoFilled.neighborhood && formData?.neighborhood?.length > 0
            ? ""
            : "hidden"
        }`}
        onClick={() => handleReset("neighborhood")}
      />
      <input
        type="text"
        name="neighborhood"
        maxLength={40}
        value={formData?.neighborhood}
        ref={neighborhoodRef}
        className={`input-field input-spacedout-field ${
          hasAutoFilled.neighborhood && formData?.neighborhood.length > 0
            ? "input-field--active"
            : ""
        }`}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={
          hasAutoFilled.neighborhood && formData?.neighborhood.length > 0
        }
        required
      />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className="label-text">Bairro</label>
    </section>
  );
}
