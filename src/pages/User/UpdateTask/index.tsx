import React, { useState } from "react";
import "./styles.css";

import { useAuth } from "../../../contexts/authContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { updateTask } from "../../../firebase/auth";
import dataAtual, {
  convertDate,
  convertDateToInputDate,
} from "../../../utils/date";
import { Anotation } from "../../../module/anotation";
import { Task } from "../../../module/task";
import { Category } from "../../../module/category";

const UpdateTaskUser = () => {
  const location = useLocation();
  const task: Task = location.state.t;

  const [description, setDescription] = useState(task?.description);
  const [category, setCategory] = useState(task?.category);
  const [situation, setSituation] = useState(task?.situation);
  const [priority, setPriority] = useState(task?.priority);
  const [dataMinima, setDataMinima] = useState(
    task?.dateLimit ? convertDateToInputDate(task?.dateLimit) : ""
  );
  const [anotations, setAnotations] = useState<Anotation[]>(task?.anotations);
  const [novoItem, setNovoItem] = useState("");
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const { userLogged } = useAuth();
  const navigate = useNavigate();

  const handleSituation = (e: any) => {
    setSituation(e.target.value);
  };

  const handlePriority = (e: any) => {
    setPriority(e.target.value);
  };

  const adicionarItem = (conteudo: string) => {
    const newItem = {
      id: nextId,
      conteudo,
    };
    if (novoItem.trim() !== "") {
      setAnotations([...anotations, newItem]);
      setNovoItem("");
      setNextId(nextId + 1);
    }
  };

  const excluirItem = (id: number) => {
    setAnotations(anotations.filter((item: Anotation) => item.id !== id));
  };

  const onSubmit = async () => {
    if (!description || !category) {
      setErro("Atualize uma descrição e/ou categoria válida");

      return;
    }
    setLoading(true);

    const newTask = {
      ...task,
      description,
      category,
      situation,
      priority,
      dateLimit: task?.dateLimit ? convertDate(dataMinima) : "",
      anotations,
    };

    const updatedTask = userLogged?.task?.map((item: Task) => {
      if (item.id === task.id) {
        return { ...newTask };
      }
      return item;
    });

    try {
      await updateTask(userLogged.uid, updatedTask);
      navigate("/home-user");
      window.location.reload();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  const excluirTask = async () => {
    const deleteTask = userLogged?.task?.filter(
      (item: Task) => item.id !== task.id
    );

    await updateTask(userLogged.uid, deleteTask);
    navigate("/home-user");
    window.location.reload();
  };

  return (
    <div className="update-task-user-container">
      <h2>Editar tarefa</h2>
      <div className="update-task-user-box">
        <input
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Descrição"
          autoComplete="off"
          value={description}
        />
      </div>
      <div className="task-user-select">
        <label className="task-user-label-title">Categoria</label>
        <div className="update-task-user-box">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Selecione uma opção</option>
            {userLogged?.category?.map((cat: Category) => (
              <option key={cat.code} value={cat.description}>
                {cat.description}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label className="update-task-user-label-title">Prioridade</label>
      <div className="update-task-user-box-radio-group">
        <div>
          <input
            type="radio"
            value="5"
            checked={priority === "5"}
            onChange={handlePriority}
          />
          <label htmlFor="5">Muito alta</label>
        </div>
        <div>
          <input
            type="radio"
            value="4"
            checked={priority === "4"}
            onChange={handlePriority}
          />
          <label htmlFor="4">Alta</label>
        </div>
        <div>
          <input
            type="radio"
            value="3"
            checked={priority === "3"}
            onChange={handlePriority}
          />
          <label htmlFor="3">Média</label>
        </div>
        <div>
          <input
            type="radio"
            value="2"
            checked={priority === "2"}
            onChange={handlePriority}
          />
          <label htmlFor="2">Baixa</label>
        </div>
        <div>
          <input
            type="radio"
            value="1"
            checked={priority === "1"}
            onChange={handlePriority}
          />
          <label htmlFor="1">Muito baixa</label>
        </div>
      </div>
      <label className="update-task-user-label-title">Situação</label>
      <div className="update-task-user-box-radio-group">
        <div>
          <input
            type="radio"
            value="pendente"
            checked={situation === "pendente"}
            onChange={handleSituation}
          />
          <label htmlFor="pendente">Pendente</label>
        </div>
        <div>
          <input
            type="radio"
            value="iniciada"
            checked={situation === "iniciada"}
            onChange={handleSituation}
          />
          <label htmlFor="iniciada">Iniciada</label>
        </div>
        <div>
          <input
            type="radio"
            value="concluida"
            checked={situation === "concluida"}
            onChange={handleSituation}
          />
          <label htmlFor="concluida">Concluída</label>
        </div>
        <div>
          <input
            type="radio"
            value="cancelada"
            checked={situation === "cancelada"}
            onChange={handleSituation}
          />
          <label htmlFor="cancelada">Cancelada</label>
        </div>
      </div>
      <label className="update-task-user-label-title">Data limite</label>
      <div className="update-task-user-box">
        <input
          type="date"
          autoComplete="off"
          min={dataAtual}
          onChange={(e) => setDataMinima(e.target.value)}
          value={dataMinima}
        />
      </div>
      <div className="update-task-user-box">
        <label className="update-task-user-label-title">Anotações</label>
        <ul>
          {anotations.map((item: Anotation, index: number) => (
            <div className="update-task-user-li" key={index}>
              <li>{item.conteudo}</li>
              <button
                className="update-task-user-button-anotations"
                onClick={() => excluirItem(item.id)}
              >
                Excluir
              </button>
            </div>
          ))}
        </ul>
        <input
          type="text"
          value={novoItem}
          onChange={(e) => setNovoItem(e.target.value)}
          placeholder="Coloque alguma anotação"
        />
        <button
          className="update-task-user-button-anotations"
          onClick={() => adicionarItem(novoItem)}
        >
          Adicionar anotação
        </button>
      </div>
      <p className="update-task-error">{erro}</p>
      <button
        disabled={loading}
        onClick={onSubmit}
        className="update-task-user-button"
      >
        Editar
      </button>
      <button
        disabled={loading}
        onClick={excluirTask}
        className="update-task-user-button-delete"
      >
        Excluir
      </button>
      <Link className="update-task-user-button-goback" to="/edit-user">
        Voltar
      </Link>
    </div>
  );
};

export default UpdateTaskUser;
