export type DataLayerValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | DataLayerValue[]
  | { [key: string]: DataLayerValue };

export type DataLayerEvent = {
  event: string;
  [key: string]: DataLayerValue;
};

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}

export function pushDataLayerEvent(event: DataLayerEvent) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

export function createEventId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}`;
}
