
-- Enable RLS on detailed_expenses table and create comprehensive policies
ALTER TABLE public.detailed_expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for detailed_expenses (these are missing)
CREATE POLICY "Users can view their own detailed expenses" 
ON public.detailed_expenses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own detailed expenses" 
ON public.detailed_expenses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own detailed expenses" 
ON public.detailed_expenses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own detailed expenses" 
ON public.detailed_expenses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on market_data table (public read access for market information)
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read market data
CREATE POLICY "Authenticated users can view market data" 
ON public.market_data 
FOR SELECT 
TO authenticated
USING (true);

-- Create additional policies for financial_goals (missing DELETE policy)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'financial_goals' 
        AND policyname = 'Users can delete their own financial goals'
    ) THEN
        CREATE POLICY "Users can delete their own financial goals" 
        ON public.financial_goals 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END$$;

-- Enable RLS on financial_profiles table and create comprehensive policies
ALTER TABLE public.financial_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'financial_profiles' 
        AND policyname = 'Users can view their own financial profile'
    ) THEN
        CREATE POLICY "Users can view their own financial profile" 
        ON public.financial_profiles 
        FOR SELECT 
        USING (auth.uid() = id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'financial_profiles' 
        AND policyname = 'Users can insert their own financial profile'
    ) THEN
        CREATE POLICY "Users can insert their own financial profile" 
        ON public.financial_profiles 
        FOR INSERT 
        WITH CHECK (auth.uid() = id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'financial_profiles' 
        AND policyname = 'Users can update their own financial profile'
    ) THEN
        CREATE POLICY "Users can update their own financial profile" 
        ON public.financial_profiles 
        FOR UPDATE 
        USING (auth.uid() = id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'financial_profiles' 
        AND policyname = 'Users can delete their own financial profile'
    ) THEN
        CREATE POLICY "Users can delete their own financial profile" 
        ON public.financial_profiles 
        FOR DELETE 
        USING (auth.uid() = id);
    END IF;
END$$;

-- Enable RLS on monthly_expenses table and create comprehensive policies
ALTER TABLE public.monthly_expenses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'monthly_expenses' 
        AND policyname = 'Users can view their own monthly expenses'
    ) THEN
        CREATE POLICY "Users can view their own monthly expenses" 
        ON public.monthly_expenses 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'monthly_expenses' 
        AND policyname = 'Users can insert their own monthly expenses'
    ) THEN
        CREATE POLICY "Users can insert their own monthly expenses" 
        ON public.monthly_expenses 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'monthly_expenses' 
        AND policyname = 'Users can update their own monthly expenses'
    ) THEN
        CREATE POLICY "Users can update their own monthly expenses" 
        ON public.monthly_expenses 
        FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'monthly_expenses' 
        AND policyname = 'Users can delete their own monthly expenses'
    ) THEN
        CREATE POLICY "Users can delete their own monthly expenses" 
        ON public.monthly_expenses 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END$$;

-- Enable RLS on monthly_savings table and create comprehensive policies
ALTER TABLE public.monthly_savings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'monthly_savings' 
        AND policyname = 'Users can view their own monthly savings'
    ) THEN
        CREATE POLICY "Users can view their own monthly savings" 
        ON public.monthly_savings 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'monthly_savings' 
        AND policyname = 'Users can insert their own monthly savings'
    ) THEN
        CREATE POLICY "Users can insert their own monthly savings" 
        ON public.monthly_savings 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'monthly_savings' 
        AND policyname = 'Users can update their own monthly savings'
    ) THEN
        CREATE POLICY "Users can update their own monthly savings" 
        ON public.monthly_savings 
        FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'monthly_savings' 
        AND policyname = 'Users can delete their own monthly savings'
    ) THEN
        CREATE POLICY "Users can delete their own monthly savings" 
        ON public.monthly_savings 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END$$;

-- Enable RLS on profiles table and create comprehensive policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile" 
        ON public.profiles 
        FOR SELECT 
        USING (auth.uid() = id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" 
        ON public.profiles 
        FOR INSERT 
        WITH CHECK (auth.uid() = id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" 
        ON public.profiles 
        FOR UPDATE 
        USING (auth.uid() = id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can delete their own profile'
    ) THEN
        CREATE POLICY "Users can delete their own profile" 
        ON public.profiles 
        FOR DELETE 
        USING (auth.uid() = id);
    END IF;
END$$;

-- Enable RLS on document_embeddings table and create comprehensive policies
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'document_embeddings' 
        AND policyname = 'Users can view their own document embeddings'
    ) THEN
        CREATE POLICY "Users can view their own document embeddings" 
        ON public.document_embeddings 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'document_embeddings' 
        AND policyname = 'Users can insert their own document embeddings'
    ) THEN
        CREATE POLICY "Users can insert their own document embeddings" 
        ON public.document_embeddings 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'document_embeddings' 
        AND policyname = 'Users can update their own document embeddings'
    ) THEN
        CREATE POLICY "Users can update their own document embeddings" 
        ON public.document_embeddings 
        FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'document_embeddings' 
        AND policyname = 'Users can delete their own document embeddings'
    ) THEN
        CREATE POLICY "Users can delete their own document embeddings" 
        ON public.document_embeddings 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END$$;
