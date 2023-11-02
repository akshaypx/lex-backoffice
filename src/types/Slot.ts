export interface Slot {
  $metadata: $metadata;
  botId: string;
  botVersion: string;
  intentId: string;
  localeId: string;
  slotSummaries?: SlotSummariesEntity[] | null;
}
export interface $metadata {
  httpStatusCode: number;
  requestId: string;
  attempts: number;
  totalRetryDelay: number;
}
export interface SlotSummariesEntity {
  slotConstraint: string;
  slotId: string;
  slotName: string;
  slotTypeId: string;
  valueElicitationPromptSpecification: ValueElicitationPromptSpecification;
}
export interface ValueElicitationPromptSpecification {
  allowInterrupt: boolean;
  maxRetries: number;
  messageGroups?: MessageGroupsEntity[] | null;
  messageSelectionStrategy: string;
  promptAttemptsSpecification: PromptAttemptsSpecification;
}
export interface MessageGroupsEntity {
  message: Message;
  variations?: null[] | null;
}
export interface Message {
  customPayload?: PlainTextMessageOrCustomPayload | null;
  imageResponseCard?: ImageResponseCard | null;
  plainTextMessage?: PlainTextMessageOrCustomPayload1 | null;
  ssmlMessage?: null;
}
export interface PlainTextMessageOrCustomPayload {
  value: string;
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
export interface PlainTextMessageOrCustomPayload1 {
  value: string;
}
export interface PromptAttemptsSpecification {
  Initial: InitialOrRetry1OrRetry2OrRetry3OrRetry4;
  Retry1: InitialOrRetry1OrRetry2OrRetry3OrRetry4;
  Retry2: InitialOrRetry1OrRetry2OrRetry3OrRetry4;
  Retry3: InitialOrRetry1OrRetry2OrRetry3OrRetry4;
  Retry4?: InitialOrRetry1OrRetry2OrRetry3OrRetry41 | null;
}
export interface InitialOrRetry1OrRetry2OrRetry3OrRetry4 {
  allowInterrupt: boolean;
  allowedInputTypes: AllowedInputTypes;
  audioAndDTMFInputSpecification: AudioAndDTMFInputSpecification;
  textInputSpecification: TextInputSpecification;
}
export interface AllowedInputTypes {
  allowAudioInput: boolean;
  allowDTMFInput: boolean;
}
export interface AudioAndDTMFInputSpecification {
  audioSpecification: AudioSpecification;
  dtmfSpecification: DtmfSpecification;
  startTimeoutMs: number;
}
export interface AudioSpecification {
  endTimeoutMs: number;
  maxLengthMs: number;
}
export interface DtmfSpecification {
  deletionCharacter: string;
  endCharacter: string;
  endTimeoutMs: number;
  maxLength: number;
}
export interface TextInputSpecification {
  startTimeoutMs: number;
}
export interface InitialOrRetry1OrRetry2OrRetry3OrRetry41 {
  allowInterrupt: boolean;
  allowedInputTypes: AllowedInputTypes;
  audioAndDTMFInputSpecification: AudioAndDTMFInputSpecification;
  textInputSpecification: TextInputSpecification;
}
