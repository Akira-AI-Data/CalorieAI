import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.myposha.app',
  appName: 'Posha',
  webDir: 'www',
  server: {
    url: 'https://www.myposha.com',
    cleartext: false,
  },
};

export default config;
