import React from "react";

/**
 * Phone frame that accepts **screen** size in pixels.
 * We compute the outer case size by adding fixed bezels:
 *  - Left/Right bezel = 24px each  (total 48)
 *  - Top bezel        = 80px
 *  - Bottom bezel     = 100px
 * These match the absolute offsets used for the screen container below.
 */
const BEZEL_LR = 24;   // left/right
const BEZEL_TOP = 80;
const BEZEL_BOT = 100;

export default function DeviceFrame({
  children,
  screenSize,
  screenRef,
}: {
  children: React.ReactNode;
  screenSize: { w: number; h: number };
  screenRef?: React.Ref<HTMLDivElement>;
}) {
  const outerW = screenSize.w + BEZEL_LR * 2;
  const outerH = screenSize.h + BEZEL_TOP + BEZEL_BOT;

  return (
    <div
      className="relative"
      style={{ width: outerW, height: outerH }}
    >
      {/* outer case & shadow */}
      <div className="absolute inset-0 rounded-[54px] shadow-[0_20px_60px_rgba(0,0,0,.25)]" />
      <div className="absolute inset-0 rounded-[54px] bg-[#22c55e]" />
      {/* inner bezel */}
      <div className="absolute inset-[12px] rounded-[42px] bg-black" />
      {/* speaker + home button */}
      <div className="absolute top-[28px] left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-neutral-700 z-20" />
      <div className="absolute bottom-[28px] left-1/2 -translate-x-1/2 w-[72px] h-[72px] rounded-full border-4 border-neutral-700 z-20" />
      {/* screen area */}
      <div
        ref={screenRef}
        className="absolute rounded-[24px] bg-white overflow-hidden z-10"
        style={{
          top: BEZEL_TOP,
          bottom: BEZEL_BOT,
          left: BEZEL_LR,
          right: BEZEL_LR,
          width: screenSize.w,
          height: screenSize.h,
        }}
      >
        {children}
      </div>
    </div>
  );
}
