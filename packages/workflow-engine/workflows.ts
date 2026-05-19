import { Workflow } from "../shared/index.ts";

export const workflows: Workflow[] = [

  {
    id: "1",

    trigger: "gmail.new_email",

    conditions: [
      {
        field: "from",
        contains: "google"
      }
    ],

    actions: [
      "notify_user",
      "save_email",
      "summarize_email"
    ]
  }

];