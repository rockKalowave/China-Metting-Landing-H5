export function isInMiniProgram() {
  if (typeof window === 'undefined') {
    return false;
  }
  if (window.__wxjs_environment === 'miniprogram') {
    return true;
  }
  const ua = window.navigator?.userAgent || '';
  return /miniProgram/i.test(ua);
}

export function navigateBackToMiniProgram(options = {}) {
  if (!isInMiniProgram()) {
    return false;
  }
  if (!window.wx?.miniProgram?.navigateBack) {
    return false;
  }
  try {
    window.wx.miniProgram.navigateBack({ delta: options.delta ?? 1 });
    return true;
  } catch (error) {
    console.warn('wx.miniProgram.navigateBack failed', error);
    return false;
  }
}
