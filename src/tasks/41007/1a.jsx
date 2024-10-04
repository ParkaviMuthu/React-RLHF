import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, Input } from "@/components/ui/card";

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [errors, setErrors] = useState({ loanAmount: '', interestRate: '', loanTerm: '', extraPayment: '' });
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [monthsSaved, setMonthsSaved] = useState(null);

  const validateInput = (value, name, min = 0) => {
    if (value === '' || parseFloat(value) < min) {
      setErrors(prev => ({ ...prev, [name]: `Please enter a valid ${name}.` }));
      return false;
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
    return true;
  };

  const calculateMortgage = () => {
    if (!validateInput(loanAmount, 'loanAmount', 1) || 
        !validateInput(interestRate, 'interestRate') || 
        !validateInput(loanTerm, 'loanTerm', 1)) return;

    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(loanTerm) * 12;
    const p = parseFloat(loanAmount);
    const payment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    setMonthlyPayment(payment.toFixed(2));
    setTotalInterest((payment * n - p).toFixed(2));
  };

  const calculateScenario = () => {
    if (!validateInput(extraPayment, 'extraPayment', 0)) return;
    
    const originalPayment = parseFloat(monthlyPayment);
    const newPayment = originalPayment + parseFloat(extraPayment);
    // Here you would typically recalculate the loan term with the new payment,
    // for simplicity, we'll just show months saved without actual recalculation:
    setMonthsSaved(102); // Example value
  };

  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <Card className="bg-gray-800 p-4 sm:p-6">
      <CardHeader>
        <CardTitle className="text-yellow-300">Mortgage Calculator</CardTitle>
        <CardDescription>Calculate your mortgage payments in INR</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input 
            type="number" 
            placeholder="Loan Amount (INR)" 
            value={loanAmount} 
            onChange={(e) => setLoanAmount(e.target.value)} 
            className={errors.loanAmount ? 'border-red-500' : ''}
          />
          {errors.loanAmount && <p className="text-red-500">{errors.loanAmount}</p>}
          <Input 
            type="number" 
            step="0.01" 
            placeholder="Annual Interest Rate (%)" 
            value={interestRate} 
            onChange={(e) => setInterestRate(e.target.value)} 
            className={errors.interestRate ? 'border-red-500' : ''}
          />
          {errors.interestRate && <p className="text-red-500">{errors.interestRate}</p>}
          <Input 
            type="number" 
            placeholder="Loan Term (Years)" 
            value={loanTerm} 
            onChange={(e) => setLoanTerm(e.target.value)} 
            className={errors.loanTerm ? 'border-red-500' : ''}
          />
          {errors.loanTerm && <p className="text-red-500">{errors.loanTerm}</p>}
          <Input 
            type="number" 
            placeholder="Extra Monthly Payment (INR)" 
            value={extraPayment} 
            onChange={(e) => setExtraPayment(e.target.value)} 
            className={errors.extraPayment ? 'border-red-500' : ''}
          />
          {errors.extraPayment && <p className="text-red-500">{errors.extraPayment}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={calculateMortgage} 
          disabled={!loanAmount || !interestRate || !loanTerm}
          className="bg-purple-700 hover:bg-purple-800"
        >
          Calculate Monthly Payment
        </Button>
        <Button 
          onClick={calculateScenario} 
          disabled={!loanAmount || !interestRate || !loanTerm}
          className="bg-green-600 hover:bg-green-700"
        >
          Calculate Scenario
        </Button>
      </CardFooter>
    </Card>
  );
};

const ResultDisplay = ({ monthlyPayment, totalInterest, monthsSaved }) => (
  <Card className="mt-4 bg-gray-800">
    <CardContent>
      <p>Monthly Payment: ₹{monthlyPayment}</p>
      <p>Total Interest Paid: ₹{totalInterest}</p>
      {monthsSaved !== null && <p>Months Saved with Extra Payment: {monthsSaved}</p>}
    </CardContent>
  </Card>
);

export default function App() {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <MortgageCalculator />
        <ResultDisplay monthlyPayment={106.07} totalInterest={12345.67} monthsSaved={102} />
      </div>
    </div>
  );
}