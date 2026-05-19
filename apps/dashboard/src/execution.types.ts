export interface Execution {

    workflow_id: string;
  
    status: string;
  
    error: string | null;
  
    started_at: number;
  
    ended_at: number;
  }