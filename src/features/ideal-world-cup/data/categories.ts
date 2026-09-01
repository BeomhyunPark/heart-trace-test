import { assetUrl } from '../../../utils/assetUrl';
import type { WorldCupCategory } from '../domain/types';
import { FREE_PASS_CANDIDATES, LIFE_CHEAT_CANDIDATES } from './concepts';
import { TRAVEL_CANDIDATES } from './travel';

export const WORLD_CUP_CATEGORIES = [
  {
    id: 'meal',
    title: '든든한 한 끼',
    image: assetUrl('images/world-cup/categories/meal.webp'),
    closingMessage: '든든한 한 끼도 좋지만, 마음을 살리는 양식은 하나님의 말씀입니다.',
    candidateIds: [
      'bibimbap', 'bossam', 'budae-jjigae', 'bulgogi-rice',
      'curry', 'dakgalbi', 'galbi', 'gimbap',
      'gyudon', 'hamburger', 'jajangmyeon', 'janchi-guksu',
      'jjamppong', 'kalguksu', 'khao-pad', 'kimchi-fried-rice',
      'kimchi-stew', 'naengmyeon', 'pad-thai', 'paella',
      'pasta', 'pho', 'pizza', 'ramen',
      'ramyeon', 'risotto', 'samgyeopsal', 'shakshuka',
      'spicy-pork', 'steak', 'sushi', 'tonkatsu',
    ],
  },
  {
    id: 'dessert',
    title: '디저트',
    image: assetUrl('images/world-cup/categories/dessert.webp'),
    closingMessage: '디저트보다 더 달콤한 건, 말씀 안에서 발견하는 기쁨입니다.',
    candidateIds: [
      'apple-pie', 'bingsu', 'brownie', 'bungeoppang',
      'cake', 'castella', 'chapssaltteok', 'cheesecake',
      'chocolate', 'churros', 'cinnamon-roll', 'cookies',
      'crepe', 'croissant', 'cupcake', 'doughnut',
      'fruit-tart', 'hotteok', 'ice-cream', 'jelly',
      'macaron', 'madeleine', 'pancakes', 'parfait',
      'pudding', 'scone', 'sorbet', 'souffle',
      'tanghulu', 'tiramisu', 'waffle', 'yakgwa',
    ],
  },
  {
    id: 'late-night',
    title: '야식',
    image: assetUrl('images/world-cup/categories/late-night.webp'),
    closingMessage: '야식 생각이 간절한 밤, 기도할 마음도 한 숟갈 챙겨봐요.',
    candidateIds: [
      'bbq-ribs', 'bossam', 'budae-jjigae', 'burrito',
      'dakgalbi', 'eomuk', 'french-fries', 'galbi',
      'gopchang', 'hamburger', 'jjamppong', 'jokbal',
      'karaage', 'kebab', 'korean-fried-chicken', 'korean-hotdog',
      'malatang', 'okonomiyaki', 'pizza', 'ramen',
      'ramyeon', 'samgyeopsal', 'sandwich', 'spicy-pork',
      'sundae', 'sushi', 'tacos', 'takoyaki',
      'tangsuyuk', 'tteokbokki', 'twigim', 'udon',
    ],
  },
  {
    id: 'travel',
    title: '여행지',
    image: assetUrl('images/world-cup/categories/travel.webp'),
    closingMessage: '가장 좋은 여행은 하나님과 함께 걷는 매일입니다.',
    candidateIds: TRAVEL_CANDIDATES.map((candidate) => candidate.id),
  },
  {
    id: 'free-pass',
    title: '평생 무료 이용권',
    image: assetUrl('images/world-cup/categories/free-pass.webp'),
    closingMessage: '평생 무료 이용권보다 더 큰 선물은 하나님이 값없이 주신 은혜입니다.',
    candidateIds: FREE_PASS_CANDIDATES.map((candidate) => candidate.id),
  },
  {
    id: 'life-cheat',
    title: '인생 치트키',
    image: assetUrl('images/world-cup/categories/life-cheat.webp'),
    closingMessage: '인생 최고의 치트키는 기도입니다.',
    candidateIds: LIFE_CHEAT_CANDIDATES.map((candidate) => candidate.id),
  },
] as const satisfies readonly WorldCupCategory[];

export const WORLD_CUP_CATEGORY_BY_ID = new Map(
  WORLD_CUP_CATEGORIES.map((category) => [category.id, category]),
);
