import { proxyToFastAPI } from '@/lib/fastapiProxy';

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const pathStr = '/api/' + (resolved.path ? resolved.path.join('/') : '');
  return proxyToFastAPI(request, pathStr);
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const pathStr = '/api/' + (resolved.path ? resolved.path.join('/') : '');
  return proxyToFastAPI(request, pathStr);
}

export async function PUT(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const pathStr = '/api/' + (resolved.path ? resolved.path.join('/') : '');
  return proxyToFastAPI(request, pathStr);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const pathStr = '/api/' + (resolved.path ? resolved.path.join('/') : '');
  return proxyToFastAPI(request, pathStr);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const pathStr = '/api/' + (resolved.path ? resolved.path.join('/') : '');
  return proxyToFastAPI(request, pathStr);
}
