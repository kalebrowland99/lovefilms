'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { NATIONWIDE_COPY, type LocationCopy } from '@/lib/location-copy';

const VisitorLocationContext = createContext<LocationCopy>(NATIONWIDE_COPY);

export function VisitorLocationProvider({
  copy,
  children,
}: {
  copy: LocationCopy;
  children: ReactNode;
}) {
  return (
    <VisitorLocationContext.Provider value={copy}>
      {children}
    </VisitorLocationContext.Provider>
  );
}

export function useLocationCopy() {
  return useContext(VisitorLocationContext);
}
