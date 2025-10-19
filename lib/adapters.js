import axios from 'axios';

export async function callOpenAI(prompt, opts = {}){
  const start = Date.now();
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
  const url = 'https://api.openai.com/v1/chat/completions';
  const body = {
    model: opts.model || 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 700
  };
  const headers = { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' };
  const r = await axios.post(url, body, { headers, timeout: 120000 });
  const latency = Date.now() - start;
  const text = r?.data?.choices?.[0]?.message?.content || JSON.stringify(r.data);
  return { text, raw: r.data, latency_ms: latency, references: [] };
}

export async function callGemini(prompt, opts = {}){
  const start = Date.now();
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=${process.env.GEMINI_API_KEY}`;
  const body = { prompt: { text: prompt }, maxOutputTokens: 700 };
  const r = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' }, timeout: 120000 });
  const latency = Date.now() - start;
  const text = r?.data?.candidates?.[0]?.content || JSON.stringify(r.data);
  const references = [];
  return { text, raw: r.data, latency_ms: latency, references };
}

export async function callAzureOpenAI(prompt, opts = {}){
  const start = Date.now();
  if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY || !process.env.AZURE_OPENAI_DEPLOYMENT) throw new Error('Azure OpenAI env missing');
  const url = `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-10-01`;
  const body = { messages: [{ role: 'user', content: prompt }], max_tokens: 700 };
  const headers = { 'api-key': process.env.AZURE_OPENAI_API_KEY, 'Content-Type': 'application/json' };
  const r = await axios.post(url, body, { headers, timeout: 120000 });
  const latency = Date.now() - start;
  const text = r?.data?.choices?.[0]?.message?.content || JSON.stringify(r.data);
  return { text, raw: r.data, latency_ms: latency, references: [] };
}
