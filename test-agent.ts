import { planTask }
from "./packages/agent/planner.ts";

async function run() {

  const result =
    await planTask(

`Send an email to rajeshmishra@iitism.ac.in
saying semester fees payment is done`
    );

  console.log(result);
}

run();