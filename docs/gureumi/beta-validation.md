# 구르미 Beta validation 기록

이 문서는 실제 Beta 데이터가 쌓인 뒤 버전별 검토를 같은 형식으로 남기는 템플릿이다. 결과 비율을 인위적으로 균등화하는 데 사용하지 않는다.

## Release snapshot

- Version: `GUREUMI_BETA_V01`
- Analysis period:
- Sample size:
- First-attempt sample size:
- Completion rate:
- Median completion time:

대표 분포는 기본적으로 `completed + first_attempt + current_version`을 사용한다. 재검사 데이터는 삭제하지 않고 별도 비교군으로 본다.

## Funnel

| Stage | Count | Previous-stage rate | Started rate |
|---|---:|---:|---:|
| Started |  |  | 100% |
| Q9 reached |  |  |  |
| Q18 reached |  |  |  |
| Completed |  |  |  |
| Feedback submitted |  |  |  |

## Question distribution

문항마다 response count, A 매우/조금, B 조금/매우 비율, average score, average response time, 해당 문항 직후 이탈을 기록한다.

| Question | Count | A very | A little | B little | B very | Avg score | Avg response ms | Note |
|---|---:|---:|---:|---:|---:|---:|---:|---|
|  |  |  |  |  |  |  |  |  |

같은 축 문항 간 응답이 함께 움직이는지 검토하되, Beta 데이터만으로 정식 심리검사의 신뢰도나 타당도를 주장하지 않는다.

## Axis distribution

| Axis | LOW | HIGH | Score distribution summary | Boundary ratio |
|---|---:|---:|---|---:|
| NOVELTY |  |  |  |  |
| WORRY |  |  |  |  |
| RELATION |  |  |  |  |

`21–22`와 `23–24`를 각각 LOW/HIGH 결과는 유지한 채 near-boundary로 집계한다.

## Result distribution

| Result | Count | Ratio |
|---|---:|---:|
| 아롱이 |  |  |
| 달몽이 |  |  |
| 후우 |  |  |
| 쨍이 |  |  |
| 촉촉이 |  |  |
| 몽실이 |  |  |
| 찌릿이 |  |  |
| 포근이 |  |  |

## Feedback distribution

전체와 결과 유형별 평균 만족도 및 1–4 rating 분포를 기록한다.

| Result | Count | Avg rating | 1 | 2 | 3 | 4 |
|---|---:|---:|---:|---:|---:|---:|
|  |  |  |  |  |  |  |

## Revision log

- Questions under review:
- Questions replaced:
- Reason for revision:
- Evidence used:
- Decision date:
- Next version:

문항 문구, 선택지, 축, 채점 방향 또는 문항 구성이 바뀌면 기존 데이터에 덮어쓰지 않고 새 test version을 만든다. 진행 중 attempt는 시작한 version을 끝까지 유지한다.
