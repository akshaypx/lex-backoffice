export interface IntentMetrics {
  $metadata: $metadata;
  botId: string;
  results?: ResultsEntity[] | null;
}
export interface $metadata {
  httpStatusCode: number;
  requestId: string;
  attempts: number;
  totalRetryDelay: number;
}
export interface ResultsEntity {
  metricsResults?: MetricsResultsEntity[] | null;
}
export interface MetricsResultsEntity {
  name: string;
  statistic: string;
  value: number;
}
