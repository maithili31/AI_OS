import fs from "fs/promises";

import path from "path";

import process from "process";

import { authenticate }
from "@google-cloud/local-auth";

import { google }
from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly"
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

export async function authorize() {

  const content =
    await fs.readFile(
      CREDENTIALS_PATH,
      "utf-8"
    );

  const credentials =
    JSON.parse(content);

  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;

  const oauth2Client =
    new google.auth.OAuth2(

      client_id,

      client_secret,

      redirect_uris[0]
    );

  try {

    const token =
      await fs.readFile(
        TOKEN_PATH,
        "utf-8"
      );

    oauth2Client.setCredentials(
      JSON.parse(token)
    );

    console.log(
      "USING SAVED TOKEN"
    );

    return oauth2Client;

  } catch {

    const auth =
      await authenticate({

        scopes: SCOPES,

        keyfilePath:
          CREDENTIALS_PATH

      });

    const newToken =
      auth.credentials;

    await fs.writeFile(

      TOKEN_PATH,

      JSON.stringify(
        newToken
      )
    );

    console.log(
      "TOKEN SAVED"
    );

    oauth2Client.setCredentials(
      newToken
    );

    return oauth2Client;
  }
}