import React, { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  getUserDoc,
} from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import "./styles.css";

const Login = () => {
  const { userLoggedIn, setUserLogged, userLogged, currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const getUser = async () => {
    if (!userLogged) {
      const user = await getUserDoc(currentUser.uid);
      setUserLogged(user);
    }
  };

  useEffect(() => {
    if (userLoggedIn) {
      getUser();
    }
  }, [getUser]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      console.log("coloque email ou uma senha válida");

      return;
    }
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const getUser = await doSignInWithEmailAndPassword(email, password);
        const { user } = getUser;
        const userLogged = await getUserDoc(user.uid);
        setUserLogged(userLogged);
        if (userLogged) {
          navigate("/home-user");
        }
      } catch (error: any) {
        setIsSigningIn(false);
        console.log("erro: ", error);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home-user"} replace={true} />}

      <div className="login-container">
        <header className="login-header">
          <span>Por favor, digite suas informações de login</span>
        </header>
        <form onSubmit={onSubmit}>
          <div className="login-inputContainer">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="fulano@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-inputContainer">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-button" disabled={isSigningIn}>
            {isSigningIn ? "Entrando..." : "Entrar"}
          </button>
          <div className="login-footer">
            <p className="login-signUp">Você ainda não tem uma conta?</p>
            <Link className="login-signUp" to="/register">
              Crie a sua conta aqui
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
