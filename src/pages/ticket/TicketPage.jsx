import { useEffect, useMemo, useState } from 'react';
import {
  fetchTicketWallet,
  getStoredTicketWallet,
  resolveTicketLookupIdentity,
} from '../../utils/miniAppUser';
import { toExternalPath } from '../../utils/routes';
import './ticket.css';

const publicAsset = (relativePath) => encodeURI(`${import.meta.env.BASE_URL}${relativePath}`);
const ticketWalletBackground = publicAsset('landing/小程序购票页/票夹底图.png');
const ticketWalletHomeButton = publicAsset('landing/小程序购票页/按钮 - 票夹 - 返回首页.svg');

function TicketStatus({ actionLabel = '返回首页', message, onAction }) {
  return (
    <div className="ticket-page">
      <main className="ticket-main">
        <section className="ticket-status-card">
          <p className="ticket-status-card__text">{message}</p>
          <button className="ticket-status-card__button" onClick={onAction} type="button">
            {actionLabel}
          </button>
        </section>
      </main>
    </div>
  );
}

export default function TicketPage({ onNavigateHome, ticketWallet: initialTicketWallet }) {
  const storedTicketWallet = getStoredTicketWallet();
  const [ticketWallet, setTicketWallet] = useState(initialTicketWallet ?? storedTicketWallet);
  const [loading, setLoading] = useState(!initialTicketWallet && !storedTicketWallet);
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
          throw new Error('未找到票夹信息，请先购票或在小程序内打开');
        }

        const nextTicketWallet = await fetchTicketWallet(lookupIdentity);
        if (!nextTicketWallet) {
          throw new Error('未找到票夹信息，请稍后重试');
        }

        if (!cancelled) {
          setTicketWallet(nextTicketWallet);
          setError('');
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || '未找到票夹信息，请稍后重试');
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

    window.location.href = toExternalPath('/');
  };

  const ticketTypeLabel = useMemo(
    () => ticketWallet?.ticket_type || ticketWallet?.ticketType || 'KACE 2026 门票',
    [ticketWallet],
  );

  const ticketQrUrl = useMemo(
    () => ticketWallet?.qr_code_url || ticketWallet?.qrCodeUrl || ticketWallet?.qr_code || '',
    [ticketWallet],
  );

  if (loading) {
    return <TicketStatus message="正在加载票夹信息..." onAction={handleBackHome} />;
  }

  if (!ticketWallet || error) {
    return <TicketStatus message={error || '未找到票夹信息'} onAction={handleBackHome} />;
  }

  return (
    <div className="ticket-page">
      <main className="ticket-main">
        <section className="ticket-wallet-card" aria-label="我的票夹">
          <img alt="KACE 2026 票夹底图" className="ticket-wallet-card__background" src={ticketWalletBackground} />

          <div className="ticket-wallet-card__overlay">
            <div className="ticket-wallet-card__ticket-type" title={ticketTypeLabel}>
              <span>{ticketTypeLabel}</span>
            </div>

            <div className="ticket-wallet-card__qr-slot">
              {ticketQrUrl ? (
                <img alt="KACE 2026 入场二维码" className="ticket-wallet-card__qr" src={ticketQrUrl} />
              ) : (
                <div className="ticket-wallet-card__qr-empty">二维码生成中</div>
              )}
            </div>

            <button className="ticket-wallet-card__home-button" onClick={handleBackHome} type="button">
              <img alt="" aria-hidden="true" src={ticketWalletHomeButton} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
