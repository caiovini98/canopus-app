/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./styles.css";

import { useAuth } from "../../../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import { getUserDoc, updateTask } from "../../../firebase/auth";
import { priorityMessage } from "../../../utils/priorityMessage";
import { User } from "../../../module/user";
import { Task } from "../../../module/task";

const EditTaskUser = () => {
  const { userLogged, userLoggedIn, setUserLogged, currentUser } = useAuth();
  const [priorityFilter, setPriorityFilter] = useState("");
  const [situationFilter, setSituationFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");

  const getUser = async () => {
    if (!userLogged) {
      const user = await getUserDoc(currentUser.uid);
      setUserLogged(user);
    }
  };

  const toggleComplete = async (id: string) => {
    const newUserLogged: User[] = userLogged?.task.map((t: any) => {
      if (t.id === id) {
        return { ...t, situation: "concluida" };
      }
      return t;
    });

    try {
      await updateTask(userLogged.uid, newUserLogged);
      window.location.reload();
    } catch (e: any) {
      console.log("Erro: ", e);
    }
  };

  const toggleFinishing = async (id: string) => {
    const newUserLogged: User[] = userLogged?.task.map((t: any) => {
      if (t.id === id) {
        return { ...t, situation: "iniciada" };
      }
      return t;
    });

    try {
      await updateTask(userLogged.uid, newUserLogged);

      window.location.reload();
    } catch (e: any) {
      console.log("Erro: ", e);
    }
  };

  useEffect(() => {
    if (userLoggedIn) {
      getUser();
    }
  }, [getUser]);

  const navigate = useNavigate();

  return (
    <div className="task-edit-container">
      <h2>Minhas tarefas</h2>

      <div className="task-edit-filters">
        <div className="task-edit-filter">
          <label htmlFor="priority">Prioridade:</label>
          <select
            id="priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="1">Muito Baixo</option>
            <option value="2">Baixo</option>
            <option value="3">Médio</option>
            <option value="4">Alto</option>
            <option value="5">Muito Alto</option>
          </select>
        </div>
        <div className="task-edit-filter">
          <label htmlFor="situation">Situação:</label>
          <select
            id="situation"
            value={situationFilter}
            onChange={(e) => setSituationFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="iniciada">Iniciada</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div className="task-edit-filter">
          <label htmlFor="description">Descrição:</label>
          <input
            type="text"
            id="description"
            className="task-edit-input-filter"
            value={descriptionFilter}
            onChange={(e) => setDescriptionFilter(e.target.value)}
            placeholder="Filtrar por descrição"
          />
        </div>
      </div>

      <div className="task-edit-container-card">
        {userLogged?.task
          ?.filter((t: any) => {
            if (priorityFilter && t.priority !== priorityFilter) {
              return false;
            }
            if (situationFilter && t.situation !== situationFilter) {
              return false;
            }
            if (
              descriptionFilter &&
              !t.description.includes(descriptionFilter)
            ) {
              return false;
            }
            return true;
          })
          .slice()
          .sort((a: any, b: any) => {
            if (a.priority !== b.priority) {
              return b.priority - a.priority;
            } else {
              const dateA = new Date(a.dateLimit).getTime();
              const dateB = new Date(b.dateLimit).getTime();
              return dateA - dateB;
            }
          })
          .map((t: Task) => {
            return (
              <>
                <div
                  key={t?.id}
                  className={`task-edit-container-box ${t?.situation}`}
                >
                  <h3>Descrição: {t?.description}</h3>
                  <h3>Categoria: {t?.category}</h3>
                  <h3>Prioridade: {priorityMessage(Number(t?.priority))}</h3>
                  <h3>Situação: {t?.situation}</h3>
                  <h3>
                    Data limite:{" "}
                    {t?.dateLimit ? t?.dateLimit : "Sem informação"}
                  </h3>
                  <h3>Anotações:</h3>
                  {t?.anotations.length > 0 ? (
                    <ul>
                      {t?.anotations.map((item: any, index: number) => (
                        <div className="task-user-li" key={index}>
                          <li>{item.conteudo}</li>
                        </div>
                      ))}
                    </ul>
                  ) : (
                    <h4>Sem anotações </h4>
                  )}
                  <h5 onClick={() => toggleFinishing(t?.id)}>
                    Já iniciou a tarefa?
                  </h5>
                  <h5 onClick={() => toggleComplete(t?.id)}>
                    Já finalizou a tarefa?
                  </h5>
                  <button
                    className="task-edit-update"
                    onClick={() => navigate("/update-user", { state: { t } })}
                  >
                    Alterar
                  </button>
                </div>
              </>
            );
          })}
      </div>
      <Link className="task-edit-goback" to="/home-user">
        Voltar
      </Link>
    </div>
  );
};

export default EditTaskUser;
