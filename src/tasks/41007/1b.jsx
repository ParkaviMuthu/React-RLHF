import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Custom input component with validation
const InputField = ({ label, value, onChange, type = 'number', min, max, errorMessage }) => {
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    if (type === 'number' && (isNaN(val) || val < min || (max !== undefined && val > max))) {
      setError(errorMessage);
    } else {
      setError('');
      onChange(val);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-white text-sm font-bold mb-2">
        {label}
      </label>
      <input 
        type={type} 
        value={value} 
        onChange={handleChange} 
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      />
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

// Main Mortgage Calculator Component
export default function App() {
  return <MortgageCalculator />;
}

function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [extraPayment, setExtraPayment] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [schedule, setSchedule] = useState([]);

  const isValid = useMemo(() => 
    loanAmount > 0 && interestRate >= 0 && loanTerm > 0 && extraPayment >= 0, 
    [loanAmount, interestRate, loanTerm, extraPayment]
  );

  const calculatePayment = () => {
    if (!isValid) return;
    const r = (interestRate / 100) / 12;
    const n = loanTerm * 12;
    const calculatedPayment = (loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    setMonthlyPayment(calculatedPayment);

    // Amortization Schedule
    let balance = loanAmount;
    let totalInterestPaid = 0;
    const schedule = [];
    for (let month = 1; month <= n; month++) {
      const interest = balance * r;
      const principal = calculatedPayment - interest;
      balance -= principal;
      totalInterestPaid += interest;
      schedule.push({
        month: month,
        principal: principal,
        interest: interest,
        balance: balance > 0 ? balance : 0
      });
    }
    setSchedule(schedule);
    setTotalInterest(totalInterestPaid);
  };

  const calculateScenario = () => {
    if (!monthlyPayment) return;
    // Here you would calculate the new scenario with extra payments
    // This is simplified for brevity
    const newPayment = monthlyPayment + extraPayment;
    // Recalculate term with extra payments
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gray-800">
        <CardHeader>
          <CardTitle className="text-yellow-300">Indian Rupee Mortgage Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <InputField label="Loan Amount (₹)" value={loanAmount} onChange={setLoanAmount} min={1} errorMessage="Loan amount must be positive." />
          <InputField label="Annual Interest Rate (%)" value={interestRate} onChange={setInterestRate} min={0} errorMessage="Interest rate must be non-negative." />
          <InputField label="Loan Term (Years)" value={loanTerm} onChange={setLoanTerm} min={1} errorMessage="Loan term must be positive." />
          <InputField label="Extra Monthly Payment (₹)" value={extraPayment} onChange={setExtraPayment} min={0} errorMessage="Extra payment must be non-negative." />
          
          <Button 
            onClick={calculatePayment} 
            disabled={!isValid}
            className="mb-2 bg-purple-700 hover:bg-purple-800"
          >
            Calculate Monthly Payment
          </Button>
          <Button 
            onClick={calculateScenario} 
            disabled={!isValid || !monthlyPayment}
            className="bg-green-600 hover:bg-green-700"
          >
            Calculate Scenario
          </Button>

          {monthlyPayment > 0 && (
            <div>
              <p className="text-white">Monthly Payment: ₹{monthlyPayment.toFixed(2)}</p>
              <div className="mt-4">
                <h3 className="text-yellow-300">Amortization Schedule</h3>
                {schedule.slice(0, 12).map(item => (
                  <div key={item.month} className="text-white">
                    Month {item.month}: Principal: ₹{item.principal.toFixed(2)}, Interest: ₹{item.interest.toFixed(2)}, Balance: ₹{item.balance.toFixed(2)}
                  </div>
                ))}
              </div>
              <p className="text-white mt-4">Total Interest Paid: ₹{totalInterest.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}