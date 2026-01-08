"use client";

import { useMemo } from "react";
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Gauge,
} from "lucide-react";
import type { Order, Warehouse } from "@/lib/globe-mock-data";

interface MetricsPanelProps {
  orders: Order[];
  warehouses: Warehouse[];
}

export function MetricsPanel({ orders, warehouses }: MetricsPanelProps) {
  const metrics = useMemo(() => {
    if (orders.length === 0) {
      return {
        avgProcessingTime: 0,
        successRate: 100,
        peakHourUtilization: 0,
        capacityWarnings: [],
        avgDeliveryTime: 0,
        orderThroughput: 0,
      };
    }

    // Calculate average processing time (simulated: 2-6 hours)
    const avgProcessingTime = orders.reduce((sum, order) => {
      const processingTime = 2 + Math.random() * 4; // 2-6 hours
      return sum + processingTime;
    }, 0) / orders.length;

    // Calculate success rate (simulated: 95-99%)
    const successRate = 95 + Math.random() * 4;

    // Calculate warehouse utilization
    const warehouseOrders = new Map<string, number>();
    orders.forEach((order) => {
      warehouseOrders.set(
        order.from.name,
        (warehouseOrders.get(order.from.name) || 0) + 1
      );
    });

    // Calculate peak hour utilization
    const hourlyOrders = new Map<number, number>();
    orders.forEach((order) => {
      const hour = order.timestamp.getHours();
      hourlyOrders.set(hour, (hourlyOrders.get(hour) || 0) + 1);
    });
    const peakOrders = Math.max(...Array.from(hourlyOrders.values()));
    const avgOrdersPerHour = orders.length / 24;
    const peakHourUtilization = avgOrdersPerHour > 0 ? (peakOrders / avgOrdersPerHour) * 100 : 0;

    // Check for capacity warnings (warehouses over 80% capacity)
    const capacityWarnings: string[] = [];
    const maxCapacityPerWarehouse = 200; // Simulated max capacity
    warehouseOrders.forEach((count, warehouse) => {
      const utilization = (count / maxCapacityPerWarehouse) * 100;
      if (utilization > 80) {
        capacityWarnings.push(`${warehouse} at ${utilization.toFixed(0)}% capacity`);
      }
    });

    // Calculate average delivery time (simulated: 24-72 hours)
    const avgDeliveryTime = orders.reduce((sum, order) => {
      const deliveryTime = 24 + Math.random() * 48; // 24-72 hours
      return sum + deliveryTime;
    }, 0) / orders.length;

    // Calculate order throughput (orders per hour)
    const oldestOrder = orders.reduce((oldest, order) =>
      order.timestamp < oldest.timestamp ? order : oldest
    , orders[0]);
    const hoursSpan = (Date.now() - oldestOrder.timestamp.getTime()) / (1000 * 60 * 60);
    const orderThroughput = hoursSpan > 0 ? orders.length / hoursSpan : 0;

    return {
      avgProcessingTime,
      successRate,
      peakHourUtilization,
      capacityWarnings,
      avgDeliveryTime,
      orderThroughput,
    };
  }, [orders, warehouses]);

  return (
    <div className="absolute top-20 right-4 z-30 w-80 bg-black/70 backdrop-blur-xl border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 p-4 space-y-3">
      <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5" />
        Performance Metrics
      </h3>

      {/* Avg Processing Time */}
      <MetricRow
        icon={Clock}
        label="Avg Processing Time"
        value={`${metrics.avgProcessingTime.toFixed(1)} hrs`}
        status={metrics.avgProcessingTime < 4 ? "good" : "warning"}
      />

      {/* Success Rate */}
      <MetricRow
        icon={CheckCircle2}
        label="Order Success Rate"
        value={`${metrics.successRate.toFixed(1)}%`}
        status={metrics.successRate > 97 ? "good" : "warning"}
      />

      {/* Peak Hour Utilization */}
      <MetricRow
        icon={Gauge}
        label="Peak Hour Utilization"
        value={`${metrics.peakHourUtilization.toFixed(0)}%`}
        status={metrics.peakHourUtilization < 150 ? "good" : "warning"}
      />

      {/* Avg Delivery Time */}
      <MetricRow
        icon={TrendingUp}
        label="Avg Delivery Time"
        value={`${(metrics.avgDeliveryTime / 24).toFixed(1)} days`}
        status={metrics.avgDeliveryTime < 48 ? "good" : "warning"}
      />

      {/* Order Throughput */}
      <MetricRow
        icon={Activity}
        label="Order Throughput"
        value={`${metrics.orderThroughput.toFixed(1)}/hr`}
        status="good"
      />

      {/* Capacity Warnings */}
      {metrics.capacityWarnings.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-semibold">Capacity Warnings</span>
          </div>
          <div className="space-y-1">
            {metrics.capacityWarnings.map((warning, i) => (
              <p key={i} className="text-xs text-gray-300">
                • {warning}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricRow({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  status: "good" | "warning";
}) {
  const statusColor = status === "good" ? "text-green-400" : "text-orange-400";

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${statusColor}`} />
        <span className="text-xs text-gray-300">{label}</span>
      </div>
      <span className={`text-sm font-bold ${statusColor}`}>{value}</span>
    </div>
  );
}

