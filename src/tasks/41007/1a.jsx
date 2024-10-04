import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function App() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [errors, setErrors] = useState({ loanAmount: '', interestRate: '', loanTerm: '', extraPayment: '' });
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [monthsSaved, setMonthsSaved] = useState(null);

  const validateInput = (value, type) => {
    if (value === '' || parseFloat(value) < 0) {
      return `Please enter a positive number for ${type}.`;
    }
    return '';
  };

  useEffect(() => {
    const newErrors = {
      loanAmount: validateInput(loanAmount, 'Loan Amount'),
      interestRate: validateInput(interestRate, 'Interest Rate'),
      loanTerm: validateInput(loanTerm, 'Loan Term'),
      extraPayment: validateInput(extraPayment, 'Extra Payment'),
    };
    setErrors(newErrors);
  }, [loanAmount, interestRate, loanTerm, extraPayment]);

  const calculateMortgage = () => {
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    const p = loanAmount;
    const payment = p * (r * Math.pow((1 + r), n)) / (Math.pow((1 + r), n) - 1);
    setMonthlyPayment(payment.toFixed(2));
    const totalInt = (payment * n) - p;
    setTotalInterest(totalInt.toFixed(2));
  };

  const calculateScenario = () => {
    const originalPayment = parseFloat(monthlyPayment);
    const totalPayment = originalPayment + parseFloat(extraPayment);
    // Simplified scenario calculation for demonstration
    const monthsToPayOriginal = loanTerm * 12;
    const monthsWithExtra = monthsToPayOriginal - (extraPayment * 100 / originalPayment); // Hypothetical reduction
    setMonthsSaved(monthsToPayOriginal - monthsWithExtra);
  };

  const isCalculateDisabled = Object.values(errors).some(error => error !== '') || !loanAmount || !interestRate || !loanTerm;
  const isScenarioDisabled = isCalculateDisabled || !extraPayment;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-lg p-4 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-yellow-300">Indian Rupee Mortgage Calculator</CardTitle>
          <CardDescription>Calculate your mortgage with extra payment scenarios.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              label="Loan Amount (₹)" 
              type="number" 
              value={loanAmount} 
              onChange={(e) => setLoanAmount(e.target.value)} 
              error={errors.loanAmount}
            />
            <Input 
              label="Annual Interest Rate (%)" 
              type="number" 
              value={interestRate} 
              onChange={(e) => setInterestRate(e.target.value)} 
              error={errors.interestRate}
            />
            <Input 
              label="Loan Term (Years)" 
              type="number" 
              value={loanTerm} 
              onChange={(e) => setLoanTerm(e.target.value)} 
              error={errors.loanTerm}
            />
            <Input 
              label="Extra Monthly Payment (₹)" 
              type="number" 
              value={extraPayment} 
              onChange={(e) => setExtraPayment(e.target.value)} 
              error={errors.extraPayment}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button onClick={calculateMortgage} disabled={isCalculateDisabled} className="bg-purple-700 hover:bg-purple-800">
            Calculate Monthly Payment
          </Button>
          <Button onClick={calculateScenario} disabled={isScenarioDisabled} className="bg-green-600 hover:bg-green-700">
            Calculate Scenario
          </Button>
        </CardFooter>
        {monthlyPayment && (
          <CardContent>
            <p className="text-white">Monthly Payment: ₹{monthlyPayment}</p>
            <p className="text-white">Total Interest Paid: ₹{totalInterest}</p>
            {monthsSaved !== null && (
              <p className="text-white">With extra ₹{extraPayment}, you save {monthsSaved.toFixed(0)} months!</p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}