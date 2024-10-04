import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function App() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [extraPayment, setExtraPayment] = useState("");
  const [scenarioDetails, setScenarioDetails] = useState(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [totalInterest, setTotalInterest] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Helper function to format currency for Indian Rupees
  const formatCurrency = (amount) => {
    return amount
      ? `₹${amount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "₹0.00";
  };

  // Function to calculate monthly mortgage payment
  const calculatePayment = () => {
    const principal = parseFloat(loanAmount);
    const interest = parseFloat(interestRate) / 100 / 12;
    const payments = parseInt(loanTerm) * 12;

    if (isNaN(principal) || principal <= 0) {
      setErrorMessage("Please enter a valid loan amount.");
      return;
    }
    if (isNaN(interest) || interestRate < 0) {
      setErrorMessage("Please enter a valid interest rate.");
      return;
    }
    if (isNaN(payments) || loanTerm <= 0) {
      setErrorMessage("Please enter a valid loan term.");
      return;
    }

    setErrorMessage(""); // Clear any error messages

    if (interest === 0) {
      const simplePayment = principal / payments;
      setMonthlyPayment(simplePayment.toFixed(2));
      generateAmortizationSchedule(simplePayment, 0, payments); // Pass 0 interest for amortization
    } else {
      const x = Math.pow(1 + interest, payments);
      const monthly = (principal * x * interest) / (x - 1);
      setMonthlyPayment(monthly.toFixed(2));
      generateAmortizationSchedule(monthly, interest, payments);
    }
  };

  // Function to calculate the amortization schedule
  const generateAmortizationSchedule = (monthly, interest, payments) => {
    let remainingPrincipal = parseFloat(loanAmount);
    let schedule = [];
    let totalInterestPaid = 0;

    for (let i = 1; i <= payments; i++) {
      const interestPayment = remainingPrincipal * interest;
      const principalPayment = monthly - interestPayment;

      if (remainingPrincipal < 0) {
        break;
      }

      remainingPrincipal -= principalPayment;
      totalInterestPaid += interestPayment;

      schedule.push({
        month: i,
        principal: formatCurrency(Math.max(principalPayment, 0)),
        interest: formatCurrency(Math.max(interestPayment, 0)),
        balance: formatCurrency(Math.max(remainingPrincipal, 0)),
      });
    }
    setAmortizationSchedule(schedule);
    setTotalInterest(totalInterestPaid.toFixed(2));
  };

  // Function to calculate the "What-If" scenario for extra payments
  const calculateScenario = () => {
    const principal = parseFloat(loanAmount);
    const interest = parseFloat(interestRate) / 100 / 12;
    const payments = parseInt(loanTerm) * 12;
    const extra = parseFloat(extraPayment);

    if (isNaN(extra) || extra <= 0) {
      alert("Please enter a valid extra payment.");
      return;
    }

    const x = Math.pow(1 + interest, payments);
    const monthly = (principal * x * interest) / (x - 1);
    const monthlyWithExtra = monthly + extra;

    let remainingPrincipal = principal;
    let monthsSaved = 0;

    for (let i = 1; i <= payments; i++) {
      const interestPayment = remainingPrincipal * interest;
      const principalPayment = monthlyWithExtra - interestPayment;

      remainingPrincipal -= principalPayment;

      if (remainingPrincipal <= 0) {
        monthsSaved = payments - i;
        break;
      }
    }

    setScenarioDetails({
      originalPayment: formatCurrency(monthly),
      extraPayment: formatCurrency(extra),
      newTotalPayment: formatCurrency(monthlyWithExtra),
      monthsSaved,
    });
  };

  // Handling NaN values by providing a fallback of an empty string ("")
  const handleInputChange = (setter, field) => (e) => {
    const value = e.target.value;

    // Update state normally with the input value
    setter(value);

    // Clear error messages when valid inputs are detected
    if (field === "loanAmount" && value > 0) {
      setErrorMessage("");
    } else if (field === "interestRate" && value >= 0) {
      setErrorMessage("");
    } else if (field === "loanTerm" && value > 0) {
      setErrorMessage("");
    }
  };

  // Check if all input fields have valid data to enable the calculate buttons
  const isCalculateDisabled = !loanAmount || !interestRate || !loanTerm;
  const isScenarioDisabled =
    !loanAmount || !interestRate || !loanTerm || !extraPayment;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <Card className="max-w-md mx-auto p-4 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-yellow-300">Mortgage Calculator</CardTitle>
          <CardDescription className="text-gray-400">
            Calculate your mortgage payments, explore scenarios with extra
            payments, and more.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <label className="text-yellow-300">Loan Amount (₹)</label>
            <Input
              type="number"
              value={loanAmount}
              onChange={handleInputChange(setLoanAmount, "loanAmount")}
              className="w-full mt-2 p-2 bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="text-yellow-300">Interest Rate (%)</label>

            <Input
              type="number"
              value={interestRate}
              onChange={handleInputChange(setInterestRate, "interestRate")}
              className="w-full mt-2 p-2 bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="text-yellow-300">Loan Term (years)</label>

            <Input
              type="number"
              value={loanTerm}
              onChange={handleInputChange(setLoanTerm, "loanTerm")}
              className="w-full mt-2 p-2 bg-gray-700 text-white"
            />
          </div>
        </CardContent>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

<CardFooter className="flex flex-col items-center">
  <Button
    onClick={calculatePayment}
    className="w-full px-4 sm:px-6 md:px-8 bg-purple-700 hover:bg-purple-800"
    disabled={isCalculateDisabled}
  >
    Calculate Monthly Payment
  </Button>
   {monthlyPayment && (
            <p className="mt-4 text-yellow-300">
              Your monthly payment is:{" "}
              <strong>{formatCurrency(parseFloat(monthlyPayment))}</strong>
            </p>
          )}

          {/* Section for extra payments */}
          <div className="mt-6 w-full">
            <h3 className="text-lg font-bold text-yellow-300">
              What-If Scenario: Extra Payments
            </h3>
            <label className="text-yellow-300">Extra Payment (₹)</label>
            <Input
              type="number"
              value={extraPayment}
              onChange={handleInputChange(setExtraPayment)}
              className="w-full mt-2 p-2 bg-gray-700 text-white"
            />
            <Button
              onClick={calculateScenario}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
              disabled={isScenarioDisabled}
            >
              Calculate Scenario
            </Button>

            {scenarioDetails && (
              <div className="mt-4 text-yellow-300">
                <p>
                  Original Monthly Payment: {scenarioDetails.originalPayment}
                </p>
                <p>Extra Payment: {scenarioDetails.extraPayment}</p>
                <p>New Total Payment: {scenarioDetails.newTotalPayment}</p>
                <p>Months Saved: {scenarioDetails.monthsSaved} months</p>
              </div>
            )}
          </div>

          {/* Amortization Schedule */}
          {amortizationSchedule.length > 0 && (
            <div className="mt-6 w-full">
              <h3 className="text-lg font-bold text-yellow-300">
                Amortization Schedule
              </h3>
              <ul className="mt-4">
                {amortizationSchedule.map((payment, index) => (
                  <li
                    key={index}
                    className="text-white border-b border-gray-700 py-2"
                  >
                    Month {payment.month}: Principal: {payment.principal},
                    Interest: {payment.interest}, Balance: {payment.balance}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-6 text-yellow-300 text-lg font-bold">
            Total Interest Paid
            <p>{formatCurrency(parseFloat(totalInterest))}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
