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
    const { data } = await req.json();

    console.log('Analyzing sidewalk data for', data.length, 'records');

    // Calculate basic statistics
    const totalEnergy = data.reduce((sum: number, item: any) => sum + parseFloat(item.energi_harian), 0);
    const avgEfficiency = data.reduce((sum: number, item: any) => sum + item.efisiensi, 0) / data.length;
    const totalPedestrians = data.reduce((sum: number, item: any) => sum + item.pejalan_kaki_per_hari, 0);
    
    const locations = [...new Set(data.map((item: any) => item.lokasi))];
    const recentData = data.slice(0, 10);
    const olderData = data.slice(10, 20);

    const prompt = `
Analisis data trotoar piezoelectric berikut dan berikan insights yang actionable:

Data Statistik:
- Total energi dihasilkan: ${totalEnergy.toFixed(2)} kWh
- Rata-rata efisiensi: ${avgEfficiency.toFixed(1)}%
- Total pejalan kaki: ${totalPedestrians}
- Jumlah lokasi: ${locations.length}
- Lokasi: ${locations.join(', ')}

Data terbaru (10 record):
${recentData.map((item: any, index: number) => 
  `${index + 1}. ${item.lokasi} - Energi: ${item.energi_harian}kWh, Efisiensi: ${item.efisiensi}%, Pejalan kaki: ${item.pejalan_kaki_per_hari}`
).join('\n')}

Berdasarkan data ini, berikan analisis dalam format JSON dengan struktur berikut:
{
  "summary": "ringkasan singkat kondisi keseluruhan sistem (1-2 kalimat)",
  "trends": {
    "energy": "up/down/stable",
    "efficiency": "up/down/stable", 
    "pedestrians": "up/down/stable"
  },
  "insights": ["insight 1", "insight 2", "insight 3"],
  "actionPlans": [
    {
      "priority": "high/medium/low",
      "title": "judul rencana",
      "description": "deskripsi detail",
      "timeframe": "estimasi waktu"
    }
  ],
  "recommendations": ["rekomendasi 1", "rekomendasi 2", "rekomendasi 3"]
}

Fokus pada:
1. Performa energi dan efisiensi
2. Pola penggunaan oleh pejalan kaki
3. Potensi optimisasi
4. Maintenance dan perawatan
5. Expansion opportunities

Berikan insight yang spesifik dan actionable, bukan general. Gunakan bahasa Indonesia.
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
            content: 'Anda adalah data analyst expert yang berpengalaman dalam analisis sistem energy management dan IoT. Berikan analisis yang tajam dan actionable.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysisText = aiResponse.choices[0].message.content.trim();

    console.log('Raw AI response:', analysisText);

    // Parse JSON response
    let analysis;
    try {
      // Extract JSON from response if it's wrapped in markdown
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || analysisText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : analysisText;
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback analysis
      analysis = {
        summary: "Sistem piezoelectric menunjukkan performa stabil dengan produksi energi yang konsisten.",
        trends: { energy: 'stable', efficiency: 'stable', pedestrians: 'stable' },
        insights: [
          `Total energi ${totalEnergy.toFixed(2)} kWh dihasilkan dari ${totalPedestrians} pejalan kaki`,
          `Efisiensi rata-rata sistem ${avgEfficiency.toFixed(1)}%`,
          `${locations.length} lokasi aktif dengan performa yang bervariasi`
        ],
        actionPlans: [
          {
            priority: 'medium',
            title: 'Optimisasi Efisiensi',
            description: 'Lakukan kalibrasi sensor untuk meningkatkan akurasi dan efisiensi sistem',
            timeframe: '2 minggu'
          },
          {
            priority: 'low',
            title: 'Monitoring Rutin',
            description: 'Implementasi jadwal monitoring harian untuk semua lokasi',
            timeframe: '1 bulan'
          }
        ],
        recommendations: [
          'Lakukan maintenance berkala pada sensor piezoelectric',
          'Monitor pola traffic untuk optimisasi penempatan',
          'Implementasi sistem alert untuk efisiensi rendah'
        ]
      };
    }

    console.log('Final analysis:', analysis);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-sidewalk-data function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: {
        summary: "Analisis otomatis mengalami kendala teknis. Data masih dapat dipantau secara manual.",
        trends: { energy: 'stable', efficiency: 'stable', pedestrians: 'stable' },
        insights: ["Sistem monitoring berjalan normal", "Data IoT terus terkumpul"],
        actionPlans: [{
          priority: 'medium',
          title: 'Perbaikan Sistem Analisis',
          description: 'Perbaiki sistem analisis otomatis untuk laporan yang lebih detail',
          timeframe: '1 minggu'
        }],
        recommendations: ["Coba refresh analisis dalam beberapa menit", "Pastikan koneksi internet stabil"]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});