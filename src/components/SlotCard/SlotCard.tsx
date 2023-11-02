import styles from "./SlotCard.module.scss";
import { MessageGroupsEntity, SlotSummariesEntity } from "../../types/Slot";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  deleteSlot,
  fetchSlots,
  updateSlot,
} from "../../store/slice/slotSlice";
import { RootState } from "../../store/store";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";

interface SlotCardProps {
  data: SlotSummariesEntity;
  show: (msg: string) => void;
}

const SlotCard = ({ data, show }: SlotCardProps) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.slots.loading);
  const [visible, setVisible] = useState<boolean>(false);
  const [slotValues, setSlotValues] = useState<SlotSummariesEntity>(data);
  const [messageGroups, setMessageGroups] = useState<MessageGroupsEntity[]>(
    data.valueElicitationPromptSpecification.messageGroups!
  );

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
          // console.log(messageGroups);
          dispatch(
            updateSlot({
              slotId: data.slotId,
              slotName: slotValues.slotName,
              slotTypeId: slotValues.slotTypeId,
              message: messageGroups[0].message,
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
              dispatch(fetchSlots());
              show("Success");
            } else if (loading === "failed") {
              show("Failed");
            }
          });
        }}
        autoFocus
      />
    </div>
  );

  const updateTitle = (newTitle: string) => {
    setMessageGroups((prevMessageGroups) => {
      return prevMessageGroups.map((messageGroup) => {
        if (messageGroup.message?.imageResponseCard) {
          // Create a new object with an updated title
          return {
            ...messageGroup,
            message: {
              ...messageGroup.message,
              imageResponseCard: {
                ...messageGroup.message.imageResponseCard,
                title: newTitle,
              },
            },
          };
        }
        // If there's no imageResponseCard, return the original object
        return messageGroup;
      });
    });
  };
  if (messageGroups[0].message.customPayload) {
    // console.log(JSON.parse(messageGroups[0].message.customPayload?.value!));
  }

  return (
    <>
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
              defaultValue={data.slotName}
              onChange={(e) =>
                setSlotValues({
                  ...slotValues,
                  slotName: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.dialogRow}>
            <b className={styles.first}>Message</b>
            {/* IMPROVE */}
            {messageGroups && messageGroups.length > 0 && (
              <InputTextarea
                className={styles.second}
                defaultValue={
                  messageGroups[0].message!.imageResponseCard?.title
                }
                onChange={(e) => {
                  updateTitle(e.target.value);
                }}
              />
            )}
          </div>
          <div className={styles.dialogRow}>
            {/* CONDITION TO BE ADDED */}
            {/* <b className={styles.first}>Condition</b> */}
            {/* <InputTextarea
              className={styles.second}
              defaultValue={data.valueElicitationPromptSpecification.}
            /> */}
          </div>
        </div>
      </Dialog>
      <Accordion className={styles.accordian}>
        <AccordionTab
          // header={data.slotName}
          header={
            messageGroups[0].message.imageResponseCard === null
              ? messageGroups[0].message.plainTextMessage === null
                ? JSON.parse(messageGroups[0].message.customPayload?.value!)
                    .messages[1].content
                : messageGroups[0].message.plainTextMessage?.value
              : messageGroups[0].message.imageResponseCard?.title
          }
        >
          <div className={styles.actions}>
            <Button
              icon="pi pi-pencil"
              severity="warning"
              aria-label="Edit"
              onClick={() => {
                setSlotValues(data);
                setVisible(true);
              }}
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              aria-label="Delete"
              onClick={() => {
                dispatch(deleteSlot(data.slotId)).then(() => {
                  if (loading === "succeeded") {
                    show("success");
                    dispatch(fetchSlots());
                  } else if (loading === "failed") {
                    show("Failed");
                  }
                });
              }}
            />
          </div>
          {/* <p>
            <b>Slot Constraint</b> - {data.slotConstraint}
          </p> */}
          <p>
            <b>Question Id</b> - {data.slotId}
          </p>
          {/* <p>
            <b>Slot Type Id</b> - {data.slotTypeId}
          </p> */}
          {/* <p>
            <b>Message - </b>
            {messageGroups[0].message.imageResponseCard != null
              ? messageGroups[0].message.imageResponseCard.title
              : messageGroups[0].message.plainTextMessage?.value}
          </p> */}
          {messageGroups[0].message.imageResponseCard === null &&
          messageGroups[0].message.plainTextMessage === null
            ? Object.values(
                JSON.parse(messageGroups[0].message.customPayload?.value!)
                  .messages[0].content
              ).map((val: any) => (
                <>
                  <Button
                    label={val}
                    disabled
                    style={{
                      margin: "3px",
                    }}
                  />
                </>
              ))
            : ""}
          {messageGroups[0].message.plainTextMessage === null &&
          messageGroups[0].message.customPayload === null
            ? messageGroups[0].message.imageResponseCard?.buttons?.map(
                (val: any) => (
                  <>
                    <Button
                      label={val.value}
                      disabled
                      style={{
                        margin: "3px",
                      }}
                    />
                  </>
                )
              )
            : ""}
        </AccordionTab>
      </Accordion>
    </>
  );
};

export default SlotCard;
