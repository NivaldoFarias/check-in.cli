import { validate } from "gerador-validador-cpf";
import { regex } from "./constants.util";

export function getRandomInt(max: number, min: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function checkCpf(value: string) {
  const isEmpty = value.length === 0;
  const hasFilledInput = value.length === 14;
  const containsOnlyNumbers = regex.CPF.test(value);

  if (isEmpty) return true;
  else if (!hasFilledInput) return containsOnlyNumbers;
  else return validate(value);
}
