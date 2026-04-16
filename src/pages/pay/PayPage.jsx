import { useEffect, useState } from 'react';
import { heroDecor } from '../../landingData';
import { getStoredMiniAppUser } from '../../utils/miniAppUser';
import './pay.css';

const API_BASE = 'http://localhost:3000/api';

function IconLock() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 018 0v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function PayPage({ onNavigateHome }) {
  const orderInfo = JSON.parse(sessionStorage.getItem('kace_order') || '{}');
  const miniAppUser = getStoredMiniAppUser();
  const resolvedPhone = orderInfo.phone || miniAppUser?.phone || '';
  const resolvedWechatOpenId = orderInfo.wechatOpenId || miniAppUser?.wechatOpenId || '';
  const resolvedWechatUnionId = orderInfo.wechatUnionId || miniAppUser?.wechatUnionId || '';
  const phoneDisplay = orderInfo.areaCode && resolvedPhone ? `${orderInfo.areaCode} ${resolvedPhone}` : resolvedPhone || '-';
  const [paying, setPaying] = useState(false);
  const [payMsg, setPayMsg] = useState(null);

  useEffect(() => {
    const navType = performance.getEntriesByType('navigation')[0]?.type;
    if (navType === 'reload') {
      window.location.href = '/';
    }
  }, []);

  const saveUser = async (status) => {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: orderInfo.name,
        company: orderInfo.company,
        position: orderInfo.position || '',
        phone: resolvedPhone,
        wechat_open_id: resolvedWechatOpenId,
        wechat_union_id: resolvedWechatUnionId,
        id_card_no: orderInfo.idNumber,
        email: '',
        ticket_type: orderInfo.ticketTitle || '',
        status,
      }),
    });

    const result = await response.json();
    if (!response.ok || result.code !== 0 || !result.data?.id) {
      throw new Error(result.message || 'Failed to save registration.');
    }
    return result.data;
  };

  const handlePay = async () => {
    if (!orderInfo.name || !resolvedPhone || !orderInfo.idNumber) {
      setPayMsg({ type: 'error', text: 'Order information is incomplete. Please go back and submit the form again.' });
      return;
    }

    setPaying(true);
    setPayMsg(null);

    try {
      if (orderInfo.price === 0) {
        await saveUser('paid');
        setPayMsg({ type: 'success', text: 'Registration submitted successfully.' });
        setTimeout(() => {
          window.location.href = '/ticket';
        }, 1200);
        return;
      }

      const savedUser = await saveUser('pending');
      const outTradeNo = `KACE_${savedUser.id}_${Date.now()}`;
      const payRes = await fetch(`${API_BASE}/pay/h5`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: savedUser.id,
          out_trade_no: outTradeNo,
          total: orderInfo.price,
          description: `KACE 2026 ${orderInfo.ticketTitle || 'Admission Ticket'}`,
        }),
      });

      const payResult = await payRes.json();
      if (!payRes.ok || payResult.code !== 0 || !payResult.data?.h5_url) {
        setPayMsg({
          type: 'error',
          text: payResult.message || 'Payment service is temporarily unavailable. Please try again later.',
        });
        return;
      }

      window.location.href = payResult.data.h5_url;
    } catch (err) {
      console.error('Payment error:', err);
      setPayMsg({
        type: 'error',
        text: err.message?.includes('ENOENT')
          ? 'Payment certificate files are missing. Please contact the administrator.'
          : (err.message || 'Network error. Please try again later.'),
      });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="pay-page">
      <section className="pay-hero">
        <img alt="" aria-hidden="true" className="pay-hero__decor pay-hero__decor--left" src={heroDecor.left} />
        <img alt="" aria-hidden="true" className="pay-hero__decor pay-hero__decor--right" src={heroDecor.right} />
        <button className="pay-hero__brand" onClick={onNavigateHome} type="button">
          Kalodata
        </button>
        <div className="pay-hero__content">
          <div className="pay-hero__title-wrap">
            <h1 className="pay-hero__title">KACE</h1>
            <div className="pay-hero__title-side">
              <p>2026 Kalodata AI</p>
              <p>Cross-border</p>
              <p>E-commerce &amp; Influencer</p>
              <p>Expo</p>
            </div>
          </div>
          <div className="pay-hero__headline">
            <span className="pay-hero__year">2026</span>
            <p className="pay-hero__cn">Order Confirmation</p>
          </div>
          <p className="pay-hero__meta">2026-08-04 to 2026-08-05 | Shenzhen Futian International Convention Center</p>
        </div>
      </section>

      <main className="pay-main">
        <section className="pay-card pay-card--order">
          <h2 className="pay-card__title">Order Information</h2>

          <div className="pay-info">
            <div className="pay-info__row">
              <span className="pay-info__label">Ticket</span>
              <span className="pay-info__value">{orderInfo.ticketTitle || '-'}</span>
            </div>
            <div className="pay-info__row">
              <span className="pay-info__label">Name</span>
              <span className="pay-info__value">{orderInfo.name || '-'}</span>
            </div>
            <div className="pay-info__row">
              <span className="pay-info__label">Mobile</span>
              <span className="pay-info__value">{phoneDisplay}</span>
            </div>
            <div className="pay-info__row">
              <span className="pay-info__label">Company</span>
              <span className="pay-info__value">{orderInfo.company || '-'}</span>
            </div>
          </div>
        </section>

        <section className="pay-card pay-card--amount">
          <div className="pay-amount">
            <span className="pay-amount__label">Amount Due</span>
            <div className="pay-amount__price">
              <span className="pay-amount__currency">&yen;</span>
              <span className="pay-amount__number">{orderInfo.price ?? '0'}</span>
            </div>
          </div>
          {orderInfo.price > 0 && orderInfo.originalPrice > orderInfo.price && (
            <p className="pay-amount__savings">
              Saved &yen;{orderInfo.originalPrice - orderInfo.price}
            </p>
          )}
          {orderInfo.price === 0 && (
            <p className="pay-amount__free-tag">Free Ticket</p>
          )}
        </section>

        <div className="pay-security">
          <IconLock />
          <span>Your information is protected and the payment flow is secured.</span>
        </div>

        {payMsg && (
          <div className={`pay-msg pay-msg--${payMsg.type}`}>
            {payMsg.text}
          </div>
        )}

        <button className="pay-btn" onClick={handlePay} disabled={paying} type="button">
          {paying ? 'Processing...' : orderInfo.price > 0 ? 'Pay Now' : 'Confirm Registration'}
        </button>
      </main>
    </div>
  );
}
