"use client";

import { useRef, useState } from "react";
import ChatForm from "@/components/ChatForm";
import ChatPreview from "@/components/ChatPreview";
import { ChatState } from "@/src/lib/types";
import { exportNodeToPNG } from "@/src/lib/exportToPng";

// One TRUE screen size for both live preview and export
const SCREEN_W = 300;
const SCREEN_H = Math.round(SCREEN_W * 2.2);
const PNG_SCALE = 2;

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
  const [state, setStateRaw] = useState<ChatState>(defaultState);

  // ChatForm wants a callback-style setter
  const setState = (updater: (s: ChatState) => ChatState) =>
    setStateRaw((s) => updater(s));

  const liveRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    const node = exportRef.current;
    if (!node) return;

    const prevDisp = node.style.display;
    const prevOp = node.style.opacity;
    node.style.display = "block";
    node.style.opacity = "1";

    try { await (document as any).fonts?.ready; } catch {}
    await new Promise((r) => requestAnimationFrame(r));

    // Make the export look like a phone screenshot (scrolled to bottom)
    const scroller = node.querySelector("[data-scrollable]") as HTMLElement | null;
    if (scroller) {
      scroller.scrollTop = scroller.scrollHeight;
      await new Promise((r) => requestAnimationFrame(r));
    }

    const blob = await exportNodeToPNG(node, PNG_SCALE);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pretendchat-whatsapp-chat.png";
    a.click();
    URL.revokeObjectURL(url);

    node.style.display = prevDisp || "none";
    node.style.opacity = prevOp || "0";
  }

  return (
    <main className="mx-auto max-w-7xl p-4 grid gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
      {/* left: form */}
      <ChatForm state={state} setState={setState} />

      {/* right: framed preview + download */}
      <aside className="sticky top-4 self-start">
        <ChatPreview
          state={state}
          previewRef={liveRef}
          frame="glass"
          exportSize={{ w: SCREEN_W, h: SCREEN_H }}
        />
        <button
          onClick={handleDownload}
          className="mt-4 w-full rounded-lg bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800"
        >
          Download Image
        </button>
      </aside>

      {/* hidden export surface: EXACT same screen size, no frame */}
      <div
        ref={exportRef}
        style={{
          width: SCREEN_W,
          height: SCREEN_H,
          position: "fixed",
          left: "-10000px",
          top: "0",
          opacity: 0,
          pointerEvents: "none",
          display: "none",
        }}
      >
        <ChatPreview
          state={state}
          previewRef={{ current: null }}
          frame="none"
          exportSize={{ w: SCREEN_W, h: SCREEN_H }}
        />
      </div>
    </main>
  );
}
