import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);
  const [angle, setAngle] = useState(0);
  const [number, setNumber] = useState('');
  const [rootDegree, setRootDegree] = useState('2');

  const calculate = () => {
    try {
      let result = eval(expression.replace(/[^0-9+\-*/().]/g, ''));
      if (isNaN(result) || !isFinite(result)) throw Error;
      const newHistory = [expression + ' = ' + result, ...history].slice(0, 10);
      setHistory(newHistory);
      setExpression(String(result));
    } catch (e) {
      setExpression('Error');
    }
  };

  const trigFunctions = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    return {
      sin: Math.sin(rad).toFixed(4),
      cos: Math.cos(rad).toFixed(4),
      tan: Math.tan(rad).toFixed(4),
      asin: Math.asin(Math.sin(rad)).toFixed(4),
      acos: Math.acos(Math.cos(rad)).toFixed(4),
      atan: Math.atan(Math.tan(rad)).toFixed(4),
    };
  }, [angle]);

  const nthRoot = (num, n) => {
    return Math.pow(num, 1/n).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <Tabs defaultValue="calculator" className="w-full max-w-lg mx-auto">
        <TabsList>
          <TabsTrigger value="calculator">🧮 Calculator</TabsTrigger>
          <TabsTrigger value="history">📜 History</TabsTrigger>
          <TabsTrigger value="trigs">📐 Trigs</TabsTrigger>
          <TabsTrigger value="roots">🔢 Roots</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator">
          <Input 
            value={expression} 
            onChange={(e) => setExpression(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && calculate()}
            className="mb-4"
          />
          <div className="grid grid-cols-4 gap-2">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', '(', ')', 'C'].map(char => (
              <Button 
                key={char} 
                onClick={() => {
                  if (char === 'C') setExpression('');
                  else if (char === '=') calculate();
                  else setExpression(prev => prev + char);
                }}
                className="hover:scale-105 transition-transform"
              >
                {char === 'C' ? (window.innerWidth < 640 ? '🗑️' : '🗑️ Clear') : char === '=' ? '🔙' : char}
              </Button>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="history">
          <ul className="list-disc pl-5">
            {history.map((entry, idx) => <li key={idx}>{entry}</li>)}
          </ul>
        </TabsContent>
        <TabsContent value="trigs">
          <Input 
            type="number" 
            value={angle} 
            onChange={(e) => setAngle(e.target.value)} 
            placeholder="Enter angle in degrees"
            className="mb-4"
          />
          {Object.entries(trigFunctions).map(([func, value]) => (
            <div key={func} className="mb-2">
              {func.toUpperCase()}: {value} ⭐
            </div>
          ))}
        </TabsContent>
        <TabsContent value="roots">
          <div className="mb-4">
            <Input 
              type="number" 
              value={number} 
              onChange={(e) => setNumber(e.target.value)} 
              placeholder="Enter number for nth root" 
              className="mb-2"
            />
            <label>🔢 Square Root</label>
          </div>
          <div>
            <Input 
              type="number" 
              value={rootDegree} 
              onChange={(e) => setRootDegree(e.target.value)} 
              placeholder="Enter n (root)" 
            />
            <label>✨ Nth Root</label>
          </div>
          <Button onClick={() => setExpression(nthRoot(number, rootDegree))}>Calculate</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;