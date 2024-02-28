import React from "react";
import "./styles.css";

import { useAuth } from "../../../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import { doSignOut } from "../../../firebase/auth";

const HomeUser = () => {
  const { setUserLogged, userLogged } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-user-container">
      <h2>O que gostaria de fazer, {userLogged?.name ?? ""}?</h2>
      <div className="home-user-box">
        <Link className="home-user-add-task" to="/task-user">
          Adicionar tarefa
        </Link>
        <Link className="home-user-add-task" to="/add-categories-user">
          Adicionar categorias
        </Link>
        <Link className="home-user-add-task" to="/edit-user">
          Ver e editar tarefas
        </Link>
        {userLogged?.isAdm && (
          <Link className="home-user-add-task" to="/all-users-adm">
            Ver e editar tarefas dos usuários
          </Link>
        )}

        <button
          onClick={() => {
            setUserLogged(null);
            doSignOut().then(() => {
              navigate("/login");
            });
          }}
          className="home-user-logout"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default HomeUser;
