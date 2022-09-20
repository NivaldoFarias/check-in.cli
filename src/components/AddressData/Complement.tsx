import { MdFormatClear } from "react-icons/md";
import { useContext } from "react";

import AddressContext from "../../contexts/AddressContext";
import DataContext from "../../contexts/DataContext";

export default function Complement() {
  const { addressData: formData } = useContext(DataContext);

  const {
    data: { hasAutoFilled },
    handlers: {
      handleInputChange,
      handleInputBlur,
      handleInputFocus,
      handleReset,
    },
    refs: { complementRef },
  } = useContext(AddressContext);

  return (
    <section className="input-section">
      <MdFormatClear
        className={`input-section__reset-icon ${
          hasAutoFilled.complement && formData?.complement?.length > 0
            ? ""
            : "hidden"
        }`}
        onClick={() => handleReset("complement")}
      />
      <input
        type="text"
        name="complement"
        maxLength={25}
        value={formData?.complement}
        className={`input-field input-spacedout-field ${
          hasAutoFilled.complement && formData?.complement.length > 0
            ? "input-field--active"
            : ""
        }`}
        ref={complementRef}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={hasAutoFilled.complement && formData?.complement.length > 0}
      />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className="label-text">Complemento</label>
    </section>
  );
}
