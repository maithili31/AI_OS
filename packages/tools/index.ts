// import { SendEmailTool } from "./send-email.tool.ts";
  
// export interface Tool {
//     name: string;
//     description: string;  
//     execute(input: any): Promise<any>;
// }

// export const sendEmailTool = new SendEmailTool();

export interface Tool {

    name: string;
  
    description: string;
  
    parameters?: {
  
      name: string;
  
      type: string;
  
      description: string;
  
      required: boolean;
  
    }[];
  
    execute(
      input: any
    ): Promise<any>;
  }