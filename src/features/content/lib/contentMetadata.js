import { subjects } from './subjects';

export const CONTENT_TYPE_OPTIONS = [
  { value: 'lecture', label: '講義' },
  { value: 'practice', label: '演習' },
];

export const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' },
];

export const CONTENT_TYPE_LABELS = Object.fromEntries(
  CONTENT_TYPE_OPTIONS.map((option) => [option.value, option.label])
);

export const DIFFICULTY_LABELS = Object.fromEntries(
  DIFFICULTY_OPTIONS.map((option) => [option.value, option.label])
);

export const CONTENT_TYPE_BADGE_CLASSES = {
  lecture: 'bg-blue-100 text-blue-700',
  practice: 'bg-purple-100 text-purple-700',
};

export const DIFFICULTY_BADGE_CLASSES = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export const CONTENT_MARKDOWN_TEMPLATE = `# タイトル

## 概要

この単元では...について学習します。

## 学習内容

### セクション1

内容を記述...

### セクション2

内容を記述...

## ポイント

- ポイント1
- ポイント2
- ポイント3

## まとめ

この単元のまとめを記述...
`;

export function getSubjectOptions({ includeAll = false, allLabel = 'すべての科目' } = {}) {
  const options = subjects.map((subject) => ({
    value: subject.id,
    label: subject.name,
  }));

  return includeAll ? [{ value: '', label: allLabel }, ...options] : options;
}

export function getSubjectName(subjectId) {
  return subjects.find((subject) => subject.id === subjectId)?.name || subjectId;
}

export function getTypeLabel(type) {
  return CONTENT_TYPE_LABELS[type] || type;
}

export function getDifficultyLabel(difficulty) {
  return DIFFICULTY_LABELS[difficulty] || difficulty;
}

export function unitContentToMarkdown(content = {}, title = 'タイトル') {
  const sections = [`# ${title}`];

  if (content.introduction) {
    sections.push('## 概要', content.introduction);
  }

  if (content.sections?.length) {
    sections.push('## 学習内容');

    content.sections.forEach((section) => {
      if (!section?.title) {
        return;
      }

      sections.push(`### ${section.title}`);

      if (section.content) {
        sections.push(section.content);
      }

      section.subsections?.forEach((subsection) => {
        if (!subsection?.title) {
          return;
        }

        sections.push(`#### ${subsection.title}`);

        if (subsection.content) {
          sections.push(subsection.content);
        }
      });
    });
  }

  if (content.keyPoints?.length) {
    sections.push('## ポイント');
    content.keyPoints.forEach((point) => {
      sections.push(`- ${point}`);
    });
  }

  if (content.conclusion) {
    sections.push('## まとめ', content.conclusion);
  }

  return sections.filter(Boolean).join('\n\n');
}

export function createEmptyContentFormData() {
  return {
    title: '',
    subjectId: subjects[0]?.id || '',
    type: 'lecture',
    difficulty: 'beginner',
    estimatedTime: 30,
    content: CONTENT_MARKDOWN_TEMPLATE,
    keyPoints: [''],
    hasAudio: false,
    hasPdf: false,
    audioFile: null,
    pdfFile: null,
  };
}

export function unitToEditorFormData(unit) {
  return {
    title: unit?.title || '',
    subjectId: unit?.subjectId || subjects[0]?.id || '',
    type: unit?.type || 'lecture',
    difficulty: unit?.difficulty || 'beginner',
    estimatedTime: unit?.estimatedTime || 30,
    content: unit?.content?.markdown || unitContentToMarkdown(unit?.content, unit?.title || 'タイトル'),
    keyPoints: unit?.content?.keyPoints?.length ? [...unit.content.keyPoints] : [''],
    hasAudio: Boolean(unit?.hasAudio),
    hasPdf: Boolean(unit?.hasPdf),
    audioFile: null,
    pdfFile: null,
  };
}
