import React from "react";
import { useTaskContext } from "../hooks/TaskContext";
import NavBar from "./MyNavbar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PRIORITY_COLORS: Record<string, string> = {
  High: "#dc3545",
  Medium: "#ffc107",
  Low: "#198754",
};

const Dashboard: React.FC = () => {
  const { tasks } = useTaskContext();

  const priorities = ["High", "Medium", "Low"];

  const pieData = priorities
    .map((p) => ({ name: p, value: tasks.filter((t) => t.priority === p).length }))
    .filter((d) => d.value > 0);

  const barData = priorities.map((p) => {
    const group = tasks.filter((t) => t.priority === p);
    return {
      priority: p,
      Total: group.length,
      Done: group.filter((t) => t.done).length,
      Pending: group.filter((t) => !t.done).length,
    };
  });

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;

  return (
    <>
      <NavBar />
      <div className="container py-4">
        <h4 className="mb-4 fw-bold">Dashboard</h4>

        {/* Summary cards */}
        <div className="row g-3 mb-4">
          {[
            { label: "Total Tasks", value: total, color: "primary" },
            { label: "Completed", value: done, color: "success" },
            { label: "Pending", value: total - done, color: "warning" },
            { label: "High Priority", value: tasks.filter((t) => t.priority === "High").length, color: "danger" },
          ].map(({ label, value, color }) => (
            <div className="col-6 col-md-3" key={label}>
              <div className={`card border-${color} text-center p-3`}>
                <div className={`fs-2 fw-bold text-${color}`}>{value}</div>
                <div className="small text-muted">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {total === 0 ? (
          <div className="text-center text-muted py-5">
            <p>No tasks yet — create some to see your dashboard charts!</p>
          </div>
        ) : (
          <div className="row g-4">
            {/* Pie chart */}
            <div className="col-md-5">
              <div className="card p-3 h-100">
                <h6 className="fw-semibold mb-3">Tasks by Priority</h6>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar chart */}
            <div className="col-md-7">
              <div className="card p-3 h-100">
                <h6 className="fw-semibold mb-3">Done vs Pending by Priority</h6>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Done" fill="#198754" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pending" fill="#ffc107" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
