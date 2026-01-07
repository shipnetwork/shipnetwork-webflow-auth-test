"use client";

import { useState } from "react";
import { Filter, X, Check, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { WAREHOUSES } from "@/lib/globe-mock-data";

// Product categories with colors
const CATEGORIES = [
  { name: "Electronics", color: "bg-blue-500" },
  { name: "Apparel", color: "bg-pink-500" },
  { name: "Home & Garden", color: "bg-green-500" },
  { name: "Health & Beauty", color: "bg-purple-500" },
  { name: "Sports & Outdoors", color: "bg-orange-500" },
  { name: "Toys & Games", color: "bg-yellow-500" },
  { name: "Food & Beverage", color: "bg-red-500" },
  { name: "Office Supplies", color: "bg-gray-500" },
  { name: "Pet Supplies", color: "bg-amber-500" },
  { name: "Automotive", color: "bg-slate-500" },
];

export interface FilterState {
  categories: Set<string>;
  warehouses: Set<string>;
}

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterControls({ filters, onFiltersChange }: FilterControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filters.categories.size > 0 || filters.warehouses.size > 0;

  const toggleCategory = (category: string) => {
    const newCategories = new Set(filters.categories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleWarehouse = (warehouse: string) => {
    const newWarehouses = new Set(filters.warehouses);
    if (newWarehouses.has(warehouse)) {
      newWarehouses.delete(warehouse);
    } else {
      newWarehouses.add(warehouse);
    }
    onFiltersChange({ ...filters, warehouses: newWarehouses });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: new Set(),
      warehouses: new Set(),
    });
  };

  const selectAllCategories = () => {
    onFiltersChange({
      ...filters,
      categories: new Set(CATEGORIES.map((c) => c.name)),
    });
  };

  const selectAllWarehouses = () => {
    onFiltersChange({
      ...filters,
      warehouses: new Set(WAREHOUSES.map((w) => w.name)),
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white gap-2",
            hasActiveFilters && "border-cyan-500 text-cyan-400"
          )}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 bg-cyan-500 text-black text-xs px-1.5 py-0.5 rounded-full">
              {filters.categories.size + filters.warehouses.size}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 bg-gray-900 border-gray-700 p-0"
        align="end"
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Filter Orders</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-400 hover:text-white h-auto p-1"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">
                Categories
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={
                  filters.categories.size === CATEGORIES.length
                    ? () =>
                        onFiltersChange({ ...filters, categories: new Set() })
                    : selectAllCategories
                }
                className="text-xs text-gray-500 hover:text-white h-auto p-0"
              >
                {filters.categories.size === CATEGORIES.length
                  ? "Deselect all"
                  : "Select all"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.name}
                  onClick={() => toggleCategory(category.name)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left",
                    filters.categories.has(category.name)
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full flex-shrink-0",
                      category.color,
                      !filters.categories.has(category.name) && "opacity-50"
                    )}
                  />
                  <span className="truncate">{category.name}</span>
                  {filters.categories.has(category.name) && (
                    <Check className="h-3 w-3 ml-auto text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Warehouses */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">
                Warehouses
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={
                  filters.warehouses.size === WAREHOUSES.length
                    ? () =>
                        onFiltersChange({ ...filters, warehouses: new Set() })
                    : selectAllWarehouses
                }
                className="text-xs text-gray-500 hover:text-white h-auto p-0"
              >
                {filters.warehouses.size === WAREHOUSES.length
                  ? "Deselect all"
                  : "Select all"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {WAREHOUSES.map((warehouse) => (
                <button
                  key={warehouse.name}
                  onClick={() => toggleWarehouse(warehouse.name)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left",
                    filters.warehouses.has(warehouse.name)
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                >
                  <Building2
                    className={cn(
                      "h-3 w-3 flex-shrink-0",
                      filters.warehouses.has(warehouse.name)
                        ? "text-cyan-400"
                        : "text-gray-600"
                    )}
                  />
                  <span className="truncate text-xs">{warehouse.name}</span>
                  {filters.warehouses.has(warehouse.name) && (
                    <Check className="h-3 w-3 ml-auto text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info text */}
          {hasActiveFilters && (
            <p className="text-xs text-gray-500">
              Showing orders matching selected filters. Non-matching orders will
              appear faded.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Apply filters to orders
 */
export function applyFilters<T extends { from: { name: string }; category: string }>(
  orders: T[],
  filters: FilterState
): T[] {
  if (filters.categories.size === 0 && filters.warehouses.size === 0) {
    return orders;
  }

  return orders.filter((order) => {
    const categoryMatch =
      filters.categories.size === 0 || filters.categories.has(order.category);
    const warehouseMatch =
      filters.warehouses.size === 0 ||
      filters.warehouses.has(order.from.name);
    return categoryMatch && warehouseMatch;
  });
}

