// App.jsx
import React, { useState, useEffect } from 'react';
import TitleCard from './components/TitleCard';
import CarbonCategoryCard from './components/CarbonCategoryCard';
import TotalFootprintCard from './components/TotalFootprintCard';
import GoalSetter from './components/GoalSetter';
import SuggestionsList from './components/SuggestionsList';
import TreeVisual from './components/TreeVisual';
import HistoryList from './components/HistoryList';

const App = () => {
  const [categories, setCategories] = useState({
    transport: 0, energy: 0, food: 0, waste: 0
  });
  const [goal, setGoal] = useState(20); // Default goal in kg CO2
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = Object.values(categories).reduce((a, b) => a + b, 0);
    setTotal(newTotal);
  }, [categories]);

  const updateCategory = (name, value) => {
    setCategories(prev => ({...prev, [name]: value}));
  };

  const progress = Math.min((total / goal) * 100, 100);

  return (
    <div className="container mx-auto p-4">
      <TitleCard />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['transport', 'energy', 'food', 'waste'].map(category => (
          <CarbonCategoryCard 
            key={category} 
            category={category} 
            value={categories[category]}
            onChange={updateCategory}
          />
        ))}
      </div>
      <TotalFootprintCard total={total} progress={progress} />
      <GoalSetter setGoal={setGoal} currentGoal={goal} />
      <TreeVisual progress={progress} />
      <SuggestionsList />
      <HistoryList />
    </div>
  );
};

export default App;