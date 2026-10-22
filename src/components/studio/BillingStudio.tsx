import React, { useState } from 'react';
import { 
  UserProfile, 
  SubscriptionTierDetails 
} from '../../types/strater';
import { 
  STRATER_PLANS, 
  STRATER_STORAGE_SERVICE 
} from '../../services/straterStorageService';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  X, 
  ArrowRight, 
  Zap, 
  HelpCircle 
} from 'lucide-react';

interface BillingStudioProps {
  currentUser: UserProfile;
  onPlanUpgraded?: (newPlan: 'free' | 'pro' | 'campus') => void;
}

export const BillingStudio: React.FC<BillingStudioProps> = ({
  currentUser,
  onPlanUpgraded
}) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionTierDetails | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleSelectPlan = (plan: SubscriptionTierDetails) => {
    if (plan.id === currentUser.subscriptionPlan) return;
    setSelectedPlanForCheckout(plan);
  };

  const handleConfirmUpgrade = () => {
    if (!selectedPlanForCheckout) return;
    setIsCheckingOut(true);

    setTimeout(() => {
      const updatedUser: UserProfile = {
        ...currentUser,
        subscriptionPlan: selectedPlanForCheckout.id,
        subscriptionStatus: 'active',
        subscriptionRenewalDate: isAnnual ? '2027-10-22' : '2026-11-22',
        maxMonthlyTokens: selectedPlanForCheckout.maxTokensPerMonth
      };

      STRATER_STORAGE_SERVICE.saveCurrentUser(updatedUser);
      setIsCheckingOut(false);
      setSelectedPlanForCheckout(null);
      setSuccessBanner(`Successfully upgraded to ${selectedPlanForCheckout.name}!`);
      onPlanUpgraded?.(selectedPlanForCheckout.id);
      setTimeout(() => setSuccessBanner(null), 3000);
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fade-in">
      
      {/* Top Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0071e3]/15 text-[#2997ff] border border-[#0071e3]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible Self-Study & Institutional Plans</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Invest in Your Cognitive Mastery
        </h2>
        <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
          Upgrade for unlimited multi-source ingestion, SuperMemo SM-2 spaced repetition, interactive concept mind maps, and full-resolution exports.
        </p>

        {/* Monthly vs Annual Billing Toggle */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <span className={`text-xs font-medium ${!isAnnual ? 'text-white' : 'text-[#86868b]'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-[#1c1c1e] border border-white/20 p-0.5 relative transition-colors"
          >
            <div 
              className={`w-5 h-5 rounded-full bg-[#0071e3] transition-transform duration-200 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} 
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-medium ${isAnnual ? 'text-white' : 'text-[#86868b]'}`}>Annual</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#30d158]/20 text-[#30d158] border border-[#30d158]/30">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-[#30d158]/15 border border-[#30d158]/30 text-[#30d158] text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* 3 Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STRATER_PLANS.map(plan => {
          const isCurrent = currentUser.subscriptionPlan === plan.id;
          const price = isAnnual ? (plan.priceAnnual > 0 ? Math.round(plan.priceAnnual / 12) : 0) : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between space-y-6 relative transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#1c1c1e] via-[#1c1c1e] to-blue-950/20 border-[#0071e3] shadow-2xl shadow-[#0071e3]/20 ring-1 ring-[#0071e3]'
                  : 'bg-[#1c1c1e] border-white/10 hover:border-white/20'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0071e3] text-white shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white tracking-tight">{plan.name}</h3>
                  <p className="text-xs text-[#86868b] min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">${price}</span>
                  <span className="text-xs text-[#86868b]">/ month</span>
                  {isAnnual && plan.priceAnnual > 0 && (
                    <span className="text-[10px] text-[#86868b] block ml-1 font-mono">(${plan.priceAnnual}/yr)</span>
                  )}
                </div>

                <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-[#d1d1d6]">
                      <Check className="w-4 h-4 text-[#30d158] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-white/10 text-[#86868b] cursor-default'
                      : plan.isPopular
                      ? 'btn-primary shadow-lg shadow-[#0071e3]/30'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Confirmation Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#1c1c1e] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0071e3]" />
                <h3 className="text-sm font-semibold text-white">Confirm Subscription Plan</h3>
              </div>
              <button
                onClick={() => setSelectedPlanForCheckout(null)}
                className="text-[#86868b] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#86868b]">Selected Plan:</span>
                <span className="font-semibold text-white">{selectedPlanForCheckout.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#86868b]">Billing Cadence:</span>
                <span className="font-semibold text-white">{isAnnual ? 'Annual (Save 20%)' : 'Monthly'}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10">
                <span className="text-white">Total Amount:</span>
                <span className="text-[#2997ff] font-mono">
                  ${isAnnual ? selectedPlanForCheckout.priceAnnual : selectedPlanForCheckout.priceMonthly}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#86868b]">
              <ShieldCheck className="w-4 h-4 text-[#30d158] shrink-0" />
              <span>Simulated secure SSL sandbox payment. Instant activation.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#86868b] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpgrade}
                disabled={isCheckingOut}
                className="btn-primary text-xs py-2 px-6 font-semibold"
              >
                {isCheckingOut ? 'Activating...' : 'Confirm Upgrade'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
