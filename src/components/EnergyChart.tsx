import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { time: '00:00', energy: 120, pedestrians: 45 },
  { time: '02:00', energy: 80, pedestrians: 20 },
  { time: '04:00', energy: 60, pedestrians: 15 },
  { time: '06:00', energy: 200, pedestrians: 80 },
  { time: '08:00', energy: 450, pedestrians: 180 },
  { time: '10:00', energy: 380, pedestrians: 150 },
  { time: '12:00', energy: 420, pedestrians: 165 },
  { time: '14:00', energy: 320, pedestrians: 130 },
  { time: '16:00', energy: 380, pedestrians: 155 },
  { time: '18:00', energy: 520, pedestrians: 210 },
  { time: '20:00', energy: 360, pedestrians: 145 },
  { time: '22:00', energy: 240, pedestrians: 95 },
];

export const EnergyChart = () => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Produksi Energi Harian
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Rata-rata energi yang dihasilkan per jam (kWh)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--electric-blue))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--electric-blue))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="energy"
                stroke="hsl(var(--electric-blue))"
                strokeWidth={2}
                fill="url(#energyGradient)"
                name="Energi (Wh)"
              />
              <Line
                type="monotone"
                dataKey="pedestrians"
                stroke="hsl(var(--energy-green))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--energy-green))', strokeWidth: 2, r: 4 }}
                name="Pejalan Kaki"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};