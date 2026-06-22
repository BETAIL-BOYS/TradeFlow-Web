'use client';

import React from 'react';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import SessionExpiredModal from './SessionExpiredModal';

export default function SessionTimeoutProvider() {
  const { isExpired, dismissExpiry } = useSessionTimeout();
  return <SessionExpiredModal isOpen={isExpired} onReconnect={dismissExpiry} />;
}
