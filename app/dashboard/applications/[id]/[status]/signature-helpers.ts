export function getInitialsFromName(name?: string | null): string {
  if (!name) return "";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildTypedSignatureHtml(text: string): string {
  const safe = escapeHtml(text);
  return `<span style="font-style: italic; font-family: serif;">${safe}</span>`;
}

// Replace any placeholder that starts with [signature:tenant ...]
export function replaceTenantSignaturePlaceholders(html: string, replacementHtml: string): string {
  return html
    .replace(/\[signature:tenant[^\]]*\]/gi, replacementHtml)
    .replace(/\[signature\]/gi, replacementHtml);
}


