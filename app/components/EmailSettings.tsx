// // // import { useState, useEffect } from 'react';

// // // interface StoreEmailSettings {
// // //   id: string;
// // //   shop: string;
// // //   fromEmail: string;
// // //   fromName: string;
// // //   enabled: boolean;
// // //   // NEW: Multiple email addresses
// // //   additionalEmails: string[];
// // //   // NEW SCHEDULING FIELDS
// // //   scheduleEnabled: boolean;
// // //   scheduleTime: string;
// // //   timezone: string;
// // // }

// // // export default function EmailSettings() {
// // //   const [settings, setSettings] = useState<StoreEmailSettings | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [sending, setSending] = useState(false);
// // //   const [message, setMessage] = useState('');
// // //   const [newEmail, setNewEmail] = useState(''); // For adding new emails

// // //   useEffect(() => {
// // //     loadSettings();
// // //   }, []);

// // //   const loadSettings = async () => {
// // //     try {
// // //       const response = await fetch('/app/api/email-settings');
// // //       const data = await response.json();

// // //       if (data.settings) {
// // //         // Ensure additionalEmails exists and is an array
// // //         const safeSettings = {
// // //           ...data.settings,
// // //           additionalEmails: data.settings.additionalEmails || []
// // //         };
// // //         setSettings(safeSettings);
// // //       } else {
// // //         await createDefaultSettings();
// // //       }
// // //     } catch (error) {
// // //       console.error('Failed to load settings:', error);
// // //       setMessage('Error loading settings');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const createDefaultSettings = async () => {
// // //     try {
// // //       const defaultSettings = {
// // //         fromEmail: "info@nexusbling.com",
// // //         fromName: "Store",
// // //         enabled: true,
// // //         additionalEmails: [], // NEW: Default empty array
// // //         // NEW DEFAULT SCHEDULING SETTINGS
// // //         scheduleEnabled: false,
// // //         scheduleTime: "09:00",
// // //         timezone: "UTC"
// // //       };
      
// // //       const response = await fetch('/app/api/email-settings', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify(defaultSettings),
// // //       });
      
// // //       const data = await response.json();
// // //       if (response.ok) {
// // //         // Ensure additionalEmails exists in the response
// // //         const safeSettings = {
// // //           ...data.settings,
// // //           additionalEmails: data.settings?.additionalEmails || []
// // //         };
// // //         setSettings(safeSettings);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error creating default settings:', error);
// // //     }
// // //   };

// // //   const saveSettings = async () => {
// // //     if (!settings) return;
// // //     setSaving(true);
// // //     setMessage('');
// // //     try {
// // //       const response = await fetch('/app/api/email-settings', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify(settings),
// // //       });
// // //       const data = await response.json();
// // //       setMessage(response.ok ? 'Settings saved successfully!' : 'Failed to save settings');
// // //     } catch (error) {
// // //       console.error('Save error:', error);
// // //       setMessage('Error saving settings');
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const sendAnalyticsReport = async () => {
// // //     if (!settings) { 
// // //       setMessage('Please save settings first'); 
// // //       return; 
// // //     }
    
// // //     // NEW: Check if we have at least one email address
// // //     const hasEmails = settings.fromEmail || 
// // //       (settings.additionalEmails && settings.additionalEmails.length > 0);
    
// // //     if (!hasEmails) {
// // //       setMessage('Please set at least one recipient email address first');
// // //       return;
// // //     }

// // //     setSending(true);
// // //     setMessage('');
// // //     try {
// // //       const response = await fetch('/app/api/send-analytics-report', { 
// // //         method: 'POST' 
// // //       });
// // //       const data = await response.json();
      
// // //       if (response.ok) {
// // //         setMessage('Analytics report sent successfully! Check your email.');
// // //       } else {
// // //         setMessage(`Failed to send report: ${data.error || 'Unknown error'}`);
// // //       }
// // //     } catch (error: any) {
// // //       console.error('Send report error:', error);
// // //       setMessage(`Error sending report: ${error.message}`);
// // //     } finally {
// // //       setSending(false);
// // //     }
// // //   };

// // //   // NEW: Function to add a new email
// // //   const addEmail = () => {
// // //     if (!settings || !newEmail.trim()) return;
    
// // //     // Ensure additionalEmails exists
// // //     const currentAdditionalEmails = settings.additionalEmails || [];
    
// // //     // Basic email validation
// // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // //     if (!emailRegex.test(newEmail)) {
// // //       setMessage('Please enter a valid email address');
// // //       return;
// // //     }

// // //     // Check for duplicates
// // //     const allEmails = [settings.fromEmail, ...currentAdditionalEmails];
// // //     if (allEmails.includes(newEmail)) {
// // //       setMessage('This email address is already added');
// // //       return;
// // //     }

// // //     // Check if we've reached the maximum of 5 additional emails
// // //     if (currentAdditionalEmails.length >= 5) {
// // //       setMessage('Maximum of 5 additional email addresses allowed');
// // //       return;
// // //     }

// // //     setSettings({
// // //       ...settings,
// // //       additionalEmails: [...currentAdditionalEmails, newEmail.trim()]
// // //     });
// // //     setNewEmail('');
// // //     setMessage('');
// // //   };

// // //   // NEW: Function to remove an email
// // //   const removeEmail = (emailToRemove: string) => {
// // //     if (!settings) return;
    
// // //     const currentAdditionalEmails = settings.additionalEmails || [];
    
// // //     setSettings({
// // //       ...settings,
// // //       additionalEmails: currentAdditionalEmails.filter(email => email !== emailToRemove)
// // //     });
// // //   };

// // //   // NEW: Function to set primary email
// // //   const setPrimaryEmail = (email: string) => {
// // //     if (!settings) return;
    
// // //     const currentAdditionalEmails = settings.additionalEmails || [];
    
// // //     // Remove from additional emails and set as primary
// // //     const newAdditionalEmails = currentAdditionalEmails.filter(e => e !== email);
    
// // //     // Add current primary to additional if it exists
// // //     if (settings.fromEmail) {
// // //       newAdditionalEmails.push(settings.fromEmail);
// // //     }
    
// // //     setSettings({
// // //       ...settings,
// // //       fromEmail: email,
// // //       additionalEmails: newAdditionalEmails
// // //     });
// // //   };

// // //   // Safe access to additionalEmails with fallback
// // //   const additionalEmails = settings?.additionalEmails || [];
// // //   const canAddMoreEmails = additionalEmails.length < 5;

// // //   if (loading) return <div>Loading settings...</div>;
// // //   if (!settings) return <div>Unable to load or create settings.</div>;

// // //   return (
// // //     <div style={{ padding: '20px', maxWidth: '600px' }}>
// // //       <h1>Email Settings</h1>
      
// // //       {message && (
// // //         <div style={{
// // //           padding: '10px',
// // //           margin: '10px 0',
// // //           borderRadius: '4px',
// // //           backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
// // //           color: message.includes('Error') ? '#721c24' : '#155724',
// // //           border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
// // //           whiteSpace: 'pre-line'
// // //         }}>
// // //           {message}
// // //         </div>
// // //       )}

// // //       <div style={{ marginBottom: '15px' }}>
// // //         <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// // //           <input
// // //             type="checkbox"
// // //             checked={settings.enabled}
// // //             onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
// // //           />
// // //           Enable Email Notifications
// // //         </label>
// // //       </div>

// // //       {/* UPDATED: Email Addresses Section */}
// // //       <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
// // //         <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Recipient Email Addresses</h3>
        
// // //         {/* Primary Email */}
// // //         <div style={{ marginBottom: '15px' }}>
// // //           <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
// // //             Primary Email:
// // //           </label>
// // //           <input
// // //             type="email"
// // //             value={settings.fromEmail || ''}
// // //             onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
// // //             style={{ 
// // //               width: '100%', 
// // //               padding: '8px', 
// // //               border: '1px solid #ddd', 
// // //               borderRadius: '4px' 
// // //             }}
// // //             placeholder="Enter primary email address"
// // //           />
// // //           <small style={{ color: '#666', fontSize: '12px' }}>
// // //             This will be used as the main recipient and "from" address
// // //           </small>
// // //         </div>

// // //         {/* Additional Emails */}
// // //         <div style={{ marginBottom: '15px' }}>
// // //           <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
// // //             Additional Email Addresses:
// // //             <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#666', marginLeft: '8px' }}>
// // //               ({additionalEmails.length}/5 added)
// // //             </span>
// // //           </label>
          
// // //           {/* Add new email input */}
// // //           <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
// // //             <input
// // //               type="email"
// // //               value={newEmail}
// // //               onChange={(e) => setNewEmail(e.target.value)}
// // //               placeholder="Enter additional email address"
// // //               style={{ 
// // //                 flex: 1,
// // //                 padding: '8px', 
// // //                 border: '1px solid #ddd', 
// // //                 borderRadius: '4px' 
// // //               }}
// // //               onKeyPress={(e) => {
// // //                 if (e.key === 'Enter') {
// // //                   addEmail();
// // //                 }
// // //               }}
// // //             />
// // //             <button
// // //               onClick={addEmail}
// // //               disabled={!newEmail.trim() || !canAddMoreEmails}
// // //               style={{
// // //                 padding: '8px 16px',
// // //                 backgroundColor: newEmail.trim() && canAddMoreEmails ? '#007bff' : '#6c757d',
// // //                 color: 'white',
// // //                 border: 'none',
// // //                 borderRadius: '4px',
// // //                 cursor: newEmail.trim() && canAddMoreEmails ? 'pointer' : 'not-allowed'
// // //               }}
// // //             >
// // //               Add
// // //             </button>
// // //           </div>

// // //           {/* Show message when maximum reached */}
// // //           {!canAddMoreEmails && (
// // //             <div style={{ 
// // //               padding: '8px', 
// // //               backgroundColor: '#fff3cd', 
// // //               border: '1px solid #ffeaa7',
// // //               borderRadius: '4px',
// // //               marginBottom: '10px',
// // //               fontSize: '14px',
// // //               color: '#856404'
// // //             }}>
// // //               Maximum of 5 additional email addresses reached. Remove one to add another.
// // //             </div>
// // //           )}

// // //           {/* List of additional emails */}
// // //           {additionalEmails.length > 0 && (
// // //             <div style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
// // //               {additionalEmails.map((email, index) => (
// // //                 <div
// // //                   key={index}
// // //                   style={{
// // //                     display: 'flex',
// // //                     justifyContent: 'space-between',
// // //                     alignItems: 'center',
// // //                     padding: '8px 12px',
// // //                     borderBottom: index < additionalEmails.length - 1 ? '1px solid #e0e0e0' : 'none',
// // //                     backgroundColor: '#f9f9f9'
// // //                   }}
// // //                 >
// // //                   <span style={{ fontSize: '14px' }}>{email}</span>
// // //                   <div style={{ display: 'flex', gap: '8px' }}>
// // //                     <button
// // //                       onClick={() => setPrimaryEmail(email)}
// // //                       style={{
// // //                         padding: '4px 8px',
// // //                         backgroundColor: '#28a745',
// // //                         color: 'white',
// // //                         border: 'none',
// // //                         borderRadius: '2px',
// // //                         fontSize: '12px',
// // //                         cursor: 'pointer'
// // //                       }}
// // //                     >
// // //                       Set Primary
// // //                     </button>
// // //                     <button
// // //                       onClick={() => removeEmail(email)}
// // //                       style={{
// // //                         padding: '4px 8px',
// // //                         backgroundColor: '#dc3545',
// // //                         color: 'white',
// // //                         border: 'none',
// // //                         borderRadius: '2px',
// // //                         fontSize: '12px',
// // //                         cursor: 'pointer'
// // //                       }}
// // //                     >
// // //                       Remove
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
          
// // //           <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
// // //             Analytics reports will be sent to all email addresses listed above (maximum 6 total: 1 primary + 5 additional)
// // //           </small>
// // //         </div>
// // //       </div>

// // //       <div style={{ marginBottom: '20px' }}>
// // //         <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
// // //           From Name:
// // //         </label>
// // //         <input
// // //           type="text"
// // //           value={settings.fromName || ''}
// // //           onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
// // //           style={{ 
// // //             width: '100%', 
// // //             padding: '8px', 
// // //             border: '1px solid #ddd', 
// // //             borderRadius: '4px' 
// // //           }}
// // //           placeholder="Store Name"
// // //         />
// // //       </div>

// // //       {/* Automatic Scheduling Section */}
// // //       <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
// // //         <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Automatic Reports Schedule</h3>
        
// // //         <div style={{ marginBottom: '15px' }}>
// // //           <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// // //             <input
// // //               type="checkbox"
// // //               checked={settings.scheduleEnabled || false}
// // //               onChange={(e) => setSettings({ ...settings, scheduleEnabled: e.target.checked })}
// // //             />
// // //             Enable Daily Automatic Reports
// // //           </label>
// // //           <small style={{ color: '#666', fontSize: '12px', display: 'block', marginLeft: '24px' }}>
// // //             Send analytics reports automatically every day to all email addresses
// // //           </small>
// // //         </div>

// // //         {settings.scheduleEnabled && (
// // //           <div style={{ marginLeft: '24px' }}>
// // //             <div style={{ marginBottom: '15px' }}>
// // //               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
// // //                 Send Time:
// // //               </label>
// // //               <input
// // //                 type="time"
// // //                 value={settings.scheduleTime || '09:00'}
// // //                 onChange={(e) => setSettings({ ...settings, scheduleTime: e.target.value })}
// // //                 style={{ 
// // //                   padding: '8px', 
// // //                   border: '1px solid #ddd', 
// // //                   borderRadius: '4px',
// // //                   fontSize: '14px'
// // //                 }}
// // //               />
// // //               <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
// // //                 Daily report will be sent at this time
// // //               </small>
// // //             </div>

// // //             <div style={{ marginBottom: '15px' }}>
// // //               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
// // //                 Timezone:
// // //               </label>
// // //               <select
// // //                 value={settings.timezone || 'UTC'}
// // //                 onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
// // //                 style={{ 
// // //                   width: '100%',
// // //                   padding: '8px', 
// // //                   border: '1px solid #ddd', 
// // //                   borderRadius: '4px',
// // //                   fontSize: '14px'
// // //                 }}
// // //               >
// // //                 <option value="UTC">UTC</option>
// // //                 <option value="America/New_York">Eastern Time (ET)</option>
// // //                 <option value="America/Chicago">Central Time (CT)</option>
// // //                 <option value="America/Denver">Mountain Time (MT)</option>
// // //                 <option value="America/Los_Angeles">Pacific Time (PT)</option>
// // //                 <option value="Europe/London">London (GMT)</option>
// // //                 <option value="Europe/Paris">Paris (CET)</option>
// // //                 <option value="Asia/Dubai">Dubai (GST)</option>
// // //                 <option value="Asia/Kolkata">India (IST)</option>
// // //                 <option value="Asia/Tokyo">Tokyo (JST)</option>
// // //                 <option value="Australia/Sydney">Sydney (AEST)</option>
// // //               </select>
// // //               <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
// // //                 Select your local timezone
// // //               </small>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
// // //         <button 
// // //           onClick={saveSettings} 
// // //           disabled={saving}
// // //           style={{
// // //             padding: '10px 20px',
// // //             backgroundColor: '#007bff',
// // //             color: 'white',
// // //             border: 'none',
// // //             borderRadius: '4px',
// // //             cursor: saving ? 'not-allowed' : 'pointer'
// // //           }}
// // //         >
// // //           {saving ? 'Saving...' : 'Save Settings'}
// // //         </button>
        
// // //         <button 
// // //           onClick={sendAnalyticsReport} 
// // //           disabled={sending || !settings.enabled}
// // //           style={{
// // //             padding: '10px 20px',
// // //             backgroundColor: settings.enabled ? '#28a745' : '#6c757d',
// // //             color: 'white',
// // //             border: 'none',
// // //             borderRadius: '4px',
// // //             cursor: (sending || !settings.enabled) ? 'not-allowed' : 'pointer'
// // //           }}
// // //         >
// // //           {sending ? 'Sending...' : 'Send Analytics Report'}
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import { useState, useEffect } from 'react';

// // interface StoreEmailSettings {
// //   id: string;
// //   shop: string;
// //   fromEmail: string;
// //   fromName: string;
// //   enabled: boolean;
// //   // NEW: Multiple email addresses
// //   additionalEmails: string[];
// //   // NEW SCHEDULING FIELDS
// //   scheduleEnabled: boolean;
// //   scheduleTime: string;
// //   timezone: string;
// // }

// // export default function EmailSettings() {
// //   const [settings, setSettings] = useState<StoreEmailSettings | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [sending, setSending] = useState(false);
// //   const [message, setMessage] = useState('');
// //   const [newEmail, setNewEmail] = useState(''); // For adding new emails

// //   useEffect(() => {
// //     loadSettings();
// //   }, []);

// //   const loadSettings = async () => {
// //     try {
// //       const response = await fetch('/app/api/email-settings');
// //       const data = await response.json();

// //       if (data.settings) {
// //         setSettings(data.settings);
// //       } else {
// //         await createDefaultSettings();
// //       }
// //     } catch (error) {
// //       console.error('Failed to load settings:', error);
// //       setMessage('Error loading settings');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const createDefaultSettings = async () => {
// //     try {
// //       const defaultSettings = {
// //         fromEmail: "info@nexusbling.com",
// //         fromName: "Store",
// //         enabled: true,
// //         additionalEmails: [], // NEW: Default empty array
// //         // NEW DEFAULT SCHEDULING SETTINGS
// //         scheduleEnabled: false,
// //         scheduleTime: "09:00",
// //         timezone: "UTC"
// //       };
      
// //       const response = await fetch('/app/api/email-settings', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(defaultSettings),
// //       });
      
// //       const data = await response.json();
// //       if (response.ok) {
// //         // Ensure additionalEmails exists in the response
// //         const safeSettings = {
// //           ...data.settings,
// //           additionalEmails: data.settings?.additionalEmails || []
// //         };
// //         setSettings(safeSettings);
// //       }
// //     } catch (error) {
// //       console.error('Error creating default settings:', error);
// //     }
// //   };

// //   const saveSettings = async () => {
// //     if (!settings) return;
// //     setSaving(true);
// //     setMessage('');
// //     try {
// //       const response = await fetch('/app/api/email-settings', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(settings),
// //       });
// //       const data = await response.json();
// //       setMessage(response.ok ? 'Settings saved successfully!' : 'Failed to save settings');
// //     } catch (error) {
// //       console.error('Save error:', error);
// //       setMessage('Error saving settings');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   // NEW: Updated sendAnalyticsReport function
// //   const sendAnalyticsReport = async () => {
// //     if (!settings) { 
// //       setMessage('Please save settings first'); 
// //       return; 
// //     }
    
// //     // Get all email addresses (primary + additional)
// //     const allEmails = [
// //       settings.fromEmail,
// //       ...(settings.additionalEmails || [])
// //     ].filter(email => email && email.trim()); // Remove empty emails

// //     if (allEmails.length === 0) {
// //       setMessage('Please set at least one recipient email address first');
// //       return;
// //     }

// //     setSending(true);
// //     setMessage('');
// //     try {
// //       const response = await fetch('/app/api/send-analytics-report', { 
// //         method: 'POST' 
// //       });
// //       const data = await response.json();
      
// //       if (response.ok) {
// //         setMessage(`Analytics report sent successfully to ${allEmails.length} email(s)!`);
// //       } else {
// //         setMessage(`Failed to send report: ${data.error || 'Unknown error'}`);
// //       }
// //     } catch (error: any) {
// //       console.error('Send report error:', error);
// //       setMessage(`Error sending report: ${error.message}`);
// //     } finally {
// //       setSending(false);
// //     }
// //   };

// //   // NEW: Function to add a new email
// //   const addEmail = () => {
// //     if (!settings || !newEmail.trim()) return;
    
// //     // Ensure additionalEmails exists
// //     const currentAdditionalEmails = settings.additionalEmails || [];
    
// //     // Basic email validation
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(newEmail)) {
// //       setMessage('Please enter a valid email address');
// //       return;
// //     }

// //     // Check for duplicates
// //     const allEmails = [settings.fromEmail, ...currentAdditionalEmails];
// //     if (allEmails.includes(newEmail)) {
// //       setMessage('This email address is already added');
// //       return;
// //     }

// //     // Check if we've reached the maximum of 5 additional emails
// //     if (currentAdditionalEmails.length >= 5) {
// //       setMessage('Maximum of 5 additional email addresses allowed');
// //       return;
// //     }

// //     setSettings({
// //       ...settings,
// //       additionalEmails: [...currentAdditionalEmails, newEmail.trim()]
// //     });
// //     setNewEmail('');
// //     setMessage('');
// //   };

// //   // NEW: Function to remove an email
// //   const removeEmail = (emailToRemove: string) => {
// //     if (!settings) return;
    
// //     const currentAdditionalEmails = settings.additionalEmails || [];
    
// //     setSettings({
// //       ...settings,
// //       additionalEmails: currentAdditionalEmails.filter(email => email !== emailToRemove)
// //     });
// //   };

// //   // NEW: Function to set primary email
// //   const setPrimaryEmail = (email: string) => {
// //     if (!settings) return;
    
// //     const currentAdditionalEmails = settings.additionalEmails || [];
    
// //     // Remove from additional emails and set as primary
// //     const newAdditionalEmails = currentAdditionalEmails.filter(e => e !== email);
    
// //     // Add current primary to additional if it exists
// //     if (settings.fromEmail) {
// //       newAdditionalEmails.push(settings.fromEmail);
// //     }
    
// //     setSettings({
// //       ...settings,
// //       fromEmail: email,
// //       additionalEmails: newAdditionalEmails
// //     });
// //   };

// //   // Safe access to additionalEmails with fallback
// //   const additionalEmails = settings?.additionalEmails || [];
// //   const canAddMoreEmails = additionalEmails.length < 5;

// //   if (loading) return <div>Loading settings...</div>;
// //   if (!settings) return <div>Unable to load or create settings.</div>;

// //   return (
// //     <div style={{ padding: '20px', maxWidth: '600px' }}>
// //       <h1>Email Settings</h1>
      
// //       {message && (
// //         <div style={{
// //           padding: '10px',
// //           margin: '10px 0',
// //           borderRadius: '4px',
// //           backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
// //           color: message.includes('Error') ? '#721c24' : '#155724',
// //           border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
// //           whiteSpace: 'pre-line'
// //         }}>
// //           {message}
// //         </div>
// //       )}

// //       <div style={{ marginBottom: '15px' }}>
// //         <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// //           <input
// //             type="checkbox"
// //             checked={settings.enabled}
// //             onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
// //           />
// //           Enable Email Notifications
// //         </label>
// //       </div>

// //       {/* UPDATED: Email Addresses Section */}
// //       <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
// //         <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Recipient Email Addresses</h3>
        
// //         {/* Primary Email */}
// //         <div style={{ marginBottom: '15px' }}>
// //           <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
// //             Primary Email:
// //           </label>
// //           <input
// //             type="email"
// //             value={settings.fromEmail || ''}
// //             onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
// //             style={{ 
// //               width: '100%', 
// //               padding: '8px', 
// //               border: '1px solid #ddd', 
// //               borderRadius: '4px' 
// //             }}
// //             placeholder="Enter primary email address"
// //           />
// //           <small style={{ color: '#666', fontSize: '12px' }}>
// //             This will be used as the main recipient and "from" address
// //           </small>
// //         </div>

// //         {/* Additional Emails */}
// //         <div style={{ marginBottom: '15px' }}>
// //           <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
// //             Additional Email Addresses:
// //             <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#666', marginLeft: '8px' }}>
// //               ({additionalEmails.length}/5 added)
// //             </span>
// //           </label>
          
// //           {/* Add new email input */}
// //           <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
// //             <input
// //               type="email"
// //               value={newEmail}
// //               onChange={(e) => setNewEmail(e.target.value)}
// //               placeholder="Enter additional email address"
// //               style={{ 
// //                 flex: 1,
// //                 padding: '8px', 
// //                 border: '1px solid #ddd', 
// //                 borderRadius: '4px' 
// //               }}
// //               onKeyPress={(e) => {
// //                 if (e.key === 'Enter') {
// //                   addEmail();
// //                 }
// //               }}
// //             />
// //             <button
// //               onClick={addEmail}
// //               disabled={!newEmail.trim() || !canAddMoreEmails}
// //               style={{
// //                 padding: '8px 16px',
// //                 backgroundColor: newEmail.trim() && canAddMoreEmails ? '#007bff' : '#6c757d',
// //                 color: 'white',
// //                 border: 'none',
// //                 borderRadius: '4px',
// //                 cursor: newEmail.trim() && canAddMoreEmails ? 'pointer' : 'not-allowed'
// //               }}
// //             >
// //               Add
// //             </button>
// //           </div>

// //           {/* Show message when maximum reached */}
// //           {!canAddMoreEmails && (
// //             <div style={{ 
// //               padding: '8px', 
// //               backgroundColor: '#fff3cd', 
// //               border: '1px solid #ffeaa7',
// //               borderRadius: '4px',
// //               marginBottom: '10px',
// //               fontSize: '14px',
// //               color: '#856404'
// //             }}>
// //               Maximum of 5 additional email addresses reached. Remove one to add another.
// //             </div>
// //           )}

// //           {/* List of additional emails */}
// //           {additionalEmails.length > 0 && (
// //             <div style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
// //               {additionalEmails.map((email, index) => (
// //                 <div
// //                   key={index}
// //                   style={{
// //                     display: 'flex',
// //                     justifyContent: 'space-between',
// //                     alignItems: 'center',
// //                     padding: '8px 12px',
// //                     borderBottom: index < additionalEmails.length - 1 ? '1px solid #e0e0e0' : 'none',
// //                     backgroundColor: '#f9f9f9'
// //                   }}
// //                 >
// //                   <span style={{ fontSize: '14px' }}>{email}</span>
// //                   <div style={{ display: 'flex', gap: '8px' }}>
// //                     <button
// //                       onClick={() => setPrimaryEmail(email)}
// //                       style={{
// //                         padding: '4px 8px',
// //                         backgroundColor: '#28a745',
// //                         color: 'white',
// //                         border: 'none',
// //                         borderRadius: '2px',
// //                         fontSize: '12px',
// //                         cursor: 'pointer'
// //                       }}
// //                     >
// //                       Set Primary
// //                     </button>
// //                     <button
// //                       onClick={() => removeEmail(email)}
// //                       style={{
// //                         padding: '4px 8px',
// //                         backgroundColor: '#dc3545',
// //                         color: 'white',
// //                         border: 'none',
// //                         borderRadius: '2px',
// //                         fontSize: '12px',
// //                         cursor: 'pointer'
// //                       }}
// //                     >
// //                       Remove
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
          
// //           <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
// //             Analytics reports will be sent to all email addresses listed above (maximum 6 total: 1 primary + 5 additional)
// //           </small>
// //         </div>
// //       </div>

// //       <div style={{ marginBottom: '20px' }}>
// //         <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
// //           From Name:
// //         </label>
// //         <input
// //           type="text"
// //           value={settings.fromName || ''}
// //           onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
// //           style={{ 
// //             width: '100%', 
// //             padding: '8px', 
// //             border: '1px solid #ddd', 
// //             borderRadius: '4px' 
// //           }}
// //           placeholder="Store Name"
// //         />
// //       </div>

// //       {/* Automatic Scheduling Section */}
// //       <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
// //         <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Automatic Reports Schedule</h3>
        
// //         <div style={{ marginBottom: '15px' }}>
// //           <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// //             <input
// //               type="checkbox"
// //               checked={settings.scheduleEnabled || false}
// //               onChange={(e) => setSettings({ ...settings, scheduleEnabled: e.target.checked })}
// //             />
// //             Enable Daily Automatic Reports
// //           </label>
// //           <small style={{ color: '#666', fontSize: '12px', display: 'block', marginLeft: '24px' }}>
// //             Send analytics reports automatically every day to all email addresses
// //           </small>
// //         </div>

// //         {settings.scheduleEnabled && (
// //           <div style={{ marginLeft: '24px' }}>
// //             <div style={{ marginBottom: '15px' }}>
// //               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
// //                 Send Time:
// //               </label>
// //               <input
// //                 type="time"
// //                 value={settings.scheduleTime || '09:00'}
// //                 onChange={(e) => setSettings({ ...settings, scheduleTime: e.target.value })}
// //                 style={{ 
// //                   padding: '8px', 
// //                   border: '1px solid #ddd', 
// //                   borderRadius: '4px',
// //                   fontSize: '14px'
// //                 }}
// //               />
// //               <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
// //                 Daily report will be sent at this time
// //               </small>
// //             </div>

// //             <div style={{ marginBottom: '15px' }}>
// //               <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
// //                 Timezone:
// //               </label>
// //               <select
// //                 value={settings.timezone || 'UTC'}
// //                 onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
// //                 style={{ 
// //                   width: '100%',
// //                   padding: '8px', 
// //                   border: '1px solid #ddd', 
// //                   borderRadius: '4px',
// //                   fontSize: '14px'
// //                 }}
// //               >
// //                 <option value="UTC">UTC</option>
// //                 <option value="America/New_York">Eastern Time (ET)</option>
// //                 <option value="America/Chicago">Central Time (CT)</option>
// //                 <option value="America/Denver">Mountain Time (MT)</option>
// //                 <option value="America/Los_Angeles">Pacific Time (PT)</option>
// //                 <option value="Europe/London">London (GMT)</option>
// //                 <option value="Europe/Paris">Paris (CET)</option>
// //                 <option value="Asia/Dubai">Dubai (GST)</option>
// //                 <option value="Asia/Kolkata">India (IST)</option>
// //                 <option value="Asia/Tokyo">Tokyo (JST)</option>
// //                 <option value="Australia/Sydney">Sydney (AEST)</option>
// //               </select>
// //               <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
// //                 Select your local timezone
// //               </small>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
// //         <button 
// //           onClick={saveSettings} 
// //           disabled={saving}
// //           style={{
// //             padding: '10px 20px',
// //             backgroundColor: '#007bff',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '4px',
// //             cursor: saving ? 'not-allowed' : 'pointer'
// //           }}
// //         >
// //           {saving ? 'Saving...' : 'Save Settings'}
// //         </button>
        
// //         <button 
// //           onClick={sendAnalyticsReport} 
// //           disabled={sending || !settings.enabled}
// //           style={{
// //             padding: '10px 20px',
// //             backgroundColor: settings.enabled ? '#28a745' : '#6c757d',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '4px',
// //             cursor: (sending || !settings.enabled) ? 'not-allowed' : 'pointer'
// //           }}
// //         >
// //           {sending ? 'Sending...' : 'Send Analytics Report'}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState, useEffect } from 'react';

// interface StoreEmailSettings {
//   id: string;
//   shop: string;
//   fromEmail: string;
//   fromName: string;
//   enabled: boolean;
//   additionalEmails: string[];
//   scheduleEnabled: boolean;
//   scheduleTime: string;
//   timezone: string;
// }

// export default function EmailSettings() {
//   const [settings, setSettings] = useState<StoreEmailSettings | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [message, setMessage] = useState('');
//   const [newEmail, setNewEmail] = useState('');

//   useEffect(() => {
//     loadSettings();
//   }, []);

//   const loadSettings = async () => {
//     try {
//       const response = await fetch('/app/api/email-settings');
//       const data = await response.json();

//       if (data.settings) {
//         setSettings(data.settings);
//       } else {
//         await createDefaultSettings();
//       }
//     } catch (error) {
//       console.error('Failed to load settings:', error);
//       setMessage('Error loading settings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createDefaultSettings = async () => {
//     try {
//       const defaultSettings = {
//         fromEmail: "info@nexusbling.com",
//         fromName: "Store",
//         enabled: true,
//         additionalEmails: [],
//         scheduleEnabled: false,
//         scheduleTime: "09:00",
//         timezone: "UTC"
//       };
      
//       const response = await fetch('/app/api/email-settings', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(defaultSettings),
//       });
      
//       const data = await response.json();
//       if (response.ok) {
//         const safeSettings = {
//           ...data.settings,
//           additionalEmails: data.settings?.additionalEmails || []
//         };
//         setSettings(safeSettings);
//       }
//     } catch (error) {
//       console.error('Error creating default settings:', error);
//     }
//   };

//   const saveSettings = async () => {
//     if (!settings) return;
//     setSaving(true);
//     setMessage('');
//     try {
//       const response = await fetch('/app/api/email-settings', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(settings),
//       });
//       const data = await response.json();
//       setMessage(response.ok ? 'Settings saved successfully!' : 'Failed to save settings');
//     } catch (error) {
//       console.error('Save error:', error);
//       setMessage('Error saving settings');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const sendAnalyticsReport = async () => {
//     if (!settings) { 
//       setMessage('Please save settings first'); 
//       return; 
//     }
    
//     const allEmails = [
//       settings.fromEmail,
//       ...(settings.additionalEmails || [])
//     ].filter(email => email && email.trim());

//     if (allEmails.length === 0) {
//       setMessage('Please set at least one recipient email address first');
//       return;
//     }

//     setSending(true);
//     setMessage('');
//     try {
//       const response = await fetch('/app/api/send-analytics-report', { 
//         method: 'POST' 
//       });
//       const data = await response.json();
      
//       if (response.ok) {
//         setMessage(`Analytics report sent successfully to ${allEmails.length} email(s)!`);
//       } else {
//         setMessage(`Failed to send report: ${data.error || 'Unknown error'}`);
//       }
//     } catch (error: any) {
//       console.error('Send report error:', error);
//       setMessage(`Error sending report: ${error.message}`);
//     } finally {
//       setSending(false);
//     }
//   };

//   const addEmail = () => {
//     if (!settings || !newEmail.trim()) return;
    
//     const currentAdditionalEmails = settings.additionalEmails || [];
    
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(newEmail)) {
//       setMessage('Please enter a valid email address');
//       return;
//     }

//     const allEmails = [settings.fromEmail, ...currentAdditionalEmails];
//     if (allEmails.includes(newEmail)) {
//       setMessage('This email address is already added');
//       return;
//     }

//     if (currentAdditionalEmails.length >= 5) {
//       setMessage('Maximum of 5 additional email addresses allowed');
//       return;
//     }

//     setSettings({
//       ...settings,
//       additionalEmails: [...currentAdditionalEmails, newEmail.trim()]
//     });
//     setNewEmail('');
//     setMessage('');
//   };

//   const removeEmail = (emailToRemove: string) => {
//     if (!settings) return;
    
//     const currentAdditionalEmails = settings.additionalEmails || [];
    
//     setSettings({
//       ...settings,
//       additionalEmails: currentAdditionalEmails.filter(email => email !== emailToRemove)
//     });
//   };

//   const setPrimaryEmail = (email: string) => {
//     if (!settings) return;
    
//     const currentAdditionalEmails = settings.additionalEmails || [];
    
//     const newAdditionalEmails = currentAdditionalEmails.filter(e => e !== email);
    
//     if (settings.fromEmail) {
//       newAdditionalEmails.push(settings.fromEmail);
//     }
    
//     setSettings({
//       ...settings,
//       fromEmail: email,
//       additionalEmails: newAdditionalEmails
//     });
//   };

//   const additionalEmails = settings?.additionalEmails || [];
//   const canAddMoreEmails = additionalEmails.length < 5;

//   if (loading) return <div>Loading settings...</div>;
//   if (!settings) return <div>Unable to load or create settings.</div>;

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>Email Settings</h1>
      
//       {message && (
//         <div style={{
//           ...styles.message,
//           backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
//           color: message.includes('Error') ? '#721c24' : '#155724',
//           border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
//         }}>
//           {message}
//         </div>
//       )}

//       <div style={styles.checkboxContainer}>
//         <label style={styles.checkboxLabel}>
//           <input
//             type="checkbox"
//             checked={settings.enabled}
//             onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
//             style={styles.checkbox}
//           />
//           Enable Email Notifications
//         </label>
//       </div>

//       {/* Email Addresses Section */}
//       <div style={styles.section}>
//         <h3 style={styles.sectionTitle}>Recipient Email Addresses</h3>
        
//         {/* Primary Email */}
//         <div style={styles.inputGroup}>
//           <label style={styles.label}>
//             Primary Email:
//           </label>
//           <input
//             type="email"
//             value={settings.fromEmail || ''}
//             onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
//             style={styles.input}
//             placeholder="Enter primary email address"
//           />
//           <small style={styles.helperText}>
//             This will be used as the main recipient and "from" address
//           </small>
//         </div>

//         {/* Additional Emails */}
//         <div style={styles.inputGroup}>
//           <label style={styles.label}>
//             Additional Email Addresses:
//             <span style={styles.counter}>
//               ({additionalEmails.length}/5 added)
//             </span>
//           </label>
          
//           {/* Add new email input */}
//           <div style={styles.addEmailContainer}>
//             <input
//               type="email"
//               value={newEmail}
//               onChange={(e) => setNewEmail(e.target.value)}
//               placeholder="Enter additional email address"
//               style={styles.emailInput}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') {
//                   addEmail();
//                 }
//               }}
//             />
//             <button
//               onClick={addEmail}
//               disabled={!newEmail.trim() || !canAddMoreEmails}
//               style={{
//                 ...styles.addButton,
//                 backgroundColor: newEmail.trim() && canAddMoreEmails ? '#007bff' : '#6c757d',
//                 cursor: newEmail.trim() && canAddMoreEmails ? 'pointer' : 'not-allowed'
//               }}
//             >
//               Add
//             </button>
//           </div>

//           {/* Show message when maximum reached */}
//           {!canAddMoreEmails && (
//             <div style={styles.warningMessage}>
//               Maximum of 5 additional email addresses reached. Remove one to add another.
//             </div>
//           )}

//           {/* List of additional emails */}
//           {additionalEmails.length > 0 && (
//             <div style={styles.emailList}>
//               {additionalEmails.map((email, index) => (
//                 <div
//                   key={index}
//                   style={styles.emailItem}
//                 >
//                   <span style={styles.emailText}>{email}</span>
//                   <div style={styles.emailActions}>
//                     <button
//                       onClick={() => setPrimaryEmail(email)}
//                       style={styles.primaryButton}
//                     >
//                       Set Primary
//                     </button>
//                     <button
//                       onClick={() => removeEmail(email)}
//                       style={styles.removeButton}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
          
//           <small style={styles.helperText}>
//             Analytics reports will be sent to all email addresses listed above (maximum 6 total: 1 primary + 5 additional)
//           </small>
//         </div>
//       </div>

//       <div style={styles.inputGroup}>
//         <label style={styles.label}>
//           From Name:
//         </label>
//         <input
//           type="text"
//           value={settings.fromName || ''}
//           onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
//           style={styles.input}
//           placeholder="Store Name"
//         />
//       </div>

//       {/* Automatic Scheduling Section */}
//       <div style={styles.section}>
//         <h3 style={styles.sectionTitle}>Automatic Reports Schedule</h3>
        
//         <div style={styles.checkboxContainer}>
//           <label style={styles.checkboxLabel}>
//             <input
//               type="checkbox"
//               checked={settings.scheduleEnabled || false}
//               onChange={(e) => setSettings({ ...settings, scheduleEnabled: e.target.checked })}
//               style={styles.checkbox}
//             />
//             Enable Daily Automatic Reports
//           </label>
//           <small style={styles.helperText}>
//             Send analytics reports automatically every day to all email addresses
//           </small>
//         </div>

//         {settings.scheduleEnabled && (
//           <div style={styles.scheduleSettings}>
//             <div style={styles.inputGroup}>
//               <label style={styles.label}>
//                 Send Time:
//               </label>
//               <input
//                 type="time"
//                 value={settings.scheduleTime || '09:00'}
//                 step="60" // Only allow whole hours
//                 onChange={(e) => setSettings({ ...settings, scheduleTime: e.target.value })}
//                 style={styles.timeInput}
//               />
//               <small style={styles.helperText}>
//                 Daily report will be sent at this time
//               </small>
//             </div>

//             <div style={styles.inputGroup}>
//               <label style={styles.label}>
//                 Timezone:
//               </label>
//               <select
//   value={settings.timezone || 'UTC'}
//   onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
// >
//   <option value="UTC">UTC</option>
//   <option value="America/New_York">Eastern Time (ET)</option>
//   <option value="America/Chicago">Central Time (CT)</option>
//   <option value="America/Denver">Mountain Time (MT)</option>
//   <option value="America/Los_Angeles">Pacific Time (PT)</option>
//   <option value="Europe/London">London (GMT)</option>
//   <option value="Europe/Paris">Paris (CET)</option>
//   <option value="Asia/Dubai">Dubai (GST)</option>
//   <option value="Asia/Kolkata">India (IST)</option>
//   <option value="Asia/Tokyo">Tokyo (JST)</option>
//   <option value="Australia/Sydney">Sydney (AEST)</option>
// </select>
//               <small style={styles.helperText}>
//                 Select your local timezone
//               </small>
//             </div>
//           </div>
//         )}
//       </div>

//       <div style={styles.buttonContainer}>
//         <button 
//           onClick={saveSettings} 
//           disabled={saving}
//           style={{
//             ...styles.button,
//             ...styles.primaryButton,
//             opacity: saving ? 0.6 : 1
//           }}
//         >
//           {saving ? 'Saving...' : 'Save Settings'}
//         </button>
        
//         <button 
//           onClick={sendAnalyticsReport} 
//           disabled={sending || !settings.enabled}
//           style={{
//             ...styles.button,
//             ...styles.successButton,
//             backgroundColor: settings.enabled ? '#28a745' : '#6c757d',
//             opacity: (sending || !settings.enabled) ? 0.6 : 1
//           }}
//         >
//           {sending ? 'Sending...' : 'Send Analytics Report'}
//         </button>
//       </div>
//     </div>
//   );
// }

// // Responsive CSS Styles
// const styles = {
//   container: {
//     padding: '20px',
//     maxWidth: '600px',
//     margin: '0 auto',
//     width: '100%',
//     boxSizing: 'border-box' as const,
//   },
//   title: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     marginBottom: '20px',
//     color: '#333',
//   },
//   message: {
//     padding: '12px',
//     margin: '10px 0',
//     borderRadius: '6px',
//     whiteSpace: 'pre-line' as const,
//     fontSize: '14px',
//   },
//   section: {
//     marginBottom: '20px',
//     padding: '16px',
//     border: '1px solid #e0e0e0',
//     borderRadius: '8px',
//     backgroundColor: '#fff',
//   },
//   sectionTitle: {
//     marginTop: 0,
//     marginBottom: '16px',
//     fontSize: '18px',
//     fontWeight: '600',
//     color: '#333',
//   },
//   inputGroup: {
//     marginBottom: '16px',
//   },
//   label: {
//     display: 'block',
//     marginBottom: '6px',
//     fontWeight: '600',
//     color: '#333',
//     fontSize: '14px',
//   },
//   counter: {
//     fontSize: '12px',
//     fontWeight: 'normal',
//     color: '#666',
//     marginLeft: '8px',
//   },
//   input: {
//     width: '100%',
//     padding: '10px 12px',
//     border: '1px solid #ddd',
//     borderRadius: '6px',
//     fontSize: '14px',
//     boxSizing: 'border-box' as const,
//   },
//   emailInput: {
//     flex: 1,
//     padding: '10px 12px',
//     border: '1px solid #ddd',
//     borderRadius: '6px',
//     fontSize: '14px',
//     minWidth: '0', // Important for flexbox shrinking
//   },
//   timeInput: {
//     padding: '10px 12px',
//     border: '1px solid #ddd',
//     borderRadius: '6px',
//     fontSize: '14px',
//     width: '100%',
//     boxSizing: 'border-box' as const,
//   },
//   select: {
//     width: '100%',
//     padding: '10px 12px',
//     border: '1px solid #ddd',
//     borderRadius: '6px',
//     fontSize: '14px',
//     boxSizing: 'border-box' as const,
//   },
//   helperText: {
//     color: '#666',
//     fontSize: '12px',
//     display: 'block',
//     marginTop: '4px',
//     lineHeight: '1.4',
//   },
//   checkboxContainer: {
//     marginBottom: '16px',
//   },
//   checkboxLabel: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     fontSize: '14px',
//     color: '#333',
//   },
//   checkbox: {
//     margin: 0,
//   },
//   addEmailContainer: {
//     display: 'flex',
//     gap: '10px',
//     marginBottom: '12px',
//     flexDirection: 'row' as const,
//     alignItems: 'stretch',
//   },
//   addButton: {
//     padding: '10px 16px',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     fontSize: '14px',
//     whiteSpace: 'nowrap' as const,
//     minWidth: '60px',
//   },
//   emailList: {
//     border: '1px solid #e0e0e0',
//     borderRadius: '6px',
//     marginBottom: '12px',
//     overflow: 'hidden',
//   },
//   emailItem: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '12px',
//     borderBottom: '1px solid #f0f0f0',
//     backgroundColor: '#f9f9f9',
//     flexWrap: 'wrap' as const,
//     gap: '8px',
//   },
//   emailText: {
//     fontSize: '14px',
//     flex: 1,
//     minWidth: '120px',
//     wordBreak: 'break-all' as const,
//   },
//   emailActions: {
//     display: 'flex',
//     gap: '8px',
//     flexWrap: 'wrap' as const,
//   },
//   primaryButton: {
//     padding: '6px 12px',
//     backgroundColor: '#28a745',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     fontSize: '12px',
//     cursor: 'pointer',
//     whiteSpace: 'nowrap' as const,
//   },
//   removeButton: {
//     padding: '6px 12px',
//     backgroundColor: '#dc3545',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     fontSize: '12px',
//     cursor: 'pointer',
//     whiteSpace: 'nowrap' as const,
//   },
//   warningMessage: {
//     padding: '10px',
//     backgroundColor: '#fff3cd',
//     border: '1px solid #ffeaa7',
//     borderRadius: '6px',
//     marginBottom: '12px',
//     fontSize: '13px',
//     color: '#856404',
//   },
//   scheduleSettings: {
//     marginLeft: '0',
//     paddingLeft: '0',
//   },
//   buttonContainer: {
//     display: 'flex',
//     gap: '12px',
//     flexWrap: 'wrap' as const,
//     marginBottom: '20px',
//   },
//   button: {
//     padding: '12px 20px',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     fontSize: '14px',
//     cursor: 'pointer',
//     flex: 1,
//     minWidth: '140px',
//     textAlign: 'center' as const,
//   },
//   successButton: {
//     backgroundColor: '#28a745',
//   },
// };

// // Media queries for responsive design (you can add these to your global CSS or use a CSS-in-JS solution)
// // @media (max-width: 768px) {
// //   .container { padding: 16px; }
// //   .addEmailContainer { flex-direction: column; }
// //   .emailActions { justify-content: flex-start; }
// //   .buttonContainer { flex-direction: column; }
// // }


import { useState, useEffect } from 'react';

interface StoreEmailSettings {
  id: string;
  shop: string;
  fromEmail: string;
  fromName: string;
  enabled: boolean;
  additionalEmails: string[];
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
  const [newEmail, setNewEmail] = useState('');

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
        additionalEmails: [],
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
      if (response.ok) {
        const safeSettings = {
          ...data.settings,
          additionalEmails: data.settings?.additionalEmails || []
        };
        setSettings(safeSettings);
      }
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
    
    const allEmails = [
      settings.fromEmail,
      ...(settings.additionalEmails || [])
    ].filter(email => email && email.trim());

    if (allEmails.length === 0) {
      setMessage('Please set at least one recipient email address first');
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
        setMessage(`Analytics report sent successfully to ${allEmails.length} email(s)!`);
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

  const addEmail = () => {
    if (!settings || !newEmail.trim()) return;
    
    const currentAdditionalEmails = settings.additionalEmails || [];
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setMessage('Please enter a valid email address');
      return;
    }

    const allEmails = [settings.fromEmail, ...currentAdditionalEmails];
    if (allEmails.includes(newEmail)) {
      setMessage('This email address is already added');
      return;
    }

    if (currentAdditionalEmails.length >= 5) {
      setMessage('Maximum of 5 additional email addresses allowed');
      return;
    }

    setSettings({
      ...settings,
      additionalEmails: [...currentAdditionalEmails, newEmail.trim()]
    });
    setNewEmail('');
    setMessage('');
  };

  const removeEmail = (emailToRemove: string) => {
    if (!settings) return;
    
    const currentAdditionalEmails = settings.additionalEmails || [];
    
    setSettings({
      ...settings,
      additionalEmails: currentAdditionalEmails.filter(email => email !== emailToRemove)
    });
  };

  const setPrimaryEmail = (email: string) => {
    if (!settings) return;
    
    const currentAdditionalEmails = settings.additionalEmails || [];
    const newAdditionalEmails = currentAdditionalEmails.filter(e => e !== email);
    
    if (settings.fromEmail) {
      newAdditionalEmails.push(settings.fromEmail);
    }
    
    setSettings({
      ...settings,
      fromEmail: email,
      additionalEmails: newAdditionalEmails
    });
  };

  // Styles
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box' as const,
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
    },
    message: {
      padding: '12px',
      margin: '10px 0',
      borderRadius: '6px',
      whiteSpace: 'pre-line' as const,
      fontSize: '14px',
    },
    section: {
      marginBottom: '20px',
      padding: '16px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fff',
    },
    sectionTitle: {
      marginTop: 0,
      marginBottom: '16px',
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
    },
    inputGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '600',
      color: '#333',
      fontSize: '14px',
    },
    counter: {
      fontSize: '12px',
      fontWeight: 'normal',
      color: '#666',
      marginLeft: '8px',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box' as const,
    },
    emailInput: {
      flex: 1,
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      minWidth: '0',
    },
    timeInput: {
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box' as const,
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box' as const,
    },
    helperText: {
      color: '#666',
      fontSize: '12px',
      display: 'block',
      marginTop: '4px',
      lineHeight: '1.4',
    },
    checkboxContainer: {
      marginBottom: '16px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#333',
    },
    checkbox: {
      margin: 0,
    },
    addEmailContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '12px',
      flexDirection: 'row' as const,
      alignItems: 'stretch',
    },
    addButton: {
      padding: '10px 16px',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      whiteSpace: 'nowrap' as const,
      minWidth: '60px',
    },
    emailList: {
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      marginBottom: '12px',
      overflow: 'hidden',
    },
    emailItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      borderBottom: '1px solid #f0f0f0',
      backgroundColor: '#f9f9f9',
      flexWrap: 'wrap' as const,
      gap: '8px',
    },
    emailText: {
      fontSize: '14px',
      flex: 1,
      minWidth: '120px',
      wordBreak: 'break-all' as const,
    },
    emailActions: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap' as const,
    },
    primaryButton: {
      padding: '6px 12px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
    },
    removeButton: {
      padding: '6px 12px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
    },
    warningMessage: {
      padding: '10px',
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '6px',
      marginBottom: '12px',
      fontSize: '13px',
      color: '#856404',
    },
    scheduleSettings: {
      marginLeft: '0',
      paddingLeft: '0',
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap' as const,
      marginBottom: '20px',
    },
    button: {
      padding: '12px 20px',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      flex: 1,
      minWidth: '140px',
      textAlign: 'center' as const,
    },
  };

  const additionalEmails = settings?.additionalEmails || [];
  const canAddMoreEmails = additionalEmails.length < 5;

  if (loading) return <div>Loading settings...</div>;
  if (!settings) return <div>Unable to load or create settings.</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Email Settings</h1>
      
      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724',
          border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
        }}>
          {message}
        </div>
      )}

      <div style={styles.checkboxContainer}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
            style={styles.checkbox}
          />
          Enable Email Notifications
        </label>
      </div>

      {/* Email Addresses Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recipient Email Addresses</h3>
        
        {/* Primary Email */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Primary Email:
          </label>
          <input
            type="email"
            value={settings.fromEmail || ''}
            onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
            style={styles.input}
            placeholder="Enter primary email address"
          />
          <small style={styles.helperText}>
            This will be used as the main recipient and "from" address
          </small>
        </div>

        {/* Additional Emails */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Additional Email Addresses:
            <span style={styles.counter}>
              ({additionalEmails.length}/5 added)
            </span>
          </label>
          
          {/* Add new email input */}
          <div style={styles.addEmailContainer}>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter additional email address"
              style={styles.emailInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addEmail();
                }
              }}
            />
            <button
              onClick={addEmail}
              disabled={!newEmail.trim() || !canAddMoreEmails}
              style={{
                ...styles.addButton,
                backgroundColor: newEmail.trim() && canAddMoreEmails ? '#007bff' : '#6c757d',
                cursor: newEmail.trim() && canAddMoreEmails ? 'pointer' : 'not-allowed'
              }}
            >
              Add
            </button>
          </div>

          {/* Show message when maximum reached */}
          {!canAddMoreEmails && (
            <div style={styles.warningMessage}>
              Maximum of 5 additional email addresses reached. Remove one to add another.
            </div>
          )}

          {/* List of additional emails */}
          {additionalEmails.length > 0 && (
            <div style={styles.emailList}>
              {additionalEmails.map((email, index) => (
                <div
                  key={index}
                  style={styles.emailItem}
                >
                  <span style={styles.emailText}>{email}</span>
                  <div style={styles.emailActions}>
                    <button
                      onClick={() => setPrimaryEmail(email)}
                      style={styles.primaryButton}
                    >
                      Set Primary
                    </button>
                    <button
                      onClick={() => removeEmail(email)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <small style={styles.helperText}>
            Analytics reports will be sent to all email addresses listed above (maximum 6 total: 1 primary + 5 additional)
          </small>
        </div>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>
          From Name:
        </label>
        <input
          type="text"
          value={settings.fromName || ''}
          onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
          style={styles.input}
          placeholder="Store Name"
        />
      </div>

      {/* Automatic Scheduling Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Automatic Reports Schedule</h3>
        
        <div style={styles.checkboxContainer}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={settings.scheduleEnabled || false}
              onChange={(e) => setSettings({ ...settings, scheduleEnabled: e.target.checked })}
              style={styles.checkbox}
            />
            Enable Daily Automatic Reports
          </label>
          <small style={styles.helperText}>
            Send analytics reports automatically every day to all email addresses
          </small>
        </div>

        {settings.scheduleEnabled && (
          <div style={styles.scheduleSettings}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Send Time:
              </label>
              <input
                type="time"
                value={settings.scheduleTime || '09:00'}
                onChange={(e) => setSettings({ ...settings, scheduleTime: e.target.value })}
                style={styles.timeInput}
                step="60"
              />
              <small style={styles.helperText}>
                Daily report will be sent at this time (24-hour format)
              </small>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Timezone:
              </label>
              <select
                value={settings.timezone || 'UTC'}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                style={styles.select}
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
              <small style={styles.helperText}>
                Select your local timezone
              </small>
            </div>
          </div>
        )}
      </div>

      <div style={styles.buttonContainer}>
        <button 
          onClick={saveSettings} 
          disabled={saving}
          style={{
            ...styles.button,
            backgroundColor: '#007bff',
            opacity: saving ? 0.6 : 1
          }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        
        <button 
          onClick={sendAnalyticsReport} 
          disabled={sending || !settings.enabled}
          style={{
            ...styles.button,
            backgroundColor: settings.enabled ? '#28a745' : '#6c757d',
            opacity: (sending || !settings.enabled) ? 0.6 : 1,
            cursor: (sending || !settings.enabled) ? 'not-allowed' : 'pointer'
          }}
        >
          {sending ? 'Sending...' : 'Send Test Report Now'}
        </button>
      </div>

      {/* Information Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>How It Works</h3>
        <div style={styles.helperText}>
          <p><strong>Email Notifications:</strong> When enabled, the system will send daily analytics reports with your store performance data.</p>
          <p><strong>Recipient Emails:</strong> Add up to 6 email addresses (1 primary + 5 additional) to receive reports.</p>
          <p><strong>Automatic Schedule:</strong> Set a specific time for daily reports to be sent automatically.</p>
          <p><strong>Manual Testing:</strong> Use "Send Test Report Now" to immediately send a report with current data.</p>
        </div>
      </div>
    </div>
  );
}