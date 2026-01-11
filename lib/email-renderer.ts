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
  
  // Convert plain text to HTML with proper paragraph formatting
  const lines = content.split('\n');
  let htmlParts: string[] = [];
  let currentParagraph = '';
  
  for (const line of lines) {
    if (line.trim() === '') {
      if (currentParagraph.trim()) {
        htmlParts.push(`<p style="margin: 0 0 16px 0;">${currentParagraph.trim()}</p>`);
        currentParagraph = '';
      }
    } else {
      currentParagraph += (currentParagraph ? ' ' : '') + line.trim();
    }
  }
  
  // Add remaining paragraph
  if (currentParagraph.trim()) {
    htmlParts.push(`<p style="margin: 0 0 16px 0;">${currentParagraph.trim()}</p>`);
  }
  
  const htmlContent = htmlParts.join('');
  
  // Create call-to-action button if present
  let buttonHtml = '';
  if (template.content.callToAction && template.content.callToActionUrl) {
    buttonHtml = `
      <table cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
        <tr>
          <td style="background-color: #000000; border-radius: 6px; text-align: center;">
            <a href="${template.content.callToActionUrl}" 
               style="display: inline-block; padding: 14px 32px; font-family: Arial, sans-serif; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">
              ${template.content.callToAction}
            </a>
          </td>
        </tr>
      </table>
    `;
  }
  
  // Wrap in Gmail-style HTML
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f6f6f6; padding: 24px 0;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px 40px 32px 40px;">
                    <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #222222;">
                      ${htmlContent}
                      ${buttonHtml}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 40px 40px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 24px 0 0 0; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #999999;">
                      Your Love Films<br>
                      Wedding Videography<br>
                      hi@yourlovefilms.com
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
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

