/**
 * Feature Flags Configuration
 * Set ENABLE_AI_FEATURES to true to enable the AI Math Tutor & Assistant features.
 * Can be controlled via environment variable VITE_ENABLE_AI_FEATURES (e.g. VITE_ENABLE_AI_FEATURES=true).
 */

export const FEATURE_FLAGS = {
  // AI Assistant & Tutor feature flag (default: false until AI infrastructure is ready)
  ENABLE_AI_FEATURES: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true' || false,
};
