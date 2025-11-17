// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import * as MOCKDATA from '@_mock';
import { mockInterceptor, provideMockConfig } from '@delon/mock';
import { Environment } from '@delon/theme';

export const environment = {
  production: false,
  useHash: true,
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  providers: [provideMockConfig({ data: MOCKDATA })],
  interceptorFns: [mockInterceptor],
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
