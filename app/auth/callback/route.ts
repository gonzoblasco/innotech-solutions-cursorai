import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Aquí podrías manejar lógica extra si lo necesitas
  return NextResponse.redirect(new URL('/dashboard', req.url));
} 