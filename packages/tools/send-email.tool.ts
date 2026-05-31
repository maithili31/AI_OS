import fs from "fs";
import path from "path";
import mime from "mime-types";
import { google } from "googleapis";
import { Tool } from "../shared/tool.ts";

const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

export class SendEmailTool implements Tool {
  name = "send_email";
  description = "Send emails with support for CC, BCC, HTML, and attachments";

  parameters = [
    {
      name: "recipient",
      type: "string",
      description: "Recipient email",
      required: true
    },
    {
      name: "subject",
      type: "string",
      description: "Email subject",
      required: true
    },
    {
      name: "body",
      type: "string",
      description: "Email body",
      required: true
    },
    {
      name: "cc",
      type: "string",
      description: "CC recipients",
      required: false
    },
    {
      name: "bcc",
      type: "string",
      description: "BCC recipients",
      required: false
    },
    {
      name: "attachments",
      type: "array",
      description: "File attachment paths",
      required: false
    },
    {
      name: "html",
      type: "boolean",
      description: "Send as HTML email",
      required: false
    }
  ];

  async getGmailClient() {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const auth = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    auth.setCredentials(token);

    return google.gmail({ version: "v1", auth });
  }

  buildMessage(params: any) {
    const boundary = "AI_OS_BOUNDARY";
    const lines: string[] = [];

    lines.push(`To: ${params.recipient}`);
    if (params.cc) lines.push(`Cc: ${params.cc}`);
    if (params.bcc) lines.push(`Bcc: ${params.bcc}`);
    lines.push(`Subject: ${params.subject}`);
    lines.push("MIME-Version: 1.0");

    const contentType = params.html ? "text/html" : "text/plain";

    if (params.attachments && params.attachments.length > 0) {
      lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`, "");
      
      // Add Body section
      lines.push(`--${boundary}`);
      lines.push(`Content-Type: ${contentType}; charset="UTF-8"`, "");
      lines.push(params.body, "");

      // Add Attachments sections
      for (const attachmentPath of params.attachments) {
        if (!fs.existsSync(attachmentPath)) {
          console.log("ATTACHMENT NOT FOUND:", attachmentPath);
          continue;
        }

        const filename = path.basename(attachmentPath);
        const mimeType = mime.lookup(attachmentPath) || "application/octet-stream";
        const attachmentData = fs.readFileSync(attachmentPath).toString("base64");

        lines.push(`--${boundary}`);
        lines.push(`Content-Type: ${mimeType}; name="${filename}"`);
        lines.push("Content-Transfer-Encoding: base64");
        lines.push(`Content-Disposition: attachment; filename="${filename}"`, "");
        lines.push(attachmentData, "");
      }

      lines.push(`--${boundary}--`);
    } else {
      // Direct message with no attachments
      lines.push(`Content-Type: ${contentType}; charset="UTF-8"`, "");
      lines.push(params.body);
    }

    return lines.join("\n");
  }

  async execute(params: any) {
    if (!params.recipient) throw new Error("Recipient missing");
    if (!params.subject) throw new Error("Subject missing");
    if (!params.body) throw new Error("Body missing");

    console.log("SENDING EMAIL TO:", params.recipient);

    const gmail = await this.getGmailClient();
    const message = this.buildMessage(params);
    
    // Base64url encoding standard for Gmail API
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage
      }
    });

    console.log("EMAIL SENT SUCCESSFULLY");

    return {
      success: true,
      id: response.data.id,
      recipient: params.recipient,
      subject: params.subject
    };
  }
}

export const sendEmailTool = new SendEmailTool();