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
  publicAsset('landing/01首屏/首屏轮播图/1.png'),
  publicAsset('landing/01首屏/首屏轮播图/2.png'),
  publicAsset('landing/01首屏/首屏轮播图/3.png'),
  publicAsset('landing/01首屏/首屏轮播图/4.png'),
  publicAsset('landing/01首屏/首屏轮播图/5.png'),
];

export const heroDecor = {
  left: publicAsset('landing/01首屏/视觉元素 左.png'),
  right: publicAsset('landing/01首屏/视觉元素 右.png'),
};

export const visualCuts = {
  content: publicAsset('newlanding/展会内容.jpg'),
  featureCards: publicAsset('landing-mobile/cuts/Frame 2147206582@2x.png'),
  highlights: publicAsset('newlanding/展会亮点.jpg'),
  heroReference: publicAsset('newlanding/首屏底图.jpg'),
};

export const logoItems = [
  publicAsset('landing/行业首创/logo - 向左轮播/Group 12.png'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 13.png'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 14.png'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 15.png'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 16.png'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 17.png'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 18.png'),
  publicAsset('landing/行业首创/logo - 向左轮播/Group 19.png'),
];

export const creatorTrackItems = [
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 12.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 13.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 14.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 15.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 18.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 19.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 20.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 21.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 22.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 23.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 24.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 25.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 26.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 27.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 28.png'),
  publicAsset('landing/行业首创/达人 - 向右轮播/Group 29.png'),
];

export const valueCreatorPages = [
  [{ id: 'invited-creator-page-1', image: publicAsset('newlanding/拟邀请达人/小程序端 达人第一页.png'), alt: '拟邀请达人第一页' }],
  [{ id: 'invited-creator-page-2', image: publicAsset('newlanding/拟邀请达人/小程序端 达人第二页.png'), alt: '拟邀请达人第二页' }],
  [{ id: 'invited-creator-page-3', image: publicAsset('newlanding/拟邀请达人/小程序端 达人第三页.png'), alt: '拟邀请达人第三页' }],
];

export const visualSections = {
  intro: publicAsset('newlanding/大会介绍.jpg'),
  industry: publicAsset('newlanding/行业首创.jpg'),
  values: publicAsset('newlanding/核心价值.jpg'),
  invitedCreatorsBackground: publicAsset('newlanding/拟邀请达人/拟邀请达人.jpg'),
  brandBackground: publicAsset('newlanding/品牌机构底图.jpg'),
  brandAndCreators: publicAsset('newlanding/品牌 & 机构与达人.jpg'),
  review: publicAsset('newlanding/往期回顾.jpg'),
  organizer: publicAsset('newlanding/主办方介绍.jpg'),
  expoDesignMain: publicAsset('newlanding/大会设计.jpg'),
  expoDesignSecondary: publicAsset('newlanding/大会设计2.jpg'),
  audience: publicAsset('newlanding/用户画像.jpg'),
  contact: publicAsset('newlanding/联系我们.jpg'),
};
