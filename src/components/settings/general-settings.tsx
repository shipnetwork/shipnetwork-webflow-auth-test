"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Globe, DollarSign, Calendar, Volume2 } from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";

export function GeneralSettings() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [timezone, setTimezone] = useState("America/New_York");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load user info from Memberstack
    const loadUserInfo = async () => {
      try {
        const memberstack = await getMemberstack();
        const member = await memberstack.getCurrentMember();
        if (member?.data) {
          setDisplayName(
            member.data.customFields?.firstName ||
            member.data.auth?.email?.split("@")[0] ||
            ""
          );
          setEmail(member.data.auth?.email || "");
        }
      } catch (error) {
        console.error("Failed to load user info:", error);
      }
    };
    loadUserInfo();

    // Load saved settings
    const saved = localStorage.getItem("generalSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      setEmailNotifications(settings.emailNotifications ?? true);
      setTimezone(settings.timezone || "America/New_York");
      setCurrency(settings.currency || "USD");
      setDateFormat(settings.dateFormat || "MM/DD/YYYY");
      setSoundEffects(settings.soundEffects ?? true);
      setAutoPlay(settings.autoPlay ?? true);
    }
  }, []);

  const handleSave = () => {
    const settings = {
      displayName,
      emailNotifications,
      timezone,
      currency,
      dateFormat,
      soundEffects,
      autoPlay,
    };
    localStorage.setItem("generalSettings", JSON.stringify(settings));
    setHasChanges(false);
    alert("General settings saved!");
  };

  const markChanged = () => setHasChanges(true);

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User className="w-5 h-5" />
          General Preferences
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and dashboard preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* User Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="display-name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Display Name
            </Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                markChanged();
              }}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="mt-1 bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed here
            </p>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="timezone" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Timezone
            </Label>
            <Select value={timezone} onValueChange={(value) => { setTimezone(value); markChanged(); }}>
              <SelectTrigger id="timezone" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="currency" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Currency Format
            </Label>
            <Select value={currency} onValueChange={(value) => { setCurrency(value); markChanged(); }}>
              <SelectTrigger id="currency" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date-format" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Format
            </Label>
            <Select value={dateFormat} onValueChange={(value) => { setDateFormat(value); markChanged(); }}>
              <SelectTrigger id="date-format" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dashboard Preferences */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Dashboard Preferences</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts for important events
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={(checked) => {
                setEmailNotifications(checked);
                markChanged();
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-effects" className="font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Sound Effects
              </Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for order events and milestones
              </p>
            </div>
            <Switch
              id="sound-effects"
              checked={soundEffects}
              onCheckedChange={(checked) => {
                setSoundEffects(checked);
                markChanged();
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-play" className="font-medium">
                Auto-Play Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically start globe animation on page load
              </p>
            </div>
            <Switch
              id="auto-play"
              checked={autoPlay}
              onCheckedChange={(checked) => {
                setAutoPlay(checked);
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

