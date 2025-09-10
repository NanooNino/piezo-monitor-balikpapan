import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';

// Configuration - replace with your actual Supabase values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if we have valid credentials
const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
import { Zap, Users, MapPin, Clock } from 'lucide-react';

interface IoTData {
  id: string;
  lokasi: string;
  kota: string;
  energi_harian: number;
  efisiensi: number;
  pejalan_kaki_per_hari: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export const RealTimeIoTData = () => {
  const [iotData, setIotData] = useState<IoTData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only proceed if Supabase client is available
    if (!supabase) {
      console.log('Supabase not configured yet');
      return;
    }

    // Fetch initial data
    fetchLatestData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('sidewalk_data_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sidewalk_data'
        },
        (payload) => {
          console.log('New IoT data received:', payload.new);
          setIotData(prev => [payload.new as IoTData, ...prev.slice(0, 9)]);
          setIsConnected(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLatestData = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('sidewalk_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      setIotData(data || []);
      setIsConnected(data && data.length > 0);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('id-ID');
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-success text-success-foreground';
    if (efficiency >= 70) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  return (
    <Card className="bg-gradient-card-glass border-border/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Data IoT Real-Time
          <Badge variant={isConnected ? "default" : "secondary"} className="ml-auto">
            {isConnected ? "Connected" : "Offline"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!supabase ? (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium mb-2">Konfigurasi Supabase Diperlukan</p>
            <p className="text-sm mb-4">
              Untuk menampilkan data real-time, silakan konfigurasi kredensial Supabase:
            </p>
            <div className="bg-muted/30 p-4 rounded-lg text-left text-xs space-y-2">
              <p>1. Buka dashboard Supabase project Anda</p>
              <p>2. Copy Project URL dan anon key</p>
              <p>3. Tambahkan ke environment variables atau langsung di kode</p>
              <p className="font-mono bg-muted/50 p-2 rounded">
                VITE_SUPABASE_URL=https://your-project.supabase.co<br/>
                VITE_SUPABASE_ANON_KEY=your-anon-key
              </p>
            </div>
          </div>
        ) : iotData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Menunggu data dari IoT device...</p>
            <p className="text-sm">Pastikan device sudah terhubung dan mengirim data</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {iotData.map((data) => (
              <div
                key={data.id}
                className="p-4 rounded-lg bg-muted/50 border border-border/30 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium text-sm">{data.lokasi}</div>
                      <div className="text-xs text-muted-foreground">{data.kota}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTime(data.timestamp)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {data.energi_harian.toFixed(4)}
                    </div>
                    <div className="text-xs text-muted-foreground">kWh</div>
                  </div>
                  
                  <div className="text-center">
                    <Badge className={getEfficiencyColor(data.efisiensi)}>
                      {data.efisiensi}%
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">Efisiensi</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-foreground" />
                      <span className="font-medium">{data.pejalan_kaki_per_hari}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Pejalan</div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  Koordinat: {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};