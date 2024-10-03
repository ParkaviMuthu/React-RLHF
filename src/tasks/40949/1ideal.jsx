import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';

export default function App() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [expenseInput, setExpenseInput] = useState({ category: '', amount: '' });
  const [editingExpense, setEditingExpense] = useState(null);
  const [themeColor, setThemeColor] = useState('#670926'); // Default dark red theme
  const [suggestions, setSuggestions] = useState([]); // AI-inspired suggestions

  const totalExpenses = expenses.reduce(
    (total, expense) => total + parseFloat(expense.amount),
    0
  );
  const balance = income - totalExpenses;

  const saveExpense = () => {
    if (expenseInput.category && expenseInput.amount) {
      const newExpenseAmount = parseFloat(expenseInput.amount);

      if (editingExpense !== null) {
        const updatedExpenses = expenses.map((expense, index) =>
          index === editingExpense ? { ...expenseInput } : expense
        );
        const newTotal = updatedExpenses.reduce(
          (total, expense) => total + parseFloat(expense.amount),
          0
        );

        if (newTotal <= income) {
          setExpenses(updatedExpenses);
          setEditingExpense(null);
        } else {
          alert('You cannot save this change as it exceeds your available budget.');
          return;
        }
      } else {
        const newTotal = totalExpenses + newExpenseAmount;

        if (newTotal <= income) {
          setExpenses([...expenses, expenseInput]);
        } else {
          alert('You cannot add this expense as it exceeds your available budget.');
          return;
        }
      }

      setExpenseInput({ category: '', amount: '' });
    }
  };

  const deleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const recommendations = expenses
      .map((expense) => {
        if (parseFloat(expense.amount) > income * 0.25) {
          return `You're spending too much on ${expense.category}. Try cutting it down by 10%.`;
        }
        return null;
      })
      .filter((suggestion) => suggestion);

    setSuggestions(recommendations);
  }, [expenses, income]);

  const changeThemeColor = (color) => {
    setThemeColor(color);
  };

  const themeStyles = {
    backgroundColor: themeColor,
    color: '#FFFFFF',
  };

  return (
    <div className="min-h-screen p-4 sm:p-8" style={themeStyles}>
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          <span>Theme Color: </span>
          <input
            type="color"
            value={themeColor}
            onChange={(e) => changeThemeColor(e.target.value)}
            className="p-2 rounded"
          />
        </div>
      </div>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Budget Buddy</h1>
        <p className="text-lg">Keep your wallet happy!</p>
      </header>

      <main className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
            <CardDescription>How much are you making?</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="number"
              value={income || ''} // Fallback to an empty string if income is NaN or undefined
              onChange={(e) => {
                const value = e.target.value;
                setIncome(value ? parseFloat(value) : 0); // Fallback to 0 if input is empty
              }}
              className="w-full p-2 bg-gray-800 border-none rounded text-white placeholder-gray-500"
              placeholder="Enter your total income"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{editingExpense !== null ? 'Edit Expense' : 'Add an Expense'}</CardTitle>
            <CardDescription>
              {editingExpense !== null
                ? 'Update the expense details'
                : 'What did you spend on?'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                value={expenseInput.category}
                onChange={(e) =>
                  setExpenseInput({ ...expenseInput, category: e.target.value })
                }
                className="w-full p-2 bg-gray-800 border-none rounded text-white placeholder-gray-500"
                placeholder="Expense category"
              />
              <input
                type="number"
                value={expenseInput.amount || ''} // Fallback to empty string
                onChange={(e) => {
                  const value = e.target.value;
                  setExpenseInput({ ...expenseInput, amount: value ? value : '' });
                }}
                className="w-full p-2 bg-gray-800 border-none rounded text-white placeholder-gray-500"
                placeholder="Amount"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
  <button
    onClick={saveExpense}
    className="bg-gradient-to-r from-blue-900 to-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-blue-800 hover:to-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500"
  >
    {editingExpense !== null ? 'Save Changes' : 'Add Expense'}
  </button>
</CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>You've spent: ₹{totalExpenses.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {expenses.map((expense, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{expense.category}</span>
                  <span>₹{parseFloat(expense.amount).toFixed(2)}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingExpense(index);
                        setExpenseInput(expense);
                      }}
                      className="text-yellow-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteExpense(index)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Tips</CardTitle>
            <CardDescription>Some friendly advice</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-400">
                    {suggestion}
                  </li>
                ))
              ) : (
                <li>You're doing great! Keep it up!</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>The Big Picture</CardTitle>
            <CardDescription>Here's where you stand:</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <p>Total Income: ₹{income.toFixed(2)}</p>
            <p>Total Expenses: ₹{totalExpenses.toFixed(2)}</p>
            <p>Remaining Balance: ₹{balance.toFixed(2)}</p>
            {balance < 0 && (
              <p className="text-red-500 mt-2">Whoa there! You're in the red!</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}