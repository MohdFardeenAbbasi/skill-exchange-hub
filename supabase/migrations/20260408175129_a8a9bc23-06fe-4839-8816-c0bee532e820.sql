
-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'approved', 'rejected');

-- Create payment_requests table
CREATE TABLE public.payment_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    transaction_id TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    points INTEGER NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- Users can insert their own payment requests
CREATE POLICY "Users can create payment requests"
ON public.payment_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view their own payment requests
CREATE POLICY "Users can view own payment requests"
ON public.payment_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Admins can update payment requests
CREATE POLICY "Admins can update payment requests"
ON public.payment_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_payment_requests_updated_at
BEFORE UPDATE ON public.payment_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to approve a payment and add points
CREATE OR REPLACE FUNCTION public.approve_payment(p_payment_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_payment RECORD;
BEGIN
    SELECT * INTO v_payment FROM public.payment_requests WHERE id = p_payment_id;
    
    IF v_payment IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Payment request not found');
    END IF;
    
    IF v_payment.status != 'pending' THEN
        RETURN json_build_object('success', false, 'error', 'Payment already processed');
    END IF;
    
    -- Update payment status
    UPDATE public.payment_requests SET status = 'approved', updated_at = now() WHERE id = p_payment_id;
    
    -- Add points to user
    UPDATE public.profiles SET points_balance = points_balance + v_payment.points, updated_at = now() WHERE user_id = v_payment.user_id;
    
    RETURN json_build_object('success', true, 'points_added', v_payment.points);
END;
$function$;

-- Function to reject a payment
CREATE OR REPLACE FUNCTION public.reject_payment(p_payment_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_payment RECORD;
BEGIN
    SELECT * INTO v_payment FROM public.payment_requests WHERE id = p_payment_id;
    
    IF v_payment IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Payment request not found');
    END IF;
    
    IF v_payment.status != 'pending' THEN
        RETURN json_build_object('success', false, 'error', 'Payment already processed');
    END IF;
    
    UPDATE public.payment_requests SET status = 'rejected', admin_notes = p_reason, updated_at = now() WHERE id = p_payment_id;
    
    RETURN json_build_object('success', true);
END;
$function$;
