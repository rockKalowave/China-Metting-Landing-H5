const API_BASE = 'http://localhost:3000/api';
const TICKET_WALLET_STORAGE_KEY = 'kace_ticket_wallet';

function parseJson(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function normalizePhone(rawPhone) {
  if (!rawPhone) {
    return '';
  }

  const digits = String(rawPhone).replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  if (digits.length > 11) {
    return digits.slice(-11);
  }

  return digits;
}

function normalizeMiniAppUser(rawUser) {
  if (!rawUser || typeof rawUser !== 'object') {
    return null;
  }

  const phone = normalizePhone(rawUser.phone ?? rawUser.phoneNumber);
  const wechatOpenId =
    rawUser.wechatOpenId
    ?? rawUser.wechat_open_id
    ?? rawUser.openId
    ?? rawUser.openid
    ?? '';
  const wechatUnionId =
    rawUser.wechatUnionId
    ?? rawUser.wechat_union_id
    ?? rawUser.unionId
    ?? rawUser.unionid
    ?? '';

  if (!phone && !wechatOpenId) {
    return null;
  }

  return {
    phone,
    wechatOpenId: wechatOpenId || '',
    wechatUnionId: wechatUnionId || '',
  };
}

function readMiniAppUserFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return normalizeMiniAppUser({
    phone: params.get('phone') ?? params.get('mobile'),
    wechat_open_id:
      params.get('wechat_open_id')
      ?? params.get('wechatOpenId')
      ?? params.get('openId')
      ?? params.get('openid'),
    wechat_union_id:
      params.get('wechat_union_id')
      ?? params.get('wechatUnionId')
      ?? params.get('unionId')
      ?? params.get('unionid'),
  });
}

function requestMiniAppUserFromBridge() {
  return new Promise((resolve) => {
    const complete = (value) => {
      window.removeEventListener('kace-miniapp-user', handleMessage);
      window.removeEventListener('message', handleWindowMessage);
      window.clearTimeout(timeoutId);
      resolve(value);
    };

    const handleMessage = (event) => {
      const normalized = normalizeMiniAppUser(event.detail ?? event.data);
      if (normalized) {
        complete(normalized);
      }
    };

    const handleWindowMessage = (event) => {
      const normalized = normalizeMiniAppUser(event.data);
      if (normalized) {
        complete(normalized);
      }
    };

    const timeoutId = window.setTimeout(() => complete(null), 1500);

    window.addEventListener('kace-miniapp-user', handleMessage);
    window.addEventListener('message', handleWindowMessage);

    try {
      if (typeof window.KACE_MINIAPP?.getUserProfile === 'function') {
        Promise.resolve(window.KACE_MINIAPP.getUserProfile())
          .then((user) => {
            const normalized = normalizeMiniAppUser(user);
            if (normalized) {
              complete(normalized);
            }
          })
          .catch(() => {});
      }

      if (window.wx?.miniProgram?.postMessage) {
        window.wx.miniProgram.postMessage({
          data: {
            type: 'KACE_REQUEST_USER_PROFILE',
          },
        });
      }
    } catch (error) {
      complete(null);
    }
  });
}

async function isRunningInMiniProgram() {
  if (!window.wx?.miniProgram?.getEnv) {
    return false;
  }

  return new Promise((resolve) => {
    window.wx.miniProgram.getEnv((result) => resolve(Boolean(result?.miniprogram)));
  });
}

export function getStoredMiniAppUser() {
  return readMiniAppUserFromUrl();
}

export function getStoredTicketWallet() {
  return parseJson(sessionStorage.getItem(TICKET_WALLET_STORAGE_KEY));
}

export function cacheTicketWallet(ticketWallet) {
  if (!ticketWallet) {
    sessionStorage.removeItem(TICKET_WALLET_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(TICKET_WALLET_STORAGE_KEY, JSON.stringify(ticketWallet));
}

export function getOrderLookupIdentity() {
  const order = parseJson(sessionStorage.getItem('kace_order'));
  return normalizeMiniAppUser({
    phone: order?.phone,
    wechat_open_id: order?.wechatOpenId ?? order?.wechat_open_id,
    wechat_union_id: order?.wechatUnionId ?? order?.wechat_union_id,
  });
}

export async function resolveMiniAppUser() {
  const userFromUrl = readMiniAppUserFromUrl();
  if (userFromUrl) {
    return userFromUrl;
  }

  const globalUser = normalizeMiniAppUser(window.__KACE_MINIAPP_USER__ ?? window.KACE_MINIAPP?.user);
  if (globalUser) {
    return globalUser;
  }

  if (await isRunningInMiniProgram()) {
    return requestMiniAppUserFromBridge();
  }

  return null;
}

export async function resolveTicketLookupIdentity() {
  return (await resolveMiniAppUser()) ?? getOrderLookupIdentity();
}

async function readApiResponse(response) {
  const result = await response.json();
  if (!response.ok || result.code !== 0) {
    throw new Error(result.message || '请求失败');
  }
  return result.data;
}

export async function syncMiniAppEntry(identity) {
  const normalized = normalizeMiniAppUser(identity);
  if (!normalized) {
    return null;
  }

  const response = await fetch(`${API_BASE}/users/miniapp/entry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: normalized.phone,
      wechat_open_id: normalized.wechatOpenId,
      wechat_union_id: normalized.wechatUnionId,
    }),
  });
  const data = await readApiResponse(response);
  if (data?.ticket) {
    cacheTicketWallet(data.ticket);
  }
  return data;
}

export async function fetchTicketWallet(identity) {
  const normalized = normalizeMiniAppUser(identity);
  if (!normalized) {
    return null;
  }

  const params = new URLSearchParams();
  if (normalized.phone) {
    params.set('phone', normalized.phone);
  }
  if (normalized.wechatOpenId) {
    params.set('wechat_open_id', normalized.wechatOpenId);
  }

  const response = await fetch(`${API_BASE}/users/ticket-wallet?${params.toString()}`);
  const data = await readApiResponse(response);
  cacheTicketWallet(data);
  return data;
}
