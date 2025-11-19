import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  supabase: {
    url: 'https://phvfsgenlyqugeodlqqu.supabase.co',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBodmZzZ2VubHlxdWdlb2RscXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTk2OTUsImV4cCI6MjA3NzczNTY5NX0.JBwzevcv2suxQQv47F_P7lpWPMEpF3cC0ppkkZpqKSc',
    storage: {
      documentBucket: 'blueprint-documents'
    }
  },
  cwa: {
    apiKey: 'CWA-094B64D7-E44E-4B1C-89F4-C7A9AEB7408A'
  }
} as Environment;
