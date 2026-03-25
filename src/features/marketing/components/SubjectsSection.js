import Link from 'next/link';
import { ArrowRight, BookOpen, Clock3, FileText, PlayCircle, Sparkles } from 'lucide-react';
import { subjects, getTotalEstimatedHours, getTotalUnits } from '@/features/content/lib/subjects';
import { getDifficultyLabel } from '@/features/content/lib/contentMetadata';

const categoryDefinitions = {
  law: {
    title: '法律科目',
    description: '憲法、行政法、民法、商法を中心に、本試験の中核を担う法律科目を体系的に学習します。',
    panelClass: 'from-slate-900 via-slate-800 to-slate-700',
  },
  general: {
    title: '一般知識',
    description: '情報通信、個人情報保護、文章理解など、得点安定化に直結する一般知識科目を固めます。',
    panelClass: 'from-emerald-800 via-emerald-700 to-teal-700',
  },
};

function SubjectCard({ subject }) {
  const Icon = subject.icon;
  const lectureUnits = subject.units?.filter((unit) => unit.type === 'lecture') || [];
  const practiceUnits = subject.units?.filter((unit) => unit.type === 'practice') || [];
  const previewUnits = subject.units?.slice(0, 4) || [];

  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${subject.color}`}>
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                {getDifficultyLabel(subject.difficulty)}
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                {subject.units.length}単元
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                約{subject.estimatedHours}時間
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{subject.name}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{subject.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" />
          <span>講義 {lectureUnits.length}本</span>
        </div>
        <div className="flex items-center gap-2">
          <PlayCircle className="h-4 w-4 text-emerald-600" />
          <span>演習 {practiceUnits.length}本</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-amber-600" />
          <span>初回目安 30分</span>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold text-gray-800">代表単元</p>
        <ul className="space-y-2">
          {previewUnits.map((unit) => (
            <li key={unit.id}>
              <Link
                href={`/subjects/${subject.id}/${unit.id}`}
                className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {unit.title}
                </span>
                <span className="text-xs text-gray-400">{unit.type === 'lecture' ? '講義' : '演習'}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/subjects/${subject.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          科目ページへ
          <ArrowRight className="h-4 w-4" />
        </Link>
        {subject.units[0] && (
          <Link
            href={`/subjects/${subject.id}/${subject.units[0].id}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            最初の単元を開く
          </Link>
        )}
      </div>
    </article>
  );
}

export default function SubjectsSection() {
  const groupedCategories = Object.entries(categoryDefinitions)
    .map(([categoryId, meta]) => ({
      ...meta,
      id: categoryId,
      subjects: subjects.filter((subject) => subject.category === categoryId),
    }))
    .filter((category) => category.subjects.length > 0);

  return (
    <section id="subjects" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm ring-1 ring-blue-100">
            <Sparkles className="h-4 w-4" />
            行政書士試験の主要科目を整理済み
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">科目ごとに迷わず進められる学習導線</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            科目単位で単元を束ね、講義と演習のバランスが一目で分かるように整理しています。最初の一単元から、そのまま学習を始められます。
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm text-gray-500">公開科目数</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{subjects.length}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm text-gray-500">公開単元数</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{getTotalUnits()}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm text-gray-500">推定学習時間</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{getTotalEstimatedHours()}h</p>
          </div>
        </div>

        <div className="mt-12 space-y-12">
          {groupedCategories.map((category) => (
            <div key={category.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
              <div className={`rounded-[1.75rem] bg-gradient-to-r px-6 py-6 text-white ${category.panelClass}`}>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/70">{category.title}</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{category.subjects.length}科目を横断して学ぶ</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-white/80">{category.description}</p>
                  </div>
                  <Link
                    href="/subjects"
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
                  >
                    一覧ページへ
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                {category.subjects.map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
          >
            全科目を一覧で見る
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
