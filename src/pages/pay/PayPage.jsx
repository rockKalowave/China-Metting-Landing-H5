import { useEffect, useState } from 'react';
import { heroDecor } from '../../landingData';
import { getApiUrl } from '../../utils/api';
import { getStoredMiniAppUser } from '../../utils/miniAppUser';
import { toExternalPath } from '../../utils/routes';
import './pay.css';

const products = [
  { productCode: 'TICKET_GENERAL', name: '普通票'  },
  { productCode: 'TICKET_VIP', name: 'VIP票' },
  { productCode: 'TICKET_EARLY_BIRD', name: '早鸟票' },
  { productCode: 'TICKET_PREMIUM', name: '尊享票' },
];

function findSelectedProduct(orderInfo) {
  if (orderInfo?.productCode) {
    return products.find((item) => item.productCode === orderInfo.productCode) ?? null;
  }
  return null;
}

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
      window.location.href = toExternalPath('/');
    }
  }, []);

  const saveUser = async (status) => {
    const response = await fetch(getApiUrl('/users'), {
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

    const selectedProduct = findSelectedProduct(orderInfo);
    if (!selectedProduct) {
      setPayMsg({ type: 'error', text: 'Unknown product. Please go back and reselect your ticket.' });
      return;
    }

    setPaying(true);
    setPayMsg(null);

    try {
      if (selectedProduct.price === 0) {
        await saveUser('paid');
        setPayMsg({ type: 'success', text: 'Registration submitted successfully.' });
        setTimeout(() => {
          window.location.href = toExternalPath('/ticket');
        }, 1200);
        return;
      }

      const savedUser = await saveUser('pending');
      const outTradeNo = `TKT-KACE_${savedUser.id}_${Date.now()}`;
      const payRes = await fetch(getApiUrl('/pay/h5'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: savedUser.id,
          out_trade_no: outTradeNo,
          total: orderInfo.price,
          productCode: selectedProduct.productCode,
          description: `KACE 2026 ${orderInfo.ticketTitle || 'Admission Ticket'}`,
        }),
      });

      const payResult = await payRes.json();
      if (!payRes.ok || payResult.code !== 0) {
        setPayMsg({
          type: 'error',
          text: payResult.message || 'Payment service is temporarily unavailable. Please try again later.',
        });
        return;
      }

      const orderParams = {
        eventId: 'EVT-2026-001',
        productCode: payResult.data?.product_code || selectedProduct.productCode,
        customOrderId: `TKT-MYORDER-${Date.now()}`,
      };

      console.log('跳转小程序支付页，订单参数: ' + JSON.stringify(orderParams));

      const inMiniProgram =
        window.__wxjs_environment === 'miniprogram' || /miniProgram/i.test(navigator.userAgent);

      if (inMiniProgram && window.wx?.miniProgram?.navigateTo) {
        window.wx.miniProgram.navigateTo({
          url: `/pages/pay/pay?order=${encodeURIComponent(JSON.stringify(orderParams))}&language=zh-CN`,
        });
      } else if (inMiniProgram) {
        setPayMsg({ type: 'error', text: '微信 JSSDK 未加载,请刷新或退出重进小程序。' });
      } else {
        setPayMsg({ type: 'error', text: '请在微信小程序中打开' });
      }
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
