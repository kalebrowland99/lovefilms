// Helper to replace template variables with actual data
export function renderTemplate(template: any, data: any): string {
  let content = '';
  
  if (template.content.greeting) {
    content += `${replaceVars(template.content.greeting, data)}\n\n`;
  }
  
  if (template.content.heading) {
    content += `${replaceVars(template.content.heading, data)}\n\n`;
  }
  
  // Add paragraph content (support up to 10 paragraphs)
  for (let i = 1; i <= 10; i++) {
    const key = `paragraph${i}`;
    if (template.content[key]) {
      content += `${replaceVars(template.content[key], data)}\n\n`;
    }
  }
  
  // Show form details if enabled (for admin notification)
  if (template.content.showDetails && data.formData) {
    content += `---\n`;
    content += `Name: ${data.formData.name || 'N/A'}\n`;
    content += `Email: ${data.formData.email || 'N/A'}\n`;
    content += `Phone: ${data.formData.phone || 'N/A'}\n`;
    content += `Fiance's Name: ${data.formData.fianceName || 'N/A'}\n`;
    content += `Wedding Date: ${data.formData.weddingDate || 'N/A'}\n`;
    content += `Wedding Venue: ${data.formData.venue || 'N/A'}\n`;
    content += `---\n\n`;
  }
  
  // Call to action as plain link
  if (template.content.callToAction && template.content.callToActionUrl) {
    content += `${template.content.callToAction}: ${template.content.callToActionUrl}\n\n`;
  }
  
  // Footer
  if (template.content.footer) {
    content += `${replaceVars(template.content.footer, data)}\n\n`;
  }
  
  // Convert plain text to simple HTML with line breaks
  const htmlContent = content
    .split('\n')
    .map(line => line.trim() === '' ? '<br>' : line)
    .join('<br>');
  
  // Wrap in minimal HTML
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333;">
        ${htmlContent}
      </body>
    </html>
  `;
}

// Replace {{variables}} with actual values
function replaceVars(text: string, data: any): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    // Handle special combined variables
    if (key === 'coupleNames' || key === 'coupleName') {
      const name1 = data.name || data.formData?.name || '';
      const name2 = data.fianceName || data.formData?.fianceName || '';
      if (name1 && name2) {
        return `${name1} & ${name2}`;
      }
      return name1 || name2 || match;
    }
    
    // Handle nested data
    if (data[key]) {
      return data[key];
    }
    // Check formData for additional fields
    if (data.formData && data.formData[key]) {
      return data.formData[key];
    }
    return match;
  });
}

// Render subject line
export function renderSubject(subject: string, data: any): string {
  return replaceVars(subject, data);
}

