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

export function openExternalUrl(url) {
  if (!isInMiniProgram()) {
    window.location.href = url;
    return true;
  }
  const mp = window.wx?.miniProgram;
  if (!mp?.navigateTo) {
    window.location.href = url;
    return true;
  }
  try {
    mp.navigateTo({
      url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
    });
    return true;
  } catch (error) {
    console.warn('openExternalUrl failed, fallback to location.href', error);
    window.location.href = url;
    return true;
  }
}

export function navigateBackToMiniProgram(options = {}) {
  if (!isInMiniProgram()) {
    return false;
  }
  const mp = window.wx?.miniProgram;
  if (!mp) {
    return false;
  }
  try {
    const targetUrl = options.fallbackUrl ?? '/pages/index/index';
    // 直接用 switchTab 跳转（适用于 tab 页面），失败则 fallback 到 reLaunch
    if (mp.switchTab) {
      mp.switchTab({
        url: targetUrl,
        fail() {
          if (mp.reLaunch) {
            mp.reLaunch({ url: targetUrl });
          }
        },
      });
    } else if (mp.reLaunch) {
      mp.reLaunch({ url: targetUrl });
    } else {
      return false;
    }
    return true;
  } catch (error) {
    console.warn('wx.miniProgram navigation failed', error);
    return false;
  }
}
