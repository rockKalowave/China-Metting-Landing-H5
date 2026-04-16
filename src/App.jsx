import { useEffect, useMemo, useRef, useState } from 'react';
import {
  creatorTrackItems,
  heroDecor,
  heroSlides,
  invitedCreators,
  logoItems,
  navItems,
  sectionImages,
} from './landingData';
import BuyPage from './pages/buy/buy';
import PayPage from './pages/pay/PayPage';
import SignupPage from './pages/signup/SignupPage';
import TicketPage from './pages/ticket/TicketPage';
import { navigateBackToMiniProgram } from './utils/miniAppBridge';
import { resolveMiniAppUser, syncMiniAppEntry } from './utils/miniAppUser';
import { getInternalPath, toExternalPath } from './utils/routes';

const SPONSORSHIP_URL = 'https://www.wjx.top/vm/tU5XHKW.aspx#';
const DEFAULT_ENTRY_STATE = {
  has_purchased: false,
  entry_label: '立即报名',
  entry_path: '/buy',
  ticket: null,
};

function ImageSection({ id, image, alt, children, bleed = false }) {
  return (
    <section className={`content-section${bleed ? ' content-section--bleed' : ''}`} id={id}>
      <div className="section-shell">
        <div className="section-panel">
          <img className="section-image" src={image} alt={alt} />
        </div>
        {children}
      </div>
    </section>
  );
}

function Marquee({ items, direction = 'left', itemClassName = '' }) {
  const trackItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="marquee">
      <div className={`marquee__track marquee__track--${direction}`}>
        {trackItems.map((item, index) => (
          <div className={`marquee__item ${itemClassName}`.trim()} key={`${direction}-${index}`}>
            <img src={item} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePage({
  activeSection,
  entryLabel,
  entryPath,
  navigateTo,
  scrollToSection,
}) {
  return (
    <div className="landing-page">
      <header className="site-header">
        <div className="site-header__inner">
          <button
            className="site-brand"
            onClick={() => {
              if (navigateBackToMiniProgram()) {
                return;
              }
              scrollToSection('home');
            }}
            type="button"
          >
            <span className="site-brand__mark" />
            <span className="site-brand__text">Kalodata</span>
          </button>
          <nav aria-label="主导航" className="site-nav">
            {navItems.map((item) => (
              <button
                className={item.id === activeSection ? 'site-nav__link site-nav__link--active' : 'site-nav__link'}
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button className="site-header__cta" onClick={() => navigateTo(entryPath)} type="button">
            {entryLabel}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <img alt="" aria-hidden="true" className="hero__decor hero__decor--left" src={heroDecor.left} />
          <img alt="" aria-hidden="true" className="hero__decor hero__decor--right" src={heroDecor.right} />
          <img alt="" aria-hidden="true" className="hero__background" src={heroDecor.background} />
          <div className="section-shell hero__shell">
            <div className="hero__copy">
              <span className="hero__eyebrow" />
              <h1 className="hero__title">KACE 2026</h1>
              <p className="hero__subtitle">中国最大的AI跨境电商与海外达人合作展览会</p>
              <p className="hero__subtitle hero__subtitle--en">2026 Kalodata AI Cross-border E-commerce &amp; Influencer Expo</p>
              <p className="hero__meta">2026年8月4日 - 8月5日 | 深圳福田国际会展中心</p>
            </div>

            <aside className="hero-side-panel" aria-label="快捷入口">
              <button
                className="hero-side-panel__button hero-side-panel__button--primary"
                onClick={() => navigateTo(entryPath)}
                type="button"
              >
                <span>{entryLabel}</span>
                <span aria-hidden="true">›</span>
              </button>
              <button
                className="hero-side-panel__button"
                onClick={() => window.location.href = SPONSORSHIP_URL}
                type="button"
              >
                <span>招商合作</span>
                <span aria-hidden="true">›</span>
              </button>
              <button
                className="hero-side-panel__button"
                onClick={() => scrollToSection('contact')}
                type="button"
              >
                <span>大会咨询</span>
                <span aria-hidden="true">›</span>
              </button>
            </aside>

            <div className="hero__highlights">
              <img alt="KAGGE 首屏四大亮点" src={heroDecor.highlights} />
            </div>

            <div className="expo-showcase">
              <div className="expo-showcase__track">
                {[...heroSlides, ...heroSlides].map((slide, index) => (
                  <img className="expo-showcase__item" key={`expo-${index}`} src={slide} alt={`展会现场 ${index + 1}`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <ImageSection id="industry" image={sectionImages.industry} alt="行业首创板块">
          <div className="section-appendix">
            <div className="appendix-copy">
              <p className="appendix-copy__eyebrow">Global Brand &amp; Creator Matrix</p>
              <h2 className="appendix-copy__title">全球品牌与达人矩阵</h2>
              <p className="appendix-copy__text">联动头部品牌、平台、机构与达人资源，以滚动展陈的方式强化“全球共创”的现场势能。</p>
            </div>
            <Marquee itemClassName="marquee__item--logo" items={logoItems} />
            <Marquee direction="right" itemClassName="marquee__item--creator" items={creatorTrackItems} />
          </div>
        </ImageSection>

        <ImageSection id="design" image={sectionImages.expoDesign} alt="大会设计板块">
          <div className="section-panel section-panel--support">
            <img className="section-image" src={sectionImages.expoDesignReference} alt="大会设计参考视觉" />
          </div>
        </ImageSection>

        <ImageSection id="values" image={sectionImages.values} alt="核心价值板块" />
        <ImageSection id="highlights" image={sectionImages.highlights} alt="展会亮点板块" />
        <ImageSection id="content" image={sectionImages.content} alt="展会内容板块" />
        <ImageSection id="audience" image={sectionImages.audience} alt="用户画像板块" />

        <section className="content-section" id="creators">
          <div className="section-shell">
            <div className="section-title-image">
              <img alt="拟邀达人" src={sectionImages.creatorsTitle} />
            </div>
            <div className="creator-grid">
              {invitedCreators.map((creator) => (
                <article className="creator-card" key={creator}>
                  <img alt="拟邀达人卡片" src={creator} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <ImageSection id="review" image={sectionImages.review} alt="往期回顾板块" />
        <ImageSection id="organizer" image={sectionImages.organizer} alt="主办方介绍板块" />
        <ImageSection id="contact" image={sectionImages.contact} alt="联系我们板块" />

        <section className="content-section content-section--partners" id="partners">
          <div className="section-shell">
            <div className="section-title-image section-title-image--compact">
              <img alt="合作伙伴" src={sectionImages.partnersTitle} />
            </div>
            <div className="partner-grid">
              {logoItems.map((item) => (
                <div className="partner-grid__item" key={item}>
                  <img alt="合作伙伴 Logo" src={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState(getInternalPath());
  const [activeSection, setActiveSection] = useState('home');
  const [entryState, setEntryState] = useState(DEFAULT_ENTRY_STATE);
  const navSyncTimerRef = useRef(null);
  const isSignupPage = currentPath === '/signup';
  const isBuyPage = currentPath === '/buy';
  const isTicketPage = currentPath === '/ticket';
  const isPayPage = currentPath === '/pay';

  useEffect(() => {
    let cancelled = false;

    const hydrateMiniAppEntry = async () => {
      try {
        const miniAppUser = await resolveMiniAppUser();
        if (!miniAppUser) {
          return;
        }

        const nextEntryState = await syncMiniAppEntry(miniAppUser);
        if (!cancelled && nextEntryState) {
          setEntryState({
            ...DEFAULT_ENTRY_STATE,
            ...nextEntryState,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setEntryState(DEFAULT_ENTRY_STATE);
        }
      }
    };

    hydrateMiniAppEntry();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.title = isSignupPage
      ? 'KACE 2026 报名信息 - Kalodata'
      : 'KAGGE 2026 - Kalodata AI Go Global Exposition';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const handlePopState = () => {
      setCurrentPath(getInternalPath());
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (navSyncTimerRef.current) {
        window.clearTimeout(navSyncTimerRef.current);
      }
    };
  }, [isSignupPage]);

  useEffect(() => {
    if (isSignupPage || isBuyPage || isTicketPage || isPayPage) {
      return undefined;
    }

    const updateActiveSection = () => {
      const currentMarker = window.scrollY + 180;
      let currentSection = 'home';

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= currentMarker) {
          currentSection = item.id;
        }
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [isSignupPage, isBuyPage, isTicketPage, isPayPage]);

  const navigateTo = (path) => {
    const externalPath = toExternalPath(path);
    if (window.location.pathname !== externalPath) {
      window.history.pushState({}, '', externalPath);
    }

    setCurrentPath(path);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (target) {
      if (navSyncTimerRef.current) {
        window.clearTimeout(navSyncTimerRef.current);
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      navSyncTimerRef.current = window.setTimeout(() => {
        setActiveSection(sectionId);
      }, 720);
    }
  };

  if (isSignupPage) {
    return <SignupPage onNavigateHome={() => navigateTo('/')} />;
  }

  if (isBuyPage) {
    return <BuyPage onNavigateHome={() => navigateTo('/')} />;
  }

  if (isPayPage) {
    return <PayPage onNavigateHome={() => navigateTo('/')} />;
  }

  if (isTicketPage) {
    return <TicketPage onNavigateHome={() => navigateTo('/')} ticketWallet={entryState.ticket} />;
  }

  return (
    <HomePage
      activeSection={activeSection}
      entryLabel={entryState.entry_label}
      entryPath={entryState.entry_path || '/buy'}
      navigateTo={navigateTo}
      scrollToSection={scrollToSection}
    />
  );
}

export default App;
