import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [categoryData, setCategoryData] = useState({ income: {}, expense: {} });

  useEffect(() => {
    const incomeData = JSON.parse(localStorage.getItem('income_entries') || '[]');
    const expenseData = JSON.parse(localStorage.getItem('expense_entries') || '[]');

    const incomeSum = incomeData.reduce((sum, item) => sum + item.amount, 0);
    const expenseSum = expenseData.reduce((sum, item) => sum + item.amount, 0);

    const groupByCategory = (entries) => {
      return entries.reduce((acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
        return acc;
      }, {});
    };

    setIncomeTotal(incomeSum);
    setExpenseTotal(expenseSum);
    setCategoryData({
      income: groupByCategory(incomeData),
      expense: groupByCategory(expenseData)
    });
  }, []);

  const renderChart = (dataObj, title) => {
    const labels = Object.keys(dataObj);
    const data = Object.values(dataObj);

    return (
      <div style={{ width: '100%', maxWidth: '400px', margin: '10px', textAlign: 'center' }}>
        <h4>{title}</h4>
        <Pie
          data={{
            labels,
            datasets: [
              {
                data,
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ]
              }
            ]
          }}
        />
      </div>
    );
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className='summary'>
      <p><strong>Einnahmen:</strong> {incomeTotal.toFixed(2)} €</p>
      <p><strong>Ausgaben:</strong> {expenseTotal.toFixed(2)} €</p>
      <p><strong>Saldo:</strong> {(incomeTotal - expenseTotal).toFixed(2)} €</p>
      </div>
      <div className="chart-container">
        {renderChart(categoryData.income, 'Einnahmen nach Kategorie')}
        {renderChart(categoryData.expense, 'Ausgaben nach Kategorie')}
      </div>
    </div>
  );
};

export default Dashboard;