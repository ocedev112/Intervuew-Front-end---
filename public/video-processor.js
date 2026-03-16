let canvas, ctx;
let lastProcessed = 0;
const PROCESS_INTERVAL = 1000; // only process 1 frame per second

self.onmessage = async (e) => {
  if (e.data.type === "init") {
    canvas = new OffscreenCanvas(768, 768);
    ctx = canvas.getContext("2d", { willReadFrequently: true });
  }

  if (e.data.type === "frame") {
    if (!ctx) {
      e.data.bitmap.close(); // always close bitmap to free memory
      return;
    }

    const now = Date.now();
    if (now - lastProcessed < PROCESS_INTERVAL) {
      e.data.bitmap.close(); // drop frame, free memory
      return;
    }
    lastProcessed = now;

    const { bitmap, videoWidth, videoHeight } = e.data;
    const size = Math.min(videoWidth, videoHeight);
    const sx = (videoWidth - size) / 2;
    const sy = (videoHeight - size) / 2;
    ctx.drawImage(bitmap, sx, sy, size, size, 0, 0, 768, 768);
    bitmap.close();

    try {
      const blob = await canvas.convertToBlob({
        type: "image/jpeg",
        quality: 0.8,
      });
      const arrayBuffer = await blob.arrayBuffer();
      self.postMessage({ type: "blob", buffer: arrayBuffer }, [arrayBuffer]);
    } catch (err) {
      self.postMessage({ type: "error", message: err.message });
    }
  }
};
