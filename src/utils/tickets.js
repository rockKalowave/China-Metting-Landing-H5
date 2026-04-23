export const signupTickets = [
  {
    id: 'early-bird',
    productCode: 'TICKET_EARLY_BIRD',
    title: '早鸟双日票',
    originalPrice: 599,
    price: 0,
    note: '7.31 23:59停止售卖',
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
    title: '智享双日票',
    originalPrice: 599,
    price: 259,
    hidden: true,
    features: [
      { text: '双日畅行全展区与完整议程', included: true },
      { text: '解锁全体验区与品牌展位', included: true },
      { text: '现场打卡集章，兑换限量周边', included: true },
      { text: '展商品牌互动，领取专属福利', included: true },
      { text: '本票种不含"商达撮合区"入场权限', included: false },
    ],
  },
  {
    id: 'vip',
    productCode: 'TICKET_VIP',
    title: '尊享VIP票',
    originalPrice: 1999,
    price: 1299,
    features: [
      { text: '双日尊享，畅行全展区与完整议程', included: true },
      { text: '商达撮合会专属入场资格', included: true },
      { text: '主会场演讲区VIP排落座，位置有限先到先得', included: true },
      { text: '精美周边大礼包+限量周边+专属伴手礼', included: true },
      { text: '大会商务午餐', included: true },
      { text: 'VIP私享社群，持续链接优质资源', included: true },
    ],
  },
  {
    id: 'gala',
    productCode: 'TICKET_GALA',
    title: '星耀晚宴票',
    price: 8999,
    inviteOnly: true,
    note: '晚宴票采用审核制，仅限定向邀请或审核通过宾客购买。如需申请，请扫描下方二维码添加大会组委会提交资料，审核通过后获取购买资格。',
    features: [
      { text: '出席高层闭门晚宴，与全球AI领军人物、头部达人、品牌创始人及行业领袖同席交流', included: true },
      { text: '在私密高端的氛围中，与核心嘉宾面对面沟通，精准拓展高端商业人脉', included: true },
      { text: '完整覆盖VIP票全部权益，全程尊享贵宾礼遇', included: true },
      { text: '专属定制伴手礼与名片夹，细节彰显非凡格调', included: true },
    ],
  },
];

export function getTicketTitleByProductCode(productCode) {
  return signupTickets.find((t) => t.productCode === productCode)?.title;
}
