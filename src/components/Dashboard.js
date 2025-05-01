import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import "../style/dashboard.css";
import { Eye, EyeOff } from "lucide-react"; // Falls du Lucide verwendest (ansonsten FontAwesome oder andere Icons nutzen)

const Dashboard = () => {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [categoryData, setCategoryData] = useState({ income: {}, expense: {} });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [balanceHistory, setBalanceHistory] = useState([]);

  const [visibleSections, setVisibleSections] = useState({
    transactions: true,
    events: true,
    charts: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/transactions");
        const allEntries = await res.json();

        const incomeData = allEntries.filter(
          (entry) => entry.type === "income"
        );
        const expenseData = allEntries.filter(
          (entry) => entry.type === "expense"
        );

        const incomeSum = incomeData.reduce(
          (sum, item) => sum + item.amount,
          0
        );
        const expenseSum = expenseData.reduce(
          (sum, item) => sum + item.amount,
          0
        );

        const allSorted = [...incomeData, ...expenseData]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        setRecentEntries(allSorted);

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
          expense: groupByCategory(expenseData),
        });
        // Group data by date
        const groupByDate = (entries) => {
          return entries.reduce((acc, entry) => {
            const date = new Date(entry.date).toISOString().split("T")[0]; // Format to YYYY-MM-DD
            if (!acc[date]) acc[date] = 0;
            acc[date] += entry.amount;
            return acc;
          }, {});
        };

        const incomeByDate = groupByDate(incomeData);
        const expenseByDate = groupByDate(expenseData);
        // Calculate daily balance and filter for the last 3 months
        const now = new Date();
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);

        const balanceHistory = [];
        let cumulativeBalance = 0;

        // Go through the last 3 months day-by-day
        for (
          let d = new Date(threeMonthsAgo);
          d <= now;
          d.setDate(d.getDate() + 1)
        ) {
          const dateString = d.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
          const incomeForDay = incomeByDate[dateString] || 0;
          const expenseForDay = expenseByDate[dateString] || 0;

          cumulativeBalance += incomeForDay - expenseForDay;
          balanceHistory.push({
            date: dateString,
            balance: cumulativeBalance,
          });
        }

        // Set the balance history
        setBalanceHistory(balanceHistory);
      } catch (err) {
        console.error("Fehler beim Laden der Transaktionen:", err);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        const now = new Date().toISOString().split("T")[0];

        const upcoming = data
          .filter((event) => event.date >= now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);

        // Berechne Countdown für jedes Event
        const eventsWithCountdown = upcoming.map((event) => {
          const eventDate = new Date(event.date);
          const now = new Date();
          const diffTime = eventDate - now;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor(
            (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const diffMinutes = Math.floor(
            (diffTime % (1000 * 60 * 60)) / (1000 * 60)
          );
          return {
            ...event,
            countdown: `${diffDays} Tage, ${diffHours} Stunden, ${diffMinutes} Minuten`,
          };
        });

        setUpcomingEvents(eventsWithCountdown);
      } catch (err) {
        console.error("Fehler beim Laden der Events:", err);
      }
    };

    fetchData();
    fetchEvents();
  }, []);

  const toggleSection = (section) => {
    setVisibleSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderBalanceChart = () => {
    const dates = balanceHistory.map((entry) =>
      new Date(entry.date).toLocaleDateString()
    );
    const balances = balanceHistory.map((entry) => entry.balance);
    console.log(dates, balances);

    return (
      <div className="chart-block">
        <h4>Saldo-Entwicklung</h4>
        <Line
          data={{
            labels: dates,
            datasets: [
              {
                label: "Saldo (€)",
                data: balances,
                fill: true,
                borderColor: "#36A2EB",
                tension: 0,
              },
            ],
          }}
          options={{
            scales: {
              x: {
                type: "category", // X-Achse als Zeitachse
                title: {
                  display: true,
                  text: "Zeitpunkt",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Saldo (€)",
                },
              },
            },
          }}
        />
      </div>
    );
  };

  const renderChart = (dataObj, title) => {
    if (balanceHistory.length === 0) {
      return <p>Keine Saldo-Daten verfügbar</p>;
    }
    const labels = Object.keys(dataObj);
    const data = Object.values(dataObj);

    return (
      <div className="chart-block">
        <h4>{title}</h4>
        <Pie
          data={{
            labels,
            datasets: [
              {
                data,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                ],
              },
            ],
          }}
        />
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-section">
        <h2>Dashboard</h2>
        {renderBalanceChart()}
        <div className="summary">
          <p>
            <strong>Einnahmen:</strong> {incomeTotal.toFixed(2)} €
          </p>
          <p>
            <strong>Ausgaben:</strong> {expenseTotal.toFixed(2)} €
          </p>
          <p className={incomeTotal - expenseTotal < 0 ? "red" : "green"}>
            <strong>Saldo:</strong> {(incomeTotal - expenseTotal).toFixed(2)} €
          </p>
        </div>
      </div>

      <div className="dashboard-content">
        {visibleSections.transactions && (
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Letzte Transaktionen</h3>
              <EyeOff
                className="section-toggle"
                onClick={() => toggleSection("transactions")}
              />
            </div>
            <ul className="transaction-list">
              {recentEntries.map((entry, index) => {
                const isIncome = entry.type === "income";
                return (
                  <li key={index} className={`transaction-item ${entry.type}`}>
                    <span>{entry.title}</span>
                    <span>
                      {new Date(entry.date).toLocaleString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>{entry.category}</span>
                    <span style={{ color: isIncome ? "#28a745" : "#dc3545" }}>
                      {isIncome ? "↑" : "↓"} {entry.amount.toFixed(2)} €
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {visibleSections.events && (
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Bevorstehende Events</h3>
              <EyeOff
                className="section-toggle"
                onClick={() => toggleSection("events")}
              />
            </div>
            {upcomingEvents.length === 0 ? (
              <p>Keine bevorstehenden Events.</p>
            ) : (
              <ul>
                {upcomingEvents.map((event) => (
                  <li key={event.id}>
                    <strong>{event.title}</strong> am{" "}
                    {new Date(event.date).toLocaleDateString()}
                    <span>Verbleibende Zeit: {event.countdown}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {visibleSections.charts && (
        <div className="dashboard-section ">
          <div className="section-header">
            <h3>Kategorien</h3>
            <EyeOff
              className="section-toggle"
              onClick={() => toggleSection("charts")}
            />
          </div>
          <div className="chart-container">
            {renderChart(categoryData.income, "Einnahmen nach Kategorie")}
            {renderChart(categoryData.expense, "Ausgaben nach Kategorie")}
          </div>
        </div>
      )}

      <div className="restore-icons">
        {!visibleSections.transactions && (
          <div
            onClick={() => toggleSection("transactions")}
            title="Transaktionen einblenden"
          >
            <Eye /> Transaktionen
          </div>
        )}
        {!visibleSections.events && (
          <div
            onClick={() => toggleSection("events")}
            title="Events einblenden"
          >
            <Eye /> Events
          </div>
        )}
        {!visibleSections.charts && (
          <div
            onClick={() => toggleSection("charts")}
            title="Charts einblenden"
          >
            <Eye /> Charts
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
