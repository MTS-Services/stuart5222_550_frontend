import { useEffect, useState } from "react";
import MailTemplates from "./components/MailTemplates";
import AdminDetails from "./components/AdminDetails";
import { useDispatch } from "react-redux";
import { fetchedMailTemplates } from "../../../features/admin/mail/mailFetch";

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState("account");

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Running...");
    dispatch(fetchedMailTemplates());
    console.log("END...");
  }, []);

  const tabs = [
    { id: "account", label: "Account Info" },
    { id: "mail", label: "Mail Template" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return <AdminDetails />;
      case "mail":
        return <MailTemplates />;
      default:
        return <p className="text-gray-500">Content not available yet.</p>;
    }
  };

  return (
    <div className="bg-[#F9FAFB] md:p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-800">Settings</h1>
      <p className="mb-6 text-gray-600">
        Manage your account and application settings
      </p>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-[#ff8c00] text-[#c26b00]"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

export default SettingsView;
