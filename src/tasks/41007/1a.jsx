import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from "@/components/ui/card";

const App = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [errors, setErrors] = useState({});
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [amortization, setAmortization] = useState([]);
  const [totalInterest, setTotalInterest] = useState(null);
  const [showAmortization, setShowAmortization] = useState(false);

  const validateInput = (value, name, isNonNegative = false) => {
    if (!value || parseFloat(value) < 0 || (isNonNegative && parseFloat(value) === 0)) {
      setErrors(prev => ({ ...prev, [name]: `Invalid ${name}` }));
      return false;
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
    return true;
  };

  const calculatePayment = () => {
    if (!validateInput(loanAmount, 'loanAmount', true) || 
        !validateInput(interestRate, 'interestRate') || 
        !validateInput(loanTerm, 'loanTerm', true)) return;

    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    const p = loanAmount;
    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(payment.toFixed(2));

    // Amortization Schedule
    let balance = p;
    let schedule = [];
    let totalInterestPaid = 0;
    for (let year = 1; year <= loanTerm; year++) {
      for (let month = 1; month <= 12; month++) {
        const interest = balance * r;
        const principal = payment - interest;
        balance -= principal;
        totalInterestPaid += interest;
        schedule.push({
          month: `${year}-${month}`,
          principal: principal.toFixed(2),
          interest: interest.toFixed(2),
          balance: balance.toFixed(2),
        });
      }
    }
    setAmortization(schedule);
    setTotalInterest(totalInterestPaid.toFixed(2));
    setShowAmortization(true);
  };

  const calculateScenario = () => {
    if (validateInput(extraPayment, 'extraPayment', true)) {
      // Here you would calculate the new scenario with extra payments
      // For simplicity, let's just show the new payment
      const newPayment = (parseFloat(monthlyPayment) + parseFloat(extraPayment)).toFixed(2);
      console.log(`New Monthly Payment with Extra: ₹${newPayment}`);
    }
  };

  const isCalculateDisabled = !loanAmount || !interestRate || !loanTerm || Object.values(errors).some(Boolean);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center py-10">
      <Card className="w-full max-w-md bg-gray-800">
        <CardHeader>
          <CardTitle className="text-yellow-300">Mortgage Calculator</CardTitle>
          <CardDescription>Calculate your mortgage payments in INR</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              label="Loan Amount (₹)" 
              type="number" 
              value={loanAmount} 
              onChange={(e) => setLoanAmount(e.target.value)} 
              className="text-black"
              error={errors.loanAmount}
            />
            <Input 
              label="Annual Interest Rate (%)" 
              type="number" 
              value={interestRate} 
              onChange={(e) => setInterestRate(e.target.value)} 
              className="text-black"
              error={errors.interestRate}
            />
            <Input 
              label="Loan Term (Years)" 
              type="number" 
              value={loanTerm} 
              onChange={(e) => setLoanTerm(e.target.value)} 
              className="text-black"
              error={errors.loanTerm}
            />
            <Input 
              label="Extra Monthly Payment (₹)" 
              type="number" 
              value={extraPayment} 
              onChange={(e) => setExtraPayment(e.target.value)} 
              className="text-black"
              error={errors.extraPayment}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="bg-purple-700 hover:bg-purple-800" onClick={calculatePayment} disabled={isCalculateDisabled}>Calculate Monthly Payment</Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={calculateScenario} disabled={!monthlyPayment || !extraPayment}>Calculate Scenario</Button>
        </CardFooter>
        {monthlyPayment && (
          <CardContent>
            <div className="text-white">
              <p>Monthly Payment: ₹{monthlyPayment}</p>
              <p>Total Interest Paid: ₹{totalInterest}</p>
            </div>
            {showAmortization && (
              <div>
                <h3 className="text-yellow-300 mt-4">Amortization Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th>Month</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortization.slice(0, 12).map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.month}</td>
                          <td>₹{item.principal}</td>
                          <td>₹{item.interest}</td>
                          <td>₹{item.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default App;