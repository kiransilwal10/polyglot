import { useState } from "react";
import { OpenAI } from "openai"; // Import OpenAI directly

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // API key from .env
  dangerouslyAllowBrowser: true, // Required for browser environments
});

function TranslatorForm() {
  const [text, setText] = useState("");
  const [Language, setLanguage] = useState("French");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) {
      alert("Please enter text to translate.");
      return;
    }

    setLoading(true);
    setTranslation("");

    try {
      // Call the chat/completions endpoint for gpt-3.5-turbo
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a translator that translates text into ${Language}.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      // Extract the translation from the response
      setTranslation(response.choices[0].message.content.trim());
    } catch (error) {
      console.error("Error during translation:", error);

      if (error.response && error.response.status === 429) {
        setTranslation("Rate limit exceeded. Please wait and try again.");
      } else if (error.response && error.response.status === 401) {
        setTranslation("Authentication error. Please check your API key.");
      } else {
        setTranslation("Translation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Translator</h1>
      <textarea
        className="w-full border border-gray-300 rounded p-2 mb-4"
        placeholder="Enter text to translate"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select
        className="w-full border border-gray-300 rounded p-2 mb-4"
        value={Language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="French">French</option>
        <option value="Spanish">Spanish</option>
        <option value="German">German</option>
        <option value="Chinese">Chinese</option>
      </select>
      <button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? "Translating..." : "Translate"}
      </button>
      {translation && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Translation:</h2>
          <p>{translation}</p>
        </div>
      )}
    </div>
  );
}

export default TranslatorForm;
