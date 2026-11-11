export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Nội dung không được để trống' });
  }

  const API_KEY = process.env.ELEVENLABS_API_KEY;
  const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB"; // Mặc định dùng giọng Adam

  if (!API_KEY) {
    return res.status(500).json({ error: 'Chưa cấu hình ELEVENLABS_API_KEY trong file .env.local' });
  }

  try {
    // Tự động biến đổi từ vựng mang phong cách miền Nam/Texas
    let texanText = text
      .replace(/\bgoing to\b/gi, "gonna")
      .replace(/\bwant to\b/gi, "wanna")
      .replace(/\byou all\b/gi, "y'all")
      .replace(/\byou\b/gi, "ya")
      .replace(/ing\b/gi, "in'")
      .replace(/\bthem\b/gi, "'em");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": API_KEY,
        },
        body: JSON.stringify({
          text: texanText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.message || "Lỗi gọi ElevenLabs API");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(buffer);

  } catch (error) {
    console.error("TTS Error:", error);
    res.status(500).json({ error: error.message || "Tạo giọng đọc thất bại" });
  }
}