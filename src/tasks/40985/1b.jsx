import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const App = () => {
  const [carbonFootprint, setCarbonFootprint] = useState({ transport: 0, energy: 0, food: 0, waste: 0 });
  const [total, setTotal] = useState(0);
  const [goal, setGoal] = useState(10);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('carbonHistory')) || []);

  useEffect(() => {
    const sum = Object.values(carbonFootprint).reduce((a, b) => a + b, 0);
    setTotal(sum);
    const progress = Math.min((sum / goal) * 100, 100);
    // Simulate saving to localStorage
    localStorage.setItem('carbonHistory', JSON.stringify([...history, { date: new Date().toISOString().split('T')[0], total: sum }]));
  }, [carbonFootprint, goal]);

  const handleSliderChange = (category, value) => {
    setCarbonFootprint(prev => ({ ...prev, [category]: value }));
  };

  const treeProgress = () => {
    const progress = (total / goal) * 100;
    if (progress < 25) return '🌱';
    if (progress < 50) return '🌿';
    if (progress < 75) return '🌳';
    return '🌲';
  };

  const downloadHistory = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(history, null, 2)], {type: 'text/json'});
    element.href = URL.createObjectURL(file);
    element.download = "carbon_footprint_history.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="p-4 space-y-4">
      <TitleCard />
      <CarbonCategoryCard onChange={handleSliderChange} values={carbonFootprint} />
      <TotalFootprintCard total={total} />
      <GoalSettingCard goal={goal} setGoal={setGoal} progress={(total / goal) * 100} />
      <SuggestionsList />
      <TreeGrowth tree={treeProgress()} />
      <HistoryList history={history} onDownload={downloadHistory} />
    </div>
  );
};

const TitleCard = () => (
  <Card className="text-center">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Personal Carbon Footprint Tracker</CardTitle>
    </CardHeader>
  </Card>
);

const CarbonCategoryCard = ({ onChange, values }) => (
  <Card>
    <CardHeader>
      <CardTitle>Adjust Your Daily Emissions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {['transport', 'energy', 'food', 'waste'].map(category => (
        <CarbonSlider 
          key={category} 
          label={category} 
          value={values[category]} 
          onChange={(value) => onChange(category, value)} 
        />
      ))}
    </CardContent>
  </Card>
);

const CarbonSlider = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <label>{label.charAt(0).toUpperCase() + label.slice(1)}:</label>
    <Slider value={[value]} onValueChange={onChange} max={10} className="w-3/4" />
    <span>{value} kg CO2</span>
  </div>
);

const TotalFootprintCard = ({ total }) => (
  <Card>
    <CardContent>
      <p className="text-xl font-semibold">Total Daily Carbon Footprint: <span className="text-2xl">{total.toFixed(2)} kg CO2</span></p>
    </CardContent>
  </Card>
);

const GoalSettingCard = ({ goal, setGoal, progress }) => (
  <Card>
    <CardContent>
      <Input 
        type="number" 
        value={goal} 
        onChange={(e) => setGoal(Number(e.target.value))} 
        placeholder="Set daily goal (kg CO2)"
      />
      <Progress value={progress} className="mt-4" />
    </CardContent>
  </Card>
);

const SuggestionsList = () => (
  <Card>
    <CardHeader>
      <CardTitle>Reduce Your Footprint</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-disc pl-5 space-y-2">
        <li>🚲 Use public transport - Reduce by 2 kg CO2</li>
        <li>🥦 Eat plant-based meals - Reduce by 1.5 kg CO2</li>
        <li>♻️ Recycle more - Reduce by 0.5 kg CO2</li>
      </ul>
    </CardContent>
  </Card>
);

const TreeGrowth = ({ tree }) => (
  <div className="text-center text-4xl">{tree}</div>
);

const HistoryList = ({ history, onDownload }) => (
  <Card>
    <CardHeader>
      <CardTitle>Your Carbon Footprint History</CardTitle>
      <Button onClick={onDownload}>Download History</Button>
    </CardHeader>
    <CardContent>
      <ul>
        {history.slice(-5).map((entry, idx) => (
          <li key={idx}>{entry.date}: {entry.total.toFixed(2)} kg CO2</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default App;