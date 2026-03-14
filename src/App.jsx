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

// ─── カラートークン ─────────────────────────────
const C = {
  bg:       '#ffffff',
  surface:  '#f7f7f7',
  border:   '#e5e5e5',
  text:     '#111111',
  muted:    '#777777',
  accent:   '#f97316',        // orange
  accentHover: '#ea6c0a',
  danger:   '#dc2626',
  warning:  '#d97706',
  success:  '#16a34a',
  info:     '#2563eb',
};

// ─── App ────────────────────────────────────────
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
    <div style={{ minHeight: '100vh', background: C.surface, color: C.text, fontFamily: "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif" }}>
      {/* ─── Navigation ─── */}
      <nav style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setView('list')}>
            <div style={{ background: C.accent, padding: 6, borderRadius: 6 }}>
              <ClipboardCheck style={{ color: '#fff', width: 20, height: 20 }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em', color: C.text }}>
              AdChecker <span style={{ color: C.accent }}>PRO</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Search style={{ width: 18, height: 18, color: C.muted }} />
            </button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14 }}>
              K
            </div>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>
        {view === 'list'         && <Dashboard ads={ads} onOpen={handleOpenAd} onStartRegistration={() => setView('registration')} />}
        {view === 'editor'       && <ProofreadingEditor ad={selectedAd} onBack={() => setView('list')} />}
        {view === 'registration' && <RegistrationForm onBack={() => setView('list')} onRegister={handleRegister} />}
      </main>
    </div>
  );
};

// ─── Dashboard ──────────────────────────────────
const Dashboard = ({ ads, onOpen, onStartRegistration }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: C.accent, textTransform: 'uppercase', marginBottom: 6 }}>
          PROOFREADING MANAGEMENT
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: C.text, lineHeight: 1.1 }}>案件一覧</h2>
        <p style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>現在 {ads.length} 件の校正タスクがあります</p>
      </div>
      <button
        onClick={onStartRegistration}
        style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '0.02em' }}
        onMouseOver={e => e.currentTarget.style.background = C.accentHover}
        onMouseOut={e => e.currentTarget.style.background = C.accent}
      >
        <Plus style={{ width: 16, height: 16 }} /> 新規案件を登録
      </button>
    </div>

    {/* Stat Cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {[
        { label: '未着手', color: '#9ca3af', value: ads.filter(a => a.status === '未着手').length },
        { label: '校正中', color: C.warning, value: ads.filter(a => a.status === '校正中').length },
        { label: '再確認中', color: C.danger, value: ads.filter(a => a.status === '再確認中').length },
        { label: '完了', color: C.success, value: ads.filter(a => a.status === '完了').length },
      ].map(({ label, color, value }) => (
        <div key={label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderTop: `3px solid ${color}`, borderRadius: 8, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</p>
            <p style={{ fontSize: 36, fontWeight: 900, color: C.text, lineHeight: 1.1, marginTop: 4 }}>{value}</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: color }} />
          </div>
        </div>
      ))}
    </div>

    {/* Table */}
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.border}` }}>
            {['物件名 / 媒体', 'ステータス', '進捗', '期限', '操作'].map((h, i) => (
              <th key={h} style={{ padding: '14px 24px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, textAlign: i === 4 ? 'right' : 'left', background: C.surface }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ads.map((ad, idx) => (
            <tr key={ad.id} style={{ borderBottom: idx < ads.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.15s' }}
              onMouseOver={e => e.currentTarget.style.background = C.surface}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '16px 24px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{ad.title}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{ad.type}</div>
              </td>
              <td style={{ padding: '16px 24px' }}>
                <StatusBadge status={ad.status} />
              </td>
              <td style={{ padding: '16px 24px' }}>
                <div style={{ width: 120, height: 4, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${ad.progress}%`, height: '100%', background: ad.progress === 100 ? C.success : C.accent, borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{ad.progress}%</div>
              </td>
              <td style={{ padding: '16px 24px', fontSize: 13, color: C.muted }}>{ad.date}</td>
              <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                <button onClick={() => onOpen(ad)}
                  style={{ background: 'none', border: 'none', color: C.accent, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  onMouseOver={e => e.currentTarget.style.color = C.accentHover}
                  onMouseOut={e => e.currentTarget.style.color = C.accent}>
                  {ad.status === '完了' ? '詳細を見る' : '校正を開始'} <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    '完了':    { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
    '校正中':  { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
    '再確認中':{ bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
    '未着手':  { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' },
  };
  const s = map[status] || map['未着手'];
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 4, padding: '3px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
      {status}
    </span>
  );
};

// ─── Registration Form ──────────────────────────
const RegistrationForm = ({ onBack, onRegister }) => {
  const [formData, setFormData] = useState({ title: '', type: 'チラシ', priority: '中', date: '', files: {} });
  const handleSubmit = (e) => { e.preventDefault(); if (!formData.title || !formData.date) return; onRegister(formData); };

  const fieldStyle = { width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, color: C.text, background: C.bg, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onBack} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft style={{ width: 18, height: 18, color: C.muted }} />
        </button>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: C.accent, textTransform: 'uppercase', marginBottom: 2 }}>NEW PROJECT</p>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text }}>新規案件の登録</h2>
        </div>
      </div>

      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <form onSubmit={handleSubmit}>
          {/* Section: 基本情報 */}
          <div style={{ padding: '28px 32px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Building2 style={{ width: 16, height: 16, color: C.accent }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: C.accent, textTransform: 'uppercase' }}>基本情報</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, letterSpacing: '0.05em' }}>物件名・案件タイトル</label>
                <input type="text" placeholder="例：代官山レジデンス 3F リニューアル告知"
                  style={fieldStyle} value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, letterSpacing: '0.05em' }}>広告媒体</label>
                <select style={fieldStyle} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  {['チラシ', 'ポータルサイト', 'Webバナー', 'SNS広告', 'パンフレット'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, letterSpacing: '0.05em' }}>校正期限</label>
                <input type="date" style={fieldStyle} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
              </div>
            </div>
          </div>

          {/* Section: アップロード */}
          <div style={{ padding: '28px 32px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <FileUp style={{ width: 16, height: 16, color: C.accent }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: C.accent, textTransform: 'uppercase' }}>データのアップロード</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { label: '元資料（物件概要書等）', sub: 'PDF, Excel, スプレッドシートURL', Icon: FileText },
                { label: '校正対象（制作原稿）', sub: 'PDF, PNG, JPG, Figmaリンク', Icon: Upload },
              ].map(({ label, sub, Icon }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8, letterSpacing: '0.05em' }}>
                    {label} <span style={{ color: C.danger }}>*</span>
                  </label>
                  <div style={{ border: `2px dashed ${C.border}`, borderRadius: 8, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = '#fff8f5'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: 40, height: 40, background: '#fff0e8', border: `1px solid #fde0cc`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <Icon style={{ width: 18, height: 18, color: C.accent }} />
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>クリックしてアップロード</p>
                    <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hint */}
            <div style={{ marginTop: 20, background: '#fffbeb', border: `1px solid #fde68a`, borderRadius: 6, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <AlertTriangle style={{ width: 16, height: 16, color: C.warning, flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 13, color: '#92400e' }}>
                <strong>AI自動照合のヒント：</strong>
                物件概要書をアップロードすると、AIが徒歩分数・面積・所在地・取引態様を自動抽出し、原稿との整合性を即座にチェックします。
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '20px 32px', display: 'flex', justifyContent: 'flex-end', gap: 12, background: C.surface }}>
            <button type="button" onClick={onBack}
              style={{ background: C.bg, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              キャンセル
            </button>
            <button type="submit"
              style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', letterSpacing: '0.02em' }}
              onMouseOver={e => e.currentTarget.style.background = C.accentHover}
              onMouseOut={e => e.currentTarget.style.background = C.accent}>
              案件を登録して解析開始
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Proofreading Editor ─────────────────────────
const ProofreadingEditor = ({ ad, onBack }) => {
  const [activeTab, setActiveTab] = useState('auto-check');
  const [comment, setComment] = useState('');

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
    <div style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onBack} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: 8, cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft style={{ width: 16, height: 16, color: C.muted }} />
          </button>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: C.accent, textTransform: 'uppercase', marginBottom: 2 }}>PROOFREADING</p>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: C.text }}>{ad.title}</h2>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>制作：佐藤クリエイティブ / {ad.date} 提出</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            修正依頼を送る
          </button>
          <button style={{ background: C.success, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 style={{ width: 15, height: 15 }} /> 掲載OK（承認）
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0 }}>
        {/* ─── Viewer ─── */}
        <div style={{ flex: 3, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: C.bg }}>
          {/* Viewer toolbar */}
          <div style={{ background: C.text, padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, fontWeight: 600 }}>
              <span style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 5 }}>
                <FileText style={{ width: 11, height: 11 }} /> 元資料（物件概要書）
              </span>
              <ArrowRightLeft style={{ width: 11, height: 11, color: '#4b5563' }} />
              <span style={{ color: C.accent, display: 'flex', alignItems: 'center', gap: 5 }}>
                <FileText style={{ width: 11, height: 11 }} /> 提出原稿（{ad.type}）
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['拡大', '差分抽出'].map(t => (
                <button key={t} style={{ background: '#ffffff18', color: '#d1d5db', border: '1px solid #ffffff22', borderRadius: 4, padding: '3px 10px', fontSize: 11, cursor: 'pointer' }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Viewer content */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: C.border, overflow: 'auto' }}>
            {/* Source doc */}
            <div style={{ background: '#fff', padding: 32 }}>
              <div style={{ border: '3px solid #f3f4f6', padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, borderBottom: '2px solid #111', paddingBottom: 8, marginBottom: 16 }}>物件概要書</h3>
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                  {[['物件名', ad.title], ['交通', '代官山駅 徒歩8分'], ['面積', '65.50㎡']].map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ background: '#f9fafb', padding: '8px 12px', fontWeight: 700, width: '33%', border: '1px solid #e5e7eb' }}>{k}</td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb', textDecoration: k === '交通' ? 'underline' : 'none', textDecorationColor: k === '交通' ? C.danger : 'transparent', textDecorationThickness: 2 }}>{v}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
            {/* Draft doc */}
            <div style={{ background: '#fff', padding: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{ position: 'relative', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: 280, width: '100%', padding: 20, textAlign: 'center' }}>
                <div style={{ background: '#f3f4f6', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Info style={{ width: 32, height: 32, color: '#d1d5db' }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: '#1e3a8a', marginBottom: 10 }}>{ad.title}</h3>
                <div style={{ background: C.danger, color: '#fff', display: 'inline-block', padding: '4px 12px', fontSize: 12, fontWeight: 700, transform: 'rotate(-2deg)', marginBottom: 10 }}>
                  地域格安物件！
                </div>
                <p style={{ fontSize: 18, fontWeight: 900, color: '#111', fontStyle: 'italic', marginBottom: 12 }}>最高級の設備をあなたに</p>
                <div style={{ fontSize: 12 }}>
                  <p style={{ background: '#fee2e2', borderBottom: `1px solid ${C.danger}`, display: 'inline-block', padding: '2px 6px', marginBottom: 4 }}>東急東横線「代官山」駅 徒歩5分</p>
                  <p style={{ color: '#374151' }}>専有面積：65.50㎡</p>
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8, background: '#fbbf24', fontSize: 9, padding: '2px 5px', fontWeight: 700 }}>Draft v2</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        <div style={{ flex: 1.5, minWidth: 280, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: C.bg }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ flex: 1, padding: '12px 0', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderBottom: activeTab === t.key ? `2px solid ${C.accent}` : '2px solid transparent', color: activeTab === t.key ? C.accent : C.muted, background: activeTab === t.key ? '#fff8f5' : C.bg, transition: 'all 0.15s' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Sidebar content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeTab === 'auto-check' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    不整合・NG警告 ({checks.filter(c => c.status !== 'ok').length})
                  </span>
                  <button style={{ fontSize: 11, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '3px 10px', cursor: 'pointer', color: C.muted }}>再スキャン</button>
                </div>
                {checks.map((check) => {
                  const s = {
                    error:   { bg: '#fff1f2', border: '#fecdd3', catBg: '#fee2e2', catColor: C.danger },
                    warning: { bg: '#fffbeb', border: '#fde68a', catBg: '#fef3c7', catColor: C.warning },
                    ok:      { bg: '#f9fafb', border: C.border,  catBg: '#f3f4f6', catColor: '#6b7280' },
                  }[check.status];
                  return (
                    <div key={check.id} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 6, padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ background: s.catBg, color: s.catColor, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3, letterSpacing: '0.06em' }}>{check.category}</span>
                        {check.status === 'ok' && <Check style={{ width: 14, height: 14, color: C.success }} />}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {check.item}
                        {check.status !== 'ok' && (
                          <button style={{ background: 'none', border: 'none', fontSize: 10, color: C.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, fontWeight: 700 }}>
                            依頼に追加 <Plus style={{ width: 10, height: 10 }} />
                          </button>
                        )}
                      </div>
                      <div style={{ marginTop: 8, fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: C.muted }}>原稿：</span>
                          <span style={{ color: check.status === 'error' ? C.danger : C.text, fontWeight: check.status === 'error' ? 700 : 400 }}>{check.value}</span>
                        </div>
                        {check.source && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, borderTop: `1px solid ${C.border}` }}>
                            <span style={{ color: C.muted }}>元資料：</span>
                            <span style={{ color: C.muted, fontStyle: 'italic' }}>{check.source}</span>
                          </div>
                        )}
                        {check.msg && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginTop: 4, color: C.danger, fontWeight: 600 }}>
                            <AlertTriangle style={{ width: 11, height: 11, flexShrink: 0, marginTop: 1 }} />
                            <span style={{ fontSize: 11 }}>{check.msg}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {activeTab === 'manual' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: 8, borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>共通確認事項</p>
                {[
                  '広告主の名称・住所の記載があるか',
                  '物件所在地の地番まで記載されているか',
                  '販売価格に消費税等が含まれているか',
                  '不当表示にあたる「業界No.1」等の文言はないか',
                ].map((text, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: C.text, transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.background = C.surface}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <input type="checkbox" style={{ marginTop: 2, accentColor: C.accent }} />
                    {text}
                  </label>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div style={{ paddingLeft: 20, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 1, background: C.border }} />
                {[
                  { color: C.accent, time: '今日 11:30', title: '佐藤（制作）が v2 をアップロード', comment: null },
                  { color: C.border, time: '昨日 17:05', title: '田中（校正）が修正依頼を送信', comment: '「徒歩分数に誤りがあります。概要書は8分です」' },
                ].map((item, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: i === 0 ? 20 : 0 }}>
                    <div style={{ position: 'absolute', left: -16, top: 4, width: 10, height: 10, borderRadius: '50%', background: item.color, border: `2px solid ${C.bg}`, boxShadow: `0 0 0 2px ${item.color}` }} />
                    <p style={{ fontSize: 11, color: C.muted }}>{item.time}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginTop: 2 }}>{item.title}</p>
                    {item.comment && (
                      <p style={{ fontSize: 12, color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 12px', marginTop: 6, fontStyle: 'italic' }}>{item.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment input */}
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, background: C.surface, display: 'flex', gap: 8 }}>
            <input type="text" placeholder="コメントを入力..." value={comment} onChange={e => setComment(e.target.value)}
              style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 12px', fontSize: 13, outline: 'none', background: C.bg }} />
            <button style={{ background: C.accent, border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onMouseOver={e => e.currentTarget.style.background = C.accentHover}
              onMouseOut={e => e.currentTarget.style.background = C.accent}>
              <Send style={{ width: 14, height: 14, color: '#fff' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
