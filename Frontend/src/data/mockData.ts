export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PermissionStatus = 'Added' | 'Removed' | 'Unchanged';

export interface PermissionRow {
  name: string;
  status: PermissionStatus;
  oldValue: string;
  newValue: string;
  description: string;
}

export interface PrivacyChange {
  title: string;
  description: string;
  impact: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface AnalysisData {
  old_version: string;
  new_version: string;
  permissions_added: string[];
  permissions_removed: string[];
  risk_level: RiskLevel;
  permissions: PermissionRow[];
  privacyChanges: PrivacyChange[];
}

export const mockAnalysisData: AnalysisData = {
  old_version: '2.8.4',
  new_version: '3.2.1',
  permissions_added: ['POST_NOTIFICATIONS', 'ACCESS_BACKGROUND_LOCATION'],
  permissions_removed: ['READ_CONTACTS'],
  risk_level: 'HIGH',
  permissions: [
    {
      name: 'CAMERA',
      status: 'Unchanged',
      oldValue: 'Granted',
      newValue: 'Granted',
      description: 'Camera access remains necessary for document scanning.'
    },
    {
      name: 'MICROPHONE',
      status: 'Added',
      oldValue: 'Not requested',
      newValue: 'Requested',
      description: 'Audio capture was newly added for voice-enabled verification.'
    },
    {
      name: 'READ_CONTACTS',
      status: 'Removed',
      oldValue: 'Requested',
      newValue: 'Not requested',
      description: 'Contact listing access was removed from the newer build.'
    },
    {
      name: 'ACCESS_FINE_LOCATION',
      status: 'Added',
      oldValue: 'Not requested',
      newValue: 'Granted',
      description: 'Precise-location access was introduced for geofencing features.'
    },
    {
      name: 'READ_SMS',
      status: 'Unchanged',
      oldValue: 'Not requested',
      newValue: 'Not requested',
      description: 'No change to SMS access behavior.'
    }
  ],
  privacyChanges: [
    {
      title: 'Background location tracking is now enabled',
      description: 'The app can determine location while the app is idle, which increases user surveillance concerns.',
      impact: 'The user may be tracked even when the app is not actively in use.',
      severity: 'High'
    },
    {
      title: 'Microphone access was added without a clear user purpose',
      description: 'Voice capture is now part of the onboarding flow, but the UI does not clearly explain why it is collected.',
      impact: 'This expands the scope of consent and may reduce trust in the app.',
      severity: 'Medium'
    },
    {
      title: 'Notification permission increased response visibility',
      description: 'Push notifications are now enabled to show alerts and reminders in the background.',
      impact: 'This can increase interruptive behavior if not carefully limited.',
      severity: 'Low'
    }
  ]
};
