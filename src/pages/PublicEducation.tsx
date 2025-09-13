import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Zap, Users, TreePine, Lightbulb } from "lucide-react";

interface LocationData {
  lokasi: string;
  kota: string;
  energi_harian: number;
  pejalan_kaki_per_hari: number;
  efisiensi: number;
}

const PublicEducation = () => {
  const [searchParams] = useSearchParams();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [educationText, setEducationText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  const location = searchParams.get("location");

  useEffect(() => {
    if (location) {
      fetchLocationData();
    }
  }, [location]);

  const fetchLocationData = async () => {
    try {
      // Get latest data for this location
      const { data, error } = await supabase
        .from('sidewalk_data')
        .select('*')
        .eq('lokasi', location)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      
      setLocationData(data);
      await generateEducationText(data);
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEducationText = async (data: LocationData) => {
    try {
      const response = await supabase.functions.invoke('generate-education-text', {
        body: { 
          energi: data.energi_harian,
          pejalan_kaki: data.pejalan_kaki_per_hari,
          lokasi: data.lokasi,
          kota: data.kota
        }
      });

      if (response.data?.educationText) {
        setEducationText(response.data.educationText);
      }
    } catch (error) {
      console.error('Error generating education text:', error);
      // Fallback text
      setEducationText(`Terima kasih telah berjalan di ${data.lokasi}! Anda dan ${data.pejalan_kaki_per_hari} pejalan kaki lainnya telah menghasilkan ${data.energi_harian.toFixed(2)} kWh energi hari ini.`);
    }
  };

  const getEnergyEquivalent = (energy: number) => {
    const streetLights = Math.floor(energy / 0.5); // Asumsi 1 lampu jalan = 0.5 kWh/hari
    const phoneCharges = Math.floor(energy / 0.01); // Asumsi 1x charge HP = 0.01 kWh
    const tvHours = Math.floor(energy / 0.1); // Asumsi TV 1 jam = 0.1 kWh
    
    return { streetLights, phoneCharges, tvHours };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lokasi Tidak Ditemukan</h2>
          <p>Maaf, data untuk lokasi ini tidak tersedia.</p>
        </Card>
      </div>
    );
  }

  const equivalent = getEnergyEquivalent(locationData.energi_harian);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-800">Piezo Energy</h1>
          </div>
          <p className="text-gray-600">Energi Terbarukan dari Langkah Kaki Anda</p>
        </div>

        {/* Location Info */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">{locationData.lokasi}, {locationData.kota}</h2>
          </div>
          <Badge variant="secondary" className="mb-4">
            Efisiensi: {locationData.efisiensi}%
          </Badge>
        </Card>

        {/* Main Education Card */}
        <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-500 rounded-full p-4">
                <TreePine className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">
                Selamat! Anda Telah Berkontribusi untuk Lingkungan
              </h2>
              
              {educationText && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-lg text-gray-700 leading-relaxed">{educationText}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Energy Equivalents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center space-y-3 bg-yellow-50 border-yellow-200">
            <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto" />
            <h3 className="font-semibold text-yellow-700">Lampu Jalan</h3>
            <p className="text-2xl font-bold text-yellow-600">{equivalent.streetLights}</p>
            <p className="text-sm text-gray-600">lampu dapat menyala 1 hari</p>
          </Card>

          <Card className="p-6 text-center space-y-3 bg-blue-50 border-blue-200">
            <div className="w-8 h-8 bg-blue-500 rounded mx-auto flex items-center justify-center">
              <span className="text-white text-sm font-bold">📱</span>
            </div>
            <h3 className="font-semibold text-blue-700">Smartphone</h3>
            <p className="text-2xl font-bold text-blue-600">{equivalent.phoneCharges}</p>
            <p className="text-sm text-gray-600">kali pengisian HP</p>
          </Card>

          <Card className="p-6 text-center space-y-3 bg-purple-50 border-purple-200">
            <div className="w-8 h-8 bg-purple-500 rounded mx-auto flex items-center justify-center">
              <span className="text-white text-sm font-bold">📺</span>
            </div>
            <h3 className="font-semibold text-purple-700">Televisi</h3>
            <p className="text-2xl font-bold text-purple-600">{equivalent.tvHours}</p>
            <p className="text-sm text-gray-600">jam menonton TV</p>
          </Card>
        </div>

        {/* Statistics */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Data Hari Ini
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{locationData.pejalan_kaki_per_hari}</p>
              <p className="text-sm text-gray-600">Pejalan Kaki</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{locationData.energi_harian.toFixed(2)} kWh</p>
              <p className="text-sm text-gray-600">Energi Dihasilkan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{locationData.efisiensi}%</p>
              <p className="text-sm text-gray-600">Efisiensi</p>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white text-center">
          <h3 className="text-xl font-semibold mb-2">Mari Bersama Ciptakan Energi Bersih!</h3>
          <p className="mb-4">Setiap langkah Anda berkontribusi untuk masa depan yang lebih hijau</p>
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Lihat Dashboard Lengkap
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default PublicEducation;