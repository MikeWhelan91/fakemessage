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
        const top = positions[i] ?? 0;
        el.scrollTop = 0;
        el.style.overflow = "hidden";
        const inner = el.firstElementChild as HTMLElement | null;
        if (inner) {
          inner.style.transform = `translateY(-${top}px)`;
        }
      });
    },
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    output.toBlob((b) => resolve(b), "image/png")
  );

  if (blob) return blob;

  const dataUrl = output.toDataURL("image/png");
  const res = await fetch(dataUrl);
  return res.blob();
}