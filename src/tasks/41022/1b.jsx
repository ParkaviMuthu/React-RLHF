import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";

const units = {
  'm²': 1,
  'ac': 0.000247105,
  'ha': 0.0001,
  'ft²': 10.7639,
  'km²': 0.000001,
  'yd²': 1.19599,
  'mi²': 0.000000386102,
  'cent': 0.0000247105,
  'bigha': 0.0004,
  'guntha': 0.000091827,
  'are': 0.01,
  'marla': 0.00395367,
  'rood': 0.000988422,
  'perch': 0.0395367,
};

const SliderComponent = ({ value, onChange }) => (
  <input 
    type="range" 
    min="1" 
    max="1000" 
    value={value} 
    onChange={onChange} 
    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
  />
);

const UnitDropdown = ({ value, onChange }) => (
  <Select value={value} onChange={onChange}>
    {Object.keys(units).map(unit => (
      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
    ))}
  </Select>
);

const ConversionDisplay = ({ amount, baseUnit, favorites, toggleFavorite }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
    {Object.entries(units).map(([unit, factor]) => {
      if (unit === baseUnit) return null; // Skip the base unit itself
      const convertedValue = (amount * units[baseUnit] / factor).toFixed(2);
      return (
        <div key={unit} className="flex justify-between items-center">
          <span>{`${amount} ${baseUnit} = ${convertedValue} ${unit}`}</span>
          <Button 
            variant="ghost" 
            onClick={() => toggleFavorite(unit)} 
            title={favorites.includes(unit) ? "Remove from Favorites" : "Save to Favorites"}
          >
            {favorites.includes(unit) ? '❌' : '📌'}
          </Button>
        </div>
      );
    })}
  </div>
);

export default function App() {
  const [amount, setAmount] = useState(1);
  const [baseUnit, setBaseUnit] = useState('m²');
  const [favorites, setFavorites] = useState([]);

  const handleAmountChange = (e) => setAmount(e.target.value);
  const handleUnitChange = (e) => setBaseUnit(e.target.value);
  const toggleFavorite = (unit) => {
    setFavorites(prev => 
      prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-green-400 p-4">
      <Card className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Land Units Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Amount:</Label>
            <SliderComponent value={amount} onChange={handleAmountChange} />
            <p className="text-center text-lg">{amount}</p>
            <Label>Base Unit:</Label>
            <UnitDropdown value={baseUnit} onChange={handleUnitChange} />
            <ConversionDisplay 
              amount={amount} 
              baseUnit={baseUnit} 
              favorites={favorites} 
              toggleFavorite={toggleFavorite}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}