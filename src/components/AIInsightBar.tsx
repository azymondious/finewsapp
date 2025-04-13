import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIInsight {
  text: string;
  timestamp: string;
  type: "market" | "trade" | "alert" | "general";
}

const defaultInsights: AIInsight[] = [
  {
    text: "Market volatility increasing - consider reducing position sizes",
    timestamp: "Just now",
    type: "market",
  },
  {
    text: "Your win rate is 12% higher on morning trades - consider focusing on this timeframe",
    timestamp: "2h ago",
    type: "trade",
  },
  {
    text: "AAPL showing bullish divergence on 4h chart",
    timestamp: "4h ago",
    type: "alert",
  },
  {
    text: "Your last 5 trades show improved risk management",
    timestamp: "1d ago",
    type: "general",
  },
];

interface AIInsightBarProps {
  insights?: AIInsight[];
  className?: string;
}

const AIInsightBar = ({
  insights = defaultInsights,
  className = "",
}: AIInsightBarProps) => {
  const [currentInsight, setCurrentInsight] = useState<AIInsight>(insights[0]);
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((prevIndex) => (prevIndex + 1) % insights.length);
      setCurrentInsight(insights[insightIndex]);
    }, 8000);

    return () => clearInterval(interval);
  }, [insights, insightIndex]);

  const handleRefresh = () => {
    const nextIndex = (insightIndex + 1) % insights.length;
    setInsightIndex(nextIndex);
    setCurrentInsight(insights[nextIndex]);
  };

  const getTypeStyles = (type: AIInsight["type"]) => {
    switch (type) {
      case "market":
        return "text-gray-300 bg-gray-800";
      case "trade":
        return "text-gray-300 bg-gray-800";
      case "alert":
        return "text-gray-300 bg-gray-800";
      case "general":
        return "text-gray-300 bg-gray-800";
      default:
        return "text-gray-300 bg-gray-800";
    }
  };

  return (
    <motion.div
      className={`w-full py-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-soft overflow-hidden">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-gray-700/50">
              <Sparkles className="h-4 w-4 text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <motion.p
                key={currentInsight.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm text-gray-300 truncate"
              >
                {currentInsight.text}
              </motion.p>
              <div className="flex items-center mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getTypeStyles(currentInsight.type)}`}
                >
                  {currentInsight.type.charAt(0).toUpperCase() +
                    currentInsight.type.slice(1)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {currentInsight.timestamp}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default AIInsightBar;
