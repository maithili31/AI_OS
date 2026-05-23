export async function analyzeScreen(
    text: string
  ) {
  
    const prompt = `

        You are a desktop vision system.

        Analyze OCR text from a user's screen.

        Return ONLY valid JSON.

        DO NOT explain anything.
        DO NOT write notes.
        DO NOT use markdown.
        DO NOT add text before JSON.
        DO NOT add text after JSON.

        JSON FORMAT:

        {
        "applications": [],
        "active_window": "",
        "user_activity": "",
        "visible_actions": [],
        "errors": [],
        "summary": ""
        }

        OCR TEXT:

        ${text}
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
  
            model:
              "llama3:8b",
  
            prompt,
  
            stream: false,
  
            options: {
  
              temperature: 0.2
            }
          })
        }
      );
  
    const data =
      await response.json();

      const cleanedOutput =

      data.response
    
        .replace(
          /```json/g,
          ""
        )
    
        .replace(
          /```/g,
          ""
        )
    
        .trim();
    
    const match =
    
      cleanedOutput.match(
        /\{[\s\S]*\}/
      );
    
    if (!match) {
    
      throw new Error(
        "No JSON returned from screen analysis"
      );
    }
    
    return JSON.parse(
      match[0]
    );
  
    // return data.response;
  }