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

