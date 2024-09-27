import React, { useEffect } from "react";
import { CheckoutForm } from "./CheckoutForm";

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_LIVE_KEY);

export const Payment = ({ clientSecret }) => {
    const options = {
        clientSecret
      };
    
      return (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      );
}