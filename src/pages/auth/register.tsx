import { useContext, useEffect, useState } from 'react';
import { validate } from 'gerador-validador-cpf';
import Image from 'next/image';
import Link from 'next/link';

import backgroundImage from '../../../public/background-alt.svg';

import DataContext from '../../contexts/DataContext';
import CommonData from '../../components/CommonData';
import LoadingDots from '../../components/Loading';
import RegistryData from '../../components/RegistryData';

function Register() {
  const [validCpf, setValidCpf] = useState<boolean>(true);

  const { commonData, hasSubmitted } = useContext(DataContext);

  const RegisterPage = buildRegisterPage();

  useEffect(() => {
    if (commonData?.cpf.length === 14) {
      setValidCpf(validate(commonData?.cpf));
    }
  }, [commonData.cpf]);

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
      <main className='auth-page__container'>
        <h1 className='title-card'>Cadastro</h1>
        <CommonData validCpf={validCpf} />
        <RegistryData />
        <div className='footer-section'>
          <button className={validateForm()} type='submit'>
            {hasSubmitted ? <LoadingDots /> : 'Cadastrar'}
          </button>
          <Link className='navigate-link' href='/auth/check-in'>
            Já possuo cadastro
          </Link>
        </div>
      </main>
    );
  }

  function validateForm() {
    return commonData?.full_name.length > 0 &&
      commonData?.social_name.length > 0 &&
      commonData?.insurance.length > 0 &&
      commonData?.birthdate.length > 0 &&
      validCpf &&
      !hasSubmitted
      ? 'submit-btn'
      : 'submit-btn disabled';
  }
}

export default Register;
