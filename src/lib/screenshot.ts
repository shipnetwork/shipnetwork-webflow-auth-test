// Screenshot utility for capturing globe visualization

import html2canvas from "html2canvas";

export interface CaptureOptions {
  scale?: number;
  backgroundColor?: string;
  quality?: number;
}

/**
 * Capture a screenshot of an HTML element
 */
export async function captureScreenshot(
  element: HTMLElement,
  options: CaptureOptions = {}
): Promise<Blob> {
  const { scale = 2, backgroundColor = "#0a0e1a" } = options;

  const canvas = await html2canvas(element, {
    backgroundColor,
    scale,
    logging: false,
    useCORS: true,
    allowTaint: true,
    // Ignore certain elements that might cause issues
    ignoreElements: (el) => {
      return el.classList.contains("ignore-screenshot");
    },
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob from canvas"));
        }
      },
      "image/png",
      1.0
    );
  });
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Capture and download a screenshot with a timestamped filename
 */
export async function captureAndDownload(
  element: HTMLElement,
  filenamePrefix: string = "shipnetwork-globe"
): Promise<void> {
  const blob = await captureScreenshot(element);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  const filename = `${filenamePrefix}-${timestamp}.png`;
  downloadBlob(blob, filename);
}

/**
 * Create a flash effect for visual feedback when taking screenshot
 */
export function createFlashEffect(): HTMLDivElement {
  const flash = document.createElement("div");
  flash.style.cssText = `
    position: fixed;
    inset: 0;
    background: white;
    pointer-events: none;
    z-index: 99999;
    opacity: 0;
    animation: screenshot-flash 0.3s ease-out;
  `;

  // Add keyframes if not already added
  if (!document.getElementById("screenshot-flash-style")) {
    const style = document.createElement("style");
    style.id = "screenshot-flash-style";
    style.textContent = `
      @keyframes screenshot-flash {
        0% { opacity: 0.8; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  return flash;
}

/**
 * Take a screenshot with flash effect
 */
export async function takeScreenshotWithFlash(
  element: HTMLElement,
  filenamePrefix: string = "shipnetwork-globe"
): Promise<void> {
  // Create and show flash
  const flash = createFlashEffect();
  document.body.appendChild(flash);

  // Wait for flash animation
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    // Capture screenshot
    await captureAndDownload(element, filenamePrefix);
  } finally {
    // Remove flash after animation
    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, 300);
  }
}

// Legacy export for compatibility
export const takeScreenshot = takeScreenshotWithFlash;

/**
 * Video Recording using MediaRecorder API
 */
export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(element: HTMLElement, options?: { duration?: number; quality?: "low" | "medium" | "high" }): Promise<void> {
    try {
      // Capture the element as a stream
      const canvas = element.querySelector("canvas");
      if (!canvas) {
        throw new Error("No canvas element found to record");
      }

      // @ts-ignore - captureStream is not in TypeScript types yet
      this.stream = canvas.captureStream(30); // 30 FPS

      // Set quality based on options
      const qualityMap = {
        low: 1000000, // 1 Mbps
        medium: 2500000, // 2.5 Mbps
        high: 5000000, // 5 Mbps
      };
      const videoBitsPerSecond = qualityMap[options?.quality || "medium"];

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond,
      });

      this.chunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.mediaRecorder.start();

      // Auto-stop after duration if specified
      if (options?.duration) {
        setTimeout(() => {
          this.stopRecording();
        }, options.duration);
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No recording in progress"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: "video/webm" });
        this.cleanup();
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  async downloadRecording(filename?: string): Promise<void> {
    try {
      const blob = await this.stopRecording();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
      const finalFilename = filename || `shipnetwork-globe-${timestamp}.webm`;
      downloadBlob(blob, finalFilename);
    } catch (error) {
      console.error("Failed to download recording:", error);
    }
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.chunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === "recording";
  }
}

/**
 * Quick 10-second recording helper
 */
export async function record10Seconds(element: HTMLElement): Promise<void> {
  const recorder = new VideoRecorder();
  await recorder.startRecording(element, { duration: 10000, quality: "high" });
  
  // Show recording indicator
  const indicator = document.createElement("div");
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  `;
  indicator.innerHTML = `
    <div style="width: 12px; height: 12px; background: white; border-radius: 50%; animation: pulse 1s infinite;"></div>
    Recording... 10s
  `;
  document.body.appendChild(indicator);

  // Countdown
  let remaining = 10;
  const interval = setInterval(() => {
    remaining--;
    indicator.innerHTML = `
      <div style="width: 12px; height: 12px; background: white; border-radius: 50%; animation: pulse 1s infinite;"></div>
      Recording... ${remaining}s
    `;
    if (remaining <= 0) {
      clearInterval(interval);
    }
  }, 1000);

  // Wait for recording to finish
  setTimeout(async () => {
    await recorder.downloadRecording();
    document.body.removeChild(indicator);
  }, 10000);
}
