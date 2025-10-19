import React from 'react';

export default function ProviderColumn({ name, data }){
  return (
    <div style={{borderRadius:8,padding:12,background:'#fff',boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <h3 style={{fontWeight:700}}>{name}</h3>
        <div style={{fontSize:12,color:'#6b7280'}}>{data?.latency_ms ? `${data.latency_ms}ms` : ''}</div>
      </div>
      <div style={{marginTop:10,whiteSpace:'pre-wrap',maxHeight:220,overflow:'auto',fontSize:14,color:'#111827'}}>{data?.text || data?.error || 'No output'}</div>
      {data?.references?.length > 0 && (
        <div style={{marginTop:10,fontSize:13}}>
          <div style={{fontWeight:700}}>References</div>
          <ul style={{paddingLeft:18,color:'#2563eb'}}>
            {data.references.map((r,i) => (
              <li key={i}><a href={r.url} target="_blank" rel="noreferrer">{r.title || r.url}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
