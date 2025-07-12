# PayPal Migration Setup Guide

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here

# Optional: PayPal Webhook Secret (for production)
PAYPAL_WEBHOOK_SECRET=your_paypal_webhook_secret_here
```

## PayPal Account Setup

1. **Create a PayPal Developer Account**
   - Go to [developer.paypal.com](https://developer.paypal.com)
   - Sign up for a developer account

2. **Create a PayPal App**
   - In the PayPal Developer Dashboard, create a new app
   - Choose "Business" account type
   - Get your Client ID and Client Secret

3. **Environment Configuration**
   - **Development**: Use Sandbox credentials
   - **Production**: Use Live credentials

## Migration Summary

### What's Been Changed:

1. **Frontend Components**:
   - ✅ Created `PayPalCheckout` component (`components/paypal-checkout.tsx`)
   - ✅ Updated cart page to use PayPal instead of Stripe
   - ✅ **Removed crypto payments** - PayPal is now the only payment method
   - ✅ **Removed manual shipping address form** - now uses PayPal's address data

2. **Backend API Routes**:
   - ✅ Created `/api/create-paypal-order` (replaces `/api/create-payment-intent`)
   - ✅ Created `/api/capture-paypal-payment` (replaces `/api/verify-payment`)
   - ✅ Created `/api/process-paypal-order` (replaces `/api/process-stripe-order`)
   - ✅ Updated `/api/create-order` to not require shipping address upfront

3. **Dependencies**:
   - ✅ Added `@paypal/react-paypal-js` package

4. **Cart Provider**:
   - ✅ Removed shipping address state and form
   - ✅ Simplified cart interface

5. **Removed Components**:
   - ✅ Deleted `CoinbaseCheckout` component
   - ✅ Deleted `coinbase-test.tsx` component
   - ✅ Deleted Coinbase API routes (`/api/create-charge`, `/api/coinbase-webhook`)
   - ✅ Deleted Coinbase type definitions

### What Still Needs to Be Done:

1. **Environment Variables**: Add PayPal credentials to your environment
2. **Testing**: Test the PayPal flow in sandbox mode
3. **Webhook Setup**: Configure PayPal webhooks for production (optional)
4. **Cleanup**: Remove Stripe dependencies and routes after testing

## Testing the Migration

1. **Set up environment variables** with your PayPal sandbox credentials
2. **Start the development server**: `npm run dev`
3. **Test the checkout flow**:
   - Add items to cart
   - Fill in shipping address
   - Click PayPal button
   - Complete payment in PayPal sandbox
   - Verify order processing

## PayPal vs Stripe Differences

| Feature | Stripe | PayPal |
|---------|--------|--------|
| Payment Flow | Redirect to hosted checkout | In-page buttons |
| Webhook Events | `checkout.session.completed` | `PAYMENT.CAPTURE.COMPLETED` |
| Order Creation | Payment Intent → Checkout Session | Direct Order Creation |
| Payment Capture | Automatic on redirect | Manual after approval |
| Shipping Address | Manual form input | Provided by PayPal account |

## Next Steps

1. Test the PayPal integration thoroughly
2. Set up PayPal webhooks for production
3. Remove Stripe dependencies and routes
4. Update any remaining Stripe references
5. Deploy to production with live PayPal credentials 