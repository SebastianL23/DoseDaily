'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface DiscountCodeInputProps {
  onDiscountApplied: (discount: {
    type: 'percentage' | 'fixed';
    value: number;
    minPurchaseAmount?: number;
  }) => void;
}

export function DiscountCodeInput({ onDiscountApplied }: DiscountCodeInputProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApplyCode = async () => {
    if (!code.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a discount code',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/validate-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.valid) {
        onDiscountApplied(data.discount);
        toast({
          title: 'Success',
          description: 'Discount code applied successfully!',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply discount code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter discount code"
          className="flex-1 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        />
        <Button
          onClick={handleApplyCode}
          disabled={isLoading}
          className="bg-moss-500 hover:bg-moss-600"
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </Button>
      </div>
    </div>
  );
} 