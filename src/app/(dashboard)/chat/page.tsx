"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

// Mock data for conversations
const mockConversations = [
  { id: 1, title: "Conseils premier rendez-vous", lastMessage: "Il y a 2h", unread: true },
  { id: 2, title: "Améliorer ma confiance", lastMessage: "Hier", unread: false },
  { id: 3, title: "Gestion du stress", lastMessage: "Il y a 3 jours", unread: false },
  { id: 4, title: "Reprendre le sport", lastMessage: "Il y a 1 semaine", unread: false },
];

// Mock messages
const mockMessages = [
  {
    id: 1,
    role: "user",
    content: "Salut ! J'ai un premier rendez-vous ce soir et je suis un peu stressé. Tu peux m'aider ?",
    time: "14:30",
  },
  {
    id: 2,
    role: "assistant",
    content: "Salut ! Je comprends parfaitement ce que tu ressens, c'est tout à fait normal d'être nerveux avant un premier rendez-vous. 😊\n\nVoici quelques conseils pour te détendre et faire bonne impression :\n\n1. **Sois toi-même** - C'est le conseil le plus important. N'essaie pas de jouer un rôle.\n\n2. **Prépare quelques sujets de conversation** - Mais ne les récite pas ! Pense juste à quelques questions ouvertes sur ses passions, son travail, ses voyages...\n\n3. **Écoute activement** - Pose des questions de suivi basées sur ses réponses. Ça montre un vrai intérêt.\n\n4. **Gère ton stress** - Respire profondément avant d'y aller. Un peu de nervosité est normal et même charmant !",
    time: "14:31",
  },
  {
    id: 3,
    role: "user",
    content: "Merci ! Et si je ne sais plus quoi dire à un moment ?",
    time: "14:33",
  },
  {
    id: 4,
    role: "assistant",
    content: "C'est une super question ! Les silences peuvent arriver et ce n'est pas grave du tout. Voici comment les gérer :\n\n**Si un blanc survient :**\n- Souris et dis \"Je réfléchissais à ce que tu viens de dire, c'est intéressant\"\n- Pose une question sur l'environnement : \"Tu es déjà venu ici ? Tu aimes ce quartier ?\"\n- Parle de quelque chose que tu as remarqué chez elle/lui\n\n**Questions de secours :**\n- \"Si tu pouvais partir n'importe où demain, ce serait où ?\"\n- \"Quel est ton meilleur souvenir de cette année ?\"\n- \"Tu as des projets excitants pour les prochains mois ?\"\n\nL'important c'est de rester détendu. Un silence n'est pas un échec, c'est juste un moment de pause ! 💪",
    time: "14:35",
  },
];

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatListOpen, setChatListOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex min-h-screen">
        {/* Chat list - Desktop sidebar */}
        <div className="hidden md:flex w-80 border-r border-[var(--border)] flex-col bg-[var(--card-bg)]">
          <div className="p-4 border-b border-[var(--border)]">
            <button className="w-full gradient-primary text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedChat(conv.id)}
                className={`w-full p-4 text-left hover:bg-[var(--background)] transition-colors border-b border-[var(--border)] ${
                  selectedChat === conv.id ? "bg-[var(--background)]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conv.title}</p>
                      {conv.unread && (
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted)]">{conv.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <header className="bg-[var(--card-bg)] border-b border-[var(--border)] px-4 py-3 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-[var(--border)] rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setChatListOpen(!chatListOpen)}
              className="md:hidden p-2 hover:bg-[var(--border)] rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-bold">Coach AI</h2>
              <p className="text-xs text-[var(--success)] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
                En ligne
              </p>
            </div>
            <button className="p-2 hover:bg-[var(--border)] rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </header>

          {/* Mobile chat list dropdown */}
          {chatListOpen && (
            <div className="md:hidden bg-[var(--card-bg)] border-b border-[var(--border)] p-4 space-y-2">
              <button className="w-full gradient-primary text-white font-medium py-2 px-4 rounded-xl text-sm flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouvelle conversation
              </button>
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedChat(conv.id);
                    setChatListOpen(false);
                  }}
                  className={`w-full p-3 text-left rounded-xl transition-colors ${
                    selectedChat === conv.id
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "hover:bg-[var(--background)]"
                  }`}
                >
                  <p className="font-medium text-sm truncate">{conv.title}</p>
                  <p className="text-xs text-[var(--muted)]">{conv.lastMessage}</p>
                </button>
              ))}
            </div>
          )}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "gradient-primary text-white rounded-br-md"
                      : "bg-[var(--card-bg)] border border-[var(--border)] rounded-bl-md"
                  }`}
                >
                  <div
                    className={`text-sm whitespace-pre-wrap ${
                      msg.role === "assistant" ? "prose prose-sm max-w-none" : ""
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br />"),
                    }}
                  />
                  <p
                    className={`text-xs mt-2 ${
                      msg.role === "user" ? "text-white/70" : "text-[var(--muted)]"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <div className="flex justify-start">
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--muted)] animate-pulse-slow"></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--muted)] animate-pulse-slow" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--muted)] animate-pulse-slow" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="bg-[var(--card-bg)] border-t border-[var(--border)] p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-[var(--background)] rounded-2xl border border-[var(--border)] focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:border-transparent transition-all">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écris ton message..."
                  rows={1}
                  className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none max-h-32"
                  style={{ minHeight: "48px" }}
                />
              </div>
              <button
                className={`p-3 rounded-xl transition-all ${
                  message.trim()
                    ? "gradient-primary text-white hover:opacity-90"
                    : "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
                }`}
                disabled={!message.trim()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-[var(--muted)] text-center mt-3">
              15 crédits restants •{" "}
              <a href="/subscription" className="text-[var(--primary)] hover:underline">
                Obtenir plus
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
