export interface DLQEvent {

    id: number;
  
    event_type: string;
  
    payload: string;
  
    error: string;
  
    retry_count: number;
  
    failed_at: number;
  }