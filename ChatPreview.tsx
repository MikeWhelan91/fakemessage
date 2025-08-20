"use client";
import { ChatMessage, ChatState } from "@/src/lib/types";
import Image from "next/image";

export default function ChatPreview({
  state,
  messages,
}: {
  state: ChatState;
  messages: ChatMessage[];
}) {
  return (
    <div className="w-full h-full bg-wpDarkBg flex flex-col">
      {/* Header */}
      <div className="bg-wpDarkHeader h-14 flex items-center px-3 text-white">
        <button className="mr-3">&lt;</button>
        <Image
          src={state.header.avatar || "/default-avatar.png"}
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full mr-3"
        />
        <div className="flex flex-col flex-1">
          <span className="font-semibold">{state.header.name || "Contact"}</span>
          <span className="text-xs text-neutral-300">{state.header.status || "last seen today at 19:17"}</span>
        </div>
        <div className="flex gap-4 text-xl">📞 🎥</div>
      </div>

      {/* Messages area */}
      <div className="flex-1 bg-wpDarkBg bg-[url('/wallpaper.png')] bg-repeat p-3 overflow-y-auto">
        <div className="flex justify-center my-2">
          <span className="bg-neutral-700 text-white text-xs px-3 py-1 rounded-full">Today</span>
        </div>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} my-1`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 rounded-lg text-sm text-white ${
                msg.sender === "me" ? "bg-wpOutgoing" : "bg-wpIncoming"
              }`}
            >
              {msg.text}
              <div className="flex justify-end text-[10px] mt-1 opacity-70">
                {msg.timestamp || "13:37"}
                {msg.sender === "me" && (
                  <span className="ml-1">
                    {msg.status === "sent" ? "✓" : msg.status === "delivered" ? "✓✓" : "✓✓ (blue)"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="h-14 bg-wpDarkHeader flex items-center px-3 text-white">
        <span className="text-xl mr-3">＋</span>
        <div className="flex-1 bg-neutral-800 rounded-full px-3 py-2 text-neutral-400">
          Message
        </div>
        <span className="text-xl ml-3">🎤</span>
      </div>
    </div>
  );
}
