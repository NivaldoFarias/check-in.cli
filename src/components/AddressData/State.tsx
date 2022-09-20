import { MdFormatClear } from "react-icons/md";
import { useContext } from "react";

import AddressContext from "../../contexts/AddressContext";
import DataContext from "../../contexts/DataContext";

export default function State() {
  const { addressData: formData } = useContext(DataContext);

  const {
    data: { hasAutoFilled },
    handlers: {
      handleInputChange,
      handleInputBlur,
      handleInputFocus,
      handleReset,
    },
    refs: { stateRef },
  } = useContext(AddressContext);

  return (
    <section className="input-section">
      <MdFormatClear
        className={`input-section__reset-icon ${
          hasAutoFilled.state && formData?.state?.length > 0 ? "" : "hidden"
        }`}
        onClick={() => handleReset("state")}
      />
      <input
        type="text"
        name="state"
        maxLength={10}
        value={formData?.state}
        ref={stateRef}
        className={`input-field input-spacedout-field ${
          hasAutoFilled.state && formData?.state.length > 0
            ? "input-field--active"
            : ""
        }`}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={hasAutoFilled.state && formData?.state.length > 0}
        required
      />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className="label-text">Estado</label>
    </section>
  );
}
