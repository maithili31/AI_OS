import fs from "fs";

import path from "path";

import readline from "readline";

import { google }
from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send"
];

const TOKEN_PATH =
  path.join(
    process.cwd(),
    "token.json"
  );

const CREDENTIALS_PATH =
  path.join(
    process.cwd(),
    "credentials.json"
  );

const credentials =
  JSON.parse(

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

const authUrl =
  auth.generateAuthUrl({

    access_type:
      "offline",

    scope:
      SCOPES,

    prompt:
      "consent"
  });

console.log(
  "\nOPEN THIS URL IN BROWSER:\n"
);

console.log(
  authUrl
);

console.log(
  "\nPASTE AUTH CODE BELOW:\n"
);

const rl =
  readline.createInterface({

    input:
      process.stdin,

    output:
      process.stdout
  });

rl.question(
  "CODE: ",

  async (code) => {

    try {

      const {
        tokens
      } = await auth.getToken(
        code
      );

      auth.setCredentials(
        tokens
      );

      fs.writeFileSync(

        TOKEN_PATH,

        JSON.stringify(
          tokens,
          null,
          2
        )
      );

      console.log(
        "\nTOKEN SAVED SUCCESSFULLY"
      );

      console.log(
        `\nSaved at:
${TOKEN_PATH}`
      );

    } catch (error) {

      console.error(
        "\nAUTH FAILED:\n",
        error
      );
    }

    rl.close();
  }
);