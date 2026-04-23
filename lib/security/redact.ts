const sensitiveKeyPattern =
  /(name|alias|email|phone|employer|context|message|ciphertext|token|secret|key|authorization)/i;

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => {
        if (sensitiveKeyPattern.test(key)) {
          return [key, "[redacted]"];
        }

        return [key, redactValue(nestedValue)];
      }),
    );
  }

  if (typeof value === "string" && value.length > 160) {
    return "[redacted-long-string]";
  }

  return value;
}

export function redactSensitiveFields(value: unknown) {
  return redactValue(value);
}

