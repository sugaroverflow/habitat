export type RedactionType =
  | "address"
  | "postcode"
  | "unit"
  | "coordinates"
  | "email"
  | "phone"
  | "order_number"
  | "tracking_number";

export interface RedactionEvent {
  redactionType: RedactionType;
  redacted: true;
}

export interface SanitizedText {
  text: string;
  redacted: boolean;
  redactions: RedactionEvent[];
}

const rules: Array<{
  type: RedactionType;
  pattern: RegExp;
  replacement: string;
}> = [
  {
    type: "email",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    replacement: "[EMAIL REDACTED]",
  },
  {
    type: "postcode",
    pattern: /\b(?:GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})\b/gi,
    replacement: "[POSTCODE REDACTED]",
  },
  {
    type: "coordinates",
    pattern: /\b-?\d{1,2}\.\d{4,}\s*[,/]\s*-?\d{1,3}\.\d{4,}\b/g,
    replacement: "[PRECISE LOCATION REDACTED]",
  },
  {
    type: "phone",
    pattern: /\b(?:\+44\s?\d{4}|0\d{3,4})[\s()-]*\d{3,4}[\s-]*\d{3,4}\b/g,
    replacement: "[PHONE REDACTED]",
  },
  {
    type: "tracking_number",
    pattern: /\btracking\s*(?:number|no\.?|#|id)?\s*[:#-]?\s*[A-Z0-9-]{6,}\b/gi,
    replacement: "[TRACKING NUMBER REDACTED]",
  },
  {
    type: "order_number",
    pattern: /\border\s*(?:number|no\.?|#|id)\s*[:#-]?\s*[A-Z0-9-]{5,}\b/gi,
    replacement: "[ORDER NUMBER REDACTED]",
  },
  {
    type: "unit",
    pattern: /\b(?:flat|unit|apartment)\s*(?:no\.?\s*)?[A-Z]?\d+[A-Z]?\b/gi,
    replacement: "[UNIT REDACTED]",
  },
  {
    type: "address",
    pattern:
      /\b\d{1,5}[A-Z]?\s+[A-Z][A-Za-z .'-]{1,50}\s(?:Street|Road|Avenue|Lane|Close|Drive|Way|Place|Gardens|Terrace|Court|Mews|Row|Square)\b/gi,
    replacement: "[HOME ADDRESS REDACTED]",
  },
];

const forbiddenKeys = new Set([
  "address",
  "address_line_1",
  "address_line_2",
  "delivery_address",
  "shipping_address",
  "postcode",
  "postal_code",
  "coordinates",
  "latitude",
  "longitude",
  "lat",
  "lng",
  "email",
  "phone",
  "order_number",
  "tracking_number",
]);

export function sanitizeText(input: string): SanitizedText {
  let text = input;
  const redactions: RedactionEvent[] = [];

  for (const rule of rules) {
    rule.pattern.lastIndex = 0;
    if (!rule.pattern.test(text)) continue;
    redactions.push({ redactionType: rule.type, redacted: true });
    rule.pattern.lastIndex = 0;
    text = text.replace(rule.pattern, rule.replacement);
  }

  return { text, redacted: redactions.length > 0, redactions };
}

export function sanitizeUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const sensitiveParams = [
      "address",
      "postcode",
      "postal_code",
      "lat",
      "latitude",
      "lng",
      "longitude",
      "email",
      "phone",
      "order",
      "order_number",
      "tracking",
    ];

    for (const key of sensitiveParams) url.searchParams.delete(key);
    url.hash = "";
    return sanitizeText(url.toString()).redacted ? null : url.toString();
  } catch {
    return null;
  }
}

export function removeSensitiveFields<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => removeSensitiveFields(entry)) as T;
  }
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (forbiddenKeys.has(key.toLowerCase())) continue;
      result[key] = removeSensitiveFields(entry);
    }
    return result as T;
  }
  if (typeof value === "string") return sanitizeText(value).text as T;
  return value;
}

export function safeAssetName(
  kind: "room-photo" | "floor-plan" | "inspiration" | "upload",
  index: number,
  extension: "jpeg" | "png" | "webp",
) {
  return `${kind}-${String(index).padStart(3, "0")}.${extension}`;
}

export function passesPrivacyRules(input: string) {
  return !sanitizeText(input).redacted;
}
