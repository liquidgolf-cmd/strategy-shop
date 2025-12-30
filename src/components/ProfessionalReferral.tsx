import React from 'react';

interface ProfessionalReferralProps {
  professionalType?: string;
}

const ProfessionalReferral: React.FC<ProfessionalReferralProps> = ({ professionalType }) => {
  // Placeholder for Clarity Sprint booking link (Phase 2)
  const claritySprintUrl = 'https://loamstrategy.com'; // TODO: Replace with actual booking link

  // Determine if this is a business strategy escalation or legacy professional referral
  const isStrategyEscalation = professionalType === 'clarity_sprint' || 
                                professionalType === 'deep_dive' || 
                                professionalType === 'structured_planning';

  if (isStrategyEscalation) {
    return (
      <div className="mt-4 bg-gradient-to-br from-strategy-accent-light to-strategy-primary-light rounded-2xl p-6 shadow-lg max-w-xl animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎯</div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-strategy-neutral-dark text-lg mb-2">
              Ready for Deep Work?
            </h3>
            <p className="text-gray-700 mb-4 text-sm">
              This challenge deserves more than a quick conversation. A <strong>HomeRun Clarity Sprint</strong> gives you:
            </p>
            <ul className="space-y-1 text-sm text-gray-700 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-strategy-success">✓</span>
                <span>Complete 90-day strategy in 2 weeks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-strategy-success">✓</span>
                <span>Clear priorities and action plan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-strategy-success">✓</span>
                <span>Direct access to experienced strategist</span>
              </li>
            </ul>
            <a
              href={claritySprintUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-block
                px-6 py-3
                bg-strategy-primary text-white
                rounded-xl
                hover:bg-strategy-primary-dark
                transition-colors
                font-medium text-sm
                shadow-md hover:shadow-lg
                min-h-[44px] touch-manipulation
              "
            >
              See If You Qualify →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Legacy professional referral (for backward compatibility)
  const getProfessionalInfo = () => {
    switch (professionalType) {
      case 'electrician':
        return {
          icon: '⚡',
          title: 'Time to Call an Electrician',
          description: 'This is beyond DIY territory. A licensed electrician will ensure it\'s done safely and up to code.',
        };
      case 'plumber':
        return {
          icon: '🔧',
          title: 'Time to Call a Plumber',
          description: 'This needs professional plumbing expertise. Better safe than sorry with water damage!',
        };
      case 'mechanic':
        return {
          icon: '🚗',
          title: 'Time to Call a Mechanic',
          description: 'This is a job for a professional mechanic. Your safety on the road is worth it.',
        };
      case 'therapist':
        return {
          icon: '💚',
          title: 'Consider Professional Support',
          description: 'A licensed therapist or counselor can provide the specialized support you deserve.',
        };
      case 'lawyer':
        return {
          icon: '⚖️',
          title: 'Time to Consult an Attorney',
          description: 'Legal matters need professional guidance. An attorney can protect your interests.',
        };
      default:
        return {
          icon: '👨‍💼',
          title: 'Time to Call a Professional',
          description: 'This situation needs expert help. There\'s no shame in calling in the pros!',
        };
    }
  };

  const info = getProfessionalInfo();

  return (
    <div className="mt-4 bg-gradient-to-br from-strategy-warning/10 to-strategy-accent-light rounded-2xl p-6 shadow-lg max-w-xl animate-slide-up border-2 border-strategy-warning/30">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{info.icon}</div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-strategy-neutral-dark text-lg mb-2">
            {info.title}
          </h3>
          <p className="text-gray-700 text-sm">
            {info.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalReferral;
