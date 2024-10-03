import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// Converter Component
const Converter = ({ onConvert }) => {
  const [binary, setBinary] = useState('');
  const [decimal, setDecimal] = useState('');
  const [hex, setHex] = useState('');

  const validateAndConvert = (value, type) => {
    if (type === 'binary' && !/^[01]+$/.test(value)) return;
    if (type === 'decimal' && !/^\d+$/.test(value)) return;
    if (type === 'hex' && !/^[0-9A-Fa-f]+$/.test(value)) return;

    const d = parseInt(value, type === 'binary' ? 2 : type === 'hex' ? 16 : 10);
    onConvert({
      binary: d.toString(2),
      decimal: d.toString(10),
      hex: d.toString(16).toUpperCase()
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔢 Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          label="Binary" 
          emoji="🐱‍💻" 
          value={binary} 
          onChange={(e) => {setBinary(e.target.value); validateAndConvert(e.target.value, 'binary');}}
        />
        <Input 
          label="Decimal" 
          emoji="🔟" 
          value={decimal} 
          onChange={(e) => {setDecimal(e.target.value); validateAndConvert(e.target.value, 'decimal');}}
        />
        <Input 
          label="Hexadecimal" 
          emoji="🖥️" 
          value={hex} 
          onChange={(e) => {setHex(e.target.value); validateAndConvert(e.target.value, 'hex');}}
        />
      </CardContent>
    </Card>
  );
};

// History Component
const History = ({ history, clearHistory, downloadHistory }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📜 History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.map((item, idx) => (
          <div key={idx}>{`${item.binary} (B) = ${item.decimal} (D) = ${item.hex} (H)`}</div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={downloadHistory} disabled={history.length === 0}>Download History 📥</Button>
        <Button onClick={clearHistory} disabled={history.length === 0}>Clear History 🗑️</Button>
      </CardFooter>
    </Card>
  );
};

// Quiz Component
const Quiz = ({ startQuiz, quizActive, endQuiz }) => {
  if (!quizActive) return <Button onClick={startQuiz}>Start Quiz 🧠</Button>;

  // Here would go quiz logic, for brevity it's simplified
  return (
    <Card>
      <CardContent>
        <div>Question 1/10</div>
        {/* Quiz question UI */}
        <Button onClick={endQuiz}>End Quiz</Button>
      </CardContent>
    </Card>
  );
};

// Theme Picker Component
const ThemePicker = ({ theme, setTheme }) => (
  <div>
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light 🌞</option>
      <option value="dark">Dark 🌙</option>
      <option value="retro">Retro 👾</option>
    </select>
  </div>
);

// Main App Component
export default function App() {
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('light');
  const [quizActive, setQuizActive] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 19 || hour < 7) {
      setTheme('dark');
    }
  }, []);

  const handleConvert = (conversion) => {
    setHistory([...history, conversion]);
  };

  const clearHistory = () => setHistory([]);
  
  const downloadHistory = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(history)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "conversion_history.txt";
    element.click();
  };

  return (
    <div className={`App ${theme}`}>
      <Converter onConvert={handleConvert} />
      <History history={history} clearHistory={clearHistory} downloadHistory={downloadHistory} />
      <Quiz startQuiz={() => setQuizActive(true)} quizActive={quizActive} endQuiz={() => setQuizActive(false)} />
      <ThemePicker theme={theme} setTheme={setTheme} />
      <Switch label="Auto Theme" checked={true} /> {/* Auto theme toggle */}
    </div>
  );
}