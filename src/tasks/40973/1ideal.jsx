import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const THEMES = {
  light: "bg-white text-black",
  dark: "bg-gray-900 text-white",
  retro: "bg-green-100 text-green-900 font-mono",
};

const EMOJIS = {
  binary: "🔢",
  decimal: "🔟",
  hexadecimal: "🔠",
  quiz: "🧠",
  history: "📜",
  theme: "🎨",
  download: "💾",
  reset: "🔄",
};

function ConversionInput({ label, value, onChange, disabled }) {
  return (
    <div className="mb-4">
      <Label>
        {label} {EMOJIS[label.toLowerCase()]}
      </Label>
      <Input
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-1"
      />
    </div>
  );
}

function HistoryItem({ item }) {
  return (
    <div className="text-sm mb-2">
      <span className="font-bold">{item.from}:</span> {item.value} →{" "}
      <span className="font-bold">{item.to}:</span> {item.result}
    </div>
  );
}

function QuizQuestion({
  question,
  onAnswer,
  feedback,
  progress,
  totalQuestions,
  currentQuestion,
}) {
  if (!question) {
    return null;
  }
  return (
    <div className="mb-4">
      <p className="mb-2">{question.question}</p>
      <div className="grid grid-cols-2 gap-2">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswer(option)}
            className={
              feedback && option === question.correct
                ? "bg-green-500"
                : feedback && option !== question.correct
                ? "bg-red-500"
                : "hover:bg-blue-300"
            }
            disabled={!!feedback} // Disable buttons after answer is selected
          >
            {option}
          </Button>
        ))}
      </div>
      {/* Progress bar now reduces after each question */}
      <Progress
        value={((currentQuestion + 1) / totalQuestions) * 100}
        className={`mt-2 ${
          feedback === "valid"
            ? "bg-green-500"
            : feedback === "invalid"
            ? "bg-red-500"
            : "bg-blue-500"
        }`}
      />
      <p className="text-right mt-2 text-sm">
        Question {currentQuestion + 1} of {totalQuestions}
      </p>
    </div>
  );
}

export default function App() {
  const [binary, setBinary] = useState("");
  const [decimal, setDecimal] = useState("");
  const [hexadecimal, setHexadecimal] = useState("");
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState("light");
  const [autoTheme, setAutoTheme] = useState(true);
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizProgress, setQuizProgress] = useState(0);
  const [conversionProgress, setConversionProgress] = useState(0);

  useEffect(() => {
    if (autoTheme) {
      const hour = new Date().getHours();
      setTheme(hour >= 19 || hour < 7 ? "dark" : "light");
    }
  }, [autoTheme]);

  useEffect(() => {
    if (quizMode) {
      generateQuizQuestions();
    }
  }, [quizMode]);

  const handleConversion = (value, from) => {
    let dec, bin, hex;
    try {
      switch (from) {
        case "binary":
          dec = parseInt(value, 2);
          bin = value;
          hex = dec.toString(16).toUpperCase();
          break;
        case "decimal":
          dec = parseInt(value);
          bin = dec.toString(2);
          hex = dec.toString(16).toUpperCase();
          break;
        case "hexadecimal":
          dec = parseInt(value, 16);
          bin = dec.toString(2);
          hex = value.toUpperCase();
          break;
      }
      setBinary(bin);
      setDecimal(dec.toString());
      setHexadecimal(hex);
      setHistory([
        ...history,
        { from, value, to: "all", result: `${bin} / ${dec} / ${hex}` },
      ]);
      setConversionProgress(100);
    } catch (error) {
      setConversionProgress(0);
    }
  };

  const generateQuizQuestions = () => {
    const questions = [];
    for (let i = 0; i < 10; i++) {
      const num = Math.floor(Math.random() * 255);
      const base = ["binary", "decimal", "hexadecimal"][
        Math.floor(Math.random() * 3)
      ];
      const toBase = ["binary", "decimal", "hexadecimal"].filter(
        (b) => b !== base
      )[Math.floor(Math.random() * 2)];
      questions.push({
        question: `Convert ${num.toString(
          base === "binary" ? 2 : base === "hexadecimal" ? 16 : 10
        )} from ${base} to ${toBase}`,
        options: [
          num.toString(
            toBase === "binary" ? 2 : toBase === "hexadecimal" ? 16 : 10
          ),
          (num + 1).toString(
            toBase === "binary" ? 2 : toBase === "hexadecimal" ? 16 : 10
          ),
          (num - 1).toString(
            toBase === "binary" ? 2 : toBase === "hexadecimal" ? 16 : 10
          ),
          (num * 2).toString(
            toBase === "binary" ? 2 : toBase === "hexadecimal" ? 16 : 10
          ),
        ].sort(() => Math.random() - 0.5),
        correct: num.toString(
          toBase === "binary" ? 2 : toBase === "hexadecimal" ? 16 : 10
        ),
      });
    }
    setQuizQuestions(questions);
    setCurrentQuestion(0);
  };

  const handleQuizAnswer = (answer) => {
    const correctAnswer = quizQuestions[currentQuestion].correct;
    setQuizFeedback(answer === correctAnswer ? "valid" : "invalid");
    setQuizProgress(100);
    // Freeze the UI and progress for 3 seconds, then move to the next question
    setTimeout(() => {
      if (currentQuestion < 9) {
        setCurrentQuestion(currentQuestion + 1);
        setQuizFeedback(null);
        setQuizProgress(0);
      } else {
        setQuizMode(false);
      }
    }, 3000);
  };

  const downloadHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversion_history.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setBinary("");
    setDecimal("");
    setHexadecimal("");
    setHistory([]);
    setQuizMode(false);
    setCurrentQuestion(0);
    setQuizFeedback(null);
    setQuizProgress(0);
    setConversionProgress(0);
  };

  return (
    <div className={`min-h-screen p-4 ${THEMES[theme]}`}>
      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            Number System Converter {EMOJIS.binary}
            {EMOJIS.decimal}
            {EMOJIS.hexadecimal}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label className="block text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Theme {EMOJIS.theme}
            </Label>
            <Select
              value={theme}
              onValueChange={setTheme}
              className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
            >
              <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:outline-none">
                <SelectValue
                  placeholder="Select theme"
                  className="text-gray-600 dark:text-white"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="light"
                  className="hover:bg-primary-100 dark:hover:bg-primary-600 dark:text-white"
                >
                  Light
                </SelectItem>
                <SelectItem
                  value="dark"
                  className="hover:bg-primary-100 dark:hover:bg-primary-600 dark:text-white"
                >
                  Dark
                </SelectItem>
                <SelectItem
                  value="retro"
                  className="hover:bg-primary-100 dark:hover:bg-primary-600 dark:text-white"
                >
                  Retro
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6 flex items-center">
            <Switch
              id="auto-theme"
              checked={autoTheme}
              onCheckedChange={setAutoTheme}
              className="bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-700 focus:outline-none rounded-full"
            />
            <Label
              htmlFor="auto-theme"
              className="ml-4 text-lg font-medium text-gray-800 dark:text-white"
            >
              Auto Theme
            </Label>
          </div>

          <div className="mb-6">
            <Label
              htmlFor="binary"
              className="block text-lg font-semibold text-gray-800 dark:text-white mb-2"
            >
              Binary {EMOJIS.binary}
            </Label>
            <Input
              type="number"
              id="binary"
              value={binary}
              onChange={(e) => handleConversion(e.target.value, "binary")}
              disabled={quizMode} // Disable input when quiz is ongoing
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="mb-6">
            <Label
              htmlFor="decimal"
              className="block text-lg font-semibold text-gray-800 dark:text-white mb-2"
            >
              Decimal {EMOJIS.decimal}
            </Label>
            <Input
              type="number"
              id="decimal"
              value={decimal}
              onChange={(e) => handleConversion(e.target.value, "decimal")}
              disabled={quizMode} // Disable input when quiz is ongoing
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="mb-6">
            <Label
              htmlFor="hexadecimal"
              className="block text-lg font-semibold text-gray-800 dark:text-white mb-2"
            >
              Hexadecimal {EMOJIS.hexadecimal}
            </Label>
            <Input
              id="hexadecimal"
              value={hexadecimal}
              onChange={(e) => handleConversion(e.target.value, "hexadecimal")}
              disabled={quizMode} // Disable input when quiz is ongoing
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            {/* Download History Button */}
            <Button
              disabled={history.length === 0}
              onClick={downloadHistory}
              className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              <span className="text-2xl">{EMOJIS.download}</span>{" "}
              <span className="ml-2">Download History</span>
            </Button>

            {/* Reset All Button */}
            <Button
              onClick={resetAll}
              className="bg-red-500 text-white hover:bg-red-600 focus:outline-none py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              <span className="text-2xl">{EMOJIS.reset}</span>{" "}
              <span className="ml-2">Reset All</span>
            </Button>
          </div>

          {quizMode ? (
            <>
              <QuizQuestion
                question={quizQuestions[currentQuestion]}
                onAnswer={handleQuizAnswer}
                feedback={quizFeedback}
                progress={quizProgress}
                totalQuestions={10}
                currentQuestion={currentQuestion}
              />
              <Button
                onClick={() => setQuizMode(false)}
                className="bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                <span className="text-2xl">{EMOJIS.quiz}</span>{" "}
                <span className="ml-2">End Quiz</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setQuizMode(true)}
              className="bg-green-500 text-white hover:bg-green-600 focus:outline-none py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              <span className="text-2xl">{EMOJIS.quiz}</span>{" "}
              <span className="ml-2">Start Quiz</span>
            </Button>
          )}

          {history.length > 0 && (
            <>
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  History {EMOJIS.history}
                </h2>
                {history.map((item, index) => (
                  <HistoryItem key={index} item={item} />
                ))}
              </div>
              <Button
                onClick={() => setHistory([])}
                className="bg-red-500 text-white hover:bg-red-600 focus:outline-none py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                <span className="text-2xl">{EMOJIS.reset}</span>{" "}
                <span className="ml-2">Clear History</span>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
