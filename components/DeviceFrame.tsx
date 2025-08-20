import React from "react";

/**
 * GlassFrame: sleek device-less “screenshot” with rounded glass,
 * soft shadow, thin bezel stroke, and a Dynamic Island.
 * Scales with --phone-w.
 */
export default function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative"
      style={{ width: "var(--phone-w, 392px)", aspectRatio: "428/926" }}
    >
      {/* Outer soft shadow */}
      <div className="absolute inset-0 rounded-[46px] shadow-[0_20px_60px_rgba(0,0,0,.25)]" />

      {/* Glass */}
      <div
        className="absolute inset-0 rounded-[46px] bg-white overflow-hidden"
        style={{ outline: "1px solid rgba(0,0,0,.08)" }} /* thin bezel line */
      >
        {/* Dynamic Island (in-glass; no more SVG alignment games) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[10px] h-[18px] w-[150px] rounded-full bg-black/95 z-20" />

        {/* App surface */}
        <div className="absolute inset-0 z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
