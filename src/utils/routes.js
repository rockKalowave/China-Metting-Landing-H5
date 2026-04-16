const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export function getInternalPath() {
  const { pathname } = window.location;
  if (BASE && pathname.startsWith(BASE)) {
    return pathname.slice(BASE.length) || '/';
  }
  return pathname || '/';
}

export function toExternalPath(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${normalized}`;
}
