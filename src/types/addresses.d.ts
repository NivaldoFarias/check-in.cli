import type {
    ChangeEvent,
    Dispatch,
    FocusEvent,
    KeyboardEvent,
    MutableRefObject,
    RefObject,
    SetStateAction,
} from "react";

export type AddressKeys =
    | "street"
    | "number"
    | "complement"
    | "neighborhood"
    | "city"
    | "state"
    | "postal_code";
export type RefKeys =
    | "streetRef"
    | "numberRef"
    | "complementRef"
    | "neighborhoodRef"
    | "cityRef"
    | "stateRef"
    | "postal_codeRef";

export type AddressContextData = {
    validCEP: boolean;
    hasFired: boolean;
    expandSection: boolean;
    alertCEPText: string;
    hasAutoFilled: HasAutoFilled;
    setValidCEP: Dispatch<SetStateAction<boolean>>;
    setHasFired: Dispatch<SetStateAction<boolean>>;
    setSectionState: Dispatch<SetStateAction<boolean>>;
    setAlertCEPText: Dispatch<SetStateAction<string>>;
    setHasAutoFilled: Dispatch<SetStateAction<HasAutoFilled>>;
};
export type AddressContextFunctions = {
    toggleSection: () => void;
    getAddressData: (value?: string) => Promise<void | null> | void;
    alertCEPTextClassName: () => string;
};
export type AddressContextHandlers = {
    handleHardReset(): void;
    handleError(error: any): void;
    handleReset(name: AddressKeys): void;
    handleClick(_e: MouseEvent<HTMLOrSVGElement>): void;
    handleCEPInput(e: ChangeEvent<HTMLInputElement>): void;
    handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void;
    handleInputChange(e: ChangeEvent<HTMLInputElement>): void;
    handleInputBlur(e: FocusEvent<HTMLInputElement>): void | null;
    handleInputFocus(e: FocusEvent<HTMLInputElement>): void | undefined;
};
export type AddressContextRefs = {
    [x in RefKeys]: InputRef;
} & {
    sectionRef: RefObject<HTMLDivElement> | null;
};

export type AddressContextType = {
    data: AddressContextData;
    functions: AddressContextFunctions;
    handlers: AddressContextHandlers;
    refs: AddressContextRefs;
};

export type AddressTypes = HTMLInputElement | boolean | string | null;
export type AddressGeneric = Record<AddressKeys, AddressTypes>;

export type InputRef = RefObject<HTMLInputElement> | null;
export type HasAutoFilled = Record<AddressKeys, boolean>;
