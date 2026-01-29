import React, { useState, useEffect, useRef } from 'react';
import { GroqOrchestrator, ProjectIntent } from './lib/groq';
import { supabase } from './lib/supabase';
import {
    MessageSquare,
    Zap,
    Image as ImageIcon,
    Search,
    Plus,
    Settings,
    Send,
    Loader2,
    Tag,
    Hash,
    LogOut,
    User as UserIcon,
    Trash2,
    Pin,
    Volume2,
    VolumeX,
    Square,
    Pencil,
    Check,
    X,
    Menu,
    Copy,
    Download,
    ChevronDown,
    Sparkles,
    Terminal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import download from 'downloadjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Message {
    id?: string;
    chat_id?: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at?: string;
}

interface Chat {
    id: string;
    title: string;
    user_id: string;
    created_at: string;
    is_pinned: boolean;
}

function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });
                if (error) throw error;
                if (!error) {
                    alert('Account created! You can now sign in.');
                    setIsSignUp(false);
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-10 rounded-[2.5rem] w-full max-w-md text-center space-y-8 z-10 shadow-2xl border-white/10"
            >
                <div className="space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20 shadow-lg shadow-primary/5">
                        <Zap className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-white tracking-tight">Welcome to EvoLLM</h1>
                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                            Experience the next generation of AI-driven productivity.
                            Fast, secure, and infinitely capable.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleAuth} className="space-y-5 text-left">
                    <AnimatePresence mode='wait'>
                        {isSignUp && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                                    placeholder="John Doe"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white hover:bg-primary/90 py-4 px-6 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
                        <Zap className="w-4 h-4 group-hover:fill-current transition-all" />
                    </button>
                </form>

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                    <p className="text-[10px] text-muted-foreground/50 leading-relaxed px-4">
                        By continuing, you agree to EvoLLM's Terms of Service and acknowledge you have read our Privacy Policy.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

const MODELS = [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', desc: 'Powerful & Versatile', icon: '🦙' },
];

function CodeBlock({ node, inline, className, children, ...props }: any) {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const content = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (inline) {
        return <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary font-mono text-[13px]" {...props}>{children}</code>;
    }

    return (
        <div className="my-6 rounded-2xl overflow-hidden border border-white/5 bg-[#0d0d0d] group/code shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {language || 'Code'}
                    </span>
                </div>
                <CopyToClipboard text={content} onCopy={handleCopy}>
                    <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/5 transition-all outline-none">
                        {copied ? (
                            <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Copied</span></>
                        ) : (
                            <><Copy className="w-3.5 h-3.5 text-muted-foreground group-hover/code:text-white transition-colors" /><span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider group-hover/code:text-white transition-colors">Copy</span></>
                        )}
                    </button>
                </CopyToClipboard>
            </div>
            <div className="p-4 overflow-x-auto custom-scrollbar">
                <code className={className} {...props}>
                    {children}
                </code>
            </div>
        </div>
    );
}

export default function App() {
    const [session, setSession] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chats, setChats] = useState<Chat[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [orchestrator] = useState(() => new GroqOrchestrator(import.meta.env.VITE_GROQ_API_KEY || ''));
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const creatingChatId = useRef<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | undefined>(undefined);
    const [editContent, setEditContent] = useState('');
    const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            setSession(currentSession);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (session) {
            loadChats();
        }
    }, [session]);

    useEffect(() => {
        if (activeChatId) {
            if (creatingChatId.current === activeChatId) {
                creatingChatId.current = null;
                return;
            }
            loadMessages(activeChatId);
        } else {
            setMessages([]);
        }
    }, [activeChatId]);

    const loadChats = async () => {
        const { data, error } = await supabase
            .from('chats')
            .select('*')
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) console.error('Error loading chats:', error);
        else setChats(data || []);
    };

    const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation();
        const { error } = await supabase.from('chats').delete().eq('id', chatId);
        if (error) console.error('Error deleting chat:', error);
        else {
            if (activeChatId === chatId) {
                setActiveChatId(undefined);
                setMessages([]);
            }
            loadChats();
        }
    };

    const handlePinChat = async (e: React.MouseEvent, chat: Chat) => {
        e.stopPropagation();
        const pinnedCount = chats.filter(c => c.is_pinned).length;

        if (!chat.is_pinned && pinnedCount >= 3) {
            alert('Limit reached: You can only pin up to 3 chats.');
            return;
        }

        const { error } = await supabase
            .from('chats')
            .update({ is_pinned: !chat.is_pinned })
            .eq('id', chat.id);

        if (error) console.error('Error pinning chat:', error);
        else loadChats();
    };

    const loadMessages = async (chatId: string) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        if (error) console.error('Error loading messages:', error);
        else setMessages(data || []);
    };

    const handleNewChat = async () => {
        setActiveChatId(undefined);
        setMessages([]);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handlePaste = (e: React.ClipboardEvent) => {
        if (e.clipboardData.files && e.clipboardData.files.length > 0) {
            e.preventDefault();
        }
    };

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsTyping(false);
        }
    };

    const handleReadAloud = (text: string, msgId: string) => {
        if (isSpeaking === msgId) {
            window.speechSynthesis.cancel();
            setIsSpeaking(null);
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(null);
        setIsSpeaking(msgId);
        window.speechSynthesis.speak(utterance);
    };

    const handleEditPrompt = (msg: Message) => {
        setEditingMessageId(msg.id || msg.content);
        setEditContent(msg.content);
    };

    const handleExport = async () => {
        if (messages.length === 0) return;
        const activeChat = chats.find(c => c.id === activeChatId);
        const title = activeChat?.title || 'EvoLLM_Conversation';

        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let cursorY = 20;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(110, 50, 250); // Primary color
        doc.text('EvoLLM Conversation', margin, cursorY);
        cursorY += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Title: ${title}`, margin, cursorY);
        cursorY += 15;

        messages.forEach((m, idx) => {
            if (cursorY > 270) {
                doc.addPage();
                cursorY = 20;
            }

            // Role Badge
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            const isUser = m.role === 'user';
            doc.setTextColor(isUser ? 60 : 110, isUser ? 60 : 50, isUser ? 60 : 250);
            doc.text(isUser ? 'YOU' : 'EVOLLM', margin, cursorY);
            cursorY += 6;

            // Content
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(40, 40, 40);

            const splitText = doc.splitTextToSize(m.content, pageWidth - (margin * 2));
            doc.text(splitText, margin, cursorY);
            cursorY += (splitText.length * 5) + 12;

            // Separator line
            doc.setDrawColor(240, 240, 240);
            doc.line(margin, cursorY - 6, pageWidth - margin, cursorY - 6);
        });

        doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
    };

    const handleSaveEdit = async (msg: Message) => {
        if (!editContent.trim() || editContent === msg.content) {
            setEditingMessageId(undefined);
            return;
        }

        // 1. Delete all messages after this one in the current chat
        const msgIndex = messages.findIndex(m => m.id === msg.id || m.content === msg.content);
        const newMessages = messages.slice(0, msgIndex);
        setMessages(newMessages);

        // 2. Set input to the edited content and trigger send
        setInput(editContent);
        setEditingMessageId(undefined);
        // Wait a bit for state to update
        setTimeout(() => handleSend(editContent), 100);
    };

    const handleSend = async (overrideInput?: string) => {
        const currentInput = overrideInput || input;
        if (!currentInput.trim() || !session) return;

        if (!overrideInput) setInput('');

        // Abort previous generation if any
        handleStopGeneration();
        abortControllerRef.current = new AbortController();

        let chatId = activeChatId;

        if (!chatId) {
            const { data, error } = await supabase
                .from('chats')
                .insert([{
                    title: currentInput.slice(0, 40) + (currentInput.length > 40 ? '...' : ''),
                    user_id: session.user.id,
                    is_pinned: false
                }])
                .select()
                .single();

            if (error) {
                console.error('Error creating chat:', error);
                return;
            }
            chatId = data.id;
            creatingChatId.current = chatId;
            setActiveChatId(chatId);
            setChats(prev => [data, ...prev]);
        }

        const userMessage: Message = { role: 'user', content: currentInput, chat_id: chatId };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Save user message
        await supabase.from('messages').insert([userMessage]);

        let assistantMessage: Message = { role: 'assistant', content: '', chat_id: chatId };
        setMessages(prev => [...prev, assistantMessage]);

        try {
            const stream = orchestrator.streamChat(currentInput, 'llama-3.3-70b-versatile');

            let fullContent = '';
            for await (const chunk of stream) {
                if (abortControllerRef.current?.signal.aborted) break;
                fullContent += chunk.content;
                assistantMessage = { ...assistantMessage, content: fullContent };
                setMessages(prev => [...prev.slice(0, -1), assistantMessage]);
            }

            if (!abortControllerRef.current?.signal.aborted) {
                // Save assistant message and get back the ID
                const { data: savedMsg, error: saveError } = await supabase
                    .from('messages')
                    .insert([assistantMessage])
                    .select()
                    .single();

                if (!saveError && savedMsg) {
                    setMessages(prev => {
                        const newMsgs = [...prev];
                        newMsgs[newMsgs.length - 1] = { ...assistantMessage, id: savedMsg.id };
                        return newMsgs;
                    });
                }
            }

        } catch (error: any) {
            console.error('Generation Error:', error);
            const errorMessage: Message = {
                role: 'system',
                content: `Error: ${error.message || 'Failed to generate response. Please check your connection or API key.'}`,
                chat_id: chatId || undefined
            };
            setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        } finally {
            setIsTyping(false);
            abortControllerRef.current = null;
        }
    };

    if (!session) {
        return <Login onLogin={() => { }} />;
    }

    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-80 border-r border-border bg-black/40 backdrop-blur-xl flex flex-col z-50 transition-transform duration-300 lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-4 flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        EvoLLM
                    </h1>
                </div>

                <button
                    onClick={handleNewChat}
                    className="mx-4 mb-3 flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-dashed border-border hover:bg-white/5 transition-colors group shrink-0"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    New Chat
                </button>

                <div className="mx-4 mb-4 relative shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search chats..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-relaxed"
                    />
                </div>

                <nav className="px-2 space-y-1 overflow-y-auto flex-1">
                    {filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => {
                                setActiveChatId(chat.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${activeChatId === chat.id ? 'bg-primary/20 text-primary-foreground border border-primary/20' : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <MessageSquare className={`w-4 h-4 shrink-0 ${activeChatId === chat.id ? 'text-primary' : ''}`} />
                            <span className="text-sm truncate font-medium flex-1 pr-12">{chat.title}</span>

                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => handlePinChat(e, chat)}
                                    className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${chat.is_pinned ? 'text-primary' : 'text-muted-foreground'}`}
                                >
                                    <Pin className={`w-3.5 h-3.5 ${chat.is_pinned ? 'fill-primary' : ''}`} />
                                </button>
                                <button
                                    onClick={(e) => handleDeleteChat(e, chat.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {chat.is_pinned && activeChatId !== chat.id && (
                                <Pin className="absolute right-3 w-3 h-3 text-primary/40 fill-primary/20" />
                            )}
                        </div>
                    ))}
                    {filteredChats.length === 0 && (
                        <div className="text-center py-8 opacity-30 text-xs">
                            No chats found
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-border relative">
                    <AnimatePresence>
                        {isSettingsOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-16 left-4 right-4 glass-panel p-2 rounded-2xl shadow-2xl z-20 border-white/10"
                            >
                                <div className="p-3 border-b border-white/5 mb-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account</p>
                                    <p className="text-sm truncate text-white font-semibold">{session.user.user_metadata?.full_name || 'User'}</p>
                                    <p className="text-[10px] truncate text-muted-foreground">{session.user.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors text-sm font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors ${isSettingsOpen ? 'bg-white/5' : ''}`}
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-[10px] font-bold">
                            {(session.user.user_metadata?.full_name?.[0] || session.user.email?.[0] || '?').toUpperCase()}
                        </div>
                        <span className="text-sm font-medium flex-1 truncate">
                            {session.user.user_metadata?.full_name || 'Settings'}
                        </span>
                        <Settings className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative min-w-0">
                {/* Header Tabs */}
                <header className="h-16 border-b border-border flex items-center px-4 lg:px-6 glass-panel z-30 shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-1 mr-2 rounded-xl hover:bg-white/5 lg:hidden"
                        aria-label="Toggle Menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-accent/50 p-1 rounded-xl">
                            <div className="flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-lg text-xs lg:text-sm font-medium bg-primary text-primary-foreground shadow-lg">
                                <MessageSquare className="w-4 h-4" />
                                Chat
                            </div>
                        </div>

                        {messages.length > 0 && (
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-all outline-none"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Export PDF
                            </button>
                        )}
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
                        <AnimatePresence initial={false}>
                            {messages.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-[75vh] flex flex-col items-center justify-center text-center px-6"
                                >
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10">
                                            <Zap className="w-12 h-12 text-primary animate-pulse" />
                                        </div>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full z-[-1]"
                                        />
                                    </div>
                                    <div className="max-w-md space-y-4">
                                        <h3 className="text-3xl lg:text-4xl font-heading font-black text-white tracking-tight">EvoLLM Superintelligence</h3>
                                        <p className="text-sm lg:text-base text-muted-foreground leading-relaxed font-medium">
                                            How can I accelerate your productivity today? 
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-12 max-w-2xl w-full">
                                        {[
                                            { text: "Help me architect a scalable React app", icon: "🏗️" },
                                            { text: "Explain Quantum Computing in 2026", icon: "⚛️" },
                                            { text: "Draft a high-impact technical proposal", icon: "📄" },
                                            { text: "Research the latest AI trends in robotics", icon: "🤖" },
                                        ].map((suggest, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    handleSend(suggest.text);
                                                }}
                                                className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all text-left group"
                                            >
                                                <span className="text-xl group-hover:scale-110 transition-transform">{suggest.icon}</span>
                                                <span className="text-sm font-semibold text-muted-foreground group-hover:text-white transition-colors">{suggest.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-8">
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg.id || i}
                                            className={`flex group/msg ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className="flex flex-col gap-2 max-w-[85%]">
                                                <div className={`relative ${msg.role === 'user' ? 'message-user' : 'message-assistant'} shadow-xl`}>
                                                    {msg.role === 'user' && editingMessageId === (msg.id || msg.content) ? (
                                                        <div className="space-y-3 p-1 min-w-[300px]">
                                                            <textarea
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none"
                                                                autoFocus
                                                            />
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => setEditingMessageId(null)}
                                                                    className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-xs font-medium flex items-center gap-1"
                                                                >
                                                                    <X className="w-3.5 h-3.5" /> Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => handleSaveEdit(msg)}
                                                                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium flex items-center gap-1"
                                                                >
                                                                    <Check className="w-3.5 h-3.5" /> Save & Submit
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-[15px] prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-table:border prose-table:border-white/10 prose-th:bg-white/5 prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-white/10">
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkGfm]}
                                                                components={{
                                                                    code: CodeBlock
                                                                }}
                                                            >
                                                                {msg.content}
                                                            </ReactMarkdown>
                                                            {msg.role === 'assistant' && !msg.content && (
                                                                <div className="flex items-center gap-2 text-muted-foreground py-1">
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    <span className="text-xs font-medium tracking-wide uppercase">Thinking...</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Message Actions */}
                                                <div className={`flex items-center gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                    {msg.role === 'user' && !editingMessageId && (
                                                        <button
                                                            onClick={() => handleEditPrompt(msg)}
                                                            className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors hover:text-white"
                                                            title="Edit Prompt"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    {msg.role === 'assistant' && msg.content && (
                                                        <button
                                                            onClick={() => handleReadAloud(msg.content, msg.id || i.toString())}
                                                            className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${isSpeaking === (msg.id || i.toString()) ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
                                                            title={isSpeaking === (msg.id || i.toString()) ? "Stop Reading" : "Read Aloud"}
                                                        >
                                                            {isSpeaking === (msg.id || i.toString()) ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </AnimatePresence>
                    </div>
                </div>

                {/* Input Bar */}
                <div className="p-4 lg:p-6 pb-6 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.5)]">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <div className="glass-panel p-2 rounded-2xl flex items-end gap-2 focus-within:ring-1 focus-within:ring-primary transition-all shadow-2xl">
                            <textarea
                                value={input}
                                onPaste={handlePaste}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent border-none focus:outline-none resize-none py-2 px-1 text-[15px] max-h-32 min-h-[40px] leading-relaxed"
                                rows={1}
                            />
                            <button
                                onClick={isTyping ? handleStopGeneration : handleSend}
                                disabled={(!input.trim() && !isTyping)}
                                className={`p-2.5 rounded-xl transition-all group shadow-lg ${isTyping ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                            >
                                {isTyping ? (
                                    <Square className="w-5 h-5 fill-current" />
                                ) : (
                                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                )}
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-muted-foreground mt-3">
                            EvoLLM is powered with Groq © Akarsh
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
