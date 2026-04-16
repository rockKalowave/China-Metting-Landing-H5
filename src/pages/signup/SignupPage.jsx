import { useEffect } from 'react';
import { heroDecor } from '../../landingData';
import { toExternalPath } from '../../utils/routes';
import './signup.css';

const homeNavItems = [
  { id: '', label: '首页' },
  { id: 'industry', label: '行业首创' },
  { id: 'design', label: '大会设计' },
  { id: 'values', label: '核心价值' },
  { id: 'highlights', label: '展会亮点' },
  { id: 'content', label: '展会内容' },
  { id: 'audience', label: '用户画像' },
  { id: 'creators', label: '拟邀讲达人' },
  { id: 'review', label: '往期回顾' },
  { id: 'organizer', label: '主办方介绍' },
  { id: 'contact', label: '联系我们' },
];

const qrCodeUrl =
  'https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=https%3A%2F%2Fwww.kalodata.com%2Fkace-2026-signup';

function LogoMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M12 2.5 21 12l-9 9.5L3 12 12 2.5Zm0 4.3L7.6 12 12 16.8 16.4 12 12 6.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DoubleChevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="m6 6 6 6 6-6M6 12l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SignupPage({ onNavigateHome }) {
  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType?.('navigation') ?? [];
    const navigationType = navigationEntries[0]?.type;

    if (navigationType === 'reload') {
      window.location.replace(toExternalPath('/'));
    }
  }, []);

  const navigateHomeSection = (sectionId = '') => {
    const target = sectionId ? toExternalPath(`/#${sectionId}`) : toExternalPath('/');
    window.location.assign(target);
  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <div className="signup-header__inner">
          <button
            className="signup-header__brand"
            onClick={() => {
              if (onNavigateHome) {
                onNavigateHome();
              } else {
                navigateHomeSection();
              }
            }}
            type="button"
          >
            <span className="signup-header__brand-mark">
              <LogoMark />
            </span>
            <span className="signup-header__brand-text">Kalodata</span>
          </button>

          <nav aria-label="报名页导航" className="signup-header__nav">
            {homeNavItems.map((item, index) => (
              <button
                className={index === 0 ? 'signup-header__link signup-header__link--active' : 'signup-header__link'}
                key={item.id || 'home'}
                onClick={() => navigateHomeSection(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button className="signup-header__cta" onClick={() => document.getElementById('signup-qr')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} type="button">
            立即报名
          </button>
        </div>
      </header>

      <main className="signup-hero">
        <img alt="" aria-hidden="true" className="signup-hero__decor signup-hero__decor--left" src={heroDecor.left} />
        <img alt="" aria-hidden="true" className="signup-hero__decor signup-hero__decor--right" src={heroDecor.right} />

        <div className="signup-hero__overlay" />

        <section className="signup-hero__content">
          <h1 className="signup-hero__title">KACE 2026</h1>
          <p className="signup-hero__title-cn">2026 AI 赋能跨境电商与海外达人合作展览会</p>
          <p className="signup-hero__title-en">2026 Kalodata AI Cross-border E-commerce &amp; Influencer Expo</p>

          <div className="signup-hero__notice">现在报名早鸟票免费</div>

          <div className="signup-hero__arrow">
            <DoubleChevron />
          </div>

          <div className="signup-hero__qr-wrap" id="signup-qr">
            <div className="signup-hero__qr-frame">
              <img alt="KACE 2026 报名二维码" className="signup-hero__qr" src={qrCodeUrl} />
            </div>
          </div>
        </section>

        <footer className="signup-hero__footer">
          <p>时间 | 2026年8月4日-8月5日</p>
          <p>请扫描二维码跳转到小程序进行报名</p>
          <p>地点 | 深圳福田国际会展中心</p>
        </footer>
      </main>
    </div>
  );
}
