import { Prisma } from '@prisma/client';

type RegisterRequest = {
  common: Prisma.PatientCreateInput;
  registry: Prisma.RegistryUncheckedCreateWithoutPatientInput;
  address: Prisma.AddressUncheckedCreateWithoutPatientInput;
};

export { RegisterRequest };
