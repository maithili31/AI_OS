// import fs
// from "fs";

// import path
// from "path";

// import { google }
// from "googleapis";

// const TOKEN_PATH =
//   path.join(
//     process.cwd(),
//     "token.json"
//   );

// export class SendEmailTool {

//   async execute(
//     recipient: string,
//     subject: string,
//     body: string
//   ) {

//     const credentials =
//       JSON.parse(

//         fs.readFileSync(
//           TOKEN_PATH,
//           "utf-8"
//         )
//       );

//     const auth =
//       new google.auth.OAuth2();

//     auth.setCredentials(
//       credentials
//     );

//     const gmail =
//       google.gmail({
//         version: "v1",
//         auth
//       });

//     const message = [

//       `To: ${recipient}`,

//       `Subject: ${subject}`,

//       "",

//       body

//     ].join("\n");

//     const encodedMessage =
//       Buffer.from(message)

//       .toString("base64")

//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=+$/, "");

//     await gmail.users.messages.send({

//       userId: "me",

//       requestBody: {
//         raw: encodedMessage
//       }
//     });

//     console.log(
//       "EMAIL SENT SUCCESSFULLY"
//     );
//   }
// }

import fs from "fs";

import path from "path";

import { google } from "googleapis";

import { Tool } from "../shared/tool.ts";

const TOKEN_PATH = path.join(
  process.cwd(),
  "token.json"
);

const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "credentials.json"
);

export class SendEmailTool
  implements Tool {

  name = "send_email";

  description =
    "Send an email using Gmail";

  parameters = [

    {
      name: "recipient",

      type: "string",

      description:
        "Recipient email address",

      required: true
    },

    {
      name: "subject",

      type: "string",

      description:
        "Subject of the email",

      required: true
    },

    {
      name: "body",

      type: "string",

      description:
        "Body content of the email",

      required: true
    }
  ];

  async execute(
    params: any
  ) {

    const token = JSON.parse(

      fs.readFileSync(
        TOKEN_PATH,
        "utf-8"
      )
    );

    const credentials = JSON.parse(

      fs.readFileSync(
        CREDENTIALS_PATH,
        "utf-8"
      )
    );

    const {
      client_secret,
      client_id,
      redirect_uris
    } = credentials.installed;

    const auth =
      new google.auth.OAuth2(

        client_id,

        client_secret,

        redirect_uris[0]
      );

    auth.setCredentials(token);

    const gmail =
      google.gmail({

        version: "v1",

        auth
      });

    const message = [

      `To: ${params.recipient}`,

      `Subject: ${params.subject}`,

      "Content-Type: text/plain; charset=utf-8",

      "",

      params.body

    ].join("\n");

    const encodedMessage =
      Buffer.from(message)

        .toString("base64")

        .replace(/\+/g, "-")

        .replace(/\//g, "_")

        .replace(/=+$/, "");

    await gmail.users.messages.send({

      userId: "me",

      requestBody: {

        raw: encodedMessage
      }
    });

    console.log(
      "EMAIL SENT SUCCESSFULLY"
    );

    return {

      success: true,

      recipient:
        params.recipient,

      subject:
        params.subject
    };
  }
}