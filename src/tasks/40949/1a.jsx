import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function App() {
  const [income, setIncome] = useState(() => parseFloat(localStorage.getItem('income')) || 0);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('expenses')) || []);
  const [editExpense, setEditExpense] = useState(null);
  const [color, setColor] = useState(localStorage.getItem('themeColor') || '#ffffff');

  useEffect(() => {
    localStorage.setItem('income', income);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('themeColor', color);
    document.body.style.backgroundColor = color;
  }, [income, expenses, color]);

  const addExpense = (expense) => {
    if (totalExpenses() + expense.amount > income) {
      alert('This expense exceeds your remaining budget!');
      return;
    }
    setExpenses(prev => [...prev, { ...expense, id: Date.now() }]);
  };

  const updateExpense = (updatedExpense) => {
    if (totalExpenses() - expenses.find(e => e.id === updatedExpense.id).amount + updatedExpense.amount > income) {
      alert('This change would exceed your income!');
      return;
    }
    setExpenses(expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
    setEditExpense(null);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalExpenses = () => expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const remainingBalance = () => income - totalExpenses();

  const budgetTip = () => {
    const maxCategory = expenses.reduce((prev, current) => 
      (prev.amount > current.amount) ? prev : current, { amount: 0 }
    );
    if (maxCategory.amount > income * 0.3) {
      return `You’re spending a lot on ${maxCategory.category}. Try to cut down by 10%.`;
    }
    return "You're doing okay with your budget!";
  };

  return (
    <div className="p-4 sm:p-8">
      <ColorPicker color={color} setColor={setColor} />
      <IncomeForm setIncome={setIncome} />
      <BudgetOverview income={income} expenses={totalExpenses()} balance={remainingBalance()} tip={budgetTip()} />
      <ExpenseForm onSubmit={editExpense ? updateExpense : addExpense} edit={editExpense} onCancel={() => setEditExpense(null)} />
      <div className="mt-4">
        {expenses.map(exp => (
          <ExpenseItem key={exp.id} expense={exp} onEdit={setEditExpense} onDelete={deleteExpense} />
        ))}
      </div>
    </div>
  );
}

function IncomeForm({ setIncome }) {
  const [value, setValue] = useState('');

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Set Your Income</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          type="number" 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          placeholder="Enter your monthly income" 
        />
        <Button className="mt-2" onClick={() => setIncome(parseFloat(value) || 0)}>Set Income</Button>
      </CardContent>
    </Card>
  );
}

function ExpenseForm({ onSubmit, edit, onCancel }) {
  const [category, setCategory] = useState(edit?.category || '');
  const [amount, setAmount] = useState(edit?.amount || '');

  const handleSubmit = () => {
    onSubmit({ category, amount: parseFloat(amount), id: edit?.id });
    setCategory('');
    setAmount('');
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{edit ? 'Edit Expense' : 'Add Expense'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Food" />
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
          <Button onClick={handleSubmit}>{edit ? 'Update' : 'Add'} Expense</Button>
          {edit && <Button variant="destructive" onClick={onCancel}>Cancel</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

function BudgetOverview({ income, expenses, balance, tip }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Income: ₹{income.toFixed(2)}</p>
        <p>Total Expenses: ₹{expenses.toFixed(2)}</p>
        <p className={balance < 0 ? 'text-red-500' : 'text-green-500'}>Remaining Balance: ₹{balance.toFixed(2)}</p>
        <CardDescription>{tip}</CardDescription>
      </CardContent>
    </Card>
  );
}

function ExpenseItem({ expense, onEdit, onDelete }) {
  return (
    <Card className="mb-2">
      <CardContent>
        <p>{expense.category}: ₹{expense.amount.toFixed(2)}</p>
        <Button className="mr-2" onClick={() => onEdit(expense)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(expense.id)}>Delete</Button>
      </CardContent>
    </Card>
  );
}

function ColorPicker({ color, setColor }) {
  return (
    <div className="mb-4">
      <Label>Choose Theme Color:</Label>
      <input 
        type="color" 
        value={color} 
        onChange={(e) => setColor(e.target.value)} 
        className="ml-2 h-8 w-24"
      />
    </div>
  );
}

export default App;