import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, MapPin, Zap, Users, TrendingUp } from 'lucide-react';

interface IoTData {
  id: string;
  lokasi: string;
  kota: string;
  energi_harian: number;
  efisiensi: number;
  pejalan_kaki_per_hari: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export function IoTDataViewer() {
  const [data, setData] = useState<IoTData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchData = async () => {
    try {
      const { data: iotData, error } = await supabase
        .from('sidewalk_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      setData(iotData || []);
      setLastUpdate(new Date().toLocaleTimeString('id-ID'));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('iot-data-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sidewalk_data'
        },
        (payload) => {
          console.log('New data received:', payload);
          setData(prev => [payload.new as IoTData, ...prev.slice(0, 9)]);
          setLastUpdate(new Date().toLocaleTimeString('id-ID'));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('id-ID');
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-500';
    if (efficiency >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-gradient-card-glass border-border/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Data IoT Real-Time
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Update: {lastUpdate}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Memuat data...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada data dari ESP32. Pastikan perangkat sudah terhubung dan mengirim data.
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {data.map((item) => (
              <div
                key={item.id}
                className="border border-border/50 rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <h4 className="font-medium text-foreground">{item.lokasi}</h4>
                      <p className="text-sm text-muted-foreground">{item.kota}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(item.created_at)}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Energi</p>
                      <p className="text-sm font-medium">{item.energi_harian} kWh</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Efisiensi</p>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium">{item.efisiensi}%</p>
                        <div className={`w-2 h-2 rounded-full ${getEfficiencyColor(item.efisiensi)}`} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pejalan Kaki</p>
                      <p className="text-sm font-medium">{item.pejalan_kaki_per_hari}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Koordinat</p>
                    <p className="text-xs font-mono">
                      {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}