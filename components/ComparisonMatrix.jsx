import React from 'react';

export default function ComparisonMatrix({ outputs }){
  const rows = Object.entries(outputs || {}).map(([k,v]) => ({ provider: k, snippet: (v?.text || v?.error || '').slice(0, 800) }));
  return (
    <table style={{width:'100%',borderCollapse:'collapse',marginTop:8}}>
      <thead>
        <tr>
          <th style={{border:'1px solid #e5e7eb',padding:8,textAlign:'left'}}>Provider</th>
          <th style={{border:'1px solid #e5e7eb',padding:8,textAlign:'left'}}>Answer snippet</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.provider}>
            <td style={{border:'1px solid #e5e7eb',padding:8,fontWeight:600,verticalAlign:'top'}}>{r.provider}</td>
            <td style={{border:'1px solid #e5e7eb',padding:8}}>{r.snippet}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
