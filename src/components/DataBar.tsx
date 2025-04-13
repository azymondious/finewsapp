import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LineChart, BarChart3, TrendingUp, DollarSign } from "lucide-react";

interface DataMetric {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const defaultMetrics: DataMetric[] = [
  {
    label: "Portfolio Value",
    value: "$24,892",
    change: "+2.4%",
    isPositive: true,
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    label: "Win Rate",
    value: "68%",
    change: "+3.2%",
    isPositive: true,
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: "Active Trades",
    value: "7",
    change: "+2",
    isPositive: true,
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Profit Today",
    value: "$342",
    change: "-$28",
    isPositive: false,
    icon: <LineChart className="h-5 w-5" />,
  },
];

interface DataBarProps {
  metrics?: DataMetric[];
}

const DataBar = ({ metrics = defaultMetrics }: DataBarProps) => {
  return (
    <motion.div
      className="w-full bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10 py-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface MetricCardProps {
  metric: DataMetric;
}

const MetricCard = ({ metric }: MetricCardProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm overflow-hidden">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/10">{metric.icon}</div>
          <div>
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="text-lg font-semibold">{metric.value}</p>
          </div>
        </div>
        <div
          className={`text-sm font-medium ${metric.isPositive ? "text-green-500" : "text-red-500"}`}
        >
          {metric.change}
        </div>
      </div>
    </Card>
  );
};

export default DataBar;
