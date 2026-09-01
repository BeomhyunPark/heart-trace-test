import type { PickerMode } from './types';

export type PickerModeDefinition = {
  id: PickerMode;
  icon: string;
  title: string;
  shortcutLabel: string;
  action: string;
  drawing: string;
};

export const PICKER_MODES: readonly PickerModeDefinition[] = [
  {
    id: 'prayer',
    icon: '✦',
    title: '기도할 사람',
    shortcutLabel: '기도할 사람',
    action: '기도할 사람 정하기',
    drawing: '기도할 사람을 정하고 있어요',
  },
  {
    id: 'sharing',
    icon: '1',
    title: '먼저 나눌 사람',
    shortcutLabel: '나눔 순서',
    action: '나눔 순서 정하기',
    drawing: '나눔 순서를 섞고 있어요',
  },
  {
    id: 'lottery',
    icon: '✓',
    title: '제비뽑기',
    shortcutLabel: '제비',
    action: '제비뽑기 시작',
    drawing: '제비를 섞고 있어요',
  },
  {
    id: 'ladder',
    icon: '↘',
    title: '사다리 타기',
    shortcutLabel: '사다리',
    action: '사다리 만들기',
    drawing: '사다리를 놓고 있어요',
  },
  {
    id: 'groups',
    icon: '#',
    title: '나눔 조 짜기',
    shortcutLabel: '조 편성',
    action: '나눔 조 편성하기',
    drawing: '나눔 조를 나누고 있어요',
  },
  {
    id: 'pairs',
    icon: '1:1',
    title: '원투원 짝 정하기',
    shortcutLabel: '원투원',
    action: '원투원 짝 정하기',
    drawing: '원투원 짝을 정하고 있어요',
  },
  {
    id: 'supporter',
    icon: '♡',
    title: '이번 주 기도 후원자',
    shortcutLabel: '기도 후원',
    action: '기도 후원자 정하기',
    drawing: '이번 주 기도 후원자를 정하고 있어요',
  },
] as const;

const PICKER_SHORTCUT_ORDER: readonly PickerMode[] = [
  'ladder',
  'lottery',
  'prayer',
  'sharing',
  'groups',
  'pairs',
  'supporter',
];

export const PICKER_SHORTCUTS: readonly PickerModeDefinition[] = PICKER_SHORTCUT_ORDER.map(
  (mode) => PICKER_MODES.find(({ id }) => id === mode) ?? PICKER_MODES[0],
);

const PICKER_MODE_IDS = new Set<PickerMode>(PICKER_MODES.map(({ id }) => id));

export function isPickerMode(value: unknown): value is PickerMode {
  return typeof value === 'string' && PICKER_MODE_IDS.has(value as PickerMode);
}

export function getPickerModeDefinition(mode: PickerMode): PickerModeDefinition {
  return PICKER_MODES.find(({ id }) => id === mode) ?? PICKER_MODES[0];
}
