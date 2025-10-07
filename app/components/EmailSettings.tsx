import { useState, useEffect } from 'react';

interface StoreEmailSettings {
  id: string;
  shop: string;
  fromEmail: string;
  fromName: string;
  enabled: boolean;
  // NEW SCHEDULING FIELDS
  scheduleEnabled: boolean;
  scheduleTime: string;
  timezone: string;
}

export default function EmailSettings() {
  const [settings, setSettings] = useState<StoreEmailSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/app/api/email-settings');
      const data = await response.json();

      if (data.settings) {
        setSettings(data.settings);
      } else {
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const defaultSettings = {
        fromEmail: "info@nexusbling.com",
        fromName: "Store",
        enabled: true,
        // NEW DEFAULT SCHEDULING SETTINGS
        scheduleEnabled: false,
        scheduleTime: "09:00",
        timezone: "UTC"
      };
      
      const response = await fetch('/app/api/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultSettings),
      });
      
      const data = await response.json();
      if (response.ok) setSettings(data.settings);
    } catch (error) {
      console.error('Error creating default settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/app/api/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      setMessage(response.ok ? 'Settings saved successfully!' : 'Failed to save settings');
    } catch (error) {
      console.error('Save error:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const sendAnalyticsReport = async () => {
    if (!settings) { 
      setMessage('Please save settings first'); 
      return; 
    }
    
    if (!settings.fromEmail) {
      setMessage('Please set a recipient email address first');
      return;
    }

    setSending(true);
    setMessage('');
    try {
      const response = await fetch('/app/api/send-analytics-report', { 
        method: 'POST' 
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Analytics report sent successfully! Check your email.');
      } else {
        setMessage(`Failed to send report: ${data.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Send report error:', error);
      setMessage(`Error sending report: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (!settings) return <div>Unable to load or create settings.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h1>Email Settings</h1>
      
      {message && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          borderRadius: '4px',
          backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724',
          border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
          whiteSpace: 'pre-line'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
          />
          Enable Email Notifications
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Recipient Email:
        </label>
        <input
          type="email"
          value={settings.fromEmail}
          onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: '1px solid #ddd', 
            borderRadius: '4px' 
          }}
          placeholder="Enter the email address to receive reports"
        />
        <small style={{ color: '#666', fontSize: '12px' }}>
          This is where analytics reports will be sent
        </small>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          From Name:
        </label>
        <input
          type="text"
          value={settings.fromName}
          onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: '1px solid #ddd', 
            borderRadius: '4px' 
          }}
          placeholder="Store Name"
        />
      </div>

      {/* NEW: Automatic Scheduling Section */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Automatic Reports Schedule</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.scheduleEnabled}
              onChange={(e) => setSettings({ ...settings, scheduleEnabled: e.target.checked })}
            />
            Enable Daily Automatic Reports
          </label>
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginLeft: '24px' }}>
            Send analytics reports automatically every day
          </small>
        </div>

        {settings.scheduleEnabled && (
          <div style={{ marginLeft: '24px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Send Time:
              </label>
              <input
                type="time"
                value={settings.scheduleTime}
                onChange={(e) => setSettings({ ...settings, scheduleTime: e.target.value })}
                style={{ 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                Daily report will be sent at this time
              </small>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Timezone:
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                style={{ 
                  width: '100%',
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Australia/Sydney">Sydney (AEST)</option>
              </select>
              <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                Select your local timezone
              </small>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button 
          onClick={saveSettings} 
          disabled={saving}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        
        <button 
          onClick={sendAnalyticsReport} 
          disabled={sending || !settings.enabled}
          style={{
            padding: '10px 20px',
            backgroundColor: settings.enabled ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (sending || !settings.enabled) ? 'not-allowed' : 'pointer'
          }}
        >
          {sending ? 'Sending...' : 'Send Analytics Report'}
        </button>
      </div>
    </div>
  );
}