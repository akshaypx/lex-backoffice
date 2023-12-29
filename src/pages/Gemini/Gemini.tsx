import { useState } from "react";
import styles from "./Gemini.module.scss";
import { InputText } from "primereact/inputtext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addToData,
  clearLocalHistory,
  deleteHistory,
  fetchMultiTurnData,
} from "../../store/slice/geminiSlice";
import { Button } from "primereact/button";
import { RootState } from "../../store/store";
import { Skeleton } from "primereact/skeleton";
import { Send } from "lucide-react";
import Markdown from "react-markdown";

const Gemini = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.gemini.loading);
  const loadingDelete = useAppSelector(
    (state: RootState) => state.gemini.deleteHistory
  );
  const multiTurnData = useAppSelector(
    (state: RootState) => state.gemini.multiturnData
  );
  const [text, setText] = useState("");

  // const loading = false;

  const handleSubmit = () => {
    dispatch(addToData(text));
    dispatch(fetchMultiTurnData(text));
    setText("");
  };
  return (
    <div className={styles.parentContainer}>
      <div className={styles.container}>
        <div className={styles.msgContainer}>
          {multiTurnData &&
            multiTurnData?.map((data, index) => (
              <div
                key={index}
                className={
                  index % 2 === 0 ? styles.sMsgContainer : styles.rMsgContainer
                }
              >
                <span
                  className={
                    index % 2 === 0 ? styles.receivedMsg : styles.sentMsg
                  }
                >
                  <Markdown className={styles.markdown}>
                    {data.message.toString()}
                  </Markdown>
                </span>
              </div>
            ))}
          {loading === "pending" && (
            <div className={styles.rMsgContainer}>
              <span className={styles.loadingMsg}>
                <Skeleton className={styles.skeleton}></Skeleton>
                <Skeleton width="10rem" className={styles.skeleton}></Skeleton>
                <Skeleton width="5rem" className={styles.skeleton}></Skeleton>
                <Skeleton height="2rem" className={styles.skeleton}></Skeleton>
              </span>
            </div>
          )}
        </div>
        <span className={styles.controlsContainer}>
          <InputText
            className={styles.inputBox}
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Enter your prompt"
          />
          <Button
            icon={<Send />}
            disabled={loading !== "idle" && loading !== "succeeded"}
            onClick={handleSubmit}
          />
          {multiTurnData && (
            <Button
              onClick={() => {
                dispatch(clearLocalHistory());
                dispatch(deleteHistory());
              }}
              icon={
                loadingDelete === "pending" ? (
                  <i className="pi pi-spin pi-spinner" />
                ) : (
                  <i className="pi pi-trash" />
                )
              }
            />
          )}
        </span>
      </div>
    </div>
  );
};

export default Gemini;
