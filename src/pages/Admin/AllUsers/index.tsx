/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from "react";
import "./styles.css";

import { useAuth } from "../../../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, getUserDoc } from "../../../firebase/auth";
import { User } from "../../../module/user";
import { Task } from "../../../module/task";

const AllUsersAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  const { userLogged, userLoggedIn, currentUser, setUserLogged } = useAuth();

  const getUser = async () => {
    if (!userLogged) {
      const user = await getUserDoc(currentUser.uid);
      setUserLogged(user);
    }
  };

  const getUsers = async () => {
    const users: User[] = await getAllUsers();
    setUsers(users);
  };

  useEffect(() => {
    if (userLoggedIn) {
      getUser();
      getUsers();
    }
  }, []);

  const toggleEditUser = (task: Task, data: User) => {
    navigate("/update-user-admin", { state: { task, data } });
  };

  return (
    <>
      <div className="all-users-admin-edit">
        <h2>Usuários cadastrados no sistema</h2>
        <div className="all-users-admin-container-edit">
          {users?.map((data: User) => {
            return (
              <div className="all-users-admin-box-edit">
                <h2>Name: {data.name}</h2>
                <h2>Email: {data.email}</h2>
                <ul>
                  {data.task.map((item: Task, index: number) => (
                    <div className="all-users-admin-li" key={index}>
                      <li>{item.description}</li>
                      <h5 onClick={() => toggleEditUser(item, data)}>
                        Editar tarefa
                      </h5>
                    </div>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <Link className="all-users-admin-goback" to="/home-user">
        Voltar
      </Link>
    </>
  );
};

export default AllUsersAdmin;
