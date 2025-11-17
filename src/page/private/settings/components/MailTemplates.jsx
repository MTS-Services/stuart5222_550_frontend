import { useEffect, useState } from "react";
import MailEditor from "./mail/MailEditor";
import { useDispatch, useSelector } from "react-redux";
import { updateMailTemplates } from "../../../../features/admin/mail/mailFetch";
import { toast } from "react-toastify";

const MailTemplates = () => {
  const { templates, isLoading, isError, success } = useSelector(
    (state) => state.mail,
  );
  const [template, setTemplate] = useState(templates);

  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();

  const handleSelect = (id) => setSelectedId(id);
  const handleChange = (id, field, value) => {
    setTemplate((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const handleSave = async () => {
    const selected = template.find((t) => t.id === selectedId);
    if (!selected) {
      toast.error("Please select a template first.");
      return;
    }

    try {
      await dispatch(updateMailTemplates({ templateData: selected })).unwrap();
      toast.success("Template updated successfully!");
    } catch (error) {
      toast.error(`Update failed: ${error}`);
      console.error("Error updating template:", error);
    }
  };

  const selectedTemplate = template.find((t) => t.id === selectedId);

  useEffect(() => {
    setTemplate(templates);
  }, [templates]);

  const templateNames = {
    profile_approved: "Profile Approved",
    registration_approved: "Registration Approved",
    registration_rejected: "Registration Rejected",
  };

  return (
    <section>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-3 space-y-4 rounded-lg border bg-white p-4 md:col-span-1 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Mail Templates
          </h2>
          <hr />
          {template.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`w-full rounded-lg px-4 py-2 text-left transition ${
                selectedId === t.id
                  ? "border-blue-600 bg-blue-50 text-[#003366]"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {templateNames[t.name] || t.name}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="col-span-3 md:col-span-3">
          <MailEditor
            selectedTemplate={selectedTemplate}
            handleChange={handleChange}
            handleSave={handleSave}
            isLoading={isLoading}
          />
          <div className="mt-6 bg-white">
            {selectedTemplate && (
              <div className="rounded-lg border bg-gray-50 p-8 shadow-sm">
                <h3 className="mb-2 rounded-md bg-slate-100 px-4 py-4 text-lg font-semibold text-gray-800">
                  Live Preview
                </h3>
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: selectedTemplate.html_template
                      .replace(/{{userName}}/g, "Nayem")
                      .replace(
                        /{{dashboardLink}}/g,
                        "https://yourapp.com/dashboard",
                      )
                      .replace(/{{resetLink}}/g, "https://yourapp.com/reset")
                      .replace(/{{body}}/g, selectedTemplate.body || ""),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MailTemplates;
