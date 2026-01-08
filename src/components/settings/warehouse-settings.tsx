"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, GripVertical, MapPin } from "lucide-react";
import { WAREHOUSES, type Warehouse } from "@/lib/globe-mock-data";

export function WarehouseSettings() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([...WAREHOUSES]);
  const [hasChanges, setHasChanges] = useState(false);

  const addWarehouse = () => {
    const newWarehouse: Warehouse = {
      name: "New Warehouse",
      lat: 40.7128,
      lng: -74.006,
      intensity: 0,
    };
    setWarehouses([...warehouses, newWarehouse]);
    setHasChanges(true);
  };

  const removeWarehouse = (index: number) => {
    setWarehouses(warehouses.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const updateWarehouse = (index: number, field: keyof Warehouse, value: string | number) => {
    const updated = [...warehouses];
    updated[index] = { ...updated[index], [field]: value };
    setWarehouses(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Save to Memberstack custom fields
    localStorage.setItem("customWarehouses", JSON.stringify(warehouses));
    setHasChanges(false);
    alert("Warehouse settings saved!");
  };

  const handleReset = () => {
    setWarehouses([...WAREHOUSES]);
    setHasChanges(false);
  };

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Warehouse Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your fulfillment center locations
          </p>
        </div>
        <Button onClick={addWarehouse} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Warehouse
        </Button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {warehouses.map((warehouse, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground mt-2 cursor-move" />
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor={`name-${index}`} className="text-xs">
                  Warehouse Name
                </Label>
                <Input
                  id={`name-${index}`}
                  value={warehouse.name}
                  onChange={(e) => updateWarehouse(index, "name", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`lat-${index}`} className="text-xs">
                  Latitude
                </Label>
                <Input
                  id={`lat-${index}`}
                  type="number"
                  step="0.0001"
                  value={warehouse.lat}
                  onChange={(e) => updateWarehouse(index, "lat", parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`lng-${index}`} className="text-xs">
                  Longitude
                </Label>
                <Input
                  id={`lng-${index}`}
                  type="number"
                  step="0.0001"
                  value={warehouse.lng}
                  onChange={(e) => updateWarehouse(index, "lng", parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeWarehouse(index)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}

