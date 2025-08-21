import html2canvas from "html2canvas";

export async function exportNodeToPNG(
  node: HTMLElement,
  scale = 2
): Promise<Blob> {
  const rect = node.getBoundingClientRect();

  const canvas = await html2canvas(document.body, {
    backgroundColor: null,
    scale,
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    useCORS: true,
    allowTaint: true,
  });
  const { width, height } = node.getBoundingClientRect();
  const output = document.createElement("canvas");
  output.width = width * scale;
  output.height = height * scale;
  const ctx = output.getContext("2d");
  if (ctx) {
    ctx.drawImage(
      canvas,
      0,
      0,
      output.width,
      output.height,
      0,
      0,
      output.width,
      output.height
    );
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export canvas"));
    }, "image/png");
  });
}


