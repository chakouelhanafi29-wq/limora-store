import { BetaAnalyticsDataClient } from "@google-analytics/data";

let cachedClient: BetaAnalyticsDataClient | null = null;
let cachedJson: string | null = null;

export function createGa4DataClient(serviceAccountJson: string): BetaAnalyticsDataClient {
  if (cachedClient && cachedJson === serviceAccountJson) {
    return cachedClient;
  }

  const credentials = JSON.parse(serviceAccountJson) as {
    client_email?: string;
    private_key?: string;
  };

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("Invalid GA4 service account JSON");
  }

  cachedClient = new BetaAnalyticsDataClient({ credentials });
  cachedJson = serviceAccountJson;
  return cachedClient;
}

export function ga4PropertyPath(propertyId: string): string {
  return `properties/${propertyId}`;
}
