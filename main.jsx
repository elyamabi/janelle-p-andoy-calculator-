import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const buttons = [
  ["AC", "clear"], ["⌫", "backspace"], ["÷", "/"], ["×", "*"],
  ["7", "7"], ["8", "8"], ["9", "9"], ["−", "-"],
  ["4", "4"], ["5", "5"], ["6", "6"], ["+", "+"],
  ["1", "1"], ["2", "2"], ["3", "3"], ["=", "="],
  ["0", "0"], [".", "."]
];

function calculate(expression) {
  if (!expression) return "";
  const safe = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  if (!/^[0-9+\-*/.()\s]+$/.test(safe)) throw new Error("Invalid expression");
  if (/\/\s*0(?:\.0*)?(?![\d.])/.test(safe)) throw new Error("Cannot divide by zero");
  const result = Function(`"use strict"; return (${safe})`)();
  if (!Number.isFinite(result)) throw new Error("Invalid calculation");
  return String(Number(result.toFixed(10)));
}

function Calculator() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const press = (value) => {
    setError("");

    if (value === "clear") {
      setDisplay("");
      setResult("");
      return;
    }

    if (value === "backspace") {
      setDisplay((old) => old.slice(0, -1));
      setResult("");
      return;
    }

    if (value === "=") {
      try {
        const answer = calculate(display);
        if (answer === "") return;
        setResult(answer);
      } catch {
        setError("Error");
        setResult("");
      }
      return;
    }

    if (["+", "-", "*", "/"].includes(value)) {
      setDisplay((old) => {
        if (!old) return old;
        if (/[+\-*/.]$/.test(old)) return old.slice(0, -1) + value;
        return old + value;
      });
      setResult("");
      return;
    }

    if (value === ".") {
      setDisplay((old) => {
        const currentNumber = old.split(/[+\-*/]/).pop();
        if (currentNumber.includes(".")) return old;
        return old + (currentNumber === "" ? "0." : ".");
      });
      setResult("");
      return;
    }

    setDisplay((old) => old + value);
    setResult("");
  };

  useEffect(() => {
    const handleKey = (event) => {
      const key = event.key;
      if (/^[0-9.]$/.test(key)) press(key);
      else if (["+", "-", "*", "/"].includes(key)) press(key);
      else if (key === "Enter" || key === "=") press("=");
      else if (key === "Escape") press("clear");
      else if (key === "Backspace") press("backspace");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [display]);

  const shown = result || display || "0";

  return (
    <div className="calculator-card">
      <div className="display">
        <div className="expression">{display || "0"}</div>
        <div className="answer">{error || result || ""}</div>
      </div>

      <div className="button-grid">
        {buttons.map(([label, value]) => {
          const isOperator = ["+", "-", "*", "/"].includes(value);
          const isEquals = value === "=";
          const isClear = value === "clear";

          return (
            <button
              key={label}
              onClick={() => press(value)}
              className={[
                "calc-button",
                isOperator ? "operator" : "",
                isEquals ? "equals" : "",
                isClear ? "clear" : "",
                label === "0" ? "zero" : ""
              ].join(" ")}
              aria-label={label}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
            DCIT 26 • Laboratory 1
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Janelle P. Andoy
          </h1>
          <p className="mt-2 text-gray-400">
            React & Tailwind CSS Calculator
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(320px,420px)_1fr] lg:items-start">
          <Calculator />

          <aside className="rounded-3xl border border-[#222222] bg-[#0a0a0a] p-6 shadow-2xl backdrop-blur">
            <h2 className="text-2xl font-bold">How to Use</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-gray-400">
              <p><strong className="text-white">1. Enter numbers:</strong> Click the number buttons from 0–9.</p>
              <p><strong className="text-white">2. Choose an operation:</strong> Use +, −, ×, or ÷.</p>
              <p><strong className="text-white">3. Get the answer:</strong> Press the = button.</p>
              <p><strong className="text-white">4. Clear:</strong> Press AC to reset the calculator.</p>
              <p><strong className="text-white">5. Delete:</strong> Press ⌫ to remove the last character.</p>
              <p><strong className="text-white">6. Keyboard:</strong> You can also use your keyboard for numbers, operators, Enter, Escape, and Backspace.</p>
            </div>

            <div className="mt-7 border-t border-[#222222] pt-5">
              <h3 className="font-bold">Supported Operations</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Addition (+)", "Subtraction (−)", "Multiplication (×)", "Division (÷)"].map((item) => (
                  <span key={item} className="rounded-full bg-[#171717] px-3 py-1.5 text-xs font-medium text-gray-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 rounded-2xl bg-[#111111] p-4 text-sm text-gray-400">
              <span className="font-semibold text-white">Error handling:</span> The calculator shows an error when an invalid calculation such as division by zero is entered.
            </div>
          </aside>
        </section>

        <footer className="mt-8 text-center text-sm text-gray-600">
          © 2026 Janelle P. Andoy • Cavite State University – Tanza Campus
        </footer>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);