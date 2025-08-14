const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 既存データをインポート（JSONベースからの移行）
const { subjects } = require('../src/data/subjects');

async function main() {
  console.log('🌱 データベースシード開始...');

  // 1. 科目データの移行
  console.log('📚 科目データを作成中...');
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { id: subject.id },
      update: {
        name: subject.name,
        description: subject.description,
        category: subject.category,
        difficulty: subject.difficulty.toUpperCase(),
        estimatedHours: subject.estimatedHours,
        color: subject.color,
        icon: subject.icon.name || 'BookOpen',
        orderIndex: subjects.indexOf(subject),
        updatedAt: new Date(),
      },
      create: {
        id: subject.id,
        name: subject.name,
        description: subject.description,
        category: subject.category,
        difficulty: subject.difficulty.toUpperCase(),
        estimatedHours: subject.estimatedHours,
        color: subject.color,
        icon: subject.icon.name || 'BookOpen',
        orderIndex: subjects.indexOf(subject),
      },
    });
  }

  // 2. ユニットデータの移行
  console.log('📖 学習ユニットを作成中...');
  const sampleUnits = [
    // 憲法ユニット
    {
      id: '101',
      title: '憲法の基本原理',
      subjectId: 'constitutional-law',
      description: '日本国憲法の三つの基本原理（国民主権、基本的人権の尊重、平和主義）について学習します。',
      type: 'LECTURE',
      difficulty: 'BEGINNER',
      estimatedTime: 30,
      hasAudio: true,
      audioUrl: '/audio/units/101.mp3',
      orderIndex: 1,
      content: {
        introduction: '本章では、日本国憲法の基本原理について学習します。憲法は国家の最高法規であり、三つの基本原理を柱としています。',
        conclusion: '三つの基本原理は相互に関連し合い、日本国憲法の根幹を成しています。これらは憲法解釈の基準となる重要な概念です。',
        keyPoints: [
          '国民主権は憲法の基本原理の一つ',
          '基本的人権は個人の尊厳に基づく',
          '平和主義は戦争放棄を含む',
          '三つの原理は相互に補完し合う関係'
        ],
        sections: [
          {
            title: '国民主権',
            content: '国民主権とは、国家の主権が国民に存することを意味します。明治憲法下では天皇主権でしたが、日本国憲法では国民が主権者となりました。',
            subsections: [
              {
                title: '直接民主制と間接民主制',
                content: '民主政治の形態には直接民主制と間接民主制があります。日本では主に間接民主制（代議制）を採用していますが、国民投票などで直接民主制の要素も見られます。'
              },
              {
                title: '国民主権の具体的表れ',
                content: '選挙権の行使、国民投票への参加、請願権の行使などが国民主権の具体的な表れです。'
              }
            ]
          },
          {
            title: '基本的人権の尊重',
            content: '基本的人権の尊重は、個人の尊厳を基礎とします。人間が生まれながらにして持つ権利として、国家権力によっても侵害されることのない権利を保障します。',
            subsections: [
              {
                title: '基本的人権の特質',
                content: '基本的人権は固有性、不可侵性、普遍性という特質を持ちます。'
              }
            ]
          },
          {
            title: '平和主義',
            content: '日本国憲法は平和主義を基本原理の一つとしています。戦争の放棄、戦力の不保持、交戦権の否認を定めた第9条が中心となります。',
            subsections: [
              {
                title: '憲法第9条の解釈',
                content: '憲法第9条については、自衛権の存否、自衛隊の合憲性などをめぐって様々な解釈があります。'
              }
            ]
          }
        ]
      }
    },
    {
      id: '102',
      title: '基本的人権の体系',
      subjectId: 'constitutional-law',
      description: '基本的人権の分類と各権利の性質について詳しく学習します。',
      type: 'LECTURE',
      difficulty: 'INTERMEDIATE',
      estimatedTime: 45,
      hasAudio: false,
      orderIndex: 2,
      content: {
        introduction: '基本的人権の体系と各権利について学習します。人権は自由権、社会権、参政権、請求権に分類されます。',
        conclusion: '各人権は相互に関連し合い、総合的に個人の尊厳を保障しています。現代においては社会権の重要性が高まっています。',
        keyPoints: [
          '自由権は消極的権利',
          '社会権は積極的権利',
          '両者は対立するものではない',
          '人権は相互に関連し合う'
        ],
        sections: [
          {
            title: '自由権',
            content: '自由権は、国家からの自由を保障する権利です。国家権力の介入を排除することで個人の自由を確保します。',
            subsections: [
              {
                title: '精神的自由',
                content: '思想・良心の自由、信教の自由、表現の自由などが含まれます。民主政治の基盤となる重要な権利です。'
              },
              {
                title: '身体的自由',
                content: '身体の自由、住居の不可侵、通信の秘密などが含まれます。個人の身体と私生活の安全を保障します。'
              },
              {
                title: '経済的自由',
                content: '職業選択の自由、居住・移転の自由、財産権などが含まれます。'
              }
            ]
          },
          {
            title: '社会権',
            content: '社会権は、国家による積極的な保障を求める権利です。実質的な自由と平等を実現するための権利です。',
            subsections: [
              {
                title: '生存権',
                content: '憲法第25条に規定される生存権は、健康で文化的な最低限度の生活を営む権利です。'
              },
              {
                title: '教育を受ける権利',
                content: '憲法第26条に規定される教育を受ける権利は、能力に応じて等しく教育を受ける権利です。'
              },
              {
                title: '勤労の権利',
                content: '憲法第27条に規定される勤労の権利は、働く機会の確保を国家に求める権利です。'
              }
            ]
          }
        ]
      }
    },
    // 行政法ユニット
    {
      id: '201',
      title: '行政法の基本原理',
      subjectId: 'administrative-law',
      description: '行政法の基本的な考え方と法体系について学習します。',
      type: 'LECTURE',
      difficulty: 'INTERMEDIATE',
      estimatedTime: 40,
      hasAudio: true,
      audioUrl: '/audio/units/201.mp3',
      orderIndex: 1,
      content: {
        introduction: '行政法の基本原理について学習します。行政法は現代国家において重要な役割を果たしています。',
        conclusion: '行政法は行政の適法性を確保し、国民の権利保護を図る重要な法分野です。',
        keyPoints: [
          '行政法は公法の一分野',
          '権力関係を規律する',
          '行政の適法性を確保する',
          '国民の権利保護が目的'
        ],
        sections: [
          {
            title: '行政法とは',
            content: '行政法は、行政機関の活動について定めた法律です。行政組織、行政作用、行政救済の三分野に分かれます。',
            subsections: []
          },
          {
            title: '行政法の体系',
            content: '行政組織法と行政作用法に大別されます。行政組織法は行政機関の設置・権限を定め、行政作用法は行政活動の方法を定めます。',
            subsections: []
          }
        ]
      }
    },
    // 民法ユニット
    {
      id: '301',
      title: '民法の基本原理',
      subjectId: 'civil-law',
      description: '民法の基本原理である私的自治の原則について学習します。',
      type: 'LECTURE',
      difficulty: 'BEGINNER',
      estimatedTime: 35,
      hasAudio: false,
      orderIndex: 1,
      content: {
        introduction: '民法の基本原理について学習します。民法は私人間の関係を規律する基本的な法律です。',
        conclusion: '民法の基本原理は現代社会の変化に対応して修正が加えられていますが、根本的な考え方は維持されています。',
        keyPoints: [
          '私的自治は契約自由の基礎',
          '所有権は物権の基本',
          '過失責任主義が原則',
          '信義誠実の原則が重要'
        ],
        sections: [
          {
            title: '私的自治の原則',
            content: '個人が自らの意思で法律関係を決定できる原則です。契約の自由、所有権の自由な処分などがその表れです。',
            subsections: []
          },
          {
            title: '所有権絶対の原則',
            content: '所有権は完全かつ排他的な権利とする原則です。ただし、現代では社会的制約も認められています。',
            subsections: []
          }
        ]
      }
    },
    // 演習ユニット
    {
      id: '401',
      title: '憲法基礎問題演習',
      subjectId: 'constitutional-law',
      description: '憲法の基礎的な理解を確認する演習問題です。',
      type: 'PRACTICE',
      difficulty: 'BEGINNER',
      estimatedTime: 60,
      hasAudio: false,
      orderIndex: 10,
      content: {
        introduction: '憲法の基礎的な問題を通じて理解を深めます。理論と具体例を結びつけて考えることが重要です。',
        conclusion: '基本概念の理解が確実になったら、より発展的な問題に挑戦しましょう。',
        keyPoints: [
          '基本概念の理解が重要',
          '条文の暗記だけでは不十分',
          '具体的事例で考える',
          '判例の理解も必要'
        ],
        sections: [
          {
            title: '選択式問題',
            content: '基本的な知識を確認する選択式問題です。正確な理解が求められます。',
            subsections: []
          },
          {
            title: '記述式問題',
            content: '理解度を深める記述式問題です。論理的な思考力が必要です。',
            subsections: []
          }
        ]
      }
    }
  ];

  for (const unitData of sampleUnits) {
    const { content, ...unit } = unitData;
    
    // Unitを作成
    const createdUnit = await prisma.unit.upsert({
      where: { id: unit.id },
      update: {
        title: unit.title,
        description: unit.description,
        type: unit.type,
        difficulty: unit.difficulty,
        estimatedTime: unit.estimatedTime,
        hasAudio: unit.hasAudio,
        audioUrl: unit.audioUrl,
        orderIndex: unit.orderIndex,
        isPublished: true,
        updatedAt: new Date(),
      },
      create: {
        id: unit.id,
        title: unit.title,
        subjectId: unit.subjectId,
        description: unit.description,
        type: unit.type,
        difficulty: unit.difficulty,
        estimatedTime: unit.estimatedTime,
        hasAudio: unit.hasAudio,
        audioUrl: unit.audioUrl,
        orderIndex: unit.orderIndex,
        isPublished: true,
      },
    });

    // Contentを作成
    if (content) {
      const createdContent = await prisma.content.upsert({
        where: { unitId: unit.id },
        update: {
          introduction: content.introduction,
          conclusion: content.conclusion,
          keyPoints: content.keyPoints,
          updatedAt: new Date(),
        },
        create: {
          unitId: unit.id,
          introduction: content.introduction,
          conclusion: content.conclusion,
          keyPoints: content.keyPoints,
        },
      });

      // Sectionsを作成
      if (content.sections) {
        for (let i = 0; i < content.sections.length; i++) {
          const section = content.sections[i];
          const createdSection = await prisma.contentSection.upsert({
            where: {
              id: `${unit.id}-section-${i + 1}`,
            },
            update: {
              title: section.title,
              content: section.content,
              orderIndex: i + 1,
              updatedAt: new Date(),
            },
            create: {
              id: `${unit.id}-section-${i + 1}`,
              contentId: createdContent.id,
              title: section.title,
              content: section.content,
              orderIndex: i + 1,
            },
          });

          // Subsectionsを作成
          if (section.subsections) {
            for (let j = 0; j < section.subsections.length; j++) {
              const subsection = section.subsections[j];
              await prisma.contentSubsection.upsert({
                where: {
                  id: `${unit.id}-section-${i + 1}-sub-${j + 1}`,
                },
                update: {
                  title: subsection.title,
                  content: subsection.content,
                  orderIndex: j + 1,
                  updatedAt: new Date(),
                },
                create: {
                  id: `${unit.id}-section-${i + 1}-sub-${j + 1}`,
                  sectionId: createdSection.id,
                  title: subsection.title,
                  content: subsection.content,
                  orderIndex: j + 1,
                },
              });
            }
          }
        }
      }
    }
  }

  // 3. テスト用ユーザーの作成
  console.log('👤 テストユーザーを作成中...');
  const bcrypt = require('bcryptjs');
  
  const testUsers = [
    {
      email: 'admin@gyoseishoshi.test',
      username: 'admin',
      password: 'admin123',
      firstName: '管理者',
      lastName: 'テスト',
      role: 'ADMIN',
    },
    {
      email: 'student@gyoseishoshi.test',
      username: 'student',
      password: 'student123',
      firstName: '受験生',
      lastName: 'テスト',
      role: 'STUDENT',
    },
  ];

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 14);
    
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        username: userData.username,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        updatedAt: new Date(),
      },
      create: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      },
    });
  }

  // 4. サンプル進捗データの作成
  console.log('📊 サンプル進捗データを作成中...');
  const student = await prisma.user.findUnique({
    where: { email: 'student@gyoseishoshi.test' },
  });

  if (student) {
    const progressData = [
      { unitId: '101', subjectId: 'constitutional-law', completed: true, score: 85, timeSpent: 25 },
      { unitId: '102', subjectId: 'constitutional-law', completed: false, score: null, timeSpent: 15 },
      { unitId: '201', subjectId: 'administrative-law', completed: true, score: 78, timeSpent: 35 },
    ];

    for (const progress of progressData) {
      await prisma.userProgress.upsert({
        where: {
          userId_unitId: {
            userId: student.id,
            unitId: progress.unitId,
          },
        },
        update: {
          completed: progress.completed,
          score: progress.score,
          timeSpent: progress.timeSpent,
          lastAccessed: new Date(),
          completedAt: progress.completed ? new Date() : null,
          updatedAt: new Date(),
        },
        create: {
          userId: student.id,
          unitId: progress.unitId,
          subjectId: progress.subjectId,
          completed: progress.completed,
          score: progress.score,
          timeSpent: progress.timeSpent,
          lastAccessed: new Date(),
          completedAt: progress.completed ? new Date() : null,
        },
      });
    }
  }

  console.log('✅ データベースシード完了！');
  
  // 統計情報を表示
  const stats = await Promise.all([
    prisma.subject.count(),
    prisma.unit.count(),
    prisma.content.count(),
    prisma.user.count(),
    prisma.userProgress.count(),
  ]);

  console.log('\n📈 シード結果:');
  console.log(`   科目: ${stats[0]}件`);
  console.log(`   ユニット: ${stats[1]}件`);
  console.log(`   コンテンツ: ${stats[2]}件`);
  console.log(`   ユーザー: ${stats[3]}件`);
  console.log(`   進捗データ: ${stats[4]}件\n`);
}

main()
  .catch((e) => {
    console.error('❌ シードエラー:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
