import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";

// Utility function to convert degrees to radians
const degToRad = (deg) => (deg * Math.PI) / 180;

// Main App Component
export default function App() {
  const [currentTab, setCurrentTab] = useState('🧮');
  const [calcValue, setCalcValue] = useState('');
  const [history, setHistory] = useState([]);
  const [trigValue, setTrigValue] = useState('0');
  const [rootValue, setRootValue] = useState('');
  const [rootDegree, setRootDegree] = useState('2');

  const tabs = [
    { emoji: '🧮', name: 'Calculator' },
    { emoji: '📜', name: 'History' },
    { emoji: '📐', name: 'Trigs' },
    { emoji: '🔢', name: 'Roots' }
  ];

  // Memoize trigonometric calculations
  const trigCalculations = useMemo(() => {
    const angleInRad = degToRad(parseFloat(trigValue));
    return {
      sin: Math.sin(angleInRad).toFixed(4),
      cos: Math.cos(angleInRad).toFixed(4),
      tan: Math.tan(angleInRad).toFixed(4),
      asin: Math.asin(angleInRad).toFixed(4),
      acos: Math.acos(angleInRad).toFixed(4),
      atan: Math.atan(angleInRad).toFixed(4)
    };
  }, [trigValue]);

  const handleOperation = (operation) => {
    try {
      let result = eval(calcValue.replace(/[^0-9\+\-\*\/\.]/g, ''));
      setCalcValue(result.toString());
      setHistory(prev => [(result + ' = ' + calcValue), ...prev.slice(0, 9)]);
    } catch (e) {
      setCalcValue('Error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
      <Card className="max-w-lg mx-auto h-full">
        <CardContent className="p-4">
          <div className="mb-4">
            {currentTab === '🧮' && <CalculatorTab 
              value={calcValue} 
              setValue={setCalcValue} 
              onOperation={handleOperation} />}
            {currentTab === '📜' && <HistoryTab history={history} />}
            {currentTab === '📐' && <TrigsTab value={trigValue} setValue={setTrigValue} calculations={trigCalculations} />}
            {currentTab === '🔢' && <RootsTab value={rootValue} setValue={setRootValue} degree={rootDegree} setDegree={setRootDegree} />}
          </div>
          <TabBar tabs={tabs} currentTab={currentTab} setTab={setCurrentTab} />
        </CardContent>
      </Card>
    </div>
  );
}

// Components for each tab would follow here, using similar structure with Tailwind classes for styling.