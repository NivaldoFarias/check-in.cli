import { Prisma } from '@prisma/client';

type RegisterRequest = {
  common: Prisma.PatientCreateInput;
  registry: Prisma.RegistryCreateNestedManyWithoutPatientInput;
  address: Prisma.AddressCreateNestedManyWithoutPatientInput;
};

export { RegisterRequest };
