import { supabase } from "@/lib/supabaseClient";

export interface Trade {
  id: string;
  asset: string;
  type: "buy" | "sell";
  entryPrice: number;
  exitPrice?: number;
  positionSize: number;
  pnl?: number;
  pnlPercentage?: number;
  status: "open" | "closed";
  timestamp: string;
  duration?: string;
  userId?: string;
}

// Convert database column names to camelCase for frontend
const mapDbTradeToTrade = (dbTrade: any): Trade => ({
  id: dbTrade.id,
  asset: dbTrade.asset,
  type: dbTrade.type,
  entryPrice: parseFloat(dbTrade.entry_price),
  exitPrice: dbTrade.exit_price ? parseFloat(dbTrade.exit_price) : undefined,
  positionSize: parseFloat(dbTrade.position_size),
  pnl: dbTrade.pnl ? parseFloat(dbTrade.pnl) : undefined,
  pnlPercentage: dbTrade.pnl_percentage
    ? parseFloat(dbTrade.pnl_percentage)
    : undefined,
  status: dbTrade.status,
  timestamp: dbTrade.timestamp,
  duration: dbTrade.duration,
  userId: dbTrade.user_id,
});

// Convert camelCase to snake_case for database
const mapTradeToDbTrade = (trade: Partial<Trade>) => {
  const dbTrade: Record<string, any> = {};

  if (trade.asset !== undefined) dbTrade.asset = trade.asset;
  if (trade.type !== undefined) dbTrade.type = trade.type;
  if (trade.entryPrice !== undefined) dbTrade.entry_price = trade.entryPrice;
  if (trade.exitPrice !== undefined) dbTrade.exit_price = trade.exitPrice;
  if (trade.positionSize !== undefined)
    dbTrade.position_size = trade.positionSize;
  if (trade.pnl !== undefined) dbTrade.pnl = trade.pnl;
  if (trade.pnlPercentage !== undefined)
    dbTrade.pnl_percentage = trade.pnlPercentage;
  if (trade.status !== undefined) dbTrade.status = trade.status;
  if (trade.timestamp !== undefined) dbTrade.timestamp = trade.timestamp;
  if (trade.duration !== undefined) dbTrade.duration = trade.duration;
  if (trade.userId !== undefined) dbTrade.user_id = trade.userId;

  return dbTrade;
};

// Fetch all trades for the current user
export const fetchTrades = async (): Promise<Trade[]> => {
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Error fetching trades:", error);
    throw error;
  }

  return data.map(mapDbTradeToTrade);
};

// Add a new trade
export const addTrade = async (trade: Omit<Trade, "id">): Promise<Trade> => {
  // Get the current user's ID
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error getting user:", userError);
    throw userError;
  }

  // Add the user_id to the trade object
  const tradeWithUserId = {
    ...trade,
    userId: userData.user?.id,
  };

  const { data, error } = await supabase
    .from("trades")
    .insert(mapTradeToDbTrade(tradeWithUserId))
    .select()
    .single();

  if (error) {
    console.error("Error adding trade:", error);
    throw error;
  }

  return mapDbTradeToTrade(data);
};

// Update an existing trade
export const updateTrade = async (
  id: string,
  trade: Partial<Trade>,
): Promise<Trade> => {
  const { data, error } = await supabase
    .from("trades")
    .update(mapTradeToDbTrade(trade))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating trade:", error);
    throw error;
  }

  return mapDbTradeToTrade(data);
};

// Delete a trade
export const deleteTrade = async (id: string): Promise<void> => {
  const { error } = await supabase.from("trades").delete().eq("id", id);

  if (error) {
    console.error("Error deleting trade:", error);
    throw error;
  }
};

// Close a trade (update status and add exit details)
export const closeTrade = async (
  id: string,
  exitPrice: number,
  duration: string,
): Promise<Trade> => {
  // First get the trade to calculate P&L
  const { data: tradeData, error: fetchError } = await supabase
    .from("trades")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching trade to close:", fetchError);
    throw fetchError;
  }

  const trade = mapDbTradeToTrade(tradeData);

  // Calculate P&L
  let pnl = 0;
  let pnlPercentage = 0;

  if (trade.type === "buy") {
    pnl = (exitPrice - trade.entryPrice) * trade.positionSize;
    pnlPercentage = ((exitPrice - trade.entryPrice) / trade.entryPrice) * 100;
  } else {
    pnl = (trade.entryPrice - exitPrice) * trade.positionSize;
    pnlPercentage = ((trade.entryPrice - exitPrice) / trade.entryPrice) * 100;
  }

  // Update the trade
  return updateTrade(id, {
    exitPrice,
    status: "closed",
    pnl,
    pnlPercentage,
    duration,
  });
};
