"use client";
import { useRef, useState } from "react";
import ChatForm from "@/components/ChatForm";
import ChatPreview from "@/components/ChatPreview";
import { ChatState } from "@/src/lib/types";
import { exportNodeToPNG } from "@/src/lib/exportToPng";

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
  showWatermark: true,
};

export default function Page() {
  const [state, setState] = useState<ChatState>(defaultState);

  const liveRef = useRef<HTMLDivElement>(null);

  const formSetState = (updater: (s: ChatState) => ChatState) =>
    setState((s) => updater(s));

  async function handleDownload() {
    const node = liveRef.current;
    if (!node) return;

    const blob = await exportNodeToPNG(node, 2);

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake-whatsapp-chat.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid md:grid-cols-[1fr_auto] gap-6">
      <ChatForm state={state} setState={formSetState} />

      <div>
        {/* Smaller on-screen preview */}
        <ChatPreview state={state} previewRef={liveRef} frame="glass" exportSize={{ w: 320, h: 693 }} />
        <button className="btn mt-4" onClick={handleDownload}>
          Download Image
        </button>
      </div>

    </div>
  );
}
