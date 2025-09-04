import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, TrendingUp, Users } from "lucide-react";

const regionData = [
  { 
    id: 1, 
    name: "Balikpapan Kota", 
    energy: 3.2, 
    efficiency: 94, 
    sidewalks: 8,
    population: 145000,
    trend: 12.5,
    status: "excellent" 
  },
  { 
    id: 2, 
    name: "Balikpapan Timur", 
    energy: 2.8, 
    efficiency: 89, 
    sidewalks: 6,
    population: 168000,
    trend: 8.2,
    status: "good" 
  },
  { 
    id: 3, 
    name: "Balikpapan Utara", 
    energy: 2.1, 
    efficiency: 82, 
    sidewalks: 5,
    population: 142000,
    trend: 3.1,
    status: "good" 
  },
  { 
    id: 4, 
    name: "Balikpapan Selatan", 
    energy: 1.8, 
    efficiency: 75, 
    sidewalks: 4,
    population: 98000,
    trend: -2.4,
    status: "fair" 
  },
  { 
    id: 5, 
    name: "Balikpapan Barat", 
    energy: 1.5, 
    efficiency: 68, 
    sidewalks: 3,
    population: 89000,
    trend: -5.1,
    status: "maintenance" 
  },
];

export const RegionPerformance = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-energy text-energy-foreground";
      case "good":
        return "bg-primary text-primary-foreground";
      case "fair":
        return "bg-warning text-warning-foreground";
      case "maintenance":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Good";
      case "fair":
        return "Fair";
      case "maintenance":
        return "Maintenance";
      default:
        return "Unknown";
    }
  };

  const getTrendColor = (trend: number) => {
    if (trend >= 5) return "text-energy";
    if (trend >= 0) return "text-primary";
    return "text-destructive";
  };

  return (
    <Card className="col-span-1 lg:col-span-2 bg-gradient-card-glass border-border/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Performa Per Wilayah Balikpapan
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Analisis produksi energi dan efisiensi berdasarkan kecamatan
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {regionData.map((region) => (
            <div 
              key={region.id}
              className="p-4 rounded-lg border border-border/30 bg-gradient-card-glass/30 hover:bg-gradient-card-glass/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-gradient-electric animate-pulse-electric"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{region.name}</h4>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{region.sidewalks} trotoar</span>
                      <span>Pop: {(region.population / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(region.status)}>
                  {getStatusText(region.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Energi
                    </span>
                    <span className="font-medium text-foreground">{region.energy} kWh</span>
                  </div>
                  <Progress value={(region.energy / 4) * 100} className="h-1.5" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Efisiensi</span>
                    <span className="font-medium text-foreground">{region.efficiency}%</span>
                  </div>
                  <Progress value={region.efficiency} className="h-1.5" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trend
                    </span>
                    <span className={`font-medium ${getTrendColor(region.trend)}`}>
                      {region.trend >= 0 ? "+" : ""}{region.trend}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        region.trend >= 0 ? 'bg-gradient-energy' : 'bg-gradient-to-r from-destructive to-warning'
                      }`}
                      style={{ width: `${Math.abs(region.trend) * 2}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-electric/10 rounded-lg border border-electric/20">
          <h4 className="font-semibold mb-3 text-foreground">Ringkasan Regional</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">Total Wilayah</div>
              <div className="font-bold text-foreground">{regionData.length}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Avg Efisiensi</div>
              <div className="font-bold text-foreground">
                {Math.round(regionData.reduce((acc, r) => acc + r.efficiency, 0) / regionData.length)}%
              </div>
            </div>
            <div className="text-center cursor-pointer hover:bg-gradient-electric/20 rounded-lg p-2 transition-all duration-300" onClick={() => window.location.href = '/sidewalk-locations'}>
              <div className="text-muted-foreground">Total Trotoar</div>
              <div className="font-bold text-foreground">
                {regionData.reduce((acc, r) => acc + r.sidewalks, 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Total Energi</div>
              <div className="font-bold text-foreground">
                {regionData.reduce((acc, r) => acc + r.energy, 0).toFixed(1)} kWh
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};