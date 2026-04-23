import { useEffect, useMemo, useState } from 'react';
import {
  fetchTicketWallet,
  getStoredTicketWallet,
  resolveTicketLookupIdentity,
} from '../../utils/miniAppUser';
import { toExternalPath } from '../../utils/routes';
import { getTicketTitleByProductCode } from '../../utils/tickets';
import './ticket.css';

function PolicyModal({ visible, onClose }) {
  if (!visible) return null;

  return (
    <div className="policy-modal-mask" onClick={onClose}>
      <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
        <button className="policy-modal__close" onClick={onClose} type="button">×</button>
        <div className="policy-modal__content">
          <h2 className="policy-modal__title">大会票务售后及退票政策</h2>

          <p>感谢您关注并参与本次大会。为保障大会筹备工作的顺利进行，同时确保所有参会者的权益，请您在购票前仔细阅读以下政策。一旦购票成功，即视为您已理解并同意本政策全部条款。</p>

          <h3>4.1 总则</h3>
          <ol>
            <li><strong>本次大会所有票种（包括早鸟票、普通票、VIP票）均与购票时提交的身份证号实名绑定，一经绑定不可修改、不可转让。</strong></li>
            <li><strong>所有票种一经售出，概不退票。</strong>请您在购票前确认行程安排。</li>
            <li><strong>如有任何疑问，请在购票前联系客服咨询。</strong>购票后因个人原因（包括但不限于行程冲突、临时有事、身体不适等）无法参会，恕不处理退票。</li>
            <li>因不可抗力（疫情/公共卫生事件/极端天气（台风、暴雨等）/政府政策/场馆突发情况）导致大会延期或取消，全额退票。</li>
          </ol>

          <h3>4.2 外国人购票特别说明</h3>
          <table>
            <tbody>
              <tr><td>购票方式</td><td>外国人购票不支持在线自助购票，请直接联系客服办理。</td></tr>
              <tr><td>所需信息</td><td>购票时需提供：护照姓名（英文）、护照号码、国籍、手机号、邮箱。</td></tr>
              <tr><td>核验方式</td><td>现场入场时需出示护照原件+电子票，核验一致方可入场。</td></tr>
              <tr><td>政策适用</td><td>外国人购票同样适用本政策的退票、发票等条款。</td></tr>
            </tbody>
          </table>

          <h3>4.3 早鸟票 & 普通票政策</h3>
          <table>
            <tbody>
              <tr><td>适用人群</td><td>持有中国大陆居民身份证的参会者。外国人请见第二条。</td></tr>
              <tr><td>退票规则</td><td>一经售出，概不退票。早鸟票为免费票，普通票为付费票，均不设退票通道。</td></tr>
              <tr><td>身份绑定</td><td>购票时已完成身份证实名验证，门票与身份证号永久绑定，不可修改、不可转让。入场时需出示本人身份证及电子票，核验一致方可入场。</td></tr>
              <tr><td>发票开具</td><td>普通票可申请电子发票，详见第4.6条。早鸟票为免费票，不提供发票。</td></tr>
            </tbody>
          </table>

          <h3>4.4 VIP票政策</h3>
          <table>
            <tbody>
              <tr><td>适用人群</td><td>持有中国大陆居民身份证的参会者。外国人请见第4.2条。</td></tr>
              <tr><td>退票规则</td><td>一经售出，概不退票。VIP票包含专属权益和资源，恕不设退票通道。</td></tr>
              <tr><td>转为赞助资源</td><td>如因企业方原因无法参会，可在大会前7天协商将票面价值转为同等价值的资源赞助（如品牌露出、展位置换、资料入袋等）。具体需联系商务同学（企业微信：15813215119）协商确认。</td></tr>
              <tr><td>身份绑定</td><td>购票时已完成身份证实名验证，门票与身份证号绑定。</td></tr>
              <tr><td>发票开具</td><td>VIP票可申请电子发票，详见第4.6条。</td></tr>
            </tbody>
          </table>

          <h3>4.5 现场服务政策</h3>
          <table>
            <tbody>
              <tr><td>现场票务服务台</td><td>大会现场设有专门的票务服务台，处理以下问题：<br/>· 扫码失败、无法入场<br/>· 其他票务相关问题</td></tr>
              <tr><td>紧急入场处理</td><td>如用户手机没电、丢失或无法出示二维码，可凭本人身份证/护照到服务台核验身份。核验通过后，将补发纸质入场凭证，凭此入场。</td></tr>
              <tr><td>VIP权益保障</td><td>VIP用户如未收到伴手礼或权益未兑现，可到服务台联系专人处理。</td></tr>
            </tbody>
          </table>

          <h3>4.6 发票开具政策</h3>
          <table>
            <thead>
              <tr><th>票种</th><th>是否可开票</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr><td>早鸟票（免费）</td><td>不可开票</td><td>免费票不提供发票</td></tr>
              <tr><td>普通票（付费）</td><td>可开票</td><td>购票后可联系客服申请发票，填写抬头和邮箱，7个工作日内发送</td></tr>
              <tr><td>VIP票（付费）</td><td>可开票</td><td>同上</td></tr>
              <tr><td>外国人购票</td><td>可开票</td><td>通过客服购票后，可联系客服申请发票</td></tr>
            </tbody>
          </table>

          <h3>4.7 客服联系方式</h3>
          <p>如您对以上政策有任何疑问，请在购票前联系客服咨询。</p>
          <table>
            <tbody>
              <tr><td>在线客服</td><td>小程序内点击"联系客服"</td></tr>
              <tr><td>企业微信（中文）</td><td>扫描下方二维码添加客服（工作日 9:00-18:00）</td></tr>
              <tr><td>外国人购票专线</td><td>邮箱：sherry.chen@kalowave.com / erica.feng@kalowave.com（请提供护照姓名+护照号码+购票需求，我们将在24小时内回复）</td></tr>
              <tr><td>商务合作</td><td>如需VIP转为赞助资源，请联系商务同学（企业微信：vivi）</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
  const [policyVisible, setPolicyVisible] = useState(false);

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

  const ticketTypeLabel = useMemo(() => {
    const ticket_type = ticketWallet?.ticket_type
    return getTicketTitleByProductCode(ticket_type)
  }, [ticketWallet]);

  const ticketQrUrl = useMemo(
    () => ticketWallet?.qr_code_url || ticketWallet?.qrCodeUrl || ticketWallet?.qr_code || '',
    [ticketWallet],
  );

  console.log(ticketTypeLabel,'ticketTypeLabel')
  if (loading) {
    return <TicketStatus message="正在加载票夹信息..." onAction={handleBackHome} />;
  }

  if (!ticketWallet || error) {
    return <TicketStatus message={error || '未找到票夹信息'} onAction={handleBackHome} />;
  }

  return (
    <div className="ticket-page">
      <main className="ticket-main">
        <section className="ticket-wallet-card" aria-label="我的票夹" style={{
          position: 'relative',
        }}>
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
          <div className='policy' onClick={() => setPolicyVisible(true)}></div>
        </section>
      </main>
      <PolicyModal visible={policyVisible} onClose={() => setPolicyVisible(false)} />
    </div>
  );
}
