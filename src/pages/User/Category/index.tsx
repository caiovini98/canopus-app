/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from "react";
import "./styles.css";

import { useAuth } from "../../../contexts/authContext";
import { Link } from "react-router-dom";
import {
  addCategory,
  getUserDoc,
  updateCategory,
} from "../../../firebase/auth";
import { generateRandomCode } from "../../../utils/generateUid";
import { Category } from "../../../module/category";

const CategoryUser = () => {
  const [description, setDescription] = useState("");
  const [user, setUser] = useState<Category>();

  const { userLogged, userLoggedIn, currentUser, setUserLogged } = useAuth();

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

  const editCategory = (code: string) => {
    const getUser = userLogged.category.find((data: any) => {
      return data.code === code;
    });

    setUser(getUser);
    setDescription(getUser ? getUser.description : "");
  };

  const updateCategories = async () => {
    const newTask = {
      ...user,
      description,
    };

    if (user?.code) {
      const updatedTask = userLogged?.category?.map((item: any) => {
        if (item.code === user.code) {
          return { ...newTask };
        }
        return item;
      });
      try {
        await updateCategory(userLogged.uid, updatedTask);
        window.location.reload();
      } catch (e: any) {
        console.log("Erro: ", e);
      }
    } else {
      console.log("Essa descrição não existe ainda");
    }
  };

  const onSubmit = async () => {
    if (!description) {
      console.log("Coloque algo");

      return;
    }

    const task = {
      description,
      code: generateRandomCode(),
    };

    try {
      await addCategory(userLogged.uid, task);
      window.location.reload();
    } catch (e: any) {
      console.log("Erro: ", e);
    }
  };

  return (
    <>
      <div className="category-user-container">
        <h2>Adicionar categoria</h2>
        <div className="category-user-box">
          <input
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Descrição"
            autoComplete="off"
            value={description}
          />
        </div>
        <button onClick={onSubmit}>Adicionar</button>
        <button onClick={updateCategories}>Editar</button>
      </div>
      <div className="category-user-edit">
        <h2>Categorias cadastradas</h2>
        <div className="category-user-container-edit">
          {userLogged?.category?.map((data: any) => {
            return (
              <div className="category-user-box-edit">
                <h2>Código: {data.code}</h2>
                <h2>Descrição: {data.description}</h2>
                <button onClick={() => editCategory(data.code)}>
                  Atualizar
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <Link className="category-user-goback" to="/home-user">
        Voltar
      </Link>
    </>
  );
};

export default CategoryUser;
