import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import styles from "./Questions.module.scss";
import { Button } from "primereact/button";
import { buildSlot, createSlot, fetchSlots } from "../../store/slice/slotSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import PulseLoader from "react-spinners/PulseLoader";
import SlotCard from "../../components/SlotCard/SlotCard";
import { Card } from "primereact/card";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";

interface Language {
  name: string;
  code: string;
}

const Questions = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.slots.loading);
  const slotData = useAppSelector((state: RootState) => state.slots.slotData);
  const error = useAppSelector((state: RootState) => state.slots.error);

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );

  const [ingredient, setIngredient] = useState<string>("");

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

  let noOfOptions = [""];

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
  }, [dispatch]);

  return (
    <>
      <div className={styles.parentContainer}>
        <div className={styles.container}>
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
                <b className={styles.first}>Type of Answer</b>
                {/* <InputTextarea
                  className={styles.second}
                  onChange={(e) =>
                    setSlotValues({ ...slotValues, condition: e.target.value })
                  }
                /> */}
                <div>
                  <div
                    className="flex flex-wrap gap-3"
                    style={{ display: "flex", gap: 10 }}
                  >
                    <div className="flex align-items-center">
                      <RadioButton
                        inputId="ingredient1"
                        name="plainText"
                        value="PlainText"
                        onChange={(e: RadioButtonChangeEvent) =>
                          setIngredient(e.value)
                        }
                        checked={ingredient === "PlainText"}
                      />
                      <label htmlFor="ingredient1" className="ml-2">
                        Plain Text
                      </label>
                    </div>
                    <div className="flex align-items-center">
                      <RadioButton
                        inputId="ingredient2"
                        name="card"
                        value="Card"
                        onChange={(e: RadioButtonChangeEvent) =>
                          setIngredient(e.value)
                        }
                        checked={ingredient === "Card"}
                      />
                      <label htmlFor="ingredient2" className="ml-2">
                        Card
                      </label>
                    </div>
                    <div className="flex align-items-center">
                      <RadioButton
                        inputId="ingredient3"
                        name="custom"
                        value="Custom"
                        onChange={(e: RadioButtonChangeEvent) =>
                          setIngredient(e.value)
                        }
                        checked={ingredient === "Custom"}
                      />
                      <label htmlFor="ingredient3" className="ml-2">
                        Custom
                      </label>
                    </div>
                  </div>
                </div>
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
              {ingredient === "Card" && (
                <>
                  {noOfOptions.map((val: any, index: number) => (
                    <div className={styles.dialogRow}>
                      <b className={styles.first}>Option {index}</b>
                      <InputText className={styles.second} />
                    </div>
                  ))}
                  <Button
                    label="+"
                    style={{ marginLeft: "4px" }}
                    onClick={() => {
                      noOfOptions.push("");
                      console.log("+");
                    }}
                  />
                </>
              )}
            </div>
          </Dialog>
          <div className={styles.container}>
            <div className={styles.card}>
              {/* <h1>Questions</h1> */}
              <div className={styles.topRow}>
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
                    className={styles.headerButton}
                    label="Add Question"
                    icon="pi pi-plus"
                    onClick={() => setVisible(true)}
                  />
                  <Button
                    className={styles.headerButton}
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
              <Card title="All Questions">
                {loading === "succeeded" &&
                  slotData &&
                  slotData.slotSummaries?.map((slot) => {
                    console.log(slotData);
                    return (
                      <SlotCard key={slot.slotId} data={slot} show={show} />
                    );
                  })}
              </Card>

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

                {loading === "succeeded" && slotData && ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Questions;
