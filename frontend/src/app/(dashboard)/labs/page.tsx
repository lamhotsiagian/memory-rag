'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';

const CHAPTERS = [
  { id: 1, name: 'Why memory matters', desc: 'See how a stateless agent forgets between turns, and how memory fixes it.' },
  { id: 2, name: 'Types of memory', desc: 'Compare working notes, episodic events, semantic facts, and entity attributes.' },
  { id: 3, name: 'Storage architecture', desc: 'How reads and writes route across SQL, pgvector, and conversation checkpoints.' },
  { id: 4, name: 'Writing memory', desc: 'Turn conversation into structured facts, scored by importance.' },
  { id: 5, name: 'Reading memory', desc: 'Compare four retrieval strategies: recency, importance, similarity, and combined.' },
  { id: 6, name: 'Consolidation', desc: 'Summarize long histories, detect contradictions, and update facts.' },
  { id: 7, name: 'Context window', desc: 'See how memory, documents, and the query compete for the prompt budget.' },
  { id: 8, name: 'Multi-user isolation', desc: 'Confirm each account only sees its own private memory.' },
  { id: 9, name: 'Evaluation', desc: 'Measure retrieval precision, recall, and faithfulness.' },
  { id: 10, name: 'Privacy & governance', desc: 'Export your data, or permanently delete everything.' },
  { id: 11, name: 'Reference designs', desc: 'How systems like MemGPT, Letta, and Mem0 approach memory.' },
  { id: 12, name: 'Scaling up', desc: 'Write loops, thread counts, and background processing in production.' },
  { id: 13, name: 'Full sandbox', desc: 'Run an end-to-end flow from logging a fact to resolving a conflict.' },
];

export default function ChaptersIndexPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-[var(--accent-soft)] border border-[var(--accent-border)] rounded-xl">
              <BookOpen className="text-[var(--accent)] w-5 h-5" />
            </div>
            Labs
          </h1>
          <p className="text-[var(--muted)] text-sm mt-1">Hands-on walkthroughs for each part of the memory system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHAPTERS.map((ch) => (
            <Link key={ch.id} href={`/labs/${ch.id}`} className="group card card-hover p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="badge bg-[var(--accent-soft)] text-[var(--accent-text)] border-[var(--accent-border)]">Lab {ch.id}</span>
                <ChevronRight className="w-4 h-4 text-[var(--subtle)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition" />
              </div>
              <h3 className="font-semibold group-hover:text-[var(--accent)] transition">{ch.name}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{ch.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
