import React, { useState } from "react";
import {
  PlusCircle,
  Bell,
  BellOff,
  AlertTriangle,
  CheckCircle,
  X,
  Home as HomeIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Alert {
  id: string;
  asset: string;
  price: number;
  condition: "above" | "below";
  status: "active" | "triggered" | "inactive";
  createdAt: Date;
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      asset: "BTC/USD",
      price: 65000,
      condition: "above",
      status: "active",
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      asset: "ETH/USD",
      price: 3200,
      condition: "below",
      status: "triggered",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "3",
      asset: "AAPL",
      price: 175.5,
      condition: "below",
      status: "active",
      createdAt: new Date(Date.now() - 172800000),
    },
  ]);

  const [newAlert, setNewAlert] = useState({
    asset: "BTC/USD",
    price: 0,
    condition: "above" as "above" | "below",
    notifyOnMobile: true,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateAlert = () => {
    const alert: Alert = {
      id: Math.random().toString(36).substring(2, 9),
      asset: newAlert.asset,
      price: newAlert.price,
      condition: newAlert.condition,
      status: "active",
      createdAt: new Date(),
    };

    setAlerts([alert, ...alerts]);
    setDialogOpen(false);
    setNewAlert({
      asset: "BTC/USD",
      price: 0,
      condition: "above",
      notifyOnMobile: true,
    });
  };

  const toggleAlertStatus = (id: string) => {
    setAlerts(
      alerts.map((alert) => {
        if (alert.id === id) {
          return {
            ...alert,
            status: alert.status === "active" ? "inactive" : "active",
          };
        }
        return alert;
      }),
    );
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "triggered":
        return "bg-orange-100 text-orange-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Bell className="h-4 w-4 text-green-600" />;
      case "triggered":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "inactive":
        return <BellOff className="h-4 w-4 text-gray-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      <Card className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl max-w-7xl mx-auto my-6 border border-gray-800 rounded-xl overflow-hidden">
        <CardHeader className="pb-2 border-b border-gray-700/50 bg-gray-900/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                Smart Price Alerts
              </CardTitle>
              <CardDescription className="text-blue-200/70">
                Get notified when prices hit your targets
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white border-none"
                >
                  <PlusCircle className="h-4 w-4" />
                  New Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Create New Price Alert
                  </DialogTitle>
                  <DialogDescription className="text-blue-200/70">
                    Set up a new price alert for your selected asset.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="asset" className="text-right text-gray-300">
                      Asset
                    </Label>
                    <Select
                      value={newAlert.asset}
                      onValueChange={(value) =>
                        setNewAlert({ ...newAlert, asset: value })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                        <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                        <SelectItem value="AAPL">AAPL</SelectItem>
                        <SelectItem value="MSFT">MSFT</SelectItem>
                        <SelectItem value="TSLA">TSLA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="condition"
                      className="text-right text-gray-300"
                    >
                      Condition
                    </Label>
                    <Select
                      value={newAlert.condition}
                      onValueChange={(value: "above" | "below") =>
                        setNewAlert({ ...newAlert, condition: value })
                      }
                    >
                      <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="above">Price goes above</SelectItem>
                        <SelectItem value="below">Price goes below</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right text-gray-300">
                      Price
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      className="col-span-3 bg-gray-800 border-gray-700 text-white"
                      value={newAlert.price}
                      onChange={(e) =>
                        setNewAlert({
                          ...newAlert,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="mobile"
                      className="text-right text-gray-300"
                    >
                      Mobile notification
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="mobile"
                        checked={newAlert.notifyOnMobile}
                        onCheckedChange={(checked) =>
                          setNewAlert({ ...newAlert, notifyOnMobile: checked })
                        }
                      />
                      <Label htmlFor="mobile" className="text-gray-300">
                        {newAlert.notifyOnMobile ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAlert}
                    disabled={newAlert.price <= 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                  >
                    Create Alert
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="bg-gray-900/30 text-gray-100">
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No alerts set. Create your first alert to get started.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="relative overflow-hidden border border-gray-700/50 bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] rounded-lg border-l-4 border-l-blue-500"
                >
                  <CardContent className="p-4 text-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg text-white">
                            {alert.asset}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(alert.status)} border-0 text-xs`}
                          >
                            <span className="flex items-center gap-1">
                              {getStatusIcon(alert.status)}
                              {alert.status.charAt(0).toUpperCase() +
                                alert.status.slice(1)}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-200/70 mt-1">
                          Price{" "}
                          {alert.condition === "above"
                            ? "goes above"
                            : "goes below"}{" "}
                          <span className="font-semibold">
                            ${alert.price.toLocaleString()}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Created {alert.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700/50"
                          onClick={() => toggleAlertStatus(alert.id)}
                        >
                          {alert.status === "active" ? (
                            <BellOff className="h-4 w-4" />
                          ) : (
                            <Bell className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                          onClick={() => removeAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-700/50 pt-4 bg-gray-900/30 text-gray-300 flex justify-between">
          <p className="text-sm">
            {alerts.filter((a) => a.status === "active").length} active alerts
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-transparent border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            View Alert History
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AlertsPanel;
