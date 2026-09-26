import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const [,, prompt, outputPath] = process.argv;

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash-image',
  contents: `16-bit SNES top-down pixel art sprite: ${prompt}`,
});

const part = response.candidates[0].content.parts.find(p => p.inlineData);
if (!part) {
  throw new Error('No image data returned in response.');
}
const buffer = Buffer.from(part.inlineData.data, 'base64');
fs.writeFileSync(outputPath, buffer);
console.log(`Saved: ${outputPath}`);
