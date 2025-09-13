import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  BarChart3,
  Target,
  Lightbulb
} from "lucide-react";

interface AnalysisResult {
  summary: string;
  trends: {
    energy: 'up' | 'down' | 'stable';
    efficiency: 'up' | 'down' | 'stable';
    pedestrians: 'up' | 'down' | 'stable';
  };
  insights: string[];
  actionPlans: {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    timeframe: string;
  }[];
  recommendations: string[];
}

const DataAnalysis = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    generateAnalysis();
  }, []);

  const generateAnalysis = async () => {
    setIsLoading(true);
    try {
      // Fetch recent data for analysis
      const { data: recentData, error } = await supabase
        .from('sidewalk_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Call edge function for AI analysis
      const response = await supabase.functions.invoke('analyze-sidewalk-data', {
        body: { data: recentData }
      });

      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(response.error.message || 'Failed to analyze data');
      }

      if (response.data?.analysis) {
        setAnalysis(response.data.analysis);
        setLastUpdate(new Date().toLocaleString('id-ID'));
      } else {
        throw new Error('No analysis data received');
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
      // Fallback analysis
      setAnalysis({
        summary: "Analisis otomatis tidak tersedia. Silakan refresh untuk mencoba lagi.",
        trends: { energy: 'stable', efficiency: 'stable', pedestrians: 'stable' },
        insights: ["Data sedang diproses", "Silakan coba lagi dalam beberapa menit"],
        actionPlans: [{
          priority: 'medium',
          title: 'Monitoring Berkelanjutan',
          description: 'Lakukan monitoring data secara berkala',
          timeframe: '1 minggu'
        }],
        recommendations: ["Pastikan sensor berfungsi dengan baik", "Lakukan kalibrasi berkala"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 bg-yellow-500 rounded-full" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Analisis Data & Action Plans</h2>
          </div>
          <div className="flex items-center space-x-3">
            {lastUpdate && (
              <span className="text-sm text-gray-500">
                Update terakhir: {lastUpdate}
              </span>
            )}
            <Button 
              onClick={generateAnalysis} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Menganalisis...' : 'Refresh Analisis'}
            </Button>
          </div>
        </div>
      </Card>

      {analysis && (
        <>
          {/* Summary */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Ringkasan Analisis</h3>
            <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
          </Card>

          {/* Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Tren Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Produksi Energi</span>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(analysis.trends.energy)}
                  <span className="text-sm capitalize">{analysis.trends.energy}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Efisiensi</span>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(analysis.trends.efficiency)}
                  <span className="text-sm capitalize">{analysis.trends.efficiency}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Pejalan Kaki</span>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(analysis.trends.pedestrians)}
                  <span className="text-sm capitalize">{analysis.trends.pedestrians}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Insights Penting
            </h3>
            <div className="space-y-3">
              {analysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Plans */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-red-500" />
              Rencana Aksi
            </h3>
            <div className="space-y-4">
              {analysis.actionPlans.map((plan, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(plan.priority)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{plan.title}</h4>
                    <Badge variant="outline" className={`${getPriorityColor(plan.priority)} text-xs`}>
                      {plan.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{plan.description}</p>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-medium">Target waktu:</span>
                    <span>{plan.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Rekomendasi
            </h3>
            <div className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {isLoading && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Menganalisis data dengan AI...</p>
            <p className="text-sm text-gray-500">Proses ini mungkin memakan waktu beberapa detik</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DataAnalysis;