

export const API_BASE = 'https://active.kalodata.com/api';

export function getApiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}
