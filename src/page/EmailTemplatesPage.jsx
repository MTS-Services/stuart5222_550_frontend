import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  EnvelopeIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import EmailTemplateBuilder from '../components/EmailTemplateBuilder';
import { adminAPI } from '../services/api';

const EmailTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  // Default template types that can be created
  const templateTypes = [
    {
      name: 'welcome',
      label: 'Welcome Email',
      description: 'Welcome new users to your platform'
    },
    {
      name: 'registration_approved',
      label: 'Registration Approved',
      description: 'Notify users when their registration is approved'
    },
    {
      name: 'registration_rejected',
      label: 'Registration Rejected',
      description: 'Inform users about registration rejection'
    },
    {
      name: 'payment_reminder',
      label: 'Payment Reminder',
      description: 'Remind users about pending payments'
    },
    {
      name: 'password_reset',
      label: 'Password Reset',
      description: 'Help users reset their passwords'
    }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getEmailTemplates();
      setTemplates(response.data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (templateData) => {
    try {
      setLoading(true);
      console.log('Creating template with data:', templateData);
      
      const response = await adminAPI.createEmailTemplate({
        name: selectedTemplate?.name || 'custom_template',
        subject: templateData.subject,
        body: templateData.body,
        html_template: templateData.html_template,
        components: templateData.components,
        settings: templateData.settings,
        variables: templateData.variables
      });
      
      console.log('Create template response:', response);
      
      if (response.success || response.message) {
        await loadTemplates();
        setCurrentView('list');
        setSelectedTemplate(null);
        alert('Template created successfully!');
      } else {
        console.error('Unexpected response format:', response);
        alert('Error creating template. Please check console for details.');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      alert(`Error creating template: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (templateData) => {
    try {
      setLoading(true);
      console.log('Updating template with data:', templateData);
      
      const response = await adminAPI.updateEmailTemplate(selectedTemplate.name, {
        subject: templateData.subject,
        body: templateData.body,
        html_template: templateData.html_template,
        components: templateData.components,
        settings: templateData.settings,
        variables: templateData.variables
      });
      
      console.log('Update template response:', response);
      
      if (response.success || response.message) {
        await loadTemplates();
        setCurrentView('list');
        setSelectedTemplate(null);
        alert('Template updated successfully!');
      } else {
        console.error('Unexpected response format:', response);
        alert('Error updating template. Please check console for details.');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      alert(`Error updating template: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateName) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      setLoading(true);
      await adminAPI.deleteEmailTemplate(templateName);
      await loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (html, subject) => {
    setPreviewData({ html, subject });
    setCurrentView('preview');
  };

  const handleSendTest = async () => {
    if (!testEmail || !selectedTemplate) return;

    try {
      setSendingTest(true);
      await adminAPI.sendTestEmail(selectedTemplate.name, testEmail);
      alert('Test email sent successfully!');
      setTestEmail('');
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Failed to send test email');
    } finally {
      setSendingTest(false);
    }
  };

  const handleDuplicateTemplate = async (template) => {
    const newTemplate = {
      ...template,
      name: `${template.name}_copy_${Date.now()}`,
      subject: `Copy of ${template.subject}`
    };
    setSelectedTemplate(newTemplate);
    setCurrentView('create');
  };

  const renderTemplatesList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600">Design and manage your email templates</p>
        </div>
        <button
          onClick={() => setCurrentView('create')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Template
        </button>
      </div>

      {/* Template Types Quick Start */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templateTypes.map((type) => {
            const existingTemplate = templates.find(t => t.name === type.name);
            return (
              <div key={type.name} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{type.label}</h4>
                <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                {existingTemplate ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTemplate(existingTemplate);
                        setCurrentView('edit');
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      <PencilIcon className="h-4 w-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicateTemplate(existingTemplate)}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedTemplate({ name: type.name, label: type.label });
                      setCurrentView('create');
                    }}
                    className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Create {type.label}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Existing Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Existing Templates</h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="p-6 text-center">
            <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No templates found. Create your first template above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {templates.map((template) => (
              <div key={template.name} className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-medium text-gray-900">{template.subject}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Template: {template.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setTestEmail('');
                      setCurrentView('test');
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                    title="Send Test Email"
                  >
                    <EnvelopeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setPreviewData({ html: template.htmlTemplate, subject: template.subject });
                      setCurrentView('preview');
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                    title="Preview"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setCurrentView('edit');
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDuplicateTemplate(template)}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                    title="Duplicate"
                  >
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.name)}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Template Preview</h1>
        <button
          onClick={() => setCurrentView('list')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back to Templates
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Subject: {previewData?.subject}</h3>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <iframe
            srcDoc={previewData?.html}
            className="w-full h-96"
            title="Email Preview"
          />
        </div>
      </div>
    </div>
  );

  const renderTestEmailModal = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Send Test Email</h1>
        <button
          onClick={() => setCurrentView('list')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back to Templates
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Test Template: {selectedTemplate?.subject}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Email Address
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter email address to send test"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleSendTest}
              disabled={!testEmail || sendingTest}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {sendingTest ? 'Sending...' : 'Send Test Email'}
            </button>
            <button
              onClick={() => {
                setPreviewData({ html: selectedTemplate.htmlTemplate, subject: selectedTemplate.subject });
                setCurrentView('preview');
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Preview Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on current view
  switch (currentView) {
    case 'create':
      return (
        <EmailTemplateBuilder
          template={selectedTemplate}
          onSave={handleCreateTemplate}
          onPreview={handlePreview}
          onCancel={() => {
            setCurrentView('list');
            setSelectedTemplate(null);
          }}
          isLoading={loading}
        />
      );
    case 'edit':
      return (
        <EmailTemplateBuilder
          template={selectedTemplate}
          onSave={handleUpdateTemplate}
          onPreview={handlePreview}
          onCancel={() => {
            setCurrentView('list');
            setSelectedTemplate(null);
          }}
          isLoading={loading}
        />
      );
    case 'preview':
      return renderPreview();
    case 'test':
      return renderTestEmailModal();
    default:
      return renderTemplatesList();
  }
};

export default EmailTemplatesPage;