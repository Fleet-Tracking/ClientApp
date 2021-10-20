import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.symbiosis.FleetTracker',
  appPath: 'app',
  appResourcesPath: 'app/App_Resources',

  // https://stackoverflow.com/questions/68387270/android-studio-error-installed-build-tools-revision-31-0-0-is-corrupted
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  }
} as NativeScriptConfig;