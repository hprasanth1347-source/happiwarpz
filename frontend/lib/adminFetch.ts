export async function adminFetch(url: string, options: RequestInit = {}) {
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('happiwrapz_token');
    if (!token) {
      const match = document.cookie.match(/(?:happiwrapz_token|happiwrapz_session|access_token)=([^;]+)/);
      if (match) token = match[1];
    }
  }

  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization') && !headers.has('authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  return res;
}
