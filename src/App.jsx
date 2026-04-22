import { useEffect, useMemo, useRef, useState } from 'react';
import {
  creatorTrackItems,
  heroGallery,
  logoItems,
  navItems,
  valueCreatorPages,
  visualCuts,
  visualSections,
} from './landingMobileData';
import BuyPage from './pages/buy/buy';
// import SignupPage from './pages/signup/SignupPage';
import TicketPage from './pages/ticket/TicketPage';
import { navigateBackToMiniProgram, navigateToOtherMiniProgram, openExternalUrl } from './utils/miniAppBridge';
import { getStoredMiniAppUser, resolveMiniAppUser, syncMiniAppEntry } from './utils/miniAppUser';

const SPONSORSHIP_URL = 'https://active.kalodata.com/survey/';
const DEFAULT_ENTRY_STATE = {
  has_purchased: false,
  entry_label: '立即报名',
  entry_path: '/buy',
  ticket: null,
};

function isInMiniProgram() {
  return window.__wxjs_environment === 'miniprogram' || /miniProgram/i.test(navigator.userAgent);
}

function navigateToMiniProgramAuth(setLoginMsg) {
  if (!isInMiniProgram()) {
    setLoginMsg('请在微信小程序中打开');
    return;
  }

  setLoginMsg('请先登录授权，正在跳转...');
  setTimeout(() => {
    if (window.wx?.miniProgram?.navigateTo) {
      window.wx.miniProgram.navigateTo({ url: '/pages/authorize/authorize?redirectUrl=pages/meeting/meeting' });
    } else {
      setLoginMsg('微信 JSSDK 未加载，请刷新或退出重进小程序。');
    }
  }, 1000);
}

function FloatingActions({ entryLabel, entryPath, navigateTo, scrollToSection, setLoginMsg }) {
  const [activeAction, setActiveAction] = useState(null);

  const actions = [
    {
      id: 'register',
      label: entryLabel,
      onClick: () => {
        const miniAppUser = getStoredMiniAppUser();
        if (miniAppUser?.phone) {
          navigateTo(entryPath);
        } else {
          navigateToMiniProgramAuth(setLoginMsg);
        }
      },
    },
    {
      id: 'sponsorship',
      label: '招商合作',
      onClick: () => {
        // 问卷星小程序 AppID，路径中 activityId 为问卷短ID
        const WJX_APP_ID = 'wxd947200f82267e58';
        const WJX_PATH = 'pages/wjxqList/wjxqList?activityId=tU5XHKW';
        if (!navigateToOtherMiniProgram(WJX_APP_ID, WJX_PATH)) {
          // 非小程序环境回退到网页版
          openExternalUrl(SPONSORSHIP_URL);
        }
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

function Marquee({ items, direction = 'left', itemClassName = '', className = '', trackClassName = '' }) {
  const trackItems = useMemo(() => [...items, ...items], [items]);
  const marqueeClassName = ['marquee', className].filter(Boolean).join(' ');
  const trackClassNameValue = ['marquee__track', `marquee__track--${direction}`, trackClassName].filter(Boolean).join(' ');

  return (
    <div className={marqueeClassName}>
      <div className={trackClassNameValue}>
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
      <img
        alt="拟邀请达人背景"
        className="creator-values-showcase__background"
        loading="lazy"
        src={visualSections.invitedCreatorsBackground}
      />

      <div className="creator-values-showcase__content">
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
      </div>
    </section>
  );
}

function HomePage({ activeSection, entryLabel, entryPath, navigateTo, scrollToSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginMsg, setLoginMsg] = useState(null);

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

      {loginMsg && <div className="login-toast">{loginMsg}</div>}

      <FloatingActions
        entryLabel={entryLabel}
        entryPath={entryPath}
        navigateTo={navigateTo}
        scrollToSection={scrollToSection}
        setLoginMsg={setLoginMsg}
      />

      <main className="landing-main">
        <section className="mobile-hero" id="home">
          <div className="mobile-hero__reference-frame">
            <img
              alt="首页首屏视觉"
              className="mobile-hero__reference"
              src={visualCuts.heroReference}
            />

            <div className="mobile-hero__gallery-slot">
              <Marquee
                className="mobile-hero__gallery"
                itemClassName="marquee__item--hero-gallery"
                items={heroGallery}
                trackClassName="mobile-hero__gallery-track"
              />
            </div>
          </div>
        </section>

        <VisualSection
          alt="大会介绍"
          className="landing-visual-section--flush"
          id="intro"
          image={visualSections.intro}
          priority
        />

        <VisualSection
          alt="展会内容"
          className="landing-visual-section--flush"
          id="content"
          image={visualCuts.content}
          priority
        />

        <VisualSection
          alt="展会亮点"
          className="landing-visual-section--flush"
          id="highlights"
          image={visualCuts.highlights}
          priority
        />

        <IndustrySection />
        <VisualSection alt="核心价值" id="values" image={visualSections.values} />
        <CreatorValuesShowcase />
        <VisualSection alt="用户画像" id="audience" image={visualSections.audience} />
        <VisualSection alt="往期回顾" id="review" image={visualSections.review} />
        <VisualSection alt="主办方介绍" image={visualSections.organizer} />
        <VisualSection alt="大会设计主视觉与展会平面图" image={visualSections.expoDesignMain} />
        <VisualSection alt="大会设计补充视觉" image={visualSections.expoDesignSecondary} />
        <VisualSection alt="联系我们" id="contact" image={visualSections.contact} />
      </main>
    </div>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [activeSection, setActiveSection] = useState('intro');
  const [entryState, setEntryState] = useState(DEFAULT_ENTRY_STATE);
  const navSyncTimerRef = useRef(null);
  const isBuyPage = currentPath === '/buy';
  const isTicketPage = currentPath === '/ticket';

  useEffect(() => {
    const preventNativeDrag = (event) => {
      event.preventDefault();
    };

    document.addEventListener('dragstart', preventNativeDrag);

    return () => {
      document.removeEventListener('dragstart', preventNativeDrag);
    };
  }, []);

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
    if (isBuyPage || isTicketPage) {
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
  }, [ isBuyPage, isTicketPage]);

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

  if (isBuyPage) {
    return <BuyPage onNavigateHome={() => navigateTo('/')} />;
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
