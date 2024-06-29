import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { toast } from 'sonner';

export default function CheckoutForm  ({ currentUser, totalPrice }) {
    const stripe = useStripe();
    const elements = useElements();

    const [ formData, setFormData ] = useState({
        name: currentUser.firstName + " " + currentUser.lastName,
        email: currentUser.email,
        adress: "",
    });
    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [ paypalEmail, setPaypalEmail] = useState(currentUser.email);

    const calculateGrandTotal = (cartItems) => {
        let grandTotal = 0;
        for (const cartItem of cartItems) {
            grandTotal = grandTotal + cartItem.quantity * cartItem.price;
        };
        return grandTotal;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        };

        if (paymentMethod === 'creditCard') {
            toast(`Your purchase of ${calculateGrandTotal(currentUser.cart.cartItems)}$ has been completed!`, {
                description: `Transaction details has been sent to ${formData.email}, thank you for your purchase!`
            });
        } else if (paymentMethod === 'paypal') {
            toast(`Your purchase of ${calculateGrandTotal(currentUser.cart.cartItems)}$ has been completed!`, {
                description: `Transaction details has been sent to ${paypalEmail}, thank you for your purchase!`
            });
        }
    };

    const CreditCardInput = () => {
        return (
            <div className="mb-4">
                <Label>Card Details</Label>
                <div className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700">
                    <CardElement />
                </div>
            </div>
        );
    };
    
    const PayPalInput = () => (
        <div className="mb-4">
            <Label>PayPal Email</Label>
            <Input type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)}/>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
            <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="address">Address</Label>
                <Input
                    name="address"
                    value={formData.adress}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="creditCard">Credit Card</option>
                    <option value="paypal">PayPal</option>
                </select>
            </div>
            {paymentMethod === 'creditCard' && <CreditCardInput />}
            {paymentMethod === 'paypal' && <PayPalInput />}
            <p>Total: {calculateGrandTotal(currentUser.cart.cartItems)}$</p>
            <Button type="submit" className="mt-4 p-2 hover:bg-blue-600 bg-blue-500 text-white w-full rounded-md">
                Pay Now 
            </Button>
        </form>
    );
};