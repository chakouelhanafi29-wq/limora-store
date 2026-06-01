export type ByteStringViolation = {
  kind: "header" | "cookie-name" | "cookie-value" | "env";
  headerOrCookie: string;
  variable: string;
  index: number;
  charCode: number;
  char: string;
  valuePreview: string;
  stack: string;
  sourceFile: string;
  sourceLine: number;
};

const FETCH_APIKEY_FILE = "node_modules/@supabase/supabase-js/src/lib/fetch.ts";
const FETCH_APIKEY_LINE = 47;

export function findLatin1Violation(
  value: string,
  meta: {
    kind: ByteStringViolation["kind"];
    headerOrCookie: string;
    variable: string;
    sourceFile?: string;
    sourceLine?: number;
  },
): ByteStringViolation | null {
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    if (charCode > 255) {
      return {
        kind: meta.kind,
        headerOrCookie: meta.headerOrCookie,
        variable: meta.variable,
        index: i,
        charCode,
        char: value[i],
        valuePreview: value.slice(0, 48),
        stack: new Error("ByteString capture").stack ?? "",
        sourceFile: meta.sourceFile ?? "lib/http/byte-string.ts",
        sourceLine: meta.sourceLine ?? 0,
      };
    }
  }
  return null;
}

export function scanEnvKeysForByteString(): ByteStringViolation[] {
  const checks: { env: string; value: string; variable: string }[] = [
    {
      env: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      value: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "",
      variable: "supabaseKey (publishable)",
    },
    {
      env: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
      variable: "supabaseKey (anon)",
    },
    {
      env: "SUPABASE_SERVICE_ROLE_KEY",
      value: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "",
      variable: "supabaseKey (service_role)",
    },
  ];

  const violations: ByteStringViolation[] = [];
  for (const check of checks) {
    if (!check.value) continue;
    const hit = findLatin1Violation(check.value, {
      kind: "env",
      headerOrCookie: check.env,
      variable: check.variable,
      sourceFile: FETCH_APIKEY_FILE,
      sourceLine: FETCH_APIKEY_LINE,
    });
    if (hit) violations.push(hit);
  }
  return violations;
}

export function violationFromErrorMessage(
  message: string,
): ByteStringViolation | null {
  if (!message.includes("ByteString") || !message.includes("index 0")) {
    return null;
  }
  const codeMatch = message.match(/value of (\d+)/);
  const charCode = codeMatch ? Number(codeMatch[1]) : -1;
  return {
    kind: "header",
    headerOrCookie: "apikey",
    variable: "supabaseKey",
    index: 0,
    charCode,
    char: charCode > 0 ? String.fromCharCode(charCode) : "?",
    valuePreview: "(value not captured — see env scan or wrapped fetch)",
    stack: "",
    sourceFile: FETCH_APIKEY_FILE,
    sourceLine: FETCH_APIKEY_LINE,
  };
}

export function createLatin1GuardFetch(
  innerFetch: typeof fetch,
  supabaseKey: string,
  keyLabel: string,
): typeof fetch {
  const keyViolation = findLatin1Violation(supabaseKey, {
    kind: "header",
    headerOrCookie: "apikey",
    variable: "supabaseKey",
    sourceFile: FETCH_APIKEY_FILE,
    sourceLine: FETCH_APIKEY_LINE,
  });

  return async (input, init) => {
    if (keyViolation) {
      keyViolation.headerOrCookie = keyLabel;
      const err = new Error(
        `TypeError: Cannot convert argument to a ByteString because the character at index ${keyViolation.index} has a value of ${keyViolation.charCode} which is greater than 255.`,
      ) as Error & { byteStringDiagnostic: ByteStringViolation };
      err.byteStringDiagnostic = keyViolation;
      throw err;
    }

    if (init?.headers) {
      const headers = new Headers(init.headers);
      for (const [name, value] of headers.entries()) {
        const hit = findLatin1Violation(value, {
          kind: "header",
          headerOrCookie: name,
          variable: name,
          sourceFile: FETCH_APIKEY_FILE,
          sourceLine: FETCH_APIKEY_LINE,
        });
        if (hit) {
          const err = new Error(
            `TypeError: Cannot convert argument to a ByteString because the character at index ${hit.index} has a value of ${hit.charCode} which is greater than 255.`,
          ) as Error & { byteStringDiagnostic: ByteStringViolation };
          err.byteStringDiagnostic = hit;
          throw err;
        }
      }
    }

    return innerFetch(input, init);
  };
}

export type CookieSetAttempt = {
  name: string;
  value: string;
};

export function findCookieByteStringViolation(
  cookies: CookieSetAttempt[],
): ByteStringViolation | null {
  for (const { name, value } of cookies) {
    const nameHit = findLatin1Violation(name, {
      kind: "cookie-name",
      headerOrCookie: "Set-Cookie",
      variable: "name",
      sourceFile: "lib/supabase/server.ts",
      sourceLine: 32,
    });
    if (nameHit) return nameHit;

    const valueHit = findLatin1Violation(value, {
      kind: "cookie-value",
      headerOrCookie: "Set-Cookie",
      variable: "value",
      sourceFile: "lib/supabase/server.ts",
      sourceLine: 32,
    });
    if (valueHit) return valueHit;
  }
  return null;
}
