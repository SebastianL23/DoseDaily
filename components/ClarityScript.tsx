'use client';

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

export default function ClarityScript() {
  useEffect(() => {
    // Initialize Clarity
    clarity.init("rtaggmrat7"); 
  }, []);

  return null;
} 