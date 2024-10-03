import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

function App() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [themeColor, setThemeColor] = useState('#ffffff');
  const [budgetTips, setBudgetTips] = useState([]);

  const addExpense = (expense) => {
    if (expense.amount > (income - totalExpenses() + expense.amount)) {
      alert("This expense exceeds your remaining budget!");
      return;
    }
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const editExpense = (id, updatedExpense) => {
    if (updatedExpense.amount > (income - totalExpenses() + updatedExpense.amount)) {
      alert("Edited expense exceeds your remaining budget!");
      return;
    }
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, ...updatedExpense } : exp));
  };

  const totalExpenses = () => expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  useEffect(() => {
    // Generate budget tips
    const categories = [...new Set(expenses.map(exp => exp.category))];
    categories.forEach(category => {
      const catTotal = expenses.filter(exp => exp.category === category).reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      if (catTotal > income * 0.3) { // Example threshold: 30% of income
        setBudgetTips(prevTips => [...prevTips, `You’re spending too much on ${category}. Try cutting it down by 10%.`]);
      }
    });
  }, [expenses, income]);

  return (
    <div className="min-h-screen bg-background" style={{ backgroundColor: themeColor }}>
      <div className="container mx-auto p-4">
        <ColorPicker onColorChange={setThemeColor} />
        <BudgetForm onAddIncome={setIncome} onAddExpense={addExpense} />
        <BudgetOverview income={income} expenses={totalExpenses()} />
        <ExpenseList expenses={expenses} onDelete={deleteExpense} onEdit={editExpense} />
        <BudgetTips tips={budgetTips} />
      </div>
    </div>
  );
}

function BudgetForm({ onAddIncome, onAddExpense }) {
  const [expense, setExpense] = useState({ category: '', amount: '' });

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add Income/Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <Input type="number" placeholder="Income" onChange={(e) => onAddIncome(e.target.value)} />
        <Input placeholder="Category" value={expense.category} onChange={(e) => setExpense({...expense, category: e.target.value})} />
        <Input type="number" placeholder="Amount" value={expense.amount} onChange={(e) => setExpense({...expense, amount: e.target.value})} />
        <Button onClick={() => {onAddExpense(expense); setExpense({ category: '', amount: '' });}}>Add Expense</Button>
      </CardContent>
    </Card>
  );
}

function ExpenseList({ expenses, onDelete, onEdit }) {
  return (
    <div>
      {expenses.map(exp => (
        <Card key={exp.id} className="mb-2">
          <CardContent>
            <p>{exp.category} - ₹{exp.amount}</p>
            <Button onClick={() => onDelete(exp.id)}>Delete</Button>
            <Button onClick={() => {
              const newAmount = prompt('Enter new amount:', exp.amount);
              onEdit(exp.id, { ...exp, amount: newAmount });
            }}>Edit</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BudgetOverview({ income, expenses }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Income: ₹{income}</p>
        <p>Total Expenses: ₹{expenses}</p>
        <p>Remaining Balance: ₹{income - expenses}</p>
      </CardContent>
    </Card>
  );
}

function ColorPicker({ onColorChange }) {
  return (
    <div className="mb-4">
      <Label>Choose Theme Color</Label>
      <input type="color" onChange={(e) => onColorChange(e.target.value)} className="mt-1"/>
    </div>
  );
}

function BudgetTips({ tips }) {
  return (
    <div className="mt-4">
      {tips.map((tip, index) => <p key={index} className="mb-2">{tip}</p>)}
    </div>
  );
}

export default App;