import { useEffect, useMemo, useRef, useState } from 'react';
import {
  audienceProfilePages,
  creatorTrackItems,
  heroDecor,
  heroGallery,
  logoItems,
  navItems,
  valueCreatorPages,
  visualCuts,
  visualSections,
} from './landingMobileData';
import BuyPage from './pages/buy/buy';
import PayPage from './pages/pay/PayPage';
import SignupPage from './pages/signup/SignupPage';
import TicketPage from './pages/ticket/TicketPage';
import { navigateBackToMiniProgram } from './utils/miniAppBridge';
import { resolveMiniAppUser, syncMiniAppEntry } from './utils/miniAppUser';

const SPONSORSHIP_URL = 'https://www.wjx.top/vm/tU5XHKW.aspx#';
const DEFAULT_ENTRY_STATE = {
  has_purchased: false,
  entry_label: '立即报名',
  entry_path: '/buy',
  ticket: null,
};

function FloatingActions({ entryLabel, entryPath, navigateTo, scrollToSection }) {
  const [activeAction, setActiveAction] = useState(null);

  const actions = [
    {
      id: 'register',
      label: entryLabel,
      onClick: () => navigateTo(entryPath),
    },
    {
      id: 'sponsorship',
      label: '招商合作',
      onClick: () => {
        window.location.href = SPONSORSHIP_URL;
      },
    },
    {
      id: 'consulting',
      label: '大会咨询',
      onClick: () => scrollToSection('contact'),
    },
  ];

  return (
    <div aria-label="快捷入口" className="floating-actions">
      {actions.map((action) => (
        <button
          aria-pressed={activeAction === action.id}
          className={activeAction === action.id ? 'floating-actions__button floating-actions__button--active' : 'floating-actions__button'}
          key={action.id}
          onBlur={() => setActiveAction((current) => (current === action.id ? null : current))}
          onClick={action.onClick}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setActiveAction(action.id);
            }
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setActiveAction((current) => (current === action.id ? null : current));
            }
          }}
          onPointerCancel={() => setActiveAction((current) => (current === action.id ? null : current))}
          onPointerDown={() => setActiveAction(action.id)}
          onPointerLeave={() => setActiveAction((current) => (current === action.id ? null : current))}
          onPointerUp={() => setActiveAction((current) => (current === action.id ? null : current))}
          type="button"
        >
          <span>{action.label}</span>
          <span aria-hidden="true" className="floating-actions__arrow">
            {`>`}
          </span>
        </button>
      ))}
    </div>
  );
}

function Marquee({ items, direction = 'left', itemClassName = '' }) {
  const trackItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="marquee">
      <div className={`marquee__track marquee__track--${direction}`}>
        {trackItems.map((item, index) => (
          <div className={`marquee__item ${itemClassName}`.trim()} key={`${direction}-${index}`}>
            <img alt="" src={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualSection({
  id,
  image,
  alt,
  className = '',
  markers = [],
  priority = false,
}) {
  return (
    <section className={`landing-visual-section ${className}`.trim()} id={id}>
      <div className="landing-visual-section__frame">
        <img
          alt={alt}
          className="landing-visual-section__image"
          loading={priority ? 'eager' : 'lazy'}
          src={image}
        />
        {markers.map((marker) => (
          <span
            className="landing-visual-section__marker"
            id={marker.id}
            key={marker.id}
            style={{ top: marker.top }}
          />
        ))}
      </div>
    </section>
  );
}

function CroppedImageSection({
  id,
  image,
  alt,
  cropStart,
  cropHeight,
  sourceHeight,
  className = '',
}) {
  const TagName = id ? 'section' : 'div';

  return (
    <TagName className={`landing-cropped-section ${className}`.trim()} id={id || undefined}>
      <div
        className="landing-cropped-section__viewport"
        style={{
          '--crop-aspect-ratio': `750 / ${cropHeight}`,
          '--crop-translate': `${-(cropStart / sourceHeight) * 100}%`,
        }}
      >
        <img alt={alt} className="landing-cropped-section__image" loading="lazy" src={image} />
      </div>
    </TagName>
  );
}

function IndustrySection() {
  return (
    <section className="industry-section" id="industry">
      <CroppedImageSection
        alt="行业首创"
        className="industry-section__crop"
        cropHeight={2880}
        cropStart={0}
        id=""
        image={visualSections.industry}
        sourceHeight={3100}
      />

      <div className="industry-section__marquees">
        <Marquee itemClassName="marquee__item--logo" items={logoItems} />
        <Marquee direction="right" itemClassName="marquee__item--creator" items={creatorTrackItems} />
      </div>
    </section>
  );
}

function CreatorValuesShowcase() {
  const sliderRef = useRef(null);
  const [activePage, setActivePage] = useState(0);

  const handleSliderScroll = (event) => {
    const container = event.currentTarget;
    const nextPage = Math.round(container.scrollLeft / container.clientWidth);
    setActivePage(Math.max(0, Math.min(valueCreatorPages.length - 1, nextPage)));
  };

  const scrollToPage = (pageIndex) => {
    const container = sliderRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      left: container.clientWidth * pageIndex,
      behavior: 'smooth',
    });
    setActivePage(pageIndex);
  };

  return (
    <section className="creator-values-showcase" id="creators">
      <div className="section-badge">核心价值</div>

      <div className="creator-values-slider" onScroll={handleSliderScroll} ref={sliderRef}>
        {valueCreatorPages.map((pageItems, index) => (
          <article className="creator-values-slide" key={`creator-page-${index + 1}`}>
            <div className="creator-values-grid">
              {pageItems.map((item) => (
                <article className="creator-values-card" key={item.id}>
                  <img alt={item.alt} loading="lazy" src={item.image} />
                </article>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="creator-values-slider__pagination">
        {valueCreatorPages.map((pageItems, index) => (
          <button
            aria-label={`Creator page ${index + 1}`}
            className={activePage === index ? 'creator-values-slider__dot creator-values-slider__dot--active' : 'creator-values-slider__dot'}
            key={`dot-${pageItems[0]?.id ?? index}`}
            onClick={() => scrollToPage(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

function AudienceUserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64">
      <circle cx="32" cy="32" fill="#b9caff" r="32" />
      <circle cx="32" cy="22" fill="none" r="8" stroke="#ffffff" strokeWidth="3.5" />
      <path
        d="M17 47v-4.5C17 35.597 23.268 30 31 30h2c7.732 0 14 5.597 14 12.5V47"
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
    </svg>
  );
}

function AudienceProfilesShowcase() {
  const sliderRef = useRef(null);
  const [activePage, setActivePage] = useState(0);

  const handleSliderScroll = (event) => {
    const container = event.currentTarget;
    const nextPage = Math.round(container.scrollLeft / container.clientWidth);
    setActivePage(Math.max(0, Math.min(audienceProfilePages.length - 1, nextPage)));
  };

  const scrollToPage = (pageIndex) => {
    const container = sliderRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      left: container.clientWidth * pageIndex,
      behavior: 'smooth',
    });
    setActivePage(pageIndex);
  };

  return (
    <section className="audience-showcase" id="audience">
      <div className="section-badge">用户画像</div>

      <div className="audience-showcase__slider" onScroll={handleSliderScroll} ref={sliderRef}>
        {audienceProfilePages.map((pageItems, index) => (
          <article className="audience-showcase__slide" key={`audience-page-${index + 1}`}>
            <div className="audience-showcase__cards">
              {pageItems.map((item) => (
                <article
                  className={`audience-showcase__card audience-showcase__card--${item.layout}`}
                  key={item.id}
                >
                  <div className="audience-showcase__icon">
                    <AudienceUserIcon />
                  </div>
                  <div className="audience-showcase__content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="audience-showcase__pagination">
        {audienceProfilePages.map((pageItems, index) => (
          <button
            aria-label={`Audience page ${index + 1}`}
            className={activePage === index ? 'audience-showcase__dot audience-showcase__dot--active' : 'audience-showcase__dot'}
            key={`audience-dot-${pageItems[0]?.id ?? index}`}
            onClick={() => scrollToPage(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

function ReviewSection() {
  return (
    <section className="review-section" id="review">
      <div className="section-badge">往期回顾</div>

      <div className="review-section__frame">
        <img
          alt="往期回顾"
          className="review-section__image"
          loading="lazy"
          src={visualSections.review}
        />
      </div>
    </section>
  );
}

function HomePage({ activeSection, entryLabel, entryPath, navigateTo, scrollToSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const { overflow } = document.body.style;
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  const handleScrollToSection = (sectionId) => {
    setMenuOpen(false);
    scrollToSection(sectionId);
  };

  return (
    <div className={`landing-page landing-page--mobile${menuOpen ? ' landing-page--menu-open' : ''}`}>
      <header className="mobile-header">
        <button
          aria-label="返回小程序主页"
          className="mobile-header__back"
          onClick={() => navigateBackToMiniProgram()}
          type="button"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          className="mobile-header__brand"
          onClick={() => {
            setMenuOpen(false);
            scrollToSection('home');
          }}
          type="button"
        >
          Kalodata
        </button>
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? '关闭导航' : '展开导航'}
          className={menuOpen ? 'mobile-header__menu mobile-header__menu--open' : 'mobile-header__menu'}
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div
        aria-hidden={!menuOpen}
        className={menuOpen ? 'mobile-menu mobile-menu--open' : 'mobile-menu'}
      >
        <div className="mobile-menu__surface">
          {navItems.map((item) => (
            <button
              className={item.id === activeSection ? 'mobile-menu__link mobile-menu__link--active' : 'mobile-menu__link'}
              key={item.id}
              onClick={() => handleScrollToSection(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <FloatingActions
        entryLabel={entryLabel}
        entryPath={entryPath}
        navigateTo={navigateTo}
        scrollToSection={scrollToSection}
      />

      <main className="landing-main">
        <section className="mobile-hero" id="home">
          <img
            alt=""
            aria-hidden="true"
            className="mobile-hero__decor mobile-hero__decor--left"
            src={heroDecor.left}
          />
          <img
            alt=""
            aria-hidden="true"
            className="mobile-hero__decor mobile-hero__decor--right"
            src={heroDecor.right}
          />

          <div className="mobile-hero__copy">
            <p className="mobile-hero__title">KACE 2026</p>
            <p className="mobile-hero__subtitle">
              中国最大的 AI 赋能
              <br />
              跨境电商
              <br />
              与海外达人
              <br />
              展览会
            </p>
            <p className="mobile-hero__english">
              2026 Kalodata
              <br />
              AI Cross-border
              <br />
              E-commerce &amp; Influencer
              <br />
              Expo
            </p>
            <p className="mobile-hero__meta">
              2026年8月4日 - 8月5日
              <br />
              深圳福田国际会展中心
            </p>
          </div>

          <div className="mobile-hero__features">
            <img alt="首页四大亮点" src={visualCuts.featureCards} />
          </div>

          <div className="mobile-hero__gallery">
            <Marquee itemClassName="marquee__item--hero-gallery" items={heroGallery} />
          </div>
        </section>

        <VisualSection
          alt="大会介绍"
          className="landing-visual-section--flush"
          id="intro"
          image={visualSections.intro}
          priority
        />

        <section className="agenda-section" id="content">
          <div className="section-badge">展会内容</div>

          <div className="agenda-section__heading agenda-section__heading--main">
            <span aria-hidden="true" className="agenda-section__backdrop-letter">
              F
            </span>
            <h3 className="agenda-section__main-title">主会场议题</h3>
          </div>

          <div className="agenda-section__cards">
            <img alt="主会场议题内容" loading="eager" src={visualCuts.agenda} />
          </div>

          <div className="agenda-section__heading agenda-section__heading--sub">
            <span aria-hidden="true" className="agenda-section__backdrop-letter agenda-section__backdrop-letter--sub">
              C
            </span>
            <h3 className="agenda-section__sub-title">分会场议题</h3>
            <p className="agenda-section__sub-copy">（分会场议程，即将揭晓，敬请期待）</p>
          </div>
        </section>

        <section className="landing-cut-section landing-cut-section--highlights" id="highlights">
          <div className="section-badge">展会亮点</div>
          <div className="landing-cut-section__frame landing-cut-section__frame--highlights">
            <img alt="展会亮点" loading="eager" src={visualCuts.highlights} />
          </div>
          <div className="landing-cut-section__markets">
            <img alt="五大市场" loading="eager" src={visualCuts.markets} />
          </div>
        </section>

        <IndustrySection />
        <VisualSection alt="核心价值" id="values" image={visualSections.values} />
        <CreatorValuesShowcase />
        <AudienceProfilesShowcase />
        <ReviewSection />
        <VisualSection alt="主办方介绍与大会设计" image={visualSections.organizerDesign} />
        <VisualSection alt="联系我们与合作伙伴" id="contact" image={visualSections.contactPartners} />
      </main>
    </div>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [activeSection, setActiveSection] = useState('intro');
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
      : 'KACE 2026 - Kalodata';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
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
      let currentSection = 'intro';

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        const elementTop = element
          ? element.getBoundingClientRect().top + window.scrollY
          : Number.POSITIVE_INFINITY;

        if (elementTop <= currentMarker) {
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
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
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
