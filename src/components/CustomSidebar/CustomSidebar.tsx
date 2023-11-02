import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import styles from "./CustomSidebar.module.scss";
import { InputText } from "primereact/inputtext";
import { Question } from "../../types/Question";
import { fetchData, updateData } from "../../store/slice/questionsSlice";

interface CustomSidebarProps {
  visibleRight: boolean;
  setVisibleRight: (value: React.SetStateAction<boolean>) => void;
}

const CustomSidebar = ({
  visibleRight,
  setVisibleRight,
}: CustomSidebarProps) => {
  const question = useAppSelector(
    (state: RootState) => state.questions.question
  );
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<Question | null>(question);
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.questions.loading);

  useEffect(() => {
    setValues(question);
  }, [question]);

  if (loading === "succeeded" && question) {
    return (
      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
      >
        <div className={styles.header}>
          <h2>Details</h2>
          {isEditing ? (
            <div className={styles.buttons}>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  dispatch(updateData(values!));
                  dispatch(fetchData());
                }}
              >
                <i className="pi pi-check"></i>
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                <i className="pi pi-times"></i>
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>
        <p className={styles.info}>Question</p>
        {isEditing ? (
          <InputText
            defaultValue={question?.question}
            onChange={(e) => {
              if (values) {
                setValues({
                  ...values,
                  question: e.target.value,
                });
              }
            }}
          />
        ) : (
          <p>{question?.question}</p>
        )}

        <p className={styles.info} style={{ marginTop: "10px" }}>
          Created At
        </p>
        <p>{question?.createdAt?.toString()}</p>
        <p className={styles.info}>Slot Type</p>
        <p>{question?.slotType}</p>
      </Sidebar>
    );
  }
  return <></>;
};

export default CustomSidebar;
