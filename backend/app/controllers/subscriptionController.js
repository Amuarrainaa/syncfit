// backend/app/controllers/subscriptionController.js
import User from '../models/User';
import stripe from 'stripe';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

const createSubscription = async (req, res) => {
  const { paymentMethodId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const customer = await stripeInstance.customers.create({
      payment_method: paymentMethodId,
      email: user.email,
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    const subscription = await stripeInstance.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PRICE_ID }],
      expand: ['latest_invoice.payment_intent'],
    });

    user.subscriptionStatus = subscription.status;
    await user.save();

    res.json({ message: 'Subscription created', subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { createSubscription };
