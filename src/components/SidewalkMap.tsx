import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Activity } from "lucide-react";

const sidewalkData = [
  { id: 1, name: "Jl. Sudirman", lat: -6.2088, lng: 106.8456, energy: 2.4, efficiency: 92, status: "optimal" },
  { id: 2, name: "Jl. Thamrin", lat: -6.1944, lng: 106.8229, energy: 1.8, efficiency: 78, status: "good" },
  { id: 3, name: "Jl. Gatot Subroto", lat: -6.2297, lng: 106.8253, energy: 3.1, efficiency: 95, status: "optimal" },
  { id: 4, name: "Jl. Kuningan", lat: -6.2382, lng: 106.8316, energy: 1.2, efficiency: 65, status: "maintenance" },
  { id: 5, name: "Jl. Senayan", lat: -6.2297, lng: 106.8015, energy: 2.8, efficiency: 88, status: "good" },
];

export const SidewalkMap = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-energy text-energy-foreground";
      case "good":
        return "bg-primary text-primary-foreground";
      case "maintenance":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "optimal":
        return "Optimal";
      case "good":
        return "Baik";
      case "maintenance":
        return "Perlu Maintenance";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Lokasi Trotoar Piezoelektrik
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Status dan performa per lokasi
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sidewalkData.map((sidewalk) => (
            <div 
              key={sidewalk.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-gradient-electric animate-pulse-electric"></div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{sidewalk.name}</h4>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3" />
                      <span>{sidewalk.energy} kWh</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3" />
                      <span>{sidewalk.efficiency}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(sidewalk.status)}>
                {getStatusText(sidewalk.status)}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-electric rounded-lg text-white">
          <h4 className="font-semibold mb-2">Summary Hari Ini</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-white/70">Total Lokasi</div>
              <div className="font-bold">{sidewalkData.length} Trotoar</div>
            </div>
            <div>
              <div className="text-white/70">Rata-rata Efisiensi</div>
              <div className="font-bold">
                {Math.round(sidewalkData.reduce((acc, s) => acc + s.efficiency, 0) / sidewalkData.length)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};