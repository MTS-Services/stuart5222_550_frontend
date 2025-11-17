import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  PlusIcon, 
  TrashIcon, 
  EyeIcon, 
  CodeBracketIcon,
  SwatchIcon,
  PhotoIcon,
  ChatBubbleLeftIcon,
  LinkIcon,
  RectangleStackIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const EmailTemplateBuilder = ({ 
  template = null, 
  onSave, 
  onPreview, 
  onCancel,
  isLoading = false 
}) => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [templateSettings, setTemplateSettings] = useState({
    subject: '',
    preheader: '',
    backgroundColor: '#f4f4f4',
    containerWidth: 600,
    fontFamily: 'Arial, sans-serif'
  });
  const [showCodeView, setShowCodeView] = useState(false);
  const [variables, setVariables] = useState([
    { key: 'currentYear', label: 'Current Year', defaultValue: '2025', description: 'Current year (auto-generated)' },
    { key: 'appName', label: 'App Name', defaultValue: 'Scan Me Maybe', description: 'Application name' },
    { key: 'userName', label: 'User Name', defaultValue: 'John Doe', description: 'User\'s full name' },
    { key: 'userEmail', label: 'User Email', defaultValue: 'user@example.com', description: 'Recipient email address' },
    { key: 'email', label: 'Email (alias)', defaultValue: 'user@example.com', description: 'Same as userEmail' },
    { key: 'subject', label: 'Email Subject', defaultValue: 'Welcome Message', description: 'Template subject line' },
    { key: 'body', label: 'Email Body', defaultValue: 'Email body content', description: 'Template body content' },
    { key: 'editProfileUrl', label: 'Edit Profile URL', defaultValue: '/profile/edit/user@example.com', description: 'Link to edit profile page' },
    { key: 'checkoutUrl', label: 'Checkout URL', defaultValue: '/checkout/user@example.com', description: 'Link to complete profile' }
  ]);
  const [showVariablesModal, setShowVariablesModal] = useState(false);

  // Component types available in the builder
  const componentTypes = [
    {
      type: 'header',
      icon: RectangleStackIcon,
      label: 'Header',
      defaultProps: {
        title: 'Scan Me Maybe',
        subtitle: 'Welcome to our platform',
        backgroundColor: '#667eea',
        textColor: '#ffffff',
        alignment: 'center',
        padding: '40px 20px'
      }
    },
    {
      type: 'text',
      icon: ChatBubbleLeftIcon,
      label: 'Body Text',
      defaultProps: {
        content: 'Hello {{userEmail}},\n\nThis is your main email body content. You can write your message here and use variables like {{checkoutUrl}} and {{currentYear}}.\n\nBest regards,\nThe Scan Me Maybe Team',
        fontSize: '16px',
        textColor: '#333333',
        backgroundColor: 'transparent',
        alignment: 'left',
        padding: '20px'
      }
    },
    {
      type: 'paragraph',
      icon: ChatBubbleLeftIcon,
      label: 'Paragraph',
      defaultProps: {
        content: 'Add a paragraph of text here. Perfect for additional information, disclaimers, or secondary messages.',
        fontSize: '14px',
        textColor: '#666666',
        backgroundColor: 'transparent',
        alignment: 'left',
        padding: '10px 20px'
      }
    },
    {
      type: 'button',
      icon: LinkIcon,
      label: 'Button',
      defaultProps: {
        text: 'Click Here',
        url: 'https://example.com',
        backgroundColor: '#667eea',
        textColor: '#ffffff',
        borderRadius: '8px',
        padding: '15px 30px',
        alignment: 'center'
      }
    },
    {
      type: 'image',
      icon: PhotoIcon,
      label: 'Image',
      defaultProps: {
        src: '',
        alt: 'Image',
        width: '100%',
        alignment: 'center',
        padding: '20px'
      }
    },
    {
      type: 'divider',
      icon: SwatchIcon,
      label: 'Divider',
      defaultProps: {
        height: '2px',
        color: '#e5e5e5',
        margin: '20px 0'
      }
    },
    {
      type: 'footer',
      icon: RectangleStackIcon,
      label: 'Footer',
      defaultProps: {
        content: '© {{currentYear}} {{appName}}. All rights reserved.',
        fontSize: '12px',
        textColor: '#666666',
        backgroundColor: '#f8f8f8',
        alignment: 'center',
        padding: '20px'
      }
    }
  ];

  // Load template data if editing
  useEffect(() => {
    if (template) {
      setTemplateSettings({
        subject: template.subject || '',
        preheader: template.preheader || '',
        backgroundColor: template.settings?.backgroundColor || template.backgroundColor || '#f4f4f4',
        containerWidth: template.settings?.containerWidth || template.containerWidth || 600,
        fontFamily: template.settings?.fontFamily || template.fontFamily || 'Arial, sans-serif'
      });
      
      if (template.components) {
        setComponents(template.components);
      } else if (template.htmlTemplate) {
        // Parse existing HTML template to components (simplified)
        parseHtmlToComponents(template.htmlTemplate);
      }
    }
  }, [template]);

  const parseHtmlToComponents = (html) => {
    // Simplified HTML to components parser
    // In a real implementation, you'd want a more sophisticated parser
    const tempComponents = [];
    
    // Look for common patterns and convert to components
    if (html.includes('Welcome to')) {
      tempComponents.push({
        id: Date.now() + 1,
        type: 'header',
        props: {
          title: 'Welcome to {{appName}}',
          backgroundColor: '#667eea',
          textColor: '#ffffff',
          alignment: 'center',
          padding: '40px 20px'
        }
      });
    }
    
    setComponents(tempComponents);
  };

  const addComponent = (type) => {
    const componentType = componentTypes.find(ct => ct.type === type);
    if (!componentType) return;

    const newComponent = {
      id: Date.now(),
      type,
      props: { ...componentType.defaultProps }
    };

    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent.id);
  };

  const updateComponent = (id, newProps) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, props: { ...comp.props, ...newProps } } : comp
    ));
  };

  const removeComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setComponents(items);
  };

  const addVariable = () => {
    const newVariable = {
      key: `variable${variables.length + 1}`,
      label: 'New Variable',
      defaultValue: 'Default Value'
    };
    setVariables([...variables, newVariable]);
  };

  const updateVariable = (index, field, value) => {
    const updatedVariables = variables.map((variable, i) => 
      i === index ? { ...variable, [field]: value } : variable
    );
    setVariables(updatedVariables);
  };

  const removeVariable = (index) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  // Function to replace variables with sample values for preview
  const replaceVariablesWithSamples = (text) => {
    if (!text) return text;
    let result = text;
    variables.forEach(variable => {
      const regex = new RegExp(`{{${variable.key}}}`, 'g');
      result = result.replace(regex, variable.defaultValue);
    });
    return result;
  };

  const generateHTML = (isPreview = false) => {
    const style = `
      <style>
        body { 
          font-family: ${templateSettings.fontFamily}; 
          margin: 0; 
          padding: 0; 
          background-color: ${templateSettings.backgroundColor}; 
          line-height: 1.6;
        }
        * {
          box-sizing: border-box;
        }
        .email-container { 
          max-width: ${templateSettings.containerWidth}px; 
          margin: 0 auto; 
          background-color: #ffffff; 
          font-size: 0;
          display: block;
        }
        .component { 
          margin: 0; 
          padding: 0; 
          font-size: 14px;
          line-height: 1.6; 
          display: block;
        }
        .header { 
          padding: 40px 20px; 
          text-align: center; 
          margin: 0; 
          display: block; 
          font-size: 14px;
          line-height: 1.4;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          line-height: 1.2;
          font-weight: bold;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 16px;
          line-height: 1.4;
        }
        .text-block { 
          padding: 20px; 
          margin: 0; 
          display: block; 
          font-size: 14px;
          line-height: 1.6;
        }
        .text-block p {
          margin: 0 0 16px 0;
          line-height: 1.6;
        }
        .button-container { 
          padding: 20px; 
          margin: 0; 
          display: block; 
          text-align: center;
        }
        .button { 
          display: inline-block; 
          text-decoration: none; 
          border-radius: 8px; 
          padding: 15px 30px; 
          font-weight: bold; 
          font-size: 16px;
          line-height: 1;
        }
        .image-container { 
          padding: 20px; 
          text-align: center; 
          margin: 0; 
          display: block; 
        }
        .divider { 
          margin: 20px 0; 
          display: block; 
        }
        .footer { 
          padding: 20px; 
          text-align: center; 
          font-size: 12px; 
          margin: 0; 
          display: block; 
          line-height: 1.6;
        }
      </style>
    `;

    const bodyComponents = components.map(component => {
      switch (component.type) {
        case 'header':
          const headerTitle = isPreview ? replaceVariablesWithSamples(component.props.title || 'Scan Me Maybe') : component.props.title || 'Scan Me Maybe';
          const headerSubtitle = isPreview ? replaceVariablesWithSamples(component.props.subtitle || '') : component.props.subtitle || '';
          return `
            <div class="header" style="background-color: ${component.props.backgroundColor}; color: ${component.props.textColor}; text-align: ${component.props.alignment}; padding: ${component.props.padding};">
              <h1 style="margin: 0; font-size: 32px; color: ${component.props.textColor};">${headerTitle}</h1>
              ${headerSubtitle ? `<p style="margin: 10px 0 0 0; color: ${component.props.textColor};">${isPreview ? headerSubtitle : headerSubtitle.replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;')}</p>` : ''}
            </div>
          `;
        case 'text':
        case 'paragraph':
          const textContent = isPreview ? replaceVariablesWithSamples(component.props.content) : component.props.content;
          return `
            <div class="text-block" style="background-color: ${component.props.backgroundColor}; color: ${component.props.textColor}; text-align: ${component.props.alignment}; padding: ${component.props.padding}; font-size: ${component.props.fontSize};">
              ${textContent.split('\n').map(line => `<p style="margin: 0 0 16px 0; color: ${component.props.textColor}; font-size: ${component.props.fontSize};">${isPreview ? line : line.replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;')}</p>`).join('')}
            </div>
          `;
        case 'button':
          const buttonText = isPreview ? replaceVariablesWithSamples(component.props.text) : component.props.text;
          const buttonUrl = isPreview ? replaceVariablesWithSamples(component.props.url) : component.props.url;
          return `
            <div class="button-container" style="background-color: ${component.props.sectionBackgroundColor || 'transparent'}; text-align: ${component.props.alignment}; padding: 20px;">
              <a href="${buttonUrl}" class="button" style="display: inline-block; background-color: ${component.props.backgroundColor}; color: ${component.props.textColor}; border-radius: ${component.props.borderRadius}; padding: ${component.props.padding}; text-decoration: none; font-weight: bold;">
                ${isPreview ? buttonText : buttonText.replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;')}
              </a>
            </div>
          `;
        case 'image':
          return `
            <div class="image-container" style="text-align: ${component.props.alignment}; padding: ${component.props.padding};">
              <img src="${component.props.src}" alt="${component.props.alt}" style="width: ${component.props.width}; height: auto;">
            </div>
          `;
        case 'divider':
          return `
            <div class="divider" style="height: ${component.props.height}; background-color: ${component.props.color}; margin: ${component.props.margin};"></div>
          `;
        case 'footer':
          const footerContent = isPreview ? replaceVariablesWithSamples(component.props.content) : component.props.content;
          const footerLines = isPreview ? footerContent : footerContent.replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;');
          return `
            <div class="footer" style="background-color: ${component.props.backgroundColor}; color: ${component.props.textColor}; text-align: ${component.props.alignment}; padding: ${component.props.padding}; font-size: ${component.props.fontSize};">
              ${footerLines.split('\n').map(line => `<p style="margin: 5px 0; color: ${component.props.textColor}; font-size: ${component.props.fontSize};">${line}</p>`).join('')}
            </div>
          `;
        default:
          return '';
      }
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        ${style}
      </head>
      <body>
        <div class="email-container">
          ${bodyComponents}
        </div>
      </body>
      </html>
    `;
  };

  const handleSave = () => {
    const templateData = {
      subject: templateSettings.subject,
      preheader: templateSettings.preheader,
      body: components.map(c => c.props.content || c.props.subtitle || '').join('\n\n'),
      html_template: generateHTML(),
      components: components,
      settings: templateSettings,
      variables: variables
    };
    
    console.log('EmailTemplateBuilder - Saving template with data:', templateData);
    onSave(templateData);
  };

  const handlePreview = () => {
    const html = generateHTML(true); // true for preview mode
    const previewSubject = replaceVariablesWithSamples(templateSettings.subject);
    onPreview(html, previewSubject);
  };

  const selectedComp = components.find(c => c.id === selectedComponent);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Components */}
      <div className="w-80 bg-white border-r border-gray-300 flex flex-col min-h-0">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Email Builder</h3>
        </div>
        
        {/* Template Settings */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Template Settings</h4>
            <button
              onClick={() => {
                // Add demo template
                const demoComponents = [
                  {
                    id: Date.now() + 1,
                    type: 'header',
                    props: {
                      title: 'Welcome to {{appName}}!',
                      subtitle: 'Your account is ready',
                      backgroundColor: '#667eea',
                      textColor: '#ffffff',
                      alignment: 'center',
                      padding: '40px 20px'
                    }
                  },
                  {
                    id: Date.now() + 2,
                    type: 'text',
                    props: {
                      content: 'Hello {{userName}},\n\nWelcome to {{appName}}! We\'re excited to have you join our community. Your account has been successfully created and you\'re ready to start connecting with others.\n\nTo get started, please complete your profile and upload your best photos.',
                      fontSize: '16px',
                      textColor: '#333333',
                      backgroundColor: 'transparent',
                      alignment: 'left',
                      padding: '20px'
                    }
                  },
                  {
                    id: Date.now() + 3,
                    type: 'button',
                    props: {
                      text: 'Complete Your Profile',
                      url: '{{editProfileUrl}}',
                      backgroundColor: '#4CAF50',
                      textColor: '#ffffff',
                      borderRadius: '8px',
                      padding: '15px 30px',
                      alignment: 'center'
                    }
                  },
                  {
                    id: Date.now() + 4,
                    type: 'footer',
                    props: {
                      content: '© {{currentYear}} {{appName}}. All rights reserved.\nIf you no longer wish to receive these emails, you can unsubscribe at any time.',
                      fontSize: '12px',
                      textColor: '#999999',
                      backgroundColor: '#f8f8f8',
                      alignment: 'center',
                      padding: '20px'
                    }
                  }
                ];
                setComponents(demoComponents);
                setTemplateSettings({
                  ...templateSettings,
                  subject: 'Welcome! Your account is ready - {{userEmail}}'
                });
              }}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
            >
              Demo
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Subject Line</label>
              <input
                type="text"
                value={templateSettings.subject}
                onChange={(e) => setTemplateSettings({...templateSettings, subject: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Email subject..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Preheader Text</label>
              <input
                type="text"
                value={templateSettings.preheader}
                onChange={(e) => setTemplateSettings({...templateSettings, preheader: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Preview text..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Background Color</label>
              <input
                type="color"
                value={templateSettings.backgroundColor}
                onChange={(e) => setTemplateSettings({...templateSettings, backgroundColor: e.target.value})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Components Palette */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h4 className="font-medium text-gray-700 mb-3">Components</h4>
          <div className="grid grid-cols-2 gap-2">
            {componentTypes.map((componentType) => (
              <button
                key={componentType.type}
                onClick={() => addComponent(componentType.type)}
                className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
              >
                <componentType.icon className="h-6 w-6 text-gray-600 mb-1" />
                <span className="text-xs text-gray-700">{componentType.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Variables Button */}
        <div className="flex-shrink-0">
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={() => setShowVariablesModal(true)}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <CodeBracketIcon className="h-4 w-4 mr-2" />
              Show Variables
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={handlePreview}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Preview
              </button>
              <button
                onClick={() => setShowCodeView(!showCodeView)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                <CodeBracketIcon className="h-4 w-4 mr-2" />
                {showCodeView ? 'Design View' : 'Code View'}
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: templateSettings.backgroundColor }}>
          {showCodeView ? (
            <div className="bg-white rounded-lg shadow-lg p-4">
              <textarea
                value={generateHTML()}
                readOnly
                className="w-full h-full font-mono text-sm border border-gray-300 rounded p-4"
                style={{ minHeight: '600px' }}
              />
            </div>
          ) : (
            <div className="flex justify-center min-h-full py-8">
              <div 
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                style={{ maxWidth: `${templateSettings.containerWidth}px`, width: '100%' }}
              >
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="email-components">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-96"
                      >
                        {components.length === 0 ? (
                          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg mx-4 my-8">
                            <RectangleStackIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500 text-lg mb-2">Start Building Your Email</p>
                            <p className="text-gray-400 text-sm">Drag components from the left panel to build your email template</p>
                          </div>
                        ) : (
                          components.map((component, index) => (
                            <Draggable
                              key={component.id}
                              draggableId={component.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`relative group transition-all duration-200 ${
                                    selectedComponent === component.id 
                                      ? 'border-2 border-blue-500 bg-blue-50' 
                                      : 'border-2 border-transparent hover:border-gray-300'
                                  } ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''} cursor-pointer`}
                                  onClick={() => setSelectedComponent(component.id)}
                                >
                                  {/* Component content would be rendered here based on type */}
                                  <div className="component">
                                    <ComponentRenderer component={component} variables={variables} />
                                  </div>
                                  
                                  {/* Component controls */}
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                                      {componentTypes.find(ct => ct.type === component.type)?.label}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeComponent(component.id);
                                      }}
                                      className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                  
                                  {/* Drag indicator */}
                                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-gray-600 text-white px-2 py-1 rounded text-xs">
                                      ⋮⋮ Drag
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-80 bg-white border-l border-gray-300 flex flex-col">
        {selectedComp ? (
          <div className="p-4 flex-1 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {componentTypes.find(ct => ct.type === selectedComp.type)?.label} Properties
            </h3>
            <ComponentProperties
              component={selectedComp}
              onUpdate={(props) => updateComponent(selectedComp.id, props)}
            />
          </div>
        ) : (
          <div className="p-4 flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <RectangleStackIcon className="h-12 w-12 mx-auto mb-2" />
              <p>Select a component to edit its properties</p>
            </div>
          </div>
        )}
      </div>

      {/* Variables Modal */}
      {showVariablesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                <CodeBracketIcon className="h-5 w-5 mr-2" />
                Available Variables
              </h3>
              <button
                onClick={() => setShowVariablesModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-lg font-medium text-gray-900">Working Variables</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  These variables are confirmed to work with your backend system. Copy and paste them into your email content.
                </p>
              </div>

              <div className="grid gap-4">
                {variables.map((variable) => (
                  <div key={variable.key} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">
                            {`{{${variable.key}}}`}
                          </code>
                          <span className="ml-2 text-sm font-medium text-gray-900">{variable.label}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{variable.description}</p>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Example output:</span> {variable.defaultValue}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`{{${variable.key}}}`);
                          // You could add a toast notification here
                        }}
                        className="ml-3 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        title="Copy to clipboard"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">How to Use Variables:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Wrap variable names in double curly braces: <code className="bg-blue-100 px-1 rounded">{`{{variableName}}`}</code></li>
                  <li>• Variables work in text content, button text, and email subjects</li>
                  <li>• Variables are replaced with actual values when emails are sent</li>
                  <li>• Use <code className="bg-blue-100 px-1 rounded">{`{{editProfileUrl}}`}</code> and <code className="bg-blue-100 px-1 rounded">{`{{checkoutUrl}}`}</code> for button links</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end border-t">
              <button
                onClick={() => setShowVariablesModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component renderer for preview
const ComponentRenderer = ({ component, variables = [] }) => {
  const { type, props } = component;

  // Function to replace variables with sample values for preview
  const replaceVariablesWithSamples = (text) => {
    if (!text) return text;
    let result = text;
    variables.forEach(variable => {
      const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');
      result = result.replace(regex, variable.defaultValue);
    });
    return result;
  };

  switch (type) {
    case 'header':
      return (
        <div 
          style={{
            backgroundColor: props.backgroundColor,
            color: props.textColor,
            textAlign: props.alignment,
            padding: props.padding,
            fontSize: '14px',
            lineHeight: '1.4'
          }}
        >
          <h1 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '32px', 
            lineHeight: '1.2', 
            fontWeight: 'bold' 
          }}>
            {replaceVariablesWithSamples(props.title || 'Scan Me Maybe')}
          </h1>
          {props.subtitle && (
            <p style={{ 
              margin: '10px 0 0 0', 
              fontSize: '16px', 
              lineHeight: '1.4' 
            }}>
              {replaceVariablesWithSamples(props.subtitle)}
            </p>
          )}
        </div>
      );
    case 'text':
    case 'paragraph':
      return (
        <div 
          style={{
            backgroundColor: props.backgroundColor,
            color: props.textColor,
            textAlign: props.alignment,
            padding: props.padding,
            fontSize: props.fontSize,
            lineHeight: '1.6'
          }}
        >
          {replaceVariablesWithSamples(props.content).split('\n').map((line, i) => (
            <p key={i} style={{ margin: '0 0 16px 0', lineHeight: '1.6' }}>{line}</p>
          ))}
        </div>
      );
    case 'button':
      return (
        <div style={{ backgroundColor: props.sectionBackgroundColor || 'transparent', textAlign: props.alignment, padding: '20px' }}>
          <a
            href="#"
            style={{
              display: 'inline-block',
              backgroundColor: props.backgroundColor,
              color: props.textColor,
              textDecoration: 'none',
              borderRadius: props.borderRadius,
              padding: props.padding,
              fontWeight: 'bold'
            }}
            onClick={(e) => e.preventDefault()}
          >
            {replaceVariablesWithSamples(props.text)}
          </a>
        </div>
      );
    case 'image':
      return (
        <div style={{ textAlign: props.alignment, padding: props.padding }}>
          {props.src ? (
            <img 
              src={props.src} 
              alt={props.alt} 
              style={{ width: props.width, height: 'auto' }}
            />
          ) : (
            <div 
              style={{ 
                width: props.width, 
                height: '200px', 
                backgroundColor: '#f0f0f0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '2px dashed #ccc'
              }}
            >
              <span style={{ color: '#999' }}>No image selected</span>
            </div>
          )}
        </div>
      );
    case 'divider':
      return (
        <div 
          style={{
            height: props.height,
            backgroundColor: props.color,
            margin: props.margin
          }}
        />
      );
    case 'footer':
      return (
        <div 
          style={{
            backgroundColor: props.backgroundColor,
            color: props.textColor,
            textAlign: props.alignment,
            padding: props.padding,
            fontSize: props.fontSize
          }}
        >
          {replaceVariablesWithSamples(props.content)}
        </div>
      );
    default:
      return <div>Unknown component type</div>;
  }
};

// Component properties panel
const ComponentProperties = ({ component, onUpdate }) => {
  const { type, props } = component;

  const handleChange = (key, value) => {
    onUpdate({ [key]: value });
  };

  const commonProps = (
    <>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Padding</label>
        <input
          type="text"
          value={props.padding || '20px'}
          onChange={(e) => handleChange('padding', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="20px"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Alignment</label>
        <select
          value={props.alignment || 'left'}
          onChange={(e) => handleChange('alignment', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Background Color</label>
        <input
          type="color"
          value={props.backgroundColor || '#ffffff'}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md"
        />
      </div>
    </>
  );

  switch (type) {
    case 'header':
      return (
        <div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              type="text"
              value={props.title || 'Scan Me Maybe'}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Enter header title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Subtitle</label>
            <input
              type="text"
              value={props.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Optional subtitle text"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Text Color</label>
            <input
              type="color"
              value={props.textColor || '#000000'}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          {commonProps}
        </div>
      );

    case 'text':
    case 'paragraph':
      return (
        <div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Body Text</label>
            <textarea
              value={props.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={8}
              placeholder="Enter your email content here...\n\nYou can use variables like:\n{{userName}} - User's name\n{{userEmail}} - User's email\n{{appName}} - App name\n{{currentYear}} - Current year"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Font Size</label>
            <select
              value={props.fontSize || '16px'}
              onChange={(e) => handleChange('fontSize', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="12px">12px - Small</option>
              <option value="14px">14px - Regular</option>
              <option value="16px">16px - Medium (recommended)</option>
              <option value="18px">18px - Large</option>
              <option value="20px">20px - X-Large</option>
              <option value="24px">24px - XX-Large</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Text Color</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={props.textColor || '#000000'}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={props.textColor || '#000000'}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
          {commonProps}
        </div>
      );

    case 'button':
      return (
        <div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Button Text</label>
            <input
              type="text"
              value={props.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Button URL</label>
            <div className="space-y-2">
              <select
                value={props.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Choose URL type...</option>
                <option value="{{editProfileUrl}}">Edit Profile URL</option>
                <option value="{{checkoutUrl}}">Checkout URL</option>
                <option value="custom">Custom URL</option>
              </select>
              {props.url === 'custom' && (
                <input
                  type="url"
                  placeholder="Enter custom URL"
                  onChange={(e) => handleChange('url', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              )}
              {props.url && props.url !== 'custom' && (
                <p className="text-xs text-gray-500">
                  This will use: <code className="bg-gray-100 px-1 rounded">{props.url}</code>
                </p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Button Color</label>
            <input
              type="color"
              value={props.backgroundColor || '#007bff'}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Text Color</label>
            <input
              type="color"
              value={props.textColor || '#ffffff'}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Border Radius</label>
            <input
              type="text"
              value={props.borderRadius || '8px'}
              onChange={(e) => handleChange('borderRadius', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Button Padding</label>
            <input
              type="text"
              value={props.padding || '15px 30px'}
              onChange={(e) => handleChange('padding', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="15px 30px"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Alignment</label>
            <select
              value={props.alignment || 'center'}
              onChange={(e) => handleChange('alignment', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Section Background Color</label>
            <input
              type="color"
              value={props.sectionBackgroundColor || '#ffffff'}
              onChange={(e) => handleChange('sectionBackgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      );

    case 'image':
      return (
        <div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Image URL</label>
            <input
              type="url"
              value={props.src || ''}
              onChange={(e) => handleChange('src', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Alt Text</label>
            <input
              type="text"
              value={props.alt || ''}
              onChange={(e) => handleChange('alt', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Width</label>
            <input
              type="text"
              value={props.width || '100%'}
              onChange={(e) => handleChange('width', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          {commonProps}
        </div>
      );

    case 'divider':
      return (
        <div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Height</label>
            <input
              type="text"
              value={props.height || '2px'}
              onChange={(e) => handleChange('height', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Color</label>
            <input
              type="color"
              value={props.color || '#e5e5e5'}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Margin</label>
            <input
              type="text"
              value={props.margin || '20px 0'}
              onChange={(e) => handleChange('margin', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      );

    case 'footer':
      return (
        <div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Content</label>
            <textarea
              value={props.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Font Size</label>
            <input
              type="text"
              value={props.fontSize || '12px'}
              onChange={(e) => handleChange('fontSize', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Text Color</label>
            <input
              type="color"
              value={props.textColor || '#666666'}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          {commonProps}
        </div>
      );

    default:
      return <div>No properties available</div>;
  }
};

export default EmailTemplateBuilder;