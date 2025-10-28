import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2, Pin, Send } from 'lucide-react';

// Define the shape of a message
interface Message {
  id: string;
  content: string;
  created_at: string;
  is_alert: boolean;
  sender_id: string;
  users: {
    full_name: string;
    userType: string;
  };
}

// --- The Chat Input Component ---
const ChatInput: React.FC<{ onSend: (content: string) => void }> = ({ onSend }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4 border-t border-divider">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 input mr-3"
      />
      <button type="submit" className="p-2 rounded-full bg-primary text-white">
        <Send size={20} />
      </button>
    </form>
  );
};

// --- The Message Bubble Component ---
const ChatMessage: React.FC<{ message: Message; isOwn: boolean }> = ({ message, isOwn }) => {
  const [showPin, setShowPin] = useState(false);
  const isLeader = message.users.userType === 'community_leader';

  const handlePin = () => {
    // TODO: Implement Pin Logic
    // await supabase.from('messages').update({ is_pinned: true }).eq('id', message.id)
    alert('Pinning message (simulated)!');
  };

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowPin(true)}
      onMouseLeave={() => setShowPin(false)}
    >
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-lg relative ${
          isOwn ? 'bg-primary text-white' : 'bg-surface text-text-primary'
        } ${message.is_alert ? 'border-2 border-error bg-error/10 text-error-dark' : ''}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold ${isLeader ? 'text-blue-300' : ''}">
            {isOwn ? 'You' : message.users.full_name} {isLeader && '(Leader)'}
          </span>
          {/* Pin Button (on hover) */}
          {showPin && (
            <button onClick={handlePin} className="ml-2 p-1 rounded-full hover:bg-black/20">
              <Pin size={14} />
            </button>
          )}
        </div>
        <p className="text-sm mt-1">{message.content}</p>
        <span className="text-xs opacity-70 mt-2 block text-right">
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

// --- The Main Chat Page Component ---
const CommunityChat: React.FC = () => {
  const { id: communityId } = useParams<{ id: string }>(); // Get community ID from URL
  const { user } = useAuth();
  const supabase = useSupabaseClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [communityName, setCommunityName] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  // Fetch initial data (community name and messages)
  useEffect(() => {
    const fetchData = async () => {
      if (!communityId) return;
      setLoading(true);

      // 1. Fetch community details
      const { data: communityData } = await supabase
        .from('communities')
        .select('name')
        .eq('id', communityId)
        .single();
      if (communityData) setCommunityName(communityData.name);

      // 2. Fetch messages
      const { data: messageData, error } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, is_alert, sender_id,
          users ( full_name, userType )
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: true });

      if (messageData) {
        setMessages(messageData as Message[]);
      } else {
        console.error('Error fetching messages:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [communityId, supabase]);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    if (!communityId) return;

    const channel = supabase
      .channel(`public:messages:community_id=eq.${communityId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `community_id=eq.${communityId}`
        },
        async (payload) => {
          // Need to fetch the full message with user info
          const { data, error } = await supabase
            .from('messages')
            .select(`
              id, content, created_at, is_alert, sender_id,
              users ( full_name, userType )
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (data) {
            setMessages(currentMessages => [...currentMessages, data as Message]);
          } else {
            console.error('Error fetching new message:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [communityId, supabase]);

  const handleSendMessage = async (content: string) => {
    if (!communityId || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        community_id: communityId,
        sender_id: user.id,
        content: content
      });

    if (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-128px)] card p-0">
      {/* Header */}
      <div className="p-4 border-b border-divider">
        <h2 className="text-xl font-bold text-text-primary">{communityName}</h2>
        {/* TODO: Add pinned messages here */}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} isOwn={msg.sender_id === user.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default CommunityChat;