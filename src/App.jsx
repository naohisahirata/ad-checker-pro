import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ArrowRightLeft,
  FileText,
  History,
  UserCheck,
  Search,
  Plus,
  ArrowLeft,
  Info,
  ExternalLink,
  ChevronRight,
  Send,
  Check,
  Upload,
  X,
  FileUp,
  Building2,
  Calendar
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState('list'); // 'list', 'editor', 'registration'
  const [selectedAd, setSelectedAd] = useState(null);

  // 案件データをステートで管理
  const [ads, setAds] = useState([
    { id: 1, title: '代官山レジデンス 3F', type: 'チラシ', status: '校正中', progress: 65, date: '2023-10-25', priority: '高' },
    { id: 2, title: '新宿パークタワー 15F', type: 'Webバナー', status: '未着手', progress: 0, date: '2023-10-26', priority: '中' },
    { id: 3, title: '恵比寿ガーデンフラット', type: 'ポータルサイト', status: '再確認中', progress: 90, date: '2023-10-24', priority: '高' },
    { id: 4, title: '世田谷テラスハウス', type: 'チラシ', status: '完了', progress: 100, date: '2023-10-23', priority: '低' },
  ]);

  const handleOpenAd = (ad) => {
    setSelectedAd(ad);
    setView('editor');
  };

  const handleRegister = (newAd) => {
    const adWithId = { ...newAd, id: ads.length + 1, progress: 0, status: '未着手' };
    setAds([adWithId, ...ads]);
    setView('list');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('list')}>
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ClipboardCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">AdChecker <span className="text-blue-600">PRO</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
            K
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        {view === 'list' && (
          <Dashboard ads={ads} onOpen={handleOpenAd} onStartRegistration={() => setView('registration')} />
        )}
        {view === 'editor' && (
          <ProofreadingEditor ad={selectedAd} onBack={() => setView('list')} />
        )}
        {view === 'registration' && (
          <RegistrationForm onBack={() => setView('list')} onRegister={handleRegister} />
        )}
      </main>
    </div>
  );
};

// --- サブコンポーネント: ダッシュボード ---
const Dashboard = ({ ads, onOpen, onStartRegistration }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">案件一覧</h2>
          <p className="text-slate-500">現在 {ads.length} 件の校正タスクがあります</p>
        </div>
        <button
          onClick={onStartRegistration}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" /> 新規案件を登録
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="未着手" value={ads.filter(a => a.status === '未着手').length} color="bg-slate-400" />
        <StatCard title="校正中" value={ads.filter(a => a.status === '校正中').length} color="bg-amber-500" />
        <StatCard title="修正依頼中" value={ads.filter(a => a.status === '再確認中').length} color="bg-rose-500" />
        <StatCard title="完了" value={ads.filter(a => a.status === '完了').length} color="bg-emerald-500" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
            <tr>
              <th className="px-6 py-4 font-semibold">物件名 / 媒体</th>
              <th className="px-6 py-4 font-semibold">ステータス</th>
              <th className="px-6 py-4 font-semibold">進捗</th>
              <th className="px-6 py-4 font-semibold">期限</th>
              <th className="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ads.map((ad) => (
              <tr key={ad.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{ad.title}</div>
                  <div className="text-xs text-slate-400">{ad.type}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ad.status === '完了' ? 'bg-emerald-100 text-emerald-700' :
                    ad.status === '校正中' ? 'bg-amber-100 text-amber-700' :
                    ad.status === '再確認中' ? 'bg-rose-100 text-rose-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {ad.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${ad.progress}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{ad.date}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onOpen(ad)}
                    className="text-blue-600 font-medium hover:underline flex items-center gap-1 ml-auto"
                  >
                    {ad.status === '完了' ? '詳細を見る' : '校正を開始'} <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div className={`w-3 h-12 ${color} rounded-full opacity-20`} />
  </div>
);

// --- サブコンポーネント: 案件登録フォーム ---
const RegistrationForm = ({ onBack, onRegister }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'チラシ',
    priority: '中',
    date: '',
    files: {
      draft: null,
      source: null
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;
    onRegister(formData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">新規案件の登録</h2>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* 基本情報セクション */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold border-b border-slate-100 pb-2">
              <Building2 className="w-5 h-5" />
              <h3>基本情報</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-700">物件名・案件タイトル</label>
                <input
                  type="text"
                  placeholder="例：代官山レジデンス 3F リニューアル告知"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">広告媒体</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>チラシ</option>
                  <option>ポータルサイト</option>
                  <option>Webバナー</option>
                  <option>SNS広告</option>
                  <option>パンフレット</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">校正期限</label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
            </div>
          </section>

          {/* アップロードセクション */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 font-bold border-b border-slate-100 pb-2">
              <FileUp className="w-5 h-5" />
              <h3>データのアップロード</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 元データアップロード */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    元資料 (物件概要書等) <span className="text-rose-500">*</span>
                  </label>
                  <Info className="w-4 h-4 text-slate-400" />
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                  <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">クリックしてファイルをアップロード</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, Excel, スプレッドシートURL</p>
                </div>
              </div>

              {/* 校正対象原稿アップロード */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    校正対象 (制作原稿) <span className="text-rose-500">*</span>
                  </label>
                  <Info className="w-4 h-4 text-slate-400" />
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group">
                  <div className="bg-emerald-100 text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">クリックしてファイルをアップロード</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG, Figmaリンク</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-bold">AI自動照合のヒント</p>
                <p>元資料に物件概要書をアップロードすると、AIが徒歩分数、面積、所在地、取引態様を自動抽出し、原稿との整合性を即座にチェックします。</p>
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
            >
              案件を登録して解析開始
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- サブコンポーネント: 校正エディタ ---
const ProofreadingEditor = ({ ad, onBack }) => {
  const [activeTab, setActiveTab] = useState('auto-check'); // 'auto-check', 'manual', 'history'

  // 校正項目モック
  const checks = [
    { id: 1, category: '必須表記', item: '取引態様', status: 'ok', value: '媒介', source: '媒介' },
    { id: 2, category: '数値整合', item: '徒歩分数', status: 'error', value: '徒歩5分', source: '徒歩8分', msg: '元資料と3分の乖離があります' },
    { id: 3, category: '数値整合', item: '面積', status: 'ok', value: '65.50㎡', source: '65.50㎡' },
    { id: 4, category: '表現チェック', item: '誇大表現', status: 'warning', value: '地域格安', msg: '「格安」は使用制限があります' },
    { id: 5, category: '表現チェック', item: '最強表現', status: 'warning', value: '最高級の設備', msg: '根拠のない「最高」はNGです' },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{ad.title}</h2>
            <p className="text-sm text-slate-500">制作：佐藤クリエイティブ / {ad.date} 提出</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-white transition-colors">
            修正依頼を送る
          </button>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> 掲載OK（承認）
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left: Viewport (Original & Draft Side-by-Side) */}
        <div className="flex-[3] bg-slate-200 rounded-xl overflow-hidden border border-slate-300 relative flex flex-col">
          <div className="bg-slate-800 text-white px-4 py-2 flex justify-between text-xs font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 opacity-70"><FileText className="w-3 h-3" /> 元資料 (物件概要書)</span>
              <ArrowRightLeft className="w-3 h-3" />
              <span className="flex items-center gap-1 text-blue-300"><FileText className="w-3 h-3" /> 提出原稿 ({ad.type})</span>
            </div>
            <div className="flex gap-2">
              <button className="bg-white/10 px-2 py-0.5 rounded hover:bg-white/20">拡大</button>
              <button className="bg-white/10 px-2 py-0.5 rounded hover:bg-white/20">差分抽出</button>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-px bg-slate-400 overflow-auto">
            {/* Mock Original Content */}
            <div className="bg-white p-8">
              <div className="border-4 border-slate-100 p-6 space-y-4">
                <h3 className="text-lg font-bold border-b-2 border-slate-900 pb-2">物件概要書</h3>
                <div className="grid grid-cols-3 text-sm gap-2">
                  <div className="bg-slate-100 p-2 font-bold">物件名</div>
                  <div className="col-span-2 p-2">{ad.title}</div>
                  <div className="bg-slate-100 p-2 font-bold">交通</div>
                  <div className="col-span-2 p-2 underline decoration-red-500 decoration-2">代官山駅 徒歩8分</div>
                  <div className="bg-slate-100 p-2 font-bold">面積</div>
                  <div className="col-span-2 p-2">65.50㎡</div>
                </div>
              </div>
            </div>
            {/* Mock Draft Content */}
            <div className="bg-white p-8">
              <div className="relative border shadow-xl max-w-sm mx-auto p-4 flex flex-col items-center text-center space-y-4">
                <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-slate-400">
                  <Info className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="text-xl font-black text-blue-900">{ad.title}</h3>
                <div className="bg-rose-600 text-white px-3 py-1 text-sm font-bold rotate-[-2deg]">
                  地域格安物件！
                </div>
                <p className="text-2xl font-bold text-slate-800 italic">最高級の設備をあなたに</p>
                <div className="text-sm space-y-1">
                  <p className="border-b border-rose-400 bg-rose-50 px-1 inline-block">東急東横線「代官山」駅 徒歩5分</p>
                  <p>専有面積：65.50㎡</p>
                </div>
                <div className="absolute top-2 right-2 bg-amber-400 text-[10px] p-1 font-bold">Draft v2</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Inspection Sidebar */}
        <div className="flex-[1.5] flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('auto-check')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'auto-check' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              AI自動照合
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'manual' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              チェックリスト
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              履歴
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'auto-check' && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">不整合・NG警告 ({checks.filter(c => c.status !== 'ok').length})</span>
                  <button className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">再スキャン</button>
                </div>

                {checks.map((check) => (
                  <div
                    key={check.id}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      check.status === 'error' ? 'bg-rose-50 border-rose-200 shadow-sm' :
                      check.status === 'warning' ? 'bg-amber-50 border-amber-200 shadow-sm' :
                      'bg-slate-50 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        check.status === 'error' ? 'bg-rose-600 text-white' :
                        check.status === 'warning' ? 'bg-amber-500 text-white' :
                        'bg-slate-400 text-white'
                      }`}>
                        {check.category}
                      </span>
                      {check.status === 'ok' && <Check className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <div className="font-bold flex items-center justify-between">
                      {check.item}
                      {check.status !== 'ok' && (
                        <button className="text-[10px] text-blue-600 flex items-center gap-1">修正依頼に追加 <Plus className="w-3 h-3"/></button>
                      )}
                    </div>
                    <div className="mt-2 text-xs flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">原稿：</span>
                        <span className={check.status === 'error' ? 'text-rose-600 font-bold' : ''}>{check.value}</span>
                      </div>
                      {check.source && (
                        <div className="flex justify-between border-t border-slate-100 pt-1">
                          <span className="text-slate-400">元資料：</span>
                          <span className="text-slate-600 italic">{check.source}</span>
                        </div>
                      )}
                      {check.msg && (
                        <div className="mt-1 flex items-start gap-1 text-rose-700 font-medium">
                          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                          <span>{check.msg}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'manual' && (
              <div className="space-y-4">
                <div className="text-sm font-bold text-slate-600 border-b pb-2">共通確認事項</div>
                {[
                  '広告主の名称・住所の記載があるか',
                  '物件所在地の地番まで記載されているか',
                  '販売価格に消費税等が含まれているか',
                  '不当表示にあたる「業界No.1」等の文言はないか'
                ].map((text, i) => (
                  <label key={i} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer group">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{text}</span>
                  </label>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6 relative ml-4 before:absolute before:left-[-17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="relative">
                  <div className="absolute left-[-23px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-50" />
                  <div className="text-xs text-slate-400">今日 11:30</div>
                  <div className="text-sm font-bold">佐藤（制作）が v2 をアップロード</div>
                </div>
                <div className="relative">
                  <div className="absolute left-[-23px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white" />
                  <div className="text-xs text-slate-400">昨日 17:05</div>
                  <div className="text-sm font-bold">田中（校正）が修正依頼を送信</div>
                  <div className="text-xs bg-slate-100 p-2 mt-1 rounded italic text-slate-600">「徒歩分数に誤りがあります。概要書は8分です」</div>
                </div>
              </div>
            )}
          </div>

          {/* Comment input area */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="コメントを入力..."
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
