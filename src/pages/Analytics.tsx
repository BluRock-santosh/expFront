import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { backendUrl } from "./Login"; // Make sure this path is correct

interface Expense {
  category: string;
  amount: number;
}

interface ChartConfig {
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const ChartContainer: React.FC<{
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
}> = ({ config, className, children }) => {
  const containerStyle: React.CSSProperties = {
    width: config.width,
    height: config.height,
    margin: `${config.margin?.top ?? 0}px ${config.margin?.right ?? 0}px ${
      config.margin?.bottom ?? 0
    }px ${config.margin?.left ?? 0}px`,
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
};

const Analytics: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const chartConfig: ChartConfig = {
    width: 400,
    height: 400,
   
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Expense[] = await response.json();
        setExpenses(data);
      
        

        const total = data.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalExpense(total);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Consider displaying an error message to the user in the UI
      }
    };

    fetchData();
  }, []);

  return (
    <div className=" text-center">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">Analytics</h1>

      <div className="mb-6">
        <h2 className="text-lg">Total Expense: ${totalExpense}</h2>
      </div>

     
      <div className="w-full flex justify-center items-center  h-[400px]"> {/* Control width and height here */}
                <ChartContainer config={chartConfig} className="w-full h-full flex justify-center items-center "> {/* ChartContainer fills this div */}
                    <ResponsiveContainer width="100%" > 
                        <BarChart data={expenses}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
    </div>
  );
};

export default Analytics;
