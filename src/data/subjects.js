import { Scale, BookOpen, Building, Users, Globe, FileText } from 'lucide-react';

// Subject data for the gyoseishoshi learning system
export const subjects = [
  {
    id: 'constitutional-law',
    name: '憲法',
    description: '日本国憲法の基本原理、人権、統治機構について学習します。行政書士試験の最重要科目の一つです。',
    category: 'law',
    difficulty: 'beginner',
    estimatedHours: 80,
    color: 'bg-blue-600',
    icon: Scale,
    units: [
      { id: '101', title: '憲法の基本原理', type: 'lecture', difficulty: 'beginner' },
      { id: '102', title: '基本的人権の体系', type: 'lecture', difficulty: 'intermediate' },
      { id: '103', title: '精神的自由権', type: 'lecture', difficulty: 'intermediate' },
      { id: '104', title: '身体的自由権', type: 'lecture', difficulty: 'intermediate' },
      { id: '105', title: '社会権', type: 'lecture', difficulty: 'intermediate' },
      { id: '106', title: '参政権と請求権', type: 'lecture', difficulty: 'intermediate' },
      { id: '107', title: '国会の地位と権限', type: 'lecture', difficulty: 'intermediate' },
      { id: '108', title: '内閣制度', type: 'lecture', difficulty: 'intermediate' },
      { id: '109', title: '裁判所の組織と権限', type: 'lecture', difficulty: 'advanced' },
      { id: '110', title: '地方自治と憲法', type: 'lecture', difficulty: 'advanced' },
      { id: '111', title: '憲法改正', type: 'lecture', difficulty: 'advanced' },
      { id: '401', title: '憲法基礎問題演習', type: 'practice', difficulty: 'beginner' }
    ]
  },
  {
    id: 'administrative-law',
    name: '行政法',
    description: '行政法の一般理論、行政手続き、行政不服審査などを学習します。行政書士試験の中心科目です。',
    category: 'law',
    difficulty: 'intermediate',
    estimatedHours: 120,
    color: 'bg-green-600',
    icon: Building,
    units: [
      { id: '201', title: '行政法の基本原理', type: 'lecture', difficulty: 'intermediate' },
      { id: '202', title: '行政行為の概念', type: 'lecture', difficulty: 'intermediate' },
      { id: '203', title: '行政裁量論', type: 'lecture', difficulty: 'intermediate' },
      { id: '204', title: '行政手続き法', type: 'lecture', difficulty: 'intermediate' },
      { id: '205', title: '行政不服審査法', type: 'lecture', difficulty: 'intermediate' },
      { id: '206', title: '行政事件訴訟法', type: 'lecture', difficulty: 'advanced' },
      { id: '207', title: '国家賠償法', type: 'lecture', difficulty: 'advanced' },
      { id: '208', title: '情報公開法', type: 'lecture', difficulty: 'intermediate' },
      { id: '209', title: '個人情報保護法', type: 'lecture', difficulty: 'intermediate' },
      { id: '210', title: '行政組織法', type: 'lecture', difficulty: 'intermediate' },
      { id: '211', title: '公務員法', type: 'lecture', difficulty: 'intermediate' },
      { id: '212', title: '地方自治法', type: 'lecture', difficulty: 'intermediate' },
      { id: '213', title: '地方公務員法', type: 'lecture', difficulty: 'intermediate' },
      { id: '214', title: '行政法総合問題', type: 'practice', difficulty: 'advanced' },
      { id: '215', title: '行政法記述式対策', type: 'practice', difficulty: 'advanced' }
    ]
  },
  {
    id: 'civil-law',
    name: '民法',
    description: '民法総則、物権法、債権法、親族法、相続法の基本原理と制度を学習します。',
    category: 'law',
    difficulty: 'intermediate',
    estimatedHours: 100,
    color: 'bg-purple-600',
    icon: Users,
    units: [
      { id: '301', title: '民法の基本原理', type: 'lecture', difficulty: 'beginner' },
      { id: '302', title: '民法総則・人', type: 'lecture', difficulty: 'beginner' },
      { id: '303', title: '民法総則・物', type: 'lecture', difficulty: 'beginner' },
      { id: '304', title: '民法総則・法律行為', type: 'lecture', difficulty: 'intermediate' },
      { id: '305', title: '意思表示', type: 'lecture', difficulty: 'intermediate' },
      { id: '306', title: '代理制度', type: 'lecture', difficulty: 'intermediate' },
      { id: '307', title: '時効制度', type: 'lecture', difficulty: 'intermediate' },
      { id: '308', title: '物権法総論', type: 'lecture', difficulty: 'intermediate' },
      { id: '309', title: '所有権', type: 'lecture', difficulty: 'intermediate' },
      { id: '310', title: '占有権', type: 'lecture', difficulty: 'intermediate' },
      { id: '311', title: '用益物権', type: 'lecture', difficulty: 'intermediate' },
      { id: '312', title: '担保物権', type: 'lecture', difficulty: 'advanced' },
      { id: '313', title: '債権総論', type: 'lecture', difficulty: 'intermediate' },
      { id: '314', title: '契約各論', type: 'lecture', difficulty: 'intermediate' },
      { id: '315', title: '不法行為', type: 'lecture', difficulty: 'intermediate' },
      { id: '316', title: '親族法', type: 'lecture', difficulty: 'intermediate' },
      { id: '317', title: '相続法', type: 'lecture', difficulty: 'intermediate' },
      { id: '318', title: '民法総合問題', type: 'practice', difficulty: 'advanced' }
    ]
  },
  {
    id: 'commercial-law',
    name: '商法',
    description: '会社法、手形法、保険法の基本的な制度と概念を学習します。',
    category: 'law',
    difficulty: 'intermediate',
    estimatedHours: 60,
    color: 'bg-orange-600',
    icon: Globe,
    units: [
      { id: '501', title: '商法総論', type: 'lecture', difficulty: 'beginner' },
      { id: '502', title: '会社法総論', type: 'lecture', difficulty: 'intermediate' },
      { id: '503', title: '株式会社の設立', type: 'lecture', difficulty: 'intermediate' },
      { id: '504', title: '株式会社の機関', type: 'lecture', difficulty: 'intermediate' },
      { id: '505', title: '株式会社の組織変更', type: 'lecture', difficulty: 'advanced' },
      { id: '506', title: '手形法', type: 'lecture', difficulty: 'intermediate' },
      { id: '507', title: '保険法', type: 'lecture', difficulty: 'intermediate' },
      { id: '508', title: '商法総合問題', type: 'practice', difficulty: 'advanced' }
    ]
  },
  {
    id: 'general-knowledge',
    name: '一般知識等',
    description: '政治・経済・社会、情報通信・個人情報保護、文章理解などの一般知識を学習します。',
    category: 'general',
    difficulty: 'beginner',
    estimatedHours: 40,
    color: 'bg-gray-600',
    icon: FileText,
    units: [
      { id: '601', title: '政治学基礎', type: 'lecture', difficulty: 'beginner' },
      { id: '602', title: '経済学基礎', type: 'lecture', difficulty: 'beginner' },
      { id: '603', title: '社会学基礎', type: 'lecture', difficulty: 'beginner' },
      { id: '604', title: '情報通信技術', type: 'lecture', difficulty: 'beginner' },
      { id: '605', title: '個人情報保護', type: 'lecture', difficulty: 'intermediate' },
      { id: '606', title: '文章理解', type: 'lecture', difficulty: 'beginner' },
      { id: '607', title: '時事関連問題', type: 'lecture', difficulty: 'intermediate' },
      { id: '608', title: '一般知識総合問題', type: 'practice', difficulty: 'intermediate' },
      { id: '609', title: '文章理解対策', type: 'practice', difficulty: 'intermediate' },
      { id: '610', title: '時事問題対策', type: 'practice', difficulty: 'intermediate' }
    ]
  }
];

// Helper functions
export const getSubjectById = (id) => {
  return subjects.find(subject => subject.id === id);
};

export const getSubjectsByCategory = (category) => {
  return subjects.filter(subject => subject.category === category);
};

export const getSubjectsByDifficulty = (difficulty) => {
  return subjects.filter(subject => subject.difficulty === difficulty);
};

export const getTotalEstimatedHours = () => {
  return subjects.reduce((total, subject) => total + subject.estimatedHours, 0);
};

export const getTotalUnits = () => {
  return subjects.reduce((total, subject) => total + (subject.units?.length || 0), 0);
};

export const getSubjectProgress = (subjectId, userProgress) => {
  const subject = getSubjectById(subjectId);
  if (!subject || !userProgress[subjectId]) {
    return {
      completed: 0,
      total: subject?.units?.length || 0,
      percentage: 0,
      score: 0
    };
  }

  const progress = userProgress[subjectId];
  return {
    completed: progress.completed || 0,
    total: progress.total || subject.units.length,
    percentage: progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0,
    score: progress.score || 0
  };
};

export default subjects;
