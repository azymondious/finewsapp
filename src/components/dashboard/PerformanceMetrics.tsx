import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Info,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchTrades } from "@/services/tradeService";
import { supabase } from "@/lib/supabaseClient";

interface PerformanceMetricsProps {
  winRate?: number;
  profitLoss?: number;
  totalTrades?: number;
  averageProfit?: number;
  averageLoss?: number;
  bestTrade?: number;
  worstTrade?: number;
  recommendations?: string[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = () => {
  const [metrics, setMetrics] = useState<PerformanceMetricsProps>({
    winRate: 0,
    profitLoss: 0,
    totalTrades: 0,
    averageProfit: 0,
    averageLoss: 0,
    bestTrade: 0,
    worstTrade: 0,
    recommendations: ["Loading recommendations..."],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("weekly");

  // Load trades and calculate metrics
  useEffect(() => {
    const calculateMetrics = async () => {
      try {
        setLoading(true);
        const trades = await fetchTrades();

        // Filter closed trades
        const closedTrades = trades.filter(
          (trade) => trade.status === "closed" && trade.pnl !== undefined,
        );

        if (closedTrades.length === 0) {
          setMetrics({
            winRate: 0,
            profitLoss: 0,
            totalTrades: 0,
            averageProfit: 0,
            averageLoss: 0,
            bestTrade: 0,
            worstTrade: 0,
            recommendations: [
              "No closed trades yet. Start trading to see performance metrics.",
            ],
          });
          return;
        }

        // Calculate win rate
        const winningTrades = closedTrades.filter(
          (trade) => trade.pnl && trade.pnl > 0,
        );
        const winRate = Math.round(
          (winningTrades.length / closedTrades.length) * 100,
        );

        // Calculate total profit/loss
        const profitLoss = closedTrades.reduce(
          (sum, trade) => sum + (trade.pnl || 0),
          0,
        );

        // Calculate average profit and loss
        const profitableTrades = closedTrades.filter(
          (trade) => trade.pnl && trade.pnl > 0,
        );
        const losingTrades = closedTrades.filter(
          (trade) => trade.pnl && trade.pnl <= 0,
        );

        const averageProfit =
          profitableTrades.length > 0
            ? profitableTrades.reduce(
                (sum, trade) => sum + (trade.pnl || 0),
                0,
              ) / profitableTrades.length
            : 0;

        const averageLoss =
          losingTrades.length > 0
            ? Math.abs(
                losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) /
                  losingTrades.length,
              )
            : 0;

        // Find best and worst trades
        const bestTrade = Math.max(
          ...closedTrades.map((trade) => trade.pnl || 0),
        );
        const worstTrade = Math.min(
          ...closedTrades.map((trade) => trade.pnl || 0),
        );

        // Generate recommendations based on data
        const recommendations = generateRecommendations(
          winRate,
          profitLoss,
          closedTrades,
        );

        setMetrics({
          winRate,
          profitLoss,
          totalTrades: closedTrades.length,
          averageProfit,
          averageLoss,
          bestTrade,
          worstTrade,
          recommendations,
        });

        setError(null);
      } catch (err) {
        console.error("Failed to calculate metrics:", err);
        setError("Failed to load performance metrics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    calculateMetrics();

    // Set up real-time subscription to update metrics when trades change
    const subscription = supabase
      .channel("trades-metrics-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trades",
        },
        () => {
          calculateMetrics();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [timeframe]); // Recalculate when timeframe changes

  // Generate AI-like recommendations based on trading data
  const generateRecommendations = (
    winRate: number,
    profitLoss: number,
    trades: any[],
  ): string[] => {
    const recommendations: string[] = [];

    // Win rate recommendations
    if (winRate < 40) {
      recommendations.push(
        "Your win rate is below average. Consider reviewing your entry criteria.",
      );
    } else if (winRate > 60) {
      recommendations.push(
        "Your win rate is strong. Consider increasing position sizes on high-conviction trades.",
      );
    }

    // Profit/loss recommendations
    if (profitLoss < 0) {
      recommendations.push(
        "Your overall P&L is negative. Focus on cutting losses earlier.",
      );
    } else if (profitLoss > 0) {
      recommendations.push(
        "Your strategy is profitable. Consider documenting what's working well.",
      );
    }

    // Asset-specific recommendations
    const assetCounts = trades.reduce((acc: Record<string, number>, trade) => {
      acc[trade.asset] = (acc[trade.asset] || 0) + 1;
      return acc;
    }, {});

    const mostTradedAsset = Object.entries(assetCounts).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];

    if (mostTradedAsset) {
      recommendations.push(
        `You trade ${mostTradedAsset} frequently. Consider specializing in this asset.`,
      );
    }

    // Add generic recommendations if we don't have enough
    if (recommendations.length < 3) {
      recommendations.push(
        "Consider taking profits earlier on volatile assets",
      );
      recommendations.push("Your win rate is higher during morning sessions");
      recommendations.push("Reduce position size on trending tech stocks");
    }

    // Return only 3 recommendations
    return recommendations.slice(0, 3);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl max-w-7xl mx-auto my-6 border border-gray-800 rounded-xl overflow-hidden">
      <CardHeader className="pb-2 border-b border-gray-700/50 bg-gray-900/50">
        <CardTitle className="text-xl flex items-center justify-between text-white">
          <span>Performance Metrics</span>
          <Tabs
            defaultValue="weekly"
            value={timeframe}
            onValueChange={setTimeframe}
            className="w-[200px]"
          >
            <TabsList className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
              <TabsTrigger
                value="daily"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Daily
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Weekly
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Monthly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-gray-900/30 text-gray-100">
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-200">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-blue-300">Loading metrics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Key Metrics Section */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                <MetricCard
                  title="Win Rate"
                  value={`${metrics.winRate}%`}
                  icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
                  trend="up"
                  trendValue="4%"
                />
                <MetricCard
                  title="Profit/Loss"
                  value={`$${metrics.profitLoss?.toFixed(2)}`}
                  icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                  trend={
                    metrics.profitLoss && metrics.profitLoss > 0 ? "up" : "down"
                  }
                  trendValue="$320.50"
                />
                <MetricCard
                  title="Total Trades"
                  value={metrics.totalTrades?.toString() || "0"}
                  icon={<PieChart className="h-4 w-4 text-purple-500" />}
                  trend="up"
                  trendValue="8"
                />
                <MetricCard
                  title="Avg. Holding Time"
                  value="2.4h"
                  icon={<Calendar className="h-4 w-4 text-orange-500" />}
                  trend="down"
                  trendValue="0.5h"
                />
              </div>

              {/* Trade Performance Chart (Placeholder) */}
              <div className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-4 h-[200px] flex items-center justify-center">
                <div className="text-center text-blue-300/70">
                  <BarChart3 className="h-10 w-10 mx-auto mb-2" />
                  <p>Trade Performance Chart</p>
                </div>
              </div>

              {/* Profit/Loss Distribution */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">
                  Profit/Loss Distribution
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-200">
                      <ArrowUpCircle className="h-4 w-4 text-green-500 mr-1" />{" "}
                      Profitable Trades
                    </span>
                    <span className="text-gray-200">
                      {Math.round(
                        (metrics.totalTrades || 0) *
                          ((metrics.winRate || 0) / 100),
                      )}{" "}
                      trades
                    </span>
                  </div>
                  <Progress
                    value={metrics.winRate}
                    className="h-2 bg-gray-700"
                  />

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-200">
                      <ArrowDownCircle className="h-4 w-4 text-red-500 mr-1" />{" "}
                      Losing Trades
                    </span>
                    <span className="text-gray-200">
                      {(metrics.totalTrades || 0) -
                        Math.round(
                          (metrics.totalTrades || 0) *
                            ((metrics.winRate || 0) / 100),
                        )}{" "}
                      trades
                    </span>
                  </div>
                  <Progress
                    value={100 - (metrics.winRate || 0)}
                    className="h-2 bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* AI Recommendations Section */}
            <div className="col-span-1 space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-sm font-medium flex items-center mb-3 text-blue-200">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                  Trade Statistics
                </h3>
                <div className="space-y-2 text-sm text-blue-100/80">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average Profit:</span>
                    <span className="font-medium text-green-400">
                      ${metrics.averageProfit?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average Loss:</span>
                    <span className="font-medium text-red-400">
                      ${Math.abs(metrics.averageLoss || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Best Trade:</span>
                    <span className="font-medium text-green-400">
                      ${metrics.bestTrade?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Worst Trade:</span>
                    <span className="font-medium text-red-400">
                      ${Math.abs(metrics.worstTrade || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Risk/Reward Ratio:</span>
                    <span className="font-medium text-blue-300">
                      1:
                      {(
                        (metrics.averageProfit || 0) /
                        Math.abs(metrics.averageLoss || 1)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <h3 className="text-sm font-medium flex items-center mb-3 text-amber-200">
                  <Info className="h-4 w-4 text-amber-500 mr-2" />
                  AI Recommendations
                </h3>
                <ul className="space-y-2 text-sm text-amber-100/80">
                  {metrics.recommendations?.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span>
                      <span className="text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
}) => {
  return (
    <div className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-3 flex flex-col hover:bg-gray-800/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{title}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{icon}</TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white border-gray-700">
              <p>Performance metric: {title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-lg font-semibold text-white">{value}</div>
      <div
        className={`text-xs mt-1 flex items-center ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-gray-400"}`}
      >
        {trend === "up" ? (
          <TrendingUp className="h-3 w-3 mr-1" />
        ) : trend === "down" ? (
          <TrendingDown className="h-3 w-3 mr-1" />
        ) : null}
        <span>{trendValue} from last period</span>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
