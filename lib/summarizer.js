import { callOpenAI } from './adapters';

export async function summarizeResponses(prompt, outputs){
  const combined = Object.entries(outputs).map(([k,v]) => `== ${k} ==\n${v.text}`).join('\n\n');
  const instruction = `You are a research assistant. Given the original prompt and multiple model answers, produce:\n1) A concise 3-5 sentence summary of the consensus.\n2) A short bullet list of key disagreements or differing facts.\n3) A compact "confidence" note about whether additional references are needed.\n4) A short list of found references (if any).\n\nPrompt:\n${prompt}\n\nAnswers:\n${combined}`;
  try{
    const out = await callOpenAI(instruction, { model: 'gpt-4.1-mini' });
    return out.text;
  }catch(e){
    return 'Summary unavailable: ' + String(e);
  }
}
