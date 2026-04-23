import { useEffect, useMemo, useRef, useState } from 'react';
import { getApiUrl } from '../../utils/api';
import {
  cachePendingRealNameVerification,
  getPendingRealNameVerification,
  getStoredMiniAppUser,
  initRealNameVerification,
  resolveMiniAppUser,
} from '../../utils/miniAppUser';
import { toExternalPath } from '../../utils/routes';
import './buy.css';

const publicAsset = (relativePath) => encodeURI(`${import.meta.env.BASE_URL}${relativePath}`);
const buyHeroImage = publicAsset('landing/票种设计.png');

const identityOptions = ['设计师', '品牌方', '跨境卖家', '服务商', '达人 / MCN'];

import { signupTickets } from '../../utils/tickets';

function IconBack() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M14.5 5.5 8 12l6.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="m5 9 7 7 7-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconIdentity() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M12 12c2.8 0 5-2.3 5-5.1S14.8 1.8 12 1.8 7 4.1 7 6.9s2.2 5.1 5 5.1Zm0 2.2c-4.7 0-8.5 3-8.5 6.7V22h17v-1.1c0-3.7-3.8-6.7-8.5-6.7Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconCompany() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Zm0 0v9.5m8-5-8 5-8-5m8 5L4 17.5m8-6L20 17.5"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconName() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 9h3m-3 4h8m-8 4h8m1-8h-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function IconIdCard() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="4.5" width="18" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 9h6m-6 4h4m6-4v6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M16.5 16V8.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M15 10h3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M15 13h3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function IconCheck({ included }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      {included ? (
        <>
          <rect x="1.5" y="1.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m5.5 10.5 2.8 2.8 6.2-6.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </>
      ) : (
        <>
          <rect x="1.5" y="1.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m6 6 8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

function Field({ children, label, required = false }) {
  return (
    <div className="buy-field">
      <label className="buy-label">
        {label}
        {required ? <span> *</span> : null}
      </label>
      {children}
    </div>
  );
}

function getTicketIdByOrder(orderData) {
  return signupTickets.find(
    (ticket) => ticket.productCode === orderData?.productCode || ticket.title === orderData?.ticketTitle,
  )?.id ?? signupTickets[0].id;
}

function buildInitialFormData(miniAppUser, pendingVerification) {
  const pendingOrder = pendingVerification?.orderData;
  return {
    identity: pendingOrder?.position || identityOptions[0],
    company: pendingOrder?.company || '',
    name: pendingOrder?.name || '',
    idNumber: pendingOrder?.idNumber || '',
    phone: miniAppUser?.phone || pendingOrder?.phone || '',
  };
}

function isReusableVerifiedOrder(pendingVerification, orderData) {
  if (!pendingVerification?.verified || !pendingVerification?.orderData || !orderData) {
    return false;
  }

  const verifiedAt = Number(pendingVerification.verifiedAt || 0);
  if (!verifiedAt || Date.now() - verifiedAt > 30 * 60 * 1000) {
    return false;
  }

  const pendingOrder = pendingVerification.orderData;
  return pendingOrder.name === orderData.name
    && pendingOrder.idNumber === orderData.idNumber
    && pendingOrder.phone === orderData.phone
    && pendingOrder.productCode === orderData.productCode;
}

export default function BuyPage({ onNavigateHome }) {
  const initialMiniAppUser = getStoredMiniAppUser();
  const initialPendingVerification = getPendingRealNameVerification();
  const visibleTickets = useMemo(() => signupTickets, []);
  const ticketGridRef = useRef(null);
  const [miniAppUser, setMiniAppUser] = useState(initialMiniAppUser);
  const [selectedTicket, setSelectedTicket] = useState(getTicketIdByOrder(initialPendingVerification?.orderData));
  const [formData, setFormData] = useState(() => buildInitialFormData(initialMiniAppUser, initialPendingVerification));
  const [submitMsg, setSubmitMsg] = useState(null);
  const [paying, setPaying] = useState(false);
  const [identityVerifying, setIdentityVerifying] = useState(false);

  const selectedTicketInfo = useMemo(
    () => visibleTickets.find((ticket) => ticket.id === selectedTicket) ?? visibleTickets[0],
    [selectedTicket, visibleTickets],
  );

  useEffect(() => {
    let cancelled = false;

    const hydrateMiniAppUser = async () => {
      const resolvedUser = await resolveMiniAppUser();
      if (cancelled || !resolvedUser) {
        return;
      }

      setMiniAppUser(resolvedUser);
      setFormData((prev) => ({
        ...prev,
        phone: resolvedUser.phone || prev.phone,
      }));
    };

    hydrateMiniAppUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setSubmitMsg(null);
  };

  const handleIdNumberChange = (event) => {
    const value = event.target.value.toUpperCase().replace(/[^0-9X]/g, '').slice(0, 18);
    setFormData((prev) => ({ ...prev, idNumber: value }));
    setSubmitMsg(null);
  };

  const buildOrderData = () => {
    const { company, idNumber, identity, name, phone } = formData;

    if (!identity || !company || !name || !idNumber || !phone) {
      setSubmitMsg({ type: 'error', text: '请填写所有必填项' });
      return null;
    }

    if (!/^[\u4e00-\u9fa5\u00b7]{2,}$/.test(name)) {
      setSubmitMsg({ type: 'error', text: '姓名仅支持中文字符，请输入身份证上的真实姓名' });
      return null;
    }

    if (!/^[1-9]\d{16}[\dX]$/.test(idNumber)) {
      setSubmitMsg({ type: 'error', text: '请输入正确的18位身份证号' });
      return null;
    }

    if (!/^1\d{10}$/.test(phone)) {
      setSubmitMsg({ type: 'error', text: '仅支持中国大陆 +86 手机号' });
      return null;
    }

    if (!miniAppUser?.phone) {
      setSubmitMsg({ type: 'error', text: '请先在小程序内完成手机号授权' });
      return null;
    }

    if (miniAppUser.phone !== phone) {
      setSubmitMsg({ type: 'error', text: '手机号需与小程序授权信息一致' });
      return null;
    }

    return {
      areaCode: '+86',
      company,
      idNumber,
      name,
      originalPrice: selectedTicketInfo.originalPrice ?? 0,
      phone: miniAppUser.phone,
      position: identity,
      price: selectedTicketInfo.price ?? 0,
      productCode: selectedTicketInfo.productCode,
      ticketTitle: selectedTicketInfo.title,
      wechatOpenId: miniAppUser.wechatOpenId || '',
      wechatUnionId: miniAppUser.wechatUnionId || '',
    };
  };

  const saveUser = async (orderData, status) => {
    const response = await fetch(getApiUrl('/users'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: orderData.name,
        company: orderData.company,
        position: orderData.position || '',
        phone: orderData.phone,
        wechat_open_id: orderData.wechatOpenId,
        wechat_union_id: orderData.wechatUnionId,
        id_card_no: orderData.idNumber,
        email: '',
        ticket_type: orderData.productCode || '',
        status,
      }),
    });

    const result = await response.json();
    if (!response.ok || result.code !== 0 || !result.data?.id) {
      throw new Error(result.message || '保存报名信息失败');
    }
    return result.data;
  };

  const submitOrder = async (orderData) => {
    setPaying(true);
    setSubmitMsg(null);

    try {
      if (orderData.price === 0) {
        await saveUser(orderData, 'paid');
        setSubmitMsg({ type: 'success', text: '报名信息提交成功' });
        setTimeout(() => {
          window.location.href = toExternalPath('/ticket');
        }, 1200);
        return;
      }

      const savedUser = await saveUser(orderData, 'pending');
      const outTradeNo = `TKT-KACE-${savedUser.id}-${Date.now()}`;
      const payRes = await fetch(getApiUrl('/pay/h5'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: savedUser.id,
          out_trade_no: outTradeNo,
          total: orderData.price,
          productCode: orderData.productCode,
          description: `KACE 2026 ${orderData.ticketTitle || '入场门票'}`,
        }),
      });

      const payResult = await payRes.json();
      if (!payRes.ok || payResult.code !== 0) {
        setSubmitMsg({
          type: 'error',
          text: payResult.message || '支付服务暂不可用，请稍后重试',
        });
        return;
      }

      const orderParams = {
        eventId: 'EVT-2026-001',
        productCode: payResult.data?.product_code || orderData.productCode,
        customOrderId: outTradeNo,
      };

      const inMiniProgram =
        window.__wxjs_environment === 'miniprogram' || /miniProgram/i.test(navigator.userAgent);

      if (inMiniProgram && window.wx?.miniProgram?.navigateTo) {
        window.wx.miniProgram.navigateTo({
          url: `/pages/pay/pay?order=${encodeURIComponent(JSON.stringify(orderParams))}&language=zh-CN`,
        });
      } else if (inMiniProgram) {
        setSubmitMsg({ type: 'error', text: '微信 JSSDK 未加载，请刷新后重试' });
      } else {
        setSubmitMsg({ type: 'error', text: '请在微信小程序中打开' });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setSubmitMsg({
        type: 'error',
        text: err.message?.includes('ENOENT')
          ? '支付证书缺失，请联系管理员处理'
          : (err.message || '网络异常，请稍后重试'),
      });
    } finally {
      setPaying(false);
    }
  };

  const handleSubmit = async () => {
    const orderData = buildOrderData();
    if (!orderData) {
      return;
    }

    const pendingVerification = getPendingRealNameVerification();
    if (isReusableVerifiedOrder(pendingVerification, orderData)) {
      await submitOrder(orderData);
      return;
    }

    setIdentityVerifying(true);
    setSubmitMsg(null);

    try {
      // const verifyResult = await initRealNameVerification({
      //   name: orderData.name,
      //   idNumber: orderData.idNumber,
      //   phone: orderData.phone,
      //   ticketType: orderData.ticketTitle,
      // });

      // if (!verifyResult?.request_no) {
      //   setSubmitMsg({ type: 'error', text: '实名认证初始化失败，请稍后重试' });
      //   return;
      // }

      // if (!verifyResult?.verified) {
      //   cachePendingRealNameVerification(null);
      //   setSubmitMsg({
      //     type: 'error',
      //     text: verifyResult?.message || '姓名与身份证号校验未通过，请检查后重试',
      //   });
      //   return;
      // }

      // cachePendingRealNameVerification({
      //   requestNo: verifyResult.request_no,
      //   orderData,
      //   verified: true,
      //   verifiedAt: Date.now(),
      // });

      await submitOrder(orderData);
    } catch (error) {
      setSubmitMsg({
        type: 'error',
        text: error.message || '实名认证服务暂不可用，请稍后重试',
      });
    } finally {
      setIdentityVerifying(false);
    }
  };

  const handleBack = () => {
    if (onNavigateHome) {
      onNavigateHome();
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = toExternalPath('/');
  };

  const handleTicketScroll = (event) => {
    const container = event.currentTarget;
    const cards = Array.from(container.querySelectorAll('[data-ticket-id]'));

    if (!cards.length) {
      return;
    }

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let nextTicketId = selectedTicket;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nextTicketId = card.getAttribute('data-ticket-id') || nextTicketId;
      }
    });

    if (nextTicketId !== selectedTicket) {
      setSelectedTicket(nextTicketId);
    }
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTicket(ticketId);

    const container = ticketGridRef.current;
    const target = container?.querySelector(`[data-ticket-id="${ticketId}"]`);

    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  return (
    <div className="buy-page">
      <section className="buy-hero">
        <img alt="KACE 2026 购票页顶部视觉" className="buy-hero__image" src={buyHeroImage} />

        <button aria-label="返回" className="buy-hero__back" onClick={handleBack} type="button">
          <IconBack />
        </button>
      </section>

      <main className="buy-main">
        <section className="buy-section">
          <div className="buy-section__heading">
            <h2>报名信息</h2>
            <p>带有 * 号为必填项</p>
          </div>

          <Field label="您的身份" required>
            <div className="buy-input buy-input--select">
              <span className="buy-input__icon">
                <IconIdentity />
              </span>
              <select value={formData.identity} onChange={updateField('identity')}>
                {identityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="buy-input__arrow">
                <IconChevron />
              </span>
            </div>
          </Field>

          <Field label="公司/品牌名称" required>
            <div className="buy-input">
              <span className="buy-input__icon">
                <IconCompany />
              </span>
              <input
                placeholder="请输入公司或品牌名称"
                value={formData.company}
                onChange={updateField('company')}
              />
            </div>
          </Field>

          <Field label="您的姓名" required>
            <div className="buy-input">
              <span className="buy-input__icon">
                <IconName />
              </span>
              <input placeholder="请输入真实姓名" value={formData.name} onChange={updateField('name')} />
            </div>
          </Field>

          <Field label="身份证" required>
            <div className="buy-input">
              <span className="buy-input__icon">
                <IconIdCard />
              </span>
              <input
                autoCapitalize="characters"
                autoCorrect="off"
                inputMode="text"
                spellCheck={false}
                type="text"
                placeholder="请输入身份证号"
                value={formData.idNumber}
                onChange={handleIdNumberChange}
              />
            </div>
          </Field>

          <Field label="手机号" required>
            <div className="buy-phone buy-phone--locked">
              <div className="buy-phone__prefix">
                <span>+86</span>
                <span className="buy-phone__prefix-arrow">
                  <IconChevron />
                </span>
              </div>
              <input
                inputMode="numeric"
                maxLength={11}
                placeholder="请先在小程序完成手机号授权"
                value={formData.phone}
                readOnly
              />
            </div>
            <p className="buy-phone__hint">手机号由小程序授权提供，当前页面不可修改。</p>
          </Field>

          <section className="buy-section buy-section--tickets" style={{
            marginTop: '14px',
          }}>
            <h3>入场门票</h3>

            <div className="buy-ticket-grid" onScroll={handleTicketScroll} ref={ticketGridRef}>
              {visibleTickets.map((ticket) => {
                const isActive = ticket.id === selectedTicket;

                return (
                  <button
                    className={isActive ? 'buy-ticket buy-ticket--active' : 'buy-ticket'}
                    data-ticket-id={ticket.id}
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket.id)}
                    type="button"
                  >
                    <div className="buy-ticket__header">
                      <div>
                        <h4>{ticket.title}</h4>
                        <p>{ticket.note}</p>
                      </div>
                    </div>

                    <div className="buy-ticket__price-row">
                      <div className="buy-ticket__price">
                        <span className="buy-ticket__currency">&yen;</span>
                        <span>{ticket.price}</span>
                      </div>
                      {ticket.originalPrice ? <span className="buy-ticket__original">原价 {ticket.originalPrice}</span> : null}
                    </div>

                    <div className="buy-ticket__features">
                      {ticket.features.map((feature) => (
                        <div
                          className={feature.included ? 'buy-ticket__feature' : 'buy-ticket__feature buy-ticket__feature--muted'}
                          key={feature.text}
                        >
                          <span className="buy-ticket__feature-icon">
                            <IconCheck included={feature.included} />
                          </span>
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="buy-progress-dots buy-progress-dots--tickets" aria-hidden="true">
              {visibleTickets.map((ticket) => (
                <span
                  className={
                    ticket.id === selectedTicket
                      ? 'buy-progress-dots__dot buy-progress-dots__dot--active'
                      : 'buy-progress-dots__dot'
                  }
                  key={ticket.id}
                />
              ))}
            </div>
          </section>

          {submitMsg ? <div className={`buy-msg buy-msg--${submitMsg.type}`}>{submitMsg.text}</div> : null}

          <button className="buy-submit" onClick={handleSubmit} disabled={paying || identityVerifying} type="button">
            {paying ? '提交中...' : '确定'}
          </button>
        </section>
      </main>
    </div>
  );
}
