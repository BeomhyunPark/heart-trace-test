import type { WorldCupCategory } from '../domain/types';
import { TRAVEL_CANDIDATES } from './travel';

export const WORLD_CUP_CATEGORIES = [
  {
    id: 'meal',
    title: '든든한 한 끼',
    image: '/images/world-cup/categories/meal.webp',
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
    image: '/images/world-cup/categories/dessert.webp',
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
    image: '/images/world-cup/categories/late-night.webp',
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
    image: '/images/world-cup/categories/travel.webp',
    candidateIds: TRAVEL_CANDIDATES.map((candidate) => candidate.id),
  },
] as const satisfies readonly WorldCupCategory[];

export const WORLD_CUP_CATEGORY_BY_ID = new Map(
  WORLD_CUP_CATEGORIES.map((category) => [category.id, category]),
);
