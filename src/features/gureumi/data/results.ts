import type { GureumiResultType } from '../domain/types';

export type GureumiResultDefinition = {
  id: GureumiResultType;
  characterKey: string;
  name: string;
  englishType: string;
  descriptor: string;
  quote: string;
  summary: string;
  coreDesire: string;
  strengthLead: string;
  strengthBody: string;
  strengths: string[];
  caution: string;
  balanceTip: string;
  differences: Array<{ name: string; body: string }>;
  synergies: Array<{ label: string; pair: string; body: string }>;
  closing: string;
  theme: {
    heroStart: string;
    heroEnd: string;
    accent: string;
    accentSoft: string;
    closingStart: string;
    closingEnd: string;
  };
};

export const GUREUMI_RESULTS: Record<GureumiResultType, GureumiResultDefinition> = {
  ARONG: {
    id: 'ARONG',
    characterKey: 'arong',
    name: '아롱이',
    englishType: 'PASSIONATE',
    descriptor: '사람과 새로움에 즐겁게 뛰어드는 열정가',
    quote: '재미있겠다! 우리 같이 해보자.',
    summary: '새로운 경험을 향해 빠르게 움직이고, 사람과 감정을 나눌 때 에너지가 커진다. 새로운 사람과 경험을 좋아하며 낯선 상황에도 비교적 편안하게 뛰어든다. 좋은 경험을 혼자 간직하기보다 함께 나누고 싶어 하고, 그 과정에서 주변 분위기까지 밝게 만든다.',
    coreDesire: '새로운 경험을 사람들과 함께 나누고 싶다.',
    strengthLead: '사람 사이에 첫 장면을 만드는 힘',
    strengthBody: '친화력과 낙관성으로 관계를 시작하고 분위기에 생기를 더함',
    strengths: ['친화력', '열정', '낙관성', '관계 시작', '분위기 점화'],
    caution: '흥미와 관계를 따라가다 너무 많은 일을 벌일 수 있다. 좋아 보이는 제안에 빠르게 마음이 움직이면 이미 시작한 일에 쓸 에너지가 흩어질 수 있다.',
    balanceTip: '새로운 약속을 잡기 전에 지금 지키고 싶은 한 가지를 먼저 떠올려본다.',
    differences: [
      { name: '촉촉이', body: '둘 다 사람과 새로움을 좋아하지만, 촉촉이는 불확실성을 더 크게 걱정한다. 아롱이는 낯선 상황에도 비교적 편안하게 뛰어든다.' },
      { name: '쨍이', body: '둘 다 새로움을 좋아하지만, 쨍이는 혼자 밀고 나가는 힘이 더 크다. 아롱이는 사람들과 함께할 때 에너지가 커진다.' },
      { name: '포근이', body: '둘 다 관계를 중요하게 여기지만, 포근이는 익숙함과 안정을 먼저 살핀다. 아롱이는 변화와 새로운 사람에게 먼저 다가간다.' },
    ],
    synergies: [
      { label: '시작과 실행', pair: '아롱이 × 쨍이', body: '아롱이가 사람을 모으고 분위기를 열면 쨍이가 망설이지 않고 일을 움직인다.' },
      { label: '확장과 정리', pair: '아롱이 × 달몽이', body: '아롱이가 새로운 관계와 경험을 열면 달몽이가 속도와 의미를 차분히 정돈한다.' },
    ],
    closing: '당신의 열정은 사람들 사이에 첫 장면을 만든다.',
    theme: { heroStart: '#ddf8ff', heroEnd: '#ffe7f3', accent: '#52cfe0', accentSoft: '#edfafd', closingStart: '#3a466b', closingEnd: '#6a4f78' },
  },
  DALMONG: {
    id: 'DALMONG',
    characterKey: 'dalmong',
    name: '달몽이',
    englishType: 'COMPOSED',
    descriptor: '자기 속도로 깊이 바라보는 차분한 관찰자',
    quote: '천천히 봐도 괜찮아. 내 방식대로 생각해볼게.',
    summary: '새로움에 쉽게 휩쓸리지 않고 주변 반응보다 자기 기준과 속도를 지킨다. 익숙한 리듬을 좋아하며 예상 밖의 상황에서도 서둘러 반응하기보다 충분히 바라본다. 혼자 생각하고 몰입하는 시간에서 편안함을 느낀다.',
    coreDesire: '내 속도와 기준을 잃지 않고 싶다.',
    strengthLead: '흔들리지 않고 본질을 바라보는 힘',
    strengthBody: '침착한 관찰과 독립적인 판단으로 복잡한 순간에도 중심을 지킴',
    strengths: ['침착함', '독립', '관찰력', '자기 기준', '깊은 몰입력'],
    caution: '혼자 괜찮다고 생각하다 필요한 신호를 놓칠 수 있다. 마음과 필요를 안으로만 정리하면 가까운 사람도 달몽이의 상태를 알아차리기 어렵다.',
    balanceTip: '도움이 필요하거나 마음이 움직였을 때 결론보다 지금 상태를 한 문장으로 알려준다.',
    differences: [
      { name: '후우', body: '둘 다 자기 기준이 분명하고 익숙한 방식을 선호하지만, 후우는 위험을 더 꼼꼼히 확인한다. 달몽이는 불확실성에도 비교적 담담하다.' },
      { name: '쨍이', body: '둘 다 타인의 반응에 크게 흔들리지 않지만, 쨍이는 새로움을 만나면 바로 움직인다. 달몽이는 충분히 바라본 뒤 선택한다.' },
      { name: '몽실이', body: '둘 다 차분하고 낯선 상황을 크게 두려워하지 않지만, 몽실이는 사람과 감정을 나눌 때 힘을 얻는다. 달몽이는 혼자서도 편안하다.' },
    ],
    synergies: [
      { label: '깊이와 온기', pair: '달몽이 × 몽실이', body: '달몽이가 차분한 관점을 더하면 몽실이가 그 생각을 사람들 사이에 따뜻하게 이어준다.' },
      { label: '정리와 확장', pair: '달몽이 × 아롱이', body: '달몽이가 속도와 의미를 정돈하면 아롱이가 새로운 관계와 경험으로 넓혀간다.' },
    ],
    closing: '당신의 차분함은 복잡한 순간에도 중심을 지켜준다.',
    theme: { heroStart: '#e6f5ff', heroEnd: '#eee5ff', accent: '#7b6bbb', accentSoft: '#f1edff', closingStart: '#35426d', closingEnd: '#5a4373' },
  },
  HOOWOO: {
    id: 'HOOWOO',
    characterKey: 'hoowoo',
    name: '후우',
    englishType: 'CAUTIOUS',
    descriptor: '충분히 살피고 움직이는 신중한 설계자',
    quote: '잠깐만, 먼저 확인해보고 움직이자.',
    summary: '익숙한 방식에서 안정감을 찾고 불확실한 지점을 충분히 확인한 뒤 움직인다. 갑작스러운 변화에 바로 뛰어들기보다 필요한 정보와 가능한 위험을 살핀다. 주변 분위기에 휩쓸리기보다 자기 기준으로 판단하며 미리 준비했을 때 마음이 놓인다.',
    coreDesire: '안전하게 준비한 뒤 확실히 움직이고 싶다.',
    strengthLead: '놓치기 쉬운 위험을 먼저 발견하는 힘',
    strengthBody: '신중한 분석과 독립적인 판단으로 계획의 빈틈을 단단하게 채움',
    strengths: ['신중함', '분석', '대비력', '위험 감지', '독립적 판단'],
    caution: '충분히 준비하려다 시작할 타이밍을 놓칠 수 있다. 모든 변수를 확인하려고 하면 준비는 탄탄해져도 실제로 해보며 얻을 수 있는 정보가 늦어진다.',
    balanceTip: '완벽히 준비될 때까지 기다리기보다 되돌릴 수 있는 작은 범위부터 시험한다.',
    differences: [
      { name: '포근이', body: '둘 다 익숙함과 안전을 중요하게 여기지만, 포근이는 관계의 분위기까지 세심하게 살핀다. 후우는 사람보다 정보와 기준을 먼저 확인한다.' },
      { name: '찌릿이', body: '둘 다 위험을 빠르게 감지하고 스스로 판단하지만, 찌릿이는 변화의 자극에도 민첩하게 반응한다. 후우는 검증된 방식에서 안정감을 찾는다.' },
      { name: '달몽이', body: '둘 다 자기 기준이 분명하고 익숙한 방식을 선호하지만, 후우는 불확실성을 더 꼼꼼히 걱정한다. 달몽이는 예상 밖의 상황에도 비교적 담담하다.' },
    ],
    synergies: [
      { label: '아이디어와 검증', pair: '후우 × 아롱이', body: '아롱이가 가능성을 넓히면 후우가 위험과 순서를 확인해 실행 가능한 계획으로 다듬는다.' },
      { label: '계획과 배려', pair: '후우 × 몽실이', body: '후우가 구조와 기준을 세우면 몽실이가 사람들이 편안히 따라올 수 있게 연결한다.' },
    ],
    closing: '당신의 신중함은 사람들이 안심하고 움직일 길을 만든다.',
    theme: { heroStart: '#e8faf5', heroEnd: '#f3f0e7', accent: '#55b895', accentSoft: '#ecf8f3', closingStart: '#315d52', closingEnd: '#426b5d' },
  },
  SUNNY: {
    id: 'SUNNY',
    characterKey: 'sunny',
    name: '쨍이',
    englishType: 'ADVENTUROUS',
    descriptor: '새로운 길을 거침없이 여는 독립적인 개척자',
    quote: '좋아, 일단 해보자. 길은 가면서 찾으면 돼.',
    summary: '새로운 가능성을 발견하면 빠르게 움직이고 다른 사람의 반응보다 직접 해보며 판단한다. 익숙한 답보다 아직 가보지 않은 길에 더 끌리며, 불확실한 상황도 직접 부딪쳐 알아간다. 주변의 동의를 오래 기다리기보다 자기 판단으로 시작한다.',
    coreDesire: '내가 발견한 가능성을 직접 시험해보고 싶다.',
    strengthLead: '망설임 없이 첫발을 내딛는 힘',
    strengthBody: '도전성과 독립적인 추진력으로 아직 없던 길의 시작점을 만듦',
    strengths: ['도전성', '추진', '독립성', '빠른 실행', '길을 개척함'],
    caution: '속도와 확신이 앞서면 사람들의 리듬을 놓칠 수 있다. 혼자서도 잘 움직이는 만큼 함께하는 사람의 걱정이나 준비 속도를 확인하지 못할 수 있다.',
    balanceTip: '함께하는 사람이 있다면 결정하기 전에 속도와 걱정되는 점을 한 번 묻는다.',
    differences: [
      { name: '아롱이', body: '둘 다 새로움을 좋아하고 걱정에 오래 머물지 않지만, 아롱이는 사람들과 함께할 때 에너지가 커진다. 쨍이는 혼자서도 바로 길을 연다.' },
      { name: '찌릿이', body: '둘 다 새로움과 독립적인 실행을 좋아하지만, 찌릿이는 위험 신호를 더 크게 감지한다. 쨍이는 가능성을 먼저 보고 바로 움직인다.' },
      { name: '달몽이', body: '둘 다 자기 판단대로 움직이고 걱정에 오래 머물지 않지만, 달몽이는 익숙한 리듬을 선호한다. 쨍이는 변화 자체에서 에너지를 얻는다.' },
    ],
    synergies: [
      { label: '시작과 확산', pair: '쨍이 × 아롱이', body: '쨍이가 망설이지 않고 첫발을 떼면 아롱이가 사람을 모아 경험을 더 크게 확장한다.' },
      { label: '도전과 검증', pair: '쨍이 × 후우', body: '쨍이가 가능성을 빠르게 시험하면 후우가 위험과 순서를 점검해 지속 가능한 실행으로 만든다.' },
    ],
    closing: '당신의 용기는 아직 없던 길에 첫 발자국을 남긴다.',
    theme: { heroStart: '#fff7da', heroEnd: '#ffebdf', accent: '#e9a72f', accentSoft: '#fff5de', closingStart: '#634327', closingEnd: '#825b33' },
  },
  CHOKCHOK: {
    id: 'CHOKCHOK',
    characterKey: 'chokchok',
    name: '촉촉이',
    englishType: 'SENSITIVE',
    descriptor: '설렘과 걱정을 함께 품는 섬세한 공감 탐험가',
    quote: '해보고 싶어! 우리 같이 천천히 가볼래?',
    summary: '새로운 경험에 마음이 끌리면서도 사람과 안전을 확인할 때 편안해진다. 낯선 상황의 위험과 주변 사람의 반응을 동시에 세심하게 느낀다. 혼자 결정하기보다 믿을 수 있는 사람과 마음을 나눌 때 안심하고 그 안에서 용기를 얻는다.',
    coreDesire: '안심할 수 있는 사람들과 새로운 경험을 나누고 싶다.',
    strengthLead: '변화 속에서도 사람의 마음을 살피는 힘',
    strengthBody: '호기심과 공감력을 함께 사용해 새로운 순간의 감정까지 놓치지 않음',
    strengths: ['감수성', '공감', '호기심', '함께 탐색', '분위기 감지'],
    caution: '설렘과 걱정이 함께 커져 마음이 쉽게 지칠 수 있다. 해보고 싶은 마음과 잘해야 한다는 걱정이 동시에 커지면 결정 전부터 감정 에너지를 많이 쓴다.',
    balanceTip: '떠오르는 걱정을 실제로 확인된 것과 아직 모르는 것으로 나누어 적는다.',
    differences: [
      { name: '아롱이', body: '둘 다 새로움과 사람을 좋아하지만, 촉촉이는 불확실성을 더 크게 걱정한다. 아롱이는 낯선 상황에도 비교적 편안하게 뛰어든다.' },
      { name: '포근이', body: '둘 다 관계와 안전을 중요하게 여기지만, 포근이는 익숙한 관계를 지키는 데 마음이 간다. 촉촉이는 새로운 경험에도 강하게 끌린다.' },
      { name: '찌릿이', body: '둘 다 새로움과 위험을 동시에 크게 느끼지만, 찌릿이는 혼자 판단하고 해결하려 한다. 촉촉이는 사람과 마음을 나눌 때 안심한다.' },
    ],
    synergies: [
      { label: '감정과 중심', pair: '촉촉이 × 달몽이', body: '촉촉이가 사람들의 감정을 섬세하게 읽으면 달몽이가 흔들리지 않는 관점으로 중심을 잡는다.' },
      { label: '살핌과 실행', pair: '촉촉이 × 쨍이', body: '촉촉이가 걱정과 마음을 살피면 쨍이가 가능한 선택부터 빠르게 움직여 경험으로 바꾼다.' },
    ],
    closing: '당신의 섬세함은 새로운 순간에도 사람의 마음을 지켜준다.',
    theme: { heroStart: '#ddf7ff', heroEnd: '#eeeaff', accent: '#4dc4df', accentSoft: '#e8f8fc', closingStart: '#2e526d', closingEnd: '#4b4e7d' },
  },
  MONGSIL: {
    id: 'MONGSIL',
    characterKey: 'mongsil',
    name: '몽실이',
    englishType: 'AFFECTIONATE',
    descriptor: '편안한 온기로 관계를 잇는 다정한 연결자',
    quote: '괜찮아, 우리 편하게 이야기해보자.',
    summary: '익숙한 리듬 안에서 편안함을 느끼고 사람과 감정을 나눌 때 힘을 얻는다. 새로운 자극을 좇기보다 익숙한 일상과 관계를 편안하게 이어가길 좋아한다. 낯선 상황을 크게 걱정하지 않으면서도 사람의 감정에는 따뜻하게 반응한다.',
    coreDesire: '좋아하는 사람들과 편안하고 따뜻하게 이어지고 싶다.',
    strengthLead: '사람 사이에 편안한 온도를 만드는 힘',
    strengthBody: '다정함과 안정적인 관계 감각으로 누구나 머물기 좋은 분위기를 만듦',
    strengths: ['다정함', '온기', '친화력', '관계 유지', '편안한 소통'],
    caution: '좋은 관계를 지키려다 내 선택을 뒤로 미룰 수 있다. 상대가 편안한지를 먼저 살피다 보면 내가 원하는 것과 불편한 마음을 늦게 알아차릴 수 있다.',
    balanceTip: '상대의 마음을 살핀 뒤 내가 원하는 것도 같은 크기의 한 문장으로 말한다.',
    differences: [
      { name: '포근이', body: '둘 다 관계와 익숙함을 좋아하지만, 포근이는 불확실성을 더 세심하게 걱정한다. 몽실이는 상황을 비교적 편안하게 받아들인다.' },
      { name: '아롱이', body: '둘 다 사람과 감정을 나눌 때 힘을 얻지만, 아롱이는 새로움을 향해 먼저 뛰어든다. 몽실이는 익숙한 관계를 편안히 이어간다.' },
      { name: '달몽이', body: '둘 다 차분하고 걱정에 오래 머물지 않지만, 달몽이는 혼자만의 기준과 시간이 더 중요하다. 몽실이는 연결 속에서 힘을 얻는다.' },
    ],
    synergies: [
      { label: '도전과 온기', pair: '몽실이 × 쨍이', body: '쨍이가 새로운 길을 열면 몽실이가 사람들이 편안하게 함께할 수 있도록 관계를 이어준다.' },
      { label: '계획과 소통', pair: '몽실이 × 후우', body: '후우가 구조와 기준을 세우면 몽실이가 그 계획을 부담 없이 이해하고 따를 수 있게 풀어준다.' },
    ],
    closing: '당신의 다정함은 사람들이 편안히 머물 자리를 만든다.',
    theme: { heroStart: '#fff0f6', heroEnd: '#fff0e8', accent: '#e67ca0', accentSoft: '#fff0f4', closingStart: '#694052', closingEnd: '#824f65' },
  },
  ELECTRIC: {
    id: 'ELECTRIC',
    characterKey: 'electric',
    name: '찌릿이',
    englishType: 'VIGILANT',
    descriptor: '위험을 감지하며 길을 찾는 예민한 전략가',
    quote: '뭔가 걸려. 확인하고 더 좋은 방법을 찾아보자.',
    summary: '변화의 가능성과 위험 신호를 함께 감지하고 스스로 빠르게 대안을 찾는다. 새로운 가능성에 민첩하게 반응하면서 그 안의 문제와 위험 신호도 동시에 포착한다. 다른 사람의 반응을 기다리기보다 직접 확인하고 문제가 커지기 전에 대비하려 한다.',
    coreDesire: '문제가 생기기 전에 내가 먼저 알아채고 대비하고 싶다.',
    strengthLead: '변화 속의 이상 신호를 빠르게 찾는 힘',
    strengthBody: '민첩한 감지력과 독립적인 판단으로 위기 앞에서 빠르게 대안을 만듦',
    strengths: ['민첩함', '경계', '감지력', '대안 탐색', '위기에 대응'],
    caution: '긴장이 높아지면 작은 신호도 큰 문제처럼 느낄 수 있다. 위험을 빨리 발견하는 힘이 과해지면 아직 확인되지 않은 가능성까지 실제 문제처럼 받아들일 수 있다.',
    balanceTip: '불편한 신호를 발견하면 바로 결론 내리지 말고 영향과 가능성을 1~3단계로 나눈다.',
    differences: [
      { name: '후우', body: '둘 다 위험을 빠르게 감지하고 스스로 판단하지만, 후우는 익숙한 방식에서 안정감을 찾는다. 찌릿이는 변화 속에서도 대안을 탐색한다.' },
      { name: '쨍이', body: '둘 다 새로움과 독립적인 실행을 좋아하지만, 찌릿이는 위험 신호를 더 크게 감지한다. 쨍이는 가능성을 먼저 보고 바로 움직인다.' },
      { name: '촉촉이', body: '둘 다 새로움과 위험을 동시에 크게 느끼지만, 촉촉이는 사람과 마음을 나눌 때 안심한다. 찌릿이는 혼자 확인하고 해결하려 한다.' },
    ],
    synergies: [
      { label: '감지와 안정', pair: '찌릿이 × 포근이', body: '찌릿이가 위험 신호를 먼저 발견하면 포근이가 관계와 상황을 안정시키며 회복할 자리를 만든다.' },
      { label: '문제와 연결', pair: '찌릿이 × 아롱이', body: '찌릿이가 문제와 대안을 찾으면 아롱이가 필요한 사람을 모아 빠르게 함께 움직이게 한다.' },
    ],
    closing: '당신의 예민함은 아무도 못 본 신호를 먼저 발견하게 한다.',
    theme: { heroStart: '#e8e5f5', heroEnd: '#fff3cc', accent: '#635b7c', accentSoft: '#f0edf7', closingStart: '#34303e', closingEnd: '#514457' },
  },
  POGEUN: {
    id: 'POGEUN',
    characterKey: 'pogeun',
    name: '포근이',
    englishType: 'PROTECTIVE',
    descriptor: '익숙한 관계를 지켜주는 따뜻한 보호자',
    quote: '괜찮아, 천천히 가도 돼. 내가 곁에 있을게.',
    summary: '익숙하고 예측 가능한 흐름을 좋아하고 소중한 관계를 지킬 때 마음이 놓인다. 갑작스러운 변화보다 익숙한 흐름을 선호하며 낯선 상황은 충분히 살핀 뒤 받아들인다. 사람의 감정과 관계의 작은 변화에도 세심하게 반응한다.',
    coreDesire: '소중한 사람들과 안전하고 오래 이어지고 싶다.',
    strengthLead: '관계의 작은 균열을 다정하게 돌보는 힘',
    strengthBody: '세심한 배려와 꾸준한 책임감으로 사람들이 안심할 수 있는 자리를 만듦',
    strengths: ['배려심', '신뢰', '안정감', '관계 돌봄', '꾸준한 돌봄'],
    caution: '모두를 편안하게 하려다 변화와 내 필요를 미룰 수 있다. 익숙한 관계와 안전을 지키는 데 마음을 많이 쓰면 필요한 변화나 내 선택을 뒤로 미룰 수 있다.',
    balanceTip: '익숙한 것을 모두 바꾸기보다 부담 없는 한 가지부터 새롭게 시도한다.',
    differences: [
      { name: '몽실이', body: '둘 다 관계와 익숙함을 좋아하지만, 포근이는 불확실성을 더 세심하게 걱정한다. 몽실이는 상황을 비교적 편안하게 받아들인다.' },
      { name: '촉촉이', body: '둘 다 관계와 안전을 중요하게 여기지만, 촉촉이는 새로운 경험에도 강하게 끌린다. 포근이는 익숙한 흐름을 지키는 데 마음이 간다.' },
      { name: '후우', body: '둘 다 익숙함과 안전을 중요하게 여기지만, 후우는 정보와 기준을 먼저 확인한다. 포근이는 사람의 감정과 관계까지 함께 살핀다.' },
    ],
    synergies: [
      { label: '도전과 안정', pair: '포근이 × 쨍이', body: '쨍이가 새로운 길을 열면 포근이가 사람들이 안심하고 함께할 수 있도록 안정적인 기반을 만든다.' },
      { label: '감지와 회복', pair: '포근이 × 찌릿이', body: '찌릿이가 문제를 빠르게 감지하면 포근이가 관계와 분위기를 돌보며 회복할 자리를 마련한다.' },
    ],
    closing: '당신의 따뜻함은 사람들이 안심하고 기댈 자리를 만든다.',
    theme: { heroStart: '#fff5e9', heroEnd: '#f9e8e2', accent: '#c28b5b', accentSoft: '#fff4e8', closingStart: '#634a3c', closingEnd: '#895d4c' },
  },
};
