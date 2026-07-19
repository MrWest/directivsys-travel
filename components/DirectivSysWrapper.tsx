'use client';
import { ReactNode } from 'react';
import { DirectivSysProvider } from '@directivsys/react-sdk';

export function DirectivSysWrapper({ children }: { children: ReactNode }) {
  return (
    <DirectivSysProvider
      apiKey="dsk_bf71c83699c84f26a2bc5f7ce6b973a3"
      config={{
        baseURL: 'https://staging-api.directivsys.com',
        timeout: 30000,
      }}
    >
      {children}
    </DirectivSysProvider>
  );
}
