"use client";
import { useRef, useState } from 'react';
import ChatForm from '@/components/ChatForm';
import ChatPreview from '@/components/ChatPreview';
import { ChatState } from '@/src/lib/types';
import { exportNodeToPNG } from '@/src/lib/exportToPng';

const defaultState: ChatState = {
  header: {
    contactName: "Johnny Doe",
    onlineMode: "online",
    lastSeenText: "",
    phoneTime: "9:41 AM",
    carrier: "vodafone",
    connection: "Wi-Fi",
    batteryPercent: 78,
    charging: false,
    wallpaper: "paper",
    avatarDataUrl: null,
  },
  messages: [],
};

export default function Page() {
  const [state, setState] = useState<ChatState>(defaultState);
  const previewRef = useRef<HTMLDivElement>(null);

  const formSetState = (updater: (s: ChatState) => ChatState) =>
    setState((s) => updater(s));

  async function handleDownload() {
    const node = previewRef.current;
    if (!node) return;

    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    const blob = await exportNodeToPNG(node, 2);

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = 'pretendchat-whatsapp-chat.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-center text-[#00A884]">
        PretendChat
      </h1>
      <div className="grid md:grid-cols-[1fr_auto] gap-6">
        <ChatForm state={state} setState={formSetState} />
        <div className="flex flex-col items-center">
          <ChatPreview
            state={state}
            previewRef={previewRef}
            exportSize={{ w: 320, h: 693 }}
          />
          <button
            className="mt-4 rounded-md bg-[#00A884] px-4 py-2 text-sm font-medium text-white hover:bg-[#029e70]"
            onClick={handleDownload}
          >
            Download Image
          </button>
        </div>
      </div>
    </main>
  );
}
