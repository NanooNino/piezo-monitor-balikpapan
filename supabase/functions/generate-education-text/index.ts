import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { energi, pejalan_kaki, lokasi, kota } = await req.json();

    console.log('Generating education text for:', { energi, pejalan_kaki, lokasi, kota });

    const prompt = `
Buatkan teks edukasi yang kreatif dan mudah dipahami masyarakat awam tentang kontribusi energi mereka dari berjalan kaki di trotoar piezoelectric.

Data:
- Lokasi: ${lokasi}, ${kota}
- Energi yang dihasilkan hari ini: ${energi} kWh
- Jumlah pejalan kaki: ${pejalan_kaki} orang

Buatlah teks yang:
1. Menggunakan bahasa yang ramah dan mudah dipahami
2. Menjelaskan dampak positif secara konkret (jangan hanya sebut angka kWh)
3. Membuat pembaca merasa bangga dengan kontribusinya
4. Memberikan analogi yang mudah dimengerti (seperti berapa lampu yang bisa menyala, dll)
5. Maksimal 2-3 kalimat
6. Gunakan bahasa Indonesia yang natural

Contoh yang baik: "Luar biasa! Berkat langkah kaki Anda dan ${pejalan_kaki-1} pejalan kaki lainnya hari ini, energi yang dihasilkan di ${lokasi} sudah cukup untuk menyalakan 12 lampu jalan selama semalam penuh. Setiap langkah Anda berkontribusi untuk masa depan yang lebih hijau!"
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Anda adalah ahli komunikasi publik yang pandai menjelaskan teknologi dengan bahasa sederhana dan menarik.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.8
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const educationText = data.choices[0].message.content.trim();

    console.log('Generated education text:', educationText);

    return new Response(JSON.stringify({ educationText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-education-text function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      educationText: `Terima kasih telah berkontribusi untuk energi bersih di lokasi ini! Setiap langkah Anda membantu menciptakan masa depan yang lebih hijau.`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});