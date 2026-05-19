export async function planTask(
    command: string
  ) {
  
    const prompt = `
  You are an AI desktop assistant.
  
  Convert the user request into valid JSON.
  
  Supported intent:
  - send_email
  
  Return ONLY valid JSON.
  
  Example:
  
  {
    "intent": "send_email",
    "recipient": "test@gmail.com",
    "subject": "Hello",
    "body": "Testing"
  }
  
  User Request:
  ${command}
  `;
  
    const response =
      await fetch(
        "http://localhost:11434/api/generate",
        {
  
          method: "POST",
  
          headers: {
            "Content-Type":
              "application/json"
          },
  
          body: JSON.stringify({
  
            model: "llama3:8b",
  
            prompt,
  
            stream: false
          })
        }
      );
  
    const data =
      await response.json();
  
    console.log(
      "RAW MODEL OUTPUT:",
      data.response
    );
  
    return JSON.parse(
      data.response
    );
  }