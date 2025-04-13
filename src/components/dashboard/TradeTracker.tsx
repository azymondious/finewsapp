import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Clock,
  DollarSign,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  Trade,
  fetchTrades,
  addTrade,
  closeTrade,
  deleteTrade,
} from "@/services/tradeService";
import { format, formatDistanceToNow } from "date-fns";

const TradeTracker = () => {
  const [activeTab, setActiveTab] = useState("open");
  const [showAddTradeForm, setShowAddTradeForm] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newTrade, setNewTrade] = useState({
    asset: "",
    type: "buy",
    entryPrice: "",
    positionSize: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Ensure user is signed in
  useEffect(() => {
    const ensureUserSignedIn = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          // No session, sign in anonymously
          const { error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
        }
      } catch (err) {
        console.error("Auth error:", err);
        setError("Authentication error. Please refresh the page.");
      }
    };

    ensureUserSignedIn();
  }, []);

  // Load trades from Supabase
  useEffect(() => {
    const loadTrades = async () => {
      try {
        setLoading(true);
        const tradesData = await fetchTrades();
        setTrades(tradesData);
        setError(null);
      } catch (err) {
        console.error("Failed to load trades:", err);
        setError("Failed to load trades. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadTrades();

    // Set up real-time subscription
    const subscription = supabase
      .channel("trades-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trades",
        },
        () => {
          loadTrades();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openTrades = trades.filter((trade) => trade.status === "open");
  const closedTrades = trades.filter((trade) => trade.status === "closed");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewTrade({ ...newTrade, [id]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTrade({ ...newTrade, [name]: value });
  };

  const handleAddTrade = async () => {
    try {
      setSubmitting(true);

      // Validate form
      if (!newTrade.asset || !newTrade.entryPrice || !newTrade.positionSize) {
        setError("Please fill in all fields");
        return;
      }

      // Create new trade object
      const tradeToAdd: Omit<Trade, "id"> = {
        asset: newTrade.asset,
        type: newTrade.type as "buy" | "sell",
        entryPrice: parseFloat(newTrade.entryPrice),
        positionSize: parseFloat(newTrade.positionSize),
        status: "open",
        timestamp: new Date().toISOString(),
      };

      // Add to Supabase
      await addTrade(tradeToAdd);

      // Reset form
      setNewTrade({
        asset: "",
        type: "buy",
        entryPrice: "",
        positionSize: "",
      });
      setShowAddTradeForm(false);
      setError(null);
    } catch (err) {
      console.error("Error adding trade:", err);
      setError("Failed to add trade. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseTrade = async (tradeId: string) => {
    try {
      // In a real app, you would show a modal to get the exit price
      // For simplicity, we'll use a prompt
      const exitPriceStr = prompt("Enter exit price:");
      if (!exitPriceStr) return;

      const exitPrice = parseFloat(exitPriceStr);
      if (isNaN(exitPrice)) {
        alert("Please enter a valid number");
        return;
      }

      // Calculate duration (in a real app, this would be more sophisticated)
      const duration = "1h 30m"; // Placeholder

      await closeTrade(tradeId, exitPrice, duration);
    } catch (err) {
      console.error("Error closing trade:", err);
      setError("Failed to close trade. Please try again.");
    }
  };

  const handleDeleteTrade = async (tradeId: string) => {
    if (!confirm("Are you sure you want to delete this trade?")) return;

    try {
      await deleteTrade(tradeId);
    } catch (err) {
      console.error("Error deleting trade:", err);
      setError("Failed to delete trade. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl max-w-7xl mx-auto my-6 border border-gray-800 rounded-xl overflow-hidden">
      <CardHeader className="border-b border-gray-700/50 bg-gray-900/50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              Trade Tracker
            </CardTitle>
            <CardDescription className="text-blue-200/70">
              Track and manage your trading positions
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowAddTradeForm(!showAddTradeForm)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white border-none"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {showAddTradeForm ? "Cancel" : "New Trade"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="bg-gray-900/30 text-gray-100">
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-200">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {showAddTradeForm ? (
          <div className="space-y-4 p-4 border border-gray-700/50 rounded-lg bg-gray-800/40">
            <h3 className="text-lg font-medium text-white">Log New Trade</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asset" className="text-gray-300">
                  Asset
                </Label>
                <Input
                  id="asset"
                  placeholder="BTC/USD"
                  className="bg-gray-800 border-gray-700 text-white"
                  value={newTrade.asset}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-300">
                  Type
                </Label>
                <Select
                  value={newTrade.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="buy">Buy (Long)</SelectItem>
                    <SelectItem value="sell">Sell (Short)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entryPrice" className="text-gray-300">
                  Entry Price
                </Label>
                <Input
                  id="entryPrice"
                  type="number"
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-700 text-white"
                  value={newTrade.entryPrice}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="positionSize" className="text-gray-300">
                  Position Size
                </Label>
                <Input
                  id="positionSize"
                  type="number"
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-700 text-white"
                  value={newTrade.positionSize}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddTradeForm(false)}
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTrade}
                className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Trade"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Tabs defaultValue="open" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
                <TabsTrigger
                  value="open"
                  onClick={() => setActiveTab("open")}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Open Positions ({openTrades.length})
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  onClick={() => setActiveTab("closed")}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Closed Trades ({closedTrades.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="open" className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : openTrades.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No open positions. Add a trade to get started.
                  </div>
                ) : (
                  openTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="p-4 border border-gray-700/50 rounded-lg bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] flex flex-col space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-white">
                            {trade.asset}
                          </h3>
                          <Badge
                            variant={
                              trade.type === "buy" ? "default" : "destructive"
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                          >
                            {trade.type === "buy" ? (
                              <span className="flex items-center gap-1">
                                <ArrowUpCircle size={14} /> Long
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <ArrowDownCircle size={14} /> Short
                              </span>
                            )}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCloseTrade(trade.id)}
                            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                          >
                            Close Position
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTrade(trade.id)}
                            className="bg-transparent border-red-700/50 text-red-300 hover:bg-red-900/30 hover:text-red-200"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-blue-200/70 flex items-center gap-1">
                            <DollarSign size={14} /> Entry Price
                          </span>
                          <span className="font-medium text-white">
                            $
                            {trade.entryPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-blue-200/70 flex items-center gap-1">
                            <BarChart3 size={14} /> Position Size
                          </span>
                          <span className="font-medium text-white">
                            {trade.positionSize}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-blue-200/70 flex items-center gap-1">
                            <Clock size={14} /> Opened
                          </span>
                          <span className="font-medium text-white">
                            {formatDate(trade.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="closed" className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : closedTrades.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No closed trades yet.
                  </div>
                ) : (
                  closedTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className={`p-4 border border-gray-700/50 rounded-lg bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] flex flex-col space-y-3 ${trade.pnl && trade.pnl > 0 ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-white">
                            {trade.asset}
                          </h3>
                          <Badge
                            variant={
                              trade.type === "buy" ? "default" : "destructive"
                            }
                            className={
                              trade.type === "buy"
                                ? "bg-blue-600 text-white"
                                : "bg-red-600 text-white"
                            }
                          >
                            {trade.type === "buy" ? (
                              <span className="flex items-center gap-1">
                                <ArrowUpCircle size={14} /> Long
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <ArrowDownCircle size={14} /> Short
                              </span>
                            )}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              trade.pnl && trade.pnl > 0
                                ? "default"
                                : "destructive"
                            }
                            className={`text-sm ${trade.pnl && trade.pnl > 0 ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                          >
                            {trade.pnl && trade.pnl > 0 ? "+" : ""}
                            {trade.pnl?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            (
                            {trade.pnlPercentage && trade.pnlPercentage > 0
                              ? "+"
                              : ""}
                            {trade.pnlPercentage}%)
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTrade(trade.id)}
                            className="bg-transparent border-red-700/50 text-red-300 hover:bg-red-900/30 hover:text-red-200"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-blue-200/70">
                            Entry Price
                          </span>
                          <span className="font-medium text-white">
                            $
                            {trade.entryPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-blue-200/70">
                            Exit Price
                          </span>
                          <span className="font-medium text-white">
                            $
                            {trade.exitPrice?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-blue-200/70">
                            Position Size
                          </span>
                          <span className="font-medium text-white">
                            {trade.positionSize}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-blue-200/70">
                            Duration
                          </span>
                          <span className="font-medium text-white">
                            {trade.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-700/50 pt-4 bg-gray-900/30 text-gray-300">
        <div className="text-sm">
          {activeTab === "open"
            ? `${openTrades.length} open positions`
            : `${closedTrades.length} closed trades`}
        </div>
        {activeTab === "closed" && closedTrades.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">Win Rate:</span>
            <span className="ml-1 text-green-400">
              {Math.round(
                (closedTrades.filter((t) => t.pnl && t.pnl > 0).length /
                  closedTrades.length) *
                  100,
              )}
              %
            </span>{" "}
            |<span className="font-medium ml-2">Avg. Profit:</span>
            <span className="ml-1 text-green-400">
              {closedTrades.length > 0
                ? (
                    closedTrades.reduce(
                      (sum, trade) => sum + (trade.pnlPercentage || 0),
                      0,
                    ) / closedTrades.length
                  ).toFixed(1)
                : "0"}
              %
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TradeTracker;
