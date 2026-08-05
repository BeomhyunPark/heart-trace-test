import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { QUESTIONS, QUESTION_SOURCE } from '../src/data/questions';

const VERIFIED_GOOGLE_DOCS_SOURCE = {
  title: '26여수 아이스브레이킹',
  documentId: '1-35-57d5TKdNZOC0-aCS2_JGg7wo6Ndwn9ZXLTo2Pa0',
  tabId: 't.gp9cfhyqeusg',
  revisionId: 'AIroW37om6LHOLFqNRoRRchXdUVRWnD6qweRcW0Sh7bev868hz3TvIqra5eUDm7lBE25SwlnqMI3lFyuV8cjmw',
  verifiedAt: '2026-08-05',
  questionCount: 20,
  optionCount: 100,
  sha256: 'a6eb33f970da3c157d5e78c37c9aeb4895585038a4e608cd7a3700dce3052f60',
} as const;

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function createCanonicalQuestions() {
  return QUESTIONS.map((question) => ({
    id: question.id,
    text: normalizeText(question.text),
    options: question.options.map((option) => ({
      id: option.id,
      text: normalizeText(option.text),
      resultType: option.resultType,
    })),
  }));
}

describe('Google Docs 질문 원문 잠금', () => {
  it('검증한 문서와 탭을 데이터 출처로 사용한다', () => {
    expect(QUESTION_SOURCE).toEqual({
      documentId: VERIFIED_GOOGLE_DOCS_SOURCE.documentId,
      tabId: VERIFIED_GOOGLE_DOCS_SOURCE.tabId,
    });
  });

  it('검증된 20문항·100선택지·매핑 내용과 일치한다', () => {
    const canonicalQuestions = createCanonicalQuestions();
    const optionCount = canonicalQuestions.reduce(
      (total, question) => total + question.options.length,
      0,
    );
    const digest = createHash('sha256')
      .update(JSON.stringify(canonicalQuestions))
      .digest('hex');

    expect(canonicalQuestions).toHaveLength(VERIFIED_GOOGLE_DOCS_SOURCE.questionCount);
    expect(optionCount).toBe(VERIFIED_GOOGLE_DOCS_SOURCE.optionCount);
    expect(digest).toBe(VERIFIED_GOOGLE_DOCS_SOURCE.sha256);
  });
});
