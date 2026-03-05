import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tradingjournal.app",
  appName: "Trading Journal",
  webDir: "out",
  server: {
    // Point this to your deployed Next.js URL for real devices.
    // For local testing with an emulator, you can use your machine's LAN IP.
    url: "http://localhost:3000",
    cleartext: true,
  },
};

export default config;
