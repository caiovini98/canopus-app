/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from "react";
import "./styles.css";

import { useAuth } from "../../../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import { addTask } from "../../../firebase/auth";
import dataAtual, { convertDate } from "../../../utils/date";
import { generateUID } from "../../../utils/generateUid";
import { Anotation } from "../../../module/anotation";
import { Category } from "../../../module/category";

const TaskUser = () => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [situation, setSituation] = useState("pendente");
  const [priority, setPriority] = useState("1");
  const [dataMinima, setDataMinima] = useState("");
  const [anotations, setAnotations] = useState<Anotation[]>([]);
  const [newItem, setNewItem] = useState("");
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

  const addItem = (conteudo: string) => {
    const newAnotation: Anotation = {
      id: nextId,
      conteudo,
    };
    if (newItem.trim() !== "") {
      setAnotations([...anotations, newAnotation]);
      setNewItem("");
      setNextId(nextId + 1);
    }
  };

  const deleteItem = (id: number) => {
    setAnotations(anotations.filter((item: Anotation) => item.id !== id));
  };

  const onSubmit = async () => {
    if (!description || !category) {
      setErro("Coloque uma descrição e/ou categoria");

      return;
    }
    setLoading(true);

    const task = {
      description,
      category,
      situation,
      priority,
      dateLimit: dataMinima ? convertDate(dataMinima) : "",
      anotations,
      id: generateUID(),
    };

    try {
      await addTask(userLogged.uid, task);
      navigate("/home-user");
      window.location.reload();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onSubmit={onSubmit} className="task-user-container">
      <h2>Adicionar tarefa</h2>
      <div className="task-user-box">
        <input
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Descrição"
          autoComplete="off"
        />
      </div>
      <div className="task-user-select">
        <label className="task-user-label-title">Categoria</label>
        <div className="task-user-box">
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
      <label className="task-user-label-title">Prioridade</label>
      <div className="task-user-box-radio-group">
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
      <label className="task-user-label-title">Situação</label>
      <div className="task-user-box-radio-group">
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
      <label className="task-user-label-title">Data limite</label>
      <div className="task-user-box">
        <input
          type="date"
          autoComplete="off"
          min={dataAtual}
          onChange={(e) => setDataMinima(e.target.value)}
        />
      </div>
      <div className="task-user-box">
        <label className="task-user-label-title">Anotações</label>
        <ul>
          {anotations.map((item: Anotation, index: number) => (
            <div className="task-user-li" key={index}>
              <li>{item.conteudo}</li>
              <button
                className="task-user-button-anotation"
                onClick={() => deleteItem(item.id)}
              >
                Excluir
              </button>
            </div>
          ))}
        </ul>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Coloque alguma anotação"
        />
        <button
          className="task-user-button-anotation"
          onClick={() => addItem(newItem)}
        >
          Adicionar anotação
        </button>
      </div>
      <p className="task-user-error">{erro}</p>
      <button
        disabled={loading}
        onClick={onSubmit}
        className="task-user-button"
      >
        Adicionar
      </button>
      <Link className="task-user-button-goback" to="/home-user">
        Voltar
      </Link>
    </div>
  );
};

export default TaskUser;
