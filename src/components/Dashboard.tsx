import React from "react";
import { StatCard } from "./StatCard";
import { EnergyChart } from "./EnergyChart";
import { RegionPerformance } from "./RegionPerformance";
import { SidewalkMap } from "./SidewalkMap";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Activity, TrendingUp, DollarSign, Users, MapPin, AlertTriangle } from "lucide-react";
import heroImage from "@/assets/piezo-sidewalk-hero.jpg";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-dark-electric relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-futuristic opacity-40"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric/10 rounded-full blur-3xl animate-pulse-electric"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-energy/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Hero Section */}
      <div className="relative overflow-hidden bg-gradient-electric/90 backdrop-blur-sm border-b border-electric/20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Piezo Monitor
                </h1>
                <p className="text-white/80 text-lg">
                  Sistem monitoring energi real-time untuk infrastruktur kota pintar Balikpapan
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Data
                </Badge>
                <div className="text-right">
                  <div className="text-white/80 text-sm">Last Update</div>
                  <div className="text-white font-medium">{new Date().toLocaleTimeString('id-ID')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8 z-10">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Energi Hari Ini"
            value="8.7"
            unit="kWh"
            change={8.2}
            icon={Zap}
            variant="electric"
          />
          <StatCard
            title="Efisiensi Rata-rata"
            value="86"
            unit="%"
            change={3.1}
            icon={Activity}
            variant="energy"
          />
          <StatCard
            title="Penghematan Biaya"
            value="Rp 1.8"
            unit="juta"
            change={12.5}
            icon={DollarSign}
          />
          <StatCard
            title="Total Trotoar Aktif"
            value="23"
            unit="lokasi"
            change={-2.1}
            icon={Users}
          />
        </div>

        {/* Charts and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <EnergyChart />
          <SidewalkMap />
        </div>

        {/* Regional Performance */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <RegionPerformance />
        </div>

        {/* ROI Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card-glass border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Analisis ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Investasi Total</span>
                  <span className="font-semibold">Rp 1.8 Miliar</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Penghematan/Bulan</span>
                  <span className="font-semibold text-success">Rp 54 Juta</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payback Period</span>
                  <span className="font-semibold">3.1 Tahun</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-energy h-2 rounded-full w-[28%]"></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Progress: 28% dari target ROI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card-glass border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Alert & Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Jl. Pupuk Raya - Maintenance</div>
                    <div className="text-xs text-muted-foreground">Efisiensi turun 18% dari normal</div>
                  </div>
                  <Badge variant="outline" className="text-xs border-warning text-warning">
                    High
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Maintenance Terjadwal</div>
                    <div className="text-xs text-muted-foreground">1 lokasi - minggu depan (Jl. Ahmad Yani)</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Scheduled
                  </Badge>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">All Systems Operational</div>
                    <div className="text-xs text-muted-foreground">3 dari 4 lokasi berjalan optimal</div>
                  </div>
                  <Badge className="text-xs bg-success text-success-foreground">
                    Good
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};