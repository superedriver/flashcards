export type PermissionStatusInfo = {
  color: string
  description?: string
  label: string
}

export function formatPermissionStatus(status: string): PermissionStatusInfo {
  switch (status) {
    case 'denied':
      return {
        color: '#c62828',
        description:
          'Notifications are blocked. Enable them in your device settings, then try again here.',
        label: 'Denied',
      }
    case 'granted':
      return {
        color: '#2e7d32',
        label: 'Granted',
      }
    case 'unsupported':
      return {
        color: '#666666',
        description: 'Push notifications are not available on web in this MVP.',
        label: 'Not available',
      }
    default:
      return {
        color: '#666666',
        label: 'Unknown',
      }
  }
}
