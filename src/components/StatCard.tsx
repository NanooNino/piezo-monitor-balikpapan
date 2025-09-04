import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  change?: number;
  icon: LucideIcon;
  variant?: "default" | "electric" | "energy" | "warning";
  className?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  unit, 
  change, 
  icon: Icon, 
  variant = "default",
  className 
}: StatCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "electric":
        return "bg-gradient-card-electric border-electric/30 shadow-electric backdrop-blur-sm";
      case "energy":
        return "bg-gradient-card-energy border-energy/30 shadow-energy backdrop-blur-sm";
      case "warning":
        return "bg-gradient-to-br from-warning/20 to-warning/10 border-warning/30 backdrop-blur-sm";
      default:
        return "bg-gradient-card-glass border-border/50 backdrop-blur-sm";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "electric":
        return "text-primary-foreground animate-pulse-electric";
      case "energy":
        return "text-success-foreground";
      case "warning":
        return "text-warning";
      default:
        return "text-primary";
    }
  };

  const getValueStyles = () => {
    switch (variant) {
      case "electric":
      case "energy":
        return "text-white font-bold";
      default:
        return "text-foreground font-semibold";
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:scale-105",
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn(
          "text-sm font-medium",
          variant === "electric" || variant === "energy" ? "text-white/90" : "text-muted-foreground"
        )}>
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", getIconStyles())} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={cn("text-2xl", getValueStyles())}>
            {value}
          </div>
          {unit && (
            <div className={cn(
              "text-xs",
              variant === "electric" || variant === "energy" ? "text-white/70" : "text-muted-foreground"
            )}>
              {unit}
            </div>
          )}
        </div>
        {change !== undefined && (
          <div className="flex items-center pt-1">
            <Badge 
              variant={change >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {change >= 0 ? "+" : ""}{change}%
            </Badge>
            <span className={cn(
              "text-xs ml-2",
              variant === "electric" || variant === "energy" ? "text-white/70" : "text-muted-foreground"
            )}>
              dari kemarin
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};