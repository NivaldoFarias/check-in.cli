const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  BCRYPT_SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'secret',
  NEXTAUTH_EXPIRES_IN: Number(process.env.NEXTAUTH_EXPIRES_IN) || 86400,
};

const regex = {
  EMAIL:
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  USERNAME: /^(?=.{3,24}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
  CPF: /^[\d\.\-\s]*$/,
  PHONE_INPUT: /^[\d()\-\+\s]*$/,
  PHONE_COMPLETE:
    /(((\(\d{2}\)\s9)[1-9]\d{3}-\d{4})|(\d{2}9[1-9]\d{7})|(\+?\d{4}9[1-9]\d{7}))(?!\D)/,
};

const time = {
  CURRENT_MONTH: (Number(new Date().getMonth().toString()) + 1).toString(),
  CURRENT_YEAR: new Date().getFullYear().toString(),
  CURRRENT_DATE: new Date(Date.now()).toISOString().split('T')[0],
  MIN_DATE: '1900-01-01',
};

const database = {
  INT4_MAX: 2147483647,
};

export { env, regex, time, database };
