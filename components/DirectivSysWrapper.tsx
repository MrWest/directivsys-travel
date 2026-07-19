'use client';
import { ReactNode } from 'react';
import { DirectivSysProvider } from '@directivsys/react-sdk';

export function DirectivSysWrapper({ children }: { children: ReactNode }) {
  return (
    <DirectivSysProvider
      apiKey="dsk_ac71a83699c84f26a2bc5f7ce6b953d4"
      config={{
        baseURL: 'https://staging-api.directivsys.com',
        timeout: 30000,
      }}
    >
      {children}
    </DirectivSysProvider>
  );
}
