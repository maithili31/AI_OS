import { useEffect, useState } from "react";
import axios from "axios";
import type { Workflow } from "./types";
import type { Execution } from "./execution.types";
import type { DLQEvent } from "./dlq.types";
import { Mic } from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function App() {
  const [command, setCommand] = useState("");
  const [plannedTask, setPlannedTask] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [dlqEvents, setDLQEvents] = useState<DLQEvent[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  const [trigger, setTrigger] = useState("gmail.new_email");
  const [contains, setContains] = useState("@");
  const [actions, setActions] = useState("notify_user");
  const [isListening, setIsListening] = useState(false);
  const [wakeMode, setWakeMode] = useState(false);
  const [micBusy, setMicBusy] = useState(false);

  const startVoiceRecognition = () => {
    
    setMicBusy(true);
    speechSynthesis.cancel();
    const SpeechRecognition =
  
      window.SpeechRecognition ||
  
      window.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
  
      alert(
        "Speech Recognition not supported in this browser"
      );
  
      return;
    }
  
    const recognition =
      new SpeechRecognition();
  
    recognition.lang =
      "en-US";
  
    recognition.continuous =
      false;
  
    recognition.interimResults =
      false;
  
    recognition.onstart =
      () => {
  
        console.log(
          "VOICE LISTENING..."
        );
  
        setIsListening(true);
      };
  
    recognition.onresult =
      async (event: any) => {
  
    let transcript = event.results[0][0].transcript;

    /*
    =========================================
    VOICE NORMALIZATION
    =========================================
    */

    transcript =
      transcript
        .replace(
          /\bat the rate\b/gi,
          "@"
        )

        .replace(
          /\battherate\b/gi,
          "@"
        )

        .replace(
          /\bdot\b/gi,
          "."
        )

        .replace(
          /\bunderscore\b/gi,
          "_"
        )

        .replace(
          /\bdash\b/gi,
          "-"
        )

        .replace(
          /\bhyphen\b/gi,
          "-"
        )

        .replace(
          /\s*@\s*/g,
          "@"
        )

        .replace(
          /\s*\.\s*/g,
          "."
        )

        /*
        =========================================
        FIX SPACES BEFORE EMAIL NUMBERS
        =========================================
        */

        .replace(
          /\s+(?=\d+@)/g,
          ""
        )

        .trim();

    /*
    =========================================
    LOWERCASE EMAILS
    =========================================
    */

    if (
      transcript.includes("@")
    ) {

      transcript =
        transcript.toLowerCase();
    }

    console.log(
      "VOICE COMMAND:",
      transcript
    );

    setCommand(
      transcript
    );
  
        /*
        =========================================
        UPDATE INPUT
        =========================================
        */
  
        setCommand(
          transcript
        );
  
        try {
  
          /*
          =========================================
          AUTO PLAN
          =========================================
          */
  
          const response =
  
            await axios.post(
  
              "http://localhost:3000/agent/plan",
  
              {
                command:
                  transcript
              }
            );
  
          setPlannedTask(
            response.data
          );
  
          /*
          =========================================
          AUTO EXECUTE
          =========================================
          */
  
          const executionResponse =
  
            await axios.post(
  
              "http://localhost:3000/agent/execute",
  
              response.data
            );
  
          setExecutionResult(
            executionResponse.data
          );
  
          /*
          =========================================
          SUCCESS VOICE
          =========================================
          */
  
          const utterance =
  
            new SpeechSynthesisUtterance(
              "Task completed successfully"
            );
  
          speechSynthesis.speak(
            utterance
          );
  
          loadExecutions();
  
        } catch (error) {
  
          console.error(
            error
          );
  
          const utterance =
  
            new SpeechSynthesisUtterance(
              "Task failed"
            );
  
          speechSynthesis.speak(
            utterance
          );
        }
      };
  
    recognition.onerror =
      (event: any) => {
  
        console.error(
          "VOICE ERROR:",
          event
        );
  
        setIsListening(false);
      };
  
      recognition.onend =
      () => {
    
        console.log(
          "VOICE STOPPED"
        );
    
        setIsListening(false);
    
        setMicBusy(false);
    
        /*
        =========================================
        RESTART WAKE MODE
        =========================================
        */
    
        setTimeout(
          () => {
    
            startWakeWordDetection();
    
          },
          2000
        );
      };
  
    recognition.start();
  };
  
  /*
  =========================================
  WAKE WORD DETECTION
  =========================================
  */
  
  const startWakeWordDetection = () => {

    /*
    =========================================
    PREVENT DUPLICATE LISTENERS
    =========================================
    */
    if (micBusy) {
      return;
    }
  
    if (
      wakeMode ||
      isListening
    ) {
  
      return;
    }
  
    const SpeechRecognition =
  
      window.SpeechRecognition ||
  
      window.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
  
      console.error(
        "Speech recognition unsupported"
      );
  
      return;
    }
  
    const recognition =
      new SpeechRecognition();
  
    recognition.continuous =
      true;
  
    recognition.interimResults =
      false;
  
    recognition.lang =
      "en-US";
  
    recognition.maxAlternatives =
      1;
  
    recognition.onstart =
      () => {
  
        console.log(
          "WAKE WORD ACTIVE"
        );
  
        setWakeMode(true);
      };
  
    recognition.onresult =
      (event: any) => {
  
        const transcript =
  
          event.results[
            event.results.length - 1
          ][0].transcript
            .toLowerCase();
  
        console.log(
          "HEARD:",
          transcript
        );
  
        /*
        =========================================
        WAKE WORD
        =========================================
        */
  
        if (
  
          transcript.includes(
            "hey siri"
          ) ||
  
          transcript.includes(
            "hey shree"
          )
        ) {
  
          console.log(
            "WAKE WORD DETECTED"
          );
          setMicBusy(true);
          recognition.stop();
  
          setWakeMode(false);
  
          /*
          =========================================
          DELAY SPEECH
          =========================================
          */
  
          setTimeout(
            () => {
  
              speechSynthesis.cancel();
  
              const utterance =
  
                new SpeechSynthesisUtterance(
                  "Yes?"
                );
  
              speechSynthesis.speak(
                utterance
              );
  
            },
            500
          );
  
          /*
          =========================================
          START COMMAND MODE
          =========================================
          */
  
          setTimeout(
            () => {
  
              startVoiceRecognition();
  
            },
            2000
          );
        }
      };
  
    recognition.onerror =
      (event: any) => {
  
        console.error(
          "WAKE ERROR:",
          event.error
        );
  
        setWakeMode(false);
      };
  
      recognition.onend =
      () => {
    
        console.log(
          "WAKE DETECTION STOPPED"
        );
    
        setWakeMode(false);
    
      };
  
    recognition.start();
  };

  async function loadExecutions() {
    const response = await axios.get("http://localhost:3000/executions");
    setExecutions(response.data);
  }

  async function loadWorkflows() {
    const response = await axios.get("http://localhost:3000/workflows");
    setWorkflows(response.data);
  }

  async function loadDLQEvents() {
    const response = await axios.get("http://localhost:3000/dlq");
    setDLQEvents(response.data);
  }

  async function planCommand() {
    const response = await axios.post("http://localhost:3000/agent/plan", {
      command,
    });
    setPlannedTask(response.data);
    setExecutionResult(null);
  }

  async function executeTask() {
    const response = await axios.post(
      "http://localhost:3000/agent/execute",
      plannedTask
    );
    setExecutionResult(response.data);
    alert("PLAN EXECUTED SUCCESSFULLY");
    setPlannedTask(null);
    setCommand("");
    loadExecutions();
  }

  useEffect(() => {

    loadDLQEvents();
  
    loadExecutions();
  
    loadWorkflows();
  
    const timeout =
      setTimeout(
        () => {
          startWakeWordDetection();
        },
        2500
      );
  
    
    return () =>
      clearTimeout(
        timeout
      );
  
  }, []);

  async function deleteWorkflow(id: string) {
    await axios.delete(`http://localhost:3000/workflows/${id}`);
    loadWorkflows();
  }

  async function disableWorkflow(id: string) {
    await axios.patch(`http://localhost:3000/workflows/${id}/disable`);
    loadWorkflows();
  }

  async function enableWorkflow(id: string) {
    await axios.patch(`http://localhost:3000/workflows/${id}/enable`);
    loadWorkflows();
  }

  async function createWorkflow() {
    await axios.post("http://localhost:3000/workflows", {
      id: crypto.randomUUID(),
      trigger,
      conditions: [
        {
          field: "from",
          contains,
        },
      ],
      actions: actions.split(",").map((action) => action.trim()),
    });
    loadWorkflows();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans pb-16">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-blue-600 shadow-sm shadow-blue-500/20 flex items-center justify-center text-white font-bold text-sm tracking-tighter">AI</div>
            <span className="text-lg font-semibold tracking-tight text-slate-900">AI-OS Dashboard</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 gap-8">
        
        {/* Section 1: AI Command Center */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">AI Command Center</h2>
            <p className="text-sm text-slate-500 mt-0.5">Draft or process declarative execution parameters across the cluster architecture context dynamically.</p>
            <div className="mt-3 flex items-center gap-2">
              <div
                className={`
                  h-2.5
                  w-2.5
                  rounded-full
                  ${wakeMode
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-slate-300"
                  }
                `}
              />

              <span className="text-xs font-medium text-slate-500">

                {wakeMode
                  ? "Wake word active"
                  : "Wake word inactive"
                }
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">

              <input
                value={command}
                onChange={(e) =>
                  setCommand(
                    e.target.value
                  )
                }
                placeholder="Tell AI-OS what to do..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 outline-hidden transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
              />

              <button
                onClick={
                  startVoiceRecognition
                }
                className="
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-900
                  p-3
                  text-white
                  shadow-xs
                  transition
                  hover:bg-slate-800
                  hover:scale-105
                  active:scale-95
                  cursor-pointer
                "
              >
                <Mic size={20} />
              </button>

            </div>

            {/* <div className="flex justify-start"></div> */}
            <div className="flex items-center gap-3">

              <button
                onClick={planCommand}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-xs
                  transition
                  duration-200
                  hover:bg-blue-700
                  hover:shadow-md
                  active:scale-[0.98]
                  cursor-pointer
                "
              >
                Generate Execution Plan
              </button>
            </div>
          </div>

          {/* AI Plan Stage Reveal Block */}
          {plannedTask?.steps && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/30 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-md font-bold text-amber-900 mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Proposed Pipeline Execution Steps
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plannedTask.steps.map((step: any, index: number) => (
                  <div key={index} className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Step {index + 1}</span>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{step.intent}</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      {Object.entries(step)
                        .filter(([key]) => key !== "intent")
                        .map(([key, value]) => (
                          <p key={key} className="truncate">
                            <strong className="text-slate-700 font-medium">{key}:</strong>{" "}
                            <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded-sm font-mono text-[11px]">
                              {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </code>
                          </p>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-amber-200/60 flex justify-center">
                {executionResult ? (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-emerald-600
                      px-6
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-xs
                    "
                  >
                    ✅ Task Executed Successfully
                  </div>

                ) : (

                  <button
                    onClick={executeTask}
                    className="
                      w-full
                      sm:w-auto
                      inline-flex
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-600
                      px-6
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-xs
                      transition
                      duration-200
                      hover:bg-emerald-700
                      hover:shadow-md
                      active:scale-[0.98]
                      cursor-pointer
                    "
                  >
                    Execute Plan
                  </button>

                )}

              </div>
            </div>
          )}

          {/* Execution Output Render Log */}
          {executionResult && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 font-mono animate-in fade-in duration-300">
              <h3 className="text-sm font-bold text-emerald-900 mb-2">Pipeline Callback Payload Output</h3>
              <pre className="max-h-60 overflow-y-auto rounded-lg bg-slate-900 p-4 text-xs text-emerald-400 shadow-inner scrollbar-thin">
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          )}
        </section>

        {/* Section 2: Interactive Engine Configuration Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Create Workflow Form Block */}
          <section className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Create Workflow</h2>
              <p className="text-sm text-slate-500 mt-0.5">Wire declarative edge routes.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Trigger Entity</label>
                <input
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder="Trigger"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Evaluation Match (Contains)</label>
                <input
                  value={contains}
                  onChange={(e) => setContains(e.target.value)}
                  placeholder="Contains"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Downstream Callbacks (Comma Separated)</label>
                <input
                  value={actions}
                  onChange={(e) => setActions(e.target.value)}
                  placeholder="Actions"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <button
                onClick={createWorkflow}
                className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition duration-150 hover:bg-slate-800 active:scale-[0.99] cursor-pointer"
              >
                Create Workflow
              </button>
            </div>
          </section>

          {/* Active Router State Workspace List */}
          <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Workflows ({workflows.length})</h2>
              <p className="text-sm text-slate-500 mt-0.5">Active conditional mappings monitored by cluster execution worker loops.</p>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {workflows.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl text-sm text-slate-400">No active orchestrations found. Create one to begin tracking.</div>
              ) : (
                workflows.map((workflow) => (
                  <div key={workflow.id} className="group relative rounded-xl border border-slate-200 p-4 transition duration-150 hover:border-slate-300 hover:bg-slate-50/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm max-w-[180px] truncate">{workflow.id}</code>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            workflow.enabled 
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" 
                              : "bg-slate-100 text-slate-600 ring-slate-500/10"
                          }`}>
                            {workflow.enabled ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          <p className="text-slate-600"><span className="text-xs font-semibold text-slate-400 inline-block w-14">Trigger:</span> {workflow.trigger}</p>
                          <p className="text-slate-600"><span className="text-xs font-semibold text-slate-400 inline-block w-14">Actions:</span> 
                            <span className="font-mono text-xs bg-slate-100/80 text-slate-700 px-1 py-0.5 ml-1 rounded-sm">{workflow.actions.join(", ")}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0 self-end sm:self-center">
                        {workflow.enabled ? (
                          <button
                            onClick={() => disableWorkflow(workflow.id)}
                            className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs ring-1 ring-inset ring-slate-200 transition hover:bg-slate-50 cursor-pointer"
                          >
                            Disable
                          </button>
                        ) : (
                          <button
                            onClick={() => enableWorkflow(workflow.id)}
                            className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-700 cursor-pointer"
                          >
                            Enable
                          </button>
                        )}
                        <button
                          onClick={() => deleteWorkflow(workflow.id)}
                          className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-rose-600 shadow-2xs ring-1 ring-inset ring-rose-200 transition hover:bg-rose-50/60 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Section 3: Telemetry Stream Execution Real-Time Monitor */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Recent Pipeline Executions</h2>
            <p className="text-sm text-slate-500 mt-0.5">Real-time status tracking logs across integrated task executors.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Target Workflow Hook ID</th>
                  <th className="p-4">Runtime Status</th>
                  <th className="p-4">Callback Intercept Errors</th>
                  <th className="p-4">Initialization Stamp</th>
                  <th className="p-4 text-right">Delta Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {executions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">No recent pipeline runtime traces inside the active cluster.</td>
                  </tr>
                ) : (
                  executions.map((execution, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-mono text-xs font-semibold text-slate-600">{execution.workflow_id}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                          execution.status === "COMPLETED" || execution.status === "success"
                            ? "bg-emerald-50 text-emerald-700"
                            : execution.status === "FAILED" || execution.status === "failed"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            execution.status === "COMPLETED" || execution.status === "success" ? "bg-emerald-500" : "bg-rose-500"
                          }`} />
                          {execution.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono">
                        {execution.error && execution.error !== "NONE" ? (
                          <span className="text-rose-600 bg-rose-50/50 px-1.5 py-0.5 rounded-sm border border-rose-100">{execution.error}</span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-slate-500">{new Date(execution.started_at).toLocaleString()}</td>
                      <td className="p-4 text-right font-mono text-xs font-medium text-slate-700">
                        {execution.ended_at - execution.started_at} ms
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Dead Letter Queue (DLQ) Alert Traces */}
        <section className="rounded-2xl border border-rose-200 bg-white p-6 shadow-xs transition hover:shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight text-rose-900 flex items-center gap-2">
              <span>Dead Letter Queue</span>
              {dlqEvents.length > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-700 animate-pulse">
                  {dlqEvents.length}
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">Asynchronous event message buffers that exhausted their circuit-breaker retry threshold constraints.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
            {dlqEvents.length === 0 ? (
              <div className="md:col-span-2 text-center py-10 border border-dashed border-slate-200 rounded-xl text-sm text-slate-400">
                Excellent. System health optimal. DLQ contains zero crashed ingestion streams.
              </div>
            ) : (
              dlqEvents.map((event) => (
                <div key={event.id} className="rounded-xl border border-rose-100 bg-rose-50/20 p-4 transition hover:bg-rose-50/40">
                  <div className="flex items-center justify-between border-b border-rose-100/60 pb-2 mb-3">
                    <span className="font-mono text-xs font-bold text-rose-900">{event.event_type}</span>
                    <span className="inline-flex items-center rounded-md bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-800">
                      Retries: {event.retry_count}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="text-rose-700 font-mono text-[11px] bg-rose-50 p-2 rounded-md border border-rose-100/50 break-all">
                      <strong className="font-semibold uppercase tracking-wider text-[10px] text-rose-800 block mb-0.5">Failure Diagnostic:</strong>
                      {event.error}
                    </p>
                    <p className="text-slate-400 pt-1">
                      <span className="font-medium text-slate-500">Dropped From Topology:</span> {new Date(event.failed_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}