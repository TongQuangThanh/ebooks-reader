import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thnvn.ebooks',
  appName: 'Ebooks Reader',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
