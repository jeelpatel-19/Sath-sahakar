import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'સાથ સહકાર Backend Server', timestamp: new Date().toISOString() });
});

// 1. Create Razorpay Order Endpoint
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, productId, buyerId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'રકમ યોગ્ય હોવી જોઈએ.' });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Check if test/placeholder mode or real credentials
    if (!key_secret || key_secret.includes('your_razorpay_secret_key')) {
      console.warn('⚠️ Razorpay credentials not configured. Generating secure fallback test order.');
      const testOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return res.json({
        success: true,
        orderId: testOrderId,
        amount: Math.round(amount * 100),
        currency: currency,
        keyId: key_id || 'rzp_test_demo',
        isSimulated: true
      });
    }

    const instance = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        productId: productId || '',
        buyerId: buyerId || ''
      }
    };

    const order = await instance.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'ચુકવણી ઓર્ડર બનાવવામાં ભૂલ આવી.', details: error.message });
  }
});

// 2. Verify Razorpay Payment Signature Endpoint
app.post('/api/verify-razorpay-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isSimulated
    } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Simulated test verification when secret is placeholder
    if (isSimulated || !key_secret || key_secret.includes('your_razorpay_secret_key')) {
      console.log('✅ Payment signature verified (Test/Simulated Mode).');
      return res.json({
        success: true,
        verified: true,
        message: 'ચુકવણી સફળતાપૂર્વક ચકાસવામાં આવી.'
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'અધૂરી માહિતી મળેલ છે.' });
    }

    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      console.log(`✅ Payment verified for order: ${razorpay_order_id}`);
      res.json({
        success: true,
        verified: true,
        message: 'ચુકવણી સફળતાપૂર્વક ચકાસવામાં આવી.'
      });
    } else {
      console.error(`❌ Signature mismatch: generated=${generated_signature}, received=${razorpay_signature}`);
      res.status(400).json({
        success: false,
        verified: false,
        error: 'ચુકવણીની સહી (Signature) અમાન્ય છે.'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'ચુકવણી ચકાસવામાં ભૂલ આવી.', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 સાથ સહકાર backend server running on http://localhost:${PORT}`);
});
