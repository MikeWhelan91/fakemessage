export type ConnectionType = "Wi-Fi" | "4G" | "5G";
export type OnlineMode = "online" | "typing…" | "last seen";
export type Sender = "me" | "them";
export type MsgStatus = "none" | "sent" | "delivered" | "read";
export type MsgKind = "text" | "image";

export interface HeaderState {
  contactName: string;
  avatarDataUrl: string | null;
  onlineMode: OnlineMode;
  lastSeenText: string;
  phoneTime: string;
  carrier: string;
  connection: ConnectionType;
  batteryPercent: number;
  charging: boolean;
  wallpaper: "solid" | "paper";
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  kind: MsgKind;
  text?: string;
  imageDataUrl?: string;
  timestamp: string;
  status: MsgStatus;
}

export interface ChatState {
  header: HeaderState;
  messages: ChatMessage[];
  showWatermark: boolean;
}