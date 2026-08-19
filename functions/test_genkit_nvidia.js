const { genkit } = require("genkit");
const { openAI } = require("genkitx-openai");

const ai = genkit({
  plugins: [
    openAI({
      apiKey: "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",
      baseURL: "https://integrate.api.nvidia.com/v1"
    })
  ]
});

async function main() {
  try {
    const response = await ai.generate({
      model: "openai/google/gemma-4-31b-it", // trying to pass literal model string via plugin
      prompt: "Hello"
    });
    console.log(response.text);
  } catch (e) {
    console.error("Failed:", e.message);
  }
}
main();
