import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';

// Load Stripe (you'll need to add your publishable key to .env)
const stripePromise = loadStripe('pk_test_51S3YtaDBPQe3DijksYxRwq3fclWdsQ9ZMLyG4KPVB2G0nf8ct05mAuRNVznF7GQgeNxqMw82MGnlbmibawyTvV1700gacxhdrf');

const CheckoutForm = ({ amount, onPaymentSuccess, onPaymentError, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const { data: paymentIntentData } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
        amount: amount,
        currency: 'pkr'
      });

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onPaymentError(stripeError.message);
        toast.error(`Payment failed: ${stripeError.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const { data: confirmData } = await axios.post('http://localhost:5000/api/payments/confirm-payment', {
          orderId: orderId,
          paymentIntentId: paymentIntent.id,
          paymentMethod: 'Stripe'
        });

        if (confirmData.success) {
          onPaymentSuccess(confirmData.order);
          toast.success('Payment successful!');
        } else {
          setError('Failed to confirm payment');
          onPaymentError('Failed to confirm payment');
          toast.error('Failed to confirm payment');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.error || 'Payment failed';
      setError(errorMessage);
      onPaymentError(errorMessage);
      toast.error(`Payment error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="back-btn"
      >
        {isProcessing ? 'Processing...' : `Pay Rs ${amount.toFixed(2)} PKR`}
      </button>
    </form>
  );
};

const StripePayment = ({ amount, onPaymentSuccess, onPaymentError, orderId }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        amount={amount} 
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        orderId={orderId}
      />
    </Elements>
  );
};

export default StripePayment;
