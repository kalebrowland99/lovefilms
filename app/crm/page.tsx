'use client';

import { useState, useEffect, useRef } from 'react';
import { renderTemplate, renderSubject } from '@/lib/email-renderer';

export default function EmailAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [templates, setTemplates] = useState<any>(null);
  const [activeTemplate, setActiveTemplate] = useState<string>('welcome');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'email' | 'sms' | 'logs'>(() => {
    // Load saved tab from localStorage or default to 'leads'
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('crmActiveTab');
      if (savedTab && ['leads', 'email', 'sms', 'logs'].includes(savedTab)) {
        return savedTab as 'leads' | 'email' | 'sms' | 'logs';
      }
    }
    return 'leads';
  });
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [automationSettings, setAutomationSettings] = useState<any>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [updatingInquiry, setUpdatingInquiry] = useState<string | null>(null);
  const [lastLeadsRefresh, setLastLeadsRefresh] = useState<Date | null>(null);
  
  // Refs for timers and loading state
  const leadsAutoRefreshTimer = useRef<NodeJS.Timeout | null>(null);
  const isLoadingInquiries = useRef<boolean>(false);

  // Check if already authenticated (stored in session)
  useEffect(() => {
    const auth = sessionStorage.getItem('emailAdminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadTemplates(sessionStorage.getItem('emailAdminPassword') || '');
    }
  }, []);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crmActiveTab', activeTab);
    }
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/email-templates', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
        setIsAuthenticated(true);
        sessionStorage.setItem('emailAdminAuth', 'true');
        sessionStorage.setItem('emailAdminPassword', password);
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  const loadTemplates = async (pwd: string) => {
    try {
      const response = await fetch('/api/email-templates', {
        headers: {
          'Authorization': `Bearer ${pwd}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadInquiries = async () => {
    // Prevent multiple simultaneous requests
    if (isLoadingInquiries.current) {
      return;
    }
    
    isLoadingInquiries.current = true;
    setInquiriesLoading(true);
    
    try {
      const response = await fetch('/api/inquiries', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('emailAdminPassword')}`
        },
        cache: 'no-store' // Prevent caching issues
      });

      if (response.ok) {
        const data = await response.json();
        // Only update if data is valid
        if (Array.isArray(data)) {
          setInquiries(data);
          setLastLeadsRefresh(new Date());
        }
      }
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setInquiriesLoading(false);
      isLoadingInquiries.current = false;
    }
  };

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    setUpdatingInquiry(inquiryId);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('emailAdminPassword')}`
        },
        body: JSON.stringify({ inquiryId, updates: { status } })
      });

      if (response.ok) {
        // Update local state
        setInquiries(inquiries.map(inq => 
          inq.id === inquiryId ? { ...inq, status } : inq
        ));
        setMessage(`✅ Lead status updated to "${status}"`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to update lead status');
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
      setMessage('❌ Error updating lead');
    } finally {
      setUpdatingInquiry(null);
    }
  };

  const loadEmailLogs = async () => {
    setLogsLoading(true);
    try {
      const response = await fetch('/api/email-logs', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('emailAdminPassword')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmailLogs(data);
      }
    } catch (error) {
      console.error('Error loading email logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const loadAutomationSettings = async () => {
    setSettingsLoading(true);
    try {
      const response = await fetch('/api/automation-settings', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('emailAdminPassword')}`
        },
        cache: 'no-store' // Prevent caching issues
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Loaded automation settings:', data);
        // Use the data as-is from the API (which already merges with defaults)
        setAutomationSettings(data);
      }
    } catch (error) {
      console.error('Error loading automation settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setMessage('');
    
    try {
      console.log('Saving automation settings:', automationSettings);
      
      const response = await fetch('/api/automation-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('emailAdminPassword')}`
        },
        body: JSON.stringify(automationSettings)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Save successful:', result);
        setMessage('✅ Automation settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setMessage(`❌ Failed to save settings: ${errorData.error || 'Unknown error'}`);
        console.error('Save error:', errorData);
      }
    } catch (error) {
      setMessage('❌ Error saving settings');
      console.error('Save error:', error);
    } finally {
      setSavingSettings(false);
    }
  };


  // Load data when switching tabs
  useEffect(() => {
    if (activeTab === 'leads' && isAuthenticated && inquiries.length === 0 && !inquiriesLoading) {
      loadInquiries();
    }
    if (activeTab === 'logs' && isAuthenticated && emailLogs.length === 0 && !logsLoading) {
      loadEmailLogs();
    }
    // Always reload SMS settings when switching to SMS tab to get fresh data
    if (activeTab === 'sms' && isAuthenticated && !settingsLoading) {
      loadAutomationSettings();
    }
    if (activeTab === 'email' && isAuthenticated && !templates) {
      loadTemplates(sessionStorage.getItem('emailAdminPassword') || '');
    }
  }, [activeTab, isAuthenticated]);

  // Auto-refresh leads every 30 seconds when on leads tab
  useEffect(() => {
    if (activeTab === 'leads' && isAuthenticated) {
      // Set up interval to refresh every 30 seconds
      leadsAutoRefreshTimer.current = setInterval(() => {
        // Only refresh if not currently loading to prevent race conditions
        if (!inquiriesLoading) {
          loadInquiries();
        }
      }, 30000); // 30 seconds

      // Cleanup on unmount or tab change
      return () => {
        if (leadsAutoRefreshTimer.current) {
          clearInterval(leadsAutoRefreshTimer.current);
        }
      };
    }
  }, [activeTab, isAuthenticated, inquiriesLoading]);


  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('emailAdminPassword')}`
        },
        body: JSON.stringify(templates)
      });

      if (response.ok) {
        setMessage('✅ Templates saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setMessage(`❌ Failed to save templates: ${errorData.error || 'Unknown error'}`);
        console.error('Save error:', errorData);
      }
    } catch (error) {
      setMessage('❌ Error saving templates');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateTemplateField = (templateKey: string, field: string, value: any) => {
    setTemplates({
      ...templates,
      [templateKey]: {
        ...templates[templateKey],
        [field]: value
      }
    });
  };

  const updateContentField = (templateKey: string, field: string, value: any) => {
    setTemplates({
      ...templates,
      [templateKey]: {
        ...templates[templateKey],
        content: {
          ...templates[templateKey].content,
          [field]: value
        }
      }
    });
  };

  const updateAutomationSettings = (newSettings: any) => {
    setAutomationSettings(newSettings);
  };

  const getPreviewHtml = () => {
    if (!templates || !activeTemplate) return '';
    
    const template = templates[activeTemplate];
    const sampleData = {
      name: 'John & Jane',
      weddingDate: 'June 15, 2026',
      formData: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(615) 555-1234',
        fianceName: 'Jane Doe',
        weddingDate: 'June 15, 2026',
        venue: 'The Hermitage Hotel, Nashville',
        videographer: 'Not Yet'
      }
    };
    
    return renderTemplate(template, sampleData);
  };

  if (!isAuthenticated) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Admin</h1>
          <p className="text-gray-600">Enter password to manage email templates</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              placeholder="Enter password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
  }

  if (!templates) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  const currentTemplate = templates[activeTemplate];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CRM & Email Management</h1>
              <p className="text-sm text-gray-600">Manage templates, automations, and view email logs</p>
            </div>
              <div className="flex gap-3 items-center">
                {activeTab === 'leads' && (
                  <>
                    {lastLeadsRefresh && (
                      <span className="text-xs text-gray-500">
                        Last updated: {lastLeadsRefresh.toLocaleTimeString()}
                      </span>
                    )}
                    <button
                      onClick={loadInquiries}
                      disabled={inquiriesLoading}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50"
                    >
                      {inquiriesLoading ? 'Refreshing...' : 'Refresh Leads'}
                    </button>
                  </>
                )}
                {activeTab === 'email' && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
                {activeTab === 'sms' && (
                  <div className="flex gap-3">
                    <button
                      onClick={loadAutomationSettings}
                      disabled={settingsLoading}
                      className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
                    >
                      {settingsLoading ? 'Loading...' : 'Reload Settings'}
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      disabled={savingSettings}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50"
                    >
                      {savingSettings ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
                {activeTab === 'logs' && (
                  <button
                    onClick={loadEmailLogs}
                    disabled={logsLoading}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50"
                  >
                    {logsLoading ? 'Refreshing...' : 'Refresh Logs'}
                  </button>
                )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-4 -mb-px">
            <button
              onClick={() => setActiveTab('leads')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'leads'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👥 Leads
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'email'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📧 Email Automation
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sms'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📱 Text Automation
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'logs'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Logs
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Total Leads</div>
                <div className="text-3xl font-bold text-gray-900">{inquiries.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">New</div>
                <div className="text-3xl font-bold text-blue-600">
                  {inquiries.filter(inq => inq.status === 'new').length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Contacted</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {inquiries.filter(inq => inq.status === 'contacted').length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Booked</div>
                <div className="text-3xl font-bold text-green-600">
                  {inquiries.filter(inq => inq.status === 'booked').length}
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">All Wedding Inquiries</h2>
                <p className="text-sm text-gray-600 mt-1">Manage lead status to control email/SMS automation</p>
              </div>
              
              {inquiriesLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading leads...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500">No inquiries yet. Submit a contact form to see leads here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Couple
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Wedding Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Follow-Ups Sent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                            {inquiry.fianceName && (
                              <div className="text-sm text-gray-500">& {inquiry.fianceName}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{inquiry.email}</div>
                            <div className="text-sm text-gray-500">{inquiry.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{inquiry.weddingDate}</div>
                            <div className="text-sm text-gray-500">{inquiry.venue}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              Inquired: {new Date(inquiry.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {inquiry.followUpSentAt && Object.keys(inquiry.followUpSentAt).length > 0 ? (
                                Object.entries(inquiry.followUpSentAt).map(([key, value]: [string, any]) => (
                                  <span key={key} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    {key}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500">None yet</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                              inquiry.status === 'booked' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {inquiry.status === 'new' && '🆕 New'}
                              {inquiry.status === 'contacted' && '💬 Contacted'}
                              {inquiry.status === 'booked' && '✅ Booked'}
                              {inquiry.status === 'dead' && '❌ Dead'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={inquiry.status}
                              onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                              disabled={updatingInquiry === inquiry.id}
                              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-black focus:border-transparent outline-none disabled:opacity-50"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="booked">Booked</option>
                              <option value="dead">Dead</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How Lead Status Works</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• <strong>New:</strong> Automation active - will receive all follow-up emails/SMS</li>
                    <li>• <strong>Contacted:</strong> You've replied - automation continues (good for warm leads)</li>
                    <li>• <strong>Booked:</strong> They officially booked - <strong>automation STOPS</strong> (no more follow-ups)</li>
                    <li>• <strong>Dead:</strong> Not interested - automation STOPS</li>
                    <li>• Change status to "Booked" as soon as they sign contract to stop all emails/texts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sms' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">📱 SMS Text Automation</h2>
                  <p className="text-gray-600">
                    Configure automated text messages for wedding inquiries using Twilio.
                  </p>
                </div>
              </div>
            </div>

            {settingsLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading SMS settings...</p>
              </div>
            ) : automationSettings && (
              <div className="space-y-6">
                {/* Test Mode Toggle */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">🧪 Test Mode</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Send entire email & SMS sequence rapidly (10 seconds apart) for testing
                      </p>
                      <p className="text-xs text-orange-700 font-medium">
                        ⚠️ Only use for test inquiries! Sends all 10 messages in ~90 seconds
                      </p>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={automationSettings.testMode || false}
                        onChange={(e) => updateAutomationSettings({
                          ...automationSettings,
                          testMode: e.target.checked
                        })}
                        className="w-5 h-5 rounded"
                      />
                      <span className={`font-bold ${automationSettings.testMode ? 'text-orange-600' : 'text-gray-500'}`}>
                        {automationSettings.testMode ? 'ACTIVE' : 'OFF'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* SMS Configuration */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">📱 SMS Text Messages (Optional)</h3>
                      <p className="text-sm text-gray-600">
                        Send automated text messages via Twilio for higher engagement
                      </p>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={automationSettings.sms.enabled}
                        onChange={(e) => updateAutomationSettings({
                          ...automationSettings,
                          sms: {
                            ...automationSettings.sms,
                            enabled: e.target.checked
                          }
                        })}
                        className="w-5 h-5 rounded"
                      />
                      <span className={`font-medium ${automationSettings.sms.enabled ? 'text-green-600' : 'text-gray-500'}`}>
                        {automationSettings.sms.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                  
                  {/* SMS Configuration Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>ℹ️ Twilio credentials are set in Vercel environment variables.</strong> No additional configuration needed here.
                    </p>
                  </div>
                  
                  {/* SMS Templates */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">SMS Message Templates</h4>
                    {Object.entries(automationSettings.sms.templates).map(([key, template]: [string, any]) => {
                      // Get timing display based on key
                      const getTimingDisplay = (k: string) => {
                        if (k === 'day0') return '⏱️ 45 seconds after inquiry';
                        if (k === 'day2') return '📅 Day 2 (48 hours after inquiry)';
                        if (k === 'day4') return '📅 Day 4 (96 hours after inquiry)';
                        return '';
                      };
                      
                      return (
                        <div key={key} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-medium text-gray-900">{template.name}</h5>
                              <p className="text-xs text-gray-600 mt-1 font-medium">
                                {getTimingDisplay(key)}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                ⚠️ Timing is hardcoded and cannot be changed
                              </p>
                            </div>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={template.enabled}
                                onChange={(e) => updateAutomationSettings({
                                  ...automationSettings,
                                  sms: {
                                    ...automationSettings.sms,
                                    templates: {
                                      ...automationSettings.sms.templates,
                                      [key]: {
                                        ...template,
                                        enabled: e.target.checked
                                      }
                                    }
                                  }
                                })}
                                className="w-4 h-4 rounded"
                              />
                              <span className="text-sm font-medium">{template.enabled ? '✅ Active' : '⏸️ Disabled'}</span>
                            </label>
                          </div>
                          <textarea
                            value={template.message}
                            onChange={(e) => updateAutomationSettings({
                              ...automationSettings,
                              sms: {
                                ...automationSettings.sms,
                                templates: {
                                  ...automationSettings.sms.templates,
                                  [key]: {
                                    ...template,
                                    message: e.target.value
                                  }
                                }
                              }
                            })}
                            rows={3}
                            maxLength={160}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-sm resize-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {template.message.length}/160 characters • Use {`{{name}}`}, {`{{weddingDate}}`}, {`{{venue}}`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">How SMS Automation Works</h3>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• <strong>Twilio Required:</strong> SMS will only send if you've configured Twilio credentials above</li>
                        <li>• <strong>Day 0 Text:</strong> Sends 45 seconds after inquiry submission</li>
                        <li>• <strong>Day 2 Text:</strong> Sends on Day 2 at 9:00 AM UTC via Vercel Cron</li>
                        <li>• <strong>Day 4 Text:</strong> Sends on Day 4 at 9:00 AM UTC via Vercel Cron</li>
                        <li>• <strong>Timing is hardcoded:</strong> You can only enable/disable and edit message content</li>
                        <li>• Only sends to inquiries with <strong>"new"</strong> or <strong>"contacted"</strong> status</li>
                        <li>• Change lead status to <strong>"booked"</strong> to stop all automation</li>
                        <li>• Once a text is sent, it won't send again (tracked automatically)</li>
                        <li>• <strong>Best practice:</strong> Keep texts short (under 160 chars) and friendly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Templates</h2>
              <div className="space-y-2">
                {Object.entries(templates)
                  .sort(([keyA], [keyB]) => {
                    const order = ['notification', 'welcome', 'prices', 'followupDay1', 'followupDay3', 'followupDay6', 'followupDay10', 'followupDay14'];
                    return order.indexOf(keyA) - order.indexOf(keyB);
                  })
                  .map(([key, template]: [string, any]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTemplate(key)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTemplate === key
                        ? 'bg-black text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className={`text-xs mt-1 ${activeTemplate === key ? 'text-gray-300' : 'text-gray-500'}`}>
                      {template.enabled ? '✓ Enabled' : '✗ Disabled'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Email Editor & Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{currentTemplate.name}</h2>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={currentTemplate.enabled}
                    onChange={(e) => updateTemplateField(activeTemplate, 'enabled', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-gray-700">Enable this email</span>
                </label>
              </div>

              {/* Subject Line */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={currentTemplate.subject}
                  onChange={(e) => updateTemplateField(activeTemplate, 'subject', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  placeholder="Subject line"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {`{{name}}`} and {`{{weddingDate}}`} for dynamic content
                </p>
              </div>

              {/* Email Preview with Edit Instructions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Preview
                  </label>
                  <span className="text-xs text-gray-500">
                    This is how your email will look to customers
                  </span>
                </div>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={getPreviewHtml()}
                    className="w-full h-[700px]"
                    title="Email Preview"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 To edit email content, modify the template directly in your CRM settings or use the raw editor below
                </p>
              </div>

              {/* Raw Content Editor (Advanced) */}
              <div className="mt-6">
                <details className="group">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span className="group-open:rotate-90 transition-transform">▶</span>
                      Advanced: Edit Raw Content
                    </div>
                  </summary>
                  <div className="mt-4 space-y-4">
                    {/* Show all editable fields */}
                    {currentTemplate.content.greeting !== undefined && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Greeting</label>
                        <input
                          type="text"
                          value={currentTemplate.content.greeting}
                          onChange={(e) => updateContentField(activeTemplate, 'greeting', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                      </div>
                    )}
                    
                    {currentTemplate.content.heading !== undefined && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Heading</label>
                        <input
                          type="text"
                          value={currentTemplate.content.heading}
                          onChange={(e) => updateContentField(activeTemplate, 'heading', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                      </div>
                    )}

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const key = `paragraph${num}`;
                      if (currentTemplate.content[key] !== undefined) {
                        return (
                          <div key={key}>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Paragraph {num}</label>
                            <textarea
                              value={currentTemplate.content[key]}
                              onChange={(e) => updateContentField(activeTemplate, key, e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-y"
                            />
                          </div>
                        );
                      }
                      return null;
                    })}

                    {currentTemplate.content.callToAction !== undefined && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                          <input
                            type="text"
                            value={currentTemplate.content.callToAction}
                            onChange={(e) => updateContentField(activeTemplate, 'callToAction', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Button URL</label>
                          <input
                            type="url"
                            value={currentTemplate.content.callToActionUrl}
                            onChange={(e) => updateContentField(activeTemplate, 'callToActionUrl', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                        </div>
                      </>
                    )}

                    {currentTemplate.content.footer !== undefined && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Footer</label>
                        <textarea
                          value={currentTemplate.content.footer}
                          onChange={(e) => updateContentField(activeTemplate, 'footer', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-y"
                        />
                      </div>
                    )}

                    {currentTemplate.content.attachmentUrl !== undefined && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">PDF Attachment URL</label>
                        <input
                          type="url"
                          value={currentTemplate.content.attachmentUrl}
                          onChange={(e) => updateContentField(activeTemplate, 'attachmentUrl', e.target.value)}
                          placeholder="https://example.com/your-pricing-guide.pdf"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                      </div>
                    )}

                    {currentTemplate.content.showDetails !== undefined && (
                      <div>
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={currentTemplate.content.showDetails}
                            onChange={(e) => updateContentField(activeTemplate, 'showDetails', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-gray-700">Show form submission details</span>
                        </label>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Total Messages</div>
                <div className="text-3xl font-bold text-gray-900">{emailLogs.length}</div>
                <div className="text-xs text-gray-500 mt-1">
                  📧 {emailLogs.filter(log => log.messageType !== 'sms').length} emails · 
                  📱 {emailLogs.filter(log => log.messageType === 'sms').length} texts
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Sent Successfully</div>
                <div className="text-3xl font-bold text-green-600">
                  {emailLogs.filter(log => log.status === 'sent').length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Failed</div>
                <div className="text-3xl font-bold text-red-600">
                  {emailLogs.filter(log => log.status === 'failed').length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Today</div>
                <div className="text-3xl font-bold text-blue-600">
                  {emailLogs.filter(log => {
                    const logDate = new Date(log.sentAt).toDateString();
                    const today = new Date().toDateString();
                    return logDate === today;
                  }).length}
                </div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Communication History</h2>
                <p className="text-sm text-gray-600 mt-1">All emails and text messages sent through your system</p>
              </div>
              
              {logsLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading logs...</p>
                </div>
              ) : emailLogs.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500">No messages sent yet. Submit a contact form to see logs here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Recipient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Template
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject / Message
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {emailLogs.map((log) => {
                        const isSMS = log.messageType === 'sms';
                        const getTemplateLabel = () => {
                          if (isSMS) return log.subject.replace('SMS: ', '');
                          if (log.templateType === 'welcome') return 'Welcome Email';
                          if (log.templateType === 'prices') return 'Pricing & Availability';
                          if (log.templateType === 'notification') return 'Admin Alert';
                          if (log.templateType === 'followup-day1') return 'Day 1 Follow-Up';
                          if (log.templateType === 'followup-day3') return 'Day 3 Follow-Up';
                          if (log.templateType === 'followup-day6') return 'Day 6 Follow-Up';
                          if (log.templateType === 'followup-day10') return 'Day 10 Follow-Up';
                          if (log.templateType === 'followup-day14') return 'Day 14 Follow-Up';
                          return log.templateType;
                        };
                        
                        return (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {isSMS ? (
                                <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                                  📱 TEXT
                                </span>
                              ) : (
                                <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">
                                  📧 EMAIL
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(log.sentAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{log.recipientName}</div>
                              <div className="text-sm text-gray-500">{log.recipientEmail}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                isSMS ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                log.templateType === 'welcome' ? 'bg-green-100 text-green-800' :
                                log.templateType === 'notification' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {getTemplateLabel()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                              {log.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {log.status === 'sent' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Sent
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title={log.error}>
                                  ✗ Failed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

