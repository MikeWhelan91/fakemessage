import React from "react";

/**
 * Classic phone frame with visible bezel, speaker and home button.
 * Scales with --phone-w.
 */
export default function DeviceFrame({
  children,
  screenRef,
}: {
  children: React.ReactNode;
  screenRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      className="relative"
      style={{ width: "var(--phone-w, 392px)", aspectRatio: "428/926" }}
    >
      {/* shadow */}
      <div className="absolute inset-0 rounded-[54px] shadow-[0_20px_60px_rgba(0,0,0,.25)]" />
      {/* outer case */}
      <div className="absolute inset-0 rounded-[54px] bg-[#4ade80]" />
      {/* inner bezel */}
      <div className="absolute inset-[12px] rounded-[42px] bg-black" />
      {/* speaker */}
      <div className="absolute top-[28px] left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-neutral-700 z-20" />
      {/* home button */}
      <div className="absolute bottom-[28px] left-1/2 -translate-x-1/2 w-[72px] h-[72px] rounded-full border-4 border-neutral-700 z-20" />
      {/* screen */}
      <div
        ref={screenRef}
        className="absolute top-[80px] bottom-[100px] left-[24px] right-[24px] rounded-[24px] bg-white overflow-hidden z-10"
      >
        {children}
      </div>
    </div>
  );
}
