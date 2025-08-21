import html2canvas from "html2canvas";

export async function exportNodeToPNG(node: HTMLElement, scale = 2): Promise<Blob> {
  // Preserve scroll positions of any nested scrollable regions so the export
  // matches what the user sees on screen.
  const scrollables = Array.from(
    node.querySelectorAll<HTMLElement>("[data-scrollable]")
  );
  const positions = scrollables.map((el) => el.scrollTop);

  const canvas = await html2canvas(node, {
    backgroundColor: null,
    scale,
    useCORS: true,
    allowTaint: true,
    // Ensure the captured output isn't offset when the page is scrolled
    scrollX: 0,
    scrollY: -window.scrollY,
    onclone: (doc) => {
      const cloned = doc.querySelectorAll<HTMLElement>("[data-scrollable]");
      cloned.forEach((el, i) => {
        el.scrollTop = positions[i] ?? 0;
      });
    },
  });

  // html2canvas renders all scrollable content. Crop the result to the
  // element's on-screen size so only visible messages are exported.
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

  const blob = await new Promise<Blob | null>((resolve) =>
    output.toBlob((b) => resolve(b), "image/png")
  );

  if (blob) return blob;

  const dataUrl = output.toDataURL("image/png");
  const res = await fetch(dataUrl);
  return res.blob();
}