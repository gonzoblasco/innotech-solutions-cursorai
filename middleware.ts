import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // Temporalmente desactivado para desarrollo
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.css$|.*\\.js$).*)',
  ],
}; 