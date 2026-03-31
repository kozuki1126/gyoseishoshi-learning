import { Users, Scale, Building, Globe, BookOpen, FileText } from 'lucide-react';

// Subject data for the gyoseishoshi learning system
export const subjects = [
  {
    "id": "civil-law",
    "name": "民法",
    "description": "民法総則、物権、債権、親族、相続と最新改正を学習します。",
    "category": "law",
    "difficulty": "intermediate",
    "estimatedHours": 110,
    "color": "bg-purple-600",
    "icon": Users,
    "units": [
      {
        "id": "101",
        "title": "民法の基本原則（私的自治の原則、権利濫用の禁止等）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "102",
        "title": "自然人の権利能力（始期と終期、失踪宣告）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "103",
        "title": "法人（法人の種類と設立、法人の権利能力と行為能力、法人の組織）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "104",
        "title": "制限行為能力者制度（未成年者、成年被後見人・被保佐人・被補助人）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "105",
        "title": "意思表示の構成要素（効果意思と表示行為、内心の意思と表示の不一致）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "106",
        "title": "意思表示の瑕疵（心裡留保、通謀虚偽表示、錯誤、詐欺・強迫）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "107",
        "title": "代理（代理権の発生原因、代理行為の要件と効果、無権代理と相手方の保護、表見代理）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "108",
        "title": "無効と取消し（無効と取消しの区別、取り消しうる行為の追認）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "109",
        "title": "条件と期限",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "110",
        "title": "時効制度（取得時効、消滅時効、時効の援用と完成猶予・更新）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "111",
        "title": "物権変動（不動産物権変動における対抗要件、動産物権変動における対抗要件、公信の原則）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "112",
        "title": "占有権（占有の態様と占有権の効力、占有の訴え）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "113",
        "title": "所有権（所有権の制限、共有関係）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "114",
        "title": "用益物権（地上権、永小作権、地役権）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "115",
        "title": "担保物権総論（担保物権の共通原則、物的担保と人的担保の区別）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "116",
        "title": "担保物権各論（留置権、先取特権、質権、抵当権、根抵当権、非典型担保）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "117",
        "title": "債権の目的（特定物債権と種類債権、選択債権）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "118",
        "title": "債権の効力（履行の強制、債務不履行、履行遅滞・履行不能・不完全履行、損害賠償）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "119",
        "title": "債権の消滅（弁済、相殺、更改、免除、混同）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "120",
        "title": "多数当事者の債権関係（分割債権・分割債務、不可分債権・不可分債務、連帯債務、保証債務）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "121",
        "title": "債権譲渡と債務引受（債権譲渡の対抗要件、債務引受）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "122",
        "title": "債権者代位権（民法423条）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "123",
        "title": "詐害行為取消権（民法424条）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "124",
        "title": "契約の成立（申込と承諾、契約の解釈）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "125",
        "title": "契約の効力（同時履行の抗弁権、危険負担）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "126",
        "title": "契約の解除（解除の要件、解除の効果）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "127",
        "title": "売買契約（手付、契約不適合責任）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "128",
        "title": "贈与契約",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "129",
        "title": "消費貸借契約・使用貸借契約",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "130",
        "title": "賃貸借契約（賃貸借の成立と効力、賃貸借の終了、借地借家法の基本）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "131",
        "title": "雇用契約・請負契約・委任契約",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "132",
        "title": "寄託契約・組合契約",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "133",
        "title": "和解契約",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "134",
        "title": "不当利得（不当利得の要件と効果、不当利得の類型）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "135",
        "title": "不法行為（一般不法行為の成立要件、特殊不法行為、共同不法行為）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "136",
        "title": "婚姻（婚姻の成立要件、婚姻の効力、離婚の方法と効果）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "137",
        "title": "親子（実親子関係の成立、養親子関係の成立）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "138",
        "title": "親権（親権の内容、親権の制限）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "139",
        "title": "扶養",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "140",
        "title": "相続人と相続分（法定相続人と相続順位、法定相続分、遺言による相続分の指定）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "141",
        "title": "相続の効力（相続の一般的効力、相続財産の範囲、共同相続における権利義務の承継）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "142",
        "title": "相続の承認と放棄（単純承認・限定承認・相続放棄、相続放棄の効果）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "143",
        "title": "遺産分割（遺産分割の方法、遺産分割の効果）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "144",
        "title": "遺言（遺言の方式、遺言の効力、遺言の執行）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "145",
        "title": "遺留分（遺留分権利者と遺留分の割合、遺留分侵害額請求）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "146",
        "title": "2020年施行の民法改正（債権法改正）のポイント（時効制度の見直し、法定利率の変更、保証制度の見直し等）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "147",
        "title": "2022年施行の成年年齢引下げに関する改正（成年年齢の18歳への引下げと影響）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "148",
        "title": "2023年施行の物権・相続法等改正――所有者不明土地対策・共有ルールの見直し・財産管理制度の創設",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "149",
        "title": "相続土地国庫帰属法（2023年4月施行）――制度の目的、承認申請の要件、負担金）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "constitutional-law",
    "name": "憲法",
    "description": "憲法の基本原理、人権、統治機構と最新論点を学習します。",
    "category": "law",
    "difficulty": "beginner",
    "estimatedHours": 80,
    "color": "bg-blue-600",
    "icon": Scale,
    "units": [
      {
        "id": "201",
        "title": "憲法の基本原理（国民主権の原理、平和主義、基本的人権の尊重）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "202",
        "title": "天皇の地位と権能",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "203",
        "title": "憲法改正手続",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "204",
        "title": "基本的人権総論（人権の享有主体、私人間における人権保障、公共の福祉による人権制限）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "205",
        "title": "包括的基本権と法の下の平等（幸福追求権、プライバシー権の今日的展開、法の下の平等）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "206",
        "title": "精神的自由権（思想・良心の自由、信教の自由、政教分離原則、学問の自由）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "207",
        "title": "表現の自由（表現の自由の優越的地位、知る権利、報道の自由、検閲の禁止）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "208",
        "title": "経済的自由権（職業選択の自由、財産権）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "209",
        "title": "人身の自由（適正手続の保障、不当な逮捕・抑留の禁止、住居の不可侵）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "210",
        "title": "社会権（生存権の法的性格、教育を受ける権利、勤労の権利、労働基本権）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "211",
        "title": "参政権と請求権（選挙権・被選挙権、請願権、裁判を受ける権利、国家賠償請求権、刑事補償請求権）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "212",
        "title": "国会（国会の地位と権能、国会の組織、国会の活動）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "213",
        "title": "内閣（議院内閣制、内閣の組織と権能、内閣総理大臣の権限）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "214",
        "title": "裁判所（司法権の独立、裁判所の組織、違憲審査制、司法権の限界・統治行為論）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "215",
        "title": "財政（財政民主主義、租税法律主義）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "216",
        "title": "地方自治（地方自治の本旨、地方公共団体の組織・権能）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "217",
        "title": "新しい人権の最新動向（同性婚と憲法24条・14条の解釈、忘れられる権利、環境権等）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "administrative-law-general",
    "name": "行政法の一般的な法理論",
    "description": "行政法総論、行政行為、裁量、行政立法などの基礎法理を学習します。",
    "category": "law",
    "difficulty": "intermediate",
    "estimatedHours": 55,
    "color": "bg-green-600",
    "icon": Building,
    "units": [
      {
        "id": "301",
        "title": "行政法の法源（成文法源と不文法源、法律・政令・省令・条例・規則）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "302",
        "title": "法の一般原則（法律による行政の原理、平等原則、比例原則、信頼保護の原則）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "303",
        "title": "行政上の法律関係（行政法関係と私法関係の区別、特別権力関係論）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "304",
        "title": "行政主体と行政機関（行政主体の種類、行政組織法の基本原則）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "305",
        "title": "行政立法（1）（法規命令、委任立法の限界）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "306",
        "title": "行政立法（2）（行政規則、通達）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "307",
        "title": "行政行為の概念（公定力、不可変更力、不可争力）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "308",
        "title": "行政行為の種類（申請に対する処分と職権による処分、授益的処分と侵害的処分、羈束行為と裁量行為）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "309",
        "title": "行政行為の瑕疵（無効と取消しの区別、瑕疵の治癒と転換）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "310",
        "title": "行政行為の取消しと撤回（職権取消しと撤回の違い、撤回の限界）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "311",
        "title": "行政裁量（裁量権の範囲、裁量権の逸脱・濫用）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "312",
        "title": "行政指導（行政指導の概念と限界、行政指導と行政強制の区別）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "313",
        "title": "行政契約（行政契約の種類、行政契約の特色）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "314",
        "title": "行政計画（行政計画の法的性質、行政計画の策定手続）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "315",
        "title": "行政上の義務履行確保（行政上の強制執行、行政罰、執行罰と秩序罰）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "administrative-procedure-law",
    "name": "行政手続法",
    "description": "申請処分、不利益処分、行政指導、届出、意見公募手続を学習します。",
    "category": "law",
    "difficulty": "intermediate",
    "estimatedHours": 28,
    "color": "bg-emerald-600",
    "icon": Building,
    "units": [
      {
        "id": "401",
        "title": "行政手続法の目的と適用範囲（行政手続法の目的、適用除外）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "402",
        "title": "申請に対する処分（審査基準の設定と公表、標準処理期間、補正の機会の付与）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "403",
        "title": "不利益処分（処分基準の設定と公表、聴聞と弁明の機会の付与、理由の提示）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "404",
        "title": "聴聞手続（聴聞の主宰者、聴聞の手続、聴聞調書と報告書）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "405",
        "title": "行政指導の手続（行政指導の方式、複数の者を対象とする行政指導）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "406",
        "title": "届出の手続（届出の効力発生時期、形式上の要件審査）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "407",
        "title": "意見公募手続（パブリックコメント）（命令等制定機関の義務、意見公募手続の特例）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "408",
        "title": "行政手続のデジタル化対応（情報通信技術を活用した行政手続の推進、オンライン申請）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "administrative-appeal-law",
    "name": "行政不服審査法",
    "description": "審査請求、審理手続、裁決、再調査の請求などを学習します。",
    "category": "law",
    "difficulty": "intermediate",
    "estimatedHours": 20,
    "color": "bg-teal-600",
    "icon": Building,
    "units": [
      {
        "id": "501",
        "title": "行政不服審査制度の目的と対象（目的と対象、処分庁と審査庁）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "502",
        "title": "審査請求（審査請求期間、審査請求の対象、審査請求の方法）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "503",
        "title": "審理手続（審理員による審理、審査請求人の権利・義務、口頭意見陳述、審理関係人の参加）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "504",
        "title": "審理手続の終結と裁決（審理員意見書の提出、行政不服審査会への諮問、裁決の種類と効力）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "505",
        "title": "再調査の請求・再審査請求（審査請求との関係、申立て先・期間・効力）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "administrative-litigation-law",
    "name": "行政事件訴訟法",
    "description": "取消訴訟を中心に、各種行政訴訟と仮の救済制度を学習します。",
    "category": "law",
    "difficulty": "advanced",
    "estimatedHours": 40,
    "color": "bg-cyan-700",
    "icon": Building,
    "units": [
      {
        "id": "601",
        "title": "行政事件訴訟の類型（抗告訴訟の種類、当事者訴訟、民衆訴訟、機関訴訟）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "602",
        "title": "取消訴訟の訴訟要件（1）（処分性、原告適格）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "603",
        "title": "取消訴訟の訴訟要件（2）（狭義の訴えの利益、出訴期間、不服申立前置）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "604",
        "title": "取消訴訟の審理（職権審理主義の意義と限界、事情判決の法理）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "605",
        "title": "取消判決の効力（形成力、拘束力、対世効）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "606",
        "title": "執行停止（執行停止の要件、裁判所の権限）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "607",
        "title": "無効等確認訴訟（無効確認訴訟の原告適格、無効確認訴訟と取消訴訟の関係）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "608",
        "title": "不作為の違法確認訴訟（不作為の違法確認訴訟の要件、義務付け訴訟との関係）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "609",
        "title": "義務付け訴訟（申請型義務付け訴訟、非申請型義務付け訴訟、仮の義務付け）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "610",
        "title": "差止訴訟（差止訴訟の要件、仮の差止め）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "611",
        "title": "当事者訴訟（実質的当事者訴訟、形式的当事者訴訟）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "612",
        "title": "民衆訴訟と機関訴訟（住民訴訟、選挙訴訟）",
        "type": "lecture",
        "difficulty": "advanced"
      }
    ]
  },
  {
    "id": "state-redress-law",
    "name": "国家賠償法・損失補償",
    "description": "国家賠償責任と損失補償の要件・効果を学習します。",
    "category": "law",
    "difficulty": "advanced",
    "estimatedHours": 16,
    "color": "bg-sky-700",
    "icon": Building,
    "units": [
      {
        "id": "701",
        "title": "国家賠償法1条の賠償責任（公務員の故意・過失、職務行為関連性、求償権）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "702",
        "title": "国家賠償法2条の賠償責任（公の営造物の設置管理の瑕疵、2条責任の性質）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "703",
        "title": "損失補償の要件と内容（特別の犠牲、正当な補償の内容）",
        "type": "lecture",
        "difficulty": "advanced"
      }
    ]
  },
  {
    "id": "local-autonomy-law",
    "name": "地方自治法",
    "description": "地方自治の本旨、機関、条例、住民訴訟などを学習します。",
    "category": "law",
    "difficulty": "intermediate",
    "estimatedHours": 32,
    "color": "bg-lime-700",
    "icon": Building,
    "units": [
      {
        "id": "801",
        "title": "地方自治の本旨（団体自治と住民自治、地方分権改革）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "802",
        "title": "地方公共団体の種類（普通地方公共団体、特別地方公共団体）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "803",
        "title": "地方公共団体の事務（自治事務と法定受託事務、関与の法定主義）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "804",
        "title": "地方公共団体の機関（1）（長と議会の関係、二元代表制）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "805",
        "title": "地方公共団体の機関（2）（執行機関の多元主義、附属機関）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "806",
        "title": "条例と規則（条例の制定、条例制定権の限界、規則）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "807",
        "title": "住民の権利（1）（直接請求制度、住民投票）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "808",
        "title": "住民の権利（2）（住民監査請求、住民訴訟）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "809",
        "title": "地方自治とデジタル化（地方公共団体の情報化推進、行政手続のオンライン化）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "commercial-law",
    "name": "商法",
    "description": "商人、商行為、有価証券、運送、保険、海商を学習します。",
    "category": "law",
    "difficulty": "intermediate",
    "estimatedHours": 30,
    "color": "bg-orange-600",
    "icon": Globe,
    "units": [
      {
        "id": "901",
        "title": "商法の基本概念（商人概念、商行為概念）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "902",
        "title": "商人の営業（商号、営業の譲渡、商業登記）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "903",
        "title": "商業使用人（支配人、その他の使用人）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "904",
        "title": "商行為通則（善管注意義務、報酬請求権）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "905",
        "title": "商事売買（商事売買の特則）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "906",
        "title": "有価証券（有価証券の意義、指図証券・記名証券・無記名証券）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "907",
        "title": "商行為の代理通則（表見支配人、代理商）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "908",
        "title": "運送営業（陸上運送・海上運送・航空運送、旅客運送と物品運送）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "909",
        "title": "保険（保険契約の要素、損害保険と生命保険）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "910",
        "title": "海商（海商法の特色、海難救助・共同海損）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "company-law",
    "name": "会社法",
    "description": "株式会社を中心に、機関設計、計算、組織再編、持分会社を学習します。",
    "category": "law",
    "difficulty": "intermediate",
    "estimatedHours": 65,
    "color": "bg-amber-600",
    "icon": Globe,
    "units": [
      {
        "id": "1001",
        "title": "会社法総則（会社の種類、会社の商号、会社の使用人）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1002",
        "title": "株式会社の設立（発起設立と募集設立、定款の記載事項、払込みの仮装）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1003",
        "title": "株式（株式の意義、株式の譲渡制限、自己株式の取得）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1004",
        "title": "株主の権利義務（株主平等の原則、株主の権利の種類、株主代表訴訟）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1005",
        "title": "株式会社の機関設計（機関設計の選択肢、会社規模と必要機関）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1006",
        "title": "株主総会（株主総会の権限、株主総会の招集、株主総会の決議方法）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1007",
        "title": "取締役・取締役会（取締役の資格と選任、取締役会の権限、代表取締役）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1008",
        "title": "監査役・監査役会（監査役の権限、監査役会）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1009",
        "title": "会計参与・会計監査人（会計参与、会計監査人）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1010",
        "title": "指名委員会等設置会社・監査等委員会設置会社（指名委員会等設置会社の特徴、監査等委員会設置会社の特徴）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1011",
        "title": "株式会社の計算（計算書類、資本金と準備金、剰余金の配当）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1012",
        "title": "定款変更（定款変更の手続、特別決議事項）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1013",
        "title": "事業譲渡等（事業譲渡、株式交換・株式移転）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1014",
        "title": "組織再編（合併、会社分割、株式交換・株式移転）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1015",
        "title": "解散・清算（解散事由、清算手続）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1016",
        "title": "持分会社（合名会社、合資会社、合同会社）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1017",
        "title": "2021年施行の会社法改正ポイント（株主総会資料の電子提供制度、社外取締役の義務化、社債管理補助者の創設）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1018",
        "title": "株主総会のデジタル化（バーチャル株主総会の実務、ハイブリッド型開催の要件）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "basic-jurisprudence",
    "name": "基礎法学",
    "description": "法の概念、分類、解釈、適用、効力を学習します。",
    "category": "general",
    "difficulty": "beginner",
    "estimatedHours": 18,
    "color": "bg-stone-600",
    "icon": BookOpen,
    "units": [
      {
        "id": "1101",
        "title": "法の概念（法と道徳の区別、法の存在形式）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1102",
        "title": "法の分類（公法と私法、実体法と手続法、一般法と特別法）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1103",
        "title": "法の解釈（1）（法解釈の方法、文理解釈・論理解釈・目的解釈）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1104",
        "title": "法の解釈（2）（拡張解釈・縮小解釈、類推解釈・反対解釈）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1105",
        "title": "法の適用（三段論法、要件事実）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1106",
        "title": "法の効力（時間的効力、場所的効力、対人的効力）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1107",
        "title": "法の変動（立法・改正・廃止、慣習法の成立と消滅）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1108",
        "title": "法と裁判（法源としての判例、裁判制度の基本）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "personal-information-protection-law",
    "name": "個人情報保護法",
    "description": "個人情報保護法の基本構造、第三者提供、改正法対応を学習します。",
    "category": "general",
    "difficulty": "intermediate",
    "estimatedHours": 24,
    "color": "bg-slate-600",
    "icon": FileText,
    "units": [
      {
        "id": "1201",
        "title": "個人情報保護法の目的と基本理念（個人情報保護の意義、個人情報の有用性との調和）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1202",
        "title": "個人情報保護法の適用範囲（個人情報取扱事業者、適用除外）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1203",
        "title": "個人情報の取得（適正取得、取得時の利用目的の通知等）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1204",
        "title": "個人情報の管理（正確性の確保、安全管理措置、従業者・委託先の監督）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1205",
        "title": "個人データの第三者提供（原則と例外、オプトアウト、外国にある第三者への提供）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1206",
        "title": "保有個人データに関する義務（開示請求、訂正等、利用停止等）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1207",
        "title": "個人情報保護委員会（委員会の権限、監督・命令）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1208",
        "title": "令和3年改正法の要点（法律の一元化・官民一元化、個人情報の域外適用強化、罰則強化）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1209",
        "title": "令和4年4月全面施行の重要ポイント（漏えい等の報告義務、不正取得情報の提供制限、保有個人データの開示方法の拡大）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1210",
        "title": "デジタル社会における個人情報保護（情報銀行、匿名加工情報・仮名加工情報の活用、AIと個人データ）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "gyoseishoshi-law",
    "name": "行政書士法",
    "description": "行政書士制度、登録、業務範囲、義務、懲戒、最新改正を学習します。",
    "category": "practical",
    "difficulty": "beginner",
    "estimatedHours": 24,
    "color": "bg-indigo-600",
    "icon": FileText,
    "units": [
      {
        "id": "1301",
        "title": "行政書士法の目的（行政書士制度の意義、業務の適正化と国民の利便性）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1302",
        "title": "行政書士の資格（欠格事由、資格要件）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1303",
        "title": "行政書士の登録（登録制度、登録拒否事由）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1304",
        "title": "行政書士の業務（1）（書類の作成、提出手続の代行）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1305",
        "title": "行政書士の業務（2）（相談業務、事実証明に関する書類の作成）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1306",
        "title": "行政書士の業務（3）（法定業務、独占業務と非独占業務、特定行政書士の権限）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1307",
        "title": "行政書士の義務（誠実義務、秘密保持義務、帳簿の備付け、依頼に関する報酬の制限）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1308",
        "title": "行政書士会と連合会（行政書士会の設立と加入義務、日本行政書士会連合会）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1309",
        "title": "行政書士に対する懲戒処分（懲戒事由、懲戒の種類、懲戒手続）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1310",
        "title": "行政書士法の関連規定（業務範囲規制、非行政書士の取締り）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1311",
        "title": "令和元年・令和3年・令和5年改正のポイント（書面・押印・対面規制の見直し、電子申請対応、特定行政書士制度の拡充）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1312",
        "title": "行政書士のデジタル社会対応業務（電子申請の実務、電子証明書・電子署名の活用、マイナポータル連携）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "family-register-law",
    "name": "戸籍法",
    "description": "戸籍制度、各種届出、戸籍訂正、公開、最新改正を学習します。",
    "category": "practical",
    "difficulty": "intermediate",
    "estimatedHours": 28,
    "color": "bg-rose-600",
    "icon": FileText,
    "units": [
      {
        "id": "1401",
        "title": "戸籍制度の意義（戸籍の沿革、戸籍の公証機能）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1402",
        "title": "戸籍の編製（戸籍簿の編製単位、身分事項の記載）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1403",
        "title": "戸籍事務の管掌（市区町村長の権限、法務局の監督）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1404",
        "title": "届出の総則（届出義務者、届出期間、届出の方式）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1405",
        "title": "出生届（届出義務者、届出期間、届出事項）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1406",
        "title": "婚姻届・離婚届（婚姻届の方式と効力、離婚届の方式と効力）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1407",
        "title": "認知届・養子縁組届（認知届の要件と効果、養子縁組届の要件と効果）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1408",
        "title": "死亡届・失踪届（死亡届の届出義務者、失踪届と失踪宣告）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1409",
        "title": "戸籍の訂正（戸籍訂正の方法、法定訂正と許可訂正）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1410",
        "title": "戸籍の公開（戸籍謄抄本の交付請求、戸籍記載事項証明書）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1411",
        "title": "就籍と除籍（就籍の手続、除籍の事由と効果）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1412",
        "title": "令和6年戸籍法改正のポイント（戸籍の広域交付の拡大、婚前氏続称の範囲拡大、氏の変更許可要件の緩和）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "resident-register-law",
    "name": "住民基本台帳法",
    "description": "住民票、マイナンバー、マイナポータルと住基制度を学習します。",
    "category": "practical",
    "difficulty": "intermediate",
    "estimatedHours": 24,
    "color": "bg-fuchsia-600",
    "icon": FileText,
    "units": [
      {
        "id": "1501",
        "title": "住民基本台帳制度の意義（住民基本台帳の目的、他の公証制度との関係）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1502",
        "title": "住民基本台帳の編製（世帯単位の編製、住民票コード）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1503",
        "title": "住民票の記載事項（必須事項、選択的記載事項）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1504",
        "title": "住民基本台帳の記録手続（1）（転入届、転居届）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1505",
        "title": "住民基本台帳の記録手続（2）（転出届、世帯変更届）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1506",
        "title": "住民票の写し等の交付手続（住民票の写しの交付請求、広域交付住民票）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1507",
        "title": "マイナンバー制度（1）（マイナンバーの意義、個人番号カード）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1508",
        "title": "マイナンバー制度（2）（マイナンバーの利用範囲、情報提供ネットワークシステム）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1509",
        "title": "マイナンバーカードの利便性向上策（健康保険証との一体化、運転免許証との一体化）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1510",
        "title": "マイナポータルと行政手続のデジタル化（ワンストップサービス、プッシュ型サービス）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1511",
        "title": "令和5～6年改正の重要ポイント（マイナ保険証への完全移行、住民記録システムの標準化・共通化）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "digital-society-law",
    "name": "デジタル社会形成基本法・関連法",
    "description": "デジタル社会形成基本法、デジタル庁、電子署名法などを学習します。",
    "category": "general",
    "difficulty": "intermediate",
    "estimatedHours": 16,
    "color": "bg-zinc-700",
    "icon": Globe,
    "units": [
      {
        "id": "1601",
        "title": "デジタル社会形成基本法の目的と基本理念（令和3年施行、デジタル社会の形成に関する基本原則）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1602",
        "title": "デジタル庁の設置と権限（デジタル社会の司令塔としての役割、重点計画の策定）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1603",
        "title": "デジタル社会の形成に関する施策（デジタル格差の是正、データ利活用、GovTechの推進）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1604",
        "title": "電子署名法・電子帳簿保存法の概要（電子署名の法的効力、電子帳簿保存の要件）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1605",
        "title": "情報通信技術を活用した行政の推進等に関する法律（デジタル手続法）の概要",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "immigration-law",
    "name": "出入国管理及び難民認定法",
    "description": "在留資格、特定技能、育成就労、難民認定制度を学習します。",
    "category": "practical",
    "difficulty": "intermediate",
    "estimatedHours": 18,
    "color": "bg-red-700",
    "icon": Globe,
    "units": [
      {
        "id": "1701",
        "title": "在留資格制度（在留資格の種類と許可基準）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1702",
        "title": "特定技能制度（特定技能1号・2号の導入と運用）",
        "type": "lecture",
        "difficulty": "beginner"
      },
      {
        "id": "1703",
        "title": "育成就労制度（2024年改正）――技能実習制度からの移行、制度目的の転換、行政書士の実務上の関与",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1704",
        "title": "難民認定制度（難民の認定手続、補完的保護対象者制度）",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1705",
        "title": "外国人の受入れと共生社会（多文化共生施策、外国人材確保に係る最新政策動向、行政書士の役割）",
        "type": "lecture",
        "difficulty": "intermediate"
      }
    ]
  },
  {
    "id": "important-precedents",
    "name": "重要判例学習",
    "description": "各科目横断で重要判例の事実、争点、判旨、試験頻出ポイントを学習します。",
    "category": "law",
    "difficulty": "advanced",
    "estimatedHours": 70,
    "color": "bg-gray-800",
    "icon": BookOpen,
    "units": [
      {
        "id": "1801",
        "title": "◎ 虚偽表示と第三者の善意（最判昭44.5.27）――民法94条2項「第三者」の範囲",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1802",
        "title": "◎ 表見代理の成立要件（最判昭41.6.12）――権限外の行為の表見代理と相手方の信頼",
        "type": "lecture",
        "difficulty": "intermediate"
      },
      {
        "id": "1803",
        "title": "◎ 無権代理と相続（最判昭37.4.8）――無権代理人が本人を相続した場合の追認拒絶の可否",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1804",
        "title": "◎ 動機の錯誤（最判平28.12.19）――錯誤の要件としての動機の表示、改正民法との連続性",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1805",
        "title": "〇 動産の即時取得（最判平18.2.23）――占有の喪失と即時取得の成否",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1806",
        "title": "◎ 抵当権と法定地上権（最判昭52.10.31）――法定地上権の成立要件（土地・建物の所有者同一性）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1807",
        "title": "〇 共有物の保存行為と変更行為（最判平9.7.1）――各共有者が単独でできる行為の範囲",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1808",
        "title": "〇 債務不履行の帰責事由（最判昭56.2.16）――不可抗力の判断基準",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1809",
        "title": "〇 債権譲渡と抗弁の対抗（最判平9.11.11）――債務者は譲受人に対して譲渡人への弁済を主張できるか",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1810",
        "title": "〇 連帯保証と催告の抗弁（最判平7.6.23）――連帯保証人への請求と保証人の権利",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1811",
        "title": "〇 同時履行の抗弁権の援用（最判昭33.6.14）――当事者が主張しない限り裁判所は考慮できない",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1812",
        "title": "△ 売主の担保責任・瑕疵担保（最判昭37.4.20）――改正前民法との比較・契約不適合責任との連続学習",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1813",
        "title": "△ 請負契約における瑕疵修補と損害賠償（最判平14.9.24）――修補に代わる損害賠償の要件",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1814",
        "title": "〇 不法行為の相当因果関係（最判平11.2.25）――損害の範囲と相当性判断",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1815",
        "title": "◎ 預金債権の共同相続（最大決平28.12.19）――共同相続された預金債権は遺産分割の対象（判例変更）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1816",
        "title": "〇 遺産分割と相続債務の承継（最判平21.3.24）――分割協議の効力と債権者への対抗",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1817",
        "title": "◎ 婚外子法定相続分規定の違憲（最大決平25.9.4）――法の下の平等と立法不作為",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1818",
        "title": "◎ マクリーン事件（最大判昭53.10.4）――外国人の人権享有主体性・政治活動の自由",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1819",
        "title": "◎ 薬事法違憲判決（最大判昭50.4.30）――職業選択の自由・規制目的二分論",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1820",
        "title": "◎ 猿払事件（最大判昭49.11.6）――公務員の政治活動制限・合理的関連性の基準",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1821",
        "title": "◎ 尊属殺重罰規定違憲判決（最大判昭48.4.4）――法の下の平等・違憲審査の手法",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1822",
        "title": "〇 森林法共有林分割制限違憲判決（最大判昭62.4.22）――財産権の制限と公共の福祉",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1823",
        "title": "◎ 朝日訴訟（最大判昭42.5.24）――生存権の法的性格（プログラム規定説）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1824",
        "title": "〇 堀木訴訟（最大判昭57.7.7）――社会権の法的性格と立法裁量の広さ",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1825",
        "title": "◎ 議員定数不均衡訴訟（最大判昭51.4.14）――投票価値の平等・違憲状態の認定",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1826",
        "title": "◎ 砂川事件（最大判昭34.12.16）――統治行為論・安全保障条約の司法審査限界",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1827",
        "title": "〇 国籍法違憲判決（最大判平20.6.4）――法の下の平等・立法目的と手段の合理的関連性",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1828",
        "title": "◎ 夫婦別姓訴訟（最大判令3.6.23）――民法750条と憲法24条・14条の解釈",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1829",
        "title": "〇 再婚禁止期間一部違憲判決（最大判平27.12.16）――民法733条の一部違憲判断・立法裁量",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1830",
        "title": "◎ GPS捜査事件（最大判平29.3.15）――令状なしGPS捜査の違法性・プライバシー権の現代的展開",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1831",
        "title": "〇 愛媛玉串料訴訟（最大判平9.4.2）――政教分離原則・目的効果基準の適用",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1832",
        "title": "◎ 在外邦人最高裁国民審査権訴訟（最大判令4.5.25）――在外国民の審査権制限の違憲性",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1833",
        "title": "◎ 日光太郎杉事件（東京高判昭48.7.13）――裁量権の逸脱・濫用、考慮事項の適正性",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1834",
        "title": "◎ 個人タクシー事件（最判昭46.10.28）――申請に対する処分・手続的適正の要請",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1835",
        "title": "〇 公立中学校教諭分限免職事件（最判昭48.9.14）――裁量権の広狭・司法審査の範囲",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1836",
        "title": "〇 伊方原発訴訟（最判平4.10.29）――高度技術的裁量と司法審査の在り方",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1837",
        "title": "△ 横浜市保育所民営化判決（最判平21.11.26）――廃止条例の処分性・住民の法的保護",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1838",
        "title": "◎ 理由提示の法的効果（最判昭38.5.31）――理由提示の欠缺と処分の効力",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1839",
        "title": "◎ 理由付記の程度（最判昭60.1.22）――記載の具体性・特定性の基準",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1840",
        "title": "◎ 不服申立ての利益（最判昭51.3.10）――処分の効果消滅後の審査請求の適法性",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1841",
        "title": "◎ もんじゅ事件（最判平4.9.22）――周辺住民の原告適格・法律上の利益の解釈",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1842",
        "title": "◎ 小田急線高架化事業認可取消請求事件（最大判平17.12.7）――原告適格の判断枠組みの拡大（9条2項新設の解説）",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1843",
        "title": "〇 紫苑事件（最判昭41.2.23）――執行停止の「回復困難な損害」の判断",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1844",
        "title": "◎ 土地区画整理事業計画決定の処分性（最判平20.9.10）――処分性の拡大・実効的権利救済",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1845",
        "title": "〇 横川川事件（最大判昭43.11.27）――実質的当事者訴訟の活用",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1846",
        "title": "△ マンション建築確認と周辺住民の原告適格（最判平14.1.22）――建築確認の処分性と第三者の法律上の利益",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1847",
        "title": "◎ 在宅投票制度廃止事件（最判昭60.11.21）――立法不作為と国家賠償責任の成立要件",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1848",
        "title": "◎ 国道43号線訴訟（最判平7.7.7）――道路の供用関連瑕疵・損失補償と国家賠償の併存",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1849",
        "title": "◎ 水俣病関西訴訟（最判平16.10.15）――規制権限不行使の国家賠償責任",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1850",
        "title": "〇 大阪空港公害訴訟（最大判昭56.12.16）――差止請求と国家賠償の関係・行政権の優先",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1851",
        "title": "〇 地方公共団体の費用負担事務（最判平8.3.19）――義務付け訴訟との関係",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1852",
        "title": "◎ 職員派遣条例事件（最判平10.4.24）――条例と法律の競合・上乗せ・横出し条例の許容性",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1853",
        "title": "◎ 商号続用と営業譲渡人の債務（最判昭47.3.2）――商法17条の趣旨・外観信頼保護",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1854",
        "title": "◎ 取締役の第三者に対する損害賠償責任（最判平12.7.7）――会社法429条の趣旨・軽過失の取扱い",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1855",
        "title": "〇 募集株式の発行と株主の差止請求（最判平9.1.28）――著しく不公正な方法の意味と差止要件",
        "type": "lecture",
        "difficulty": "advanced"
      },
      {
        "id": "1856",
        "title": "〇 個人情報の開示請求に関する事例（最判平15.9.12）――氏名・住所の個人情報該当性と目的外利用",
        "type": "lecture",
        "difficulty": "advanced"
      }
    ]
  }
];

export const getSubjectById = (id) => subjects.find((subject) => subject.id === id);

export const getSubjectsByCategory = (category) => subjects.filter((subject) => subject.category === category);

export const getSubjectsByDifficulty = (difficulty) => subjects.filter((subject) => subject.difficulty === difficulty);

export const getTotalEstimatedHours = () => subjects.reduce((total, subject) => total + subject.estimatedHours, 0);

export const getTotalUnits = () => subjects.reduce((total, subject) => total + (subject.units?.length || 0), 0);

export const getSubjectProgress = (subjectId, userProgress) => {
  const subject = getSubjectById(subjectId);
  if (!subject || !userProgress[subjectId]) {
    return {
      completed: 0,
      total: subject?.units?.length || 0,
      percentage: 0,
      score: 0,
    };
  }

  const progress = userProgress[subjectId];
  return {
    completed: progress.completed || 0,
    total: progress.total || subject.units.length,
    percentage: progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0,
    score: progress.score || 0,
  };
};

export default subjects;
