import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  clearConsent,
  DENIED,
  GRANTED,
  hasGlobalPrivacyControl,
  readConsent,
  subscribeConsent,
  writeConsent,
  type ConsentChoices,
  type ConsentRecord,
} from "./consent";
import { applyConsent } from "./googleTag";
import { CookieBanner } from "./CookieBanner";
import { CookieSettingsDialog } from "./CookieSettingsDialog";
import { ConsentContext, type ConsentContextValue } from "./useConsent";

/**
 * Owns the visitor's privacy choice. Reads it after mount, keeps Google's tag
 * in line with it, shows the banner until a choice exists, and the settings
 * dialog on request (the footer's "Cookie settings").
 */
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [ready, setReady] = useState(false);
  const [gpc, setGpc] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setGpc(hasGlobalPrivacyControl());
    setReady(true);
    return subscribeConsent(setConsent);
  }, []);

  // The tag follows the choice: loads once granted, goes quiet when withdrawn
  useEffect(() => {
    if (ready) applyConsent(consent);
  }, [ready, consent]);

  const save = useCallback((choices: ConsentChoices) => {
    const method = choices.advertising ? "accept_all" : "reject_all";
    setConsent(writeConsent(choices, method));
    setSettingsOpen(false);
  }, []);
  const acceptAll = useCallback(() => save(GRANTED), [save]);
  const rejectAll = useCallback(() => save(DENIED), [save]);
  const withdraw = useCallback(() => {
    clearConsent();
    setConsent(null);
    setSettingsOpen(false);
  }, []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);

  const value = useMemo<ConsentContextValue>(
    () => ({ consent, ready, gpc, acceptAll, rejectAll, save, withdraw, openSettings }),
    [consent, ready, gpc, acceptAll, rejectAll, save, withdraw, openSettings],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {ready && !consent && !settingsOpen && <CookieBanner />}
      {settingsOpen && <CookieSettingsDialog onClose={() => setSettingsOpen(false)} />}
    </ConsentContext.Provider>
  );
}
