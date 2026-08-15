import React, { useState } from 'react';
import katex from 'katex';
import { processAiMathPrompt } from '../services/aiMathService';
import { Sparkles, Send, Bot, User, ArrowRight, Lightbulb } from 'lucide-react';

export default function AiAssistant({ onApplyToGraph }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I'm your **MathMind Assistant**. Ask me any math question, calculus problem, vector field concept, or ask me to plot 2D/3D functions!",
      suggestedEquation: null
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Explain saddle point geometry in 3D",
    "Calculate derivative of x^3 * sin(x)",
    "Plot a rotational vector field P=-y, Q=x",
    "Find area under x^2 between 0 and 2"
  ];

  const handleSend = async (promptToSend) => {
    const query = promptToSend || inputText;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!promptToSend) setInputText('');
    setLoading(true);

    try {
      const response = await processAiMathPrompt(query);
      const aiMsg = {
        sender: 'ai',
        text: response.answerText,
        suggestedEquation: response.suggestedEquation,
        mode: response.mode,
        steps: response.steps,
        title: response.title
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: "Apologies, I encountered an issue analyzing that prompt. Try entering standard equation notation." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderKaTeX = (tex) => {
    try {
      return { __html: katex.renderToString(tex, { throwOnError: false }) };
    } catch (e) {
      const escaped = tex.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      return { __html: escaped };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">AI Math Assistant & Conceptual Tutor</h3>
            <p className="text-xs text-slate-400">Natural language problem solving & graph generation</p>
          </div>
        </div>
        <span className="badge-purple text-[10px]">Gemini AI Engine</span>
      </div>

      {/* Quick Suggestions Chips */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600/20 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 min-h-[380px] max-h-[480px] overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
              msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-purple-600/40 text-cyan-300 border border-purple-400/40'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-xl max-w-[85%] text-xs space-y-2 leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-indigo-600/40 border border-indigo-400/30 text-slate-100 font-sans'
                : 'glass-card text-slate-200 border-white/10'
            }`}>
              <p>{msg.text}</p>

              {/* Render Math Steps if present */}
              {msg.steps && (
                <div className="space-y-2 mt-2 pt-2 border-t border-white/10">
                  {msg.steps.map((st, sIdx) => (
                    <div key={sIdx} className="p-2 bg-slate-900/60 rounded border border-white/5 font-mono">
                      <div className="text-[10px] text-cyan-400 font-bold">{st.title}</div>
                      {st.latex && (
                        <div
                          className="my-1 text-slate-100"
                          dangerouslySetInnerHTML={renderKaTeX(st.latex)}
                        />
                      )}
                      <div className="text-[11px] text-slate-300">{st.explanation}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button to Open Grapher */}
              {msg.suggestedEquation && (
                <button
                  onClick={() => onApplyToGraph(msg.suggestedEquation, msg.mode || '2d')}
                  className="btn-neon text-[11px] py-1 px-3 mt-2 font-bold"
                >
                  <span>Plot "{msg.suggestedEquation}" in {msg.mode === '3d' ? '3D Studio' : '2D Plotter'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-300 italic p-2">
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" /> Math AI is synthesizing response...
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI anything (e.g. 'Solve quadratic x^2 - 4x + 3 = 0' or 'Plot ripple surface')..."
          className="glass-input text-xs font-mono flex-1 py-3 px-4"
        />
        <button
          onClick={() => handleSend()}
          className="btn-neon px-5 py-3 text-xs font-bold"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
