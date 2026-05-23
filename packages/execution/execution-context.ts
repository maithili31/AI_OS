export class ExecutionContext {
    private data:Record<string, any> = {};
  
    set(
      key: string,
      value: any
    ){
      this.data[key] =
        value;
    }
  
    get(
      key: string
    ){
      return this.data[key];
    }
  
    getAll() {
      return this.data;
    }

}
