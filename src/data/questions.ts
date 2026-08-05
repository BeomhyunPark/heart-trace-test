import type { Question } from '../domain/types';

export const QUESTION_SOURCE = {
  documentId: '1-35-57d5TKdNZOC0-aCS2_JGg7wo6Ndwn9ZXLTo2Pa0',
  tabId: 't.gp9cfhyqeusg',
} as const;

export const QUESTIONS = [
  {
    id: 1,
    text: '팀플에서 내 나름대로 고민한 의견을 이야기했지만, 별다른 이유 없이 다른 의견으로 결정되었다.',
    options: [
      { id: 'A', text: '설명이 부족했는지, 의견에 부족한 점이 있었는지 여러 가능성을 분석한다.', resultType: 'bear' },
      { id: 'B', text: '다음에는 의견을 내기 전에 분위기를 더 살피려 한다.', resultType: 'spring' },
      { id: 'C', text: '준비를 충분히 하지 못한 탓이라고 생각하며 아쉬워하며, 다음엔 더 잘 전달하려 한다.', resultType: 'effort' },
      { id: 'D', text: '당장은 아쉬운 마음에서 거리를 두고, 다른 일에 집중하며 생각을 환기한다.', resultType: 'pause' },
      { id: 'E', text: '결정 과정이 납득되지 않아 그 자리에서 이유를 묻는다.', resultType: 'express' },
    ],
  },
  {
    id: 2,
    text: '해본 적 없는 중요한 프로젝트를 갑자기 맡게 되었다. 준비 기간도 짧고 주변의 기대도 큰 상황이다.',
    options: [
      { id: 'A', text: '부담이 커 선뜻 시작하지 못하고, 잠시 머리를 환기시킨다.', resultType: 'pause' },
      { id: 'B', text: '잘 해낼 수 있을지 걱정하며 준비해야 할 것들을 계속 생각한다.', resultType: 'bear' },
      { id: 'C', text: '인력이 부족하다고 도움을 요청하면서, 필요한 일부터 착수한다.', resultType: 'express' },
      { id: 'D', text: '실제로는 많이 부담되지만 불안한 기색을 보이지 않으려 한다.', resultType: 'spring' },
      { id: 'E', text: '부담이 크더라도 어떻게든 잘 해내고자 하는 마음에 애쓴다.', resultType: 'effort' },
    ],
  },
  {
    id: 3,
    text: '열심히 마무리한 일에 대해 아쉬운 피드백을 들었다. 대화는 끝났지만 그 말이 마음에 남아 있다.',
    options: [
      { id: 'A', text: '납득하기 어려운 부분이 있으면 그 자리에서 바로 이야기한다.', resultType: 'express' },
      { id: 'B', text: '부족했던 부분을 돌아보며 스스로에게 더 높은 기준을 세운다.', resultType: 'effort' },
      { id: 'C', text: '피드백을 다시 생각하기 부담스러워 일단 다른 일에 집중한다.', resultType: 'pause' },
      { id: 'D', text: '상대의 말이 어떤 의미였는지, 어떤 부분이 부족했는지 계속 곱씹는다.', resultType: 'bear' },
      { id: 'E', text: '다른 사람들에게도 부족한 모습이 드러난 것 같아 괜히 창피해진다.', resultType: 'spring' },
    ],
  },
  {
    id: 4,
    text: '함께 일하는 사람이 나보다 너무 느려서 계속 호흡이 맞지 않는다.',
    options: [
      { id: 'A', text: '바로 재촉하기보다 잠시 상황을 지켜보며 내 할 일에 집중한다.', resultType: 'pause' },
      { id: 'B', text: '상대에게도 이유가 있을 거라 생각하며 상대를 이해하려 한다.', resultType: 'bear' },
      { id: 'C', text: '답답한 마음을 내색하지 않고 상대의 속도에 맞춰준다.', resultType: 'spring' },
      { id: 'D', text: '일이 계속 늦어져 기한 내에 못 끝낼거 같으면 동료에게 속도를 맞춰달라고 직접 말한다.', resultType: 'express' },
      { id: 'E', text: '일이 늦어지지 않도록 부족한 부분도 대신 처리하려 한다.', resultType: 'effort' },
    ],
  },
  {
    id: 5,
    text: '활발하게 대화하던 단톡방에 내가 메시지를 보낸 뒤 갑자기 대화가 끊겼다.',
    options: [
      { id: 'A', text: '앞뒤 대화를 다시 읽으며 왜 갑자기 조용해졌는지 생각한다.', resultType: 'bear' },
      { id: 'B', text: '계속 휴대폰을 확인하지만 먼저 다시 보내는건 망설여져 기다린다.', resultType: 'spring' },
      { id: 'C', text: '내가 분위기를 끊은 것 같아 다른 이야기를 꺼내며 분위기를 풀어보려 한다.', resultType: 'effort' },
      { id: 'D', text: '지금은 다들 답할 상황이 아닌가 보다 생각하고 휴대폰을 내려놓는다.', resultType: 'pause' },
      { id: 'E', text: '같이 조용히 있기보다 직접 나서서 적막을 깬다.', resultType: 'express' },
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
    text: '같은 일을 두고 며칠째 기도하고 있지만 상황도 마음도 쉽게 정리되지 않는다.',
    options: [
      { id: 'A', text: '주변사람들이 걱정할까봐 괜찮은 척하며 마음을 감춘다.', resultType: 'spring' },
      { id: 'B', text: '자신을 먼저 돌아보며, 내가 놓친 것이 무엇이 있나 살펴본다.', resultType: 'effort' },
      { id: 'C', text: '억지로 답을 찾기보다 잠시 조용히 머물며 마음이 가라앉기를 기다린다.', resultType: 'pause' },
      { id: 'D', text: '하나님께서 무엇을 말씀하시는지 지금까지의 상황을 되짚어본다.', resultType: 'bear' },
      { id: 'E', text: '왜 마음이 정리되지 않는지 솔직하게 털어놓으며 기도한다.', resultType: 'express' },
    ],
  },
  {
    id: 11,
    text: '예배에서 들은 한 구절이 예배가 끝난 뒤에도 계속 생각난다.',
    options: [
      { id: 'A', text: '마음에 와닿은 말씀과 은혜를 주변 사람들에게 나눈다.', resultType: 'express' },
      { id: 'B', text: '말씀대로 살아가기 위해 내가 실천할 수 있는 일을 찾아본다.', resultType: 'effort' },
      { id: 'C', text: '말씀을 조용히 간직하며 천천히 마음에 새긴다.', resultType: 'pause' },
      { id: 'D', text: '이 말씀이 왜 지금 내게 남았는지 그 의미를 깊이 묵상한다.', resultType: 'bear' },
      { id: 'E', text: '말씀을 다른 사람들은 어떻게 받아들였을지 궁금해진다.', resultType: 'spring' },
    ],
  },
  {
    id: 12,
    text: '예배 직전에 사람이 부족하다며 예상하지 못한 봉사를 부탁 받았다.',
    options: [
      { id: 'A', text: '이 봉사가 공동체에 어떤 의미가 있을지 생각하며 기꺼이 참여한다.', resultType: 'bear' },
      { id: 'B', text: '함께하는 사람들과 분위기를 살피며 필요한 곳을 돕는다.', resultType: 'spring' },
      { id: 'C', text: '필요한 역할과 상황을 바로 물어보고, 할 수 있는지 분명하게 답한다.', resultType: 'express' },
      { id: 'D', text: '맡은 역할을 잘 해내기 위해 필요한 것을 꼼꼼히 준비한다.', resultType: 'effort' },
      { id: 'E', text: '내가 편안하게 감당할 수 있는 역할부터 차분히 참여한다.', resultType: 'pause' },
    ],
  },
  {
    id: 13,
    text: '공동체 모임에 처음 온 것 같은 사람이 대화에 끼지 못한 채 혼자 앉아 있다.',
    options: [
      { id: 'A', text: '‘외롭지 않을까?’ ‘내가 가면 부담스러울까?’ 고민하며 살핀다.', resultType: 'bear' },
      { id: 'B', text: '먼저 다가가 이름을 묻고 편하게 대화를 시작한다.', resultType: 'express' },
      { id: 'C', text: '상대의 표정과 분위기를 살피며 부담스럽지 않게 말을 건넨다.', resultType: 'spring' },
      { id: 'D', text: '혼자 어색하지 않도록 옆에서 대화를 이어가려고 애쓴다.', resultType: 'effort' },
      { id: 'E', text: '신경은 쓰이지만 쉽게 다가가지 못한다.', resultType: 'pause' },
    ],
  },
  {
    id: 14,
    text: '내가 자세히 말하지 않았는데도 누군가 내 상황을 위해 진심으로 기도해 주었다.',
    options: [
      { id: 'A', text: '기도받는 동안 마음이 편안해지고 위로를 얻는다.', resultType: 'pause' },
      { id: 'B', text: '그 기도를 오래 기억하며 힘들 때 다시 떠올리기도 한다.', resultType: 'bear' },
      { id: 'C', text: '고마운 마음을 바로 표현하고, 기도받으며 느낀 마음도 솔직하게 나눈다.', resultType: 'express' },
      { id: 'D', text: '나를 생각해준 마음이 고마워 그 사람과 한층 더 가까워진 느낌을 받는다.', resultType: 'spring' },
      { id: 'E', text: '받은 기도가 힘이 되어 나도 누군가를 위해 기도해야겠다고 생각한다.', resultType: 'effort' },
    ],
  },
  {
    id: 15,
    text: '별다른 기대 없이 했던 일에 대해 누군가 찾아와 진심으로 고맙다고 말했다.',
    options: [
      { id: 'A', text: '“제가 더 잘했어야 했는데요.”라며 다음번에도 더 잘하겠다고 고맙다고 말한다.', resultType: 'effort' },
      { id: 'B', text: '고맙다고 바로 답하며 나도 함께해서 좋았다고 솔직하게 표현한다.', resultType: 'express' },
      { id: 'C', text: '작은 일이었지만 누군가에게 의미가 되었다는 사실을 조용히 마음에 담아둔다.', resultType: 'pause' },
      { id: 'D', text: '그 한마디를 오래 기억하며 다음 봉사의 힘으로 삼는다.', resultType: 'bear' },
      { id: 'E', text: '칭찬받는 것이 민망해하지만, 섬김을 알아봐준 마음이 고마워 더 따뜻한 마음이 든다.', resultType: 'spring' },
    ],
  },
  {
    id: 16,
    text: '셀에서 요즘 신앙생활을 하며 고민되는 부분을 나누는 시간이 되었다.',
    options: [
      { id: 'A', text: '어떤 이야기를 나눌지 생각하다가 마음에 오래 남아 있던 일을 꺼낸다.', resultType: 'bear' },
      { id: 'B', text: '바로 꺼내기 어려워 다른 사람들의 이야기를 먼저 들으며 천천히 마음을 연다.', resultType: 'pause' },
      { id: 'C', text: '사람들이 어떻게 받아들일지 살피며 이야기할 수 있는 만큼만 나눈다.', resultType: 'spring' },
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
      { id: 'A', text: '같은 방 사람들에게 먼저 인사한다.', resultType: 'express' },
      { id: 'B', text: '사람들의 분위기와 성향을 살피며 모두가 편안하도록 맞춰주려고 한다.', resultType: 'spring' },
      { id: 'C', text: '내가 먼저 분위기를 풀지 않으면 계속 어색할 것 같아 괜히 책임감을 느낀다.', resultType: 'effort' },
      { id: 'D', text: '분위기와 사람들을 관찰해보고, 천천히 진심 어린 대화로 가까워진다.', resultType: 'bear' },
      { id: 'E', text: '낯선 사람들과 함께 지내는 것이 부담스러워 방에 들어가기 전부터 긴장된다.', resultType: 'pause' },
    ],
  },
  {
    id: 19,
    text: '예정된 프로그램이 일찍 끝나 한 시간 이상의 자유시간이 갑자기 생겼다.',
    options: [
      { id: 'A', text: '남은 시간에 할 수 있는 일이나 도울 일이 있는지 찾아본다.', resultType: 'effort' },
      { id: 'B', text: '시끌벅적하게 시간을 보내기보다 지금까지의 시간을 천천히 돌아본다.', resultType: 'bear' },
      { id: 'C', text: '함께 있는 사람들이 무엇을 하고 싶은지 먼저 물어보고 그에 맞춘다.', resultType: 'spring' },
      { id: 'D', text: '자유시간이 생겨 좋다고 표현하며 하고 싶은 일을 제안한다.', resultType: 'express' },
      { id: 'E', text: '조용한 곳에서 혼자 쉬거나 산책하며 몸과 마음의 속도를 늦춘다.', resultType: 'pause' },
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
