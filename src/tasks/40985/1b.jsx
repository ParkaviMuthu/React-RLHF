import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const CarbonCategory = ({ name, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">{name}</label>
    <Slider value={[value]} onValueChange={onChange} max={10} className="w-full" />
    <span className="text-right block mt-2 text-sm">{value} kg CO2</span>
  </div>
);

export default function App() {
  const [categories, setCategories] = useState({
    transport: 0,
    energy: 0,
    food: 0,
    waste: 0
  });
  const [total, setTotal] = useState(0);
  const [goal, setGoal] = useState(20); // Default goal in kg CO2
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const sum = Object.values(categories).reduce((a, b) => a + b, 0);
    setTotal(sum);
  }, [categories]);

  const handleSliderChange = (category, value) => {
    setCategories(prev => ({ ...prev, [category]: value[0] }));
  };

  const progress = Math.min((total / goal) * 100, 100);

  const updateHistory = () => {
    const today = new Date().toISOString().split('T')[0];
    if (!history.some(entry => entry.date === today)) {
      setHistory(prev => [...prev, { date: today, total: total }]);
    }
  };

  const downloadHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "carbon_footprint_history.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  useEffect(updateHistory, [total]);

  return (
    <div className="container mx-auto p-4 sm:px-6 lg:px-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Personal Carbon Footprint Tracker</CardTitle>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardContent>
          {Object.keys(categories).map(category => (
            <CarbonCategory 
              key={category} 
              name={category.charAt(0).toUpperCase() + category.slice(1)} 
              value={categories[category]} 
              onChange={(value) => handleSliderChange(category, value)}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent>
          <h2 className="text-xl font-bold">Total Daily Footprint:</h2>
          <p className="text-3xl font-bold">{total} kg CO2</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent>
          <Progress value={progress} className="mb-4" />
          <p>{progress.toFixed(2)}% of your daily goal</p>
          <Input 
            type="number" 
            value={goal} 
            onChange={(e) => setGoal(Number(e.target.value))} 
            placeholder="Set daily goal (kg CO2)"
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Reduce Your Footprint:</h3>
          <ul>
            <li>🚆 Use public transport: -2 kg CO2</li>
            <li>🥗 Eat plant-based: -1.5 kg CO2</li>
            <li>♻️ Reduce waste: -0.5 kg CO2</li>
          </ul>
        </CardContent>
      </Card>

      <div className="my-4 text-center">
        {progress < 25 ? '🌱' : progress < 50 ? '🌿' : progress < 75 ? '🌳' : '🌲🌲🌲'}
      </div>

      <Card className="mt-6">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">History</h3>
          <ul>
            {history.slice(-5).map(entry => (
              <li key={entry.date}>{entry.date}: {entry.total} kg CO2</li>
            ))}
          </ul>
          <Button onClick={downloadHistory}>Download History</Button>
        </CardContent>
      </Card>
    </div>
  );
}
