import React from "react";
import styles from "./Header.module.scss";
import { Button } from "primereact/button";
import { useLocation } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";

interface HeaderProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ visible, setVisible }: HeaderProps) => {
  const location = useLocation();
  console.log(location);
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <Button
          icon="pi pi-align-justify"
          link
          style={{ color: "white" }}
          onClick={() => setVisible(true)}
        />
        <h2 className={styles.header}>
          {location.pathname.substring(1) === ""
            ? "Dashboard"
            : location.pathname.substring(1, 2).toLocaleUpperCase() +
              location.pathname.substring(2).replaceAll("-", " ")}
        </h2>
      </div>
      <div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText placeholder="Search" />
        </span>
      </div>
      <div className={styles.rightContainer}>
        <Avatar
          icon="pi pi-user"
          className="mr-2"
          style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
          shape="circle"
        />
        <div className={styles.userInfo}>
          <b>Akshay</b>
          <p>Admin</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
