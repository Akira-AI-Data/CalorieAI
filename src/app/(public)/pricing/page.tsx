import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'Fast and efficient AI for everyday tasks',
    features: [
      'Powered by Claude Haiku',
      'Unlimited conversations',
      'Conversation history',
      'Fast response times',
    ],
    cta: 'Get Pro',
    highlighted: false,
  },
  {
    name: 'Max',
    price: '$19.99',
    period: '/month',
    description: 'Advanced AI for complex reasoning and analysis',
    features: [
      'Powered by Claude Sonnet',
      'Unlimited conversations',
      'Conversation history',
      'Advanced reasoning',
      'Longer context window',
      'Priority support',
    ],
    cta: 'Get Max',
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="py-20 px-6 bg-brand-bg-light min-h-[calc(100vh-65px)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted max-w-md mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border relative ${
                plan.highlighted
                  ? 'border-brand-teal bg-brand-navy text-white ring-2 ring-brand-teal'
                  : 'border-brand-border-light bg-white'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-teal text-brand-navy text-xs font-bold rounded-full">
                  Popular
                </div>
              )}
              <div className="mb-6">
                <h2
                  className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-foreground'}`}
                >
                  {plan.name}
                </h2>
                <p
                  className={`text-sm ${plan.highlighted ? 'text-brand-text-muted' : 'text-muted'}`}
                >
                  {plan.description}
                </p>
              </div>
              <div className="mb-6">
                <span
                  className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-foreground'}`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${plan.highlighted ? 'text-brand-text-muted' : 'text-muted'}`}
                >
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check
                      className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-brand-teal-light' : 'text-brand-teal'}`}
                    />
                    <span
                      className={
                        plan.highlighted ? 'text-brand-text-muted' : 'text-muted'
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`block text-center py-3 rounded-xl font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-brand-teal text-brand-navy hover:bg-brand-teal-light'
                    : 'bg-accent text-white hover:bg-accent-hover'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
