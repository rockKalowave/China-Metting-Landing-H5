import { beforeEach, describe, expect, it } from 'vitest';
import { resolveMiniAppUser, getStoredMiniAppUser } from './miniAppUser';
import { toExternalPath } from './routes';

describe('mini app identity persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
    delete window.__KACE_MINIAPP_USER__;
    delete window.KACE_MINIAPP;
    delete window.wx;
    window.history.replaceState({}, '', '/');
  });

  it('keeps phone available after page navigation', async () => {
    window.history.replaceState({}, '', '/?phone=13800138000&wechat_open_id=open-1');

    await resolveMiniAppUser();
    window.history.replaceState({}, '', '/buy');

    expect(getStoredMiniAppUser()).toEqual({
      phone: '13800138000',
      wechatOpenId: 'open-1',
      wechatUnionId: '',
    });
  });

  it('preserves mini app identity in generated jump paths', () => {
    window.history.replaceState({}, '', '/?phone=13800138000&wechat_open_id=open-1');

    expect(toExternalPath('/buy')).toBe('/buy?phone=13800138000&wechat_open_id=open-1');
  });
});
