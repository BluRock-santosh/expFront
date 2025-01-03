import { useEffect, useState } from "react";
import { backendUrl } from "./Login";
import { toast } from "sonner";

// Define the structure of each expense item
interface ExpenseItem {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
}

interface Expense {
  totalExpenses: number;
  success: boolean;
  message: string;
  expenses: ExpenseItem[];
}

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState<Expense>({
    totalExpenses: 0,
    success: false,
    message: "",
    expenses: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${backendUrl}/api`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data: Expense = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return <p>Loading expenses...</p>;
  }

  // Format date to MM/DD/YYYY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Returns a user-friendly date like "MM/DD/YYYY"
  };

  // Delete expense function
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${backendUrl}/api`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const res = await response.json();

      if (res.success) {
        setExpenses((prevExpenses) => ({
          ...prevExpenses,
          expenses: prevExpenses.expenses.filter((expense) => expense.id !== id),
        }));
        toast.success("Expense deleted successfully.");
      } else {
        toast.error("Error deleting expense.");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error deleting expense.");
    }
  };

  return (
    <div className="h-screen p-4">
      <div className="flex flex-col md:flex justify-center items-center justify-between px-4">
        <h2 className="text-2xl lg:text-4xl font-bold text-center mb-4">
          Your Expenses 
          <span className="text-sm text-gray-500">
            {expenses.expenses.length > 0 ? `(${expenses.expenses.length})` : ""}
          </span>
        </h2>
        <p>Total expense {expenses.totalExpenses}</p>
      </div>

      {/* Table to display expenses */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Amount (USD)</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">No expenses added yet.</td>
              </tr>
            ) : (
              expenses.expenses.map((expense) => (
                <tr key={expense.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{expense.name}</td>
                  <td className="px-4 py-2">{expense.category}</td>
                  <td className="px-4 py-2">{expense.amount} USD</td>
                  <td className="px-4 py-2">{formatDate(expense.date)}</td>
                  <td className="px-4 py-2 text-red-500 cursor-pointer">
                    <button onClick={() => handleDelete(expense.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewExpenses;
