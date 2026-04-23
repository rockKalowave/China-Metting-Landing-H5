export const signupTickets = [
  {
    id: 'early-bird',
    productCode: 'TICKET_EARLY_BIRD',
    title: '早鸟双日票',
    originalPrice: 599,
    price: 0,
    note: '7月31日 23:59 截止',
    features: [
      { text: '双日畅行全展区与完整议程', included: true },
      { text: '解锁全体验区与品牌展位', included: true },
      { text: '现场打卡集章，兑换限量周边', included: true },
      { text: '展商品牌互动，领取专属福利', included: true },
      { text: '本票种不含"商达撮合区"入场权限', included: false },
    ],
  },
  {
    id: 'single-day',
    productCode: 'TICKET_GENERAL',
    title: '智享单日票',
    originalPrice: 599,
    price: 259,
    note: '8月4日、8月5日（可任选一天）',
    features: [
      { text: '择日出席，智享全程', included: true },
      { text: '单日畅行全展区与完整议程', included: true },
      { text: '解锁全体验区与品牌展位', included: true },
      { text: '现场打卡集章，兑换限量周边', included: true },
      { text: '展商品牌互动，领取专属福利', included: true },
      { text: '本票种不含"商达撮合区"入场权限', included: false },
    ],
  },
  {
    id: 'vip',
    productCode: 'TICKET_VIP',
    title: 'VIP 通票',
    originalPrice: 1999,
    price: 1299,
    note: '双日通行，含商达撮合区权益',
    features: [
      { text: '双日畅行全展区与完整议程', included: true },
      { text: '含"商达撮合区"入场与对接权益', included: true },
      { text: '重点论坛优先席位', included: true },
      { text: 'VIP 礼包与优先服务', included: true },
      { text: '展商品牌互动，领取专属福利', included: true },
      { text: '高价值商机撮合与资源链接', included: true },
    ],
  },
];

export function getTicketTitleByProductCode(productCode) {
  return signupTickets.find((t) => t.productCode === productCode)?.title;
}
