const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration for Expo/React Native
 * Add support for bundling .csv files as assets
 */
const config = getDefaultConfig(__dirname);

// Ensure CSV and PDF files are treated as assets so they can be required and loaded
if (!config.resolver.assetExts.includes('csv')) {
  config.resolver.assetExts.push('csv');
}
if (!config.resolver.assetExts.includes('pdf')) {
  config.resolver.assetExts.push('pdf');
}

module.exports = config;
