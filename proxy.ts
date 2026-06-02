import { NextResponse, type NextRequest } from 'next/server';

const realm = 'Private ISE';

function timingSafeStringEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);

  if (aBytes.length !== bBytes.length) return false;

  let mismatch = 0;
  for (const [index] of aBytes.entries()) {
    mismatch |= aBytes[index] ^ bBytes[index];
  }

  return mismatch === 0;
}

function unauthorizedResponse() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}", charset="UTF-8"`,
    },
  });
}

function serverMisconfiguredResponse() {
  return new NextResponse('Server misconfigured: BASIC_AUTH_USER and BASIC_AUTH_PASSWORD are required', {
    status: 503,
  });
}

function parseBasicCredentials(authorization: string | null) {
  const prefix = 'Basic ';
  if (!authorization?.startsWith(prefix)) return null;

  try {
    return atob(authorization.slice(prefix.length).trim());
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const user = process.env.BASIC_AUTH_USER?.trim();
  const password = process.env.BASIC_AUTH_PASSWORD?.trim();

  if (!user || !password) {
    if (process.env.NODE_ENV === 'production') {
      return serverMisconfiguredResponse();
    }

    return NextResponse.next();
  }

  const providedCredentials = parseBasicCredentials(request.headers.get('authorization'));
  const expectedCredentials = `${user}:${password}`;

  if (
    providedCredentials &&
    timingSafeStringEqual(providedCredentials, expectedCredentials)
  ) {
    return NextResponse.next();
  }

  return unauthorizedResponse();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
