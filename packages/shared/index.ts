export interface SystemEvent {
    type: string;
    payload: any;
    timestamp: number;
    retryCount?: number;
}

export interface WorkflowCondition {
    field: string;
    contains: string;
  }
  
export interface Workflow {
    id: string;
    trigger: string;
    conditions: WorkflowCondition[];
    actions: string[];
  }

export * from "./errors";

export * from "./logger";

export * from "./ExecutionContext";