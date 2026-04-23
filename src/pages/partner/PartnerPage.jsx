import { useState } from 'react';
import { getApiUrl } from '../../utils/api';
import { toExternalPath } from '../../utils/routes';
import './partner.css';

const titleOptions = ['市场/商务负责人', '业务负责人', 'CEO', '其他'];
const partnerTypeOptions = ['工具方', '品牌方', '服务机构', '供应链/工厂'];

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

function IconPerson() {
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

function IconPhone() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RadioGroup({ options, value, onChange, singleCol = false }) {
  return (
    <div className={`partner-radio-group${singleCol ? ' partner-radio-group--single-col' : ''}`}>
      {options.map((option) => (
        <button
          className={`partner-radio${value === option ? ' partner-radio--selected' : ''}`}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          <span className="partner-radio__dot">
            <span className="partner-radio__dot-inner" />
          </span>
          <span>{option}</span>
        </button>
      ))}
    </div>
  );
}

export default function PartnerPage({ onNavigateHome }) {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    contact: '',
    title: '',
    customTitle: '',
    partnerType: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setSubmitMsg(null);
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

  const handleSubmit = async () => {
    const { companyName, name, contact, title, partnerType } = formData;

    if (!companyName.trim()) {
      setSubmitMsg({ type: 'error', text: '请填写公司名称' });
      return;
    }
    if (!name.trim() || !/^[\u4e00-\u9fa5]{2,15}$/.test(name.trim())) {
      setSubmitMsg({ type: 'error', text: '姓名必须为2到15个汉字' });
      return;
    }
    if (!/^\d{11}$/.test(contact.trim())) {
      setSubmitMsg({ type: 'error', text: '手机号必须为11位数字' });
      return;
    }
    if (!title) {
      setSubmitMsg({ type: 'error', text: '请选择您的Title' });
      return;
    }
    if (title === '其他' && !formData.customTitle.trim()) {
      setSubmitMsg({ type: 'error', text: '请填写您的Title' });
      return;
    }
    if (!partnerType) {
      setSubmitMsg({ type: 'error', text: '请选择合作方类型' });
      return;
    }

    setSubmitting(true);
    setSubmitMsg(null);

    try {
      const response = await fetch(getApiUrl('/partner-applications'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName.trim(),
          name: name.trim(),
          contact: contact.trim(),
          title: title === '其他' ? formData.customTitle.trim() : title,
          partner_type: partnerType,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.code !== 0) {
        setSubmitMsg({ type: 'error', text: result.message || '提交失败，请稍后重试' });
        return;
      }

      setSubmitMsg({ type: 'success', text: '提交成功，感谢您的合作意向！' });
      setFormData({ companyName: '', name: '', contact: '', title: '', customTitle: '', partnerType: '' });
      setAgreed(false);
    } catch {
      setSubmitMsg({ type: 'error', text: '网络异常，请稍后重试' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="partner-page">
      <div className="partner-header">
        <button aria-label="返回" className="partner-header__back" onClick={handleBack} type="button">
          <IconBack />
        </button>
        <h1 className="partner-header__title">Kalodata 招商合作</h1>
      </div>

      <main className="partner-main">
        <div className="partner-question">
          <label className="partner-question__label partner-question__label--required">1. 公司名称</label>
          <div className="partner-input">
            <span className="partner-input__icon">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <input
              placeholder="请输入公司名称"
              value={formData.companyName}
              onChange={updateField('companyName')}
            />
          </div>
        </div>

        <div className="partner-question">
          <label className="partner-question__label partner-question__label--required">2. 您的姓名：</label>
          <div className="partner-input">
            <span className="partner-input__icon">
              <IconPerson />
            </span>
            <input
              placeholder="请输入姓名"
              value={formData.name}
              onChange={updateField('name')}
            />
          </div>
        </div>

        <div className="partner-question">
          <label className="partner-question__label partner-question__label--required">3. 手机号：</label>
          <div className="partner-input">
            <span className="partner-input__icon">
              <IconPhone />
            </span>
            <input
              placeholder="请输入11位手机号"
              value={formData.contact}
              onChange={updateField('contact')}
              maxLength={11}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="partner-question">
          <label className="partner-question__label partner-question__label--required">4. 您的Title：</label>
          <RadioGroup
            options={titleOptions}
            value={formData.title}
            onChange={(val) => { setFormData((prev) => ({ ...prev, title: val, customTitle: val === '其他' ? prev.customTitle : '' })); setSubmitMsg(null); }}
          />
          {formData.title === '其他' && (
            <div className="partner-input" style={{ marginTop: 8 }}>
              <input
                placeholder="请输入您的Title"
                value={formData.customTitle}
                onChange={updateField('customTitle')}
              />
            </div>
          )}
        </div>

        <div className="partner-question">
          <label className="partner-question__label partner-question__label--required">5. 合作方类型</label>
          <RadioGroup
            options={partnerTypeOptions}
            singleCol
            value={formData.partnerType}
            onChange={(val) => { setFormData((prev) => ({ ...prev, partnerType: val })); setSubmitMsg(null); }}
          />
        </div>

 
        {submitMsg && <div className={`partner-msg partner-msg--${submitMsg.type}`}>{submitMsg.text}</div>}

        <button className="partner-submit" disabled={submitting} onClick={handleSubmit} type="button">
          {submitting ? '提交中...' : '提交'}
        </button>
      </main>
    </div>
  );
}
