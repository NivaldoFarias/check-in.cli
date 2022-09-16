import { Commons } from '../../../../types/index';
import { regex } from '../../../../utils/constants.util';

export default function alertTextClassName({
  commonData,
}: {
  commonData: Commons;
}) {
  const containsOnlyNumbers = regex.PHONE_INPUT.test(
    commonData?.insurance_code,
  );
  const transparent = containsOnlyNumbers ? 'color-transparent' : '';

  return `alert-text cpf-alert ${transparent}`;
}
