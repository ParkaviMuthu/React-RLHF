import React, { useState } from "react";

const landUnits = [
  { name: "Square Meters", short: "m²", factor: 1 },
  { name: "Acres", short: "ac", factor: 4046.86 },
  { name: "Hectares", short: "ha", factor: 10000 },
  { name: "Square Feet", short: "ft²", factor: 0.092903 },
  { name: "Square Kilometers", short: "km²", factor: 1000000 },
  { name: "Square Yards", short: "yd²", factor: 0.836127 },
  { name: "Square Miles", short: "mi²", factor: 2589988.11 },
  { name: "Cent", short: "cent", factor: 40.4686 },
  { name: "Bigha", short: "bigha", factor: 12140 }, //This can vary regionally, but 12140 is a common value.
  { name: "Guntha", short: "guntha", factor: 101.17 },
  { name: "Are", short: "a", factor: 100 },
  { name: "Marla", short: "marla", factor: 272.25 }, // Common in South Asia
  { name: "Rood", short: "rood", factor: 1011.71 }, // Traditional unit in the UK
  { name: "Perch", short: "perch", factor: 25.2929 }, // Traditional unit, often used in real estate
];

const LandConverter = () => {
  const [amount, setAmount] = useState(100);
  const [baseUnit, setBaseUnit] = useState("m²");
  const [favorites, setFavorites] = useState([]);

  const handleFavorite = (unit) => {
    if (favorites.includes(unit)) {
      setFavorites(favorites.filter((fav) => fav !== unit));
    } else {
      setFavorites([...favorites, unit]);
    }
  };

  const conversions = landUnits.map((unit) => {
    const baseFactor = landUnits.find((u) => u.short === baseUnit).factor;
    return {
      ...unit,
      value: (amount * baseFactor) / unit.factor,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Land Units Converter</h1>
      <div className="mb-4">
        <label>Amount:</label>
        <input
          type="range"
          min="1"
          max="1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full"
        />
        <p>{amount}</p>
      </div>
      <div className="mb-4">
        <label>Base Unit:</label>
        <select
          value={baseUnit}
          onChange={(e) => setBaseUnit(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
        >
          {landUnits.map((unit) => (
            <option key={unit.short} value={unit.short}>
              {unit.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {conversions.map((unit) => (
          <div
            key={unit.short}
            className="flex justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
          >
            <span>
              {amount} {baseUnit} = {unit.value.toFixed(2)} {unit.short}
            </span>
            <button
              title={
                favorites.includes(unit.short)
                  ? "Remove from Favorites"
                  : "Save to Favorites"
              }
              className={`ml-2 p-1 ${
                favorites.includes(unit.short) ? "bg-yellow-400" : "bg-blue-600"
              } rounded`}
              onClick={() => handleFavorite(unit.short)}
            >
              {favorites.includes(unit.short) ? "❌" : "📌"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandConverter;
