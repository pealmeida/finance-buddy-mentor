
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Base hook for Supabase operations with shared loading and error states
 */
export function useSupabaseBase() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleError = (err: any, customMessage?: string) => {
    console.error(customMessage || "Error in Supabase operation:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    setError(errorMessage);
    
    toast({
      title: customMessage || "Error",
      description: errorMessage,
      variant: "destructive"
    });
    
    return null;
  };

  return {
    loading,
    setLoading,
    error,
    setError,
    handleError,
    toast,
    supabase
  };
}
