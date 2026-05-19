import fs from "fs";

import readline from "readline";

import { google } from "googleapis";

const SCOPES = [

  "https://www.googleapis.com/auth/gmail.readonly",

  "https://www.googleapis.com/auth/gmail.send"
];

const credentials = JSON.parse(

  fs.readFileSync(
    "credentials.json",
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

const authUrl =
  auth.generateAuthUrl({

    access_type: "offline",

    scope: SCOPES
  });

console.log(
  "AUTHORIZE HERE:"
);

console.log(authUrl);

const rl =
  readline.createInterface({

    input: process.stdin,

    output: process.stdout
  });

rl.question(
  "ENTER CODE: ",

  async code => {

    const { tokens } =
      await auth.getToken(code);

    fs.writeFileSync(

      "token.json",

      JSON.stringify(
        tokens,
        null,
        2
      )
    );

    console.log(
      "TOKEN SAVED"
    );

    rl.close();
  }
);