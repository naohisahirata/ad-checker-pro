import React, { useState } from 'react';
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  FileText,
  Search,
  Plus,
  ArrowLeft,
  Info,
  ChevronRight,
  Send,
  Check,
  Upload,
  FileUp,
  Building2,
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState('list');
  const [selectedAd, setSelectedAd] = useState(null);

  const [ads, setAds] = useState([
    { id: 1, title: '代官山レジデンス 3F', type: 'チラシ', status: '校正中', progress: 65, date: '2023-10-25', priority: '高' },
    { id: 2, title: '新宿パークタワー 15F', type: 'Webバナー', status: '未着手', progress: 0, date: '2023-10-26', priority: '中' },
    { id: 3, title: '恵比寿ガーデンフラット', type: 'ポータルサイト', status: '再確認中', progress: 90, date: '2023-10-24', priority: '高' },
    { id: 4, title: '世田谷テラスハウス', type: 'チラシ', status: '完了', progress: 100, date: '2023-10-23', priority: '低' },
  ]);

  const handleOpenAd = (ad) => { setSelectedAd(ad); setView('editor'); };
  const handleRegister = (newAd) => {
    setAds([{ ...newAd, id: ads.length + 1, progress: 0, status: '未着手' }, ...ads]);
    setView('list');
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #052e16 0%, #064e3b 50%, #065f46 100%)' }}>
      {/* Navigation */}
      <nav style={{ background: 'rgba(5, 46, 22, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(52, 211, 153, 0.15)' }}
        className="px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('list')}>
          <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 16px rgba(16,185,129,0.5)' }} className="p-2 rounded-xl">
            <ClipboardCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">
            AdChecker <span style={{ color: '#34d399' }}>PRO</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
            className="p-2 rounded-full transition-all hover:bg-emerald-500/20">
            <Search className="w-5 h-5 text-emerald-300" />
          </button>
          <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 12px rgba(16,185,129,0.4)' }}
            className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm">
            K
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        {view === 'list' && <Dashboard ads={ads} onOpen={handleOpenAd} onStartRegistration={() => setView('registration')} />}
        {view === 'editor' && <ProofreadingEditor ad={selectedAd} onBack={() => setView('list')} />}
        {view === 'registration' && <RegistrationForm onBack={() => setView('list')} onRegister={handleRegister} />}
      </main>
    </div>
  );
};

// --- ダッシュボード ---
const Dashboard = ({ ads, onOpen, onStartRegistration }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">案件一覧</h2>
        <p style={{ color: '#6ee7b7' }} className="mt-1">現在 {ads.length} 件の校正タスクがあります</p>
      </div>
      <button
        onClick={onStartRegistration}
        style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 24px rgba(16,185,129,0.4)' }}
        className="text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all hover:scale-105"
      >
        <Plus className="w-5 h-5" /> 新規案件を登録
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="未着手" value={ads.filter(a => a.status === '未着手').length} accent="#94a3b8" glow="rgba(148,163,184,0.3)" />
      <StatCard title="校正中" value={ads.filter(a => a.status === '校正中').length} accent="#f59e0b" glow="rgba(245,158,11,0.3)" />
      <StatCard title="再確認中" value={ads.filter(a => a.status === '再確認中').length} accent="#f43f5e" glow="rgba(244,63,94,0.3)" />
      <StatCard title="完了" value={ads.filter(a => a.status === '完了').length} accent="#10b981" glow="rgba(16,185,129,0.3)" />
    </div>

    <div style={{ background: 'rgba(5,46,22,0.6)', border: '1px solid rgba(52,211,153,0.15)', backdropFilter: 'blur(8px)' }}
      className="rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead style={{ borderBottom: '1px solid rgba(52,211,153,0.15)' }}>
          <tr>
            {['物件名 / 媒体', 'ステータス', '進捗', '期限', '操作'].map((h, i) => (
              <th key={h} style={{ color: '#6ee7b7' }}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad.id} style={{ borderTop: '1px solid rgba(52,211,153,0.08)' }}
              className="transition-all hover:bg-emerald-500/5 group">
              <td className="px-6 py-4">
                <div className="font-bold text-white">{ad.title}</div>
                <div style={{ color: '#6ee7b7' }} className="text-xs mt-0.5">{ad.type}</div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={ad.status} />
              </td>
              <td className="px-6 py-4">
                <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(52,211,153,0.15)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${ad.progress}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                </div>
                <div style={{ color: '#6ee7b7' }} className="text-xs mt-1">{ad.progress}%</div>
              </td>
              <td className="px-6 py-4 text-sm" style={{ color: '#a7f3d0' }}>{ad.date}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => onOpen(ad)}
                  style={{ color: '#34d399' }}
                  className="font-bold hover:underline flex items-center gap-1 ml-auto text-sm transition-all group-hover:gap-2">
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

const StatCard = ({ title, value, accent, glow }) => (
  <div style={{ background: 'rgba(5,46,22,0.6)', border: `1px solid ${accent}30`, backdropFilter: 'blur(8px)', boxShadow: `0 4px 24px ${glow}` }}
    className="p-5 rounded-2xl flex justify-between items-center">
    <div>
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{title}</p>
      <p className="text-4xl font-black text-white mt-1">{value}</p>
    </div>
    <div className="w-1 h-14 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${glow}` }} />
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    '完了':    { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
    '校正中':  { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
    '再確認中':{ bg: 'rgba(244,63,94,0.15)',  color: '#fb7185', border: 'rgba(244,63,94,0.3)' },
    '未着手':  { bg: 'rgba(148,163,184,0.15)',color: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
  };
  const s = map[status] || map['未着手'];
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      className="px-3 py-1 rounded-full text-xs font-bold">{status}</span>
  );
};

// --- 案件登録フォーム ---
const RegistrationForm = ({ onBack, onRegister }) => {
  const [formData, setFormData] = useState({ title: '', type: 'チラシ', priority: '中', date: '', files: { draft: null, source: null } });
  const handleSubmit = (e) => { e.preventDefault(); if (!formData.title || !formData.date) return; onRegister(formData); };

  const inputStyle = {
    background: 'rgba(5,46,22,0.6)',
    border: '1px solid rgba(52,211,153,0.2)',
    color: 'white',
    outline: 'none',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack}
          style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
          className="p-2 rounded-xl transition-all hover:bg-emerald-500/20">
          <ArrowLeft className="w-6 h-6 text-emerald-300" />
        </button>
        <h2 className="text-2xl font-black text-white">新規案件の登録</h2>
      </div>

      <div style={{ background: 'rgba(5,46,22,0.7)', border: '1px solid rgba(52,211,153,0.15)', backdropFilter: 'blur(12px)' }}
        className="rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid rgba(52,211,153,0.15)' }}>
              <Building2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-emerald-400">基本情報</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-emerald-300">物件名・案件タイトル</label>
                <input type="text" placeholder="例：代官山レジデンス 3F リニューアル告知"
                  style={inputStyle}
                  className="w-full px-4 py-2.5 rounded-xl placeholder-emerald-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-300">広告媒体</label>
                <select style={inputStyle} className="w-full px-4 py-2.5 rounded-xl appearance-none"
                  value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option style={{ background: '#052e16' }}>チラシ</option>
                  <option style={{ background: '#052e16' }}>ポータルサイト</option>
                  <option style={{ background: '#052e16' }}>Webバナー</option>
                  <option style={{ background: '#052e16' }}>SNS広告</option>
                  <option style={{ background: '#052e16' }}>パンフレット</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-300">校正期限</label>
                <input type="date" style={{ ...inputStyle, colorScheme: 'dark' }}
                  className="w-full px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid rgba(52,211,153,0.15)' }}>
              <FileUp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-emerald-400">データのアップロード</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: '元資料 (物件概要書等)', Icon: FileText, accent: '#10b981' },
                { label: '校正対象 (制作原稿)', Icon: Upload, accent: '#34d399' },
              ].map(({ label, Icon, accent }) => (
                <div key={label} className="space-y-3">
                  <label className="text-sm font-bold text-emerald-300 flex items-center gap-1">
                    {label} <span className="text-rose-400">*</span>
                  </label>
                  <div style={{ border: `2px dashed ${accent}40`, background: `${accent}08` }}
                    className="rounded-xl p-6 text-center cursor-pointer transition-all hover:border-emerald-400/60 hover:bg-emerald-500/10 group">
                    <div style={{ background: `${accent}20`, color: accent }}
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-emerald-200">クリックしてアップロード</p>
                    <p className="text-xs mt-1" style={{ color: '#6ee7b7' }}>PDF, Excel, PNG, Figmaリンク</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
              className="p-4 rounded-xl flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-200">
                <p className="font-bold">AI自動照合のヒント</p>
                <p className="mt-0.5 text-amber-300/80">物件概要書をアップロードすると、AIが徒歩分数・面積・所在地・取引態様を自動抽出し、原稿との整合性を即座にチェックします。</p>
              </div>
            </div>
          </section>

          <div className="pt-6 flex justify-end gap-3" style={{ borderTop: '1px solid rgba(52,211,153,0.1)' }}>
            <button type="button" onClick={onBack}
              style={{ border: '1px solid rgba(52,211,153,0.3)', color: '#6ee7b7' }}
              className="px-6 py-2.5 rounded-xl font-medium transition-all hover:bg-emerald-500/10">
              キャンセル
            </button>
            <button type="submit"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 24px rgba(16,185,129,0.4)' }}
              className="px-8 py-2.5 rounded-xl text-white font-black transition-all hover:scale-105">
              案件を登録して解析開始
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 校正エディタ ---
const ProofreadingEditor = ({ ad, onBack }) => {
  const [activeTab, setActiveTab] = useState('auto-check');
  const checks = [
    { id: 1, category: '必須表記', item: '取引態様', status: 'ok', value: '媒介', source: '媒介' },
    { id: 2, category: '数値整合', item: '徒歩分数', status: 'error', value: '徒歩5分', source: '徒歩8分', msg: '元資料と3分の乖離があります' },
    { id: 3, category: '数値整合', item: '面積', status: 'ok', value: '65.50㎡', source: '65.50㎡' },
    { id: 4, category: '表現チェック', item: '誇大表現', status: 'warning', value: '地域格安', msg: '「格安」は使用制限があります' },
    { id: 5, category: '表現チェック', item: '最強表現', status: 'warning', value: '最高級の設備', msg: '根拠のない「最高」はNGです' },
  ];

  const tabs = [
    { key: 'auto-check', label: 'AI自動照合' },
    { key: 'manual', label: 'チェックリスト' },
    { key: 'history', label: '履歴' },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-5 animate-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack}
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
            className="p-2 rounded-xl transition-all hover:bg-emerald-500/20">
            <ArrowLeft className="w-5 h-5 text-emerald-300" />
          </button>
          <div>
            <h2 className="text-xl font-black text-white">{ad.title}</h2>
            <p style={{ color: '#6ee7b7' }} className="text-sm">制作：佐藤クリエイティブ / {ad.date} 提出</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button style={{ border: '1px solid rgba(52,211,153,0.3)', color: '#6ee7b7' }}
            className="px-4 py-2 rounded-xl font-medium transition-all hover:bg-emerald-500/10 text-sm">
            修正依頼を送る
          </button>
          <button style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 16px rgba(16,185,129,0.4)' }}
            className="px-4 py-2 text-white rounded-xl font-bold transition-all hover:scale-105 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> 掲載OK（承認）
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-5 min-h-0">
        {/* Left: Viewer */}
        <div style={{ background: 'rgba(5,46,22,0.5)', border: '1px solid rgba(52,211,153,0.15)' }}
          className="flex-[3] rounded-2xl overflow-hidden flex flex-col">
          <div style={{ background: 'rgba(5,46,22,0.9)', borderBottom: '1px solid rgba(52,211,153,0.15)' }}
            className="px-4 py-2.5 flex justify-between text-xs font-bold">
            <div className="flex items-center gap-4">
              <span style={{ color: '#6ee7b7' }} className="flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> 元資料 (物件概要書)
              </span>
              <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
              <span style={{ color: '#34d399' }} className="flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> 提出原稿 ({ad.type})
              </span>
            </div>
            <div className="flex gap-2">
              {['拡大', '差分抽出'].map(t => (
                <button key={t} style={{ background: 'rgba(52,211,153,0.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.2)' }}
                  className="px-2.5 py-0.5 rounded-lg hover:bg-emerald-500/20 transition-all">{t}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 overflow-auto" style={{ gap: '1px', background: 'rgba(52,211,153,0.1)' }}>
            <div style={{ background: '#f8fafc' }} className="p-8">
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
            <div style={{ background: '#f8fafc' }} className="p-8">
              <div className="relative border shadow-xl max-w-sm mx-auto p-4 flex flex-col items-center text-center space-y-4">
                <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-slate-400">
                  <Info className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="text-xl font-black text-blue-900">{ad.title}</h3>
                <div className="bg-rose-600 text-white px-3 py-1 text-sm font-bold rotate-[-2deg]">地域格安物件！</div>
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

        {/* Right: Sidebar */}
        <div style={{ background: 'rgba(5,46,22,0.7)', border: '1px solid rgba(52,211,153,0.15)', backdropFilter: 'blur(12px)' }}
          className="flex-[1.5] flex flex-col rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div style={{ borderBottom: '1px solid rgba(52,211,153,0.15)' }} className="flex">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={activeTab === t.key
                  ? { color: '#34d399', borderBottom: '2px solid #10b981', background: 'rgba(16,185,129,0.08)' }
                  : { color: '#6ee7b7' }}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all hover:bg-emerald-500/5">
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'auto-check' && (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: '#6ee7b7' }} className="text-xs font-bold uppercase tracking-widest">
                    不整合・NG警告 ({checks.filter(c => c.status !== 'ok').length})
                  </span>
                  <button style={{ background: 'rgba(52,211,153,0.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.2)' }}
                    className="text-[10px] px-2 py-1 rounded-lg">再スキャン</button>
                </div>
                {checks.map((check) => {
                  const styles = {
                    error:   { bg: 'rgba(244,63,94,0.08)',  border: 'rgba(244,63,94,0.25)',  badge: '#f43f5e', badgeBg: 'rgba(244,63,94,0.2)' },
                    warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', badge: '#fbbf24', badgeBg: 'rgba(245,158,11,0.2)' },
                    ok:      { bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.15)', badge: '#6ee7b7', badgeBg: 'rgba(52,211,153,0.1)' },
                  }[check.status];
                  return (
                    <div key={check.id} style={{ background: styles.bg, border: `1px solid ${styles.border}` }}
                      className="p-3 rounded-xl text-sm">
                      <div className="flex justify-between items-start mb-1.5">
                        <span style={{ background: styles.badgeBg, color: styles.badge }}
                          className="text-[10px] px-2 py-0.5 rounded-full font-bold">{check.category}</span>
                        {check.status === 'ok' && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="font-bold text-white flex items-center justify-between">
                        {check.item}
                        {check.status !== 'ok' && (
                          <button style={{ color: '#34d399' }} className="text-[10px] flex items-center gap-1 hover:underline">
                            依頼に追加 <Plus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="mt-2 text-xs flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span style={{ color: '#6ee7b7' }}>原稿：</span>
                          <span style={{ color: check.status === 'error' ? '#fb7185' : '#a7f3d0' }} className={check.status === 'error' ? 'font-bold' : ''}>{check.value}</span>
                        </div>
                        {check.source && (
                          <div className="flex justify-between pt-1" style={{ borderTop: '1px solid rgba(52,211,153,0.1)' }}>
                            <span style={{ color: '#6ee7b7' }}>元資料：</span>
                            <span style={{ color: '#a7f3d0' }} className="italic">{check.source}</span>
                          </div>
                        )}
                        {check.msg && (
                          <div className="mt-1 flex items-start gap-1" style={{ color: '#fda4af' }}>
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>{check.msg}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {activeTab === 'manual' && (
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-widest pb-2" style={{ color: '#6ee7b7', borderBottom: '1px solid rgba(52,211,153,0.15)' }}>
                  共通確認事項
                </div>
                {[
                  '広告主の名称・住所の記載があるか',
                  '物件所在地の地番まで記載されているか',
                  '販売価格に消費税等が含まれているか',
                  '不当表示にあたる「業界No.1」等の文言はないか',
                ].map((text, i) => (
                  <label key={i} className="flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all hover:bg-emerald-500/10 group">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded accent-emerald-500" />
                    <span className="text-sm" style={{ color: '#a7f3d0' }}>{text}</span>
                  </label>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6 relative ml-4" style={{ '--tw-border-opacity': 1 }}>
                <div className="absolute left-[-17px] top-2 bottom-2 w-0.5" style={{ background: 'rgba(52,211,153,0.2)' }} />
                {[
                  { dot: '#10b981', time: '今日 11:30', title: '佐藤（制作）が v2 をアップロード', comment: null },
                  { dot: '#374151', time: '昨日 17:05', title: '田中（校正）が修正依頼を送信', comment: '「徒歩分数に誤りがあります。概要書は8分です」' },
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute left-[-23px] top-1 w-3 h-3 rounded-full border-2 border-transparent"
                      style={{ background: item.dot, boxShadow: i === 0 ? '0 0 8px rgba(16,185,129,0.6)' : 'none' }} />
                    <div className="text-xs" style={{ color: '#6ee7b7' }}>{item.time}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{item.title}</div>
                    {item.comment && (
                      <div className="text-xs mt-1.5 p-2 rounded-lg italic" style={{ background: 'rgba(52,211,153,0.08)', color: '#a7f3d0', border: '1px solid rgba(52,211,153,0.15)' }}>
                        {item.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="p-4" style={{ borderTop: '1px solid rgba(52,211,153,0.15)', background: 'rgba(5,46,22,0.5)' }}>
            <div className="flex gap-2">
              <input type="text" placeholder="コメントを入力..."
                style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: 'white' }}
                className="flex-1 rounded-xl px-3 py-2 text-sm placeholder-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <button style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 2px 12px rgba(16,185,129,0.4)' }}
                className="text-white p-2 rounded-xl hover:scale-105 transition-all">
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
