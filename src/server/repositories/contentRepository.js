import fs from 'fs';
import path from 'path';
import { subjects, getSubjectById } from '@/features/content/lib/subjects';
import { CONTENT_HTML_TEMPLATE, CONTENT_MARKDOWN_TEMPLATE } from '@/features/content/lib/contentMetadata';
import { parseHtmlContentDocument } from '@/features/content/lib/htmlUtils';
import { extractMarkdownSections, extractMarkdownSummary } from '@/features/content/lib/markdownUtils';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'units');

function ensureDirectory() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

function getMarkdownPath(id) {
  return path.join(CONTENT_DIR, `${id}.md`);
}

function getMetaPath(id) {
  return path.join(CONTENT_DIR, `${id}.meta.json`);
}

function getHtmlPath(id) {
  return path.join(CONTENT_DIR, `${id}.html`);
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readTextIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, 'utf8');
}

function buildDefaultMarkdown(unit) {
  return CONTENT_MARKDOWN_TEMPLATE.replace('# タイトル', `# ${unit.title}`);
}

function buildDefaultHtml(unit) {
  return CONTENT_HTML_TEMPLATE.replace('<title>タイトル</title>', `<title>${unit.title}</title>`);
}

function normalizeAssetPath(assetPath) {
  if (!assetPath) {
    return null;
  }

  return assetPath.startsWith('/') ? assetPath : `/${assetPath.replace(/\\/g, '/')}`;
}

function getSeedAccessLevel(unit, index) {
  if (unit.type === 'practice') {
    return 'premium';
  }

  if (index < 2 || unit.difficulty === 'beginner') {
    return 'free';
  }

  return 'premium';
}

function getSeedEstimatedTime(unit) {
  if (unit.type === 'practice') {
    return 20;
  }

  if (unit.difficulty === 'advanced') {
    return 45;
  }

  if (unit.difficulty === 'intermediate') {
    return 35;
  }

  return 25;
}

function buildSeedMap() {
  const map = new Map();

  subjects.forEach((subject) => {
    subject.units.forEach((unit, index) => {
      map.set(unit.id, {
        id: unit.id,
        title: unit.title,
        subjectId: subject.id,
        difficulty: unit.difficulty,
        type: unit.type,
        estimatedTime: getSeedEstimatedTime(unit),
        accessLevel: getSeedAccessLevel(unit, index),
        status: 'published',
        hasAudio: false,
        hasPdf: false,
        audioUrl: null,
        pdfUrl: null,
        createdAt: null,
        updatedAt: null,
      });
    });
  });

  return map;
}

function sortUnits(units) {
  return [...units].sort((left, right) =>
    String(left.id).localeCompare(String(right.id), 'ja', { numeric: true })
  );
}

class ContentRepository {
  constructor() {
    ensureDirectory();
    this.seedMap = buildSeedMap();
  }

  getAllUnitIds() {
    ensureDirectory();
    const ids = new Set(this.seedMap.keys());

    fs.readdirSync(CONTENT_DIR).forEach((fileName) => {
      if (fileName.endsWith('.meta.json')) {
        ids.add(fileName.replace(/\.meta\.json$/, ''));
      }
    });

    return [...ids];
  }

  buildUnitRecord(id) {
    const seed = this.seedMap.get(id) || {
      id,
      title: `新規単元 ${id}`,
      subjectId: subjects[0]?.id || '',
      difficulty: 'beginner',
      type: 'lecture',
      estimatedTime: 30,
      accessLevel: 'free',
      status: 'draft',
      hasAudio: false,
      hasPdf: false,
      audioUrl: null,
      pdfUrl: null,
      createdAt: null,
      updatedAt: null,
    };

    const meta = readJsonIfExists(getMetaPath(id));
    const contentFormat = meta?.contentFormat === 'html' ? 'html' : 'markdown';
    const rawContent = contentFormat === 'html'
      ? ((meta ? readTextIfExists(getHtmlPath(id)) : null) ?? buildDefaultHtml({ ...seed, ...(meta || {}) }))
      : ((meta ? meta.markdown ?? readTextIfExists(getMarkdownPath(id)) : null) ?? buildDefaultMarkdown({ ...seed, ...(meta || {}) }));

    const unit = {
      ...seed,
      ...(meta || {}),
      id,
      contentFormat,
      audioUrl: normalizeAssetPath(meta?.audioUrl || seed.audioUrl),
      pdfUrl: normalizeAssetPath(meta?.pdfUrl || seed.pdfUrl),
    };

    unit.hasAudio = Boolean(unit.audioUrl || unit.hasAudio);
    unit.hasPdf = Boolean(unit.pdfUrl || unit.hasPdf);
    unit.content = contentFormat === 'html'
      ? {
          ...parseHtmlContentDocument(rawContent),
          raw: rawContent,
        }
      : {
          markdown: rawContent,
          sections: extractMarkdownSections(rawContent),
          summary: extractMarkdownSummary(rawContent),
          raw: rawContent,
        };

    return unit;
  }

  getUnit(id, options = {}) {
    const unit = this.buildUnitRecord(id);
    if (!unit) {
      return null;
    }

    if (!options.includeDraft && unit.status !== 'published') {
      return null;
    }

    const relatedUnits = this.listUnits({ subjectId: unit.subjectId }, { includeDraft: options.includeDraft }).units
      .filter((candidate) => candidate.id !== unit.id)
      .slice(0, 5)
      .map((candidate) => ({
        id: candidate.id,
        title: candidate.title,
        type: candidate.type,
        difficulty: candidate.difficulty,
        estimatedTime: candidate.estimatedTime,
        accessLevel: candidate.accessLevel,
      }));

    return {
      ...unit,
      relatedUnits,
    };
  }

  listUnits(filters = {}, options = {}) {
    const includeDraft = options.includeDraft ?? false;
    const limit = options.limit ? Number(options.limit) : undefined;
    const page = options.page ? Number(options.page) : 1;

    let units = this.getAllUnitIds()
      .map((id) => this.buildUnitRecord(id))
      .filter(Boolean)
      .filter((unit) => includeDraft || unit.status === 'published');

    if (filters.subjectId) {
      units = units.filter((unit) => unit.subjectId === filters.subjectId);
    }

    if (filters.type) {
      units = units.filter((unit) => unit.type === filters.type);
    }

    if (filters.difficulty) {
      units = units.filter((unit) => unit.difficulty === filters.difficulty);
    }

    if (filters.accessLevel) {
      units = units.filter((unit) => unit.accessLevel === filters.accessLevel);
    }

    if (filters.status) {
      units = units.filter((unit) => unit.status === filters.status);
    }

    units = sortUnits(units);

    const total = units.length;
    const effectiveLimit = limit || total || 1;
    const totalPages = Math.max(1, Math.ceil(total / effectiveLimit));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * effectiveLimit;
    const pagedUnits = limit ? units.slice(start, start + effectiveLimit) : units;

    return {
      units: pagedUnits,
      pagination: {
        page: currentPage,
        limit: effectiveLimit,
        total,
        totalPages,
      },
    };
  }

  searchUnits({ query, type, subjectId, limit = 10 }, options = {}) {
    const normalizedQuery = query.trim().toLowerCase();
    return this.listUnits({ type, subjectId }, { includeDraft: options.includeDraft }).units
      .map((unit) => {
        const haystack = [unit.title, unit.subjectId, unit.content.summary, unit.markdown].join(' ').toLowerCase();
        const score = haystack.includes(normalizedQuery)
          ? (unit.title.toLowerCase().includes(normalizedQuery) ? 3 : 1)
          : 0;
        return { unit, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, Number(limit))
      .map(({ unit }) => ({
        id: unit.id,
        title: unit.title,
        subjectId: unit.subjectId,
        type: unit.type,
        difficulty: unit.difficulty,
        estimatedTime: unit.estimatedTime,
        accessLevel: unit.accessLevel,
        status: unit.status,
        hasAudio: unit.hasAudio,
        hasPdf: unit.hasPdf,
        snippet: unit.content.summary,
      }));
  }

  generateUnitId(subjectId) {
    const prefix = subjectId ? subjectId.split('-')[0] : 'unit';
    return `${prefix}-${Date.now()}`;
  }

  saveUnit(input) {
    ensureDirectory();
    const now = new Date().toISOString();
    const id = input.id || this.generateUnitId(input.subjectId);
    const existing = readJsonIfExists(getMetaPath(id));
    const subject = getSubjectById(input.subjectId);
    const contentFormat = input.contentFormat === 'html' ? 'html' : 'markdown';

    const meta = {
      id,
      title: input.title,
      subjectId: input.subjectId,
      type: input.type,
      difficulty: input.difficulty,
      estimatedTime: Number(input.estimatedTime) || 30,
      accessLevel: input.accessLevel || 'free',
      status: input.status || 'draft',
      contentFormat,
      audioUrl: normalizeAssetPath(input.audioUrl),
      pdfUrl: normalizeAssetPath(input.pdfUrl),
      hasAudio: Boolean(input.audioUrl),
      hasPdf: Boolean(input.pdfUrl),
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      subjectName: subject?.name || null,
    };

    fs.writeFileSync(getMetaPath(id), JSON.stringify(meta, null, 2));
    if (contentFormat === 'html') {
      fs.writeFileSync(getHtmlPath(id), input.content || input.html || buildDefaultHtml(meta));
      if (fs.existsSync(getMarkdownPath(id))) {
        fs.unlinkSync(getMarkdownPath(id));
      }
    } else {
      fs.writeFileSync(getMarkdownPath(id), input.content || input.markdown || buildDefaultMarkdown(meta));
      if (fs.existsSync(getHtmlPath(id))) {
        fs.unlinkSync(getHtmlPath(id));
      }
    }

    return this.getUnit(id, { includeDraft: true });
  }

  deleteUnit(id) {
    const markdownPath = getMarkdownPath(id);
    const htmlPath = getHtmlPath(id);
    const metaPath = getMetaPath(id);

    if (fs.existsSync(markdownPath)) {
      fs.unlinkSync(markdownPath);
    }

    if (fs.existsSync(htmlPath)) {
      fs.unlinkSync(htmlPath);
    }

    if (fs.existsSync(metaPath)) {
      fs.unlinkSync(metaPath);
    }

    return true;
  }
}

const contentRepository = new ContentRepository();

export default contentRepository;
