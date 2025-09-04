import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Zap, Activity, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const sidewalkData = [
  // Page 1 - Balikpapan Kota (8 locations)
  { id: 1, name: "Jl. Ahmad Yani", region: "Balikpapan Kota", energy: 0.8, efficiency: 95, pedestrians: 850, status: "excellent", coordinates: [-116.8312, -1.2379] },
  { id: 2, name: "Jl. Jendral Sudirman", region: "Balikpapan Kota", energy: 0.6, efficiency: 92, pedestrians: 720, status: "excellent", coordinates: [-116.8345, -1.2402] },
  { id: 3, name: "Jl. MT Haryono", region: "Balikpapan Kota", energy: 0.4, efficiency: 89, pedestrians: 680, status: "good", coordinates: [-116.8398, -1.2445] },
  { id: 4, name: "Jl. Marsma R Iswahyudi", region: "Balikpapan Kota", energy: 0.5, efficiency: 91, pedestrians: 590, status: "good", coordinates: [-116.8367, -1.2421] },
  { id: 5, name: "Jl. Gajah Mada", region: "Balikpapan Kota", energy: 0.3, efficiency: 88, pedestrians: 520, status: "good", coordinates: [-116.8289, -1.2356] },
  // Page 2 - Balikpapan Kota continued + Balikpapan Timur
  { id: 6, name: "Jl. Panglima Batur", region: "Balikpapan Kota", energy: 0.3, efficiency: 90, pedestrians: 480, status: "good", coordinates: [-116.8334, -1.2389] },
  { id: 7, name: "Jl. Letjen Suprapto", region: "Balikpapan Kota", energy: 0.4, efficiency: 93, pedestrians: 620, status: "excellent", coordinates: [-116.8356, -1.2398] },
  { id: 8, name: "Jl. Sepinggan Raya", region: "Balikpapan Kota", energy: 0.4, efficiency: 87, pedestrians: 550, status: "good", coordinates: [-116.8423, -1.2467] },
  { id: 9, name: "Jl. Soekarno Hatta", region: "Balikpapan Timur", energy: 0.5, efficiency: 91, pedestrians: 780, status: "excellent", coordinates: [-116.7891, -1.2234] },
  { id: 10, name: "Jl. Mulawarman", region: "Balikpapan Timur", energy: 0.4, efficiency: 88, pedestrians: 650, status: "good", coordinates: [-116.7923, -1.2267] },
  // Page 3 - Balikpapan Timur continued
  { id: 11, name: "Jl. Ruhui Rahayu", region: "Balikpapan Timur", energy: 0.5, efficiency: 89, pedestrians: 720, status: "good", coordinates: [-116.7956, -1.2298] },
  { id: 12, name: "Jl. Syarifuddin Yoes", region: "Balikpapan Timur", energy: 0.4, efficiency: 86, pedestrians: 590, status: "good", coordinates: [-116.7889, -1.2245] },
  { id: 13, name: "Jl. Marsda Iswahyudi", region: "Balikpapan Timur", energy: 0.5, efficiency: 92, pedestrians: 680, status: "excellent", coordinates: [-116.7834, -1.2198] },
  { id: 14, name: "Jl. Pramuka", region: "Balikpapan Timur", energy: 0.5, efficiency: 87, pedestrians: 610, status: "good", coordinates: [-116.7867, -1.2223] },
  { id: 15, name: "Jl. Veteran", region: "Balikpapan Utara", energy: 0.4, efficiency: 85, pedestrians: 580, status: "good", coordinates: [-116.8123, -1.1987] },
  // Page 4 - Balikpapan Utara continued
  { id: 16, name: "Jl. Juanda", region: "Balikpapan Utara", energy: 0.4, efficiency: 83, pedestrians: 520, status: "fair", coordinates: [-116.8156, -1.2012] },
  { id: 17, name: "Jl. Diponegoro", region: "Balikpapan Utara", energy: 0.4, efficiency: 81, pedestrians: 490, status: "fair", coordinates: [-116.8189, -1.2045] },
  { id: 18, name: "Jl. Kartini", region: "Balikpapan Utara", energy: 0.4, efficiency: 80, pedestrians: 460, status: "fair", coordinates: [-116.8134, -1.1998] },
  { id: 19, name: "Jl. Antasari", region: "Balikpapan Utara", energy: 0.5, efficiency: 84, pedestrians: 550, status: "good", coordinates: [-116.8167, -1.2023] },
  { id: 20, name: "Jl. Kapten Pierre Tendean", region: "Balikpapan Selatan", energy: 0.4, efficiency: 78, pedestrians: 420, status: "fair", coordinates: [-116.8445, -1.2789] },
  // Page 5 - Balikpapan Selatan continued
  { id: 21, name: "Jl. Gunung Sari", region: "Balikpapan Selatan", energy: 0.5, efficiency: 76, pedestrians: 450, status: "fair", coordinates: [-116.8467, -1.2812] },
  { id: 22, name: "Jl. Flamboyan", region: "Balikpapan Selatan", energy: 0.4, efficiency: 74, pedestrians: 380, status: "fair", coordinates: [-116.8489, -1.2834] },
  { id: 23, name: "Jl. Kenanga", region: "Balikpapan Selatan", energy: 0.5, efficiency: 72, pedestrians: 410, status: "maintenance", coordinates: [-116.8512, -1.2856] },
  { id: 24, name: "Jl. Pupuk Raya", region: "Balikpapan Barat", energy: 0.3, efficiency: 65, pedestrians: 320, status: "maintenance", coordinates: [-116.8734, -1.2567] },
  { id: 25, name: "Jl. Mahkota", region: "Balikpapan Barat", energy: 0.4, efficiency: 70, pedestrians: 360, status: "maintenance", coordinates: [-116.8756, -1.2589] },
  // Page 6 - Balikpapan Barat continued
  { id: 26, name: "Jl. Mawar", region: "Balikpapan Barat", energy: 0.4, efficiency: 68, pedestrians: 340, status: "fair", coordinates: [-116.8778, -1.2612] },
];

export const SidewalkLocations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sidewalkData.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sidewalkData.slice(startIndex, endIndex);
  };

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

  return (
    <div className="min-h-screen bg-gradient-dark-electric relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-futuristic opacity-40"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric/10 rounded-full blur-3xl animate-pulse-electric"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-energy/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-electric/90 backdrop-blur-sm border-b border-electric/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Lokasi Trotoar Piezoelektrik
              </h1>
              <p className="text-white/80">
                Monitoring detail {sidewalkData.length} lokasi trotoar piezoelektrik di Balikpapan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8 z-10">
        {/* Page Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-white/80">
            Halaman {currentPage} dari {totalPages} (Menampilkan {getCurrentPageData().length} dari {sidewalkData.length} lokasi)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="text-white border-white/30 hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="text-white border-white/30 hover:bg-white/20"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidewalk Cards */}
        <div className="grid grid-cols-1 gap-6">
          {getCurrentPageData().map((sidewalk) => (
            <Card key={sidewalk.id} className="bg-gradient-card-glass border-border/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-electric animate-pulse-electric"></div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {sidewalk.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {sidewalk.region}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(sidewalk.status)}>
                    {getStatusText(sidewalk.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Energy Production */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Energi Harian
                      </span>
                      <span className="font-medium text-foreground">{sidewalk.energy} kWh</span>
                    </div>
                    <Progress value={(sidewalk.energy / 1.0) * 100} className="h-2" />
                  </div>

                  {/* Efficiency */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Efisiensi
                      </span>
                      <span className="font-medium text-foreground">{sidewalk.efficiency}%</span>
                    </div>
                    <Progress value={sidewalk.efficiency} className="h-2" />
                  </div>

                  {/* Pedestrian Count */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Pejalan Kaki/Hari
                      </span>
                      <span className="font-medium text-foreground">{sidewalk.pedestrians}</span>
                    </div>
                    <Progress value={(sidewalk.pedestrians / 1000) * 100} className="h-2" />
                  </div>

                  {/* Coordinates */}
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Koordinat</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      <div>Lat: {sidewalk.coordinates[1]}</div>
                      <div>Lng: {sidewalk.coordinates[0]}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Page Numbers */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 
                "bg-electric text-white" : 
                "text-white border-white/30 hover:bg-white/20"
              }
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};