import { listDLQEvents } from "../../workflow-engine/dlq.service.ts";
  
export async function getDLQEvents(
    req: any,
    res: any
) { 
    const events =
        await listDLQEvents();
  
    res.json(events);
 }