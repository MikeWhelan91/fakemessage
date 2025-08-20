import html2canvas from "html2canvas";

export async function exportNodeToPNG(node: HTMLElement, scale = 2): Promise<Blob> {
  const canvas = await html2canvas(node, {
    backgroundColor: null,
    scale,
    useCORS: true,
    allowTaint: true
  });
  return new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), "image/png"));
}