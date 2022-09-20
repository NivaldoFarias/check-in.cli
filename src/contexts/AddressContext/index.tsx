import {
  ChangeEvent,
  createContext,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import { confirmAlert } from "react-confirm-alert";
import axios from "axios";

import type {
  AddressContextType,
  AddressKeys,
  HasAutoFilled,
  RefKeys,
} from "../../types/addresses";
import initialValue, { data, refs } from "./value";
import STATES_MAP from "../../data/states";
import DataContext from "../DataContext";

const AddressContext = createContext<AddressContextType>(initialValue);

export function AddressDataProvider(props: PropsWithChildren) {
  const { children } = props;
  const onlyNumbersRegex = /^[\d\-\s]*$/;

  const { addressData: formData, setAddressData: setFormData } =
    useContext(DataContext);

  const [validCEP, setValidCEP] = useState<boolean>(data.validCEP);
  const [expandSection, setSectionState] = useState<boolean>(
    data.expandSection
  );
  const [hasFired, setHasFired] = useState<boolean>(data.hasFired);
  const [forceAlert, setForceAlert] = useState<boolean>(false);
  const [hasAutoFilled, setHasAutoFilled] = useState<HasAutoFilled>(
    data.hasAutoFilled
  );
  const [alertCEPText, setAlertCEPText] = useState<string>(data.alertCEPText);

  const streetRef = useRef<HTMLInputElement | null>(refs.streetRef);
  const numberRef = useRef<HTMLInputElement | null>(refs.numberRef);
  const complementRef = useRef<HTMLInputElement | null>(refs.complementRef);
  const neighborhoodRef = useRef<HTMLInputElement | null>(refs.neighborhoodRef);
  const cityRef = useRef<HTMLInputElement | null>(refs.cityRef);
  const stateRef = useRef<HTMLInputElement | null>(refs.stateRef);
  const postal_codeRef = useRef<HTMLInputElement | null>(refs.postal_codeRef);
  const sectionRef = useRef<HTMLDivElement | null>(refs.sectionRef);

  return (
    <AddressContext.Provider
      value={{
        data: {
          validCEP,
          setValidCEP,
          expandSection,
          setSectionState,
          hasFired,
          setHasFired,
          hasAutoFilled,
          setHasAutoFilled,
          alertCEPText,
          setAlertCEPText,
        },
        functions: {
          toggleSection,
          getAddressData,
          alertCEPTextClassName,
        },
        handlers: {
          handleClick,
          handleError,
          handleReset,
          handleKeyDown,
          handleCEPInput,
          handleHardReset,
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
      }}
    >
      {children}
    </AddressContext.Provider>
  );

  function toggleSection() {
    setSectionState(!expandSection);
  }

  async function getAddressData(value?: string) {
    if (hasFired || !validCEP) return null;

    const replaceRegex = /(-|\s)/gi;
    const input = formData?.postal_code.replaceAll(replaceRegex, "");
    const optInput = value?.replaceAll(replaceRegex, "");

    if (input.length !== 8 && optInput?.length !== 8) return null;

    const cep = optInput?.length === 8 ? optInput : input;
    const API_URL = `https://viacep.com.br/ws/${cep}/json/`;
    try {
      setHasFired(true);
      let {
        data: {
          logradouro: street,
          bairro: neighborhood,
          localidade: city,
          uf: state,
        },
      } = await axios.get(API_URL);

      if (street.includes("Avenida")) street = street.replace("Avenida", "Av.");
      state = STATES_MAP[state] ?? state;
      const postal_code = `${cep.substring(0, 5)}-${cep.substring(5)}`;

      setFormData({
        ...formData,
        postal_code,
        street,
        neighborhood,
        city,
        state,
      });
      setHasAutoFilled({
        ...hasAutoFilled,
        neighborhood: true,
        postal_code: true,
        street: true,
        city: true,
        state: true,
      });
    } catch (error) {
      setHasFired(false);
      setValidCEP(false);
      return handleError(error);
    }
  }

  function handleReset(name: AddressKeys) {
    setFormData({
      ...formData,
      [name]: "",
    });
    setHasAutoFilled({ ...hasAutoFilled, [name]: false });
  }

  function handleError(error: any) {
    confirmAlert({
      message: `${
        error.response?.data?.message ?? "Ops! Parece que algo deu errado"
      }. Por favor, tente novamente.`,
      buttons: [
        {
          label: "OK",
          onClick: () => null,
        },
      ],
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      getAddressData();
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name as AddressKeys]: e.target.value,
    });
  }

  function handleInputFocus(e: FocusEvent<HTMLInputElement>) {
    const ref = (e.target.name + "Ref") as RefKeys;
    // @ts-ignore
    return ref.current?.classList.add("input-field--active");
  }

  function handleInputBlur(e: FocusEvent<HTMLInputElement>) {
    if (
      e.target.name === "postal_code" &&
      formData?.postal_code.length === 9 &&
      validCEP
    ) {
      getAddressData();
    }

    if (e.target.value.length !== 0) return null;

    const ref = (e.target.name + "Ref") as RefKeys;
    // @ts-ignore
    return ref.current?.classList.remove("input-field--active");
  }

  function handleClick(_e: MouseEvent<HTMLOrSVGElement>) {
    if (formData?.postal_code.length !== 9) {
      setAlertCEPText("Campo obrigatório");
      setForceAlert(true);
    } else getAddressData();
  }

  function alertCEPTextClassName() {
    const containsOnlyNumbers = onlyNumbersRegex.test(formData?.postal_code);
    const transparent = containsOnlyNumbers
      ? formData?.postal_code.length === 9
        ? validCEP
          ? "color-transparent"
          : ""
        : forceAlert
        ? ""
        : "color-transparent"
      : "";

    return `alert-text cpf-alert ${transparent}`;
  }

  function handleHardReset() {
    setFormData({
      postal_code: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      complement: "",
    });
    setHasFired(false);
    setHasAutoFilled({
      postal_code: false,
      street: false,
      number: false,
      complement: false,
      neighborhood: false,
      city: false,
      state: false,
    });
  }

  function handleCEPInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    if (forceAlert && alertCEPText === "Campo obrigatório") {
      setAlertCEPText("Insira um CEP válido");
      if (onlyNumbersRegex.test(formData?.postal_code)) setForceAlert(false);
    }

    if (value.length === 6) {
      setFormData({
        ...formData,
        postal_code:
          value.slice(0, -1) +
          "-" +
          (value.slice(-1) === "-" ? "" : value.slice(-1)),
      });
    } else setFormData({ ...formData, postal_code: value });

    if (
      value.length === 9 ||
      (value.length === 8 && onlyNumbersRegex.test(value))
    )
      getAddressData(value);
  }
}

export default AddressContext;
