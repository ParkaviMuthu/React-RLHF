import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const landUnits = [
  'Square Meters', 'Acres', 'Hectares', 'Square Feet', 'Square Kilometers', 
  'Square Yards', 'Square Miles', 'Cent', 'Bigha', 'Guntha', 'Are', 'Marla', 'Rood', 'Perch'
];

const conversionFactors = {
  // Example conversion factors, these need to be accurate
  'Square Meters': 1, 'Acres': 0.000247105, 'Hectares': 0.0001, /* ... other units ... */
};

function convert(value, fromUnit, toUnit) {
  const fromFactor = conversionFactors[fromUnit];
  const toFactor = conversionFactors[toUnit];
  return value * fromFactor / toFactor;
}

export default function App() {
  const [amount, setAmount] = useState(1);
  const [baseUnit, setBaseUnit] = useState('Square Meters');
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (unit) => {
    setFavorites(prev => 
      prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]
    );
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-green-400 min-h-screen p-4 sm:p-8">
      <Card className="max-w-lg mx-auto bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Land Units Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount:</label>
            <Slider min={1} max={1000} value={[amount]} onValueChange={(v) => setAmount(v[0])} />
            <p className="text-center mt-2">{amount}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Base Unit:</label>
            <Select value={baseUnit} onValueChange={setBaseUnit}>
              {landUnits.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
            </Select>
          </div>
          <div>
            {landUnits.filter(unit => unit !== baseUnit).map(unit => (
              <div key={unit} className="flex justify-between items-center mb-2">
                <span>{`${amount} ${baseUnit.split(' ').map(w => w[0]).join('')}² = ${convert(amount, baseUnit, unit).toFixed(2)} ${unit.split(' ').map(w => w[0]).join('')}²`}</span>
                <Button variant="outline" onClick={() => toggleFavorite(unit)}>
                  {favorites.includes(unit) ? '❌' : '📌'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}