import React, { useEffect, useRef, useState } from "react";
import styles from "./BotForm.module.scss";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { buildSlot, createSlot, fetchSlots } from "../../store/slice/slotSlice";
import SlotCard from "../../components/SlotCard/SlotCard";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { PulseLoader } from "react-spinners";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import {
  fetchIntentMetrics,
  fetchUtteranceAnalyticsData,
  fetchUtteranceMetrics,
} from "../../store/slice/analyticsSlice";
import PieChat from "../../components/PieChat/PieChat";
import HorizontalBar from "../../components/HorizontalBar/HorizontalBar";
import BasicChart from "../../components/BasicChart/BasicChart";

interface Language {
  name: string;
  code: string;
}

const BotForm = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.slots.loading);
  const slotData = useAppSelector((state: RootState) => state.slots.slotData);
  const error = useAppSelector((state: RootState) => state.slots.error);
  const loadingIntent = useAppSelector(
    (state: RootState) => state.analytics.loading
  );
  const intentMetrics = useAppSelector(
    (state: RootState) => state.analytics.intentMetrics
  );
  const utteranceMetrics = useAppSelector(
    (state: RootState) => state.analytics.utteranceMetrics
  );
  const utteranceAnalyticsData = useAppSelector(
    (state: RootState) => state.analytics.utteranceAnalyticsData
  );
  const { understoodUtterances, intentDistribution, responseTypes, slotUsage } =
    useAppSelector((state: RootState) => state.analytics);

  // const [utterancesUnderstood, setUtterancesUnderstood] = useState(0);
  const totalUtterances = utteranceAnalyticsData?.utterances?.length || 0;
  const notUnderstoodUtterances = totalUtterances - understoodUtterances;

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
  const languages: Language[] = [
    { name: "English", code: "EN" },
    { name: "Japanese", code: "JA" },
  ];

  const [slotValues, setSlotValues] = useState({
    slotName: "",
    slotTypeId: "",
    message: "",
    condition: "",
  });

  const [visible, setVisible] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  const show = (msg: string) => {
    toast.current?.show({
      severity: "info",
      summary: "Info",
      detail: msg,
    });
  };

  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => {
          // console.log(slotValues);
          dispatch(
            createSlot({
              slotTypeId: "AMAZON.AlphaNumeric",
              slotName: slotValues.slotName,
              message: {
                customPayload: null,
                imageResponseCard: {
                  buttons: [
                    {
                      text: "Male",
                      value: "Male",
                    },
                    {
                      text: "Female",
                      value: "Female",
                    },
                    {
                      text: "Other",
                      value: "Other",
                    },
                  ],
                  imageUrl: null,
                  subtitle: null,
                  title: slotValues.message,
                },
                plainTextMessage: null,
                ssmlMessage: null,
              },
              condition: {
                expression: "if{Gender}==='Male'",
                conditionName: "CheckMale",
                actionType: "ElicitSlot",
                slotToElicit: "age",
                defaultBranch: {
                  actionType: "ElicitSlot",
                  slotToElicit: "age",
                },
              },
            })
          ).then(() => {
            setVisible(false);
            if (loading === "succeeded") {
              show("Success");
              dispatch(fetchSlots());
            } else if (loading === "failed") {
              show("Failed");
            }
          });
        }}
        autoFocus
      />
    </div>
  );

  useEffect(() => {
    dispatch(fetchSlots());
    dispatch(fetchIntentMetrics());
    dispatch(fetchUtteranceMetrics());
    dispatch(fetchUtteranceAnalyticsData());
  }, [dispatch]);

  // console.log(slotData);

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="New Slot"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <div className={styles.dialogContainer}>
          <div className={styles.dialogRow}>
            <b className={styles.first}>Name</b>
            <InputText
              className={styles.second}
              onChange={(e) =>
                setSlotValues({ ...slotValues, slotName: e.target.value })
              }
            />
          </div>
          <div className={styles.dialogRow}>
            <b className={styles.first}>Message</b>
            <InputTextarea
              className={styles.second}
              onChange={(e) =>
                setSlotValues({ ...slotValues, message: e.target.value })
              }
            />
          </div>
          <div className={styles.dialogRow}>
            <b className={styles.first}>Condition</b>
            <InputTextarea
              className={styles.second}
              onChange={(e) =>
                setSlotValues({ ...slotValues, condition: e.target.value })
              }
            />
          </div>
        </div>
      </Dialog>
      <div className={styles.parentContainer}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1>Dashboard</h1>
            <h3>Intent Metrics</h3>
            <div className={styles.grid}>
              {loadingIntent === "pending" && (
                <div className={styles.loading}>
                  <PulseLoader
                    color="rgb(108, 108, 255)"
                    size={10}
                    speedMultiplier={1}
                  />
                </div>
              )}
              {loadingIntent === "succeeded" &&
                intentMetrics &&
                intentMetrics!.results &&
                intentMetrics!.results[0].metricsResults?.map((val, i) => (
                  <div className={styles.dashCard} key={i}>
                    <b>{val.name}</b>
                    <p>
                      {val.value}
                      <i>({val.statistic})</i>
                    </p>
                  </div>
                ))}
            </div>
            <h3>Utterance Metrics</h3>
            <div className={styles.grid}>
              {loadingIntent === "pending" && (
                <div className={styles.loading}>
                  <PulseLoader
                    color="rgb(108, 108, 255)"
                    size={10}
                    speedMultiplier={1}
                  />
                </div>
              )}
              {loadingIntent === "succeeded" &&
                utteranceMetrics &&
                utteranceMetrics!.results &&
                utteranceMetrics!.results[0].metricsResults?.map((val, i) => (
                  <div className={styles.dashCard} key={i}>
                    <b>{val.name}</b>
                    <p>
                      {val.value}
                      <i>({val.statistic})</i>
                    </p>
                  </div>
                ))}
            </div>
            <h3>Analytics Data</h3>
            <div className={styles.grid}>
              {loadingIntent === "pending" && (
                <div className={styles.loading}>
                  <PulseLoader
                    color="rgb(108, 108, 255)"
                    size={10}
                    speedMultiplier={1}
                  />
                </div>
              )}
              {loadingIntent === "succeeded" && utteranceAnalyticsData && (
                <>
                  <div className={styles.chartCard}>
                    <b>Utterance Distribution</b>
                    <PieChat
                      labels={["Understood", "Not Understood"]}
                      dataArray={[
                        understoodUtterances,
                        notUnderstoodUtterances,
                      ]}
                    />
                  </div>
                  <div className={styles.chartCard}>
                    <b>Intent Distribution</b>
                    <BasicChart
                      labels={Object.keys(intentDistribution)}
                      dataArray={Object.values(intentDistribution)}
                    />
                  </div>
                  <div className={styles.chartCard}>
                    <b>Slot Usage</b>
                    <HorizontalBar
                      dataSetName="Slots"
                      labels={Object.keys(slotUsage)}
                      dataArray={Object.values(slotUsage)}
                    />
                  </div>
                  <div className={styles.chartCard}>
                    <b>Response Types</b>
                    <HorizontalBar
                      dataSetName="Response Types"
                      labels={Object.keys(responseTypes)}
                      dataArray={Object.values(responseTypes)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.title}>
              <h1>Questions</h1>
              <div>
                <Dropdown
                  value={selectedLanguage}
                  onChange={(e: DropdownChangeEvent) =>
                    setSelectedLanguage(e.value)
                  }
                  options={languages}
                  optionLabel="name"
                  placeholder="Language"
                  className="w-full md:w-14rem"
                />
              </div>
              <div className={styles.headerButtons}>
                <Button
                  style={{
                    padding: "5px 10px",
                  }}
                  label="Add Question"
                  icon="pi pi-plus"
                  onClick={() => setVisible(true)}
                />
                <Button
                  style={{
                    padding: "5px 10px",
                  }}
                  label="Build"
                  onClick={() => {
                    dispatch(buildSlot());
                    if (loading === "succeeded") {
                      show("success");
                    } else if (loading === "failed") {
                      show("Failed");
                    }
                  }}
                />
              </div>
            </div>
            <div className={styles.innerContainer}>
              {error && <p>{error}</p>}
              {loading === "pending" && (
                <div className={styles.loading}>
                  <PulseLoader
                    color="rgb(108, 108, 255)"
                    size={10}
                    speedMultiplier={1}
                  />
                </div>
              )}
              {loading === "failed" && <div>An error occurred</div>}

              {loading === "succeeded" &&
                slotData &&
                slotData.slotSummaries?.map((slot) => {
                  console.log(slotData);
                  return <SlotCard key={slot.slotId} data={slot} show={show} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BotForm;
