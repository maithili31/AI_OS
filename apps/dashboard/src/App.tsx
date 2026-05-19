import { useEffect, useState } from "react";
import axios from "axios";
import type { Workflow } from "./types";
import type { Execution } from "./execution.types";
import type { DLQEvent } from "./dlq.types";

export default function App() {

  const [command,
    setCommand] = useState("");
  
  const [plannedTask,
    setPlannedTask] = useState<
      any
    >(null);

  const [dlqEvents,
    setDLQEvents] = useState<
      DLQEvent[]
    >([]);

  const [executions,
    setExecutions] = useState<
      Execution[]
    >([]);

  const [workflows,
    setWorkflows] = useState<
      Workflow[]
    >([]);

  async function loadExecutions() {

      const response =
        await axios.get(
          "http://localhost:3000/executions"
        );
    
      setExecutions(
        response.data
      );
  }

  async function loadWorkflows() {

    const response =
      await axios.get(
        "http://localhost:3000/workflows"
      );

    setWorkflows(
      response.data
    );
  }

  async function loadDLQEvents() {

    const response =
      await axios.get(
        "http://localhost:3000/dlq"
      );
  
    setDLQEvents(
      response.data
    );
  }

  async function planCommand() {

    const response =
      await axios.post(
        "http://localhost:3000/agent/plan",
        {
          command
        }
      );
  
    setPlannedTask(
      response.data
    );
  }

  async function executeTask() {

    await axios.post(
      "http://localhost:3000/agent/execute",
      plannedTask
    );
  
    alert(
      "EMAIL SENT SUCCESSFULLY"
    );
  
    setPlannedTask(null);
  
    setCommand("");
  }

  useEffect(() => {
    loadDLQEvents();
    loadExecutions();
    loadWorkflows();

  }, []);

  async function deleteWorkflow(
    id: string
  ) {
  
    await axios.delete(
      `http://localhost:3000/workflows/${id}`
    );
  
    loadWorkflows();
  }

  async function disableWorkflow(
    id: string
  ) {
  
    await axios.patch(
      `http://localhost:3000/workflows/${id}/disable`
    );
  
    loadWorkflows();
  }

  async function enableWorkflow(
    id: string
  ) {
  
    await axios.patch(
      `http://localhost:3000/workflows/${id}/enable`
    );
  
    loadWorkflows();
  }

  const [trigger, setTrigger] = useState( "gmail.new_email");
  const [contains, setContains] = useState("@");
  const [actions, setActions] = useState("notify_user");

  async function createWorkflow() {
    await axios.post(
      "http://localhost:3000/workflows",
      {
        id:
          crypto.randomUUID(),
  
        trigger,
  
        conditions: [
          {
            field: "from",
            contains
          }
        ],
  
        actions:
          actions
            .split(",")
            .map(action =>
              action.trim()
            )
      }
    );
    loadWorkflows();
  }

  return (

    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif"
      }}
    >

      <h1>
        AI-OS Dashboard
      </h1>

      <div
        style={{
          marginBottom: "2rem",
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px"
        }}
      >

        <h2>
          Create Workflow
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
        >

          <input
            value={trigger}

            onChange={e =>
              setTrigger(
                e.target.value
              )
            }

            placeholder="Trigger"
          />

          <input
            value={contains}

            onChange={e =>
              setContains(
                e.target.value
              )
            }

            placeholder="Contains"
          />

          <input
            value={actions}

            onChange={e =>
              setActions(
                e.target.value
              )
            }

            placeholder="Actions"
          />

          <button
            onClick={
              createWorkflow
            }

            style={{
              padding: "0.75rem",
              cursor: "pointer"
            }}
          >

            Create Workflow
          </button>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "2rem"
        }}
      >

        <h2>
          AI Command Center
        </h2>

        <input
          value={command}

          onChange={e =>
            setCommand(
              e.target.value
            )
          }

          placeholder=
            "Tell AI-OS what to do..."

          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem"
          }}
        />

        <button
          onClick={planCommand}

          style={{
            padding: "0.75rem 1rem",
            cursor: "pointer"
          }}
        >

          Plan Task

        </button>

        {
          plannedTask && (

            <div
              style={{
                border:
                  "1px solid green",

                padding: "1rem",

                marginTop: "1rem",

                borderRadius: "8px"
              }}
            >

              <h3>
                Planned Action
              </h3>

              <p>
                Intent:
                {plannedTask.intent}
              </p>

              <p>
                Recipient:
                {
                  plannedTask.recipient
                }
              </p>

              <p>
                Subject:
                {
                  plannedTask.subject
                }
              </p>

              <p>
                Body:
              </p>

              <div
                style={{
                  whiteSpace:
                    "pre-wrap",

                  background:
                    "#f5f5f5",

                  padding: "1rem",

                  borderRadius: "8px"
                }}
              >

                {plannedTask.body}

              </div>

              <button

                onClick={executeTask}

                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 1rem",
                  cursor: "pointer"
                }}
              >

                Confirm Send

              </button>

            </div>
          )
        }

      </div>

      <h2>
        Workflows
      </h2>

      {
        workflows.map(
          workflow => (

          <div
            key={workflow.id}

            style={{
              border:
                "1px solid #ccc",

              padding: "1rem",

              marginBottom: "1rem",

              borderRadius: "8px"
            }}
          >

            <h3>
              {workflow.id}
            </h3>

            <p>
              Trigger:
              {workflow.trigger}
            </p>

            <p>
              Actions:
              {
                workflow.actions.join(", ")
              }
            </p>

            <p>
              Enabled:
              {
                workflow.enabled
                  ? "YES"
                  : "NO"
              }
              <button
                onClick={() =>
                  deleteWorkflow(workflow.id)
                }

                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  cursor: "pointer"
                }}
              >

                Delete

              </button>
              
              {
                workflow.enabled ? (

                  <button
                    onClick={() =>
                      disableWorkflow(
                        workflow.id
                      )
                    }

                    style={{
                      marginLeft: "1rem",
                      padding: "0.5rem 1rem",
                      cursor: "pointer"
                    }}
                  >

                    Disable

                  </button>

                ) : (

                  <button
                    onClick={() =>
                      enableWorkflow(
                        workflow.id
                      )
                    }

                    style={{
                      marginLeft: "1rem",
                      padding: "0.5rem 1rem",
                      cursor: "pointer"
                    }}
                  >

                    Enable

                  </button>
                )
              }
            </p>

              
          </div>
        ))
      }

      <h2>
        Executions
      </h2>

      {
        executions.map(
          (execution, index) => (

          <div
            key={index}

            style={{
              border:
                "1px solid #ccc",

              padding: "1rem",

              marginBottom: "1rem",

              borderRadius: "8px"
            }}
          >

            <h3>
              {execution.workflow_id}
            </h3>

            <p>
              Status:
              {execution.status}
            </p>

            <p>
              Error:
              {
                execution.error ||
                "NONE"
              }
            </p>

            <p>
              Started:
              {
                new Date(
                  execution.started_at
                ).toLocaleString()
              }
            </p>

            <p>
              Duration:
              {
                execution.ended_at -
                execution.started_at
              } ms
            </p>

          </div>
        ))
      }

      <h2>
        Dead Letter Queue
      </h2>

      {
        dlqEvents.map(event => (

          <div
            key={event.id}

            style={{
              border:
                "1px solid red",

              padding: "1rem",

              marginBottom: "1rem",

              borderRadius: "8px"
            }}
          >

            <h3>
              {event.event_type}
            </h3>

            <p>
              Error:
              {event.error}
            </p>

            <p>
              Retry Count:
              {event.retry_count}
            </p>

            <p>
              Failed At:
              {
                new Date(
                  event.failed_at
                ).toLocaleString()
              }
            </p>

          </div>
        ))
      }

    </div>
  );
}