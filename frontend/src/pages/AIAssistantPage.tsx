import React, { useState, useEffect, useRef } from 'react';
import { Incident } from '../types';
import { api } from '../services/api';
import { ThreatBadge } from '../components/common/ThreatBadge';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Camera as CameraIcon,
  Video,
  FileImage,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Flame,
  Clock,
  Terminal
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  matched_incidents?: Incident[];
  query_intent?: Record<string, any>;
}

interface AIAssistantPageProps {
  onSelectIncident: (inc: Incident) => void;
  initialPrompt?: string;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  onSelectIncident,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Greetings, Officer. I am BORDER AI ASSISTANT. I continuously index live CCTV detections, multi-object tracks, polygon breaches, and Threat Engine scores across Sectors A, B, C, and D. How can I assist your surveillance investigation?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    'Show suspicious activity in Sector B.',
    'What happened at Camera C-07?',
    'Show all critical incidents today.',
    'Was there any boundary crossing in the last hour?',
    'Show incidents involving vehicles.',
    'Which camera has the highest number of alerts?',
    'Show the incident at 10:42 AM.'
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await api.queryAssistant(textToSend);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString(),
        matched_incidents: response.matched_incidents,
        query_intent: response.query_intent
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Telemetry query timed out. Returning cached sector logs.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="p-6 max-w-[1500px] mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-4 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/50">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-mono font-bold tracking-wide text-slate-100">
                BORDER AI ASSISTANT
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>SEMANTIC FORENSIC SEARCH</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Natural-Language Border Incident Discovery &amp; Evidence Cross-Referencing
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>CONNECTED TO FORENSIC DATABASE</span>
        </div>
      </div>

      {/* Suggested Quick Questions Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs text-slate-300">
        <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">
          Quick Inquiries:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-full bg-[#0B0F17] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors shrink-0 text-slate-300 hover:text-cyan-300 text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 bg-[#070A0F] border border-slate-800 rounded-xl p-5 overflow-y-auto space-y-4 font-mono text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${
                msg.sender === 'user'
                  ? 'bg-slate-800 border border-slate-700 text-slate-200'
                  : 'bg-cyan-950 border border-cyan-700/60 text-cyan-400 shadow-sm'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Body */}
            <div className="space-y-2 flex-1">
              <div
                className={`p-4 rounded-xl border leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-950/40 border-cyan-700/50 text-slate-100'
                    : 'bg-[#0B0F17] border-slate-850 text-slate-200 shadow-lg'
                }`}
              >
                <div className="text-[10px] text-slate-500 mb-1 flex items-center justify-between">
                  <span>{msg.sender === 'user' ? 'OFFICER A. NEVASE' : 'BORDER AI INTELLIGENCE'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="text-xs">{msg.text}</p>
              </div>

              {/* Render Structured Incident Result Cards (Section 14) */}
              {msg.matched_incidents && msg.matched_incidents.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Matched Forensic Incident Records ({msg.matched_incidents.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {msg.matched_incidents.map((inc) => (
                      <div
                        key={inc.id}
                        className="bg-[#0E1522] border border-slate-800 hover:border-slate-700 rounded-lg p-3 space-y-2 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100">{inc.incident_code}</span>
                          <ThreatBadge severity={inc.severity} />
                        </div>

                        <div className="text-[11px] text-slate-300 font-sans font-medium">
                          {inc.incident_type}
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-1.5">
                          <span>{inc.camera_id} • {inc.sector}</span>
                          <span className="text-red-400 font-bold">RISK: {inc.risk_score}/100</span>
                        </div>

                        {/* Action buttons from Section 14 */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => onSelectIncident(inc)}
                            className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-750 text-[10px] flex items-center justify-center gap-1 transition-colors"
                          >
                            <FileImage className="w-3 h-3 text-cyan-400" />
                            <span>VIEW IMAGE</span>
                          </button>
                          <button
                            onClick={() => onSelectIncident(inc)}
                            className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-750 text-[10px] flex items-center justify-center gap-1 transition-colors"
                          >
                            <Video className="w-3 h-3 text-purple-400" />
                            <span>PLAY VIDEO</span>
                          </button>
                          <button
                            onClick={() => onSelectIncident(inc)}
                            className="flex-1 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[10px] flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>DETAILS</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs bg-[#0B0F17] p-3 rounded-lg border border-slate-800 w-fit">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI investigating incident telemetry &amp; sensor records...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-[#0B0F17] border border-slate-800 rounded-xl p-2 font-mono"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AI Assistant e.g. 'Show suspicious activity in Sector B' or 'What happened at Camera C-07?'"
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>QUERY AI</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
