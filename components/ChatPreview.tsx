'use client';
import { ChatState, ChatMessage } from '@/src/lib/types';
import DeviceFrame from '@/components/DeviceFrame';
import { DoubleTick, SingleTick } from './icons/Ticks';
import cn from 'classnames';

type FrameMode = 'glass' | 'none'; // "glass" = pretty on-screen, "none" = export surface

function StatusBar({ time, carrier, connection, battery, charging }:{
  time:string; carrier:string; connection:string; battery:number; charging:boolean;
}) {
  return (
    <div className="relative h-7 bg-[#F2F3F5] text-[12px] text-black/80">
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 leading-none">
        <span className="uppercase leading-none">{carrier}</span>
        <span className="leading-none">{connection}</span>
        <div className="flex items-center gap-1 leading-none">
          <div className="w-5 h-2.5 border border-black/70 rounded-[3px] relative flex items-center">
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-1 h-1.5 bg-black/70 rounded-sm" />
            <div className="h-full bg-black/80" style={{width:`${Math.max(0,Math.min(100,battery))}%`}} />
          </div>
          {charging && <span title="charging">⚡</span>}
        </div>
      </div>
      <div className="flex h-full items-center justify-center tracking-tight leading-none">
        {time}
      </div>
    </div>
  );
}
function NavBarIOS({ name, subtitle, avatar }:{
  name:string; subtitle:string; avatar:string|null;
}) {
  return (
    <div className="h-12 px-2 flex items-center justify-between bg-[#F2F3F5] border-b border-black/10">
      <div className="flex items-center gap-1 text-[16px] text-[#007AFF] font-medium">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Chats</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 text-center leading-tight">
        <div className="text-[17px] font-semibold text-neutral-900">{name || 'Contact'}</div>
        <div className="text-[12px] text-[#00A884]">{subtitle}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-neutral-300 overflow-hidden">
          {avatar && <img src={avatar} alt="contact avatar" className="w-full h-full object-cover" />}
        </div>
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-neutral-600">
          <path fill="currentColor" d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"/>
        </svg>
      </div>
    </div>
  );
}

function Tail({ me, color }:{ me:boolean; color:string }) {
  return (
    <svg width="14" height="14" className={me ? 'absolute -right-1 bottom-2' : 'absolute -left-1 bottom-2'}>
      <path d={me ? 'M0,14 C7,7 9,5 14,0 L14,14 Z' : 'M14,14 C7,7 5,5 0,0 L0,14 Z'} fill={color} />
    </svg>
  );
}

function Bubble({ m }: { m: ChatMessage }) {
  const isMe = m.sender === 'me';
  const bg = isMe ? '#DCF8C6' : '#FFFFFF';
  const cls = cn(
    'relative inline-block rounded-[18px] px-3.5 py-2.5 text-[16px] leading-[1.33] whitespace-pre-wrap break-words',
    'shadow-[0_1px_0_rgba(0,0,0,.10)]'
  );
  return (
    <div className={cn('w-full flex', isMe ? 'justify-end pr-1' : 'justify-start pl-2')}>
      <div className="max-w-[78%]">
        <div className={cls} style={{ background: bg, color: '#111B21' }}>
          <Tail me={isMe} color={bg} />
          {m.kind === 'text' && <span>{m.text}</span>}
          {m.kind === 'image' && m.imageDataUrl && <img src={m.imageDataUrl} className="rounded-xl max-w-full h-auto" alt="chat message image" />}
          <div className="mt-1 flex items-center gap-1 justify-end text-[12px] text-[#667781] select-none">
            <span>{m.timestamp}</span>
            {isMe && (<>{m.status === 'sent' && <SingleTick className="w-3.5 h-3.5 text-[#8899a6]" />}{m.status === 'delivered' && <DoubleTick className="w-4 h-4" />}{m.status === 'read' && <DoubleTick className="w-4 h-4" blue />}</>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPreview({
  state,
  previewRef,
  frame = 'glass',
  exportSize = { w: 390, h: 760 }
}: {
  state: ChatState;
  previewRef:
    | React.MutableRefObject<HTMLDivElement | null>
    | React.RefObject<HTMLDivElement>;
  frame?: FrameMode;
  exportSize?: { w: number; h: number };
}) {
  const {
    header: {
      contactName, onlineMode, lastSeenText, phoneTime, carrier,
      connection, batteryPercent, charging, avatarDataUrl, wallpaper
    },
    messages
  } = state;

  const subtitle =
    onlineMode === 'online' ? 'online' :
    onlineMode === 'typing…' ? 'typing…' :
    lastSeenText ? `last seen ${lastSeenText}` : 'last seen today';

  // WhatsApp inner UI (no outer frame)
  const Inner = (
    <div className="relative w-full h-full flex flex-col">
      {/* wallpaper */}
      <div
        className={cn(
          'absolute inset-0 bg-[#ECE5DD]',
          wallpaper === 'paper'
            ? 'bg-[url("/wallpapers/whatsapp-light.jpg")] bg-repeat bg-[length:480px_480px]'
            : ''
        )}
        aria-hidden
      />
      {/* bars */}
      <div className="relative z-[1]">
        <StatusBar
          time={phoneTime}
          carrier={carrier}
          connection={connection}
          battery={batteryPercent}
          charging={charging}
        />
        <NavBarIOS name={contactName} subtitle={subtitle} avatar={avatarDataUrl} />
      </div>
      {/* messages */}
      <div
        className="relative z-[1] flex-1 overflow-y-auto px-3 pt-3 pb-16"
        data-scrollable
      >
        <div className="flex flex-col gap-[6px]">
          {messages.map((m) => <Bubble key={m.id} m={m} />)}
        </div>
      </div>
      {/* input */}
      <div className="absolute left-0 right-0 bottom-0 z-[1] flex items-center gap-2 px-3 py-3 bg-white border-t border-neutral-200">
        <div
          className="w-10 h-10 rounded-full border border-wpTickBlue bg-white flex items-center justify-center text-wpTickBlue"
          aria-label="add attachment"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </div>
        <div className="flex-1 h-11 rounded-2xl bg-white border border-neutral-200 shadow-[0_1px_0_rgba(0,0,0,.08)] flex items-center px-3 text-neutral-400">
          Message
        </div>
        <div
          className="w-10 h-10 rounded-full border border-wpTickBlue bg-white flex items-center justify-center text-wpTickBlue"
          aria-label="record voice message"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1.5a3 3 0 00-3 3v6a3 3 0 006 0v-6a3 3 0 00-3-3z" />
            <path d="M19.5 10.5a7.5 7.5 0 01-15 0" />
            <path d="M12 19.5v3m0 0h3m-3 0H9" />
          </svg>
        </div>
      </div>
    </div>
  );

  if (frame === 'glass') {
    // On-screen preview (smaller, framed)
    const width = exportSize.w;
    const height = Math.round((width * 926) / 428);
    return (
      <div
        ref={previewRef as React.RefObject<HTMLDivElement>}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          ['--phone-w' as any]: `${width}px`,
        }}
        className="relative"
      >
        <DeviceFrame>{Inner}</DeviceFrame>
      </div>
    );
  }

  // Export surface (exact px size, no frame)
  return (
    <div
      ref={previewRef as React.RefObject<HTMLDivElement>}
      style={{ width: `${exportSize.w}px`, height: `${exportSize.h}px` }}
      className="relative bg-white overflow-hidden"
    >
      {Inner}
    </div>
  );
}