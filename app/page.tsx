"use client";
import { useRef, useState } from "react";
import ChatForm from "@/components/ChatForm";
import ChatPreview from "@/components/ChatPreview";
import { ChatState } from "@/src/lib/types";
import html2canvas from "html2canvas";

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
  const exportRef = useRef<HTMLDivElement>(null);

  const formSetState = (updater: (s: ChatState) => ChatState) =>
    setState((s) => updater(s));

  async function handleDownload() {
    const node = exportRef.current;
    if (!node) return;

    // Temporarily show the export preview
    node.style.display = "block";

    await new Promise((r) => setTimeout(r, 50)); // give layout a tick

    const canvas = await html2canvas(node, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: node.clientWidth,
      windowHeight: node.clientHeight,
    });

    const a = document.createElement("a");
    a.download = "fake-whatsapp-chat.png";
    a.href = canvas.toDataURL("image/png");
    a.click();

    node.style.display = "none";
  }

  return (
    <div className="grid md:grid-cols-[1fr_auto] gap-6">
      <ChatForm state={state} setState={formSetState} />

      <div>
        {/* Smaller on-screen preview */}
        <ChatPreview state={state} previewRef={liveRef} frame="glass" exportSize={{ w: 320, h: 640 }} />
        <button className="btn mt-4" onClick={handleDownload}>
          Download Image
        </button>
      </div>

      {/* Hidden export surface (full size, no glass) */}
      <div
        ref={exportRef}
        style={{
          width: 390,
          height: 760,
          position: "fixed",
          left: "-10000px",
          top: "0",
          opacity: 0,
          pointerEvents: "none",
          display: "none",
        }}
      >
        <ChatPreview state={state} previewRef={{ current: null }} frame="none" exportSize={{ w: 390, h: 760 }} />
      </div>
    </div>
  );
}
