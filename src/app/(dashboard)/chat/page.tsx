"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

interface Session {
  id: string;
  title: string;
  lastMessage: string | null;
  messageCount: number;
  updatedAt: string;
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins}min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  return `Il y a ${diffDays} jours`;
}

function renderContent(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

function ChatPageInner() {
  const { user, loading: userLoading, remainingCredits } = useCurrentUser();
  const searchParams = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatListOpen, setChatListOpen] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    searchParams.get("session")
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [noCredits, setNoCredits] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Charger les sessions
  useEffect(() => {
    if (!user) return;
    setLoadingSessions(true);
    fetch(`/api/chat/sessions`)
      .then((r) => r.json())
      .then((data) => setSessions(data.sessions ?? []))
      .catch(console.error)
      .finally(() => setLoadingSessions(false));
  }, [user]);

  // Charger les messages quand la session change
  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    fetch(`/api/chat/sessions/${selectedSessionId}`)
      .then((r) => r.json())
      .then((data) => setMessages(data.session?.messages ?? []))
      .catch(console.error)
      .finally(() => setLoadingMessages(false));
  }, [selectedSessionId]);

  // Scroll vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Créer une nouvelle session
  async function handleNewSession() {
    if (!user) return;
    const res = await fetch("/api/chat/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    const newSession: Session = {
      id: data.session.id,
      title: data.session.title,
      lastMessage: null,
      messageCount: 0,
      updatedAt: data.session.createdAt,
    };
    setSessions((prev) => [newSession, ...prev]);
    setSelectedSessionId(data.session.id);
    setMessages([]);
    setChatListOpen(false);
  }

  // Envoyer un message
  async function handleSend() {
    if (!message.trim() || !user || sending) return;

    const content = message.trim();
    setMessage("");
    setSending(true);
    setNoCredits(false);

    // Afficher le message user immédiatement (optimistic)
    const tempUserMsg: Message = {
      id: "temp-user",
      role: "USER",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          message: content,
        }),
      });

      const data = await res.json();

      if (res.status === 402) {
        setNoCredits(true);
        setMessages((prev) => prev.filter((m) => m.id !== "temp-user"));
        return;
      }

      if (!res.ok) throw new Error(data.error);

      // Remplacer le message temporaire par les vrais messages
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== "temp-user")
          .concat([data.userMessage, data.assistantMessage])
      );

      // Mettre à jour la session sélectionnée
      const sessionId = data.sessionId;
      if (!selectedSessionId) {
        setSelectedSessionId(sessionId);
      }

      // Rafraîchir la liste des sessions
      fetch(`/api/chat/sessions`)
        .then((r) => r.json())
        .then((d) => setSessions(d.sessions ?? []));
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m.id !== "temp-user"));
    } finally {
      setSending(false);
    }
  }

  // Envoyer avec Entrée (Shift+Entrée pour saut de ligne)
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex min-h-screen overflow-hidden">
        {/* Liste des conversations - Desktop */}
        <div className="hidden md:flex w-72 border-r border-[var(--border)] flex-col bg-[var(--card-bg)]">
          <div className="p-4 border-b border-[var(--border)]">
            <button
              onClick={handleNewSession}
              className="w-full gradient-primary text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle conversation
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingSessions ? (
              <div className="flex justify-center p-8">
                <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-center text-[var(--muted)] text-sm p-8">
                Aucune conversation
              </p>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`w-full p-4 text-left hover:bg-[var(--background)] transition-colors border-b border-[var(--border)] ${
                    selectedSessionId === session.id ? "bg-[var(--background)]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{session.title}</p>
                      <p className="text-xs text-[var(--muted)]">{formatTime(session.updatedAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Zone principale */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <header className="bg-[var(--card-bg)] border-b border-[var(--border)] px-4 py-3 flex items-center gap-4 flex-shrink-0">
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
              <h2 className="font-bold">{selectedSession?.title ?? "Coach AI"}</h2>
              <p className="text-xs text-[var(--success)] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                En ligne
              </p>
            </div>
          </header>

          {/* Mobile chat list */}
          {chatListOpen && (
            <div className="md:hidden bg-[var(--card-bg)] border-b border-[var(--border)] p-3 space-y-2 flex-shrink-0">
              <button
                onClick={handleNewSession}
                className="w-full gradient-primary text-white font-medium py-2 px-4 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouvelle conversation
              </button>
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => { setSelectedSessionId(session.id); setChatListOpen(false); }}
                  className={`w-full p-3 text-left rounded-xl transition-colors ${
                    selectedSessionId === session.id
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "hover:bg-[var(--background)]"
                  }`}
                >
                  <p className="font-medium text-sm truncate">{session.title}</p>
                  <p className="text-xs text-[var(--muted)]">{formatTime(session.updatedAt)}</p>
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!selectedSessionId && !loadingMessages && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Bonjour {user?.name?.split(" ")[0]} !</h3>
                  <p className="text-[var(--muted)] text-sm mt-1">
                    Démarre une nouvelle conversation ou sélectionnes-en une existante.
                  </p>
                </div>
                <button
                  onClick={handleNewSession}
                  className="gradient-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  Démarrer une conversation
                </button>
              </div>
            )}

            {loadingMessages && (
              <div className="flex justify-center p-8">
                <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {messages
              .filter((m) => m.role !== "SYSTEM" as string)
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.role === "USER"
                        ? "gradient-primary text-white rounded-br-md"
                        : "bg-[var(--card-bg)] border border-[var(--border)] rounded-bl-md"
                    }`}
                  >
                    <div
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                    />
                    <p className={`text-xs mt-2 ${msg.role === "USER" ? "text-white/70" : "text-[var(--muted)]"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

            {/* Indicateur de frappe */}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-[var(--card-bg)] border-t border-[var(--border)] p-4 flex-shrink-0">
            {noCredits && (
              <div className="mb-3 p-3 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-xl text-sm text-[var(--accent)] text-center">
                Crédits épuisés.{" "}
                <Link href="/subscription" className="font-medium underline">
                  Passer à un plan supérieur
                </Link>
              </div>
            )}
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-[var(--background)] rounded-2xl border border-[var(--border)] focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:border-transparent transition-all">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écris ton message... (Entrée pour envoyer)"
                  rows={1}
                  disabled={sending || !user || (!selectedSessionId && sessions.length > 0)}
                  className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none max-h-32 disabled:opacity-50"
                  style={{ minHeight: "48px" }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!message.trim() || sending || !user}
                className={`p-3 rounded-xl transition-all ${
                  message.trim() && !sending && user
                    ? "gradient-primary text-white hover:opacity-90"
                    : "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
                }`}
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-[var(--muted)] text-center mt-2">
              {remainingCredits === -1
                ? "Crédits illimités"
                : `${remainingCredits} crédit${remainingCredits !== 1 ? "s" : ""} restant${remainingCredits !== 1 ? "s" : ""}`}{" "}
              •{" "}
              <Link href="/subscription" className="text-[var(--primary)] hover:underline">
                Obtenir plus
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ChatPageInner />
    </Suspense>
  );
}
