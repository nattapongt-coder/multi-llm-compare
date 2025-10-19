import React, { useState } from 'react';
import ProviderColumn from '../components/ProviderColumn';
import ComparisonMatrix from '../components/ComparisonMatrix';

export default function Home(){
  const [prompt, setPrompt] = useState('');
  const [providers, setProviders] = useState({ gemini: true, openai: true, azure: true });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function submit(e){
    e.preventDefault();
    setError(null); setResult(null); setLoading(true);
    try{
      const r = await fetch('/api/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, providers }) });
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(txt || 'Request failed');
      }
      const data = await r.json();
      setResult(data);
    }catch(err){ setError(String(err)); }
    setLoading(false);
  }

  return (
    <div style={{fontFamily:'Inter,system-ui',padding:24,background:'#f7fafc',minHeight:'100vh'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <header style={{marginBottom:20}}>
          <h1 style={{fontSize:28,fontWeight:700}}>Multi-LLM Comparator — Research Mode</h1>
          <p style={{color:'#4a5568'}}>Side-by-side comparison, automated summary, and reference extraction.</p>
        </header>

        <form onSubmit={submit} style={{background:'#fff',padding:18,borderRadius:12,boxShadow:'0 1px 3px rgba(0,0,0,0.08)',marginBottom:16}}>
          <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:8}}>Prompt</label>
          <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Enter your prompt..." required
            style={{width:'100%',minHeight:140,padding:12,borderRadius:8,border:'1px solid #e2e8f0'}} />

          <div style={{display:'flex',gap:12,alignItems:'center',marginTop:12}}>
            <label><input type="checkbox" checked={providers.gemini} onChange={()=>setProviders(p=>({...p,gemini:!p.gemini}))} /> Gemini</label>
            <label><input type="checkbox" checked={providers.openai} onChange={()=>setProviders(p=>({...p,openai:!p.openai}))} /> ChatGPT / OpenAI</label>
            <label><input type="checkbox" checked={providers.azure} onChange={()=>setProviders(p=>({...p,azure:!p.azure}))} /> Azure OpenAI (Copilot)</label>
            <button type="submit" disabled={loading} style={{marginLeft:'auto',background:'#2563eb',color:'#fff',padding:'8px 14px',borderRadius:8,border:'none'}}>Run</button>
          </div>
        </form>

        {loading && (<div style={{padding:12,background:'#fff7ed',borderRadius:8}}>Querying providers — please wait...</div>)}
        {error && (<div style={{padding:12,background:'#fff1f2',borderRadius:8,color:'#b91c1c'}}>{error}</div>)}

        {result && (
          <div style={{display:'grid',gap:18}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              <ProviderColumn name="Gemini" data={result.outputs?.gemini} />
              <ProviderColumn name="ChatGPT" data={result.outputs?.openai} />
              <ProviderColumn name="Copilot (Azure)" data={result.outputs?.azure} />
            </div>

            <section style={{background:'#fff',padding:16,borderRadius:10}}>
              <h2 style={{fontWeight:700}}>Auto Summary</h2>
              <div style={{marginTop:8,whiteSpace:'pre-wrap'}}>{result.summary}</div>
            </section>

            <section style={{background:'#fff',padding:16,borderRadius:10}}>
              <h2 style={{fontWeight:700}}>Comparison Matrix</h2>
              <ComparisonMatrix outputs={result.outputs} />
            </section>

            <section style={{background:'#fff',padding:16,borderRadius:10}}>
              <h2 style={{fontWeight:700}}>Raw JSON</h2>
              <pre style={{maxHeight:300,overflow:'auto',background:'#f1f5f9',padding:12,borderRadius:8}}>{JSON.stringify(result,null,2)}</pre>
            </section>
          </div>
        )}

        <footer style={{marginTop:18,color:'#6b7280',fontSize:12}}>Note: Provider outputs may hallucinate references. For reliable citations use a RAG retrieval layer.</footer>
      </div>
    </div>
  );
}
