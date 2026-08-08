import type { Question } from '../domain/types';

export const QUESTION_SOURCE = {
  documentId: '1-35-57d5TKdNZOC0-aCS2_JGg7wo6Ndwn9ZXLTo2Pa0',
  tabId: 't.gp9cfhyqeusg',
} as const;

export const QUESTIONS = [
  {
    id: 1,
    text: '열심히 준비한 일을 다시 하라는 말을 들었다. 여러 사람 앞에서 내가 한 노력은 알아주지 않고 부족한 점만 지적받았다.',
    options: [
      { id: 'A', text: '지적 받은 말을 계속 마음에 담아둔다.', resultType: 'bear' },
      { id: 'B', text: '아쉬운 마음은 들지만 티를 안내고 넘긴다.', resultType: 'spring' },
      { id: 'C', text: '준비를 충분히 하지 못했다 생각한다.', resultType: 'effort' },
      { id: 'D', text: '다른 일에 집중하며 생각을 환기한다.', resultType: 'pause' },
      { id: 'E', text: '납득되지 않는 부분이 있으면 그 자리에서 이유를 묻는다.', resultType: 'express' },
    ],
  },
  {
    id: 2,
    text: '해본 적 없는 중요한 프로젝트를 갑자기 맡게 되었다. 준비 기간도 짧고 주변의 기대도 큰 상황이다.',
    options: [
      { id: 'A', text: '내가 할 수 없다고 판단되어 포기한다', resultType: 'pause' },
      { id: 'B', text: '잘 해낼 수 있을지 걱정하느라 시간을 다 쏟는다.', resultType: 'bear' },
      { id: 'C', text: '능력 밖의 일에 대해선 못하겠다고 솔직하게 말한다.', resultType: 'express' },
      { id: 'D', text: '실제로는 많이 부담되지만 내색하지 않는다.', resultType: 'spring' },
      { id: 'E', text: '책임지고 어떻게든 잘 해내고자 애쓴다.', resultType: 'effort' },
    ],
  },
  {
    id: 3,
    text: '내 의도와 다르게 말이 전달되어 오해를 받았다.',
    options: [
      { id: 'A', text: '억울하고 화가 나서 바로 내 입장을 이야기한다.', resultType: 'express' },
      { id: 'B', text: '내가 더 잘 말했어야 했나 돌아본다.', resultType: 'effort' },
      { id: 'C', text: '바로 해명하기 부담스러워 일단 거리를 둔다.', resultType: 'pause' },
      { id: 'D', text: '어디서부터 잘못 전달됐는지 계속 되짚어본다.', resultType: 'bear' },
      { id: 'E', text: '다른 사람들도 나를 오해할까 신경 쓰인다.', resultType: 'spring' },
    ],
  },
  {
    id: 4,
    text: '함께 일하는 사람이 나보다 너무 느려서 계속 호흡이 맞지 않는다.',
    options: [
      { id: 'A', text: '상대방을 크게 신경쓰지 않고 내 할 일에 집중한다.', resultType: 'pause' },
      { id: 'B', text: '상대에게도 이유가 있을 거라 생각하며 상대를 이해하려 한다.', resultType: 'bear' },
      { id: 'C', text: '속으로는 답답하지만 상대의 속도에 맞춘다.', resultType: 'spring' },
      { id: 'D', text: '일이 계속 늦어져 기한 내에 못 끝낼거 같으면 동료에게 속도를 맞춰달라고 직접 말한다.', resultType: 'express' },
      { id: 'E', text: '동료의 일도 내가 대신 처리하며 속도를 맞춘다.', resultType: 'effort' },
    ],
  },
  {
    id: 5,
    text: '중요한 메시지를 보냈는데 읽고 답장이 오지 않았다.',
    options: [
      { id: 'A', text: '왜 답장하지 않는지 상상의 나래를 펼친다.', resultType: 'bear' },
      { id: 'B', text: '답장하지 않는 이유가 있겠지 생각하고 기다린다.', resultType: 'spring' },
      { id: 'C', text: '답장이 오지 않는 이유가 나 때문인 것 같다.', resultType: 'effort' },
      { id: 'D', text: '신경쓰지 않으려 휴대폰을 멀리한다.', resultType: 'pause' },
      { id: 'E', text: '다시 연락해서 답장하지 않는 이유를 물어본다.', resultType: 'express' },
    ],
  },
  {
    id: 6,
    text: '몇 주 전부터 기대했던 약속이 당일 갑자기 취소되었다.',
    options: [
      { id: 'A', text: '아쉬움을 티 내지 않고 다음엔 너무 기대하지 않기로 한다.', resultType: 'spring' },
      { id: 'B', text: '갑자기 취소된 이유를 묻고, 서운한 마음도 솔직하게 표현한다.', resultType: 'express' },
      { id: 'C', text: '아쉬워할 틈도 없이 미뤄둔 일을 하며 빈 시간을 채운다.', resultType: 'effort' },
      { id: 'D', text: '다른 약속을 잡기보다 집에서 쉬고 싶다.', resultType: 'pause' },
      { id: 'E', text: '약속이 취소된 이유와 관계에 대해 계속 생각하게 된다.', resultType: 'bear' },
    ],
  },
  {
    id: 7,
    text: '오랜만에 만난 친구가 사실 요즘 많이 힘들었다며 예상하지 못한 속마음을 털어놓기 시작했다.',
    options: [
      { id: 'A', text: '친구에게 도움이 될 만한 방법을 찾아보며 곁에서 챙겨준다.', resultType: 'effort' },
      { id: 'B', text: '친구가 자신의 속도로 이야기하도록 조용히 기다린다.', resultType: 'pause' },
      { id: 'C', text: '친구의 마음을 깊이 헤아리고 공감하며 따뜻한 말로 위로해준다.', resultType: 'bear' },
      { id: 'D', text: '친구의 이야기를 들으며 함께 속상해하고 솔직하게 반응한다.', resultType: 'express' },
      { id: 'E', text: '친구의 표정과 분위기를 살피며 지금 가장 듣고 싶어 할 말을 고민한다.', resultType: 'spring' },
    ],
  },
  {
    id: 8,
    text: '예상하지 못한 환급금으로 10만 원이 들어왔다.',
    options: [
      { id: 'A', text: '그동안 미뤄뒀던 휴식이나 나를 편안하게 해줄 일에 사용한다.', resultType: 'pause' },
      { id: 'B', text: '어디에 써야 가장 의미 있을지 여러 선택지를 비교해본다.', resultType: 'bear' },
      { id: 'C', text: '갖고 싶었던 것이 떠오르면 고민하지 않고 산다.', resultType: 'express' },
      { id: 'D', text: '주변 사람에게 작은 선물을 하거나 함께 맛있는 것을 먹고 싶어진다.', resultType: 'spring' },
      { id: 'E', text: '당장 필요한 곳이 있는지 생각하고 계획적으로 사용한다.', resultType: 'effort' },
    ],
  },
  {
    id: 9,
    text: '오늘이 내 생일이지만 하루가 거의 끝날 때까지 누구도 생일을 언급하지 않았다.',
    options: [
      { id: 'A', text: '친한 사람들에게 오늘이 생일이라고 먼저 말한다.', resultType: 'express' },
      { id: 'B', text: '지난 생일을 떠올려보며, 의미 부여를 멈추려고 노력한다.', resultType: 'bear' },
      { id: 'C', text: '서운하지만, 다른 사람의 생일은 신경써서 챙겨줘야겠다고 생각한다.', resultType: 'spring' },
      { id: 'D', text: '내가 먼저 이야기하지 않았으니까!라며 자신을 이해시킨다.', resultType: 'effort' },
      { id: 'E', text: '혼자 쉬면서 조용히 나만의 방식으로 하루를 보낸다.', resultType: 'pause' },
    ],
  },
  {
    id: 10,
    text: '셀모임에서 한 사람이 이야기를 꺼냈는데 말이 너무 길다. 내가 셀리더라면?',
    options: [
      { id: 'A', text: '셀원이 민망하지 않게 조심스럽게 말을 정리해준다.', resultType: 'spring' },
      { id: 'B', text: '일단 말을 정리하고 따로 시간을 내어 더 들어준다.', resultType: 'effort' },
      { id: 'C', text: '어떻게 끊어야 할지 몰라 일단 끝까지 들어준다.', resultType: 'pause' },
      { id: 'D', text: '지금 끊어도 될지 고민하다가 계속 들어준다.', resultType: 'bear' },
      { id: 'E', text: '너무 길어진 것 같으면 고민 없이 말을 끊는다.', resultType: 'express' },
    ],
  },
  {
    id: 11,
    text: '예배 중 요즘 내가 겪고 있는 상황과 꼭 맞는 것 같은 말씀을 들었다. 유독 마음에 와닿은 그 말씀에 나는 어떻게 반응할까?',
    options: [
      { id: 'A', text: '마음에 와닿은 말씀과 은혜를 주변 사람들에게 나눈다.', resultType: 'express' },
      { id: 'B', text: '말씀대로 살아가기 위해 내가 실천할 수 있는 일을 찾아본다.', resultType: 'effort' },
      { id: 'C', text: '당장 답을 찾기보다 말씀을 마음에 담아두고 천천히 받아들인다.', resultType: 'pause' },
      { id: 'D', text: '이 말씀이 왜 지금 내게 남았는지 그 의미를 깊이 묵상한다.', resultType: 'bear' },
      { id: 'E', text: '말씀을 들으며 떠오른 사람과 그 마음을 생각한다.', resultType: 'spring' },
    ],
  },
  {
    id: 12,
    text: '예배 직전에 사람이 부족하다며 예상하지 못한 봉사를 부탁 받았다.',
    options: [
      { id: 'A', text: '내가 잘할 수 있을지 생각해본 뒤 참여한다.', resultType: 'bear' },
      { id: 'B', text: '부탁한 사람이 곤란하지 않도록 기꺼이 돕는다.', resultType: 'spring' },
      { id: 'C', text: '필요한 역할을 바로 물어보고 내가 할 수 있을 만큼 감당한다.', resultType: 'express' },
      { id: 'D', text: '어떤 역할이든 맡겨 주셨다는 것에 집중하며 잘 해내기 위해 노력한다.', resultType: 'effort' },
      { id: 'E', text: '내가 편안하게 감당할 수 있는 역할부터 차분히 참여한다.', resultType: 'pause' },
    ],
  },
  {
    id: 13,
    text: '공동체 모임에 처음 온 것 같은 사람이 대화에 끼지 못한 채 혼자 앉아 있다.',
    options: [
      { id: 'A', text: '‘외롭지 않을까?’ ‘내가 가면 부담스러울까?’ 고민하며 살핀다.', resultType: 'bear' },
      { id: 'B', text: '먼저 다가가 이름을 묻고 편하게 대화를 시작한다.', resultType: 'express' },
      { id: 'C', text: '상대가 모임에 녹아들 수 있도록 조용히 옆에서 챙겨준다.', resultType: 'spring' },
      { id: 'D', text: '챙겨줘야 한다는 책임감으로 대화를 이어가려고 애쓴다.', resultType: 'effort' },
      { id: 'E', text: '신경은 쓰이지만 쉽게 다가가지 못한다.', resultType: 'pause' },
    ],
  },
  {
    id: 14,
    text: '힘든 일이 있었지만 누구에게도 자세히 말하지 않았다.\n그런데 한 사람이 먼저 내 마음을 알아주고 기도해 주었다.',
    options: [
      { id: 'A', text: '말하지 않아도 알아준 것 같아 마음이 놓인다.', resultType: 'pause' },
      { id: 'B', text: '기도해준 말이 오래 마음에 남아 계속 떠올린다.', resultType: 'bear' },
      { id: 'C', text: '고마운 마음을 바로 표현하고 내 이야기도 더 꺼낸다.', resultType: 'express' },
      { id: 'D', text: '나를 세심하게 봐준 것 같아 그 사람이 더 가깝게 느껴진다.', resultType: 'spring' },
      { id: 'E', text: '기도에 힘을 얻어 다시 잘 해봐야겠다는 마음이 든다.', resultType: 'effort' },
    ],
  },
  {
    id: 15,
    text: '내가 맡았던 봉사가 끝난 뒤, 여러 사람 앞에서 내 이름을 언급하며 고맙다고 칭찬해 주었다.',
    options: [
      { id: 'A', text: '고맙지만 ‘더 잘했어야 했는데’ 하는 아쉬움도 든다.', resultType: 'effort' },
      { id: 'B', text: '기쁜 마음을 숨기지 않고 감사하다고 표현한다.', resultType: 'express' },
      { id: 'C', text: '갑자기 주목받는 게 부담스러워 빨리 넘어갔으면 한다.', resultType: 'pause' },
      { id: 'D', text: '그 한마디를 오래 기억하며 다음 봉사의 힘으로 삼는다.', resultType: 'bear' },
      { id: 'E', text: '사람들에게 집중되어 의식되지만, 섬김을 알아봐줌에 고마워한다.', resultType: 'spring' },
    ],
  },
  {
    id: 16,
    text: '셀에서 요즘 신앙생활을 하며 고민되는 부분을 나누는 시간이 되었다.',
    options: [
      { id: 'A', text: '깊이 고민하다가 마음에 오래 남아 있던 일을 꺼낸다.', resultType: 'bear' },
      { id: 'B', text: '바로 꺼내기 어려워 이야기 꺼내기를 늦춘다.', resultType: 'pause' },
      { id: 'C', text: '어떻게 받아들일지 살피며 이야기할 수 있는 만큼만 나눈다.', resultType: 'spring' },
      { id: 'D', text: '고민과 함께 어떻게 해결할지 나의 계획을 이야기한다.', resultType: 'effort' },
      { id: 'E', text: '요즘 느끼는 마음과 기도가 필요한 부분을 솔직하게 이야기한다.', resultType: 'express' },
    ],
  },
  {
    id: 17,
    text: '많은 사람이 보고 있는 레크리에이션 시간에 예상하지 못하게 내 이름이 불려 앞으로 나가야 한다.',
    options: [
      { id: 'A', text: '갑작스럽지만 분위기를 망치고 싶지 않아 최선을 다한다.', resultType: 'effort' },
      { id: 'B', text: '당황한 마음을 바로 드러내면서도 일단 앞으로 나간다.', resultType: 'express' },
      { id: 'C', text: '잠시 머뭇거리며 천천히 나간다. 끝난 뒤에는 조용한 곳에서 혼자 마음을 가라앉힌다.', resultType: 'pause' },
      { id: 'D', text: '왜 내가 불렸는지, 앞으로 무엇을 하게 될지 여러 생각이 한꺼번에 든다. 끝난 뒤에도 ‘내가 이상했을까?’ 계속 떠올린다.', resultType: 'bear' },
      { id: 'E', text: '사람들이 나를 보고 있다는 것이 신경 쓰여 부담스러워도 웃으며 나간다.', resultType: 'spring' },
    ],
  },
  {
    id: 18,
    text: '수련회 방 배정표를 확인했는데 같은 방 사람들을 한 명도 모른다.',
    options: [
      { id: 'A', text: '어색함이 싫어서 먼저 다가가 인사한다.', resultType: 'express' },
      { id: 'B', text: '조용하면 조용한대로 사람들의 성향을 살피며 맞춰주려고 한다.', resultType: 'spring' },
      { id: 'C', text: '내가 먼저 분위기를 풀지 않으면 계속 어색할 것 같다.', resultType: 'effort' },
      { id: 'D', text: '분위기와 사람들을 관찰하며 언제 말을 걸지 머뭇거린다.', resultType: 'bear' },
      { id: 'E', text: '누군가 먼저 다가올 때까지 혼자 시간을 보낸다.', resultType: 'pause' },
    ],
  },
  {
    id: 19,
    text: '예정된 프로그램이 일찍 끝나 한 시간 이상의 자유시간이 갑자기 생겼다.',
    options: [
      { id: 'A', text: '남은 시간에 할 수 있는 일이나 도울 일이 있는지 찾아본다.', resultType: 'effort' },
      { id: 'B', text: '지금까지의 시간을 천천히 돌아본다.', resultType: 'bear' },
      { id: 'C', text: '함께 있는 사람들이 무엇을 하고 싶은지 먼저 물어보고 그에 맞춘다.', resultType: 'spring' },
      { id: 'D', text: '다같이 무엇을 하고 싶은지 먼저 물어보고 그에 맞춘다.', resultType: 'express' },
      { id: 'E', text: '조용한 곳에서 혼자 쉬거나 산책한다.', resultType: 'pause' },
    ],
  },
  {
    id: 20,
    text: '힘들때, 내게 가장 위로가 되는 말씀구절은?',
    options: [
      { id: 'A', text: '수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라 (마태복음 11:28)', resultType: 'effort' },
      { id: 'B', text: '하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라 (시편 46:1)', resultType: 'pause' },
      { id: 'C', text: '너희는 이전 일을 기억하지 말며 옛날 일을 생각하지 말라 보라 내가 새 일을 행하리니 이제 나타낼 것이라 (이사야 43:18-19)', resultType: 'bear' },
      { id: 'D', text: '내가 보는 것은 사람과 같지 아니하니 사람은 외모를 보거니와 나 여호와는 중심을 보느니라 하시더라 (사무엘상 16:7)', resultType: 'spring' },
      { id: 'E', text: '여호와께서 너희를 위하여 싸우시리니 너희는 가만히 있을지니라 (출애굽기 14:14)', resultType: 'express' },
    ],
  },
] as const satisfies readonly Question[];
