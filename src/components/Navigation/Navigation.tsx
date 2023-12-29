import React from "react";
import styles from "./Navigation.module.scss";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface NavigationProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation = ({ visible, setVisible }: NavigationProps) => {
  const navigate = useNavigate();
  return (
    <div className="card flex justify-content-center">
      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        className={styles.container}
      >
        <p>
          <b>Home</b>
        </p>
        <Button
          className={styles.button}
          icon="pi pi-align-justify"
          label="Dashboard"
          onClick={() => {
            navigate("/");
            setVisible(false);
          }}
        />
        <p>
          <b>Questions</b>
        </p>
        <Button
          className={styles.button}
          icon="pi pi-question-circle"
          label="Questions Setup"
          onClick={() => {
            navigate("/questions");
            setVisible(false);
          }}
        />
        <p>
          <b>Other</b>
        </p>

        <Button
          className={styles.button}
          icon="pi pi-cog"
          label="Configurations"
          onClick={() => {
            navigate("/configurations");
            setVisible(false);
          }}
        />
        <Button
          className={styles.button}
          icon="pi pi-users"
          label="User Management"
          onClick={() => {
            navigate("/user-management");
            setVisible(false);
          }}
        />
        <p>
          <b>POCs</b>
        </p>

        <Button
          className={styles.button}
          icon={<Sparkles />}
          label="Gemini"
          onClick={() => {
            navigate("/gemini");
            setVisible(false);
          }}
        />
      </Sidebar>
    </div>
  );
};

export default Navigation;
