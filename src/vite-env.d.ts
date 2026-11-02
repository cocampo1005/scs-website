/// <reference types="vite/client" />

interface Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}

interface Navigator {
  /** Global Privacy Control signal (https://w3c.github.io/gpc/) */
  readonly globalPrivacyControl?: boolean;
}
