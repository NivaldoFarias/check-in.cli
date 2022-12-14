import { FormEvent, useContext, useRef, useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import DataContext from "../../contexts/DataContext";
import type { Forms } from "../../types";

import backgroundImage from "../../../public/background-alt.svg";
import CreatePassword from "../../components/CreatePassword";
import AddressData from "../../components/AddressData/index";
import RegistryData from "../../components/RegistryData";
import CommonData from "../../components/CommonData";

function Register() {
  const [password, setPassword] = useState<{
    password: string;
    confirm: string;
  }>({
    password: "",
    confirm: "",
  });
  const {
    mockData,
    isSectionComplete,
    setHasSubmitted,
    commonData,
    registryData,
    addressData,
  } = useContext(DataContext);
  const pageRef = useRef<HTMLDivElement>(null);
  const [toggleActiveSection, setActiveSection] = useState<boolean>(
    mockData ? true : false
  );

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      if (
        pageRef.current &&
        !pageRef.current.classList.contains("has-loaded")
      ) {
        pageRef.current.classList.add("has-loaded");
      }
    }, 100);
  }, []);

  const registerPage = buildRegisterPage();

  return (
    <div
      ref={pageRef}
      id="register-page"
      className="auth-page"
      onLoadCapture={handleLoadCapture}
    >
      <Image
        className="background-image"
        objectFit="cover"
        src={backgroundImage}
        alt="background image"
        priority={true}
        quality={100}
        layout="fill"
      />
      {registerPage}
    </div>
  );

  function handleLoadCapture() {
    return pageRef.current?.classList.add("has-loaded");
  }

  async function registerPatient(data: Forms) {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) return handleError(response);
      return handleSucess(response);
    } catch (error) {
      return handleError(error);
    }
  }

  function handleSucess(_response: Response) {
    confirmAlert({
      message: `Tudo pronto!`,
      buttons: [
        {
          label: "Fazer check-in",
          onClick: () => router.push("/auth/check-in"),
        },
      ],
    });
  }

  function handleError(error: any) {
    console.error(error);
    confirmAlert({
      message: `Ops! Algo deu errado. Por favor, tente novamente.`,
      buttons: [
        {
          label: "OK",
          onClick: () => null,
        },
      ],
    });
  }

  function buildRegisterPage() {
    return (
      <form className="auth-page__container" onSubmit={handleSubmit}>
        <h1 className="title-card">Cadastro</h1>
        {toggleActiveSection ? (
          <CreatePassword password={password} setPassword={setPassword} />
        ) : (
          <div className="form-sections-wrapper">
            <CommonData />
            <RegistryData />
            <AddressData />
          </div>
        )}

        <div className="footer-section">
          {toggleActiveSection ? (
            <button className={validateForm()} type="submit">
              Cadastrar
            </button>
          ) : (
            <button className={validateForm()} onClick={openModal}>
              Continuar
            </button>
          )}

          {toggleActiveSection ? (
            <div className="return-btn" onClick={() => setActiveSection(false)}>
              {"Editar meus dados"}
            </div>
          ) : (
            <Link href="/auth/check-in">J?? possuo cadastro</Link>
          )}
        </div>
      </form>
    );

    function validateForm() {
      if (toggleActiveSection) {
        return password.password.length > 0 &&
          password.confirm.length > 0 &&
          password.confirm === password.password
          ? "submit-btn"
          : "submit-btn disabled";
      } else {
        return isSectionComplete.address &&
          isSectionComplete.common &&
          isSectionComplete.registry
          ? "submit-btn"
          : "submit-btn disabled";
      }
    }

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setHasSubmitted(true);
      if (mockData) return registerPatient(mockData);

      const common = {
        ...commonData,
        cpf: commonData.cpf.replace(/\D/g, ""),
        password: password.password,
      };
      const registry = {
        ...registryData,
        phone_number: registryData.phone_number.replace(/\D/g, ""),
        gender:
          registryData.gender === "SELF_DESCRIBED"
            ? registryData.described_identity ?? "N??o informado"
            : registryData.gender,
        assigned_at_birth:
          registryData.assigned_at_birth === "SELF_DESCRIBED"
            ? registryData.described_assigned ?? "N??o informado"
            : registryData.assigned_at_birth,
      };
      delete registryData.described_identity;
      delete registryData.described_assigned;

      const address = {
        ...addressData,
        postal_code: addressData.postal_code.replace(/\D/g, ""),
      };

      const data: Forms = {
        common,
        registry,
        address,
      };

      return registerPatient(data);
    }

    function openModal(e: FormEvent) {
      e.preventDefault();
      confirmAlert({
        message: `Quase l??! Agora s?? precisamos de uma senha para voc?? conseguir acessar sua conta.`,
        buttons: [
          {
            label: "Definir senha",
            onClick: () => setActiveSection(true),
          },
        ],
      });
    }
  }
}

export default Register;
