const publicAsset = (relativePath) => encodeURI(`${import.meta.env.BASE_URL}${relativePath}`);

export const navItems = [
  { id: 'intro', label: '大会介绍' },
  { id: 'content', label: '展会内容' },
  { id: 'highlights', label: '展会亮点' },
  { id: 'industry', label: '行业首创' },
  { id: 'values', label: '核心价值' },
  { id: 'creators', label: '拟邀请达人' },
  { id: 'audience', label: '用户画像' },
  { id: 'contact', label: '联系我们' },
];

export const heroGallery = [
  publicAsset('landing/01首屏/首屏轮播图/1.webp'),
  publicAsset('landing/01首屏/首屏轮播图/2.webp'),
  publicAsset('landing/01首屏/首屏轮播图/3.webp'),
  publicAsset('landing/01首屏/首屏轮播图/4.webp'),
  publicAsset('landing/01首屏/首屏轮播图/5.webp'),
];

export const heroDecor = {
  left: publicAsset('landing/01首屏/视觉元素 左.webp'),
  right: publicAsset('landing/01首屏/视觉元素 右.webp'),
};

export const visualCuts = {
  content: publicAsset('newlanding/展会内容.webp'),
  featureCards: publicAsset('landing-mobile/cuts/Frame 2147206582@2x.png'),
  highlights: publicAsset('newlanding/展会亮点.webp'),
  heroReference: publicAsset('newlanding/首屏底图.webp'),
};

export const logoItems = [
  publicAsset('landing/行业首创/logo - 向左轮播/Group 12.webp'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 13.webp'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 14.webp'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 15.webp'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 16.webp'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 17.webp'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 18.webp'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 19.webp'),
];

export const creatorTrackItems = [
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 12.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 13.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 14.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 15.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 18.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 19.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 20.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 21.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 22.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 23.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 24.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 25.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 26.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 27.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 28.webp'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 29.webp'),
];

export const valueCreatorPages = [
  [{ id: 'invited-creator-page-1', image: publicAsset('newlanding/拟邀请达人/小程序端 达人第一页.webp'), alt: '拟邀请达人第一页' }],
  [{ id: 'invited-creator-page-2', image: publicAsset('newlanding/拟邀请达人/小程序端 达人第二页.png'), alt: '拟邀请达人第二页' }],
  [{ id: 'invited-creator-page-3', image: publicAsset('newlanding/拟邀请达人/小程序端 达人第三页.webp'), alt: '拟邀请达人第三页' }],
];

export const visualSections = {
  intro: publicAsset('newlanding/大会介绍.webp'),
  industry: publicAsset('newlanding/行业首创.webp'),
  values: publicAsset('newlanding/核心价值.webp'),
  invitedCreatorsBackground: publicAsset('newlanding/拟邀请达人/拟邀请达人.webp'),
  brandBackground: publicAsset('newlanding/品牌机构底图.webp'),
  review: publicAsset('newlanding/往期回顾.webp'),
  organizer: publicAsset('newlanding/主办方介绍.webp'),
  expoDesignMain: publicAsset('newlanding/大会设计.webp'),
  expoDesignSecondary: publicAsset('newlanding/大会设计2.webp'),
  audience: publicAsset('newlanding/用户画像.webp'),
  contact: publicAsset('newlanding/联系我们.webp'),
  audienceBackground: publicAsset('newlanding/行业首创2.webp'),
};

export const audienceBackground = visualSections.audienceBackground;
