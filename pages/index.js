import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [text, setText] = useState("Howdy partner! Welcome to Texas. Let's learn how to speak with a true Texan accent.");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAudioUrl(null);
    setErrorMsg('');

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Tạo giọng đọc thất bại');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Head>
        <title>Texas Accent Trainer</title>
        <link rel="icon" href="/logo.png" /> {/* Đường dẫn tới logo của bạn */}
      </Head>
      <h1 style={{ textAlign: 'center', color: '#1a202c', marginBottom: '8px' }}>🤠 Texas Accent Trainer</h1>
      <p style={{ textAlign: 'center', color: '#718096', marginTop: 0, marginBottom: '24px' }}>
        Luyện nói tiếng Anh chuẩn giọng Texas với ElevenLabs.
      </p>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#2d3748' }}>
          Nhập câu tiếng Anh muốn luyện đọc:
        </label>
        <textarea
          rows={4}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box' }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: loading ? '#cbd5e0' : '#dd6b20',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s'
        }}
      >
        {loading ? '⏳ Đang khởi tạo giọng đọc...' : '🔊 Phát Âm Giọng Texas'}
      </button>

      {errorMsg && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#fff5f5', color: '#e53e3e', borderRadius: '6px', fontSize: '14px' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {audioUrl && (
        <div style={{ marginTop: '24px', textAlign: 'center', padding: '16px', background: '#feebc8', borderRadius: '8px' }}>
          <h3 style={{ color: '#7b341e', marginTop: 0, marginBottom: '12px' }}>Bản Nghe Luyện Tập:</h3>
          <audio controls src={audioUrl} style={{ width: '100%' }} autoPlay />
        </div>
      )}
    </div>
  );
}