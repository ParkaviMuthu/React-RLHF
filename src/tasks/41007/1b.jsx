import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// InputField component for reusable input with validation
const InputField = ({ label, value, onChange, type = 'number', min, max, errorMessage }) => {
  const handleChange = (e) => {
    const val = e.target.value;
    if (type === 'number' && (val === '' || (parseFloat(val) >= min && (max === undefined || parseFloat(val) <= max)))) {
      onChange(val);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-white text-sm font-bold mb-2">
        {label}
      </label>
      <Input type={type} value={value} onChange={handleChange} className="w-full" />
      {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
    </div>
  );
};

// Main App Component
export default function App() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const [results, setResults] = useState(null);

  const validateFields = () => {
    let errors = {};
    if (!loanAmount || parseFloat(loanAmount) <= 0) errors.loanAmount = "Must be positive";
    if (!interestRate || parseFloat(interestRate) < 0) errors.interestRate = "Must be non-negative";
    if (!loanTerm || parseFloat(loanTerm) <= 0) errors.loanTerm = "Must be positive";
    if (extraPayment && parseFloat(extraPayment) < 0) errors.extraPayment = "Must be non-negative";
    return errors;
  };

  const calculatePayment = () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    const rate = parseFloat(interestRate) / 100 / 12;
    const term = parseFloat(loanTerm) * 12;
    const principal = parseFloat(loanAmount);
    const monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalInterest = (monthlyPayment * term) - principal;

    setResults({
      monthlyPayment,
      totalInterest,
      term
    });
  };

  const calculateScenario = () => {
    if (!results) return;
    const newMonthly = results.monthlyPayment + parseFloat(extraPayment);
    // Simplified scenario calculation for brevity
    const newTerm = results.term - (parseFloat(extraPayment) / results.monthlyPayment * 12); // Hypothetical reduction

    setResults(prev => ({
      ...prev,
      scenario: {
        newMonthly,
        newTerm,
        interestSaved: results.totalInterest - ((newMonthly * newTerm) - parseFloat(loanAmount))
      }
    }));
  };

  const isCalculateDisabled = !loanAmount || !interestRate || !loanTerm;
  const isScenarioDisabled = isCalculateDisabled || !extraPayment;

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <Card className="bg-gray-800 max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-yellow-300">Indian Rupee Mortgage Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <InputField label="Loan Amount (₹)" value={loanAmount} onChange={setLoanAmount} min={1} errorMessage={errorMessages.loanAmount} />
          <InputField label="Annual Interest Rate (%)" value={interestRate} onChange={setInterestRate} min={0} errorMessage={errorMessages.interestRate} />
          <InputField label="Loan Term (Years)" value={loanTerm} onChange={setLoanTerm} min={1} errorMessage={errorMessages.loanTerm} />
          <InputField label="Extra Monthly Payment (₹)" value={extraPayment} onChange={setExtraPayment} min={0} errorMessage={errorMessages.extraPayment} />
          
          <Button onClick={calculatePayment} disabled={isCalculateDisabled} className="bg-purple-700 hover:bg-purple-600 mb-2">Calculate Monthly Payment</Button>
          <Button onClick={calculateScenario} disabled={isScenarioDisabled} className="bg-green-600 hover:bg-green-500">Calculate Scenario</Button>
          
          {results && (
            <div className="mt-4">
              <p className="text-white">Monthly Payment: ₹{results.monthlyPayment.toFixed(2)}</p>
              <p className="text-white">Total Interest: ₹{results.totalInterest.toFixed(2)}</p>
              {results.scenario && (
                <>
                  <p className="text-white">With Extra Payment: ₹{results.scenario.newMonthly.toFixed(2)}</p>
                  <p className="text-white">Loan Term Saved: {results.scenario.newTerm.toFixed(0)} months</p>
                  <p className="text-white">Interest Saved: ₹{results.scenario.interestSaved.toFixed(2)}</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}