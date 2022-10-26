import {
  ChangeEvent,
  FocusEvent,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { isMobile } from "react-device-detect";

import {
  MdViewHeadline,
  MdCalendarViewDay,
  MdFormatClear,
} from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { AiFillIdcard } from "react-icons/ai";
import { FaMobile } from "react-icons/fa";
import { validate } from "gerador-validador-cpf";

import DataContext from "../../contexts/DataContext";
import SelectAssignedAtBirth from "./SelectAssignedAtBirth";
import SelectGenderIdentity from "./SelectGenderIdentity";
import { regex } from "../../utils/constants.util";

type InputRef = {
  [x: string]: HTMLInputElement | null;
};

// TODO refactor: component has too many responsibilities

function RegistryData() {
  const [validCpf, setValidCpf] = useState<boolean>(true);
  const [expandSection, setSectionState] = useState<boolean>(false);
  const [height, setHeight] = useState<number | string>(0);
  const [hasCpfAutoFilled, setHasCpfAutoFilled] = useState<boolean>(false);
  const [hasPhoneNumberAutoFilled, setHasPhoneNumberAutoFilled] =
    useState<boolean>(false);

  const {
    isSectionComplete,
    setIsSectionComplete,
    commonData,
    setCommonData,
    registryData: formData,
    setRegistryData: setFormData,
    selectGender,
    updateHeight,
    selectAssigned,
  } = useContext(DataContext);

  const inputRef = useRef<InputRef>({
    gender: null,
    assigned_at_birth: null,
    cpf: null,
    phone_number: null,
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commonData?.cpf.length === 14) {
      setValidCpf(validate(commonData?.cpf));
    } else setValidCpf(true);
  }, [commonData?.cpf]);

  useEffect(() => {
    const cpfIsSet = validCpf;
    const phoneNumberIsSet = formData?.phone_number?.length > 6;
    const assignedIsSet =
      (formData?.assigned_at_birth.length > 0 &&
        formData?.assigned_at_birth !== "SELF_DESCRIBED") ||
      (formData?.assigned_at_birth === "SELF_DESCRIBED" &&
        formData?.described_assigned &&
        formData?.described_assigned.length > 0);
    const genderIsSet =
      (formData?.gender.length > 0 && formData?.gender !== "SELF_DESCRIBED") ||
      (formData?.gender === "SELF_DESCRIBED" &&
        formData?.described_identity &&
        formData?.described_identity.length > 0);

    const isComplete =
      cpfIsSet && phoneNumberIsSet && assignedIsSet && genderIsSet;

    if (isComplete && !isSectionComplete.registry) {
      setIsSectionComplete({
        ...isSectionComplete,
        registry: true,
      });
    } else if (!isComplete && isSectionComplete.registry)
      setIsSectionComplete({
        ...isSectionComplete,
        registry: false,
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, hasCpfAutoFilled, hasPhoneNumberAutoFilled]);

  useEffect(() => {
    if (sectionRef.current) {
      if (expandSection) {
        setHeight(sectionRef.current.getBoundingClientRect().height);
      } else setHeight(0);
    }
  }, [expandSection, selectGender, selectAssigned, updateHeight, validCpf]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        inputRef.current.cpf &&
        (inputRef.current?.cpf?.matches(":-internal-autofill-selected") ||
          inputRef.current?.cpf?.matches("clipboard-event--paste")) &&
        !hasCpfAutoFilled
      ) {
        setSectionState(true);
        setHasCpfAutoFilled(true);
      }

      if (
        inputRef.current.phone_number &&
        (inputRef.current?.phone_number?.matches(
          ":-internal-autofill-selected"
        ) ||
          inputRef.current?.phone_number?.classList.contains(
            "clipboard-event--paste"
          )) &&
        !hasPhoneNumberAutoFilled
      ) {
        setSectionState(true);
        setHasPhoneNumberAutoFilled(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 500);

    if (hasCpfAutoFilled && hasPhoneNumberAutoFilled) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [hasCpfAutoFilled, hasPhoneNumberAutoFilled]);

  useEffect(() => {
    if (
      !isMobile ||
      (typeof window !== "undefined" && window.innerWidth >= 1440)
    ) {
      setSectionState(true);
    }
  }, []);

  const registryDataComponent = buildRegistryDataComponent();

  return (
    <section className="section-container">
      <div className="section-header">
        <h2 className="section-header__subtitle" onClick={toggleSection}>
          Dados Pessoais
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
                isSectionComplete.registry ? "--complete" : ""
              }`}
            />
            {isSectionComplete.registry ? (
              <IoMdCheckmarkCircleOutline className="section-header__complete-checkmark" />
            ) : null}
          </>
        )}
      </div>
      <div className="register-data-section" style={{ height }}>
        {registryDataComponent}
      </div>
    </section>
  );

  function toggleSection() {
    setSectionState(!expandSection);
  }

  function buildRegistryDataComponent() {
    const alertCpf =
      commonData?.cpf.length === 14 ? `CPF inválido` : `Insira apenas números`;
    const alertPhonenumber =
      formData?.phone_number.length >= 13
        ? `Telefone inválido`
        : `Insira apenas números`;

    return (
      <div ref={sectionRef} className="form-group">
        <section
          className={`input-section  ${
            regex.CPF.test(commonData?.cpf)
              ? validCpf
                ? ""
                : "push-bottom"
              : "push-bottom"
          }`}
        >
          <MdFormatClear
            className={`input-section__reset-icon position-left ${
              hasCpfAutoFilled && commonData?.cpf.length > 0 ? "" : "hidden"
            }`}
            onClick={handleResetCpf}
          />
          <AiFillIdcard
            className={`input-section__cpf-icon ${
              hasCpfAutoFilled && commonData?.cpf?.length > 0
                ? "input-section__cpf-icon--active"
                : ""
            } ${validCpf ? "" : "input-section__cpf-icon--invalid"}`}
          />
          <input
            type="text"
            name="cpf"
            minLength={14}
            maxLength={14}
            inputMode="numeric"
            pattern="^[\d\.\-\s]*$"
            value={commonData?.cpf}
            className={`input-field input-spacedout-field ${
              hasCpfAutoFilled && commonData?.cpf.length > 0
                ? "input-field--active"
                : ""
            }`}
            ref={(element) => (inputRef.current["cpf"] = element)}
            onChange={handleCPFInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={hasCpfAutoFilled && commonData?.cpf.length > 0}
            required
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label className="label-text input-spacedout-field">CPF</label>
          <p className={showAlertCpf()}>{alertCpf}</p>
        </section>
        <section className="input-section">
          <MdFormatClear
            className={`input-section__reset-icon position-left ${
              hasPhoneNumberAutoFilled && formData.phone_number?.length > 0
                ? ""
                : "hidden"
            }`}
            onClick={handleResetPhoneNumber}
          />
          <FaMobile
            className={`input-section__phone-icon ${
              hasPhoneNumberAutoFilled && formData.phone_number?.length > 0
                ? "input-section__phone-icon--active"
                : ""
            }`}
          />
          <input
            type="text"
            inputMode="tel"
            name="phone_number"
            maxLength={15}
            pattern="^[\d\(\)\-\+\s]*$"
            value={formData?.phone_number}
            ref={(element) => (inputRef.current["phone_number"] = element)}
            className={`input-field input-spacedout-field ${
              hasPhoneNumberAutoFilled && formData.phone_number.length > 0
                ? "input-field--active"
                : ""
            }`}
            onChange={handlePhoneInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={
              hasPhoneNumberAutoFilled && formData.phone_number.length > 0
            }
            required
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label className="label-text tidy-label">
            Número de telefone <span className="tidy-field">(DDD)</span>
          </label>
          <p className={showAlertPhonenumber()}>{alertPhonenumber}</p>
        </section>
        <SelectAssignedAtBirth />
        <SelectGenderIdentity />
      </div>
    );

    function handleResetCpf() {
      setCommonData({
        ...commonData,
        cpf: "",
      });
      setHasCpfAutoFilled(false);
    }

    function handleResetPhoneNumber() {
      setFormData({
        ...formData,
        phone_number: "",
      });
      setHasPhoneNumberAutoFilled(false);
    }

    function handleCPFInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;

      const firstDot = value.length === 4 || value.length === 8;
      const secondDot = value.length === 11 && !value.includes(".");
      const hyphenSeparator = value.length === 12;

      if (firstDot) {
        setCommonData({
          ...commonData,
          cpf: __insertDot(value, "first_dot"),
        });
      } else if (secondDot) {
        setHasCpfAutoFilled(true);
        setCommonData({
          ...commonData,
          cpf: __insertDot(value, "second_dot"),
        });
      } else if (hyphenSeparator) {
        setCommonData({
          ...commonData,
          cpf: __insertHypen(),
        });
      } else setCommonData({ ...commonData, cpf: value });

      function __insertDot(
        value: string,
        sequence: "first_dot" | "second_dot"
      ) {
        switch (sequence) {
          case "first_dot": {
            const eraseDotOnBackspace =
              value.slice(-1) === "." ? "" : value.slice(-1);
            const output = value.slice(0, -1) + ".";

            return output + eraseDotOnBackspace;
          }
          case "second_dot": {
            return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(
              6,
              9
            )}-${value.slice(9)}`;
          }
          default: {
            return value;
          }
        }
      }

      function __insertHypen() {
        const eraseHyphenOnBackspace =
          value.slice(-1) === "-" ? "" : value.slice(-1);
        const output = value.slice(0, -1) + "-";

        return output + eraseHyphenOnBackspace;
      }
    }

    function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
      return inputRef.current[e.target.name]?.classList.add(
        "input-field--active"
      );
    }

    function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
      if (e.target.value.length !== 0) return null;

      return inputRef.current[e.target.name]?.classList.remove(
        "input-field--active"
      );
    }

    function handlePhoneInput(e: ChangeEvent<HTMLInputElement>) {
      const { value } = e.target;
      const notFormatted =
        !value.includes("-") && !value.includes("(") && !value.includes(")");

      if (value.length === 11 && notFormatted) {
        return setFormData({
          ...formData,
          phone_number: `(${value.slice(0, 2)}) ${value.slice(
            2,
            7
          )}-${value.slice(7)}`,
        });
      } else if (value.length === 14 && notFormatted) {
        return setFormData({
          ...formData,
          phone_number: `(${value.slice(3, 5)}) ${value.slice(
            5,
            10
          )}-${value.slice(10)}`,
        });
      }

      if (value.length === 1) {
        setFormData({
          ...formData,
          phone_number: "(" + (value === "(" ? "" : value),
        });
      } else if (value.length === 4) {
        setFormData({
          ...formData,
          phone_number:
            value.slice(0, -1) +
            ") " +
            (value.slice(-1) === ")" ? "" : value.slice(-1)),
        });
      } else if (value.length === 11) {
        setFormData({
          ...formData,
          phone_number:
            value.slice(0, -1) +
            "-" +
            (value.slice(-1) === "-" ? "" : value.slice(-1)),
        });
      } else
        setFormData({
          ...formData,
          phone_number:
            value.slice(0, -1) +
            (value.slice(-1) === " " ? "" : value.slice(-1)),
        });
    }

    function showAlertPhonenumber() {
      const validPhonenumber = regex.PHONE_COMPLETE.test(
        formData?.phone_number
      );
      const containsOnlyNumbers = regex.PHONE_INPUT.test(
        formData?.phone_number
      );
      const transparent =
        formData?.phone_number.length >= 13
          ? validPhonenumber
            ? "color-transparent"
            : ""
          : containsOnlyNumbers
          ? "color-transparent"
          : "";

      return `alert-text phonenumber-alert ${transparent}`;
    }

    function showAlertCpf() {
      const containsOnlyNumbers = regex.CPF.test(commonData?.cpf);
      const transparent = containsOnlyNumbers
        ? validCpf
          ? "color-transparent"
          : ""
        : "";

      return `alert-text cpf-alert ${transparent}`;
    }
  }
}

export default RegistryData;
