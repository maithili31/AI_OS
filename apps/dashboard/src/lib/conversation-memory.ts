export interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}
  
export interface ConversationState {
    activeIntent:string | null;
    entities:Record<string, any>;
    missingFields:string[];
    nextQuestion:string | null;
    awaitingResponse:boolean;
    messages:Message[];
    lastAction:string | null;
}
  
export class ConversationManager {  
    private state:ConversationState;
    private readonly maxMessageHistory = 20;
    constructor() {
      this.state = {
        activeIntent:null,
        entities:{},
        missingFields:[],
        nextQuestion:null,
        awaitingResponse:false,
        messages:[],
        lastAction:null
      };
    }
  
    getState() {
      return this.state;
    }
  
    addMessage(
      role:"user" | "assistant",
      content: string
    ){
        this.state.messages.push({
            role,
            content,
            timestamp:Date.now()
        });
  
        if (this.state.messages.length > this.maxMessageHistory){
            this.state.messages = this.state.messages.slice(this.maxMessageHistory);
        }
    }
  
    updateEntity(key: string,value: any){
      this.state.entities[key] = value;
    }
  
    setIntent(intent: string | null){
      this.state.activeIntent = intent;
    }
  
    setMissingFields(fields: string[]){
      this.state.missingFields = fields;
    }
  
    setNextQuestion(question: string | null){
      this.state.nextQuestion = question;
    }
  
    reset() { 
        this.state = {
            activeIntent:null,
            entities:{},
            missingFields:[],
            nextQuestion:null,
            awaitingResponse:false,
            messages:[],
            lastAction:null
        };
    }
}
  
export const conversationManager = new ConversationManager();