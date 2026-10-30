// Shared WebGL helpers for the R3F scenes (hero puzzle, SOLID exhibit).

// True when the browser can create a WebGL context. The probe context is
// released straight away so it does not count against the browser's limit.
export function hasWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

// Calls onLost when the renderer's context is lost (GPU reset, driver issue,
// too many contexts). Returns a cleanup function.
export function watchContextLoss(canvas, onLost) {
  const handle = (event) => {
    event.preventDefault();
    onLost();
  };
  canvas.addEventListener("webglcontextlost", handle);
  return () => canvas.removeEventListener("webglcontextlost", handle);
}
