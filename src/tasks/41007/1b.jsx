import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function App() {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 sm:p-8">
      <MortgageCalculator />
    </div>
  );
}

function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const validateInput = (name, value) => {
    if (value === '' || parseFloat(value) < 0) {
      setErrors(prev => ({...prev, [name]: 'Please enter a positive number.'}));
      return false;
    }
    setErrors(prev => ({...prev, [name]: null}));
    return true;
  };

  const canCalculate = loanAmount && interestRate && loanTerm && 
    Object.values(errors).every(e => e === null);

  const calculateMonthlyPayment = () => {
    if (!canCalculate) return;
    const monthlyRate = (parseFloat(interestRate) / 100) / 12;
    const months = parseFloat(loanTerm) * 12;
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                           (Math.pow(1 + monthlyRate, months) - 1);
    setResult({
      monthlyPayment: monthlyPayment,
      totalInterest: (monthlyPayment * months) - loanAmount
    });
  };

  const calculateScenario = () => {
    if (result && extraPayment > 0) {
      // Simplified scenario calculation
      const newMonthly = result.monthlyPayment + parseFloat(extraPayment);
      // This is a placeholder for actual amortization with extra payments
      setResult(prev => ({...prev, 
        scenarioPayment: newMonthly, 
        scenarioInterestSaved: prev.totalInterest * 0.2 // Example 20% savings
      }));
    }
  };

  return (
    <Card className="w-full max-w-lg bg-gray-800">
      <CardHeader>
        <CardTitle className="text-yellow-300">Mortgage Calculator</CardTitle>
        <CardDescription>Calculate your monthly payments.</CardDescription>
      </CardHeader>
      <CardContent>
        <InputField label="Loan Amount (₹)" value={loanAmount} onChange={setLoanAmount} error={errors.loanAmount} validate={validateInput} name="loanAmount"/>
        <InputField label="Annual Interest Rate (%)" value={interestRate} onChange={setInterestRate} error={errors.interestRate} validate={validateInput} name="interestRate"/>
        <InputField label="Loan Term (Years)" value={loanTerm} onChange={setLoanTerm} error={errors.loanTerm} validate={validateInput} name="loanTerm"/>
        <InputField label="Extra Monthly Payment (₹)" value={extraPayment} onChange={setExtraPayment} error={errors.extraPayment} validate={(name, value) => validateInput(name, value)} name="extraPayment"/>
        
        <Button onClick={calculateMonthlyPayment} disabled={!canCalculate} className="mt-4 bg-purple-700 hover:bg-purple-600">Calculate Monthly Payment</Button>
        <Button onClick={calculateScenario} disabled={!canCalculate || !extraPayment} className="mt-2 bg-green-600 hover:bg-green-500">Calculate Scenario</Button>
        
        {result && <ResultDisplay result={result} />}
      </CardContent>
    </Card>
  );
}

function InputField({ label, value, onChange, error, validate, name }) {
  return (
    <div className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">{label}</label>
      <Input 
        type="number" 
        value={value} 
        onChange={(e) => {validate(name, e.target.value); onChange(e.target.value);}} 
        className="w-full" 
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function ResultDisplay({ result }) {
  return (
    <div className="mt-5 text-white">
      <p>Monthly Payment: ₹{result.monthlyPayment.toFixed(2)}</p>
      <p>Total Interest Paid: ₹{result.totalInterest.toFixed(2)}</p>
      {result.scenarioPayment && (
        <>
          <p>With Extra Payment: ₹{result.scenarioPayment.toFixed(2)}</p>
          <p>Interest Saved: ₹{result.scenarioInterestSaved.toFixed(2)}</p>
        </>
      )}
    </div>
  );
}

export default App;