import React, { useState } from 'react';
import { Check, Zap, Shield, ArrowRight, CreditCard, Sparkles, Star } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../mock/initialData';
import { useApp } from '../../context/AppContext';

export const PricingSection: React.FC = () => {
  const { activePlan, upgradeSubscription } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleCheckout = (plan: any) => {
    if (plan.priceMonthlyINR === 0) return;
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
    setPaymentSuccess(false);
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      if (selectedPlan) upgradeSubscription(selectedPlan.id);
      setTimeout(() => setShowCheckoutModal(false), 1600);
    }, 1400);
  };

  return (
    <section className="py-24 relative overflow-hidden" id="pricing">
      {/* bg glow */}
      <div className="absolute inset-0 radial-glow-emerald opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="section-label glass-sm border border-white/[0.06] text-slate-400 mb-5">
            <Zap style={{width:'13px',height:'13px',color:'#10b981'}} />
            Transparent India-First Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4">
            Invest in <span className="gradient-text-emerald">K-12 Intelligence</span>
          </h2>
          <p className="text-slate-400 text-base">
            GST-compliant invoicing, SAC code 999293, flexible annual &amp; monthly plans.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-slate-900/80 border border-white/[0.06]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                billingCycle === 'monthly' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                billingCycle === 'annual' ? 'bg-brand-500 text-slate-950 font-bold shadow-lg shadow-brand-500/30' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Annual
              <span className="px-1.5 py-0.5 rounded-full bg-slate-950/25 text-[9px] font-black">SAVE 25%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan, i) => {
            const price = billingCycle === 'annual' ? plan.priceAnnualINR : plan.priceMonthlyINR;
            const gst = Math.round(price * plan.gstRate);
            const total = price + gst;
            const isCurrent = activePlan.id === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 flex flex-col gap-6 card-hover transition-all duration-300 ${
                  plan.isPopular
                    ? 'glass-emerald'
                    : 'glass'
                }`}
                style={{animationDelay:`${i*100}ms`}}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wide shadow-lg shadow-brand-500/30 flex items-center gap-1">
                    <Star style={{width:'10px',height:'10px',fill:'currentColor'}} />
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-xl text-white">{plan.name}</h3>
                    <span className="badge" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',color:'#94a3b8',fontSize:'9px'}}>
                      {plan.audience === 'parent' ? 'Parent' : 'School'}
                    </span>
                  </div>

                  <div className="mb-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-black text-white">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      {price > 0 && (
                        <span className="text-xs text-slate-500">{billingCycle === 'annual' ? '/yr' : '/mo'}</span>
                      )}
                    </div>
                    {price > 0 && (
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                        <span>+18% GST (₹{gst.toLocaleString('en-IN')})</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-brand-400 font-semibold">Total ₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2.5 flex-1">
                  {plan.features.map((feat, fi) => (
                    <div key={fi} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-brand-500/15 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check style={{width:'9px',height:'9px'}} />
                      </div>
                      {feat}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleCheckout(plan)}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30 cursor-default'
                      : plan.isPopular
                      ? 'bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 hover:shadow-lg hover:shadow-brand-500/30 hover:scale-[1.01]'
                      : 'btn-secondary justify-center'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : price === 0 ? 'Get Started Free' : (
                    <>Subscribe via Razorpay <ArrowRight style={{width:'13px',height:'13px'}} /></>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5"><Shield style={{width:'12px',height:'12px',color:'#10b981'}} /> GST Invoices with SAC 999293</span>
          <span>•</span>
          <span>UPI · NetBanking · RuPay · WhatsApp Pay</span>
          <span>•</span>
          <span>Cancel anytime, pro-rata refunds</span>
        </div>
      </div>

      {/* Razorpay Modal */}
      {showCheckoutModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4">
          <div className="w-full max-w-md glass rounded-3xl shadow-2xl p-6 space-y-5 animate-scale-in">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">₹</div>
                <div>
                  <p className="text-xs font-bold text-white">Razorpay India Checkout</p>
                  <p className="text-[10px] text-slate-400">EduPulse AI Assessments Pvt Ltd</p>
                </div>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="text-slate-500 hover:text-white text-lg leading-none transition-colors">×</button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto animate-soft-bounce">
                  <Check style={{width:'32px',height:'32px'}} />
                </div>
                <h4 className="text-lg font-display font-bold text-white">Payment Confirmed!</h4>
                <p className="text-xs text-slate-400">
                  GST invoice dispatched to registered WhatsApp & Email.
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.05] space-y-2">
                  {[
                    { label: 'Plan', value: selectedPlan.name },
                    { label: `Base (${billingCycle})`, value: `₹${(billingCycle === 'annual' ? selectedPlan.priceAnnualINR : selectedPlan.priceMonthlyINR).toLocaleString('en-IN')}` },
                    { label: 'GST 18%', value: `₹${Math.round((billingCycle === 'annual' ? selectedPlan.priceAnnualINR : selectedPlan.priceMonthlyINR) * 0.18).toLocaleString('en-IN')}` },
                  ].map(({ label, value }, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/[0.05] flex justify-between text-sm font-bold text-brand-400">
                    <span>Total Payable</span>
                    <span>₹{Math.round((billingCycle === 'annual' ? selectedPlan.priceAnnualINR : selectedPlan.priceMonthlyINR) * 1.18).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                  {['UPI / GPay', 'Cards / RuPay', 'NetBanking'].map((m, i) => (
                    <div key={i} className={`py-2.5 rounded-xl border transition-colors cursor-pointer ${i === 0 ? 'bg-brand-500/10 border-brand-500/40 text-brand-400' : 'bg-slate-900/60 border-white/[0.06] text-slate-400 hover:border-white/[0.12]'}`}>
                      {m}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Verifying payment…
                    </>
                  ) : (
                    <>
                      <CreditCard style={{width:'14px',height:'14px'}} />
                      Pay ₹{Math.round((billingCycle === 'annual' ? selectedPlan.priceAnnualINR : selectedPlan.priceMonthlyINR) * 1.18).toLocaleString('en-IN')} via Razorpay
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
