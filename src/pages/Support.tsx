import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_CONFIG } from '../config';
import { MOCK_FAQS } from '../data/mock';

export const Support: React.FC = () => {
  const { showToast, user } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ sender: 'agent' | 'user'; text: string; time: string }[]>([
    {
      sender: 'agent',
      text: `Hello ${user.name.split(' ')[0]}! Welcome to Safar 24x7 Priority Desk. How can we assist your journey today?`,
      time: 'Just now',
    },
  ]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const cannedReplies: Record<string, string> = {
    'Where is my chauffeur?':
      'Chauffeurs reach pickup spots 15 minutes prior to scheduled departure. You can track real-time vehicle telemetry via the My Trips tab.',
    'How does Zero-Cancellation work?':
      'Pay only ₹199 advance. If you cancel up to 60 minutes before scheduled pickup, 100% of the advance is instantly refunded to your original payment method.',
    'I need an invoice copy':
      'All GST compliant invoices are permanently stored under My Trips → Completed Trips. You can download PDF receipts anytime.',
  };

  const handleSendChat = (text: string) => {
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      let reply = 'Thank you for reaching out. Our highway operations desk has logged your request and a priority responder is assisting.';
      for (const [key, val] of Object.entries(cannedReplies)) {
        if (text.toLowerCase().includes(key.toLowerCase().slice(0, 10))) {
          reply = val;
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[15px]">support_agent</span>
            <span>24x7 Transit Care &amp; SOS</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">
            Customer Support &amp; Help Desk
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Direct access to highway control rooms, roadside puncture units, and transit telematics supervisors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="h-12 px-6 rounded-2xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center gap-2 shadow-md transition-all cursor-pointer font-bold self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>Start Live Chat</span>
        </button>
      </div>

      {/* Emergency & Helpline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Direct Toll Free */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-low flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">call</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                Direct Toll-Free
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                {APP_CONFIG.tollFreeHelpline}
              </h3>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Instant assistance for on-route flight delays, airport gate pickup assistance, and chauffeur coordination.
          </p>
          <a
            href={`tel:${APP_CONFIG.tollFreeHelpline}`}
            onClick={(e) => {
              e.preventDefault();
              showToast(`Connecting to ${APP_CONFIG.tollFreeHelpline}...`);
            }}
            className="w-full h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-colors no-underline font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>Call Operator</span>
          </a>
        </div>

        {/* Card 2: Roadside Assistance */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-low flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">car_repair</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase font-bold tracking-wider">
                15-Min Response
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Roadside Assistance
              </h3>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Express tire puncture, battery jumpstart, and vehicle replacement standby fleet on major national corridors.
          </p>
          <button
            type="button"
            onClick={() => showToast('Highway mobile unit alert acknowledged by desk')}
            className="w-full h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-colors cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">build</span>
            <span>Request Road Support</span>
          </button>
        </div>

        {/* Card 3: Emergency SOS */}
        <div className="bg-gradient-to-br from-error-container/40 to-surface-container-lowest rounded-3xl p-6 shadow-sm border border-error/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-error text-on-error flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">sos</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-error uppercase font-bold tracking-wider">
                Priority Police &amp; SOS
              </span>
              <h3 className="font-headline-sm text-headline-sm text-error font-bold">
                Emergency Hotline
              </h3>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Directly routes to regional police telematics and sends real-time coordinates to trusted guardians.
          </p>
          <button
            type="button"
            onClick={() => showToast('EMERGENCY SOS: Central Dispatch & Guardians Alerted!')}
            className="w-full h-11 rounded-xl bg-error hover:bg-error/90 text-on-error font-label-md text-label-md flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
            <span>Trigger SOS Alert</span>
          </button>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container-low space-y-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
            Frequently Asked Questions
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Everything you need to know about our guaranteed tariffs, fleet certifications, and booking policies.
          </p>
        </div>

        <div className="divide-y divide-surface-container-low">
          {MOCK_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left gap-4 font-headline-sm text-headline-sm text-primary hover:text-secondary transition-colors cursor-pointer"
                >
                  <span className="font-semibold">{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-[24px] text-on-surface-variant transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-secondary' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed pl-1 pr-4 animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Chat Floating / Slide-out Panel */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-3xl bg-surface-container-lowest shadow-2xl border border-surface-container-low overflow-hidden flex flex-col h-[520px]">
          {/* Chat Header */}
          <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-on-secondary">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
              </div>
              <div>
                <h4 className="font-label-lg text-label-lg text-on-primary">Safar 24x7 Help Desk</h4>
                <div className="flex items-center gap-1.5 text-xs text-secondary-fixed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Supervisor Online</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-surface-container-lowest/20 flex items-center justify-center text-on-primary cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Canned suggestions chips */}
          <div className="p-2.5 bg-surface-container-low border-b border-surface-container flex gap-1.5 overflow-x-auto text-xs">
            {Object.keys(cannedReplies).map((query) => (
              <button
                key={query}
                type="button"
                onClick={() => handleSendChat(query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container text-primary font-semibold shadow-xs cursor-pointer"
              >
                {query}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-container-low/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-secondary text-on-secondary rounded-br-xs'
                      : 'bg-surface-container-lowest text-primary rounded-bl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-on-surface-variant px-1 mt-0.5">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat(chatInput);
            }}
            className="p-3 bg-surface-container-lowest border-t border-surface-container-low flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your trip, invoice..."
              className="flex-1 h-11 px-3.5 rounded-xl bg-surface-container-low text-primary text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
            />
            <button
              type="submit"
              className="h-11 px-4 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary-container transition-all cursor-pointer font-bold"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
