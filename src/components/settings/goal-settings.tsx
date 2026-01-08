"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Target, TrendingUp, DollarSign, Package } from "lucide-react";

export function GoalSettings() {
  const [dailyOrderGoal, setDailyOrderGoal] = useState(500);
  const [weeklyOrderGoal, setWeeklyOrderGoal] = useState(3500);
  const [monthlyOrderGoal, setMonthlyOrderGoal] = useState(15000);
  const [revenueTarget, setRevenueTarget] = useState(50000);
  const [unitTarget, setUnitTarget] = useState(10000);
  const [celebrationsEnabled, setCelebrationsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    const settings = {
      dailyOrderGoal,
      weeklyOrderGoal,
      monthlyOrderGoal,
      revenueTarget,
      unitTarget,
      celebrationsEnabled,
      notificationsEnabled,
    };
    localStorage.setItem("goalSettings", JSON.stringify(settings));
    setHasChanges(false);
    alert("Goal settings saved!");
  };

  const markChanged = () => setHasChanges(true);

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5" />
          Daily Goal Configuration
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Set your performance targets and milestone celebrations
        </p>
      </div>

      <div className="space-y-6">
        {/* Order Goals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="daily-goal" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Daily Order Goal
            </Label>
            <Input
              id="daily-goal"
              type="number"
              value={dailyOrderGoal}
              onChange={(e) => {
                setDailyOrderGoal(parseInt(e.target.value));
                markChanged();
              }}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="weekly-goal" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Weekly Order Goal
            </Label>
            <Input
              id="weekly-goal"
              type="number"
              value={weeklyOrderGoal}
              onChange={(e) => {
                setWeeklyOrderGoal(parseInt(e.target.value));
                markChanged();
              }}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="monthly-goal" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Monthly Order Goal
            </Label>
            <Input
              id="monthly-goal"
              type="number"
              value={monthlyOrderGoal}
              onChange={(e) => {
                setMonthlyOrderGoal(parseInt(e.target.value));
                markChanged();
              }}
              className="mt-1"
            />
          </div>
        </div>

        {/* Revenue & Unit Targets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="revenue-target" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Monthly Revenue Target ($)
            </Label>
            <Input
              id="revenue-target"
              type="number"
              value={revenueTarget}
              onChange={(e) => {
                setRevenueTarget(parseInt(e.target.value));
                markChanged();
              }}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="unit-target" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Monthly Unit Shipping Target
            </Label>
            <Input
              id="unit-target"
              type="number"
              value={unitTarget}
              onChange={(e) => {
                setUnitTarget(parseInt(e.target.value));
                markChanged();
              }}
              className="mt-1"
            />
          </div>
        </div>

        {/* Celebrations & Notifications */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="celebrations" className="font-medium">
                Milestone Celebrations
              </Label>
              <p className="text-sm text-muted-foreground">
                Show confetti and animations when reaching milestones
              </p>
            </div>
            <Switch
              id="celebrations"
              checked={celebrationsEnabled}
              onCheckedChange={(checked) => {
                setCelebrationsEnabled(checked);
                markChanged();
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="font-medium">
                Goal Achievement Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts when goals are achieved
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={(checked) => {
                setNotificationsEnabled(checked);
                markChanged();
              }}
            />
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => setHasChanges(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}

