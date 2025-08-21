import html2canvas from "html2canvas";

export async function exportNodeToPNG(
  node: HTMLElement,
  scale = window.devicePixelRatio || 1
): Promise<Blob> {
  // Ensure custom fonts are ready before rendering to avoid layout shifts
  if ((document as any).fonts?.ready) {
    await (document as any).fonts.ready;
  }

  // Capture only the provided node so the exported image matches the
  // on‑screen preview exactly. Using onclone allows us to preserve the
  // current scroll position of the chat messages container so off‑screen
  // bubbles remain hidden in the final image.
  const canvas = await html2canvas(node, {
    backgroundColor: null,
    scale,
    useCORS: true,
    allowTaint: true,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    foreignObjectRendering: true,

    onclone: (doc) => {
      const originalScrollable = node.querySelector(
        "[data-scrollable]"
      ) as HTMLElement | null;
      const clonedScrollable = doc.querySelector(
        "[data-scrollable]"
      ) as HTMLElement | null;
      if (originalScrollable && clonedScrollable) {
        clonedScrollable.scrollTop = originalScrollable.scrollTop;
      }
    },
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export canvas"));
    }, "image/png");
  });
}


