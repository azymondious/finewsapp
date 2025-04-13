import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  Filter,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  bias: "bullish" | "bearish" | "neutral";
  relevance: number;
  content: string;
  imageUrl?: string;
}

const NewsFeed = ({
  newsItems = mockNewsItems,
}: {
  newsItems?: NewsItem[];
}) => {
  const [filter, setFilter] = useState<
    "all" | "bullish" | "bearish" | "neutral"
  >("all");
  const [sortBy, setSortBy] = useState<"relevance" | "time">("relevance");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (expandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };

  const filteredNews = newsItems.filter((item) => {
    if (filter === "all") return true;
    return item.bias === filter;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    if (sortBy === "relevance") {
      return b.relevance - a.relevance;
    } else {
      // Sort by time (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Home button removed as it's already in the Layout component */}
      <Card className="w-full h-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 shadow-xl backdrop-blur-sm max-w-7xl mx-auto my-6 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2 border-b border-white/10 bg-black/20">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              AI News Feed
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortBy(sortBy === "relevance" ? "time" : "relevance")
                }
                className="text-xs flex items-center gap-1 bg-transparent border-white/20 text-white hover:bg-blue-900/50 hover:border-blue-400/30 hover:text-white transition-all duration-300"
              >
                {sortBy === "relevance" ? (
                  <TrendingUp size={14} className="text-blue-400" />
                ) : (
                  <Clock size={14} className="text-blue-400" />
                )}
                {sortBy === "relevance" ? "By Relevance" : "By Time"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1 bg-transparent border-white/20 text-white hover:bg-blue-900/50 hover:border-blue-400/30 hover:text-white transition-all duration-300"
              >
                <Filter size={14} className="text-blue-400" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1 bg-transparent border-white/20 text-white hover:bg-blue-900/50 hover:border-blue-400/30 hover:text-white transition-all duration-300"
              >
                <RefreshCw size={14} className="text-blue-400" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 bg-gray-900/30">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4 bg-gray-800/50 rounded-xl overflow-hidden border border-white/5">
              <TabsTrigger
                value="all"
                onClick={() => setFilter("all")}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="bullish"
                onClick={() => setFilter("bullish")}
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Bullish
              </TabsTrigger>
              <TabsTrigger
                value="bearish"
                onClick={() => setFilter("bearish")}
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
              >
                Bearish
              </TabsTrigger>
              <TabsTrigger
                value="neutral"
                onClick={() => setFilter("neutral")}
                className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
              >
                Neutral
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <ScrollArea className="h-[500px] pr-4">
                {sortedNews.map((item) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    isExpanded={expandedItems.has(item.id)}
                    onToggleExpand={() => toggleExpand(item.id)}
                  />
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="bullish" className="mt-0">
              <ScrollArea className="h-[500px] pr-4">
                {sortedNews
                  .filter((item) => item.bias === "bullish")
                  .map((item) => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      isExpanded={expandedItems.has(item.id)}
                      onToggleExpand={() => toggleExpand(item.id)}
                    />
                  ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="bearish" className="mt-0">
              <ScrollArea className="h-[500px] pr-4">
                {sortedNews
                  .filter((item) => item.bias === "bearish")
                  .map((item) => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      isExpanded={expandedItems.has(item.id)}
                      onToggleExpand={() => toggleExpand(item.id)}
                    />
                  ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="neutral" className="mt-0">
              <ScrollArea className="h-[500px] pr-4">
                {sortedNews
                  .filter((item) => item.bias === "neutral")
                  .map((item) => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      isExpanded={expandedItems.has(item.id)}
                      onToggleExpand={() => toggleExpand(item.id)}
                    />
                  ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface NewsCardProps {
  item: NewsItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const NewsCard = ({ item, isExpanded, onToggleExpand }: NewsCardProps) => {
  const getBiasBadge = (bias: string) => {
    switch (bias) {
      case "bullish":
        return (
          <Badge className="bg-green-900/60 text-green-200 hover:bg-green-800/80 flex items-center gap-1 border border-green-500/30">
            <ArrowUpCircle size={14} />
            Bullish
          </Badge>
        );
      case "bearish":
        return (
          <Badge className="bg-red-900/60 text-red-200 hover:bg-red-800/80 flex items-center gap-1 border border-red-500/30">
            <ArrowDownCircle size={14} />
            Bearish
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-700/60 text-gray-200 hover:bg-gray-700/80 border border-gray-500/30">
            Neutral
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 overflow-hidden border border-white/10 bg-gray-800/40 backdrop-blur-sm hover:bg-gray-800/60 transition-all rounded-xl hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:scale-[1.01] duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-blue-500/30 bg-blue-900/20">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.source}`}
                  alt={item.source}
                />
                <AvatarFallback className="bg-blue-900/50 text-blue-200">
                  {item.source.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{item.source}</p>
                <p className="text-xs text-blue-300/70">{item.timestamp}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getBiasBadge(item.bias)}
              <Badge
                variant="outline"
                className="bg-blue-900/50 text-blue-200 border-blue-500/30"
              >
                {item.relevance}/10
              </Badge>
            </div>
          </div>

          <h3 className="text-base font-semibold mt-3 text-white">
            {item.title}
          </h3>

          <div
            className={`mt-2 text-sm text-blue-100/80 ${isExpanded ? "" : "line-clamp-3"}`}
          >
            {item.content}
          </div>

          {item.imageUrl && (
            <div className="mt-3">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-40 object-cover rounded-md border border-white/10"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="mt-2 text-xs flex items-center gap-1 text-blue-300 hover:text-blue-100 hover:bg-blue-900/30"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                Read More
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Mock data for demonstration
const mockNewsItems: NewsItem[] = [
  {
    id: "1",
    title:
      "Bitcoin Breaks $60K Resistance Level, Analysts Predict Further Gains",
    source: "CryptoNews",
    timestamp: "2023-06-15T10:30:00Z",
    bias: "bullish",
    relevance: 9,
    content:
      "Bitcoin has surged past the critical $60,000 resistance level, reaching a new 3-month high. Technical analysts point to decreasing exchange reserves and increasing institutional interest as catalysts for this move. Several prominent traders expect the momentum to continue, with price targets ranging from $65,000 to $75,000 in the coming weeks.",
    imageUrl:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
  },
  {
    id: "2",
    title: "Fed Signals Potential Rate Hikes, Markets React Negatively",
    source: "MarketWatch",
    timestamp: "2023-06-14T16:45:00Z",
    bias: "bearish",
    relevance: 8,
    content:
      "The Federal Reserve has indicated it may implement additional interest rate hikes to combat persistent inflation. In the minutes from their latest meeting, officials expressed concerns that inflation remains above their 2% target despite previous monetary tightening. Equity markets responded with a broad selloff, with tech stocks particularly affected. Traders are now pricing in a higher probability of a recession by early next year.",
  },
  {
    id: "3",
    title: "Ethereum Layer 2 Solutions See Record Transaction Volume",
    source: "BlockchainInsider",
    timestamp: "2023-06-15T08:15:00Z",
    bias: "bullish",
    relevance: 7,
    content:
      "Ethereum scaling solutions Arbitrum and Optimism have reported record-breaking transaction volumes this week. The surge coincides with several major DeFi protocols launching on these Layer 2 networks to take advantage of lower fees and faster confirmation times. This development is seen as positive for the broader Ethereum ecosystem, potentially reducing congestion on the main chain.",
  },
  {
    id: "4",
    title: "Major Tech Company Reports Mixed Quarterly Results",
    source: "TechDaily",
    timestamp: "2023-06-14T21:30:00Z",
    bias: "neutral",
    relevance: 6,
    content:
      "A leading technology company released its quarterly earnings report today, showing revenue slightly above expectations but profits falling short of analyst forecasts. The company cited ongoing supply chain challenges and increased R&D spending as factors affecting the bottom line. Management maintained their full-year guidance, suggesting confidence in stronger performance for the remainder of the fiscal year.",
  },
  {
    id: "5",
    title: "Oil Prices Drop on Increased Production Announcements",
    source: "EnergyReport",
    timestamp: "2023-06-15T12:10:00Z",
    bias: "bearish",
    relevance: 7,
    content:
      "Crude oil prices fell by over 3% today following announcements from several major producers that they plan to increase output in the coming months. The decision comes despite recent OPEC+ agreements to maintain production cuts. Analysts suggest this could lead to oversupply in an already weakening demand environment, potentially pushing prices down further in the near term.",
  },
  {
    id: "6",
    title: "New Regulatory Framework for Cryptocurrencies Proposed",
    source: "PolicyUpdate",
    timestamp: "2023-06-14T14:20:00Z",
    bias: "neutral",
    relevance: 8,
    content:
      "Lawmakers have introduced a comprehensive bill aimed at creating a clear regulatory framework for digital assets. The proposed legislation would classify various types of cryptocurrencies and assign oversight responsibilities to existing financial regulators. Industry participants have expressed mixed reactions, with some welcoming the clarity while others worry about potential compliance burdens.",
  },
];

export default NewsFeed;
