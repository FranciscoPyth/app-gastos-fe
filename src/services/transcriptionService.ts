import axios from "axios";

const OPENAI_API_KEY = "TU_API_KEY"; // Sustituye con tu clave real

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");

  try {
    const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.text; // Retorna el texto transcrito
  } catch (error) {
    console.error("Error en la transcripción:", error);
    return null;
  }
};


export const processExpenseText = async (text) => {
    const prompt = `
      Extract the expense details from the following text:
      "${text}"
      
      Return the result as a JSON object with the fields:
      {
        "monto": number,
        "descripcion": string,
        "fecha": "YYYY-MM-DD",
        "categoria": string,
        "metodo_pago": string,
        "divisa": string
      }
    `;
  
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }, {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      });
  
      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error en la IA:", error);
      return null;
    }
  };
  