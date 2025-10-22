// Accepts string or object; always returns a safe image item object
export function toImageItem(img) {
  if (!img) return { src: "", alt: "" };
  if (typeof img === "string") return { src: img, alt: "" };

  const { src, alt = "", title = "", caption = "", credit = "" } = img;
  return { src, alt, title, caption, credit };
}
