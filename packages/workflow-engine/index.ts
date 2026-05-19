import { EventEmitter } from "events";
import { SystemEvent } from "../shared/index.ts";
import { executeAction } from "./actions.ts";
import { initDB } from "../memory/index.ts";
import { logger } from "../shared/logger";
import { v4 as uuid } from "uuid";
import { getWorkflows } from "./workflow.repository.ts";
import { addToDLQ } from "./dlq.service.ts";

class EventBus extends EventEmitter {
  private ready: Promise<void>;
  private queue: SystemEvent[] = [];
  private db: any;
  // private deadLetterQueue: SystemEvent[] = [];
  private MAX_RETRIES = 3;
  constructor() {
    super();
    this.ready = this.initialize();
  }

  private async initialize(): Promise<void> {
    this.db = await initDB();
    this.startWorker();
  }

  async emitEvent(event: SystemEvent) {
    await this.ready;
    logger.info(
      "EVENT_QUEUED",
      {
        eventType: event.type
      }
    );

    await this.db.run(
      `INSERT INTO event_logs (event_type, payload, timestamp) VALUES (?, ?, ?)`,
      event.type,
      JSON.stringify(event.payload),
      event.timestamp
    );

    this.queue.push(event);
  }

  private async processEvent(
    event: SystemEvent
  ) {
    logger.info(
      "PROCESSING_EVENT",
      {
        eventType: event.type
      }
    );
    // const matchedWorkflows = workflows.filter(
    //   workflow =>
    //     workflow.trigger === event.type
    // );
    const workflows =
      await getWorkflows();

    const matchedWorkflows =
      workflows.filter(
        workflow =>
          workflow.trigger ===
          event.type
      );

    for (const workflow of matchedWorkflows) {
      const executionContext = {

        executionId:
          uuid(),
      
        workflowId:
          workflow.id,
      
        eventType:
          event.type,
      
        startedAt:
          Date.now()
      };
      logger.info(
        "WORKFLOW_EXECUTION_STARTED",
        executionContext
      );
      console.log(
        `EVALUATING WORKFLOW: ${workflow.id}`
      );
      const executionStart = Date.now();
      const passedConditions = workflow.conditions.every(condition => {
        const value = event.payload[condition.field];
        if (typeof value !== "string") {
          return false;
        }
        return value.includes(
          condition.contains
        );
      });
      console.log(
        "CONDITIONS PASSED:",
        passedConditions
      );
    
      if (!passedConditions) continue;
      logger.info(
        "WORKFLOW_MATCHED",
        executionContext
      );

      try {

        for (const action of workflow.actions) {
      
          console.log(
            "STARTING ACTION EXECUTION"
          );
      
          await executeAction(
            action,
            event.payload
          );
        }
      
        await this.db.run(
          `
          INSERT INTO executions
          (
            workflow_id,
            status,
            error,
            started_at,
            ended_at
          )
      
          VALUES (?, ?, ?, ?, ?)
          `,
      
          workflow.id,
      
          "success",
      
          null,
      
          executionStart,
      
          Date.now()
        );
      
        logger.info(
          "EXECUTION_SUCCESS",
          {
            ...executionContext,
      
            duration:
              Date.now() -
              executionContext.startedAt
          }
        );
      
      } catch(error: any) {
      
        await this.db.run(
          `
          INSERT INTO executions
          (
            workflow_id,
            status,
            error,
            started_at,
            ended_at
          )
      
          VALUES (?, ?, ?, ?, ?)
          `,
      
          workflow.id,
      
          "failed",
      
          error.message,
      
          executionStart,
      
          Date.now()
        );
      
        logger.error(
          "WORKFLOW_EXECUTION_FAILED",
          {
            ...executionContext,
      
            errorMessage:
              error.message,
      
            retryable:
              error.retryable,
      
            code:
              error.code
          }
        );
      
        throw error;
      }
      
      await this.db.run(
        `INSERT INTO executions
         (
           workflow_id,
           status,
           error,
           started_at,
           ended_at
         )
      
         VALUES (?, ?, ?, ?, ?)`,
      
        workflow.id,
      
        "success",
      
        null,
      
        executionStart,
      
        Date.now()
      );
      
      logger.info(
        "EXECUTION_SUCCESS",
        {
          ...executionContext,
      
          duration:
            Date.now() -
            executionContext.startedAt
        }
      );
    }
  }

  private startWorker() {
    setInterval(async () => {
      const event = this.queue.shift();
      if (!event) return;
      
      try {
        await this.processEvent(event);
      } catch (error: any) {

          console.error(
            `EVENT FAILED: ${event.type}`
          );
        
          logger.error(
            "EVENT_PROCESSING_FAILED",
            {
              eventType: event.type,
        
              retryCount:
                event.retryCount,
        
              errorMessage:
                error.message,
        
              retryable:
                error.retryable,
        
              code:
                error.code
            }
          );
          
          const retryable =
            error?.retryable ?? true;
        
          if (!retryable) {
        
            console.log(
              `PERMANENT FAILURE:
              MOVING TO DLQ`
            );
        
            await addToDLQ(
              event,
              error
            );
        
            return;
          }
        
          event.retryCount = (event.retryCount || 0) + 1;
        
          logger.warn(
            "RETRYING_EVENT",
            {
              eventType: event.type,
              retryCount:
                event.retryCount
            }
          );
        
          if (
            event.retryCount >=
            this.MAX_RETRIES
          ) {
        
            logger.error(
              "EVENT_MOVED_TO_DLQ",
              {
                eventType: event.type,
                retryCount:
                  event.retryCount
              }
            );
        
            await addToDLQ(
              event,
              error
            );
        
          } else {
        
            console.log(
              `RETRYING EVENT:
              ${event.type}`
            );
        
            this.queue.push(event);
          }
      }
    }, 1000);
  }
}

export const eventBus = new EventBus();