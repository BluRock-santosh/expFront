import React, { useState } from "react";
import { backendUrl } from "./Login";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  activeTab: "add" | "view" | "analytics"; // Change "dashboard" to "analytics"
  setActiveTab: (tab: "add" | "view" | "analytics") => void; // Change "dashboard" to "analytics"
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const tabs = [
    { value: "add", label: "Add New Expense" },
    { value: "view", label: "View Expenses" },
    { value: "analytics", label: "Analytics" }, // Changed to "Analytics"
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <div className="relative top-5 p-5">
      {/* Mobile Hamburger Button */}
      <button
        onClick={handleSidebarToggle}
        className="lg:hidden p-2 rounded bg-primary absolute top-2 left-2 text-white"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar for larger screens */}
      <div className="hidden lg:block pr-4">
        <div className="flex flex-col border-r-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as "add" | "view" | "analytics")}
              className={`py-2 px-4 mb-4 rounded ${
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="py-2 border px-4 bg-slate text-primary hover:bg-gray-100 rounded"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Sidebar for smaller screens */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleCloseSidebar}
            aria-label="Close sidebar"
          ></div>

          {/* Sidebar */}
          <div className="relative h-full w-64 bg-white shadow-lg">
            <div className="flex flex-col p-4 border-r-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setActiveTab(tab.value as "add" | "view" | "analytics");
                    handleCloseSidebar(); // Close sidebar on tab click
                  }}
                  className={`py-2 px-4 mb-4 rounded ${
                    activeTab === tab.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="py-2 px-4 border bg-slate text-primary hover:bg-gray-100 rounded"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
