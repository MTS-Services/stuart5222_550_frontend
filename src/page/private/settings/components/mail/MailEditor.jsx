import React from "react";
import ReactQuill from "react-quill-new"; // or "react-quill"

const MailEditor = ({ selectedTemplate, handleChange, handleSave }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }], // OK here
      [{ align: [] }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "ordered",
    "link",
    "image",
  ];
  return (
    <div className="bg-white">
      {selectedTemplate ? (
        <div className="space-y-6 rounded-lg border p-6 shadow-sm">
          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              value={selectedTemplate.subject}
              onChange={(e) =>
                handleChange(selectedTemplate.id, "subject", e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#df7e00]"
              placeholder="Email subject line"
            />
          </div>

          {/* Content with Rich Text Editor */}
          <div className="space-y-8">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Email Content
              </label>
            </div>

            <ReactQuill
              theme="snow"
              value={selectedTemplate.html_template}
              onChange={(value) =>
                handleChange(selectedTemplate.id, "html_template", value)
              }
              modules={modules}
              formats={formats}
              placeholder="Write your email template here..."
            />
          </div>
          {/* Save Button */}
          <button
            onClick={handleSave}
            className="mt-4 w-full rounded-[4px] bg-[#FF8C00] py-3 font-raleway font-medium text-white transition-colors duration-200 hover:bg-[#E67E00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:ring-offset-2"
          >
            Save Template Changes
          </button>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 font-raleway text-lg font-medium text-gray-900">
            No Template Selected
          </h3>
          <p className="mt-2 font-raleway text-gray-500">
            Choose a template from the list to start customizing.
          </p>
        </div>
      )}
    </div>
  );
};

export default MailEditor;
