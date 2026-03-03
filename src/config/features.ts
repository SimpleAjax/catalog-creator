// Feature flags configuration
// Use these flags to enable/disable features

export const FEATURES = {
  // Image export feature - disabled for now due to stability issues
  IMAGE_EXPORT_ENABLED: false,
  
  // PDF export feature - always enabled
  PDF_EXPORT_ENABLED: true,
  
  // WhatsApp direct share
  WHATSAPP_SHARE_ENABLED: true,
} as const;

// Helper to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof typeof FEATURES): boolean => {
  return FEATURES[feature];
};
