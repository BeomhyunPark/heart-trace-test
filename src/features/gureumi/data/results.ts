import type { GureumiResultType } from '../domain/types';

export type GureumiResultDefinition = {
  id: GureumiResultType;
  characterKey: string;
  name: string;
  englishType: string;
  descriptor: string;
  quote: string;
  mapSummary: string;
  storyLead: string;
  storyBody: [string, string];
  coreDesire: string;
  strengthLead: string;
  strengthBody: string;
  strengths: string[];
  balanceTitle: string;
  caution: string;
  balanceTipLabel: string;
  balanceTip: string;
  comparisonIntro: string;
  differences: Array<{ name: string; body: string }>;
  synergies: Array<{ label: string; pair: string; body: string }>;
  closing: string;
  theme: {
    heroStart: string;
    heroMiddle: string;
    heroEnd: string;
    heroInk: string;
    heroLabel: string;
    labelAccent: string;
    balanceLabel: string;
    accent: string;
    accentMiddle: string;
    accentEnd: string;
    accentSoft: string;
    accentInk: string;
    balanceStart: string;
    balanceMiddle: string;
    balanceEnd: string;
    closingStart: string;
    closingMiddle: string;
    closingEnd: string;
    sparkle: string;
    actionStart: string;
    actionMiddle: string;
    actionEnd: string;
  };
};

export const GUREUMI_RESULTS: Record<GureumiResultType, GureumiResultDefinition> = {
  ARONG: {
    id: 'ARONG',
    characterKey: 'arong',
    name: '아롱이',
    englishType: 'PASSIONATE',
    descriptor: '사람과 새로움에\n즐겁게 뛰어드는 열정가',
    quote: '재미있겠다!\n우리 같이 해보자.',
    mapSummary: '새로운 경험을 향해 빠르게 움직이고,\n사람과 감정을 나눌 때 에너지가 커져요.',
    storyLead: '새로운 사람과 경험 앞에서\n먼저 마음이 움직여요.',
    storyBody: [
      '새로운 사람과 경험을 좋아하고, 낯선 상황에도 비교적 편안하게 뛰어들어요.',
      '좋은 경험은 혼자 간직하기보다 함께 나누고 싶어 하고, 그 과정에서 주변의 분위기까지 밝게 만들어요.',
    ],
    coreDesire: '새로운 경험을 사람들과\n함께 나누고 싶다.',
    strengthLead: '사람 사이에 첫 장면을 만드는 힘',
    strengthBody: '친화력과 낙관성으로 관계를 시작하고,\n주변의 분위기에 생기를 더해요.',
    strengths: ['친화력', '열정', '낙관성', '관계 시작', '분위기 점화'],
    balanceTitle: '흥미와 관계를 따라가다\n너무 많은 일을 벌일 수 있어요.',
    caution: '좋아 보이는 제안에 빠르게 마음이 움직이다 보면, 이미 시작한 일에 쓸 에너지가 흩어질 수 있어요.',
    balanceTipLabel: '한 번만 멈춰보기',
    balanceTip: '새로운 약속을 잡기 전,\n지금 지키고 싶은 한 가지를 먼저 떠올려보세요.',
    comparisonIntro: '아롱이와 자주 헷갈리는 세 유형은\n에너지가 향하는 곳에서 차이가 나요.',
    differences: [
      { name: '촉촉이', body: '둘 다 사람을 좋아하지만, 촉촉이는 불확실성을 더 크게 걱정해요. 아롱이는 낯선 상황에도 비교적 편안하게 뛰어들어요.' },
      { name: '쨍이', body: '둘 다 새로움을 좋아하지만, 쨍이는 혼자 밀고 나가는 힘이 더 커요. 아롱이는 사람들과 함께할 때 에너지가 커져요.' },
      { name: '포근이', body: '둘 다 관계를 중요하게 여기지만, 포근이는 익숙함과 안정을 먼저 살펴요. 아롱이는 변화와 새로운 사람에게 먼저 다가가요.' },
    ],
    synergies: [
      { label: '시작과 실행', pair: '아롱이 × 쨍이', body: '아롱이가 사람을 모으고 분위기를 열면, 쨍이가 망설이지 않고 일을 움직여요.' },
      { label: '확장과 정리', pair: '아롱이 × 달몽이', body: '아롱이가 새로운 관계와 경험을 열면, 달몽이가 속도와 의미를 차분히 정돈해줘요.' },
    ],
    closing: '당신의 열정은\n사람들 사이에\n첫 장면을 만들어요.',
    theme: {
      heroStart: '#ddf8ff', heroMiddle: '#eee7ff', heroEnd: '#ffe7f3', heroInk: '#414b68',
      heroLabel: '#7867b5', labelAccent: '#7b6bbb', balanceLabel: '#b25c8b',
      accent: '#52cfe0', accentMiddle: '#b49af6', accentEnd: '#f08dc1', accentSoft: '#edfafd', accentInk: '#4f427b',
      balanceStart: '#ffeaf5', balanceMiddle: '#f4ecff', balanceEnd: '#fff5d9',
      closingStart: '#3a466b', closingMiddle: '#4a466f', closingEnd: '#6a4f78', sparkle: '#8fe7ec',
      actionStart: '#48d3e7', actionMiddle: '#9b74e8', actionEnd: '#ea73be',
    },
  },
  DALMONG: {
    id: 'DALMONG',
    characterKey: 'dalmong',
    name: '달몽이',
    englishType: 'COMPOSED',
    descriptor: '자기 속도로 깊이 바라보는\n차분한 관찰자',
    quote: '천천히 봐도 괜찮아.\n내 방식대로 생각해볼게.',
    mapSummary: '새로움에 쉽게 휩쓸리지 않고,\n주변 반응보다 자기 기준과 속도를 지켜요.',
    storyLead: '조용해 보여도 자기 안의\n방향은 분명해요.',
    storyBody: [
      '익숙한 리듬을 좋아하고, 예상 밖의 상황에서도 서둘러 반응하기보다 충분히 바라봐요.',
      '사람들의 반응에 크게 휩쓸리지 않고, 혼자 생각하고 몰입하는 시간에서 편안함을 느껴요.',
    ],
    coreDesire: '내 속도와 기준을\n잃지 않고 싶다.',
    strengthLead: '흔들리지 않고 본질을 바라보는 힘',
    strengthBody: '침착한 관찰과 독립적인 판단으로,\n복잡한 순간에도 중심을 지켜요.',
    strengths: ['침착함', '독립', '관찰력', '자기 기준', '깊은 몰입력'],
    balanceTitle: '혼자 괜찮다고 생각하다\n필요한 신호를 놓칠 수 있어요.',
    caution: '마음과 필요를 안으로만 정리하다 보면, 가까운 사람도 달몽이의 상태를 알아차리기 어려울 수 있어요.',
    balanceTipLabel: '한 문장만 건네보기',
    balanceTip: '도움이 필요하거나 마음이 움직였을 때,\n결론보다 지금 상태를 한 문장으로 알려주세요.',
    comparisonIntro: '달몽이와 자주 헷갈리는 세 유형은\n에너지가 향하는 곳에서 차이가 나요.',
    differences: [
      { name: '후우', body: '둘 다 자기 기준이 분명하고 익숙한 방식을 선호하지만, 후우는 위험을 더 꼼꼼히 확인해요. 달몽이는 불확실성에도 비교적 담담해요.' },
      { name: '쨍이', body: '둘 다 타인의 반응에 크게 흔들리지 않지만, 쨍이는 새로움을 만나면 바로 움직여요. 달몽이는 충분히 바라본 뒤 선택해요.' },
      { name: '몽실이', body: '둘 다 차분하고 낯선 상황을 크게 두려워하지 않지만, 몽실이는 사람과 감정을 나눌 때 힘을 얻어요. 달몽이는 혼자서도 편안해요.' },
    ],
    synergies: [
      { label: '깊이와 온기', pair: '달몽이 × 몽실이', body: '달몽이가 차분한 관점을 더하면, 몽실이가 그 생각을 사람들 사이에 따뜻하게 이어줘요.' },
      { label: '정리와 확장', pair: '달몽이 × 아롱이', body: '달몽이가 속도와 의미를 정돈하면, 아롱이가 새로운 관계와 경험으로 넓혀가요.' },
    ],
    closing: '당신의 차분함은\n복잡한 순간에도\n중심을 지켜줘요.',
    theme: {
      heroStart: '#eef0ff', heroMiddle: '#e8e4ff', heroEnd: '#f4ecff', heroInk: '#32365b',
      heroLabel: '#7672d9', labelAccent: '#7672d9', balanceLabel: '#7672d9',
      accent: '#7672d9', accentMiddle: '#a39aee', accentEnd: '#c7b9f4', accentSoft: '#e9eaff', accentInk: '#42406d',
      balanceStart: '#f0f0ff', balanceMiddle: '#f3edff', balanceEnd: '#f8f0ff',
      closingStart: '#32365b', closingMiddle: '#42406d', closingEnd: '#53436f', sparkle: '#c7b9f4',
      actionStart: '#7672d9', actionMiddle: '#a39aee', actionEnd: '#c7b9f4',
    },
  },
  HOOWOO: {
    id: 'HOOWOO',
    characterKey: 'hoowoo',
    name: '후우',
    englishType: 'CAUTIOUS',
    descriptor: '충분히 살피고 움직이는\n신중한 설계자',
    quote: '잠깐만,\n먼저 확인해보고 움직이자.',
    mapSummary: '익숙한 방식에서 안정감을 찾고,\n불확실한 지점을 충분히 확인한 뒤 움직여요.',
    storyLead: '움직이기 전, 먼저 위험과\n변수를 살펴봐요.',
    storyBody: [
      '갑작스러운 변화에 바로 뛰어들기보다 필요한 정보와 가능한 위험을 충분히 확인해요.',
      '주변의 분위기에 휩쓸리기보다 자기 기준으로 판단하고, 미리 준비해두었을 때 마음이 놓여요.',
    ],
    coreDesire: '안전하게 준비한 뒤\n확실히 움직이고 싶다.',
    strengthLead: '놓치기 쉬운 위험을 먼저 발견하는 힘',
    strengthBody: '신중한 분석과 독립적인 판단으로,\n계획의 빈틈을 단단하게 채워요.',
    strengths: ['신중함', '분석', '대비력', '위험 감지', '독립적 판단'],
    balanceTitle: '충분히 준비하려다\n시작할 타이밍을 놓칠 수 있어요.',
    caution: '모든 변수를 확인하려고 하면 준비는 탄탄해져도, 실제로 해보며 얻을 수 있는 정보가 늦어질 수 있어요.',
    balanceTipLabel: '작게 시험해보기',
    balanceTip: '완벽히 준비될 때까지 기다리기보다,\n되돌릴 수 있는 작은 범위부터 시작해보세요.',
    comparisonIntro: '후우와 자주 헷갈리는 세 유형은\n에너지가 향하는 곳에서 차이가 나요.',
    differences: [
      { name: '포근이', body: '둘 다 익숙함과 안전을 중요하게 여기지만, 포근이는 관계의 분위기까지 세심하게 살펴요. 후우는 사람보다 정보와 기준을 먼저 확인해요.' },
      { name: '찌릿이', body: '둘 다 위험을 빠르게 감지하고 스스로 판단하지만, 찌릿이는 변화의 자극에도 민첩하게 반응해요. 후우는 검증된 방식에서 안정감을 찾아요.' },
      { name: '달몽이', body: '둘 다 자기 기준이 분명하고 익숙한 방식을 선호하지만, 후우는 불확실성을 더 꼼꼼히 걱정해요. 달몽이는 예상 밖의 상황에도 비교적 담담해요.' },
    ],
    synergies: [
      { label: '아이디어와 검증', pair: '후우 × 아롱이', body: '아롱이가 가능성을 넓히면, 후우가 위험과 순서를 확인해 실행 가능한 계획으로 다듬어요.' },
      { label: '계획과 배려', pair: '후우 × 몽실이', body: '후우가 구조와 기준을 세우면, 몽실이가 사람들이 편안히 따라올 수 있게 연결해줘요.' },
    ],
    closing: '당신의 신중함은\n사람들이 안심하고\n움직일 길을 만들어요.',
    theme: {
      heroStart: '#e8f7f0', heroMiddle: '#eef6f2', heroEnd: '#f3f0e8', heroInk: '#2f514d',
      heroLabel: '#69b89e', labelAccent: '#69b89e', balanceLabel: '#69b89e',
      accent: '#69b89e', accentMiddle: '#8ccaaf', accentEnd: '#b9d9a6', accentSoft: '#eaf7ef', accentInk: '#365d55',
      balanceStart: '#eaf7ef', balanceMiddle: '#f2f7eb', balanceEnd: '#f7f2e7',
      closingStart: '#2f514d', closingMiddle: '#365d55', closingEnd: '#4d6659', sparkle: '#b9d9a6',
      actionStart: '#69b89e', actionMiddle: '#8ccaaf', actionEnd: '#b9d9a6',
    },
  },
  SUNNY: {
    id: 'SUNNY',
    characterKey: 'sunny',
    name: '쨍이',
    englishType: 'ADVENTUROUS',
    descriptor: '새로운 길을 거침없이 여는\n독립적인 개척자',
    quote: '좋아, 일단 해보자.\n길은 가면서 찾으면 돼.',
    mapSummary: '새로운 가능성을 발견하면 빠르게 움직이고,\n다른 사람의 반응보다 직접 해보며 판단해요.',
    storyLead: '새로운 가능성을 발견하면\n바로 움직여요.',
    storyBody: [
      '익숙한 답보다 아직 가보지 않은 길에 더 끌리고, 불확실한 상황도 직접 부딪쳐보며 알아가요.',
      '주변의 동의를 오래 기다리기보다 자기 판단으로 시작하고, 도전 그 자체에서 에너지를 얻어요.',
    ],
    coreDesire: '내가 발견한 가능성을\n직접 시험해보고 싶다.',
    strengthLead: '망설임 없이 첫발을 내딛는 힘',
    strengthBody: '도전성과 독립적인 추진력으로,\n아직 없던 길의 시작점을 만들어요.',
    strengths: ['도전성', '추진', '독립성', '빠른 실행', '길을 개척함'],
    balanceTitle: '속도와 확신이 앞서면\n사람들의 리듬을 놓칠 수 있어요.',
    caution: '혼자서도 잘 움직이는 만큼, 함께하는 사람의 걱정이나 준비 속도를 미처 확인하지 못할 수 있어요.',
    balanceTipLabel: '출발 전 한 번 묻기',
    balanceTip: '함께하는 사람이 있다면 결정하기 전,\n속도와 걱정되는 점을 한 번 물어보세요.',
    comparisonIntro: '쨍이와 자주 헷갈리는 세 유형은\n에너지가 향하는 곳에서 차이가 나요.',
    differences: [
      { name: '아롱이', body: '둘 다 새로움을 좋아하고 걱정에 오래 머물지 않지만, 아롱이는 사람들과 함께할 때 에너지가 커져요. 쨍이는 혼자서도 바로 길을 열어요.' },
      { name: '찌릿이', body: '둘 다 새로움과 독립적인 실행을 좋아하지만, 찌릿이는 위험 신호도 크게 감지해요. 쨍이는 가능성을 먼저 보고 바로 움직여요.' },
      { name: '달몽이', body: '둘 다 자기 판단대로 움직이고 걱정에 오래 머물지 않지만, 달몽이는 익숙한 리듬을 선호해요. 쨍이는 변화 자체에서 에너지를 얻어요.' },
    ],
    synergies: [
      { label: '시작과 확산', pair: '쨍이 × 아롱이', body: '쨍이가 망설이지 않고 첫발을 떼면, 아롱이가 사람을 모아 경험을 더 크게 확장해요.' },
      { label: '도전과 검증', pair: '쨍이 × 후우', body: '쨍이가 가능성을 빠르게 시험하면, 후우가 위험과 순서를 점검해 지속 가능한 실행으로 만들어요.' },
    ],
    closing: '당신의 용기는\n아직 없던 길에\n첫 발자국을 남겨요.',
    theme: {
      heroStart: '#fff7d7', heroMiddle: '#fff0d5', heroEnd: '#fff6e8', heroInk: '#5b442b',
      heroLabel: '#f4b842', labelAccent: '#f4b842', balanceLabel: '#f4b842',
      accent: '#f4b842', accentMiddle: '#f4cb5d', accentEnd: '#f19b4b', accentSoft: '#fff6d8', accentInk: '#6d4a2e',
      balanceStart: '#fff6d8', balanceMiddle: '#fff0df', balanceEnd: '#fff8e7',
      closingStart: '#5b442b', closingMiddle: '#6d4a2e', closingEnd: '#71513a', sparkle: '#f19b4b',
      actionStart: '#f4b842', actionMiddle: '#f4cb5d', actionEnd: '#f19b4b',
    },
  },
  CHOKCHOK: {
    id: 'CHOKCHOK',
    characterKey: 'chokchok',
    name: '촉촉이',
    englishType: 'SENSITIVE',
    descriptor: '설렘과 걱정을 함께 품는\n섬세한 공감 탐험가',
    quote: '해보고 싶어!\n우리 같이 천천히 가볼래?',
    mapSummary: '새로운 경험에 마음이 끌리면서도,\n사람과 안전을 확인할 때 편안해져요.',
    storyLead: '마음은 먼저 끌리지만,\n안전한 연결도 확인하고 싶어요.',
    storyBody: [
      '새로운 경험을 좋아하면서도 낯선 상황의 위험과 주변 사람의 반응을 동시에 세심하게 느껴요.',
      '혼자 결정하기보다 믿을 수 있는 사람과 마음을 나눌 때 안심하고, 그 안에서 용기를 얻어요.',
    ],
    coreDesire: '안심할 수 있는 사람들과\n새로운 경험을 나누고 싶다.',
    strengthLead: '변화 속에서도 사람의 마음을 살피는 힘',
    strengthBody: '호기심과 공감력을 함께 사용해,\n새로운 순간의 감정까지 놓치지 않아요.',
    strengths: ['감수성', '공감', '호기심', '함께 탐색', '분위기 감지'],
    balanceTitle: '설렘과 걱정이 함께 커져\n마음이 쉽게 지칠 수 있어요.',
    caution: '해보고 싶은 마음과 잘해야 한다는 걱정이 동시에 커지면, 결정 전부터 감정 에너지를 많이 쓸 수 있어요.',
    balanceTipLabel: '걱정을 사실과 나누기',
    balanceTip: '떠오르는 걱정을 실제 확인된 것과,\n아직 모르는 것으로 나누어 적어보세요.',
    comparisonIntro: '촉촉이와 자주 헷갈리는 세 유형은\n에너지가 향하는 곳에서 차이가 나요.',
    differences: [
      { name: '아롱이', body: '둘 다 새로움과 사람을 좋아하지만, 촉촉이는 불확실성을 더 크게 걱정해요. 아롱이는 낯선 상황에도 비교적 편안하게 뛰어들어요.' },
      { name: '포근이', body: '둘 다 관계와 안전을 중요하게 여기지만, 포근이는 익숙한 관계를 지키는 데 마음이 가요. 촉촉이는 새로운 경험에도 강하게 끌려요.' },
      { name: '찌릿이', body: '둘 다 새로움과 위험을 동시에 크게 느끼지만, 찌릿이는 혼자 판단하고 해결하려 해요. 촉촉이는 사람과 마음을 나눌 때 안심해요.' },
    ],
    synergies: [
      { label: '감정과 중심', pair: '촉촉이 × 달몽이', body: '촉촉이가 사람들의 감정을 섬세하게 읽으면, 달몽이가 흔들리지 않는 관점으로 중심을 잡아줘요.' },
      { label: '살핌과 실행', pair: '촉촉이 × 쨍이', body: '촉촉이가 걱정과 마음을 살피면, 쨍이가 가능한 선택부터 빠르게 움직여 경험으로 바꿔요.' },
    ],
    closing: '당신의 섬세함은\n새로운 순간에도\n사람의 마음을 지켜줘요.',
    theme: {
      heroStart: '#e6f7ff', heroMiddle: '#e8f2ff', heroEnd: '#f1ecff', heroInk: '#2e536a',
      heroLabel: '#50bcd8', labelAccent: '#50bcd8', balanceLabel: '#50bcd8',
      accent: '#50bcd8', accentMiddle: '#76cfe9', accentEnd: '#8a9fe8', accentSoft: '#eaf8ff', accentInk: '#355b76',
      balanceStart: '#eaf8ff', balanceMiddle: '#edf3ff', balanceEnd: '#f2eeff',
      closingStart: '#2e536a', closingMiddle: '#355b76', closingEnd: '#4e527a', sparkle: '#8a9fe8',
      actionStart: '#50bcd8', actionMiddle: '#76cfe9', actionEnd: '#8a9fe8',
    },
  },
  MONGSIL: {
    id: 'MONGSIL',
    characterKey: 'mongsil',
    name: '몽실이',
    englishType: 'AFFECTIONATE',
    descriptor: '편안한 온기로 관계를 잇는\n다정한 연결자',
    quote: '괜찮아,\n우리 편하게 이야기해보자.',
    mapSummary: '익숙한 리듬 안에서 편안함을 느끼고,\n사람과 감정을 나눌 때 힘을 얻어요.',
    storyLead: '서두르지 않아도 사람 곁에\n편안히 머물러요.',
    storyBody: [
      '새로운 자극을 좇기보다 익숙한 일상과 관계를 편안하게 이어가는 것을 좋아해요.',
      '낯선 상황을 크게 걱정하지 않으면서도 사람의 감정에는 따뜻하게 반응하고, 자연스럽게 관계를 이어줘요.',
    ],
    coreDesire: '좋아하는 사람들과\n편안하고 따뜻하게 이어지고 싶다.',
    strengthLead: '사람 사이에 편안한 온도를 만드는 힘',
    strengthBody: '다정함과 안정적인 관계 감각으로,\n누구나 머물기 좋은 분위기를 만들어요.',
    strengths: ['다정함', '온기', '친화력', '관계 유지', '편안한 소통'],
    balanceTitle: '좋은 관계를 지키려다\n내 선택을 뒤로 미룰 수 있어요.',
    caution: '상대가 편안한지를 먼저 살피다 보면, 정작 내가 원하는 것과 불편한 마음을 늦게 알아차릴 수 있어요.',
    balanceTipLabel: '내 마음도 함께 말하기',
    balanceTip: '상대의 마음을 살핀 뒤,\n내가 원하는 것도 같은 크기의 한 문장으로 말해보세요.',
    comparisonIntro: '몽실이와 자주 헷갈리는 세 유형은\n에너지가 향하는 곳에서 차이가 나요.',
    differences: [
      { name: '포근이', body: '둘 다 관계와 익숙함을 좋아하지만, 포근이는 불확실성을 더 세심하게 걱정해요. 몽실이는 상황을 비교적 편안하게 받아들여요.' },
      { name: '아롱이', body: '둘 다 사람과 감정을 나눌 때 힘을 얻지만, 아롱이는 새로움을 향해 먼저 뛰어들어요. 몽실이는 익숙한 관계를 편안히 이어가요.' },
      { name: '달몽이', body: '둘 다 차분하고 걱정에 오래 머물지 않지만, 달몽이는 혼자만의 기준과 시간이 더 중요해요. 몽실이는 연결 속에서 힘을 얻어요.' },
    ],
    synergies: [
      { label: '도전과 온기', pair: '몽실이 × 쨍이', body: '쨍이가 새로운 길을 열면, 몽실이가 사람들이 편안하게 함께할 수 있도록 관계를 이어줘요.' },
      { label: '계획과 소통', pair: '몽실이 × 후우', body: '후우가 구조와 기준을 세우면, 몽실이가 그 계획을 부담 없이 이해하고 따를 수 있게 풀어줘요.' },
    ],
    closing: '당신의 다정함은\n사람들이 편안히\n머물 자리를 만들어요.',
    theme: {
      heroStart: '#fff0f4', heroMiddle: '#ffeaf1', heroEnd: '#fff4ee', heroInk: '#624052',
      heroLabel: '#ee8fae', labelAccent: '#ee8fae', balanceLabel: '#ee8fae',
      accent: '#ee8fae', accentMiddle: '#f1a1bc', accentEnd: '#e8b38d', accentSoft: '#fff0f5', accentInk: '#75485d',
      balanceStart: '#fff0f5', balanceMiddle: '#fff4ef', balanceEnd: '#faf1e8',
      closingStart: '#624052', closingMiddle: '#75485d', closingEnd: '#765264', sparkle: '#e8b38d',
      actionStart: '#ee8fae', actionMiddle: '#f1a1bc', actionEnd: '#e8b38d',
    },
  },
  ELECTRIC: {
    id: 'ELECTRIC',
    characterKey: 'electric',
    name: '찌릿이',
    englishType: 'VIGILANT',
    descriptor: '위험을 감지하며 길을 찾는\n예민한 전략가',
    quote: '뭔가 걸려.\n확인하고 더 좋은 방법을 찾아보자.',
    mapSummary: '변화의 가능성과 위험 신호를 함께 감지하고,\n스스로 빠르게 대안을 찾아요.',
    storyLead: '변화의 신호와 위험을\n누구보다 빠르게 알아차려요.',
    storyBody: [
      '새로운 가능성에 민첩하게 반응하면서도 그 안의 문제와 위험 신호도 동시에 빠르게 포착해요.',
      '다른 사람의 반응을 기다리기보다 직접 확인하고, 문제가 커지기 전에 대안을 찾으려 해요.',
    ],
    coreDesire: '문제가 생기기 전에\n내가 먼저 알아채고 대비하고 싶다.',
    strengthLead: '변화 속의 이상 신호를 빠르게 찾는 힘',
    strengthBody: '민첩한 감지력과 독립적인 판단으로,\n위기 앞에서 빠르게 대안을 만들어요.',
    strengths: ['민첩함', '경계', '감지력', '대안 탐색', '위기에 대응'],
    balanceTitle: '긴장이 높아지면 작은 신호도\n큰 문제처럼 느낄 수 있어요.',
    caution: '위험을 빨리 발견하는 힘이 과해지면, 아직 확인되지 않은 가능성까지 실제 문제처럼 받아들일 수 있어요.',
    balanceTipLabel: '경고의 크기 정하기',
    balanceTip: '불편한 신호를 발견하면 바로 결론 내리기보다,\n영향과 가능성을 1~3단계로 나눠보세요.',
    comparisonIntro: '찌릿이와 자주 헷갈리는 세 유형은\n에너지가 향하는 곳에서 차이가 나요.',
    differences: [
      { name: '후우', body: '둘 다 위험을 빠르게 감지하고 스스로 판단하지만, 후우는 익숙한 방식에서 안정감을 찾아요. 찌릿이는 변화 속에서도 대안을 탐색해요.' },
      { name: '쨍이', body: '둘 다 새로움과 독립적인 실행을 좋아하지만, 찌릿이는 위험 신호를 더 크게 감지해요. 쨍이는 가능성을 먼저 보고 바로 움직여요.' },
      { name: '촉촉이', body: '둘 다 새로움과 위험을 동시에 크게 느끼지만, 촉촉이는 사람과 마음을 나눌 때 안심해요. 찌릿이는 혼자 확인하고 해결하려 해요.' },
    ],
    synergies: [
      { label: '감지와 안정', pair: '찌릿이 × 포근이', body: '찌릿이가 위험 신호를 먼저 발견하면, 포근이가 관계와 상황을 안정시키며 회복할 자리를 만들어요.' },
      { label: '문제와 연결', pair: '찌릿이 × 아롱이', body: '찌릿이가 문제와 대안을 찾으면, 아롱이가 필요한 사람을 모아 빠르게 함께 움직이게 해요.' },
    ],
    closing: '당신의 예민함은\n아무도 못 본 신호를\n먼저 발견하게 해요.',
    theme: {
      heroStart: '#f0eff8', heroMiddle: '#eceaf5', heroEnd: '#fff5d9', heroInk: '#30303e',
      heroLabel: '#66627d', labelAccent: '#66627d', balanceLabel: '#66627d',
      accent: '#66627d', accentMiddle: '#8c85a4', accentEnd: '#e8bc3f', accentSoft: '#f1f0f7', accentInk: '#3c394d',
      balanceStart: '#f1f0f7', balanceMiddle: '#f3eff7', balanceEnd: '#fff4d9',
      closingStart: '#30303e', closingMiddle: '#3c394d', closingEnd: '#514a58', sparkle: '#e8bc3f',
      actionStart: '#66627d', actionMiddle: '#8c85a4', actionEnd: '#e8bc3f',
    },
  },
  POGEUN: {
    id: 'POGEUN',
    characterKey: 'pogeun',
    name: '포근이',
    englishType: 'PROTECTIVE',
    descriptor: '익숙한 관계를 지켜주는\n따뜻한 보호자',
    quote: '괜찮아, 천천히 가도 돼.\n내가 곁에 있을게.',
    mapSummary: '익숙하고 예측 가능한 흐름을 좋아하고,\n소중한 관계를 지킬 때 마음이 놓여요.',
    storyLead: '익숙한 사람과 안전한 리듬\n안에서 마음이 놓여요.',
    storyBody: [
      '갑작스러운 변화보다 익숙하고 예측 가능한 흐름을 선호하며, 낯선 상황은 충분히 살핀 뒤 받아들여요.',
      '사람의 감정과 관계의 작은 변화에도 세심하게 반응하고, 소중한 관계를 오래 지키려 해요.',
    ],
    coreDesire: '소중한 사람들과\n안전하고 오래 이어지고 싶다.',
    strengthLead: '관계의 작은 균열을 다정하게 돌보는 힘',
    strengthBody: '세심한 배려와 꾸준한 책임감으로,\n사람들이 안심할 수 있는 자리를 만들어요.',
    strengths: ['배려심', '신뢰', '안정감', '관계 돌봄', '꾸준한 돌봄'],
    balanceTitle: '모두를 편안하게 하려다\n변화와 내 필요를 미룰 수 있어요.',
    caution: '익숙한 관계와 안전을 지키는 데 마음을 많이 쓰면, 필요한 변화나 내 선택을 뒤로 미룰 수 있어요.',
    balanceTipLabel: '안전한 작은 변화',
    balanceTip: '익숙한 것을 모두 바꾸기보다,\n부담 없는 한 가지부터 새롭게 시도해보세요.',
    comparisonIntro: '포근이와 자주 헷갈리는 세 유형은\n에너지가 향하는 곳에서 차이가 나요.',
    differences: [
      { name: '몽실이', body: '둘 다 관계와 익숙함을 좋아하지만, 포근이는 불확실성을 더 세심하게 걱정해요. 몽실이는 상황을 비교적 편안하게 받아들여요.' },
      { name: '촉촉이', body: '둘 다 관계와 안전을 중요하게 여기지만, 촉촉이는 새로운 경험에도 강하게 끌려요. 포근이는 익숙한 흐름을 지키는 데 마음이 가요.' },
      { name: '후우', body: '둘 다 익숙함과 안전을 중요하게 여기지만, 후우는 정보와 기준을 먼저 확인해요. 포근이는 사람의 감정과 관계까지 함께 살펴요.' },
    ],
    synergies: [
      { label: '도전과 안정', pair: '포근이 × 쨍이', body: '쨍이가 새로운 길을 열면, 포근이가 사람들이 안심하고 함께할 수 있도록 안정적인 기반을 만들어요.' },
      { label: '감지와 회복', pair: '포근이 × 찌릿이', body: '찌릿이가 문제를 빠르게 감지하면, 포근이가 관계와 분위기를 돌보며 회복할 자리를 마련해요.' },
    ],
    closing: '당신의 따뜻함은\n사람들이 안심하고\n기댈 자리를 만들어요.',
    theme: {
      heroStart: '#fff5e9', heroMiddle: '#fff1e3', heroEnd: '#f8efea', heroInk: '#5b493e',
      heroLabel: '#d7a778', labelAccent: '#d7a778', balanceLabel: '#d7a778',
      accent: '#d7a778', accentMiddle: '#e4ba8d', accentEnd: '#d88d76', accentSoft: '#fff4e8', accentInk: '#6b5144',
      balanceStart: '#fff4e8', balanceMiddle: '#faf0e7', balanceEnd: '#fff7ef',
      closingStart: '#5b493e', closingMiddle: '#6b5144', closingEnd: '#765b51', sparkle: '#d88d76',
      actionStart: '#d7a778', actionMiddle: '#e4ba8d', actionEnd: '#d88d76',
    },
  },
};
