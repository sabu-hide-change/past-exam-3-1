import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  BookOpen, 
  CheckSquare, 
  Trophy,
  ChevronRight,
  Home,
  BarChart3
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

/**
 * 依存関係のインストールコマンド:
 * npm install lucide-react recharts tailwind-merge clsx
 * * ビルドエラー対策:
 * ビルドが失敗する場合は、package.jsonのbuildスクリプトを以下のように変更してください。
 * "build": "CI=false react-scripts build"
 */

// --- データ定義 ---

const QUESTIONS = [
  {
    id: 1,
    year: "令和2年 第1問",
    title: "管理目標1",
    questionText: "管理目標に関する記述として、最も適切なものはどれか。",
    options: [
      "産出された品物の量に対する投入された主原材料の量の比によって、歩留まりを求めた。",
      "産出量に対する投入量の比によって、生産性を求めた。",
      "単位時間に処理される仕事量を測る尺度として、リードタイムを用いた。",
      "動作可能な状態にある作業者が作業を停止している時間を、遊休時間として求めた。"
    ],
    correctIndex: 3,
    explanation: "選択肢エが適切です。遊休時間とは、動作可能な状態にある機械または作業者が所与の機能もしくは作業を停止している時間です。\n\n【他の選択肢の解説】\nア：不適切。歩留まり＝産出量／投入量です。本肢は「産出量に対する投入量の比（投入量/産出量）」となっているため逆です。\nイ：不適切。生産性＝産出量／投入量です。本肢は「産出量に対する投入量の比（投入量/産出量）」となっているため逆です。\nウ：不適切。リードタイムは時間（期間）を指すもので、仕事量ではありません。単位時間に処理される仕事量は「スループット」などが該当します。"
  },
  {
    id: 2,
    year: "令和4年 第1問",
    title: "管理目標2",
    questionText: "管理目標に関する記述として、最も適切なものはどれか。",
    options: [
      "検査によって不適合と判断された製品の数を検査によって適合と判断された製品の数で除して、不適合品率を求めた。",
      "産出された品物の量を投入された主原材料の量で除して、歩留りを求めた。",
      "実績時間を標準時間で除して、作業能率を求めた。",
      "投下した労働量をその結果として得られた生産量で除して、労働生産性を求めた。",
      "副材料、消耗品、エネルギーなどの消費量を工数または製品量で除して、作業密度を求めた。"
    ],
    correctIndex: 1,
    explanation: "選択肢イが適切です。歩留り＝産出量 ÷ 投入主原材料量 で求められます。\n\n【他の選択肢の解説】\nア：不適切。不適合品率＝不適合数 ÷ 検査総数 です。\nウ：不適切。作業能率＝標準工数 ÷ 実績工数 です。\nエ：不適切。労働生産性＝産出量 ÷ 労働投入量 です。記述は分母分子が逆です。\nオ：不適切。作業密度は「負荷された時間当たりの作業量」などを指します。"
  },
  {
    id: 3,
    year: "令和3年 第1問",
    title: "5S",
    questionText: "5Sに関する以下の文章において、空欄Ａ～Ｃに入る用語の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n「Ａ」は必要なものを必要なときにすぐ使用できるように、決められた場所に準備しておくことである。\n「Ｂ」は「C」が繰り返され、汚れのない状態を維持していることである。",
    options: [
      "Ａ：整頓　　Ｂ：清潔　　Ｃ：躾→整理→整頓",
      "Ａ：整頓　　Ｂ：清潔　　Ｃ：整理→整頓→清掃",
      "Ａ：整頓　　Ｂ：清掃　　Ｃ：整理→清潔→躾",
      "Ａ：整理　　Ｂ：清潔　　Ｃ：整理→整頓→清掃",
      "Ａ：整理　　Ｂ：清掃　　Ｃ：躾→整理→整頓"
    ],
    correctIndex: 1,
    explanation: "選択肢イが適切です。\n\n・整頓(Seiton)：必要なものを必要なときにすぐ使えるようにすること。\n・清潔(Seiketsu)：整理・整頓・清掃(3S)を維持すること。\n\nしたがって、A＝整頓、B＝清潔、C＝整理→整頓→清掃 となります。"
  },
  {
    id: 4,
    year: "令和2年 第21問",
    title: "生産の合理化",
    questionText: "生産の合理化に関する記述として、最も適切なものはどれか。",
    options: [
      "ECRS の原則とは、作業を改善する際に、より良い案を得るための指針として用いられる問いかけの頭文字をつなげたもので、最後にする問いかけはStandardization である。",
      "合理化の 3 S とは、標準化、単純化、専門化で、これは企業活動を効率的に行うための基礎となる考え方である。",
      "単純化とは、生産において分業化した各工程の生産速度や稼働時間、材料の供給時刻などを一致させる行為である。",
      "動作経済の原則とは、作業を行う際に最も合理的に作業を行うための経験則で、この原則を適用した結果としてフールプルーフの仕組みが構築できる。"
    ],
    correctIndex: 1,
    explanation: "選択肢イが適切です。合理化の3Sは、Standardization(標準化)、Simplification(単純化)、Specialization(専門化)です。\n\n【他の選択肢の解説】\nア：不適切。ECRSのSは Simplify(単純化) です。\nウ：不適切。記述の内容は「同期化」の説明です。単純化は品種や作業の複雑さを減らすことです。\nエ：不適切。フールプルーフはポカヨケの仕組みであり、動作経済の原則とは直接的な包含関係はありません。"
  },
  {
    id: 5,
    year: "令和元年 第2問",
    title: "生産形態1",
    questionText: "生産工程における加工品の流れの違いによって区別される用語の組み合わせとして、最も適切なものはどれか。",
    options: [
      "押出型と引取型",
      "多品種少量生産と少品種多量生産",
      "フローショップ型とジョブショップ型",
      "見込生産と受注生産"
    ],
    correctIndex: 2,
    explanation: "選択肢ウが適切です。フローショップ型とジョブショップ型は、機械設備の配置と加工品の流れ（経路）による分類です。\n\n【他の選択肢の解説】\nア：不適切。押出/引取は製造指示の起点の違いです。\nイ：不適切。品種と生産量の多寡による分類です。\nエ：不適切。注文と生産の時期（タイミング）による分類です。"
  },
  {
    id: 6,
    year: "平成28年 第2問",
    title: "生産形態2",
    questionText: "生産形態に関する記述として、最も不適切なものはどれか。",
    options: [
      "少品種多量生産では、加工・組立の工数を少なくする製品設計が有用である。",
      "少品種多量生産では、工程の自動化が容易で、品種の変化に対するフレキシビリティが高い。",
      "多品種少量生産では、進捗管理が難しく、生産統制を適切に行わないと納期遵守率が低下する。",
      "多品種少量生産では、汎用設備の活用や多能工化が有用である。"
    ],
    correctIndex: 1,
    explanation: "選択肢イが「不適切」であり正解です。少品種多量生産は専用ライン化・自動化しやすい反面、仕様変更や品種変更への柔軟性（フレキシビリティ）は低くなります。\n\n【表：少品種多量生産と多品種少量生産の比較】\n少品種多量生産：効率的、専用ライン、柔軟性低い\n多品種少量生産：管理複雑、汎用設備、柔軟性高い",
    hasDiagram: true,
    diagramType: "comparison_table"
  },
  {
    id: 7,
    year: "平成27年 第2問",
    title: "見込生産",
    questionText: "見込生産の特徴に関する記述として、最も適切なものの組み合わせを下記の解答群から選べ。\n\na　多品種少量生産である。\nb　需要変動はなるべく製品在庫で吸収する。\nc　営業情報やマーケットリサーチ情報に基づき需要予測を行い、生産量を決定する。\nd　納期をどれだけ守れるかが生産管理のポイントとなる。",
    options: [
      "aとc",
      "aとd",
      "bとc",
      "bとd"
    ],
    correctIndex: 2,
    explanation: "選択肢ウ（bとc）が適切です。\n\n【解説】\na：不適切。見込生産は一般に少品種多量生産に向いています。多品種少量は受注生産の特徴です。\nb：適切。見込生産は在庫を持って販売するため、需要変動を製品在庫（安全在庫）で吸収します。\nc：適切。事前の需要予測に基づいて生産計画を立てます。\nd：不適切。納期遵守が最重要管理項目となるのは、顧客と納期を約束する「受注生産」です。"
  },
  {
    id: 8,
    year: "令和元年 第5問",
    title: "サイクルタイムと最小作業工程数",
    questionText: "要素作業ａ～ｇの先行関係が下図に示される製品を、単一ラインで生産する。生産計画量が380個、稼働予定時間が40時間のとき、実行可能なサイクルタイムと最小作業工程数の組み合わせとして、最も適切なものを下記の解答群から選べ。",
    options: [
      "サイクルタイム：6分　　最小作業工程数：3",
      "サイクルタイム：6分　　最小作業工程数：4",
      "サイクルタイム：9分　　最小作業工程数：2",
      "サイクルタイム：9分　　最小作業工程数：3"
    ],
    correctIndex: 0,
    explanation: "選択肢アが正解です。\n\n1. サイクルタイム(C.T)の計算\n稼働時間 = 40時間 × 60分 = 2,400分\nC.T = 2,400分 ÷ 380個 = 6.31...分\n選択肢より、6分以下である必要があるため「6分」が適切。\n\n2. 最小作業工程数の計算\n総作業時間(Σt) = 4(a)+2(b)+3(c)+1(d)+3(e)+2(f)+2(g) = 17分\n最小工程数 = Σt ÷ C.T = 17 ÷ 6 = 2.83...\n切り上げて「3工程」が必要。\n\nよって、C.T=6分、工程数=3 となります。",
    hasDiagram: true,
    diagramType: "network_diagram"
  },
  {
    id: 9,
    year: "令和3年 第5問",
    title: "ライン編成効率",
    questionText: "ある単一品種ラインにおいて、1か月864個の生産を計画している。当該の計画生産能力を25日／月、8時間／日、稼働率90％として作業編成を行った結果、下表となった。このときのライン編成効率の範囲として、最も適切なものを下記の解答群から選べ。",
    options: [
      "70.0 ％未満",
      "70.0 ％以上 80.0 ％未満",
      "80.0 ％以上 90.0 ％未満",
      "90.0 ％以上"
    ],
    correctIndex: 3,
    explanation: "選択肢エが正解です。\n\n1. サイクルタイム(C.T)の計算\n稼働可能時間 = 25日×8時間×60分×0.9 = 10,800分\nC.T = 10,800分 ÷ 864個 = 12.5分\n\n2. ライン編成効率の計算\n編成効率 = 総作業時間 ÷ (工程数 × C.T)\n総作業時間 = 11.3+11.2+12.5+11.5 = 46.5分\n工程数 = 4\n編成効率 = 46.5 ÷ (4 × 12.5) = 46.5 ÷ 50 = 0.93 = 93%\n\nしたがって、90.0%以上となります。",
    hasDiagram: true,
    diagramType: "table_q9"
  },
  {
    id: 10,
    year: "平成25年 第9問",
    title: "ラインバランシング",
    questionText: "混合品種組立ラインの編成を検討した結果、サイクルタイムを150秒、ステーション数を10とする案が提示された。生産される3種類の製品A、B、Cの総作業時間と1か月当たりの計画生産量は、以下の表に与えられている。この案の編成効率に最も近い値を、下記の解答群から選べ。",
    options: [
      "0.94",
      "0.95",
      "0.96",
      "0.97"
    ],
    correctIndex: 1,
    explanation: "選択肢イが正解です。\n\n混合品種ラインでは「製品1個あたりの加重平均作業時間」を用います。\n\n1. 平均作業時間の計算\n総作業量 = (1400×2000) + (1450×1000) + (1450×1000) \n = 2,800,000 + 1,450,000 + 1,450,000 = 5,700,000秒\n総生産数 = 2000 + 1000 + 1000 = 4000個\n平均作業時間 = 5,700,000 ÷ 4000 = 1,425秒\n\n2. 編成効率\n効率 = 平均作業時間 ÷ (ステーション数 × C.T)\n = 1,425 ÷ (10 × 150) = 1,425 ÷ 1,500 = 0.95\n\nよって、0.95 (95%) です。",
    hasDiagram: true,
    diagramType: "table_q10"
  }
];

// --- コンポーネント実装 ---

// 図表コンポーネント: Q6 比較表
const ComparisonTableQ6 = () => (
  <div className="my-4 overflow-x-auto">
    <table className="min-w-full text-sm text-left text-gray-700 border border-gray-300">
      <thead className="bg-blue-100 text-blue-800 font-bold">
        <tr>
          <th className="px-4 py-2 border">比較項目</th>
          <th className="px-4 py-2 border">少品種多量生産</th>
          <th className="px-4 py-2 border">多品種少量生産</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-white">
          <td className="px-4 py-2 border font-medium">特徴</td>
          <td className="px-4 py-2 border">少ない種類を大量生産</td>
          <td className="px-4 py-2 border">多種類を少しずつ生産</td>
        </tr>
        <tr className="bg-gray-50">
          <td className="px-4 py-2 border font-medium">設備</td>
          <td className="px-4 py-2 border">専用ライン・自動化容易</td>
          <td className="px-4 py-2 border">汎用設備・多能工化</td>
        </tr>
        <tr className="bg-white">
          <td className="px-4 py-2 border font-medium">柔軟性</td>
          <td className="px-4 py-2 border text-red-600 font-bold">低い (変更が困難)</td>
          <td className="px-4 py-2 border text-green-600 font-bold">高い (変化に強い)</td>
        </tr>
        <tr className="bg-gray-50">
          <td className="px-4 py-2 border font-medium">管理</td>
          <td className="px-4 py-2 border">比較的単純</td>
          <td className="px-4 py-2 border">複雑 (進捗・統制が重要)</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// 図表コンポーネント: Q8 ネットワーク図 (SVG)
const NetworkDiagramQ8 = () => (
  <div className="my-6 flex justify-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <svg width="340" height="220" viewBox="0 0 340 220" className="max-w-full">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
        </marker>
      </defs>
      
      {/* Nodes */}
      <g className="font-sans text-sm font-bold">
        {/* Node A */}
        <circle cx="40" cy="110" r="25" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
        <text x="40" y="115" textAnchor="middle" fill="#0f172a">a</text>
        <text x="65" y="90" fill="#64748b" fontSize="12">4</text>

        {/* Node B */}
        <circle cx="120" cy="50" r="25" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
        <text x="120" y="55" textAnchor="middle" fill="#0f172a">b</text>
        <text x="145" y="30" fill="#64748b" fontSize="12">2</text>

        {/* Node C */}
        <circle cx="120" cy="110" r="25" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
        <text x="120" y="115" textAnchor="middle" fill="#0f172a">c</text>
        <text x="145" y="90" fill="#64748b" fontSize="12">3</text>

        {/* Node D */}
        <circle cx="120" cy="170" r="25" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
        <text x="120" y="175" textAnchor="middle" fill="#0f172a">d</text>
        <text x="145" y="150" fill="#64748b" fontSize="12">1</text>

        {/* Node E */}
        <circle cx="200" cy="50" r="25" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
        <text x="200" y="55" textAnchor="middle" fill="#0f172a">e</text>
        <text x="225" y="30" fill="#64748b" fontSize="12">3</text>

        {/* Node F */}
        <circle cx="200" cy="140" r="25" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
        <text x="200" y="145" textAnchor="middle" fill="#0f172a">f</text>
        <text x="225" y="120" fill="#64748b" fontSize="12">2</text>

        {/* Node G */}
        <circle cx="290" cy="110" r="25" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
        <text x="290" y="115" textAnchor="middle" fill="#0f172a">g</text>
        <text x="315" y="90" fill="#64748b" fontSize="12">2</text>
      </g>

      {/* Edges */}
      <g stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowhead)">
        <line x1="40" y1="110" x2="120" y2="50" />
        <line x1="40" y1="110" x2="120" y2="110" />
        <line x1="40" y1="110" x2="120" y2="170" />
        
        <line x1="120" y1="50" x2="200" y2="50" />
        <line x1="120" y1="110" x2="200" y2="140" />
        <line x1="120" y1="170" x2="200" y2="140" />
        
        <line x1="200" y1="50" x2="290" y2="110" />
        <line x1="200" y1="140" x2="290" y2="110" />
      </g>
    </svg>
  </div>
);

// 図表コンポーネント: Q9 データ表
const TableQ9 = () => (
  <div className="my-4 overflow-x-auto">
    <table className="w-full text-sm text-center border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">ワークステーションNo.</th>
          <th className="border p-2">作業時間（分）</th>
        </tr>
      </thead>
      <tbody>
        <tr><td className="border p-2">1</td><td className="border p-2">11.3</td></tr>
        <tr><td className="border p-2">2</td><td className="border p-2">11.2</td></tr>
        <tr><td className="border p-2">3</td><td className="border p-2">12.5</td></tr>
        <tr><td className="border p-2">4</td><td className="border p-2">11.5</td></tr>
      </tbody>
    </table>
  </div>
);

// 図表コンポーネント: Q10 データ表
const TableQ10 = () => (
  <div className="my-4 overflow-x-auto">
    <table className="w-full text-sm text-center border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2"></th>
          <th className="border p-2">製品 A</th>
          <th className="border p-2">製品 B</th>
          <th className="border p-2">製品 C</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2 font-medium bg-gray-50">総作業時間 (秒/個)</td>
          <td className="border p-2">1,400</td>
          <td className="border p-2">1,450</td>
          <td className="border p-2">1,450</td>
        </tr>
        <tr>
          <td className="border p-2 font-medium bg-gray-50">生産量 (個/月)</td>
          <td className="border p-2">2,000</td>
          <td className="border p-2">1,000</td>
          <td className="border p-2">1,000</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// --- メインアプリケーション ---

export default function App() {
  // 永続化ステート
  const [history, setHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('examApp_history');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [reviewFlags, setReviewFlags] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('examApp_reviews');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // UIステート
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // dashboard, quiz, result
  const [targetQuestions, setTargetQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionResults, setSessionResults] = useState([]); // 今回のセッションの結果

  // データ保存
  useEffect(() => {
    localStorage.setItem('examApp_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('examApp_reviews', JSON.stringify(reviewFlags));
  }, [reviewFlags]);

  // --- ロジック ---

  // クイズ開始処理
  const startQuiz = (mode) => {
    let questionsToAsk = [];
    
    if (mode === 'all') {
      questionsToAsk = [...QUESTIONS];
    } else if (mode === 'wrong') {
      questionsToAsk = QUESTIONS.filter(q => {
        const h = history[q.id];
        return h && !h.isCorrect;
      });
    } else if (mode === 'review') {
      questionsToAsk = QUESTIONS.filter(q => reviewFlags[q.id]);
    }

    if (questionsToAsk.length === 0) {
      alert("対象となる問題がありません。");
      return;
    }

    // コンソールログ (デバッグ用)
    console.log(`Starting quiz mode: ${mode}, Count: ${questionsToAsk.length}`);

    setTargetQuestions(questionsToAsk);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSessionResults([]);
    setCurrentScreen('quiz');
  };

  // 回答処理
  const handleAnswer = (index) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = targetQuestions[currentQuestionIndex];
    const isCorrect = index === currentQ.correctIndex;

    // 履歴更新
    setHistory(prev => ({
      ...prev,
      [currentQ.id]: {
        isCorrect,
        lastAnswered: Date.now(),
        selectedOption: index
      }
    }));

    // セッション結果記録
    setSessionResults(prev => [...prev, { qId: currentQ.id, isCorrect }]);
  };

  // 次へ進む
  const handleNext = () => {
    if (currentQuestionIndex + 1 < targetQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCurrentScreen('summary');
    }
  };

  // チェックボックス切替
  const toggleReview = (qId) => {
    setReviewFlags(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // --- サブコンポーネント: ダッシュボード ---

  const Dashboard = () => {
    // 統計計算
    const totalAnswered = Object.keys(history).length;
    const totalCorrect = Object.values(history).filter(h => h.isCorrect).length;
    const correctRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    
    const wrongCount = QUESTIONS.filter(q => {
      const h = history[q.id];
      return h && !h.isCorrect;
    }).length;

    const reviewCount = Object.values(reviewFlags).filter(Boolean).length;

    const chartData = [
      { name: '正解', value: totalCorrect, color: '#4ade80' },
      { name: '不正解', value: totalAnswered - totalCorrect, color: '#f87171' },
    ];
    // 未回答分を含める場合
    if (totalAnswered === 0) {
       chartData.push({ name: '未回答', value: 1, color: '#e2e8f0' });
    }

    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <header className="text-center py-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">生産管理 過去問演習</h1>
          <p className="text-slate-500 mt-2">Part 3-1 生産管理と生産方式</p>
        </header>

        {/* 統計パネル */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">学習状況</h3>
            <div className="w-full h-40">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totalAnswered === 0 ? [{value:1}] : chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {totalAnswered > 0 ? (
                       chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))
                    ) : (
                      <Cell fill="#e2e8f0" />
                    )}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <span className="text-3xl font-bold text-blue-600">{correctRate}%</span>
              <span className="text-sm text-slate-400 ml-1">正答率</span>
            </div>
          </div>

          <div className="space-y-3">
             <button 
                onClick={() => startQuiz('all')}
                className="w-full flex items-center justify-between p-4 bg-white border border-blue-200 rounded-xl shadow-sm hover:bg-blue-50 transition-colors group"
             >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200">
                    <Play size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-700">全問スタート</div>
                    <div className="text-xs text-slate-500">全10問</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
             </button>

             <button 
                onClick={() => startQuiz('wrong')}
                disabled={wrongCount === 0}
                className={`w-full flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm transition-colors group ${wrongCount === 0 ? 'opacity-50 cursor-not-allowed border-slate-200' : 'border-red-200 hover:bg-red-50 cursor-pointer'}`}
             >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${wrongCount === 0 ? 'bg-slate-100 text-slate-400' : 'bg-red-100 text-red-600 group-hover:bg-red-200'}`}>
                    <RotateCcw size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-700">間違えた問題</div>
                    <div className="text-xs text-slate-500">{wrongCount}問</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
             </button>

             <button 
                onClick={() => startQuiz('review')}
                disabled={reviewCount === 0}
                className={`w-full flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm transition-colors group ${reviewCount === 0 ? 'opacity-50 cursor-not-allowed border-slate-200' : 'border-amber-200 hover:bg-amber-50 cursor-pointer'}`}
             >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${reviewCount === 0 ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'}`}>
                    <CheckSquare size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-700">要復習リスト</div>
                    <div className="text-xs text-slate-500">{reviewCount}問</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
             </button>
          </div>
        </div>

        {/* 問題一覧リスト (前回結果表示) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <BookOpen size={18} />
              問題一覧
            </h3>
            <span className="text-xs text-slate-500">※チェックボックスで「要復習」管理</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {QUESTIONS.map((q) => {
              const h = history[q.id];
              const status = !h ? 'unanswered' : h.isCorrect ? 'correct' : 'wrong';
              const isReviewed = reviewFlags[q.id];

              return (
                <div key={q.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                        {q.year}
                      </span>
                      {status === 'correct' && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle size={10}/> 正解</span>}
                      {status === 'wrong' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded flex items-center gap-1"><XCircle size={10}/> 不正解</span>}
                    </div>
                    <div className="text-sm text-slate-800 font-medium">{q.title}</div>
                  </div>
                  
                  <button 
                    onClick={() => toggleReview(q.id)}
                    className={`ml-4 p-2 rounded-full transition-colors ${isReviewed ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-400'}`}
                    title="要復習に追加"
                  >
                    <CheckSquare size={20} fill={isReviewed ? "currentColor" : "none"} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // --- サブコンポーネント: クイズ画面 ---

  const QuizScreen = () => {
    const question = targetQuestions[currentQuestionIndex];
    if (!question) return <div>Loading...</div>;

    const currentHistory = history[question.id];
    const isReview = reviewFlags[question.id];

    return (
      <div className="max-w-2xl mx-auto p-4 min-h-screen flex flex-col">
        {/* ヘッダー: 進捗バーと戻るボタン */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrentScreen('dashboard')} className="text-slate-400 hover:text-slate-600">
            <Home size={20} />
          </button>
          <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / targetQuestions.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-mono text-slate-500">
            {currentQuestionIndex + 1} / {targetQuestions.length}
          </span>
        </div>

        {/* 問題カード */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 flex-1">
          <div className="p-6 border-b border-slate-100">
            <div className="flex justify-between items-start mb-4">
               <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                 {question.year}
               </span>
               <div className="flex items-center gap-2">
                 {currentHistory && (
                   <span className={`text-xs px-2 py-1 rounded border ${currentHistory.isCorrect ? 'border-green-200 text-green-600' : 'border-red-200 text-red-600'}`}>
                     前回: {currentHistory.isCorrect ? '正解' : '不正解'}
                   </span>
                 )}
                 <button onClick={() => toggleReview(question.id)}>
                   <CheckSquare size={18} className={isReview ? 'text-amber-500 fill-current' : 'text-slate-300'} />
                 </button>
               </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{question.title}</h2>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{question.questionText}</p>
            
            {/* 図表レンダリング */}
            {question.diagramType === 'network_diagram' && <NetworkDiagramQ8 />}
            {question.diagramType === 'table_q9' && <TableQ9 />}
            {question.diagramType === 'table_q10' && <TableQ10 />}
          </div>

          {/* 選択肢 */}
          <div className="p-4 space-y-3 bg-slate-50">
            {question.options.map((option, idx) => {
              // 判定ロジック
              let btnClass = "w-full p-4 rounded-xl text-left text-sm font-medium transition-all border-2 ";
              
              if (isAnswered) {
                if (idx === question.correctIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-800"; // 正解
                } else if (idx === selectedOption) {
                  btnClass += "border-red-500 bg-red-50 text-red-800"; // 不正解の選択
                } else {
                  btnClass += "border-transparent bg-white text-slate-400 opacity-60"; // その他
                }
              } else {
                btnClass += "border-transparent bg-white hover:border-blue-300 text-slate-700 shadow-sm hover:shadow-md";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                      {['ア','イ','ウ','エ','オ'][idx]}
                    </span>
                    <span>{option}</span>
                    {isAnswered && idx === question.correctIndex && <CheckCircle className="ml-auto text-green-600" size={20} />}
                    {isAnswered && idx === selectedOption && idx !== question.correctIndex && <XCircle className="ml-auto text-red-600" size={20} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 解説エリア (回答後のみ表示) */}
          {isAnswered && (
            <div className="p-6 bg-indigo-50 border-t border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1 rounded-full ${selectedOption === question.correctIndex ? 'bg-green-100' : 'bg-red-100'}`}>
                   {selectedOption === question.correctIndex ? <CheckCircle size={24} className="text-green-600" /> : <XCircle size={24} className="text-red-600" />}
                </div>
                <span className={`text-lg font-bold ${selectedOption === question.correctIndex ? 'text-green-700' : 'text-red-700'}`}>
                  {selectedOption === question.correctIndex ? '正解！' : '不正解...'}
                </span>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-indigo-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                <span className="font-bold block mb-2 text-indigo-900">【解説】</span>
                {question.explanation}
                
                {question.diagramType === 'comparison_table' && <ComparisonTableQ6 />}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-indigo-600">
                   <input 
                     type="checkbox" 
                     checked={reviewFlags[question.id] || false} 
                     onChange={() => toggleReview(question.id)}
                     className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                   />
                   <span className="text-sm font-medium">あとで復習する</span>
                </label>

                <button 
                  onClick={handleNext}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  {currentQuestionIndex + 1 < targetQuestions.length ? '次へ' : '結果を見る'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- サブコンポーネント: 結果画面 ---

  const SummaryScreen = () => {
    const correctCount = sessionResults.filter(r => r.isCorrect).length;
    const rate = Math.round((correctCount / sessionResults.length) * 100);

    return (
      <div className="max-w-xl mx-auto p-6 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="mb-8 p-8 bg-white rounded-2xl shadow-lg border border-slate-100 w-full">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <Trophy size={40} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">お疲れ様でした！</h2>
          <p className="text-slate-500 mb-6">今回のセッション結果</p>
          
          <div className="flex justify-center items-end gap-2 mb-8">
            <span className="text-5xl font-extrabold text-blue-600">{correctCount}</span>
            <span className="text-xl text-slate-400 font-medium mb-1">/ {sessionResults.length}問</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
            <div className="bg-blue-500 h-3 rounded-full" style={{width: `${rate}%`}}></div>
          </div>
          <p className="text-sm text-slate-500 text-right">正答率: {rate}%</p>
        </div>

        <button 
          onClick={() => setCurrentScreen('dashboard')}
          className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold shadow hover:bg-slate-900 transition-colors"
        >
          ホームに戻る
        </button>
      </div>
    );
  };

  // --- メインレンダリング ---

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {currentScreen === 'dashboard' && <Dashboard />}
      {currentScreen === 'quiz' && <QuizScreen />}
      {currentScreen === 'summary' && <SummaryScreen />}
    </div>
  );
}