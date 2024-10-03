import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

function App() {
  const [binary, setBinary] = useState('');
  const [decimal, setDecimal] = useState('');
  const [hex, setHex] = useState('');
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('light');
  const [autoTheme, setAutoTheme] = useState(true);
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (autoTheme) {
      const hour = new Date().getHours();
      setTheme(hour >= 19 || hour < 7 ? 'dark' : 'light');
    }
  }, [autoTheme]);

  const convert = () => {
    if (binary && /^[01]+$/.test(binary)) {
      const dec = parseInt(binary, 2);
      setDecimal(dec.toString());
      setHex(dec.toString(16).toUpperCase());
    } else if (decimal && /^\d+$/.test(decimal)) {
      const bin = parseInt(decimal, 10).toString(2);
      setBinary(bin);
      setHex(parseInt(decimal, 10).toString(16).toUpperCase());
    } else if (hex && /^[0-9A-Fa-f]+$/.test(hex)) {
      const dec = parseInt(hex, 16);
      setDecimal(dec.toString());
      setBinary(dec.toString(2));
    }
    addToHistory();
  };

  const addToHistory = () => {
    const entry = { binary, decimal, hex };
    setHistory([...history, entry]);
  };

  const clearHistory = () => setHistory([]);

  const downloadHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "history.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const startQuiz = () => {
    setQuizQuestions(Array.from({length: 10}, () => ({
      question: 'Convert this to binary: ' + Math.floor(Math.random() * 256),
      answer: Math.floor(Math.random() * 256).toString(2)
    })));
    setQuizActive(true);
    setCurrentQuestion(0);
    setScore(0);
  };

  const handleQuizAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizActive(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">🔢 Number Converter & Quiz 🎓</h1>
          <div className="flex items-center">
            <Switch checked={autoTheme} onCheckedChange={setAutoTheme} /> Auto Theme
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Theme</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {['light', 'dark', 'retro'].map(t => 
                  <DropdownMenuItem key={t} onClick={() => setTheme(t)}>{t}</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {!quizActive ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Converter</CardTitle>
              </CardHeader>
              <CardContent>
                <Input 
                  type="text" 
                  placeholder="Binary" 
                  value={binary} 
                  onChange={e => setBinary(e.target.value)} 
                  disabled={quizActive} 
                />
                <Input 
                  type="number" 
                  placeholder="Decimal" 
                  value={decimal} 
                  onChange={e => setDecimal(e.target.value)} 
                  disabled={quizActive} 
                />
                <Input 
                  type="text" 
                  placeholder="Hexadecimal" 
                  value={hex} 
                  onChange={e => setHex(e.target.value)} 
                  disabled={quizActive} 
                />
                <Button onClick={convert} className="mt-2">Convert</Button>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>History</CardTitle>
              </CardHeader>
              <CardContent>
                {history.map((entry, i) => (
                  <div key={i}>{`${entry.binary} | ${entry.decimal} | ${entry.hex}`}</div>
                ))}
              </CardContent>
              <CardContent>
                <Button onClick={clearHistory} disabled={history.length === 0}>Clear History 🗑️</Button>
                <Button onClick={downloadHistory} disabled={history.length === 0}>Download History 💾</Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Quiz Time! 🧠</CardTitle>
            </CardHeader>
            <CardContent>
              <h2>{quizQuestions[currentQuestion]?.question}</h2>
              <Button onClick={() => handleQuizAnswer(quizQuestions[currentQuestion]?.answer === '1')}>1</Button>
              <Button onClick={() => handleQuizAnswer(quizQuestions[currentQuestion]?.answer === '0')}>0</Button>
              <div>Question {currentQuestion + 1} of 10</div>
              <div>Score: {score}</div>
            </CardContent>
          </Card>
        )}
        {!quizActive && <Button onClick={startQuiz} className="mt-4">Start Quiz 🚀</Button>}
      </div>
    </div>
  );
}

export default App;