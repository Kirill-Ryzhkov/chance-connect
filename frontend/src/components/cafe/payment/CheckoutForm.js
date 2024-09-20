import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
// import '../../../assets/css/cafe.css';

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/done",
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
    }
  };

  return (
    <form onSubmit={handleSubmit} className='items-center text-center'>
      <PaymentElement />
      <button className='mt-5 mx-2 py-3 px-5 text-lg bg-sky-600 hover:bg-sky-700 border-none rounded pointer transition-colors' disabled={!stripe}>Submit</button>
    </form>
  )
};