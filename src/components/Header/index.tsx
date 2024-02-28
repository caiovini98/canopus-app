import React, { useEffect } from "react";

import "./styles.css";
import { useAuth } from "../../contexts/authContext";
import { getUserDoc } from "../../firebase/auth";

const Header = () => {
  const { userLogged, userLoggedIn, setUserLogged, currentUser } = useAuth();

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
  }, [userLoggedIn]);

  return (
    <div className="header-headerContainer">
      <span>
        Olá, seja bem-vindo(a){userLogged ? `, ${userLogged.name}` : ""}
      </span>
      <img
        src="https://media.licdn.com/dms/image/C4E0BAQGOzxwaY20_vg/company-logo_200_200/0/1630599821983?e=1717027200&v=beta&t=FNukRD3IvFhkkwIRuiTGodKd0Kwj6kTQdRkhAhBUweA"
        alt="logo"
      />
    </div>
  );
};

export default Header;
