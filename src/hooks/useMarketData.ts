import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MarketData } from '@/types/finance';

export const useMarketData = () => {
    const [marketData, setMarketData] = useState<MarketData[]>([]);

    // Fetch market data from Supabase
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['marketData'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('market_data')
                .select('*')
                .in('symbol', ['SPY', 'BTC-USD', 'GLD', 'AAPL'])
                .order('last_updated', { ascending: false });

            if (error) throw error;

            // Map database fields to MarketData interface
            return data?.map(item => ({
                id: item.id,
                symbol: item.symbol,
                name: item.name,
                price: item.price,
                change: item.change_amount,
                changePercent: item.change_percent,
                type: item.type as 'index' | 'stock' | 'cryptocurrency' | 'commodity',
                lastUpdated: new Date(item.last_updated)
            })) as MarketData[];
        },
        staleTime: 1000 * 60, // 1 minute
    });

    // Set up real-time subscription
    useEffect(() => {
        const subscription = supabase
            .channel('market_data_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'market_data',
                    filter: 'symbol=in.(SPY,BTC-USD,GLD,AAPL)'
                },
                (payload) => {
                    refetch(); // Refetch data when changes occur
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [refetch]);

    useEffect(() => {
        if (data) {
            setMarketData(data);
        }
    }, [data]);

    return {
        marketData,
        isLoading,
        error,
        refetch
    };
}; 