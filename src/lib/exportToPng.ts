import html2canvas from "html2canvas";

export async function exportNodeToPNG(
  node: HTMLElement,
  scale = 2
): Promise<Blob> {
  const canvas = await html2canvas(node, {
    backgroundColor: null,
    scale,
    useCORS: true,
    allowTaint: true,
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export canvas"));
    }, "image/png");
  });
}


