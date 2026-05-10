import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.myposha.app',
  appName: 'Posha',
  webDir: 'www',
  server: {
    url: 'https://www.myposha.com',
    cleartext: false,
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
