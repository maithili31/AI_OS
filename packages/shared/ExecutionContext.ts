export interface ExecutionContext {
    executionId: string;
    workflowId: string;
    eventType: string;
    startedAt: number;
  }