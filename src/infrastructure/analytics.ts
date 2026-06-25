declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackBuyClick(slug: string): void {
  window.gtag?.("event", "comprar_ml", { slug });
  window.fbq?.("track", "InitiateCheckout");
}
