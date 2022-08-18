import { FormEvent, useContext, useEffect, useState } from 'react';
import { validate } from 'gerador-validador-cpf';
import Image from 'next/image';
import Link from 'next/link';

import backgroundImage from '../../../public/background-alt.svg';

import DataContext from '../../contexts/DataContext';
import CommonData from '../../components/CommonData';
import LoadingDots from '../../components/Loading';
import RegistryData from '../../components/RegistryData';
import AddressData from '../../components/AddressData/index';
import { getRandomInt } from '../../utils/functions.util';

function Register() {
  const [validCpf, setValidCpf] = useState<boolean>(true);

  const { isSectionComplete, registryData, hasSubmitted, setHasSubmitted } =
    useContext(DataContext);

  const RegisterPage = buildRegisterPage();

  useEffect(() => {
    if (registryData?.cpf.length === 14) {
      setValidCpf(validate(registryData?.cpf));
    } else setValidCpf(true);
  }, [registryData.cpf]);

  return (
    <div id='register-page' className='auth-page'>
      <Image
        className='background-image'
        objectFit='cover'
        src={backgroundImage}
        alt='background image'
        priority={true}
        quality={100}
      />
      {RegisterPage}
    </div>
  );

  function buildRegisterPage() {
    return (
      <form className='auth-page__container' onSubmit={handleSubmit}>
        <h1 className='title-card'>Cadastro</h1>
        <CommonData />
        <RegistryData validCpf={validCpf} />
        <AddressData />
        <div className='footer-section'>
          <button className={validateForm()} type='submit'>
            {hasSubmitted ? <LoadingDots /> : 'Cadastrar'}
          </button>
          <Link className='navigate-link' href='/auth/check-in'>
            Já possuo cadastro
          </Link>
        </div>
      </form>
    );
  }

  function validateForm() {
    return isSectionComplete.address &&
      isSectionComplete.common &&
      isSectionComplete.registry
      ? 'submit-btn'
      : 'submit-btn disabled';
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setHasSubmitted(true);
    setTimeout(() => null, getRandomInt(750, 2000));
  }
}

export default Register;
