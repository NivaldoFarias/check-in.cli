import type { Prisma } from '@prisma/client';

type RegisterRequest = {
  common: Prisma.PatientCreateInput;
  registry: Prisma.RegistryUncheckedCreateWithoutPatientInput;
  address: Prisma.AddressUncheckedCreateWithoutPatientInput;
};

type LoginRequest = {
  cpf: string | undefined;
  password: string | undefined;
};

export { RegisterRequest, LoginRequest };
