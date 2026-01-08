"use client";

import { useMemo, useState } from "react";
import { X, Download, Calendar, TrendingUp, Package, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import type { Order } from "@/lib/globe-mock-data";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

type DateRange = "7d" | "30d" | "90d" | "all";

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
];

const CHART_COLORS = ["#00d4ff", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#10b981"];

export function ReportsModal({ isOpen, onClose, orders }: ReportsModalProps) {
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    if (dateRange === "all") return orders;

    const now = new Date();
    const daysMap: Record<Exclude<DateRange, "all">, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
    };
    const days = daysMap[dateRange];
    const startDate = startOfDay(subDays(now, days));
    const endDate = endOfDay(now);

    return orders.filter((order) =>
      isWithinInterval(order.timestamp, { start: startDate, end: endDate })
    );
  }, [orders, dateRange]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.value, 0);
    const totalUnits = filteredOrders.reduce((sum, order) => sum + order.units, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate growth rate (compare with previous period)
    const periodDays = dateRange === "all" ? 30 : parseInt(dateRange);
    const previousPeriodStart = subDays(new Date(), periodDays * 2);
    const previousPeriodEnd = subDays(new Date(), periodDays);
    const previousOrders = orders.filter((order) =>
      isWithinInterval(order.timestamp, { start: previousPeriodStart, end: previousPeriodEnd })
    );
    const growthRate =
      previousOrders.length > 0
        ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100
        : 0;

    return {
      totalOrders,
      totalRevenue,
      totalUnits,
      avgOrderValue,
      growthRate,
    };
  }, [filteredOrders, orders, dateRange]);

  // Daily volume data for line chart
  const dailyVolumeData = useMemo(() => {
    const dayMap = new Map<string, { date: string; orders: number; revenue: number }>();

    filteredOrders.forEach((order) => {
      const dateKey = format(order.timestamp, "yyyy-MM-dd");
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, { date: dateKey, orders: 0, revenue: 0 });
      }
      const day = dayMap.get(dateKey)!;
      day.orders += 1;
      day.revenue += order.value;
    });

    return Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredOrders]);

  // Orders by category
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();

    filteredOrders.forEach((order) => {
      categoryMap.set(order.category, (categoryMap.get(order.category) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredOrders]);

  // Orders by warehouse
  const warehouseData = useMemo(() => {
    const warehouseMap = new Map<string, number>();

    filteredOrders.forEach((order) => {
      warehouseMap.set(order.from.name, (warehouseMap.get(order.from.name) || 0) + 1);
    });

    return Array.from(warehouseMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredOrders]);

  // Orders by state
  const stateData = useMemo(() => {
    const stateMap = new Map<string, number>();

    filteredOrders.forEach((order) => {
      const state = order.to.state || order.to.country;
      stateMap.set(state, (stateMap.get(state) || 0) + 1);
    });

    return Array.from(stateMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredOrders]);

  const handleExportReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 212, 255);
    doc.text("ShipNetwork Analytics Report", pageWidth / 2, 20, { align: "center" });
    
    // Date range
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const dateRangeLabel = DATE_RANGES.find((r) => r.value === dateRange)?.label || "All Time";
    doc.text(`Report Period: ${dateRangeLabel}`, pageWidth / 2, 30, { align: "center" });
    doc.text(`Generated: ${format(new Date(), "MMM d, yyyy 'at' h:mm a")}`, pageWidth / 2, 37, { align: "center" });
    
    // Summary Statistics Table
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary Statistics", 14, 50);
    
    autoTable(doc, {
      startY: 55,
      head: [["Metric", "Value"]],
      body: [
        ["Total Orders", summary.totalOrders.toLocaleString()],
        ["Total Revenue", `$${summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
        ["Total Units", summary.totalUnits.toLocaleString()],
        ["Average Order Value", `$${summary.avgOrderValue.toFixed(2)}`],
        ["Growth Rate", `${summary.growthRate > 0 ? "+" : ""}${summary.growthRate.toFixed(1)}%`],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 212, 255] },
    });
    
    // Top Categories
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.text("Top Product Categories", 14, finalY + 15);
    
    autoTable(doc, {
      startY: finalY + 20,
      head: [["Category", "Orders", "Percentage"]],
      body: categoryData.slice(0, 5).map((cat) => [
        cat.name,
        cat.count.toString(),
        `${((cat.count / summary.totalOrders) * 100).toFixed(1)}%`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 212, 255] },
    });
    
    // Top Warehouses
    const finalY2 = (doc as any).lastAutoTable.finalY || 180;
    doc.text("Top Warehouses", 14, finalY2 + 15);
    
    autoTable(doc, {
      startY: finalY2 + 20,
      head: [["Warehouse", "Orders", "Percentage"]],
      body: warehouseData.slice(0, 5).map((wh) => [
        wh.name,
        wh.count.toString(),
        `${((wh.count / summary.totalOrders) * 100).toFixed(1)}%`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 212, 255] },
    });
    
    // Top Destinations (new page if needed)
    const finalY3 = (doc as any).lastAutoTable.finalY || 240;
    if (finalY3 > 250) {
      doc.addPage();
      doc.text("Top Destinations", 14, 20);
      autoTable(doc, {
        startY: 25,
        head: [["Destination", "Orders"]],
        body: stateData.slice(0, 10).map((state) => [state.name, state.count.toString()]),
        theme: "grid",
        headStyles: { fillColor: [0, 212, 255] },
      });
    } else {
      doc.text("Top Destinations", 14, finalY3 + 15);
      autoTable(doc, {
        startY: finalY3 + 20,
        head: [["Destination", "Orders"]],
        body: stateData.slice(0, 10).map((state) => [state.name, state.count.toString()]),
        theme: "grid",
        headStyles: { fillColor: [0, 212, 255] },
      });
    }
    
    // Save PDF
    const filename = `shipnetwork-report-${format(new Date(), "yyyy-MM-dd")}.pdf`;
    doc.save(filename);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-700 pb-4">
          <DialogTitle className="text-2xl font-bold text-cyan-400 flex items-center gap-3">
            <BarChart3 className="w-6 h-6" />
            Analytics Reports
          </DialogTitle>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {DATE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value} className="text-white">
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReport}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <SummaryCard
              icon={Package}
              label="Total Orders"
              value={summary.totalOrders.toLocaleString()}
              color="cyan"
            />
            <SummaryCard
              icon={DollarSign}
              label="Total Revenue"
              value={`$${summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              color="green"
            />
            <SummaryCard
              icon={Package}
              label="Total Units"
              value={summary.totalUnits.toLocaleString()}
              color="blue"
            />
            <SummaryCard
              icon={DollarSign}
              label="Avg Order Value"
              value={`$${summary.avgOrderValue.toFixed(2)}`}
              color="purple"
            />
            <SummaryCard
              icon={TrendingUp}
              label="Growth Rate"
              value={`${summary.growthRate > 0 ? "+" : ""}${summary.growthRate.toFixed(1)}%`}
              color={summary.growthRate >= 0 ? "green" : "red"}
            />
          </div>

          {/* Order Volume Over Time */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Order Volume & Revenue Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tickFormatter={(dateStr) => format(new Date(dateStr), "MMM d")}
                />
                <YAxis yAxisId="left" stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(label) => format(new Date(label), "EEE, MMM d, yyyy")}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  name="Orders"
                  dot={{ stroke: "#00d4ff", strokeWidth: 2, r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Revenue ($)"
                  dot={{ stroke: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category & Warehouse Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Orders by Category */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Orders by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Orders by Warehouse */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Orders by Warehouse</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={warehouseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#00d4ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top States */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Top 10 Destinations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    cyan: "text-cyan-400 bg-cyan-500/10",
    green: "text-green-400 bg-green-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    purple: "text-purple-400 bg-purple-500/10",
    red: "text-red-400 bg-red-500/10",
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-medium text-gray-400 uppercase">{label}</h4>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

