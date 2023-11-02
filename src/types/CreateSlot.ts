export interface CreateSlot {
  slotName: string;
  slotTypeId: string;
  message: Message;
  condition: Condition;
}
export interface Message {
  customPayload?: null;
  imageResponseCard: ImageResponseCard;
  plainTextMessage?: null;
  ssmlMessage?: null;
}
export interface ImageResponseCard {
  buttons?: ButtonsEntity[] | null;
  imageUrl?: null;
  subtitle?: null;
  title: string;
}
export interface ButtonsEntity {
  text: string;
  value: string;
}
export interface Condition {
  expression: string;
  conditionName: string;
  actionType: string;
  slotToElicit: string;
  defaultBranch: DefaultBranch;
}
export interface DefaultBranch {
  actionType: string;
  slotToElicit: string;
}
