import type { Order, Stats } from "./globe-mock-data";

/**
 * Export utilities for order data and statistics
 */

export function exportOrdersAsCSV(orders: Order[], stats?: Stats): string {
  // CSV Headers
  const headers = [
    "Order ID",
    "Date",
    "Time",
    "From Warehouse",
    "To City",
    "To State/Country",
    "Category",
    "Value (USD)",
    "Units",
    "Latitude",
    "Longitude",
  ];

  // Convert orders to CSV rows
  const rows = orders.map((order) => [
    order.id,
    order.timestamp.toLocaleDateString(),
    order.timestamp.toLocaleTimeString(),
    order.from.name,
    order.to.city,
    order.to.state || order.to.country,
    order.category,
    order.value.toFixed(2),
    order.units.toString(),
    order.to.lat.toFixed(6),
    order.to.lng.toFixed(6),
  ]);

  // Add stats summary at the top if provided
  let csv = "";
  if (stats) {
    csv += "Summary Statistics\n";
    csv += `Total Orders,${stats.totalOrders}\n`;
    csv += `Total Units,${stats.totalUnits}\n`;
    csv += `Total Value,$${stats.totalValue.toFixed(2)}\n`;
    csv += "\n";
  }

  // Add headers and data
  csv += headers.join(",") + "\n";
  csv += rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

  return csv;
}

export function exportOrdersAsJSON(orders: Order[], stats?: Stats): string {
  const data = {
    exportDate: new Date().toISOString(),
    summary: stats
      ? {
          totalOrders: stats.totalOrders,
          totalUnits: stats.totalUnits,
          totalValue: stats.totalValue,
          topStates: stats.topStates,
          topCategories: stats.topCategories,
        }
      : undefined,
    orders: orders.map((order) => ({
      id: order.id,
      timestamp: order.timestamp.toISOString(),
      from: {
        warehouse: order.from.name,
        lat: order.from.lat,
        lng: order.from.lng,
      },
      to: {
        city: order.to.city,
        state: order.to.state,
        country: order.to.country,
        lat: order.to.lat,
        lng: order.to.lng,
      },
      category: order.category,
      value: order.value,
      units: order.units,
    })),
  };

  return JSON.stringify(data, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCSV(orders: Order[], stats?: Stats): void {
  const csv = exportOrdersAsCSV(orders, stats);
  const filename = `shipnetwork-orders-${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

export function exportJSON(orders: Order[], stats?: Stats): void {
  const json = exportOrdersAsJSON(orders, stats);
  const filename = `shipnetwork-orders-${new Date().toISOString().split("T")[0]}.json`;
  downloadFile(json, filename, "application/json;charset=utf-8;");
}

