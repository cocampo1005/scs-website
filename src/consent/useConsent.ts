import { createContext, useContext } from "react";
import type { ConsentChoices, ConsentRecord } from "./consent";

export type ConsentContextValue = {
  /** The stored choice, or null while nothing valid is stored */
  consent: ConsentRecord | null;
  /** True once storage has been read (so the banner never flashes on the server-rendered first paint) */
  ready: boolean;
  /** The browser sends a Global Privacy Control signal */
  gpc: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (choices: ConsentChoices) => void;
  withdraw: () => void;
  openSettings: () => void;
};

export const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used inside ConsentProvider");
  return ctx;
}
