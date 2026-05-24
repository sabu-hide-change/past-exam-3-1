// npm install lucide-react recharts firebase

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Check, X, Home, ChevronRight, RefreshCw, BookOpen, AlertTriangle, List, User, Play, Award, Loader2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================
const APP_ID = "ProductionManagement_QuizApp_001";

// Environment variables configuration as strictly instructed
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// QUIZ DATA DATASET
// ==========================================
const quizQuestions = [
  {
    id: 1,
    year: "令和2年 第1問",
    title: "管理目標1",
    question: "管理目標に関する記述として、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "産出された品物の量に対する投入された主原材料の量の比によって、歩留まりを求めた。" },
      { key: "イ", text: "産出量に対する投入量の比によって、生産性を求めた。" },
      { key: "ウ", text: "単位時間に処理される仕事量を測る尺度として、リードタイムを用いた。" },
      { key: "エ", text: "動作可能な状態にある作業者が作業を停止している時間を、遊休時間として求めた。" }
    ],
    answer: "エ",
    explanation: [
      "管理目標に関する評価指標の理解を問う問題です。",
      "ア：【不適切】歩留まり率＝産出された品物の量／原材料投入量 です。本肢は分子分母が反対になっています。",
      "イ：【不適切】生産性＝産出量／投入量 です。本肢は分子分母が反対になっています。",
      "ウ：【不適切】リードタイムは素材が準備されてから完成品になるまでの時間です。単位時間に処理される仕事量は「スループット」を指します。",
      "エ：【適切】遊休時間とは、動作可能な状態にある機械または作業者が所与の機能もしくは作業を停止している時間です。"
    ]
  },
  {
    id: 2,
    year: "令和4年 第1問",
    title: "管理目標2",
    question: "管理目標に関する記述として、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "検査によって不適合と判断された製品の数を検査によって適合と判断された製品の数で除して、不適合品率を求めた。" },
      { key: "イ", text: "産出された品物の量を投入された主原材料の量で除して、歩留りを求めた。" },
      { key: "ウ", text: "実績時間を標準時間で除して、作業能率を求めた。" },
      { key: "エ", text: "投下した労働量をその結果として得られた生産量で除して、労働生産性を求めた。" },
      { key: "オ", text: "副材料、消耗品、エネルギーなどの消費量を工数または製品量で除して、作業密度を求めた。" }
    ],
    answer: "イ",
    explanation: [
      "管理指標に関する出題です。各指標の正確な定義が求められます。",
      "ア：【不適切】不適合品率は「不適合と判断された製品の数 ÷ 検査した製品の数」で求めます。分母が誤りです。",
      "イ：【適切】歩留りとは「投入された主原材料の量と、その主原材料から実際に産出された品物の量との比率」のことです。産出された品物の量 ÷ 投入された主原材料の量 で求めるため正しい記述です。",
      "ウ：【不適切】作業能率は「標準出来高工数 ÷ 実際作業工数（あるいは計画工数 ÷ 正味実績工数）」で求めます。本肢の計算式は誤りです。",
      "エ：【不適切】労働生産性は、労働量に対する産出量の割合（結果として得られた生産量 ÷ 投入した労働量）で求めます。分子と分母が逆です。",
      "オ：【不適切】作業密度とは「負荷された時間当たりの作業量」のことです。選択肢の記述は誤りです。"
    ]
  },
  {
    id: 3,
    year: "令和3年 第1問",
    title: "5S",
    question: "5Sに関する以下の文章において、空欄Ａ～Ｃに入る用語の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n「 Ａ は必要なものを必要なときにすぐ使用できるように、決められた場所に準備しておくことである。 Ｂ は Ｃ が繰り返され、汚れのない状態を維持していることである。」",
    options: [
      { key: "ア", text: "Ａ：整頓  Ｂ：清潔  Ｃ：躾→整理→整頓" },
      { key: "イ", text: "Ａ：整頓  Ｂ：清潔  Ｃ：整理→整頓→清掃" },
      { key: "ウ", text: "Ａ：整頓  Ｂ：清掃  Ｃ：整理→清潔→躾" },
      { key: "エ", text: "Ａ：整理  Ｂ：清潔  Ｃ：整理→整頓→清掃" },
      { key: "オ", text: "Ａ：整理  Ｂ：清掃  Ｃ：躾→整理→整頓" }
    ],
    answer: "イ",
    explanation: [
      "5Sに関する基本的な定義と順序を問う定番の問題です。",
      "5SのJIS定義は以下の通りです：",
      "・整理：必要なものと不必要なものを区分し、不必要なものを片付けること",
      "・整頓：必要なものを必要なときにすぐ使用できるように、決められた場所に準備しておくこと",
      "・清掃：必要なものについた異物を除去すること",
      "・清潔：整理・整頓・清掃が繰り返され、汚れのない状態を維持していること",
      "・しつけ（躾）：決めたことを必ず守ること",
      "したがって、A＝整頓、B＝清潔、C＝整理→整頓→清掃となるため、選択肢イが正解です。"
    ]
  },
  {
    id: 4,
    year: "令和2年 第21問",
    title: "生産の合理化",
    question: "生産の合理化に関する記述として、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "ECRS の原則とは、作業を改善する際に、より良い案を得るための指針として用いられる問いかけの頭文字をつなげたもので、最後にする問いかけはStandardization である。" },
      { key: "イ", text: "合理化の 3 S とは、標準化、単純化、専門化で、これは企業活動を効率的に行うための基礎となる考え方である。" },
      { key: "ウ", text: "単純化とは、生産において分業化した各工程の生産速度や稼働時間、材料の供給時刻などを一致させる行為である。" },
      { key: "エ", text: "動作経済の原則とは、作業を行う際に最も合理的に作業を行うための経験則で、この原則を適用した結果としてフールプルーフの仕組みが構築できる。" }
    ],
    answer: "イ",
    explanation: [
      "ア：【不適切】ECRSのSは、Standardizationではなく「Simplify（単純化できないか）」です。（E: Eliminate, C: Combine, R: Rearrange, S: Simplify）",
      "イ：【適切】合理化の3Sは、標準化（Standardization）、単純化（Simplification）、専門化（Specialization）の総称であり、効率化の基礎概念です。",
      "ウ：【不適切】本肢の記述は「同期化」の説明です。単純化とは、設計や構造、システム等の複雑さを減らすことです。",
      "エ：【不適切】フールプルーフは「ミスをしてもエラーが発生しない仕組み（ポカヨケ等）」を指し、人間の動作効率を追及する「動作経済の原則」とは直接の関連はありません。"
    ]
  },
  {
    id: 5,
    year: "令和元年 第2問",
    title: "生産形態1",
    question: "生産工程における加工品の流れの違いによって区別される用語の組み合わせとして、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "押出型と引取型" },
      { key: "イ", text: "多品種少量生産と少品種多量生産" },
      { key: "ウ", text: "フローショップ型とジョブショップ型" },
      { key: "エ", text: "見込生産と受注生産" }
    ],
    answer: "ウ",
    explanation: [
      "加工品の流れ（工程配置・レイアウト・経路）の観点で分類される用語を特定する問題です。",
      "ア：【不適切】「製造指示・起点の違い」による分類です（押出型＝見込型、引取型＝受注型）。",
      "イ：【不適切】生産形態の「品種と生産量」による違いの分類です。",
      "ウ：【適切】「加工品の流れ」の違いです。フローショップ型は、類似の作業手順に沿って単一または特定の経路に加工品が流れます。ジョブショップ型は、製品ごとに異なる複雑な経路を流れます。",
      "エ：【不適切】生産形態の「注文と生産の時期（タイミング）」による違いの分類です。"
    ]
  },
  {
    id: 6,
    year: "平成28年 第2問",
    title: "生産形態2",
    question: "生産形態に関する記述として、最も不適切なものはどれか。",
    options: [
      { key: "ア", text: "少品種多量生産では、加工・組立の工数を少なくする製品設計が有用である。" },
      { key: "イ", text: "少品種多量生産では、工程の自動化が容易で、品種の変化に対するフレキシビリティが高い。" },
      { key: "ウ", text: "多品種少量生産では、進捗管理が難しく、生産統制を適切に行わないと納期遵守率が低下する。" },
      { key: "エ", text: "多品種少量生産では、汎用設備の活用や多能工化が有用である。" }
    ],
    answer: "イ",
    explanation: [
      "少品種多量生産と多品種少量生産の特徴の比較問題です。不適切なものを選びます。",
      "ア：【適切】工数を減らす専用設計は大量生産の効率をさらに高めます。",
      "イ：【不適切】少品種多量生産では工程の自動化（専用ライン化）は容易ですが、その反面、別品種への切替や変更時のライン改修が必要となるため、「品種の変化に対するフレキシビリティ（柔軟性）」は低くなります。",
      "ウ：【適切】多品種少量生産では、品目ごとに段取りが発生し、作業の混乱が生じやすいため、厳密な生産統制（進捗管理）を行わないと納期遅延の原因になります。",
      "エ：【適切】多種多様なオーダーに柔軟に対応するため、特定の用途に縛られない「汎用設備」の導入や、1人で何種類もの作業ができる「多能工化」が極めて有効です。"
    ]
  },
  {
    id: 7,
    year: "平成27年 第2問",
    title: "見込生産",
    question: "見込生産の特徴に関する記述として、最も適切なものの組み合わせを下記の解答群から選べ。\n\na 多品種少量生産である。\nb 需要変動はなるべく製品在庫で吸収する。\nc 営業情報やマーケットリサーチ情報に基づき需要予測を行い、生産量を決定する。\nd 納期をどれだけ守れるかが生産管理のポイントとなる。",
    options: [
      { key: "ア", text: "aとc" },
      { key: "イ", text: "aとd" },
      { key: "ウ", text: "bとc" },
      { key: "エ", text: "bとd" }
    ],
    answer: "ウ",
    explanation: [
      "見込生産と受注生産の対比問題です。",
      "a：【誤り】多品種少量生産は通常、個別・受注生産の特徴です。見込生産は少品種多量生産に多く見られます。",
      "b：【正しい】事前に作って在庫を持つため、需要の増加・減少といった変動は製品在庫（バッファ・安全在庫）によって吸収します。",
      "c：【正しい】顧客からの注文前に作る必要があるため、予測（マーケティングや過去実績）に基づく生産量決定が必須です。",
      "d：【誤り】個々の顧客から事前に納期指定を受けるわけではないため、納期遵守が最重要課題となるのは「受注生産」です。",
      "よって、bとcが正しい組み合わせであるため、ウが正解です。"
    ]
  },
  {
    id: 8,
    year: "令和元年 第5問",
    title: "サイクルタイムと最小作業工程数",
    question: "要素作業ａ～ｇの先行関係が下図に示される製品を、単一ラインで生産する。生産計画量が380個、稼働予定時間が40時間のとき、実行可能なサイクルタイムと最小作業工程数の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n【先行関係データ】\n・要素作業 a (4分) ──> b (2分) ──> e (3分) ──> g (2分)\n・要素作業 a (4分) ──> c (3分) ──> f (2分) ──> g (2分)\n・要素作業 a (4分) ──> d (1分) ──> f (2分) ──> g (2分)\n※すべての要素作業時間(a～g)の合計 ＝ 4 + 2 + 3 + 1 + 3 + 2 + 2 ＝ 17分",
    options: [
      { key: "ア", text: "サイクルタイム：6分  最小作業工程数：3" },
      { key: "イ", text: "サイクルタイム：6分  最小作業工程数：4" },
      { key: "ウ", text: "サイクルタイム：9分  最小作業工程数：2" },
      { key: "エ", text: "サイクルタイム：9分  最小作業工程数：3" }
    ],
    answer: "ア",
    explanation: [
      "生産ラインのサイクルタイム(CT)と最小作業工程数を計算する問題です。",
      "1. 必要なサイクルタイムの計算：",
      "稼働予定時間 ＝ 40時間 × 60分 ＝ 2,400分",
      "生産計画量 ＝ 380個",
      "最大許容サイクルタイム ＝ 2,400分 ÷ 380個 ≒ 6.31分",
      "目標個数を満たすためには、サイクルタイムは6.31分以下である必要があります。選択肢から「6分」が選ばれます。",
      "2. 最小作業工程数の計算：",
      "最小作業工程数 ＝ 要素作業時間の総和 ÷ サイクルタイム",
      "要素作業時間合計 ＝ 17分",
      "最小作業工程数 ＝ 17分 ÷ 6分 ＝ 2.83 ──> 切り上げて「3」工程",
      "したがって、サイクルタイム6分、最小作業工程数3となり、アが正解です。"
    ]
  },
  {
    id: 9,
    year: "令和3年 第5問",
    title: "ライン編成効率",
    question: "ある単一品種ラインにおいて、1か月864個の生産を計画している。当該の計画生産能力を25日／月、8時間／日、稼働率90％として作業編成を行った結果、下表となった。このときのライン編成効率の範囲として、最も適切なものを下記の解答群から選べ。\n\n【ワークステーション編成データ】\n・No.1: 11.3分\n・No.2: 11.2分\n・No.3: 12.5分\n・No.4: 11.5分",
    options: [
      { key: "ア", text: "70.0 ％未満" },
      { key: "イ", text: "70.0 ％以上 80.0 ％未満" },
      { key: "ウ", text: "80.0 ％以上 90.0 ％未満" },
      { key: "エ", text: "90.0 ％以上" }
    ],
    answer: "エ",
    explanation: [
      "ライン編成効率の算出問題です。",
      "1. 必要サイクルタイム(CT)の算出：",
      "総稼働可能時間(分) ＝ 25日 × 8時間 × 60分 × 90% (0.9) ＝ 10,800分",
      "計画生産量 ＝ 864個",
      "サイクルタイム ＝ 10,800分 ÷ 864個 ＝ 12.5分",
      "2. ライン編成効率の算出：",
      "総作業時間 ＝ 11.3 + 11.2 + 12.5 + 11.5 ＝ 46.5分",
      "ステーション数(N) ＝ 4",
      "最大作業時間(ボトルネック)も 12.5分 と一致しています。",
      "編成効率 ＝ 総作業時間 ÷ (ステーション数 × サイクルタイム)",
      "編成効率 ＝ 46.5分 ÷ (4 × 12.5分) ＝ 46.5 ÷ 50 ＝ 0.93 (93.0%)",
      "93.0%は「90.0 ％以上」に該当するため、選択肢エが正解です。"
    ],
    hasTable: true,
    tableData: [
      { no: "1", time: "11.3" },
      { no: "2", time: "11.2" },
      { no: "3", time: "12.5" },
      { no: "4", time: "11.5" }
    ]
  },
  {
    id: 10,
    year: "平成25年 第9問",
    title: "ラインバランシング",
    question: "混合品種組立ラインの編成を検討した結果、サイクルタイムを150秒、ステーション数を10とする案が提示された。生産される3種類の製品A、B、Cの総作業時間と1か月当たりの計画生産量は、以下の表に与えられている。この案の編成効率に最も近い値を、下記の解答群から選べ。\n\n【製品別データ】\n・製品A: 総作業時間 1,400秒/個、生産量 2,000個/月\n・製品B: 総作業時間 1,450秒/個、生産量 1,000個/月\n・製品C: 総作業時間 1,450秒/個、生産量 1,000個/月",
    options: [
      { key: "ア", text: "0.94" },
      { key: "イ", text: "0.95" },
      { key: "ウ", text: "0.96" },
      { key: "エ", text: "0.97" }
    ],
    answer: "イ",
    explanation: [
      "混合品種組立ラインにおけるライン編成効率を計算する応用問題です。",
      "複数品種が混在する場合、分子の「1個あたり作業時間」は、生産量で加重平均した「製品1個あたりの平均作業時間」を求めます。",
      "1. 製品1個あたりの平均作業時間の計算：",
      "総生産量 ＝ 2,000 + 1,000 + 1,000 ＝ 4,000個",
      "全製品の総作業時間の合計 ＝ (1,400 × 2,000) + (1,450 × 1,000) + (1,450 × 1,000)",
      "＝ 2,800,000 + 1,450,000 + 1,450,000 ＝ 5,700,000秒",
      "平均作業時間 ＝ 5,700,000秒 ÷ 4,000個 ＝ 1,425秒/個",
      "2. 編成効率の計算：",
      "編成効率 ＝ 平均作業時間 ÷ (サイクルタイム × 作業ステーション数)",
      "＝ 1,425秒 ÷ (150秒 × 10ステーション) ＝ 1,425 ÷ 1,500 ＝ 0.95 (95%)",
      "よって、最も近い値は0.95となり、選択肢イが正解です。"
    ],
    hasTable: true,
    tableData2: [
      { name: "総作業時間 (秒／個)", a: "1,400", b: "1,450", c: "1,450" },
      { name: "生産量 (個／月)", a: "2,000", b: "1,000", c: "1,000" }
    ]
  }
];

// ==========================================
// COMPONENT MAIN
// ==========================================
export default function App() {
  // Authentication & Loading states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userIdInput, setUserIdInput] = useState("");

  // Navigation state: 'login' | 'menu' | 'quiz' | 'result' | 'history'
  const [view, setView] = useState("login");

  // User Progress and Performance states
  const [wrongQuestions, setWrongQuestions] = useState([]); // List of question IDs failed in the last attempt
  const [reviewQuestions, setReviewQuestions] = useState([]); // List of question IDs flagged for review
  const [historyLogs, setHistoryLogs] = useState([]); // Array of { timestamp, mode, score, total }

  // Resume State (Mid-way checkpoint tracking)
  const [savedProgress, setSavedProgress] = useState(null);

  // Active Quiz State
  const [quizMode, setQuizMode] = useState("all"); // 'all' | 'wrong' | 'review'
  const [currentQuestionsList, setCurrentQuestionsList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionWrongIds, setSessionWrongIds] = useState([]);

  // ==========================================
  // FIREBASE OPERATIONS & EFFECTS
  // ==========================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Firebase: Executing anonymous sign-in...");
        await signInAnonymously(auth);
        console.log("Firebase: Anonymous sign-in successful.");
      } catch (error) {
        console.error("Firebase: Sign-in failure", error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  // Fetch or setup userdata when User ID / Keyphrase is assigned
  const handleConnectUser = async (e) => {
    e.preventDefault();
    if (!userIdInput.trim()) return;

    const targetUserId = userIdInput.trim();
    setIsLoading(true);
    console.log(`Cloud: Fetching profile data for user key [${targetUserId}]`);

    try {
      const userDocRef = doc(db, APP_ID, targetUserId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Cloud: Existing profile record found", data);
        setWrongQuestions(data.wrongQuestions || []);
        setReviewQuestions(data.reviewQuestions || []);
        setHistoryLogs(data.historyLogs || []);

        if (data.progressIndex !== undefined && data.progressIndex !== null && data.progressMode) {
          console.log(`Cloud: Active midway checkpoint detected at Index ${data.progressIndex}, Mode [${data.progressMode}]`);
          setSavedProgress({
            index: data.progressIndex,
            mode: data.progressMode
          });
        } else {
          setSavedProgress(null);
        }
      } else {
        console.log("Cloud: No existing record found. Allocating new profile workspace.");
        setWrongQuestions([]);
        setReviewQuestions([]);
        setHistoryLogs([]);
        setSavedProgress(null);
      }

      setUserId(targetUserId);
      setIsAuthenticated(true);
      setView("menu");
    } catch (err) {
      console.error("Cloud: Failed to fetch profile datasets", err);
      // Fail-safe default fallback configuration
      setUserId(targetUserId);
      setIsAuthenticated(true);
      setView("menu");
    } finally {
      setIsLoading(false);
    }
  };

  // Synchronize dynamic user changes to Firestore backend Cloud Storage
  const syncUserDataToCloud = async (updatedWrong, updatedReview, updatedLogs, checkpointIndex = null, checkpointMode = null) => {
    if (!userId) return;
    try {
      console.log("Cloud: Committing state snapshot synchronization up to Cloud...");
      const userDocRef = doc(db, APP_ID, userId);
      
      const payload = {
        wrongQuestions: updatedWrong !== null ? updatedWrong : wrongQuestions,
        reviewQuestions: updatedReview !== null ? updatedReview : reviewQuestions,
        historyLogs: updatedLogs !== null ? updatedLogs : historyLogs,
        progressIndex: checkpointIndex,
        progressMode: checkpointMode
      };

      await setDoc(userDocRef, payload, { merge: true });
      console.log("Cloud: Sync committed successfully.");
    } catch (error) {
      console.error("Cloud: Critical synchronization failure", error);
    }
  };

  // Toggle state of question in review flagging criteria array
  const handleToggleReviewFlag = async (questionId) => {
    let updatedReview;
    if (reviewQuestions.includes(questionId)) {
      updatedReview = reviewQuestions.filter(id => id !== questionId);
    } else {
      updatedReview = [...reviewQuestions, questionId];
    }
    setReviewQuestions(updatedReview);
    // Persist current session index state while modifying flags on active screens
    const trackingIdx = view === "quiz" ? currentQuizIndex : null;
    const trackingMode = view === "quiz" ? quizMode : null;
    await syncUserDataToCloud(null, updatedReview, null, trackingIdx, trackingMode);
  };

  // ==========================================
  // CORE QUIZ CONTROLLER ENGINE LOGICS
  // ==========================================
  const initiateQuizSession = (mode, resumeFromIndex = 0) => {
    console.log(`Engine: Building quiz stack using Mode [${mode}] at index [${resumeFromIndex}]`);
    let targetDataset = [];

    if (mode === "all") {
      targetDataset = [...quizQuestions];
    } else if (mode === "wrong") {
      targetDataset = quizQuestions.filter(q => wrongQuestions.includes(q.id));
    } else if (mode === "review") {
      targetDataset = quizQuestions.filter(q => reviewQuestions.includes(q.id));
    }

    if (targetDataset.length === 0) {
      alert("該当する問題がありません。別モードを選択してください。");
      return;
    }

    setQuizMode(mode);
    setCurrentQuestionsList(targetDataset);
    setCurrentQuizIndex(resumeFromIndex);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    if (resumeFromIndex === 0) {
      setSessionCorrectCount(0);
      setSessionWrongIds([]);
    }

    setView("quiz");
    // Write modern active progress reference state directly into cache
    syncUserDataToCloud(null, null, null, resumeFromIndex, mode);
  };

  const handleSelectAnswerOption = (key) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(key);
  };

  const handleSubmitAnswerEvaluation = async () => {
    if (!selectedAnswer || isAnswerSubmitted) return;

    const activeQuestion = currentQuestionsList[currentQuizIndex];
    const isCorrect = selectedAnswer === activeQuestion.answer;
    
    console.log(`Engine: Question ID ${activeQuestion.id} checked. Result: ${isCorrect ? "CORRECT" : "WRONG"}`);

    let updatedSessionWrong = [...sessionWrongIds];
    let nextCorrectCount = sessionCorrectCount;

    if (isCorrect) {
      nextCorrectCount += 1;
    } else {
      if (!updatedSessionWrong.includes(activeQuestion.id)) {
        updatedSessionWrong.push(activeQuestion.id);
      }
    }

    setSessionCorrectCount(nextCorrectCount);
    setSessionWrongIds(updatedSessionWrong);
    setIsAnswerSubmitted(true);

    // Dynamic incremental save tracking state
    await syncUserDataToCloud(null, null, null, currentQuizIndex, quizMode);
  };

  const handleAdvanceQuizRouting = async () => {
    const nextIndex = currentQuizIndex + 1;

    if (nextIndex < currentQuestionsList.length) {
      setCurrentQuizIndex(nextIndex);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      // Synchronize continuous progression state directly up into DB
      await syncUserDataToCloud(null, null, null, nextIndex, quizMode);
    } else {
      // Completed last element in current collection
      console.log("Engine: Reached end of current operational target dataset.");
      
      // Merge current failures, remove successfully completed questions from historic failures lists
      let finalWrongList = [...wrongQuestions];
      
      // Remove any questions from the historical wrong list if they were present in this session but not failed again
      currentQuestionsList.forEach(q => {
        if (sessionWrongIds.includes(q.id)) {
          if (!finalWrongList.includes(q.id)) {
            finalWrongList.push(q.id);
          }
        } else {
          finalWrongList = finalWrongList.filter(id => id !== q.id);
        }
      });

      // Construct metrics outcome logger item object
      const newLogItem = {
        timestamp: new Date().toLocaleString("ja-JP"),
        mode: quizMode === "all" ? "すべての問題" : quizMode === "wrong" ? "前回不正解の問題" : "要復習の問題",
        score: sessionCorrectCount,
        total: currentQuestionsList.length
      };

      const updatedHistoryLogs = [newLogItem, ...historyLogs];

      setWrongQuestions(finalWrongList);
      setHistoryLogs(updatedHistoryLogs);
      setSavedProgress(null); // Clear active midway recovery reference on absolute completion
      setView("result");

      await syncUserDataToCloud(finalWrongList, null, updatedHistoryLogs, null, null);
    }
  };

  const handleAbruptHaltReturnHome = async () => {
    // Preserve current position index state when using top level exit buttons back to Main Dashboard
    console.log(`Engine: Dashboard redirect triggered. Caching mid-way session state at index ${currentQuizIndex}`);
    await syncUserDataToCloud(null, null, null, currentQuizIndex, quizMode);
    
    // Refresh local metadata cache snapshot view profiles before switching layouts
    setSavedProgress({ index: currentQuizIndex, mode: quizMode });
    setView("menu");
  };

  const handlePurgeResetProgress = async () => {
    console.log("Engine: Reset progress command triggered.");
    setSavedProgress(null);
    await syncUserDataToCloud(null, null, null, null, null);
    initiateQuizSession(savedProgress?.mode || "all", 0);
  };

  // ==========================================
  // RENDER INTERFACES PLUGINS
  // ==========================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium animate-pulse">データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100">
      {/* GLOBAL BRAND HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => isAuthenticated && setView("menu")}>
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-lg text-white shadow-md shadow-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 tracking-tight text-sm md:text-base">生産管理と生産方式</h1>
              <p className="text-xs text-slate-500 font-medium">過去問セレクト演習</p>
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ID: {userId}
                </span>
              </div>
              <button 
                onClick={() => {
                  setUserId("");
                  setUserIdInput("");
                  setIsAuthenticated(false);
                  setView("login");
                }}
                className="text-xs text-slate-500 hover:text-red-500 px-2 py-1 rounded transition border border-transparent hover:border-slate-200"
              >
                切替
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        
        {/* VIEW 1: SIGN IN USER GATEWAY */}
        {view === "login" && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 md:p-8 mt-4 md:mt-10">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">学習同期ログイン</h2>
              <p className="text-sm text-slate-500 mt-1">
                「合言葉」を設定・入力することで、複数端末間で学習進捗・復習フラグを完全同期できます。
              </p>
            </div>

            <form onSubmit={handleConnectUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ユーザーID または 合言葉
                </label>
                <input 
                  type="text"
                  required
                  placeholder="例: user_tanaka_77"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>学習を開始する</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: DASHBOARD MENU HOME PANEL */}
        {view === "menu" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* MIDWAY RESUME INTERCEPT CHECKPOINT BANNER */}
            {savedProgress && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-amber-500 text-white rounded-lg mt-0.5 shadow-sm">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900">中断データが見つかりました</h3>
                    <p className="text-sm text-amber-800 mt-0.5">
                      前回は【
                      <span className="font-semibold">
                        {savedProgress.mode === "all" ? "すべての問題" : savedProgress.mode === "wrong" ? "前回不正解" : "要復習"}
                      </span>
                      】モードの <span className="font-bold text-base text-amber-900">問題 {savedProgress.index + 1}</span> から出題開始されます。続きから再開しますか？
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => handlePurgeResetProgress()}
                    className="flex-1 md:flex-none text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 transition shadow-sm hover:bg-slate-50"
                  >
                    最初から始める
                  </button>
                  <button
                    onClick={() => initiateQuizSession(savedProgress.mode, savedProgress.index)}
                    className="flex-1 md:flex-none text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl px-4 py-2.5 shadow-md transition transform active:scale-95 flex items-center justify-center space-x-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>続きから再開する</span>
                  </button>
                </div>
              </div>
            )}

            {/* PERFORMANCE COUNTER HUD */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center space-x-3">
                <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg">
                  <List className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 block">総問題数</span>
                  <span className="text-xl font-bold text-slate-900">{quizQuestions.length} 問</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center space-x-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 block">要復習登録</span>
                  <span className="text-xl font-bold text-red-600">{reviewQuestions.length} 問</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm col-span-2 md:col-span-1 flex items-center space-x-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 block">前回不正解</span>
                  <span className="text-xl font-bold text-amber-600">{wrongQuestions.length} 問</span>
                </div>
              </div>
            </div>

            {/* MODE SELECTOR WORKSPACES */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <span>出題モードの選択</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* MODE A: ALL */}
                <button
                  onClick={() => initiateQuizSession("all", 0)}
                  className="group relative text-left p-5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-indigo-500 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">すべての問題</h4>
                    <p className="text-xs text-slate-500 mt-1">収録されている全 {quizQuestions.length} 問を最初から順番に学習します。</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 mt-4 flex items-center group-hover:translate-x-1 transition-transform">
                    <span>開始する</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </button>

                {/* MODE B: WRONG */}
                <button
                  onClick={() => initiateQuizSession("wrong", 0)}
                  disabled={wrongQuestions.length === 0}
                  className={`group relative text-left p-5 border rounded-xl flex flex-col justify-between transition ${
                    wrongQuestions.length === 0 
                      ? "opacity-50 bg-slate-100 border-slate-200 cursor-not-allowed" 
                      : "bg-slate-50 border-slate-200 hover:bg-white hover:border-amber-500 hover:shadow-md"
                  }`}
                >
                  <div>
                    <h4 className={`font-bold ${wrongQuestions.length === 0 ? "text-slate-400" : "text-slate-900 group-hover:text-amber-600"}`}>
                      前回不正解の問題のみ
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">直前の挑戦で間違えた問題（現在 {wrongQuestions.length} 問）を優先履修します。</p>
                  </div>
                  {wrongQuestions.length > 0 && (
                    <span className="text-xs font-bold text-amber-600 mt-4 flex items-center group-hover:translate-x-1 transition-transform">
                      <span>開始する</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  )}
                </button>

                {/* MODE C: REVIEW */}
                <button
                  onClick={() => initiateQuizSession("review", 0)}
                  disabled={reviewQuestions.length === 0}
                  className={`group relative text-left p-5 border rounded-xl flex flex-col justify-between transition ${
                    reviewQuestions.length === 0 
                      ? "opacity-50 bg-slate-100 border-slate-200 cursor-not-allowed" 
                      : "bg-slate-50 border-slate-200 hover:bg-white hover:border-red-500 hover:shadow-md"
                  }`}
                >
                  <div>
                    <h4 className={`font-bold ${reviewQuestions.length === 0 ? "text-slate-400" : "text-slate-900 group-hover:text-red-600"}`}>
                      要復習の問題のみ
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">解説画面で「要復習」チェックを付けた問題（現在 {reviewQuestions.length} 問）を出題します。</p>
                  </div>
                  {reviewQuestions.length > 0 && (
                    <span className="text-xs font-bold text-red-600 mt-4 flex items-center group-hover:translate-x-1 transition-transform">
                      <span>開始する</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* HISTORIC ACTIVITY PERFORMANCE LOGS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">過去の正誤・学習履歴</h3>
                <button 
                  onClick={() => setView("history")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-0.5"
                >
                  <span>詳細・グラフを表示</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {historyLogs.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                  まだ演習履歴がありません。クイズを完了するとここにスコアが記録されます。
                </div>
              ) : (
                <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
                  {historyLogs.slice(0, 3).map((log, idx) => {
                    const pct = log.total > 0 ? Math.round((log.score / log.total) * 100) : 0;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 transition text-xs md:text-sm">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 block">{log.mode}</span>
                          <span className="text-xs text-slate-400">{log.timestamp}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">{log.score} / {log.total} 正解</span>
                          <span className={`text-xs font-bold ${pct >= 80 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-500"}`}>
                            正解率: {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: LIVE ACTIVE QUIZ RUNNER INTERFACE */}
        {view === "quiz" && (() => {
          const activeQuestion = currentQuestionsList[currentQuizIndex];
          if (!activeQuestion) return <div className="text-center py-10">問題スタックエラー</div>;
          
          return (
            <div className="space-y-6 animate-fadeIn">
              
              {/* SESSION TRACKING TOPBAR */}
              <div className="flex justify-between items-center bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleAbruptHaltReturnHome()}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition"
                    title="ダッシュボードに戻る（進捗は自動保存）"
                  >
                    <Home className="w-5 h-5" />
                  </button>
                  <div className="h-4 w-px bg-slate-200"></div>
                  <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">
                    {quizMode === "all" ? "すべての問題" : quizMode === "wrong" ? "前回不正解のみ" : "要復習のみ"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs md:text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                    {currentQuizIndex + 1} / {currentQuestionsList.length} 問目
                  </span>
                </div>
              </div>

              {/* CARD: MAIN QUESTION BODY */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-slate-900 text-slate-100 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold">
                      {activeQuestion.year}
                    </span>
                    <span className="text-slate-300 font-medium">
                      {activeQuestion.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleReviewFlag(activeQuestion.id)}
                    className={`px-3 py-1 rounded-md transition flex items-center space-x-1 border ${
                      reviewQuestions.includes(activeQuestion.id)
                        ? "bg-red-950/40 border-red-800 text-red-400"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[11px]">
                      {reviewQuestions.includes(activeQuestion.id) ? "要復習マーク中" : "要復習にする"}
                    </span>
                  </button>
                </div>

                <div className="p-5 md:p-6 space-y-6">
                  {/* QUESTION HEADER PROSE */}
                  <div className="text-slate-900 font-medium text-base leading-relaxed whitespace-pre-wrap">
                    {activeQuestion.question}
                  </div>

                  {/* DATA TABLE REPRODUCTIONS IF DEFINED */}
                  {activeQuestion.id === 9 && activeQuestion.hasTable && (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl my-4">
                      <table className="w-full text-center text-xs md:text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                            <th className="py-2.5 px-4">ワークステーションNo.</th>
                            <th className="py-2.5 px-4">作業時間（分）</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white text-slate-800 font-medium">
                          {activeQuestion.tableData?.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-4">{row.no}</td>
                              <td className="py-2.5 px-4 font-mono">{row.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeQuestion.id === 10 && activeQuestion.hasTable && (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl my-4">
                      <table className="w-full text-center text-xs md:text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                            <th className="py-2.5 px-4 text-left">指標</th>
                            <th className="py-2.5 px-4">製品 A</th>
                            <th className="py-2.5 px-4">製品 B</th>
                            <th className="py-2.5 px-4">製品 C</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white text-slate-800 font-medium">
                          {activeQuestion.tableData2?.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-4 text-left font-semibold bg-slate-50/50 text-slate-700">{row.name}</td>
                              <td className="py-2.5 px-4 font-mono">{row.a}</td>
                              <td className="py-2.5 px-4 font-mono">{row.b}</td>
                              <td className="py-2.5 px-4 font-mono">{row.c}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SELECTABLE OPTION TRACK BUTTONS CONTAINER */}
                  <div className="space-y-3 pt-2">
                    {activeQuestion.options.map((opt) => {
                      const isSelected = selectedAnswer === opt.key;
                      const isCorrectAnswer = opt.key === activeQuestion.answer;
                      
                      let optionStyle = "border-slate-200 bg-slate-50/50 text-slate-800 hover:bg-slate-50 hover:border-slate-300";
                      
                      if (isAnswerSubmitted) {
                        if (isCorrectAnswer) {
                          optionStyle = "border-green-500 bg-green-50 text-green-900 font-medium shadow-sm shadow-green-100";
                        } else if (isSelected) {
                          optionStyle = "border-red-500 bg-red-50 text-red-900 font-medium shadow-sm shadow-red-100";
                        } else {
                          optionStyle = "border-slate-100 bg-white text-slate-400 opacity-60";
                        }
                      } else if (isSelected) {
                        optionStyle = "border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold shadow-sm";
                      }

                      return (
                        <button
                          key={opt.key}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleSelectAnswerOption(opt.key)}
                          className={`w-full text-left p-4 rounded-xl border transition flex items-start space-x-3 text-sm md:text-base ${optionStyle}`}
                        >
                          <span className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold border font-mono mt-0.5 ${
                            isSelected 
                              ? "bg-indigo-600 text-white border-indigo-600" 
                              : isAnswerSubmitted && isCorrectAnswer
                              ? "bg-green-600 text-white border-green-600"
                              : "bg-white text-slate-600 border-slate-300"
                          }`}>
                            {opt.key}
                          </span>
                          <span className="leading-relaxed flex-1">{opt.text}</span>
                          
                          {isAnswerSubmitted && isCorrectAnswer && (
                            <Check className="w-5 h-5 text-green-600 shrink-0 self-center" />
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                            <X className="w-5 h-5 text-red-500 shrink-0 self-center" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* ACTION FOOTER SUBMIT/ADVANCE TRIGGER CONTROLS */}
                  <div className="pt-2">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitAnswerEvaluation}
                        disabled={!selectedAnswer}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-center transition tracking-wide text-sm ${
                          selectedAnswer
                            ? "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white shadow-md active:scale-[0.99] transform"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        解答を確定する
                      </button>
                    ) : (
                      <button
                        onClick={handleAdvanceQuizRouting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition transform active:scale-[0.99] flex items-center justify-center space-x-2 text-sm"
                      >
                        <span>
                          {currentQuizIndex + 1 === currentQuestionsList.length ? "結果画面へ進む" : "次の問題へ進む"}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD: EXPANDED DETAILED FEEDBACK PANEL EXPLANATION */}
              {isAnswerSubmitted && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-md border-l-4 border-l-slate-800">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm md:text-base border-b border-slate-100 pb-3 mb-3">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>正解・解説</span>
                    <span className="ml-2 font-mono text-xs text-white bg-slate-800 px-2 py-0.5 rounded font-bold">
                      解答: {activeQuestion.answer}
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-700 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {activeQuestion.explanation.map((line, lIdx) => (
                      <p key={lIdx} className={line.startsWith("・") || line.includes("【適切】") || line.includes("【不適切】") ? "pl-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                    <span className="text-xs text-slate-500 font-medium">もう一度この問題をチェックしますか？</span>
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={reviewQuestions.includes(activeQuestion.id)}
                        onChange={() => handleToggleReviewFlag(activeQuestion.id)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-xs font-bold text-red-600">要復習リストに追加</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* VIEW 4: PERFORMANCE SUMMARY RESULTS SCREEN */}
        {view === "result" && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 md:p-8 text-center space-y-6">
            <div className="inline-flex p-4 bg-green-50 text-green-600 rounded-full shadow-inner">
              <Award className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">演習が完了しました！</h2>
              <p className="text-sm text-slate-500 mt-1">今回のセッションスコアは以下の通りです。</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">正解数 / 出題数</div>
              <div className="text-4xl font-extrabold text-slate-900 my-1">
                {sessionCorrectCount} <span className="text-xl font-normal text-slate-400">/</span> {currentQuestionsList.length}
              </div>
              <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block mt-1">
                正解率: {currentQuestionsList.length > 0 ? Math.round((sessionCorrectCount / currentQuestionsList.length) * 100) : 0}%
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              間違えた問題は自動的に「前回不正解の問題」リストに集計されます。繰り返し学習して克服しましょう。
            </p>

            <div className="pt-2 flex flex-col space-y-2">
              <button
                onClick={() => setView("menu")}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition transform active:scale-95 flex items-center justify-center space-x-2 text-sm"
              >
                <Home className="w-4 h-4" />
                <span>メインメニューに戻る</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 5: COMPREHENSIVE PERFORMANCE HISTORIC DATA VISUALIZATION */}
        {view === "history" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-sm">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setView("menu")}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition"
                >
                  <Home className="w-5 h-5" />
                </button>
                <div className="h-4 w-px bg-slate-200"></div>
                <h2 className="text-sm font-bold text-slate-800">学習履歴アナリティクス</h2>
              </div>
            </div>

            {/* CHARTS METRICS VISUALIZATION ROW */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">直近の正解率トレンド (%)</h3>
              {historyLogs.length === 0 ? (
                <div className="text-center py-10 text-sm text-slate-400">データが不足しています</div>
              ) : (
                <div className="w-full h-64 pr-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[...historyLogs].reverse().slice(-7).map((log, idx) => ({
                        name: `演習 ${idx + 1}`,
                        正解率: log.total > 0 ? Math.round((log.score / log.total) * 100) : 0
                      }))}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="正解率" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* COMPLETE ITERATIVE ROW ITEM ARCHIVE TABLE LIST */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">全演習履歴ログ</h3>
              </div>

              {historyLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">履歴はありません</div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {historyLogs.map((log, idx) => {
                    const rate = log.total > 0 ? Math.round((log.score / log.total) * 100) : 0;
                    return (
                      <div key={idx} className="p-4 flex justify-between items-center text-xs md:text-sm hover:bg-slate-50/60 transition">
                        <div>
                          <p className="font-bold text-slate-900">{log.mode}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{log.timestamp}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-slate-900">{log.score} / {log.total} 正解</p>
                          <p className={`text-xs font-semibold mt-0.5 ${rate >= 80 ? "text-green-600" : rate >= 50 ? "text-amber-600" : "text-red-500"}`}>
                            正解率: {rate}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <footer className="max-w-4xl mx-auto text-center py-8 px-4 text-xs text-slate-400 font-medium">
        &copy; 2026 中小企業診断士試験 過去問演習システム / APP_ID: {APP_ID}
      </footer>
    </div>
  );
}