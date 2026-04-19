import creatorsAudienceSection from './assets/mobile-crops/creators-audience.png';
import heroReferenceImage from './assets/mobile-crops/hero-reference.jpg';
import industrySection from './assets/mobile-crops/industry.png';
import introAboutSection from './assets/mobile-crops/intro-about.png';
import organizerDesignSection from './assets/mobile-crops/organizer-design.png';
import reviewSection from './assets/mobile-crops/review.png';
import valuesSection from './assets/mobile-crops/values.png';
import contactPartnersSection from './assets/mobile-crops/contact-partners.png';
import creatorCard01 from '../h5小程序落地页素材/全部切图/Group 2147206585@2x.png';
import creatorCard02 from '../h5小程序落地页素材/全部切图/Group 2147206586@2x.png';
import creatorCard03 from '../h5小程序落地页素材/全部切图/Group 2147206589@2x.png';
import creatorCard04 from '../h5小程序落地页素材/全部切图/Group 2147206590@2x.png';
import creatorCard05 from '../h5小程序落地页素材/全部切图/Group 2147206593@2x.png';
import creatorCard06 from '../h5小程序落地页素材/全部切图/Group 2147206594@2x.png';
import speakerGuest3 from './assets/speakers/guest-3.png';
import speakerRuben from './assets/speakers/ruben.png';
import speakerGuest2 from './assets/speakers/guest-2.svg';
import speakerGuest4 from './assets/speakers/guest-4.svg';

const publicAsset = (relativePath) => encodeURI(`${import.meta.env.BASE_URL}${relativePath}`);

export const navItems = [
  { id: 'intro', label: '大会介绍' },
  { id: 'content', label: '展会内容' },
  { id: 'highlights', label: '展会亮点' },
  { id: 'industry', label: '行业首创' },
  { id: 'values', label: '核心价值' },
  { id: 'creators', label: '拟邀达人' },
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

const creatorGalleryItems = [
  { id: 'creator-card-1', image: creatorCard01, alt: '达人卡片 1' },
  { id: 'creator-card-2', image: creatorCard02, alt: '达人卡片 2' },
  { id: 'creator-card-3', image: creatorCard03, alt: '达人卡片 3' },
  { id: 'creator-card-4', image: creatorCard04, alt: '达人卡片 4' },
  { id: 'creator-card-5', image: creatorCard05, alt: '达人卡片 5' },
  { id: 'creator-card-6', image: creatorCard06, alt: '达人卡片 6' },
  { id: 'creator-poster-1', image: publicAsset('landing/拟邀请达人/1.png'), alt: '达人海报 1' },
  { id: 'creator-poster-2', image: publicAsset('landing/拟邀请达人/Group 68.png'), alt: '达人海报 2' },
  { id: 'creator-poster-3', image: publicAsset('landing/拟邀请达人/Group 69.png'), alt: '达人海报 3' },
  { id: 'creator-poster-4', image: publicAsset('landing/拟邀请达人/Group 74.png'), alt: '达人海报 4' },
  { id: 'creator-poster-5', image: publicAsset('landing/拟邀请达人/Group 75.png'), alt: '达人海报 5' },
  { id: 'creator-poster-6', image: publicAsset('landing/拟邀请达人/Group 78.png'), alt: '达人海报 6' },
  { id: 'creator-poster-7', image: publicAsset('landing/拟邀请达人/Group 79.png'), alt: '达人海报 7' },
  { id: 'speaker-ruben', image: speakerRuben, alt: '达人头像 1' },
  { id: 'speaker-guest-3', image: speakerGuest3, alt: '达人头像 2' },
  { id: 'speaker-guest-2', image: speakerGuest2, alt: '达人头像 3' },
  { id: 'speaker-guest-4', image: speakerGuest4, alt: '达人头像 4' },
  { id: 'creator-card-7', image: creatorCard01, alt: '达人卡片 7' },
];

export const valueCreatorPages = creatorGalleryItems.reduce((pages, item, index) => {
  const pageIndex = Math.floor(index / 6);
  if (!pages[pageIndex]) {
    pages[pageIndex] = [];
  }

  pages[pageIndex].push(item);
  return pages;
}, []);

const audienceProfileItems = [
  {
    id: 'audience-ai-practitioner',
    title: 'AI 领域从业者',
    description: '致力于大模型、AI 应用的公司，想要了解更多 AI 实践应用和前沿趋势',
  },
  {
    id: 'audience-tiktok-practitioner',
    title: 'TikTok 从业者',
    description: '包括品牌、工厂、经销商、机构及达人，聚焦业绩提升与开拓新增增长机会',
  },
  {
    id: 'audience-crossborder-seller',
    title: '跨境电商卖家',
    description: '正在做亚马逊、TikTok Shop、Shopee、独立站的卖家，想找 AI 工具降本增效，想链接海外达人与品牌资源',
  },
  {
    id: 'audience-new-seller',
    title: '新入局卖家',
    description: '正在做亚马逊、TikTok Shop、Shopee、独立站的卖家，想找 AI 工具降本增效，想链接海外达人与品牌资源',
  },
  {
    id: 'audience-industry-practitioner',
    title: '行业从业者',
    description: '运营、投放、内容、选品、数据分析等岗位，想提升专业技能，想了解 AI 工具如何辅助日常工作',
  },
  {
    id: 'audience-ai-explorer',
    title: 'AI 知识探索者',
    description: '想学习了解 AI 技术和落地实践的人，奠定基础，提升个人职业竞争力',
  },
];

export const audienceProfilePages = Array.from({ length: 3 }, (_, pageIndex) =>
  audienceProfileItems.map((item, itemIndex) => ({
    ...item,
    id: `${item.id}-page-${pageIndex + 1}`,
    layout: itemIndex % 2 === 0 ? 'left' : 'right',
  })),
);

export const visualSections = {
  intro: introAboutSection,
  industry: industrySection,
  values: valuesSection,
  creatorsAudience: creatorsAudienceSection,
  review: reviewSection,
  organizerDesign: organizerDesignSection,
  contactPartners: contactPartnersSection,
};
