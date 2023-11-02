export interface UtteranceAnalytics {
  $metadata: $metadata;
  botId: string;
  nextToken: string;
  utterances?: UtterancesEntity[] | null;
}
export interface $metadata {
  httpStatusCode: number;
  requestId: string;
  attempts: number;
  totalRetryDelay: number;
}
export interface UtterancesEntity {
  associatedIntentName: string;
  associatedSlotName?: string | null;
  botAliasId: string;
  botResponseAudioVoiceId: string;
  botResponses?: BotResponsesEntity[] | null;
  botVersion: string;
  channel: string;
  conversationEndTime: string;
  conversationStartTime: string;
  dialogActionType: string;
  inputType: string;
  intentState: string;
  localeId: string;
  mode: string;
  outputType: string;
  sessionId: string;
  slotsFilledInSession: string;
  utterance: string;
  utteranceRequestId: string;
  utteranceTimestamp: string;
  utteranceUnderstood: boolean;
}
export interface BotResponsesEntity {
  content?: string | null;
  contentType: string;
  imageResponseCard?: ImageResponseCard | null;
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
