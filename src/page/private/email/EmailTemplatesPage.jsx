import React, { useState, useEffect } from "react";
import { PencilIcon, EyeIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { IoArrowBackCircleOutline, IoMailOutline } from "react-icons/io5";
import EmailTemplateBuilder from "./components/EmailTemplateBuilder";
import { toast } from "react-toastify";
import { adminAPI } from "../../../services/api";
import { FaAt } from "react-icons/fa";
import { LucideSend } from "lucide-react";

const EmailTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list', 'create', 'edit', 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getEmailTemplates();
      setTemplates(response.data || []);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (templateData) => {
    try {
      setLoading(true);
      console.log("Updating template with data:", templateData);

      const response = await adminAPI.updateEmailTemplate(
        selectedTemplate.name,
        {
          subject: templateData.subject,
          body: templateData.body,
          html_template: templateData.html_template,
          components: templateData.components,
          settings: templateData.settings,
          variables: templateData.variables,
        },
      );

      console.log("Update template response:", response);

      if (response.success || response.message) {
        await loadTemplates();
        setCurrentView("list");
        setSelectedTemplate(null);
        toast.success("Template updated successfully!");
      } else {
        console.error("Unexpected response format:", response);
        toast.error(
          "Error updating template. Please check console for details.",
        );
      }
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error(
        `Error updating template: ${error.message || "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (html, subject) => {
    setPreviewData({ html, subject });
    setCurrentView("preview");
  };

  const handleSendTest = async () => {
    if (!testEmail || !selectedTemplate) return;

    try {
      setSendingTest(true);
      await adminAPI.sendTestEmail(selectedTemplate.name, testEmail);
      toast.success("Test email sent successfully!");
      setTestEmail("");
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email");
    } finally {
      setSendingTest(false);
    }
  };

  const renderTemplatesList = () => (
    <div className="space-y-6 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600">
            Design and manage your email templates
          </p>
        </div>
      </div>

      {/* Existing Templates */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Templates
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="p-6 text-center">
            <EnvelopeIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">
              No templates found. Create your first template above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {templates.map((template) => (
              <div
                key={template.name}
                className="flex items-center justify-between px-8 py-4 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-medium text-gray-900">
                      {template.subject}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        template.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Template: {template.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Last updated:{" "}
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setPreviewData({
                        html: template.htmlTemplate,
                        subject: template.subject,
                      });
                      setCurrentView("preview");
                    }}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    title="Preview"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setCurrentView("edit");
                    }}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setTestEmail("");
                      setCurrentView("test");
                    }}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    title="Send Test Email"
                  >
                    <EnvelopeIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-4 p-10">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => setCurrentView("list")} className="">
          <IoArrowBackCircleOutline
            size={30}
            className="text-gray-400 hover:text-gray-600"
          />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Template Preview</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {previewData?.subject}
        </h3>

        <div className="overflow-hidden rounded-lg border border-gray-300">
          <iframe
            srcDoc={previewData?.html}
            className="h-[600px] w-full"
            title="Email Preview"
          />
        </div>
      </div>
    </div>
  );

  const renderTestEmailModal = () => (
    <div className="p-10">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView("list")}
            className="group flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <IoArrowBackCircleOutline
              size={24}
              className="transition-transform group-hover:scale-110"
            />
            <span className="text-sm font-medium">Back to Templates</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b border-gray-100 bg-orange-50 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Send Test Email
            </h1>
            <p className="mt-1 text-gray-600">
              Preview and test your email template before sending
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* Template Info */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <IoMailOutline className="h-10 w-10 text-gray-600" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    {selectedTemplate?.subject || "No subject"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Template preview and testing
                  </p>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Send test to email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address for testing"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaAt className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                We'll send a test version of this template to the email above
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                onClick={handleSendTest}
                disabled={!testEmail || sendingTest}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {sendingTest ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending Test...
                  </>
                ) : (
                  <>
                    <LucideSend className="h-5 w-5" />
                    Send Test Email
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setPreviewData({
                    html: selectedTemplate.htmlTemplate,
                    subject: selectedTemplate.subject,
                  });
                  setCurrentView("preview");
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Preview Template
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Testing Tips</p>
              <p className="mt-1 text-sm text-blue-700">
                Send test emails to verify formatting, links, and content before
                sending to your audience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on current view
  switch (currentView) {
    case "edit":
      return (
        <EmailTemplateBuilder
          template={selectedTemplate}
          onSave={handleUpdateTemplate}
          onPreview={handlePreview}
          onCancel={() => {
            setCurrentView("list");
            setSelectedTemplate(null);
          }}
          isLoading={loading}
        />
      );
    case "preview":
      return renderPreview();
    case "test":
      return renderTestEmailModal();
    default:
      return renderTemplatesList();
  }
};

export default EmailTemplatesPage;
