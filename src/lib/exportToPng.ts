import html2canvas from "html2canvas";

export async function exportNodeToPNG(node: HTMLElement, scale = 2): Promise<Blob> {
  const canvas = await html2canvas(node, {
    backgroundColor: null,
    scale,
    useCORS: true,
    allowTaint: true,
    // Ensure the captured output isn't offset when the page is scrolled
    scrollX: 0,
    scrollY: -window.scrollY,
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png")
  );

  if (blob) return blob;

  const dataUrl = canvas.toDataURL("image/png");
  const res = await fetch(dataUrl);
  return res.blob();
}