import { useEffect, useState } from 'react';
import { heroDecor } from '../../landingData';
import {
  fetchTicketWallet,
  getStoredTicketWallet,
  resolveTicketLookupIdentity,
} from '../../utils/miniAppUser';
import './ticket.css';

function DoubleChevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="m6 6 6 6 6-6M6 12l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

export default function TicketPage({ onNavigateHome, ticketWallet: initialTicketWallet }) {
  const [ticketWallet, setTicketWallet] = useState(initialTicketWallet ?? getStoredTicketWallet());
  const [loading, setLoading] = useState(!initialTicketWallet && !getStoredTicketWallet());
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTicketWallet) {
      setTicketWallet(initialTicketWallet);
      setLoading(false);
      setError('');
      return undefined;
    }

    let cancelled = false;

    const hydrateTicketWallet = async () => {
      try {
        const lookupIdentity = await resolveTicketLookupIdentity();
        if (!lookupIdentity) {
          throw new Error('未找到票夹信息，请先报名或在小程序内打开');
        }

        const nextTicketWallet = await fetchTicketWallet(lookupIdentity);
        if (!cancelled) {
          setTicketWallet(nextTicketWallet);
          setError('');
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || '未找到票夹信息');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    hydrateTicketWallet();

    return () => {
      cancelled = true;
    };
  }, [initialTicketWallet]);

  const handleBackHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
      return;
    }

    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="ticket-page">
        <main className="ticket-main">
          <div className="ticket-card ticket-card--status">
            <p className="ticket-status__text">正在加载票夹信息...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!ticketWallet || error) {
    return (
      <div className="ticket-page">
        <main className="ticket-main">
          <div className="ticket-card ticket-card--status">
            <p className="ticket-status__text">{error || '未找到票夹信息'}</p>
            <button className="ticket-action-btn ticket-action-btn--solid" onClick={handleBackHome} type="button">
              返回首页
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="ticket-page">
      <main className="ticket-main">
        <div className="ticket-card">
          <div className="ticket-card__top">
            <div className="ticket-card__logo-area">
              <span className="ticket-card__brand">Kalodata</span>
            </div>
            <div className="ticket-card__title-area">
              <h1 className="ticket-card__title">KACE<br />2026</h1>
              <p className="ticket-card__subtitle">AI赋能跨境电商与海外达人合作展览会</p>
              <p className="ticket-card__sub-en">2026 Kalodata AI Cross-border E-commerce &amp; Influencer Expo</p>
            </div>
            <div className="ticket-card__actions">
              <button className="ticket-action-btn" onClick={handleBackHome} type="button">返回首页</button>
              <button className="ticket-action-btn ticket-action-btn--solid" type="button">我的票夹</button>
            </div>
          </div>

          <div className="ticket-divider">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="ticket-divider__dot" />
            ))}
          </div>

          <div className="ticket-card__body">
            <img alt="" aria-hidden="true" className="ticket-card__decor ticket-card__decor--left" src={heroDecor.left} />
            <img alt="" aria-hidden="true" className="ticket-card__decor ticket-card__decor--right" src={heroDecor.right} />

            <div className="ticket-success">
              <p className="ticket-success__text">恭喜您已成功购票</p>
              <p className="ticket-success__event">2026 Kalodata AI Cross-border E-commerce &amp; Influencer Expo</p>

              <div className="ticket-success__arrow">
                <DoubleChevron />
              </div>

              <div className="ticket-type-badge">{ticketWallet.ticket_type || 'KACE 2026 门票'}</div>
              <p className="ticket-tip">活动当天出示二维码即可核销入场</p>

              <div className="ticket-qr-wrap">
                <div className="ticket-qr-frame">
                  <img alt="KACE 2026 入场二维码" className="ticket-qr" src={ticketWallet.qr_code_url} />
                </div>
              </div>
            </div>
          </div>

          <div className="ticket-card__footer">
            <p className="ticket-info-row">持票人 | {ticketWallet.name || '-'}</p>
            <p className="ticket-info-row">手机号 | {ticketWallet.phone || '-'}</p>
            <p className="ticket-info-row">公司 | {ticketWallet.company || '-'}</p>
            <p className="ticket-info-row">时间 | {ticketWallet.event_date || '2026.08.04 - 2026.08.05'}</p>
            <p className="ticket-info-row">地点 | {ticketWallet.location || '深圳福田国际会展中心'}</p>
            <p className="ticket-greeting">现场见</p>
            <p className="ticket-policy">请妥善保管二维码，勿重复转发</p>
          </div>
        </div>
      </main>
    </div>
  );
}
