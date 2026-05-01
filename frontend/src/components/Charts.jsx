import { useEffect, useState } from 'react';
import API from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

function Chart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get('/transactions/monthly');
    setData(res.data);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="mb-4 font-semibold">Grafik Keuangan</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#16a34a"
            strokeWidth={2}
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#dc2626"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;