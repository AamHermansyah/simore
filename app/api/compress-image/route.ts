import sharp from 'sharp';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { JwtPayload, verifyJwt } from '@/lib/auth';

export async function POST(req: Request) {
  const form = await req.formData();

  const width = isNaN(+form.get('width')!) ? 100 : +form.get('width')!;
  const height = isNaN(+form.get('height')!) ? 100 : +form.get('height')!;

  const file = form.get('file') as File;
  const buffer = await file.arrayBuffer();

  try {
    const c = await cookies();
    const token = c.get('token')?.value || null;

    const decoded = verifyJwt(token || '') as JwtPayload | null;
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const outputBuffer = await sharp(buffer)
      .resize(width, height)
      .toBuffer();

    const base64Image = outputBuffer.toString('base64');

    return new NextResponse(base64Image, {
      status: 200,
    });
  } catch (error) {
    console.error('COMPRESS IMAGE ERROR: ', error);
    return new NextResponse('Failed to process image', { status: 500 });
  }
}