import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function TicketStatusBar({ stats }) {
  const data = [
    { name: "Open", value: stats.open },
    { name: "In Progress", value: stats.inProgress },
    { name: "Resolved", value: stats.resolved },
    { name: "Closed", value: stats.closed || 0 }
  ];

  return (
    <div className="chart-card">
      <h3>Tickets by Status</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#1e88e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}