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