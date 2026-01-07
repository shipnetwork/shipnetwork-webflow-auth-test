"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { Package, TrendingUp, MapPin, Tag, Clock, Truck } from "lucide-react";
import type { Warehouse, Order } from "@/lib/globe-mock-data";

interface WarehouseModalProps {
  warehouse: Warehouse | null;
  isOpen: boolean;
  onClose: () => void;
  orderHistory: Order[];
}

// Colors for charts
const CHART_COLORS = ["#00d4ff", "#00ff9d", "#ff6b6b", "#ffd93d", "#6b5bff", "#ff9d00"];

// Calculate stats for a warehouse
function calculateWarehouseStats(orders: Order[], warehouseName: string) {
  const warehouseOrders = orders.filter((o) => o.from.name === warehouseName);
  const now = new Date();
  const today = startOfDay(now);
  const weekAgo = subDays(now, 7);
  const monthAgo = subDays(now, 30);

  // Orders by time period
  const todayOrders = warehouseOrders.filter((o) => isSameDay(o.timestamp, today));
  const weekOrders = warehouseOrders.filter((o) => o.timestamp >= weekAgo);
  const monthOrders = warehouseOrders.filter((o) => o.timestamp >= monthAgo);

  // Total units and value
  const totalUnits = warehouseOrders.reduce((sum, o) => sum + o.units, 0);
  const totalValue = warehouseOrders.reduce((sum, o) => sum + o.value, 0);

  // Average processing time (mock: random between 1-4 hours)
  const avgProcessingTime = (Math.random() * 3 + 1).toFixed(1);

  // Utilization (mock: based on order count)
  const utilization = Math.min(40 + warehouseOrders.length * 2, 98);

  // Top destinations
  const destinationCount: Record<string, number> = {};
  warehouseOrders.forEach((o) => {
    const dest = o.to.state || o.to.country;
    destinationCount[dest] = (destinationCount[dest] || 0) + 1;
  });
  const topDestinations = Object.entries(destinationCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top categories
  const categoryCount: Record<string, number> = {};
  warehouseOrders.forEach((o) => {
    categoryCount[o.category] = (categoryCount[o.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / Math.max(warehouseOrders.length, 1)) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Daily order volume (last 7 days)
  const dailyVolume: { date: string; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = subDays(now, i);
    const dayOrders = warehouseOrders.filter((o) => isSameDay(o.timestamp, day));
    dailyVolume.push({
      date: format(day, "MMM d"),
      orders: dayOrders.length,
    });
  }

  // Hourly distribution (for heatmap)
  const hourlyDistribution: { hour: string; orders: number }[] = [];
  for (let h = 0; h < 24; h++) {
    const hourOrders = warehouseOrders.filter((o) => o.timestamp.getHours() === h);
    hourlyDistribution.push({
      hour: format(new Date().setHours(h, 0, 0, 0), "ha"),
      orders: hourOrders.length,
    });
  }

  return {
    total: warehouseOrders.length,
    todayCount: todayOrders.length,
    weekCount: weekOrders.length,
    monthCount: monthOrders.length,
    totalUnits,
    totalValue,
    avgProcessingTime,
    utilization,
    topDestinations,
    topCategories,
    dailyVolume,
    hourlyDistribution,
  };
}

// Stat card component
function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
}) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subValue && <div className="text-xs text-gray-500">{subValue}</div>}
    </div>
  );
}

export function WarehouseModal({
  warehouse,
  isOpen,
  onClose,
  orderHistory,
}: WarehouseModalProps) {
  const stats = useMemo(() => {
    if (!warehouse) return null;
    return calculateWarehouseStats(orderHistory, warehouse.name);
  }, [warehouse, orderHistory]);

  if (!warehouse || !stats) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-cyan-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Package className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-cyan-400">{warehouse.name}</span>
              <p className="text-sm font-normal text-gray-400 mt-1">
                Fulfillment Center Statistics
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Live Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <StatCard
            icon={Package}
            label="Today"
            value={stats.todayCount}
            subValue="orders shipped"
          />
          <StatCard
            icon={TrendingUp}
            label="This Week"
            value={stats.weekCount}
            subValue="orders shipped"
          />
          <StatCard
            icon={Truck}
            label="Utilization"
            value={`${stats.utilization}%`}
            subValue="capacity"
          />
          <StatCard
            icon={Clock}
            label="Avg Processing"
            value={`${stats.avgProcessingTime}h`}
            subValue="per order"
          />
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Daily Volume Chart */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Order Volume (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.dailyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  dot={{ fill: "#00d4ff", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown Pie Chart */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-400" />
              Category Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.topCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="name"
                >
                  {stats.topCategories.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => [`${value} orders`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {stats.topCategories.slice(0, 4).map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-1 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i] }}
                  />
                  <span className="text-gray-400">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row - Destinations and Peak Hours */}
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Top Destinations */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Top Destinations
            </h3>
            <div className="space-y-3">
              {stats.topDestinations.map((dest, i) => (
                <div key={dest.name} className="flex items-center gap-3">
                  <span className="text-cyan-400 font-mono text-sm w-6">
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-200">{dest.name}</span>
                      <span className="text-gray-400">{dest.count} orders</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"
                        style={{
                          width: `${(dest.count / Math.max(stats.topDestinations[0]?.count || 1, 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours Heatmap as Bar Chart */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Peak Activity Hours
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={stats.hourlyDistribution.filter((_, i) => i % 3 === 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="orders" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {stats.total.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Total Orders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {stats.totalUnits.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Total Units</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                ${stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-gray-400">Total Value</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

