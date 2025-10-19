import { callGemini, callOpenAI, callAzureOpenAI } from '../../lib/adapters';
import { summarizeResponses } from '../../lib/summarizer';

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');
  const { prompt, providers } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  const outputs = {};
  const tasks = [];

  if (providers?.gemini) tasks.push(callGemini(prompt).then(r => outputs.gemini = r).catch(e => outputs.gemini = { error: String(e) }));
  if (providers?.openai) tasks.push(callOpenAI(prompt).then(r => outputs.openai = r).catch(e => outputs.openai = { error: String(e) }));
  if (providers?.azure) tasks.push(callAzureOpenAI(prompt).then(r => outputs.azure = r).catch(e => outputs.azure = { error: String(e) }));

  await Promise.all(tasks);

  let summary = '';
  try{ summary = await summarizeResponses(prompt, outputs); }catch(e){ summary = 'Summary failed: ' + String(e); }

  res.status(200).json({ prompt, outputs, summary, meta: { ts: new Date().toISOString() } });
}
