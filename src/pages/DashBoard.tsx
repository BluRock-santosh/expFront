import { useState } from "react";
import AddExpense from "./AddExpense";
import Sidebar from "./Sidebar";
import ViewExpenses from "./ViewExpenses";
import Analytics from "./Analytics";

export default function DashBoard() {

  const [activeTab, setActiveTab] = useState<"add" | "view" | "analytics" >("add");

  return (
    <div className="flex  flex-col lg:flex-row">
      {/* Tab Navigation (Sidebar) */}
      <div className="lg:w-1/3 w-full mb-4 lg:mb-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="lg:w-3/4 md:1/2 w-full">
        {activeTab === "add" && (
          <div className="p-6">
            <AddExpense />
          </div>
        )}

        {activeTab === "view" && (
          <div className="lg:p-6">
            <ViewExpenses />
          </div>
        )}

      {
        activeTab === "analytics" && (
          <div className="lg:p-6">
            <Analytics />
          </div>)
      }
      
      </div>
    </div>
  );
}
