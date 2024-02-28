import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";
import "./styles.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdm, setIsAdm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [erro, setErro] = useState("");

  const { userLoggedIn } = useAuth();

  const errorMessage = (error: any) => {
    if (error === "Firebase: Error (auth/missing-email).") {
      setErro("Preencha o email corretamente");

      return;
    }

    if (error === "Firebase: Error (auth/missing-password).") {
      setErro("Preencha a senha corretamente");

      return;
    }

    if (error === "Firebase: Error (auth/invalid-email).") {
      setErro("Preencha um email válido");

      return;
    }

    if (error === "Firebase: Error (auth/email-already-in-use).") {
      setErro("Este email já existe, use outro");

      return;
    }

    setErro("Algo deu errado, por favor revise os dados e tente novamente");

    return;
  };

  const onSubmit = async (e: any) => {
    if (!name) {
      setErro("Coloque um nome");

      return;
    }
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password, name, isAdm);
      } catch (e: any) {
        errorMessage(e.message);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home-user"} replace={true} />}

      <div className="register-container">
        <header className="register-header">
          <span>Cadastre-se</span>
        </header>

        <form onSubmit={onSubmit}>
          <div className="register-inputContainer">
            <label htmlFor="name">Nome completo</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Fulano"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="register-inputContainer">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="fulano@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="register-inputContainer">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="register-containerCheckbox">
            <label htmlFor="checkbox">É administrador?</label>
            <input
              type="checkbox"
              className="register-checkbox"
              onChange={(e) => setIsAdm(e.target.checked)}
            />
          </div>

          <button className="register-button" disabled={isRegistering}>
            {isRegistering ? "Cadastrando..." : "Cadastrar"}
          </button>
          <p className="register-footer-error">{erro}</p>
          <div className="register-footer">
            <p>Você já tem uma conta?</p>
            <Link to="/">Acesse sua conta aqui</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
