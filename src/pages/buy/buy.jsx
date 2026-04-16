import { useEffect, useMemo, useState } from 'react';
import { heroDecor } from '../../landingData';
import { getStoredMiniAppUser, resolveMiniAppUser } from '../../utils/miniAppUser';
import { toExternalPath } from '../../utils/routes';
import './buy.css';

const identityOptions = ['Designer', 'Brand', 'Cross-border Seller', 'Service Provider', 'Creator / MCN'];

const signupTickets = [
  {
    id: 'early-bird',
    productCode: 'TICKET_EARLY_BIRD',
    title: 'Early Bird 2-Day Pass',
    originalPrice: 599,
    price: 0,
    note: 'Free before 2026-07-31 23:59',
    features: [
      { text: 'Two-day access to the full expo and main program', included: true },
      { text: 'Access to brand showcases and experience zones', included: true },
      { text: 'On-site check-in gifts and stamp collection', included: true },
      { text: 'Creator and brand interaction areas', included: true },
      { text: 'No entry to the premium business matching area', included: false },
    ],
  },
  {
    id: 'vip',
    productCode: 'TICKET_VIP',
    title: 'VIP Pass',
    originalPrice: 1999,
    price: 1299,
    note: 'Two-day access with VIP privileges',
    features: [
      { text: 'Two-day full expo access', included: true },
      { text: 'Entry to the business matching area', included: true },
      { text: 'VIP seating in the keynote area', included: true },
      { text: 'Premium event gift bag', included: true },
      { text: 'Business lunch included', included: true },
      { text: 'VIP networking group after the event', included: true },
    ],
  },
  {
    id: 'single-day',
    productCode: 'TICKET_GENERAL',
    title: 'Single Day Pass',
    originalPrice: 599,
    price: 259,
    note: 'Choose one day only',
    features: [
      { text: 'Access for one selected day', included: true },
      { text: 'Expo and program access for the selected day', included: true },
      { text: 'Access to showcases and experience zones', included: true },
      { text: 'On-site check-in gifts and stamp collection', included: true },
      { text: 'Creator and brand interaction areas', included: true },
      { text: 'No entry to the premium business matching area', included: false },
    ],
  },
  {
    id: 'gala',
    productCode: 'TICKET_PREMIUM',
    title: 'Gala Pass',
    originalPrice: 9999,
    price: 8999,
    note: 'Limited availability',
    purchasable: false,
    features: [
      { text: 'Includes all VIP benefits', included: true },
      { text: 'Evening gala admission', included: true },
      { text: 'Private guest networking session', included: true },
      { text: 'Reserved dinner seating and gifts', included: true },
      { text: 'Priority post-event networking support', included: true },
      { text: 'Limited seats available', included: true },
    ],
  },
];

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

function IconDoubleChevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="m6 7 6 6 6-6M6 13l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
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

export default function BuyPage({ onNavigateHome }) {
  const visibleTickets = useMemo(() => signupTickets.filter((ticket) => ticket.id !== 'single-day'), []);
  const [miniAppUser, setMiniAppUser] = useState(getStoredMiniAppUser());
  const [selectedTicket, setSelectedTicket] = useState(visibleTickets[0].id);
  const [formData, setFormData] = useState({
    identity: identityOptions[0],
    company: '',
    name: '',
    idNumber: '',
    phone: getStoredMiniAppUser()?.phone || '',
  });
  const [submitMsg, setSubmitMsg] = useState(null);

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

  const handleSubmit = () => {
    const { company, idNumber, identity, name, phone } = formData;

    if (!identity || !company || !name || !idNumber || !phone) {
      setSubmitMsg({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    if (!/^[1-9]\d{16}[\dX]$/.test(idNumber)) {
      setSubmitMsg({ type: 'error', text: 'Please enter a valid 18-digit ID card number.' });
      return;
    }

    if (!/^1\d{10}$/.test(phone)) {
      setSubmitMsg({ type: 'error', text: 'Only +86 mainland China mobile numbers are supported.' });
      return;
    }

    if (!miniAppUser?.phone) {
      setSubmitMsg({ type: 'error', text: 'Please authorize your phone number in the mini program first.' });
      return;
    }

    if (miniAppUser.phone !== phone) {
      setSubmitMsg({ type: 'error', text: 'Phone number must match the mini program identity.' });
      return;
    }

    if (selectedTicketInfo.purchasable === false) {
      setSubmitMsg({ type: 'error', text: 'This ticket type is not available for purchase yet.' });
      return;
    }

    sessionStorage.setItem(
      'kace_order',
      JSON.stringify({
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
      }),
    );

    window.location.href = toExternalPath('/pay');
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

  return (
    <div className="buy-page">
      <section className="buy-hero">
        <img alt="" aria-hidden="true" className="buy-hero__decor buy-hero__decor--left" src={heroDecor.left} />
        <img alt="" aria-hidden="true" className="buy-hero__decor buy-hero__decor--right" src={heroDecor.right} />

        <button aria-label="Back" className="buy-hero__back" onClick={handleBack} type="button">
          <IconBack />
        </button>

        <p className="buy-hero__brand">Kalodata</p>

        <div className="buy-hero__content">
          <div className="buy-hero__title-row">
            <h1 className="buy-hero__title">
              KACE
              <br />
              2026
            </h1>
            <div className="buy-hero__title-side">
              <p>2026 Kalodata AI</p>
              <p>Cross-border</p>
              <p>E-commerce &amp; Influencer</p>
              <p>Expo</p>
            </div>
          </div>

          <p className="buy-hero__headline">
            AI-powered cross-border commerce
            <br />
            and creator collaboration expo
          </p>

          <div className="buy-hero__scroll">
            <IconDoubleChevron />
          </div>

          <p className="buy-hero__meta">2026-08-04 to 2026-08-05 | Shenzhen Futian International Convention Center</p>
        </div>
      </section>

      <main className="buy-main">
        <section className="buy-section">
          <div className="buy-section__heading">
            <h2>Registration</h2>
            <p>Fields marked with * are required</p>
          </div>

          <Field label="Your Role" required>
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

          <Field label="Company / Brand" required>
            <div className="buy-input">
              <span className="buy-input__icon">
                <IconCompany />
              </span>
              <input
                placeholder="Enter company or brand name"
                value={formData.company}
                onChange={updateField('company')}
              />
            </div>
          </Field>

          <Field label="Real Name" required>
            <div className="buy-input">
              <span className="buy-input__icon">
                <IconName />
              </span>
              <input placeholder="Enter your real name" value={formData.name} onChange={updateField('name')} />
            </div>
          </Field>

          <Field label="ID Card Number" required>
            <div className="buy-input">
              <span className="buy-input__icon">
                <IconIdCard />
              </span>
              <input
                inputMode="numeric"
                placeholder="Enter your ID card number"
                value={formData.idNumber}
                onChange={handleIdNumberChange}
              />
            </div>
          </Field>

          <Field label="Mobile Number" required>
            <div className="buy-phone buy-phone--locked">
              <div className="buy-phone__prefix">+86</div>
              <input
                inputMode="numeric"
                maxLength={11}
                placeholder="Complete phone authorization in the mini program"
                value={formData.phone}
                readOnly
              />
            </div>
            <p className="buy-phone__hint">The phone number is provided by the mini program identity and cannot be edited here.</p>
          </Field>

          <div className="buy-progress-dots" aria-hidden="true">
            <span className="buy-progress-dots__dot buy-progress-dots__dot--active" />
            <span className="buy-progress-dots__dot" />
            <span className="buy-progress-dots__dot" />
          </div>

          <section className="buy-section buy-section--tickets">
            <h3>Tickets</h3>

            <div className="buy-ticket-grid">
              {visibleTickets.map((ticket) => {
                const isActive = ticket.id === selectedTicket;
                const isDisabled = ticket.purchasable === false;

                return (
                  <button
                    className={
                      isDisabled
                        ? 'buy-ticket buy-ticket--disabled'
                        : isActive
                          ? 'buy-ticket buy-ticket--active'
                          : 'buy-ticket'
                    }
                    disabled={isDisabled}
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket.id)}
                    type="button"
                  >
                    <div className="buy-ticket__header">
                      <div>
                        <h4>{ticket.title}</h4>
                        <p>{ticket.note}</p>
                      </div>
                      {isDisabled ? (
                        <span className="buy-ticket__status">Unavailable</span>
                      ) : ticket.originalPrice ? (
                        <span className="buy-ticket__original">Original {ticket.originalPrice}</span>
                      ) : null}
                    </div>

                    <div className="buy-ticket__price">
                      <span className="buy-ticket__currency">&yen;</span>
                      <span>{ticket.price}</span>
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
          </section>

          {submitMsg ? <div className={`buy-msg buy-msg--${submitMsg.type}`}>{submitMsg.text}</div> : null}

          <button className="buy-submit" onClick={handleSubmit} type="button">
            Continue
          </button>
        </section>
      </main>
    </div>
  );
}
