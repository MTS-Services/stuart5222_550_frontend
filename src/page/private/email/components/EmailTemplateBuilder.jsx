import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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
  XMarkIcon,
  SparklesIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const EmailTemplateBuilder = ({
  template = null,
  onSave,
  onPreview,
  onCancel,
  isLoading = false,
}) => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [templateSettings, setTemplateSettings] = useState({
    subject: "",
    preheader: "",
    backgroundColor: "#f4f4f4",
    containerWidth: 600,
    fontFamily: "Arial, sans-serif",
  });
  const [showCodeView, setShowCodeView] = useState(false);
  const [watermarkSettings, setWatermarkSettings] = useState({
    enabled: false,
    opacity: 0.15,
    logoUrl: "/img/assets/card.png",
    offsetY: 0,
    size: 300,
  });
  const [variables, setVariables] = useState([
    {
      key: "currentYear",
      label: "Current Year",
      defaultValue: "2025",
      description: "Current year (auto-generated)",
    },
    {
      key: "appName",
      label: "App Name",
      defaultValue: "Scan Me Maybe",
      description: "Application name",
    },
    {
      key: "userName",
      label: "User Name",
      defaultValue: "John Doe",
      description: "User's full name",
    },
    {
      key: "userEmail",
      label: "User Email",
      defaultValue: "user@example.com",
      description: "Recipient email address",
    },
    {
      key: "email",
      label: "Email (alias)",
      defaultValue: "user@example.com",
      description: "Same as userEmail",
    },
    {
      key: "subject",
      label: "Email Subject",
      defaultValue: "Welcome Message",
      description: "Template subject line",
    },
    {
      key: "body",
      label: "Email Body",
      defaultValue: "Email body content",
      description: "Template body content",
    },
    {
      key: "editProfileUrl",
      label: "Edit Profile URL",
      defaultValue: "/profile/edit/user@example.com",
      description: "Link to edit profile page",
    },
    {
      key: "checkoutUrl",
      label: "Checkout URL",
      defaultValue: "/checkout/user@example.com",
      description: "Link to complete profile",
    },
    {
      key: "resetPasswordUrl",
      label: "Reset Password URL",
      defaultValue:
        "/auth/set-password?email={{userEmail}}&token={{resetToken}}",
      description:
        "Link to reset password page with user email and reset token",
    },
    {
      key: "resetToken",
      label: "Reset Token",
      defaultValue: "sample-reset-token-123",
      description: "Secure token for password reset verification",
    },
    {
      key: "rejectionReason",
      label: "Rejection Reason",
      defaultValue: "Your profile does not meet our requirements",
      description: "Reason for profile or registration rejection",
    },
    {
      key: "dashboardUrl",
      label: "Dashboard URL",
      defaultValue: "/dashboard",
      description: "Link to user dashboard",
    },
  ]);
  const [showVariablesModal, setShowVariablesModal] = useState(false);

  // Component types available in the builder
  const componentTypes = [
    {
      type: "logo",
      icon: SparklesIcon,
      label: "Logo",
      defaultProps: {
        src: "/img/assets/logo.png",
        alt: "Scan Me Maybe",
        width: "160px",
        height: "",
        maxWidth: "100%",
        objectFit: "contain",
        alignment: "center",
        padding: "30px 20px",
        backgroundColor: "transparent",
      },
    },
    {
      type: "header",
      icon: RectangleStackIcon,
      label: "Header",
      defaultProps: {
        showLogo: true,
        logoSrc: "/img/assets/logo.png",
        logoWidth: "120px",
        logoHeight: "",
        logoPosition: "top",
        title: "Scan Me Maybe",
        subtitle: "Welcome to our platform",
        backgroundColor: "#667eea",
        textColor: "#ffffff",
        alignment: "center",
        padding: "40px 20px",
      },
    },
    {
      type: "text",
      icon: ChatBubbleLeftIcon,
      label: "Body Text",
      defaultProps: {
        content:
          "Hello {{userEmail}},\n\nThis is your main email body content. You can write your message here and use variables like {{checkoutUrl}} and {{currentYear}}.\n\nBest regards,\nThe Scan Me Maybe Team",
        fontSize: "16px",
        textColor: "#333333",
        backgroundColor: "transparent",
        alignment: "left",
        padding: "20px",
      },
    },
    {
      type: "paragraph",
      icon: ChatBubbleLeftIcon,
      label: "Paragraph",
      defaultProps: {
        content:
          "Add a paragraph of text here. Perfect for additional information, disclaimers, or secondary messages.",
        fontSize: "14px",
        textColor: "#666666",
        backgroundColor: "transparent",
        alignment: "left",
        padding: "10px 20px",
      },
    },
    {
      type: "button",
      icon: LinkIcon,
      label: "Button",
      defaultProps: {
        text: "Click Here",
        url: "https://example.com",
        backgroundColor: "#667eea",
        textColor: "#ffffff",
        borderRadius: "8px",
        padding: "15px 30px",
        alignment: "center",
      },
    },
    {
      type: "divider",
      icon: SwatchIcon,
      label: "Divider",
      defaultProps: {
        height: "2px",
        color: "#e5e5e5",
        margin: "20px 0",
      },
    },
    {
      type: "footer",
      icon: RectangleStackIcon,
      label: "Footer",
      defaultProps: {
        showLogo: false,
        logoSrc: "/img/assets/logo.png",
        logoWidth: "80px",
        logoHeight: "auto",
        content: "© {{currentYear}} {{appName}}. All rights reserved.",
        fontSize: "12px",
        textColor: "#666666",
        backgroundColor: "#f8f8f8",
        alignment: "center",
        padding: "20px",
      },
    },
  ];

  // Load template data if editing
  useEffect(() => {
    if (template) {
      setTemplateSettings({
        subject: template.subject || "",
        preheader: template.preheader || "",
        backgroundColor:
          template.settings?.backgroundColor ||
          template.backgroundColor ||
          "#f4f4f4",
        containerWidth:
          template.settings?.containerWidth || template.containerWidth || 600,
        fontFamily:
          template.settings?.fontFamily ||
          template.fontFamily ||
          "Arial, sans-serif",
      });

      if (template.watermarkSettings) {
        setWatermarkSettings(template.watermarkSettings);
      } else if (template.settings?.watermarkSettings) {
        setWatermarkSettings(template.settings.watermarkSettings);
      }

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
    if (html.includes("Welcome to")) {
      tempComponents.push({
        id: Date.now() + 1,
        type: "header",
        props: {
          title: "Welcome to {{appName}}",
          backgroundColor: "#667eea",
          textColor: "#ffffff",
          alignment: "center",
          padding: "40px 20px",
        },
      });
    }

    setComponents(tempComponents);
  };

  const addComponent = (type) => {
    const componentType = componentTypes.find((ct) => ct.type === type);
    if (!componentType) return;

    const newComponent = {
      id: Date.now(),
      type,
      props: { ...componentType.defaultProps },
    };

    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent.id);
  };

  const updateComponent = (id, newProps) => {
    setComponents(
      components.map((comp) =>
        comp.id === id
          ? { ...comp, props: { ...comp.props, ...newProps } }
          : comp,
      ),
    );
  };

  const removeComponent = (id) => {
    setComponents(components.filter((comp) => comp.id !== id));
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
      label: "New Variable",
      defaultValue: "Default Value",
    };
    setVariables([...variables, newVariable]);
  };

  const updateVariable = (index, field, value) => {
    const updatedVariables = variables.map((variable, i) =>
      i === index ? { ...variable, [field]: value } : variable,
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
    variables.forEach((variable) => {
      const regex = new RegExp(`{{${variable.key}}}`, "g");
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

    const watermarkEnabled = watermarkSettings.enabled;
    const watermarkImgUrl = watermarkSettings.logoUrl;
    const watermarkOpacity = watermarkSettings.opacity;
    const watermarkSize = watermarkSettings.size;
    const watermarkOffsetY = watermarkSettings.offsetY;

    const bodyComponents = components
      .map((component) => {
        switch (component.type) {
          case "logo":
            return `
            <div style="text-align: ${component.props.alignment}; padding: ${component.props.padding}; background-color: ${component.props.backgroundColor};">
              <img src="${component.props.src}" alt="${component.props.alt}" style="width: ${component.props.width}; height: ${component.props.height || "auto"}; max-width: ${component.props.maxWidth || "100%"}; object-fit: ${component.props.objectFit || "contain"}; display: inline-block; vertical-align: middle;" />
            </div>
          `;
          case "header":
            const headerTitle = isPreview
              ? replaceVariablesWithSamples(
                  component.props.title || "Scan Me Maybe",
                )
              : component.props.title || "Scan Me Maybe";
            const headerSubtitle = isPreview
              ? replaceVariablesWithSamples(component.props.subtitle || "")
              : component.props.subtitle || "";
            const headerLogoHtml = component.props.showLogo && component.props.logoSrc
              ? `<img src="${component.props.logoSrc}" alt="Logo" style="width: ${component.props.logoWidth || "120px"}; height: ${component.props.logoHeight || "auto"}; display: inline-block; margin-${component.props.logoPosition === "bottom" ? "top" : "bottom"}: 15px;" />`
              : "";
            const headerTextHtml = `<h1 style="margin: 0; font-size: 32px; color: ${component.props.textColor};">${headerTitle}</h1>
              ${headerSubtitle ? `<p style="margin: 10px 0 0 0; color: ${component.props.textColor};">${isPreview ? headerSubtitle : headerSubtitle.replace(/\{\{/g, "&#123;&#123;").replace(/\}\}/g, "&#125;&#125;")}</p>` : ""}`;
            const isLogoBottom = component.props.logoPosition === "bottom";
            return `
            <div class="header" style="background-color: ${component.props.backgroundColor}; color: ${component.props.textColor}; text-align: ${component.props.alignment}; padding: ${component.props.padding};">
              ${isLogoBottom ? headerTextHtml : headerLogoHtml}
              ${isLogoBottom ? headerLogoHtml : headerTextHtml}
            </div>
          `;
          case "text":
          case "paragraph":
            const textContent = isPreview
              ? replaceVariablesWithSamples(component.props.content)
              : component.props.content;
            return `
            <div class="text-block" style="background-color: ${component.props.backgroundColor}; color: ${component.props.textColor}; text-align: ${component.props.alignment}; padding: ${component.props.padding}; font-size: ${component.props.fontSize};">
              ${textContent
                .split("\n")
                .map(
                  (line) =>
                    `<p style="margin: 0 0 16px 0; color: ${component.props.textColor}; font-size: ${component.props.fontSize};">${isPreview ? line : line.replace(/\{\{/g, "&#123;&#123;").replace(/\}\}/g, "&#125;&#125;")}</p>`,
                )
                .join("")}
            </div>
          `;
          case "button":
            const buttonText = isPreview
              ? replaceVariablesWithSamples(component.props.text)
              : component.props.text;
            const buttonUrl = isPreview
              ? replaceVariablesWithSamples(component.props.url)
              : component.props.url;
            return `
            <div class="button-container" style="background-color: ${component.props.sectionBackgroundColor || "transparent"}; text-align: ${component.props.alignment}; padding: 20px;">
              <a href="${buttonUrl}" class="button" style="display: inline-block; background-color: ${component.props.backgroundColor}; color: ${component.props.textColor}; border-radius: ${component.props.borderRadius}; padding: ${component.props.padding}; text-decoration: none; font-weight: bold;">
                ${isPreview ? buttonText : buttonText.replace(/\{\{/g, "&#123;&#123;").replace(/\}\}/g, "&#125;&#125;")}
              </a>
            </div>
          `;
          case "image":
            return `
            <div class="image-container" style="text-align: ${component.props.alignment}; padding: ${component.props.padding};">
              <img src="${component.props.src}" alt="${component.props.alt}" style="width: ${component.props.width}; height: auto;">
            </div>
          `;
          case "divider":
            return `
            <div class="divider" style="height: ${component.props.height}; background-color: ${component.props.color}; margin: ${component.props.margin};"></div>
          `;
          case "footer":
            const footerContent = isPreview
              ? replaceVariablesWithSamples(component.props.content)
              : component.props.content;
            const footerLines = isPreview
              ? footerContent
              : footerContent
                  .replace(/\{\{/g, "&#123;&#123;")
                  .replace(/\}\}/g, "&#125;&#125;");
            const footerLogoHtml = component.props.showLogo && component.props.logoSrc
              ? `<img src="${component.props.logoSrc}" alt="Logo" style="width: ${component.props.logoWidth || "80px"}; height: ${component.props.logoHeight || "auto"}; display: inline-block; margin-bottom: 10px;" /><br/>`
              : "";
            return `
            <div class="footer" style="background-color: ${component.props.backgroundColor}; color: ${component.props.textColor}; text-align: ${component.props.alignment}; padding: ${component.props.padding}; font-size: ${component.props.fontSize};">
              ${footerLogoHtml}
              ${footerLines
                .split("\n")
                .map(
                  (line) =>
                    `<p style="margin: 5px 0; color: ${component.props.textColor}; font-size: ${component.props.fontSize};">${line}</p>`,
                )
                .join("")}
            </div>
          `;
          default:
            return "";
        }
      })
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${style}
      </head>
      <body style="font-family: ${templateSettings.fontFamily}; margin: 0; padding: 0; line-height: 1.6;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${templateSettings.backgroundColor}; margin: 0; padding: 0;">
          <tr>
            <td align="center" style="padding: 0;">
              <div class="email-container" style="max-width: ${templateSettings.containerWidth}px; margin: 0 auto; background-color: #ffffff; font-size: 0; display: block; position: relative; overflow: visible;">
                ${bodyComponents}
                ${watermarkEnabled ? `<!--[if gte mso 9]>
                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="position:absolute;width:${templateSettings.containerWidth}px;height:600px;top:${watermarkOffsetY}px;left:0;">
                  <v:fill type="frame" src="${watermarkImgUrl}" />
                </v:rect>
                <![endif]-->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9998;">
                  <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="height: 100%;">
                    <tr>
                      <td align="center" valign="middle" style="padding-top: ${watermarkOffsetY}px;">
                        <img src="${watermarkImgUrl}" alt="" width="${watermarkSize}" style="opacity: ${watermarkOpacity}; width: ${watermarkSize}px; max-width: 80%; height: auto; display: block;" />
                      </td>
                    </tr>
                  </table>
                </div>` : ''}
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

  const handleSave = () => {
    const templateData = {
      subject: templateSettings.subject,
      preheader: templateSettings.preheader,
      body: components
        .map((c) => c.props.content || c.props.subtitle || "")
        .join("\n\n"),
      html_template: generateHTML(),
      components: components,
      settings: { ...templateSettings, watermarkSettings: watermarkSettings },
      variables: variables,
    };

    onSave(templateData);
  };

  const handlePreview = () => {
    const html = generateHTML(true); // true for preview mode
    const previewSubject = replaceVariablesWithSamples(
      templateSettings.subject,
    );
    onPreview(html, previewSubject);
  };

  const selectedComp = components.find((c) => c.id === selectedComponent);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Components */}
      <div className="flex min-h-0 w-80 flex-col overflow-y-auto border-l border-r border-gray-300 bg-white">
        <div className="border-gray-200 p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Template Builder
          </h3>
        </div>
        <hr className="mt-[14px]" />
        {/* Template Settings */}
        <div className="flex-shrink-0 border-b border-gray-200 p-4">
          <div className="space-y-3 font-raleway">
            <div>
              <label className="mb-1 block font-raleway text-sm text-gray-600">
                Subject Line
              </label>
              <input
                type="text"
                value={templateSettings.subject}
                onChange={(e) =>
                  setTemplateSettings({
                    ...templateSettings,
                    subject: e.target.value,
                  })
                }
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                placeholder="Email subject..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Preheader Text
              </label>
              <input
                type="text"
                value={templateSettings.preheader}
                onChange={(e) =>
                  setTemplateSettings({
                    ...templateSettings,
                    preheader: e.target.value,
                  })
                }
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                placeholder="Preview text..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Background Color
              </label>
              <input
                type="color"
                value={templateSettings.backgroundColor}
                onChange={(e) =>
                  setTemplateSettings({
                    ...templateSettings,
                    backgroundColor: e.target.value,
                  })
                }
                className="h-10 w-full rounded-md border border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Components Palette */}
        <div className="flex-shrink-0 border-b border-gray-200 p-4">
          <h4 className="mb-3 font-medium text-gray-700">Components</h4>
          <div className="grid grid-cols-2 gap-2">
            {componentTypes.map((componentType) => (
              <button
                key={componentType.type}
                onClick={() => addComponent(componentType.type)}
                className="flex flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-blue-300 hover:bg-gray-50"
              >
                <componentType.icon className="mb-1 h-6 w-6 text-gray-600" />
                <span className="text-xs text-gray-700">
                  {componentType.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Watermark Settings */}
        <div className="flex-shrink-0 border-b border-gray-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-gray-700">Watermark</h4>
            <button
              onClick={() =>
                setWatermarkSettings({
                  ...watermarkSettings,
                  enabled: !watermarkSettings.enabled,
                })
              }
              className={`flex items-center rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                watermarkSettings.enabled
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {watermarkSettings.enabled ? (
                <>
                  <EyeIcon className="mr-1 h-3.5 w-3.5" />
                  On
                </>
              ) : (
                <>
                  <EyeSlashIcon className="mr-1 h-3.5 w-3.5" />
                  Off
                </>
              )}
            </button>
          </div>
          {watermarkSettings.enabled && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 flex items-center justify-between text-sm text-gray-600">
                  <span>Opacity</span>
                  <span className="font-mono text-xs text-gray-400">
                    {watermarkSettings.opacity}
                  </span>
                </label>
                <input
                  type="range"
                  min="0.03"
                  max="0.5"
                  step="0.01"
                  value={watermarkSettings.opacity}
                  onChange={(e) =>
                    setWatermarkSettings({
                      ...watermarkSettings,
                      opacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-orange-600"
                />
                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>Subtle (0.03)</span>
                  <span>Strong (0.5)</span>
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center justify-between text-sm text-gray-600">
                  <span>Size</span>
                  <span className="font-mono text-xs text-gray-400">
                    {watermarkSettings.size}px
                  </span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="10"
                  value={watermarkSettings.size}
                  onChange={(e) =>
                    setWatermarkSettings({
                      ...watermarkSettings,
                      size: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-orange-600"
                />
                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>Small (50px)</span>
                  <span>Large (600px)</span>
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center justify-between text-sm text-gray-600">
                  <span>Vertical Position</span>
                  <span className="font-mono text-xs text-gray-400">
                    {watermarkSettings.offsetY}px
                  </span>
                </label>
                <input
                  type="range"
                  min="-400"
                  max="400"
                  step="10"
                  value={watermarkSettings.offsetY}
                  onChange={(e) =>
                    setWatermarkSettings({
                      ...watermarkSettings,
                      offsetY: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-orange-600"
                />
                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>Up (-400px)</span>
                  <span>Center (0)</span>
                  <span>Down (+400px)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Variables Button */}
        <div className="flex-shrink-0">
          <div className="border-b border-gray-200 p-3">
            <button
              onClick={() => setShowVariablesModal(true)}
              className="flex w-full items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
            >
              <CodeBracketIcon className="mr-2 h-4 w-4" />
              Show Variables
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex flex-1 flex-col">
        {/* Top Toolbar */}
        <div className="border-b border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={handlePreview}
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                Preview
              </button>
              <button
                onClick={() => setShowCodeView(!showCodeView)}
                className="flex items-center rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                <CodeBracketIcon className="mr-2 h-4 w-4" />
                {showCodeView ? "HTML Format" : "Code"}
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
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Content */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: templateSettings.backgroundColor }}
        >
          {showCodeView ? (
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <textarea
                value={generateHTML()}
                readOnly
                className="h-full w-full rounded border border-gray-300 p-4 font-mono text-sm"
                style={{ minHeight: "600px" }}
              />
            </div>
          ) : (
            <div className="flex min-h-full items-start justify-center py-8">
              <div
                className="relative rounded-lg bg-white shadow-lg"
                style={{
                  maxWidth: `${templateSettings.containerWidth}px`,
                  width: "100%",
                }}
              >
                {/* Watermark overlay in canvas preview */}
                {watermarkSettings.enabled && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ zIndex: 9998 }}
                  >
                    <img
                      src={watermarkSettings.logoUrl}
                      alt=""
                      style={{
                        position: "absolute",
                        top: `calc(50% + ${watermarkSettings.offsetY}px)`,
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        opacity: watermarkSettings.opacity,
                        width: watermarkSettings.size + "px",
                        maxWidth: "80%",
                        height: "auto",
                      }}
                    />
                  </div>
                )}
                <div style={{ position: "relative", zIndex: 1 }}>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="email-components">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-96"
                      >
                        {components.length === 0 ? (
                          <div className="mx-4 my-8 rounded-lg border-2 border-dashed border-gray-300 py-20 text-center">
                            <RectangleStackIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <p className="mb-2 text-lg text-gray-500">
                              Start Building Your Email
                            </p>
                            <p className="text-sm text-gray-400">
                              Drag components from the left panel to build your
                              email template
                            </p>
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
                                  className={`group relative transition-all duration-200 ${
                                    selectedComponent === component.id
                                      ? "border-2 border-blue-500 bg-blue-50"
                                      : "border-2 border-transparent hover:border-gray-300"
                                  } ${snapshot.isDragging ? "rotate-2 shadow-lg" : ""} cursor-pointer`}
                                  onClick={() =>
                                    setSelectedComponent(component.id)
                                  }
                                >
                                  {/* Component content would be rendered here based on type */}
                                  <div className="component">
                                    <ComponentRenderer
                                      component={component}
                                      variables={variables}
                                    />
                                  </div>

                                  {/* Component controls */}
                                  <div className="absolute right-2 top-2 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                                      {
                                        componentTypes.find(
                                          (ct) => ct.type === component.type,
                                        )?.label
                                      }
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeComponent(component.id);
                                      }}
                                      className="rounded bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>

                                  {/* Drag indicator */}
                                  <div className="absolute left-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="rounded bg-gray-600 px-2 py-1 text-xs text-white">
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
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="flex w-80 flex-col border-l border-gray-300 bg-white">
        {selectedComp ? (
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              {
                componentTypes.find((ct) => ct.type === selectedComp.type)
                  ?.label
              }{" "}
              Properties
            </h3>
            <ComponentProperties
              component={selectedComp}
              onUpdate={(props) => updateComponent(selectedComp.id, props)}
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="text-center text-gray-500">
              <RectangleStackIcon className="mx-auto mb-2 h-12 w-12" />
              <p>Select a component to edit its properties</p>
            </div>
          </div>
        )}
      </div>

      {/* Variables Modal */}
      {showVariablesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between bg-green-600 px-6 py-4 text-white">
              <h3 className="flex items-center text-lg font-semibold">
                <CodeBracketIcon className="mr-2 h-5 w-5" />
                Available Variables
              </h3>
              <button
                onClick={() => setShowVariablesModal(false)}
                className="text-white transition-colors hover:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="mb-4">
                <div className="mb-3 flex items-center">
                  <CheckIcon className="mr-2 h-5 w-5 text-green-600" />
                  <span className="text-lg font-medium text-gray-900">
                    Working Variables
                  </span>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  These variables are confirmed to work with your backend
                  system. Copy and paste them into your email content.
                </p>
              </div>

              <div className="grid gap-4">
                {variables.map((variable) => (
                  <div
                    key={variable.key}
                    className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-green-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center">
                          <code className="rounded bg-green-100 px-2 py-1 font-mono text-sm text-green-800">
                            {`{{${variable.key}}}`}
                          </code>
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {variable.label}
                          </span>
                        </div>
                        <p className="mb-2 text-sm text-gray-600">
                          {variable.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Example output:</span>{" "}
                          {variable.defaultValue}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`{{${variable.key}}}`);
                          // You could add a toast notification here
                        }}
                        className="ml-3 rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200"
                        title="Copy to clipboard"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-blue-900">
                  How to Use Variables:
                </h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>
                    • Wrap variable names in double curly braces:{" "}
                    <code className="rounded bg-blue-100 px-1">{`{{variableName}}`}</code>
                  </li>
                  <li>
                    • Variables work in text content, button text, and email
                    subjects
                  </li>
                  <li>
                    • Variables are replaced with actual values when emails are
                    sent
                  </li>
                  <li>
                    • Use{" "}
                    <code className="rounded bg-blue-100 px-1">{`{{editProfileUrl}}`}</code>{" "}
                    and{" "}
                    <code className="rounded bg-blue-100 px-1">{`{{checkoutUrl}}`}</code>{" "}
                    for button links
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end border-t bg-gray-50 px-6 py-3">
              <button
                onClick={() => setShowVariablesModal(false)}
                className="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
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
    variables.forEach((variable) => {
      const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, "g");
      result = result.replace(regex, variable.defaultValue);
    });
    return result;
  };

  switch (type) {
    case "logo":
      return (
        <div
          style={{
            textAlign: props.alignment,
            padding: props.padding,
            backgroundColor: props.backgroundColor,
          }}
        >
          <img
            src={props.src}
            alt={props.alt}
            style={{
              width: props.width,
              height: props.height || "auto",
              maxWidth: props.maxWidth || "100%",
              objectFit: props.objectFit || "contain",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
        </div>
      );
    case "header": {
      const isBottom = props.logoPosition === "bottom";
      const logoEl = props.showLogo && props.logoSrc ? (
        <img
          src={props.logoSrc}
          alt="Logo"
          style={{
            width: props.logoWidth || "120px",
            height: props.logoHeight || "auto",
            display: "inline-block",
            ...(isBottom ? { marginTop: "15px" } : { marginBottom: "15px" }),
          }}
        />
      ) : null;
      const textEl = (
        <>
          <h1
            style={{
              margin: "0 0 10px 0",
              fontSize: "32px",
              lineHeight: "1.2",
              fontWeight: "bold",
            }}
          >
            {replaceVariablesWithSamples(props.title || "Scan Me Maybe")}
          </h1>
          {props.subtitle && (
            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: "16px",
                lineHeight: "1.4",
              }}
            >
              {replaceVariablesWithSamples(props.subtitle)}
            </p>
          )}
        </>
      );
      return (
        <div
          style={{
            backgroundColor: props.backgroundColor,
            color: props.textColor,
            textAlign: props.alignment,
            padding: props.padding,
            fontSize: "14px",
            lineHeight: "1.4",
          }}
        >
          {isBottom ? textEl : logoEl}
          {isBottom ? logoEl : textEl}
        </div>
      );
    }
    case "text":
    case "paragraph":
      return (
        <div
          style={{
            backgroundColor: props.backgroundColor,
            color: props.textColor,
            textAlign: props.alignment,
            padding: props.padding,
            fontSize: props.fontSize,
            lineHeight: "1.6",
          }}
        >
          {replaceVariablesWithSamples(props.content)
            .split("\n")
            .map((line, i) => (
              <p key={i} style={{ margin: "0 0 16px 0", lineHeight: "1.6" }}>
                {line}
              </p>
            ))}
        </div>
      );
    case "button":
      return (
        <div
          style={{
            backgroundColor: props.sectionBackgroundColor || "transparent",
            textAlign: props.alignment,
            padding: "20px",
          }}
        >
          <a
            href="#"
            style={{
              display: "inline-block",
              backgroundColor: props.backgroundColor,
              color: props.textColor,
              textDecoration: "none",
              borderRadius: props.borderRadius,
              padding: props.padding,
              fontWeight: "bold",
            }}
            onClick={(e) => e.preventDefault()}
          >
            {replaceVariablesWithSamples(props.text)}
          </a>
        </div>
      );
    case "image":
      return (
        <div style={{ textAlign: props.alignment, padding: props.padding }}>
          {props.src ? (
            <img
              src={props.src}
              alt={props.alt}
              style={{ width: props.width, height: "auto" }}
            />
          ) : (
            <div
              style={{
                width: props.width,
                height: "200px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #ccc",
              }}
            >
              <span style={{ color: "#999" }}>No image selected</span>
            </div>
          )}
        </div>
      );
    case "divider":
      return (
        <div
          style={{
            height: props.height,
            backgroundColor: props.color,
            margin: props.margin,
          }}
        />
      );
    case "footer":
      return (
        <div
          style={{
            backgroundColor: props.backgroundColor,
            color: props.textColor,
            textAlign: props.alignment,
            padding: props.padding,
            fontSize: props.fontSize,
          }}
        >
          {props.showLogo && props.logoSrc && (
            <img
              src={props.logoSrc}
              alt="Logo"
              style={{
                width: props.logoWidth || "80px",
                height: props.logoHeight || "auto",
                display: "inline-block",
                marginBottom: "10px",
              }}
            />
          )}
          <div>{replaceVariablesWithSamples(props.content)}</div>
        </div>
      );
    default:
      return <div>Unknown component type</div>;
  }
};

// Helper to parse CSS padding shorthand into top/right/bottom/left parts
const parsePadding = (paddingStr = "") => {
  const parts = String(paddingStr).trim().split(/\s+/).filter(Boolean);
  switch (parts.length) {
    case 1: return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    case 2: return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    case 3: return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    case 4: return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    default: return { top: "20px", right: "20px", bottom: "20px", left: "20px" };
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
        <label className="mb-1 block text-sm text-gray-600">Padding</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Top</label>
            <input
              type="text"
              value={parsePadding(props.padding).top}
              onChange={(e) => {
                const p = parsePadding(props.padding);
                handleChange("padding", `${e.target.value} ${p.right} ${p.bottom} ${p.left}`);
              }}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              placeholder="20px"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Bottom</label>
            <input
              type="text"
              value={parsePadding(props.padding).bottom}
              onChange={(e) => {
                const p = parsePadding(props.padding);
                handleChange("padding", `${p.top} ${p.right} ${e.target.value} ${p.left}`);
              }}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              placeholder="20px"
            />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm text-gray-600">Alignment</label>
        <select
          value={props.alignment || "left"}
          onChange={(e) => handleChange("alignment", e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm text-gray-600">
          Background Color
        </label>
        <input
          type="color"
          value={props.backgroundColor || "#ffffff"}
          onChange={(e) => handleChange("backgroundColor", e.target.value)}
          className="h-10 w-full rounded-md border border-gray-300"
        />
      </div>
    </>
  );

  switch (type) {
    case "logo":
      return (
        <div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Logo Preview
            </label>
            <div className="flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 p-4">
              <img
                src={props.src || "/img/assets/logo.png"}
                alt={props.alt}
                style={{
                  width: props.width,
                  height: props.height || "auto",
                  maxWidth: props.maxWidth || "100%",
                  objectFit: props.objectFit || "contain",
                }}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Width</label>
            <input
              type="text"
              value={props.width ?? "160px"}
              onChange={(e) => handleChange("width", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              placeholder="160px, 50%, auto"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Height</label>
            <input
              type="text"
              value={props.height ?? ""}
              onChange={(e) => handleChange("height", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              placeholder="auto, 80px, 100px"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Max Width
            </label>
            <input
              type="text"
              value={props.maxWidth || "100%"}
              onChange={(e) => handleChange("maxWidth", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              placeholder="100%, 300px"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Object Fit
            </label>
            <select
              value={props.objectFit || "contain"}
              onChange={(e) => handleChange("objectFit", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="contain">Contain</option>
              <option value="cover">Cover</option>
              <option value="fill">Fill</option>
              <option value="none">None</option>
              <option value="scale-down">Scale Down</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Alt Text</label>
            <input
              type="text"
              value={props.alt || ""}
              onChange={(e) => handleChange("alt", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              placeholder="Logo alt text"
            />
          </div>
          {commonProps}
        </div>
      );
    case "header":
      return (
        <div>
          {/* Header Logo Settings */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Header Logo
              </label>
              <button
                onClick={() => handleChange("showLogo", !props.showLogo)}
                className={`rounded px-2 py-1 text-xs font-medium ${
                  props.showLogo
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {props.showLogo ? "On" : "Off"}
              </button>
            </div>
            {props.showLogo && (
              <div className="space-y-2">
                <div className="flex items-center justify-center rounded border border-gray-200 bg-white p-2">
                  <img
                    src={props.logoSrc || "/img/assets/logo.png"}
                    alt="Logo"
                    style={{
                      width: props.logoWidth || "120px",
                      height: props.logoHeight || "auto",
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Logo Width
                  </label>
                  <input
                    type="text"
                    value={props.logoWidth ?? "120px"}
                    onChange={(e) => handleChange("logoWidth", e.target.value)}
                    className="w-full rounded border border-gray-300 p-1.5 text-sm"
                    placeholder="120px"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Logo Height
                  </label>
                  <input
                    type="text"
                    value={props.logoHeight ?? ""}
                    onChange={(e) => handleChange("logoHeight", e.target.value)}
                    className="w-full rounded border border-gray-300 p-1.5 text-sm"
                    placeholder="auto, 60px, 80px"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Logo Position
                  </label>
                  <select
                    value={props.logoPosition || "top"}
                    onChange={(e) => handleChange("logoPosition", e.target.value)}
                    className="w-full rounded border border-gray-300 p-1.5 text-sm"
                  >
                    <option value="top">Above Title</option>
                    <option value="bottom">Below Title</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Title</label>
            <input
              type="text"
              value={props.title || "Scan Me Maybe"}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              placeholder="Enter header title"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Subtitle</label>
            <input
              type="text"
              value={props.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              placeholder="Optional subtitle text"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Text Color
            </label>
            <input
              type="color"
              value={props.textColor || "#000000"}
              onChange={(e) => handleChange("textColor", e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300"
            />
          </div>
          {commonProps}
        </div>
      );

    case "text":
    case "paragraph":
      return (
        <div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Body Text
            </label>
            <textarea
              value={props.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              rows={8}
              placeholder="Enter your email content here...\n\nYou can use variables like:\n{{userName}} - User's name\n{{userEmail}} - User's email\n{{appName}} - App name\n{{currentYear}} - Current year"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Font Size
            </label>
            <select
              value={props.fontSize || "16px"}
              onChange={(e) => handleChange("fontSize", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
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
            <label className="mb-1 block text-sm text-gray-600">
              Text Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={props.textColor || "#000000"}
                onChange={(e) => handleChange("textColor", e.target.value)}
                className="h-10 w-12 rounded-md border border-gray-300"
              />
              <input
                type="text"
                value={props.textColor || "#000000"}
                onChange={(e) => handleChange("textColor", e.target.value)}
                className="flex-1 rounded-md border border-gray-300 p-2 text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
          {commonProps}
        </div>
      );

    case "button":
      return (
        <div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Button Text
            </label>
            <input
              type="text"
              value={props.text || ""}
              onChange={(e) => handleChange("text", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Button URL
            </label>
            <div className="space-y-2">
              <select
                value={props.url || ""}
                onChange={(e) => handleChange("url", e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
              >
                <option value="">Choose URL type...</option>
                <option value="{{editProfileUrl}}">Edit Profile URL</option>
                <option value="{{checkoutUrl}}">Checkout URL</option>
                <option value="{{resetPasswordUrl}}">Reset Password URL</option>
                <option value="{{dashboardUrl}}">Dashboard URL</option>
                <option value="custom">Custom URL</option>
              </select>

              {props.url === "custom" && (
                <input
                  type="url"
                  placeholder="Enter custom URL"
                  onChange={(e) => handleChange("url", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                />
              )}

              {props.url && props.url !== "custom" && (
                <p className="text-xs text-gray-500">
                  This will use:{" "}
                  <code className="rounded bg-gray-100 px-1">{props.url}</code>
                </p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Button Color
            </label>
            <input
              type="color"
              value={props.backgroundColor || "#007bff"}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Text Color
            </label>
            <input
              type="color"
              value={props.textColor || "#ffffff"}
              onChange={(e) => handleChange("textColor", e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Border Radius
            </label>
            <input
              type="text"
              value={props.borderRadius ?? ""}
              onChange={(e) => handleChange("borderRadius", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Button Padding
            </label>
            <input
              type="text"
              value={props.padding ?? ""}
              onChange={(e) => handleChange("padding", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              placeholder="15px 30px"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Alignment
            </label>
            <select
              value={props.alignment || "center"}
              onChange={(e) => handleChange("alignment", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Section Background Color
            </label>
            <input
              type="color"
              value={props.sectionBackgroundColor || "#ffffff"}
              onChange={(e) =>
                handleChange("sectionBackgroundColor", e.target.value)
              }
              className="h-10 w-full rounded-md border border-gray-300"
            />
          </div>
        </div>
      );

    case "image":
      return (
        <div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Image URL
            </label>
            <input
              type="url"
              value={props.src || ""}
              onChange={(e) => handleChange("src", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Alt Text</label>
            <input
              type="text"
              value={props.alt || ""}
              onChange={(e) => handleChange("alt", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Width</label>
            <input
              type="text"
              value={props.width ?? ""}
              onChange={(e) => handleChange("width", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          {commonProps}
        </div>
      );

    case "divider":
      return (
        <div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Height</label>
            <input
              type="text"
              value={props.height ?? ""}
              onChange={(e) => handleChange("height", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Color</label>
            <input
              type="color"
              value={props.color || "#e5e5e5"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Margin</label>
            <input
              type="text"
              value={props.margin ?? ""}
              onChange={(e) => handleChange("margin", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
        </div>
      );

    case "footer":
      return (
        <div>
          {/* Footer Logo Settings */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Footer Logo
              </label>
              <button
                onClick={() => handleChange("showLogo", !props.showLogo)}
                className={`rounded px-2 py-1 text-xs font-medium ${
                  props.showLogo
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {props.showLogo ? "On" : "Off"}
              </button>
            </div>
            {props.showLogo && (
              <div className="space-y-2">
                <div className="flex items-center justify-center rounded border border-gray-200 bg-white p-2">
                  <img
                    src={props.logoSrc || "/img/assets/logo.png"}
                    alt="Logo"
                    style={{
                      width: props.logoWidth || "80px",
                      height: props.logoHeight || "auto",
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Logo Width
                  </label>
                  <input
                    type="text"
                    value={props.logoWidth || "80px"}
                    onChange={(e) => handleChange("logoWidth", e.target.value)}
                    className="w-full rounded border border-gray-300 p-1.5 text-sm"
                    placeholder="80px"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Logo Height
                  </label>
                  <input
                    type="text"
                    value={props.logoHeight || "auto"}
                    onChange={(e) => handleChange("logoHeight", e.target.value)}
                    className="w-full rounded border border-gray-300 p-1.5 text-sm"
                    placeholder="auto"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Content</label>
            <textarea
              value={props.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Font Size
            </label>
            <input
              type="text"
              value={props.fontSize ?? ""}
              onChange={(e) => handleChange("fontSize", e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">
              Text Color
            </label>
            <input
              type="color"
              value={props.textColor || "#666666"}
              onChange={(e) => handleChange("textColor", e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300"
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
