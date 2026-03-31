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

export const ACCESS_LEVEL_OPTIONS = [
  { value: 'free', label: '無料公開' },
  { value: 'premium', label: 'プレミアム限定' },
];

export const STATUS_OPTIONS = [
  { value: 'published', label: '公開中' },
  { value: 'draft', label: '下書き' },
];

export const CONTENT_FORMAT_OPTIONS = [
  { value: 'markdown', label: 'Markdown' },
  { value: 'html', label: 'HTML' },
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

export const ACCESS_LEVEL_BADGE_CLASSES = {
  free: 'bg-emerald-100 text-emerald-700',
  premium: 'bg-amber-100 text-amber-700',
};

export const STATUS_BADGE_CLASSES = {
  published: 'bg-blue-100 text-blue-700',
  draft: 'bg-gray-100 text-gray-700',
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

export const CONTENT_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>タイトル</title>
  <style>
    body {
      font-family: 'Hiragino Sans', 'Yu Gothic', Meiryo, sans-serif;
      background: #f8fafc;
      color: #1f2937;
      line-height: 1.75;
      margin: 0;
      padding: 24px;
    }

    .page-wrapper {
      max-width: 960px;
      margin: 0 auto;
    }

    .section {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
    }
  </style>
</head>
<body>
  <div class="page-wrapper">
    <section class="section">
      <h2>概要</h2>
      <p>HTMLコンテンツをここに記述します。</p>
    </section>
  </div>
</body>
</html>
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

export function getAccessLevelLabel(accessLevel) {
  return accessLevel === 'premium' ? 'プレミアム限定' : '無料公開';
}

export function getStatusLabel(status) {
  return status === 'draft' ? '下書き' : '公開中';
}

export function getContentFormatLabel(contentFormat) {
  return contentFormat === 'html' ? 'HTML' : 'Markdown';
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
    accessLevel: 'free',
    status: 'draft',
    contentFormat: 'markdown',
    content: CONTENT_MARKDOWN_TEMPLATE,
    keyPoints: [''],
    hasAudio: false,
    hasPdf: false,
    audioFile: null,
    pdfFile: null,
    htmlFile: null,
  };
}

export function unitToEditorFormData(unit) {
  return {
    title: unit?.title || '',
    subjectId: unit?.subjectId || subjects[0]?.id || '',
    type: unit?.type || 'lecture',
    difficulty: unit?.difficulty || 'beginner',
    estimatedTime: unit?.estimatedTime || 30,
    accessLevel: unit?.accessLevel || 'free',
    status: unit?.status || 'draft',
    contentFormat: unit?.contentFormat || 'markdown',
    content: unit?.contentFormat === 'html'
      ? (unit?.content?.raw || CONTENT_HTML_TEMPLATE.replace('<title>タイトル</title>', `<title>${unit?.title || 'タイトル'}</title>`))
      : (unit?.content?.markdown || unitContentToMarkdown(unit?.content, unit?.title || 'タイトル')),
    keyPoints: unit?.content?.keyPoints?.length ? [...unit.content.keyPoints] : [''],
    hasAudio: Boolean(unit?.hasAudio),
    hasPdf: Boolean(unit?.hasPdf),
    audioFile: null,
    pdfFile: null,
    htmlFile: null,
  };
}
