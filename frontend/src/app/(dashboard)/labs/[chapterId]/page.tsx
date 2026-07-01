'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchWithAuth, BACKEND_URL } from '@/lib/api';
import { 
  ArrowLeft, Brain, Send, Cpu, Play, BarChart2, 
  RefreshCw, ShieldAlert, Sparkles, Database, Layers, Check, 
  Terminal, AlertTriangle, Eye, Activity, HelpCircle, HardDrive, Compass
} from 'lucide-react';

export default function LabDetailPage() {
  const params = useParams();
  const router = useRouter();
  const labId = parseInt(params.chapterId as string);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Lab 1 (Stateless vs Stateful)
  const [lab1Query, setLab1Query] = useState('');
  const [lab1Stateless, setLab1Stateless] = useState('');
  const [lab1Stateful, setLab1Stateful] = useState('');

  // Lab 2 (Memory Taxonomy)
  const [lab2Type, setLab2Type] = useState('episodic');
  const [lab2Content, setLab2Content] = useState('');
  const [lab2Importance, setLab2Importance] = useState(0.5);

  // Lab 3 (Graph Triples & Neuro-Symbolic Filter)
  const [lab3Text, setLab3Text] = useState('Alice Vietnamese coffee style works at Google DeepMind London');
  const [lab3Triples, setLab3Triples] = useState<any[]>([]);
  const [lab3Query, setLab3Query] = useState('Alice');
  const [lab3Trigger, setLab3Trigger] = useState('Google');
  const [lab3Forbidden, setLab3Forbidden] = useState('London');
  const [lab3Filtered, setLab3Filtered] = useState<any[]>([]);

  // Lab 4 (Extraction)
  const [lab4Input, setLab4Input] = useState('');
  const [lab4Extracted, setLab4Extracted] = useState<any[]>([]);

  // Lab 5 (Read path)
  const [lab5Query, setLab5Query] = useState('');
  const [lab5Results, setLab5Results] = useState<Record<string, any[]>>({});

  // Lab 6 (Consolidation & Reflector)
  const [lab6Query, setLab6Query] = useState('Where does Alice work?');
  const [lab6Response, setLab6Response] = useState('Alice works at Google DeepMind');
  const [lab6Memories, setLab6Memories] = useState<any[]>([]);
  const [lab6SelectedIds, setLab6SelectedIds] = useState<string[]>([]);

  // Lab 7 (Token Budget)
  const [lab7Budget, setLab7Budget] = useState(1500);

  // Lab 8 (Multi-Agent Shared Blackboard)
  const [blackboardKey, setBlackboardKey] = useState('active_deployment_stage');
  const [blackboardVal, setBlackboardVal] = useState('production_release_v2');
  const [blackboardAgent, setBlackboardAgent] = useState('DevOpsAgent');
  const [blackboardReadVal, setBlackboardReadVal] = useState<any>(null);

  // Lab 9 (Synthetic User Stress Test)
  const [stressSuccess, setStressSuccess] = useState<boolean | null>(null);

  // Lab 10 (GDPR Export/Purge)
  const [lab10Export, setLab10Export] = useState<any>(null);
  const [lab10Deleted, setLab10Deleted] = useState(false);

  // Lab 11 (Memory Reasoning Graph)
  const [reasoningGraph, setReasoningGraph] = useState<any[]>([]);
  const [leafId, setLeafId] = useState('node-4');

  // Lab 12 (Redis Cache & Observability)
  const [cacheToggle, setCacheToggle] = useState(false);
  const [cacheLatency, setCacheLatency] = useState<number | null>(null);
  const [langsmithActive, setLangsmithActive] = useState(false);

  // Lab 14 (Case Studies / Tiered Gateway)
  const [lab14Key, setLab14Key] = useState('theme_preference');
  const [lab14Value, setLab14Value] = useState('dark_mode_glassmorphism');
  const [lab14Result, setLab14Result] = useState<any>(null);

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleLab1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lab1Query.trim()) return;
    setLoading(true);
    setLab1Stateless('');
    setLab1Stateful('');
    try {
      // Stateless
      const r1 = await fetch(`${BACKEND_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: lab1Query, model_name: 'llama3.1' })
      });
      if (r1.ok) {
        const reader = r1.body?.getReader();
        const decoder = new TextDecoder();
        if (reader) {
          let full = '';
          let buffer = '';
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const data = JSON.parse(line);
                if (data.type === 'llm_chunk') {
                  full += data.content;
                  setLab1Stateless(full);
                }
              } catch(e){}
            }
          }
          if (!full) setLab1Stateless('Success.');
        }
      }
      // Stateful
      const threads = await (await fetchWithAuth('/threads/')).json();
      if (threads.length > 0) {
        const token = localStorage.getItem('access_token');
        const r2 = await fetch(`${BACKEND_URL}/chat/${threads[0].id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ prompt: lab1Query, model_name: 'llama3.1' })
        });
        if (r2.ok) {
          const reader = r2.body?.getReader();
          const decoder = new TextDecoder();
          if (reader) {
            let full = '';
            let buffer = '';
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              for (const line of lines) {
                if (!line.trim()) continue;
                try {
                  const data = JSON.parse(line);
                  if (data.type === 'llm_chunk') {
                    full += data.content;
                    setLab1Stateful(full);
                  }
                } catch(e){}
              }
            }
            if (!full) setLab1Stateful('Success.');
          }
        }
      } else {
        setLab1Stateful('Please open a chat thread in layout to test stateful recall.');
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLab2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lab2Content.trim()) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth('/memory/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memory_type: lab2Type,
          content: lab2Content,
          importance_score: lab2Importance
        })
      });
      if (res.ok) {
        showStatus('Memory item saved to DB store.');
        setLab2Content('');
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLab3Extract = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/memory/extract-triples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lab3Text })
      });
      if (res.ok) {
        const data = await res.json();
        setLab3Triples(data.triples || []);
      }
    } catch(e){}
    setLoading(false);
  };

  const handleLab3Verify = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/memory/verify-constraints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: lab3Query,
          rules: [{ trigger: lab3Trigger, forbidden_sub: lab3Forbidden }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        setLab3Filtered(data.memories || []);
        showStatus(`Filtered memories matching constraint logic: ${data.filtered_count}/${data.original_count}`);
      }
    } catch(e){}
    setLoading(false);
  };

  const handleLab4 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lab4Input.trim()) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth('/memory/extract-triples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lab4Input })
      });
      if (res.ok) {
        const data = await res.json();
        setLab4Extracted(data.triples || []);
      }
    } catch(e){}
    setLoading(false);
  };

  const handleLab5 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lab5Query.trim()) return;
    setLoading(true);
    try {
      const strategies = ['combined', 'semantic', 'recency', 'importance'];
      const out: Record<string, any[]> = {};
      for (const st of strategies) {
        const res = await fetchWithAuth(`/memory/search?query=${encodeURIComponent(lab5Query)}&strategy=${st}`);
        if (res.ok) {
          out[st] = await res.json();
        }
      }
      setLab5Results(out);
    } catch(e){}
    setLoading(false);
  };

  // Lab 6 Reflector Candidates
  const loadLab6Candidates = async () => {
    try {
      const res = await fetchWithAuth('/memory/');
      if (res.ok) {
        setLab6Memories(await res.json());
      }
    } catch(e){}
  };

  useEffect(() => {
    if (labId === 6) {
      loadLab6Candidates();
    }
  }, [labId]);

  const handleLab6Reflect = async () => {
    if (lab6SelectedIds.length === 0) {
      alert('Select at least one candidate memory to evaluate utility.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithAuth('/memory/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: lab6Query,
          response: lab6Response,
          memory_ids: lab6SelectedIds
        })
      });
      if (res.ok) {
        const data = await res.json();
        showStatus(`Reflector adjusted score delta for ${data.updated_count} memories successfully.`);
        loadLab6Candidates();
        setLab6SelectedIds([]);
      }
    } catch(e){}
    setLoading(false);
  };

  const toggleSelectLab6 = (id: string) => {
    if (lab6SelectedIds.includes(id)) {
      setLab6SelectedIds(lab6SelectedIds.filter(x => x !== id));
    } else {
      setLab6SelectedIds([...lab6SelectedIds, id]);
    }
  };

  const handleBlackboardWrite = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/memory/blackboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: blackboardKey,
          value: blackboardVal,
          agent_name: blackboardAgent
        })
      });
      if (res.ok) {
        showStatus('Shared blackboard key updated.');
      }
    } catch(e){}
    setLoading(false);
  };

  const handleBlackboardRead = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/memory/blackboard/${blackboardKey}`);
      if (res.ok) {
        setBlackboardReadVal(await res.json());
      } else {
        setBlackboardReadVal({ error: 'Key not found.' });
      }
    } catch(e){}
    setLoading(false);
  };

  const runStressTest = async () => {
    setLoading(true);
    setStressSuccess(null);
    try {
      const res = await fetchWithAuth('/memory/run-stress-test', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setStressSuccess(data.success);
      }
    } catch(e){}
    setLoading(false);
  };

  const runExport = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/memory/export');
      if (res.ok) {
        setLab10Export(await res.json());
      }
    } catch(e){}
    setLoading(false);
  };

  const runPurge = async () => {
    if (!confirm('Are you sure you want to run clean wipe?')) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth('/memory/forget-me', { method: 'POST' });
      if (res.ok) {
        setLab10Deleted(true);
        setLab10Export(null);
      }
    } catch(e){}
    setLoading(false);
  };

  // Lab 11 (Reasoning Graphs)
  const addReasoningStep = (id: string, type: string, desc: string, parent: string | null) => {
    setReasoningGraph([...reasoningGraph, { id, type, desc, parent }]);
  };

  useEffect(() => {
    if (labId === 11) {
      setReasoningGraph([
        { id: 'node-1', type: 'goal', desc: 'Personalize code formatting preference', parent: null },
        { id: 'node-2', type: 'action', desc: 'Scan memory database for user tags', parent: 'node-1' },
        { id: 'node-3', type: 'memory', desc: 'User prefers functional python programming', parent: 'node-2' },
        { id: 'node-4', type: 'observation', desc: 'Emitted final formatted output response', parent: 'node-3' }
      ]);
    }
  }, [labId]);

  const tracePath = () => {
    const path = [];
    let currId = leafId;
    while (currId) {
      const node = reasoningGraph.find(n => n.id === currId);
      if (!node) break;
      path.push(node);
      currId = node.parent;
    }
    return path;
  };

  // Lab 12 Cache Simulation
  const simulateCacheFetch = async () => {
    setLoading(true);
    // Simulate Cache logic
    setTimeout(() => {
      if (cacheToggle) {
        setCacheLatency(2); // 2ms Cache Hit
        showStatus('Cache Hit: retrieved from Redis hot memory tier.');
      } else {
        setCacheLatency(142); // 142ms DB Lookup
        showStatus('Cache Miss: fetched from cold Postgres pgvector store.');
      }
      setLoading(false);
    }, 400);
  };

  // Lab 14 API fetch handler
  const handleLab14 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLab14Result(null);
    try {
      const res = await fetchWithAuth(`${BACKEND_URL}/memory/tiered-gateway`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: lab14Key,
          db_fallback_items: [
            { key: lab14Key, content: lab14Value, memory_type: 'semantic' }
          ]
        })
      });
      if (res.ok) {
        const data = await res.json();
        setLab14Result(data);
        showStatus(`Query completed from ${data.source}`);
      } else {
        showStatus('Error calling tiered-gateway endpoint');
      }
    } catch (err: any) {
      showStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#030712] relative">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/labs" className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-white">Lab Session {labId}</h1>
          <p className="text-slate-400 text-xs">Verify local memory agent capabilities in the live environment</p>
        </div>
      </div>

      {statusMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs flex items-center gap-2 mb-6 z-20 animate-fade-in glass-panel w-fit">
          <Check className="w-4 h-4 text-emerald-400 status-dot-active rounded-full" />
          <span className="font-semibold">{statusMsg}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto glass-panel p-8 rounded-2xl shadow-xl flex flex-col gap-6">
        
        {/* Lab 1 (Chapter 1 Foundations) */}
        {labId === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-white">Foundations — Stateless vs. Stateful Memory</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Observe the difference between stateless RAG (no history preservation) and stateful memories. Run queries side-by-side.
              </p>
            </div>
            <form onSubmit={handleLab1} className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={lab1Query}
                onChange={(e) => setLab1Query(e.target.value)}
                placeholder="Ask e.g. 'Remember my server is running on port 8080', then ask 'Which port is my server on?'"
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 border border-indigo-500/20"
              >
                {loading ? 'Evaluating LLM responses...' : 'Compare RAG responses'}
              </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800 flex flex-col gap-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Stateless Vanilla RAG</span>
                <p className="text-slate-350 text-xs leading-relaxed min-h-[100px] whitespace-pre-wrap font-medium">
                  {lab1Stateless || 'Awaiting execution...'}
                </p>
              </div>
              <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800 flex flex-col gap-3">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Memory-Augmented RAG</span>
                <p className="text-slate-305 text-xs leading-relaxed min-h-[100px] whitespace-pre-wrap font-medium">
                  {lab1Stateful || 'Awaiting execution...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lab 2 (Chapter 2 Memory Types) */}
        {labId === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-white">Memory Taxonomy Sandbox</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Save custom items categorized by memory layer classifications.
              </p>
            </div>
            <form onSubmit={handleLab2} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Memory Type</label>
                <select
                  value={lab2Type}
                  onChange={(e) => setLab2Type(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="episodic">Episodic (Event/Context - 'User said X on date Y')</option>
                  <option value="semantic">Semantic (Fact/Knowledge - 'User prefers Python')</option>
                  <option value="procedural">Procedural (Workflow preference - 'Format as table')</option>
                  <option value="entity">Entity (Object attribute - 'Server port is 8080')</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Content</label>
                <input
                  type="text"
                  required
                  value={lab2Content}
                  onChange={(e) => setLab2Content(e.target.value)}
                  placeholder="Fact description..."
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Importance Rating: {lab2Importance}</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={lab2Importance}
                  onChange={(e) => setLab2Importance(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl text-xs transition cursor-pointer border border-indigo-500/20"
              >
                Add Memory Item
              </button>
            </form>
          </div>
        )}

        {/* Lab 3 (Chapter 3 Storage & Graph Triples & Neuro-Symbolic) */}
        {labId === 3 && (
          <div className="flex flex-col gap-8">
            <div className="border-b border-slate-900 pb-4">
              <h2 className="text-base font-extrabold text-white">SPO Triple Extraction & Symbolic Constraints</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Extract Subject-Predicate-Object (SPO) graph triples from dialogue and run the Neuro-Symbolic Logic Filter constraints check.
              </p>
            </div>

            {/* SPO Graph Triples extraction */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                1. Graph Triple Extractor (Chapter 3.3)
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={lab3Text}
                  onChange={(e) => setLab3Text(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleLab3Extract}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  {loading ? 'Extracting...' : 'Extract Graph Triples'}
                </button>
              </div>

              {lab3Triples.length > 0 && (
                <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl flex flex-col gap-2 text-xs">
                  {lab3Triples.map((t, idx) => (
                    <div key={idx} className="font-mono text-[10px] text-amber-400">
                      Tuple: ({t.subject}, <span className="text-indigo-400">{t.predicate}</span>, {t.object})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Neuro-Symbolic Constraints */}
            <div className="flex flex-col gap-4 border-t border-slate-900 pt-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                2. Neuro-Symbolic Constraints Filter (Chapter 3.4)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Query Target</label>
                  <input
                    type="text"
                    value={lab3Query}
                    onChange={(e) => setLab3Query(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Rule Trigger (Word)</label>
                  <input
                    type="text"
                    value={lab3Trigger}
                    onChange={(e) => setLab3Trigger(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Forbidden Word (Drop if present)</label>
                  <input
                    type="text"
                    value={lab3Forbidden}
                    onChange={(e) => setLab3Forbidden(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleLab3Verify}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Run Verification Filter
              </button>

              {lab3Filtered.length > 0 && (
                <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl flex flex-col gap-2.5 text-xs">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Filtered Memories Output</span>
                  {lab3Filtered.map((m, idx) => (
                    <div key={idx} className="p-2 bg-slate-900/40 rounded-xl border border-slate-800 flex justify-between text-[11px] text-slate-350">
                      <span>{m.content}</span>
                      <span className="text-indigo-400 font-mono font-bold">Score: {m.score.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lab 4 (Chapter 4 Write Path) */}
        {labId === 4 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-white">Memory Extraction Sandbox</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Test the dynamic extraction pipeline. Enter dialog queries to run keyword salience evaluations.
              </p>
            </div>
            <form onSubmit={handleLab4} className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={lab4Input}
                onChange={(e) => setLab4Input(e.target.value)}
                placeholder="Say e.g. 'I work as a Python engineer in Google DeepMind.'"
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider cursor-pointer border border-indigo-500/20"
              >
                Extract Memory Unit
              </button>
            </form>
            <div className="flex flex-col gap-2.5 mt-2">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Extracted Unit</span>
              {lab4Extracted.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[9px] font-bold uppercase mr-3">
                      tuple extraction
                    </span>
                    <span className="text-slate-200 font-medium">({item.subject}, {item.predicate}, {item.object})</span>
                  </div>
                </div>
              ))}
              {lab4Extracted.length === 0 && (
                <div className="text-center text-slate-600 py-8 text-xs font-medium">Awaiting input extraction...</div>
              )}
            </div>
          </div>
        )}

        {/* Lab 5 (Chapter 5 Read Path) */}
        {labId === 5 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-white">Retrieval Strategies Comparison</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Compare Recency-weighted vs. Importance-weighted vs. Stanford Combined formulas side-by-side.
              </p>
            </div>
            <form onSubmit={handleLab5} className="flex gap-2">
              <input
                type="text"
                required
                value={lab5Query}
                onChange={(e) => setLab5Query(e.target.value)}
                placeholder="Enter query term..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer border border-indigo-500/20"
              >
                Query
              </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
              {['combined', 'semantic', 'recency'].map((strategy) => (
                <div key={strategy} className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{strategy} strategy</span>
                  <div className="flex flex-col gap-2 mt-2">
                    {lab5Results[strategy]?.map((res, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/60 border border-slate-900 rounded-lg text-[11px] text-slate-350 font-medium">
                        <div className="text-[9px] text-indigo-400 font-mono mb-1 font-bold">Score: {res.final_score.toFixed(3)}</div>
                        {res.memory?.content}
                      </div>
                    ))}
                    {(!lab5Results[strategy] || lab5Results[strategy].length === 0) && (
                      <div className="text-slate-600 text-[11px] py-6 text-center font-medium">No hits.</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lab 6 (Chapter 6 Consolidation & Reflector) */}
        {labId === 6 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-white">Memory Utility Reflector & Consolidation</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Test the Self-Improving Memory feedback loop. Evaluates retrieved memories and updates database importance weights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500">User Query</label>
                <input
                  type="text"
                  value={lab6Query}
                  onChange={(e) => setLab6Query(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Assistant Response</label>
                <input
                  type="text"
                  value={lab6Response}
                  onChange={(e) => setLab6Response(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Select Memories to reflect on:</span>
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto border border-slate-900 rounded-xl p-2 scrollbar-thin">
                {lab6Memories.map((m) => {
                  const isSelected = lab6SelectedIds.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleSelectLab6(m.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer flex justify-between items-center transition ${
                        isSelected 
                          ? 'bg-indigo-600/10 border-indigo-500/30 text-white' 
                          : 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                      }`}
                    >
                      <span>{m.content}</span>
                      <span className="font-mono text-indigo-400 font-bold">Imp: {m.importance_score}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleLab6Reflect}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl text-xs cursor-pointer"
            >
              Run Utility Reflection
            </button>
          </div>
        )}

        {/* Lab 7 (Chapter 7 Context window manager) */}
        {labId === 7 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-white">Context Window & Budget Manager</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Adjust prompt token budgets and analyze how memory context and vector documents compete for space.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total Prompt Token Budget: {lab7Budget}</label>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="100"
                  value={lab7Budget}
                  onChange={(e) => setLab7Budget(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col gap-4 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Budget Allocations Chart</span>
                <div className="flex h-8 w-full rounded-xl overflow-hidden font-bold text-white text-[10px] text-center items-center">
                  <div className="bg-indigo-600 h-full flex items-center justify-center border-r border-indigo-500/20" style={{ width: '40%' }}>
                    Memory (40%)
                  </div>
                  <div className="bg-emerald-600 h-full flex items-center justify-center border-r border-emerald-500/20" style={{ width: '50%' }}>
                    Docs (50%)
                  </div>
                  <div className="bg-slate-800 h-full flex items-center justify-center" style={{ width: '10%' }}>
                    Query (10%)
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-indigo-400">Memory Budget</span>
                    <span className="font-medium text-slate-350 mt-0.5">{Math.round(lab7Budget * 0.4)} Tokens</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-emerald-400">Documents Budget</span>
                    <span className="font-medium text-slate-350 mt-0.5">{Math.round(lab7Budget * 0.5)} Tokens</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-slate-400">Query Budget</span>
                    <span className="font-medium text-slate-350 mt-0.5">{Math.round(lab7Budget * 0.1)} Tokens</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lab 8 (Chapter 8 Multi-Agent Shared Blackboard) */}
        {labId === 8 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-white">Multi-Agent Shared Blackboard (Chapter 8.3)</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Test state updates across collaborative agent namespaces. Simulates lock controls on the blackboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Key Name</label>
                <input
                  type="text"
                  value={blackboardKey}
                  onChange={(e) => setBlackboardKey(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Value</label>
                <input
                  type="text"
                  value={blackboardVal}
                  onChange={(e) => setBlackboardVal(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Writer Agent Persona</label>
                <input
                  type="text"
                  value={blackboardAgent}
                  onChange={(e) => setBlackboardAgent(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBlackboardWrite}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Write to Blackboard
              </button>
              <button
                onClick={handleBlackboardRead}
                disabled={loading}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition border border-slate-800 cursor-pointer"
              >
                Read Key State
              </button>
            </div>

            {blackboardReadVal && (
              <div className="p-4.5 bg-slate-950/60 border border-slate-900 rounded-2xl text-xs flex flex-col gap-2 font-mono">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Blackboard State Response</span>
                {blackboardReadVal.error ? (
                  <div className="text-red-400">{blackboardReadVal.error}</div>
                ) : (
                  <div className="flex flex-col gap-1 text-slate-350">
                    <div>Key: <span className="text-indigo-400">{blackboardReadVal.key}</span></div>
                    <div>Value: <span className="text-emerald-400">{blackboardReadVal.value}</span></div>
                    <div>Modified by: {blackboardReadVal.updated_by_agent}</div>
                    <div>Timestamp: {blackboardReadVal.timestamp}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Lab 9 (Chapter 9 Synthetic User Stress Testing) */}
        {labId === 9 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-white">Synthetic User & Stress Testing Harness</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Simulates multi-turn conversations using synthetic LLM personas to evaluate long-horizon RAG recall consistency.
              </p>
            </div>

            <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800 flex flex-col gap-4 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Simulator parameters</span>
              <div className="flex flex-col gap-1 text-slate-350">
                <div>Persona Name: <span className="text-white font-semibold">Alice stress test profile</span></div>
                <div>Facts to Inject: <span className="text-indigo-400 font-semibold">"My favorite color is neon-blue-light-laser"</span></div>
                <div>Test Duration: <span className="text-white">6 Turns</span></div>
              </div>
            </div>

            <button
              onClick={runStressTest}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {loading ? 'Executing turns...' : 'Run Automated Stress Test'}
            </button>

            {stressSuccess !== null && (
              <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 animate-fade-in ${
                stressSuccess 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <Check className="w-4 h-4" />
                <span>Stress test evaluation completed: {stressSuccess ? 'SUCCESS (Fact recalled correctly)' : 'FAILED (Fact lost under conversation drift)'}</span>
              </div>
            )}
          </div>
        )}

        {/* Lab 10 (Chapter 10 Privacy) */}
        {labId === 10 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-white">GDPR & Data Governance</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Demonstrate user privacy compliance. Run data portability backups or wipe memory cells.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={runExport}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition border border-slate-800 cursor-pointer"
              >
                Data Export Backup
              </button>
              <button
                onClick={runPurge}
                className="flex-1 bg-red-950/20 hover:bg-red-900/30 border border-red-500/25 text-red-400 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Purge All Records
              </button>
            </div>
            {lab10Export && (
              <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Exported JSON Payload</span>
                <pre className="bg-slate-950/60 border border-slate-900 p-4 rounded-xl text-[10px] text-slate-400 overflow-x-auto font-mono leading-relaxed">
                  {JSON.stringify(lab10Export, null, 2)}
                </pre>
              </div>
            )}
            {lab10Deleted && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-medium">
                ✓ All user memory configurations have been purged from local indexes.
              </div>
            )}
          </div>
        )}

        {/* Lab 11 (Chapter 11 Memory Reasoning Graph) */}
        {labId === 11 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-extrabold text-white">Memory Reasoning Graph Tracer (Chapter 11.4)</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Trace step-by-step reasoning dependency trees mapping goals to final output tokens.
              </p>
            </div>

            <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-800 flex flex-col gap-4 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Active Graph Nodes</span>
              <div className="flex flex-col gap-3">
                {reasoningGraph.map((node) => (
                  <div key={node.id} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 rounded text-[8px] font-bold uppercase mr-3">
                        {node.type}
                      </span>
                      <span className="text-slate-350">{node.desc}</span>
                    </div>
                    <span className="text-[10px] text-slate-600">ID: {node.id}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Trace Path back to Goal from Leaf ID:</span>
              <input
                type="text"
                value={leafId}
                onChange={(e) => setLeafId(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white max-w-[120px]"
              />
              <button
                onClick={tracePath}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Trace Path
              </button>
            </div>

            {leafId && (
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl flex flex-col gap-2.5 text-xs">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Traced Reasoning Path</span>
                <div className="flex flex-col gap-2 font-mono">
                  {tracePath().map((node, idx) => (
                    <div key={idx} className="text-slate-350 text-[11px] flex items-center gap-2">
                      <span className="text-amber-400 font-bold">{node.id}</span>
                      <span>{"->"}</span>
                      <span>{node.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lab 12 (Chapter 12 Redis Cache & Observability) */}
        {labId === 12 && (
          <div className="flex flex-col gap-8">
            <div className="border-b border-slate-900 pb-4">
              <h2 className="text-base font-extrabold text-white">Production Caching & LangSmith Observability</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Configure hot-tier Redis caching and trace telemetry logs with LangSmith.
              </p>
            </div>

            {/* Redis Cache Simulation */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                1. Redis Memory Cache Simulator (Chapter 12.3)
              </h3>
              <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                <div>
                  <span className="font-extrabold block text-white text-xs">Redis Hot Cache Status</span>
                  <span className="text-[9px] text-slate-500 font-medium">Toggle cache response states</span>
                </div>
                <button
                  onClick={() => setCacheToggle(!cacheToggle)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    cacheToggle 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cacheToggle ? 'CACHE ENABLED (HOT)' : 'CACHE DISABLED (COLD)'}
                </button>
              </div>

              <button
                onClick={simulateCacheFetch}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Trigger Memory Fetch
              </button>

              {cacheLatency !== null && (
                <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Response Retrieval Latency:</span>
                  <span className={`font-bold ${cacheLatency === 2 ? 'text-emerald-400' : 'text-amber-500'}`}>
                    {cacheLatency} ms
                  </span>
                </div>
              )}
            </div>

            {/* LangSmith Observability */}
            <div className="flex flex-col gap-4 border-t border-slate-900 pt-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                2. LangSmith Observability Telemetry (Chapter 12.5)
              </h3>
              <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                <div>
                  <span className="font-extrabold block text-white text-xs">Observability Logs Tracing</span>
                  <span className="text-[9px] text-slate-500 font-medium">Forward telemetry to LangSmith dashboard</span>
                </div>
                <button
                  onClick={() => {
                    setLangsmithActive(!langsmithActive);
                    showStatus(langsmithActive ? 'LangSmith telemetry stopped.' : 'LangSmith telemetry tracing enabled.');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    langsmithActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {langsmithActive ? 'TRACING ON' : 'TRACING OFF'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lab 14 (Case Studies / Tiered Memory Gateway) */}
        {labId === 14 && (
          <div className="flex flex-col gap-8">
            <div className="border-b border-slate-900 pb-4">
              <h2 className="text-base font-extrabold text-white">Tiered Memory Gateway Case Study</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Test how a production memory router fetches user configuration from a hot memory cache tier and falls back to a cold database.
              </p>
            </div>

            <form onSubmit={handleLab14} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Memory Lookup Key</label>
                <input
                  type="text"
                  value={lab14Key}
                  onChange={(e) => setLab14Key(e.target.value)}
                  className="bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mock DB Fallback Content</label>
                <textarea
                  value={lab14Value}
                  onChange={(e) => setLab14Value(e.target.value)}
                  rows={3}
                  className="bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/50 resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                {loading ? 'Processing...' : 'Query Tiered Gateway'}
              </button>
            </form>

            {lab14Result && (
              <div className="flex flex-col gap-4 border-t border-slate-900 pt-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Routing Resolution Result
                </h3>
                <div className="p-5 bg-slate-950/60 border border-slate-900 rounded-2xl flex flex-col gap-3 text-xs leading-relaxed font-mono">
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-500">Retrieval Source:</span>
                    <span className={`font-bold ${lab14Result.source === 'hot_cache' ? 'text-emerald-400' : 'text-amber-500'}`}>
                      {lab14Result.source.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-500">Latency:</span>
                    <span className="text-white font-bold">{lab14Result.latency_ms} ms</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500">Retrieved Content:</span>
                    <span className="text-slate-300 font-sans p-3 bg-slate-900/40 rounded-xl mt-1 block">
                      {lab14Result.item?.content || 'No content found.'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Static fallback */}
        {![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14].includes(labId) && (
          <div className="flex flex-col gap-4 text-slate-350 text-xs leading-relaxed font-medium">
            <h2 className="text-base font-extrabold text-white">Lab Session {labId} Summary Overview</h2>
            <p>
              This chapter covers abstract RAG Memory system designs. Review reference architectural frameworks or scale structures.
            </p>
            <div className="p-4.5 bg-slate-900/40 border border-slate-800 rounded-xl">
              <span className="font-extrabold text-slate-400 block mb-1 uppercase text-[9px] tracking-wider">Key Concept Details</span>
              {labId === 13 && 'Sandbox: Use general chat windows to test full dynamic flows.'}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
