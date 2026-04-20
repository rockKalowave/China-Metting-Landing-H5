import heroReferenceImage from './assets/mobile-crops/hero-reference.jpg';
import industrySection from './assets/mobile-crops/industry.png';
import introAboutSection from './assets/mobile-crops/intro-about.png';
import valuesSection from './assets/mobile-crops/values.png';

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
  agenda: publicAsset('landing-mobile/cuts/Frame 2147206549@2x.png'),
  content: publicAsset('landing/移动端/展会内容.jpg'),
  featureCards: publicAsset('landing-mobile/cuts/Frame 2147206582@2x.png'),
  highlights: publicAsset('landing/展会亮点/展会亮点.jpg'),
  heroReference: heroReferenceImage,
  markets: publicAsset('landing-mobile/cuts/Group 2147206523@2x.png'),
};

export const agendaTopicImages = {
  main: publicAsset('landing/展会内容/主会场议题.svg'),
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
  Array.from({ length: 6 }, (_, index) => ({
    id: `invited-creator-page-1-${index + 1}`,
    image: publicAsset(`landing/拟邀请达人/第一页达人/${index + 1}.png`),
    alt: `拟邀请达人第一页第 ${index + 1} 张`,
  })),
  Array.from({ length: 6 }, (_, index) => ({
    id: `invited-creator-page-2-${index + 1}`,
    image: publicAsset(`landing/拟邀请达人/第二页达人/${index + 7}.png`),
    alt: `拟邀请达人第二页第 ${index + 1} 张`,
  })),
  Array.from({ length: 4 }, (_, index) => ({
    id: `invited-creator-page-3-${index + 1}`,
    image: publicAsset(`landing/拟邀请达人/第三页达人/${index + 13}.png`),
    alt: `拟邀请达人第三页第 ${index + 1} 张`,
  })),
];

export const visualSections = {
  intro: introAboutSection,
  industry: industrySection,
  values: valuesSection,
  invitedCreatorsBackground: publicAsset('landing/拟邀请达人/拟邀请达人 - 底图.jpg'),
  review: publicAsset('landing/往期回顾 - 整图.jpg'),
  organizer: publicAsset('landing/主办方介绍.jpg'),
  expoDesignMain: publicAsset('landing/大会设计/大会设计.jpg'),
  expoDesignSecondary: publicAsset('landing/大会设计/大会设计2.jpg'),
  audience: publicAsset('landing/用户画像.jpg'),
  contact: publicAsset('landing/联系我们 - 整图.jpg'),
};
