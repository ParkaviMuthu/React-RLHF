import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const INITIAL_FOOTPRINT = {
  transport: 5,
  energy: 3,
  food: 4,
  waste: 2,
};

export default function App() {
  const [footprint, setFootprint] = useState(INITIAL_FOOTPRINT);
  const [goal, setGoal] = useState(10);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const total = Object.values(footprint).reduce(
      (sum, value) => sum + value,
      0
    );
    const newEntry = { date: new Date().toISOString(), total };

    setHistory((prev) => {
      const lastEntry = prev[prev.length - 1];
      const lastDate = lastEntry
        ? new Date(lastEntry.date).toLocaleDateString()
        : null;
      const todayDate = new Date().toLocaleDateString();

      // Only add a new entry if the date is different from the last one
      if (lastDate !== todayDate) {
        return [...prev, newEntry];
      }
      return prev;
    });
  }, [footprint, goal]);

  const totalFootprint = Object.values(footprint).reduce(
    (sum, value) => sum + value,
    0
  );
  const progress = Math.min(((goal - totalFootprint) / goal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4 sm:p-8">
      <Header />
      <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2">
        <CarbonInputForm footprint={footprint} setFootprint={setFootprint} />
        <FootprintSummary totalFootprint={totalFootprint} />
        <ProgressTracker progress={progress} />
        <GoalSetting goal={goal} setGoal={setGoal} />
        <Suggestions totalFootprint={totalFootprint} />
        <VirtualGreenSpace progress={progress} />
        <CarbonFootprintHistory history={history} />
      </div>
    </div>
  );
}

function Header() {
  return (
    <Card className="mb-6 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-green-700">
          Personal Carbon Footprint Tracker
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

function CarbonInputForm({ footprint, setFootprint }) {
  const handleSliderChange = (category, value) => {
    setFootprint((prev) => ({ ...prev, [category]: value[0] }));
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Daily Carbon Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(footprint).map(([category, value]) => (
          <div key={category} className="space-y-2">
            <label className="text-sm font-medium capitalize">{category}</label>
            <Slider
              value={[value]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={(value) => handleSliderChange(category, value)}
              className="w-full"
            />
            <p className="text-xs text-right">{value.toFixed(1)} kg CO2</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function FootprintSummary({ totalFootprint }) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Daily Carbon Footprint</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-center text-green-600">
          {totalFootprint.toFixed(1)} kg CO2
        </p>
        <p className="text-sm text-center mt-2">
          Your estimated daily carbon emissions
        </p>
      </CardContent>
    </Card>
  );
}

function ProgressTracker({ progress }) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Progress Towards Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full h-4" />
        <p className="text-sm text-center mt-2">
          {progress.toFixed(1)}% Complete
        </p>
      </CardContent>
    </Card>
  );
}

function GoalSetting({ goal, setGoal }) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Set Reduction Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={goal}
            onChange={(e) => setGoal(Math.max(0, parseFloat(e.target.value)))}
            className="w-24"
          />
          <span>kg CO2 per day</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Suggestions({ totalFootprint }) {
  const suggestions = [
    { text: "Use public transport", impact: 2.5, emoji: "🚌" },
    { text: "Eat a plant-based meal", impact: 1.5, emoji: "🥗" },
    { text: "Turn off unused electronics", impact: 0.5, emoji: "🔌" },
    { text: "Reduce single-use plastics", impact: 0.3, emoji: "♻️" },
  ];

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Reduction Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span>{suggestion.emoji}</span>
              <span>{suggestion.text}</span>
              <span className="text-green-600 font-bold">
                -{suggestion.impact} kg
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function VirtualGreenSpace({ progress }) {
  const trees = ["🌱", "🌿", "🌳", "🌳🌳", "🌳🌳🌳", "🌳🌳🌳🌳", "🌳🌳🌳🌳🌳"];
  const treeIndex = Math.min(Math.floor(progress / 15), trees.length - 1);

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Your Green Space</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-6xl">{trees[treeIndex]}</div>
        <p className="text-sm text-center mt-4">
          Watch your forest grow as you reduce your carbon footprint!
        </p>
      </CardContent>
    </Card>
  );
}

function CarbonFootprintHistory({ history }) {
  const downloadHistory = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(history));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      "carbon_footprint_history.json"
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Carbon Footprint History</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 max-h-40 overflow-y-auto mb-4">
          {history
            .slice(-5)
            .reverse()
            .map((entry, index) => (
              <li key={index} className="text-sm">
                {new Date(entry.date).toLocaleDateString()}:{" "}
                {entry.total.toFixed(1)} kg CO2
              </li>
            ))}
        </ul>
        <Button onClick={downloadHistory} className="w-full">
          Download History
        </Button>
      </CardContent>
    </Card>
  );
}
