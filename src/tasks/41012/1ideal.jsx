import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const calculatorButtons = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "=",
  "+",
];

export default function App() {
  const [display, setDisplay] = useState("");
  const [history, setHistory] = useState([]);
  const [angle, setAngle] = useState("");
  const [nthRoot, setNthRoot] = useState("");
  const [n, setN] = useState(2); // Default root value

  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        const result = eval(display);
        setDisplay(result.toString());
        setHistory([`${display} = ${result}`, ...history.slice(0, 9)]);
      } catch (error) {
        setDisplay("Error");
      }
    } else {
      setDisplay(display + value);
    }
  };

  const handleClear = () => setDisplay("");

  const handleBackspace = () => setDisplay(display.slice(0, -1));

  const calculateTrigonometricFunctions = (func) => {
    const angleInRadians = (angle * Math.PI) / 180; // Convert degrees to radians
    let result = "";

    try {
      switch (func) {
        case "sin":
          result = Math.sin(angleInRadians).toFixed(4);
          break;
        case "cos":
          result = Math.cos(angleInRadians).toFixed(4);
          break;
        case "tan":
          result = Math.tan(angleInRadians).toFixed(4);
          break;
        case "asin":
          const sinValue = Math.sin(angleInRadians); // sin of the angle in radians
          if (sinValue >= -1 && sinValue <= 1) {
            result = ((Math.asin(sinValue) * 180) / Math.PI).toFixed(4); // Convert radians to degrees
          } else {
            result = "Undefined";
          }
          break;
        case "acos":
          const cosValue = Math.cos(angleInRadians);
          if (cosValue >= -1 && cosValue <= 1) {
            result = ((Math.acos(cosValue) * 180) / Math.PI).toFixed(4); // Convert radians to degrees
          } else {
            result = "Undefined";
          }
          break;
        case "atan":
          const tanValue = Math.tan(angleInRadians);
          result = ((Math.atan(tanValue) * 180) / Math.PI).toFixed(4); // Convert radians to degrees
          break;
        default:
          result = "";
      }
    } catch (error) {
      result = "Error";
    }

    return result;
  };

  const calculateSquareRoot = (number) => {
    return Math.sqrt(number).toFixed(4);
  };

  const calculateNthRoot = (number, n) => {
    return Math.pow(number, 1 / n).toFixed(4);
  };

  // Update nth root whenever nthRoot or n changes
  const nthRootResult = calculateNthRoot(nthRoot, n);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 sm:p-8">
      {/* White container for all content */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="relative">
            {/* Tabs */}
            <Tabs defaultValue="calculator" className="sm:w-full">
              {/* TabsList with margin added below to prevent overlap */}
              <TabsList className="w-full bg-white p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-8">
                <TabsTrigger
                  value="calculator"
                  className="data-[state=active]:bg-gray-300"
                >
                  🧮 Calculator
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-gray-300"
                >
                  📜 History
                </TabsTrigger>
                <TabsTrigger
                  value="trigonometric"
                  className="data-[state=active]:bg-gray-300"
                >
                  📐 Trig
                </TabsTrigger>
                <TabsTrigger
                  value="root-functions"
                  className="data-[state=active]:bg-gray-300"
                >
                  🔢 Roots
                </TabsTrigger>
              </TabsList>

              <div>
                {/* Calculator Tab */}
                <TabsContent value="calculator" className="p-4">
                  <Input
                    className="mb-4 p-3 text-2xl text-right bg-gray-800 text-white rounded w-full"
                    value={display}
                    readOnly
                  />
                  <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
                    {calculatorButtons.map((btn) => (
                      <Button
                        key={btn}
                        className="flex items-center justify-center h-14 sm:h-16 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                        onClick={() => handleButtonClick(btn)}
                      >
                        {btn}
                      </Button>
                    ))}
                    <Button
                      className="flex items-center justify-center h-14 sm:h-20 text-2xl bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-110"
                      onClick={handleBackspace}
                    >
                      🔙
                    </Button>
                    <Button
                      className="flex items-center justify-center h-14 sm:h-16 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                      onClick={handleClear}
                    >
                      🗑️
                      <span className="hidden sm:block ml-2">Clear</span>{" "}
                      {/* Hide text on mobile, show on larger screens */}
                    </Button>
                  </div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="p-4">
                  <ul className="list-disc pl-6 space-y-2">
                    {history.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </TabsContent>

                {/* Trigonometric Tab */}
                <TabsContent value="trigonometric" className="p-4">
                  <Input
                    className="mb-2 p-3 text-xl rounded w-full"
                    value={angle}
                    onChange={(e) => setAngle(e.target.value)}
                    placeholder="Enter angle in degrees"
                  />
                  <div className="space-y-4">
                    {["sin", "cos", "tan", "asin", "acos", "atan"].map(
                      (func) => (
                        <div
                          key={func}
                          className="flex justify-between items-center text-lg font-medium"
                        >
                          <span className="font-semibold text-gray-900">
                            {func.charAt(0).toUpperCase() + func.slice(1)}:
                          </span>
                          <span className="font-normal text-gray-700">
                            {Number(
                              calculateTrigonometricFunctions(func)
                            ).toFixed(4)}{" "}
                            <span className="text-yellow-500">⭐</span>
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </TabsContent>

                {/* Root Functions Tab */}
                <TabsContent value="root-functions" className="p-4">
                  <Input
                    className="mb-2 p-3 text-xl rounded w-full"
                    value={nthRoot}
                    onChange={(e) => setNthRoot(e.target.value)}
                    placeholder="Enter number for nth root"
                    type="number"
                  />
                  <Input
                    className="mb-2 p-3 text-xl rounded w-full"
                    type="number"
                    value={n}
                    onChange={(e) => setN(e.target.value)}
                    placeholder="Enter n (root)"
                  />
                  <p className="text-lg font-semibold">
                    <span className="font-bold">Square Root:</span>{" "}
                    <span className="font-normal text-gray-800">
                      {calculateSquareRoot(nthRoot)}
                    </span>{" "}
                    🔢
                  </p>
                  <p className="text-lg font-semibold">
                    <span className="font-bold">Nth Root:</span>{" "}
                    <span className="font-normal text-gray-800">
                      {nthRootResult}
                    </span>{" "}
                    ✨
                  </p>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
