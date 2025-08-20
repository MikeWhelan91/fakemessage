'use client';
import { useId } from 'react';
import { ChatState, ChatMessage, Sender, MsgKind, MsgStatus, OnlineMode, ConnectionType } from '@/src/lib/types';
import { fileToDataUrl } from '@/src/lib/fileToDataUrl';

function L({ children }: { children: React.ReactNode }) {
  return <div className="text-[12px] font-medium text-neutral-600 mb-1">{children}</div>;
}
function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

export default function ChatForm({
  state, setState
}: {
  state: ChatState;
  setState: (updater: (s: ChatState) => ChatState) => void;
}) {
  const id = useId();
  const inputCls =
    'w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]/50';
  function setHeader<K extends keyof ChatState['header']>(key: K, val: ChatState['header'][K]) {
    setState(s => ({ ...s, header: { ...s.header, [key]: val } }));
  }
  function addMessage() {
    const msg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      sender: 'me',
      kind: 'text',
      text: 'Hello!',
      timestamp: '09:12',
      status: 'sent'
    };
    setState(s => ({ ...s, messages: [...s.messages, msg] }));
  }
  function updateMessage(id: string, patch: Partial<ChatMessage>) {
    setState(s => ({ ...s, messages: s.messages.map(m => m.id === id ? { ...m, ...patch } : m) }));
  }
  function removeMessage(id: string) {
    setState(s => ({ ...s, messages: s.messages.filter(m => m.id !== id) }));
  }

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <section className="space-y-3">
        <div className="text-sm font-semibold">Phone & Contact</div>
        <FieldRow>
          <div>
            <L>Contact name</L>
            <input
              className={inputCls}
              value={state.header.contactName}
              onChange={e => setHeader('contactName', e.target.value.slice(0, 40))}
            />
          </div>
          <div>
            <L>Online mode</L>
            <select
              className={inputCls}
              value={state.header.onlineMode}
              onChange={e => setHeader('onlineMode', e.target.value as OnlineMode)}
            >
              <option value="online">online</option>
              <option value="typing…">typing…</option>
              <option value="last seen">last seen</option>
            </select>
          </div>
        </FieldRow>

        {state.header.onlineMode === 'last seen' && (
          <div>
            <L>Last seen text</L>
            <input
              className={inputCls}
              placeholder="today at 09:30"
              value={state.header.lastSeenText}
              onChange={e => setHeader('lastSeenText', e.target.value.slice(0, 40))}
            />
          </div>
        )}

        <FieldRow>
          <div>
            <L>Carrier</L>
            <input
              className={inputCls}
              value={state.header.carrier}
              onChange={e => setHeader('carrier', e.target.value.slice(0, 16))}
            />
          </div>
          <div>
            <L>Connection</L>
            <select
              className={inputCls}
              value={state.header.connection}
              onChange={e => setHeader('connection', e.target.value as ConnectionType)}
            >
              <option>Wi-Fi</option>
              <option>4G</option>
              <option>5G</option>
            </select>
          </div>
        </FieldRow>

        <FieldRow>
          <div>
            <L>Clock time</L>
            <input
              className={inputCls}
              value={state.header.phoneTime}
              onChange={e => setHeader('phoneTime', e.target.value.slice(0, 12))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <L>Battery %</L>
              <input
                type="number"
                className={inputCls}
                value={state.header.batteryPercent}
                onChange={e =>
                  setHeader('batteryPercent', Math.max(0, Math.min(100, Number(e.target.value))))
                }
              />
            </div>
            <div className="flex items-end gap-2">
              <input id={`${id}-chg`} type="checkbox"
                     checked={state.header.charging}
                     onChange={e => setHeader('charging', e.target.checked)} />
              <label htmlFor={`${id}-chg`} className="text-[13px]">Charging</label>
            </div>
          </div>
        </FieldRow>

        <div>
          <L>Avatar image</L>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-neutral-500 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#00A884] file:px-3 file:py-2 file:text-white hover:file:bg-[#029e70]"
            onChange={async e => {
              const f = e.target.files?.[0];
              if (!f) return;
              const data = await fileToDataUrl(f);
              setHeader('avatarDataUrl', data);
            }}
          />
          {state.header.avatarDataUrl && (
            <img
              src={state.header.avatarDataUrl}
              alt="avatar preview"
              className="mt-2 h-16 w-16 rounded-full object-cover"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <L>Wallpaper</L>
            <select
              className={inputCls}
              value={state.header.wallpaper}
              onChange={e => setHeader('wallpaper', e.target.value as any)}
            >
              <option value="solid">Solid</option>
              <option value="paper">Paper pattern</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <input id={`${id}-wm`} type="checkbox"
                   checked={state.showWatermark}
                   onChange={e => setState(s => ({ ...s, showWatermark: e.target.checked }))} />
            <label htmlFor={`${id}-wm`} className="text-[13px]">Show watermark</label>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Messages</div>
          <button
            onClick={addMessage}
            className="rounded-md bg-[#00A884] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#029e70]"
          >
            + Add message
          </button>
        </div>

        <div className="space-y-3">
          {state.messages.map((m) => (
            <div key={m.id} className="border rounded-lg p-3 bg-white">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <L>Sender</L>
                  <select
                    className={inputCls}
                    value={m.sender}
                    onChange={e => updateMessage(m.id, { sender: e.target.value as Sender })}
                  >
                    <option value="me">Me</option>
                    <option value="them">Them</option>
                  </select>
                </div>
                <div>
                  <L>Kind</L>
                  <select
                    className={inputCls}
                    value={m.kind}
                    onChange={e => updateMessage(m.id, { kind: e.target.value as MsgKind })}
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                  </select>
                </div>
              </div>

              {m.kind === 'text' && (
                <div className="mt-2">
                  <L>Text</L>
                  <textarea
                    rows={3}
                    className={`${inputCls} resize-none`}
                    value={m.text ?? ''}
                    onChange={e => updateMessage(m.id, { text: e.target.value.slice(0, 2000) })}
                  />
                </div>
              )}

              {m.kind === 'image' && (
                <div className="mt-2">
                  <L>Image upload</L>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-neutral-500 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#00A884] file:px-3 file:py-2 file:text-white hover:file:bg-[#029e70]"
                    onChange={async e => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const data = await fileToDataUrl(f);
                      updateMessage(m.id, { imageDataUrl: data });
                    }}
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mt-2">
                <div>
                  <L>Timestamp</L>
                  <input
                    className={inputCls}
                    value={m.timestamp}
                    onChange={e => updateMessage(m.id, { timestamp: e.target.value.slice(0, 8) })}
                  />
                </div>

                <div>
                  <L>Status (me)</L>
                  <select
                    className={inputCls}
                    value={m.status}
                    onChange={e => updateMessage(m.id, { status: e.target.value as MsgStatus })}
                  >
                    <option value="none">none</option>
                    <option value="sent">sent ✓</option>
                    <option value="delivered">delivered ✓✓</option>
                    <option value="read">read ✓✓ (blue)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button onClick={() => removeMessage(m.id)}
                          className="ml-auto text-sm text-red-600 underline">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
