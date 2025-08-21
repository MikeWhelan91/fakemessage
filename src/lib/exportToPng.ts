import html2canvas from "html2canvas";

export async function exportNodeToPNG(node: HTMLElement, scale = 2): Promise<Blob> {
  // Preserve scroll positions of any nested scrollable regions so the export
  // matches what the user sees on screen.
  const scrollables = Array.from(
    node.querySelectorAll<HTMLElement>("[data-scrollable]")
  );
  const metrics = scrollables.map((el) => ({
    top: el.scrollTop,
    height: el.clientHeight,
  }));


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
        const { top, height } = metrics[i] ?? { top: 0, height: 0 };
        el.scrollTop = 0;
        el.style.overflow = "hidden";
        el.style.height = `${height}px`;

        const inner = el.firstElementChild as HTMLElement | null;
        if (inner) {
          inner.style.transform = `translateY(-${top}px)`;
        }
      });
    },
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

  const blob = await new Promise<Blob | null>((resolve) =>
    output.toBlob((b) => resolve(b), "image/png")
  );

  if (blob) return blob;

  const dataUrl = output.toDataURL("image/png");
  const res = await fetch(dataUrl);
  return res.blob();
}