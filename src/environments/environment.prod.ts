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
    url: 'https://pfxxjtvnqptdvjfakotc.supabase.co',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmeHhqdHZucXB0ZHZqZmFrb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzgwNjMsImV4cCI6MjA3ODY1NDA2M30.xADVH2fTd4059lZSZWpIM6CSeiixm0VCgN0SC5bKGxo',
    storage: {
      documentBucket: 'blueprint-documents'
    }
  }
} as Environment;
