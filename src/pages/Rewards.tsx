import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import { Gift, TrendingUp, Award, Sparkles, CheckCircle } from 'lucide-react'

function Rewards() {
  const { rewards, tier } = useApp()

  const tierColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    Bronze: {
      bg: 'from-amber-900/20 to-amber-700/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      gradient: 'from-amber-600/20 via-amber-500/10 to-amber-700/20',
    },
    Silver: {
      bg: 'from-gray-400/20 to-gray-300/20',
      text: 'text-gray-300',
      border: 'border-gray-400/30',
      gradient: 'from-gray-400/20 via-gray-300/10 to-gray-500/20',
    },
    Gold: {
      bg: 'from-yellow-500/20 to-yellow-400/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      gradient: 'from-yellow-500/20 via-yellow-400/10 to-yellow-600/20',
    },
    Diamond: {
      bg: 'from-cyan-400/20 to-blue-500/20',
      text: 'text-cyan-400',
      border: 'border-cyan-400/30',
      gradient: 'from-cyan-400/20 via-blue-500/10 to-cyan-500/20',
    },
  }

  const tierInfo = tierColors[tier.name] || tierColors.Bronze

  const benefits = [
    { tier: 'Bronze', benefits: ['1% cashback', 'Basic support', 'Early access to features'] },
    { tier: 'Silver', benefits: ['2% cashback', 'Priority support', 'Exclusive rewards', 'Fee discounts'] },
    { tier: 'Gold', benefits: ['3% cashback', 'VIP support', 'Premium rewards', 'Zero fees', 'Beta access'] },
    { tier: 'Diamond', benefits: ['5% cashback', 'Dedicated support', 'Exclusive events', 'All fees waived', 'Co-founder perks'] },
  ]

  const currentBenefits = benefits.find((b) => b.tier === tier.name) || benefits[0]

  const allTiers = [
    { name: 'Bronze', level: '1-3', color: tierColors.Bronze, seeds: '0-2,999' },
    { name: 'Silver', level: '1-3', color: tierColors.Silver, seeds: '3,000-9,999' },
    { name: 'Gold', level: '1-3', color: tierColors.Gold, seeds: '10,000-49,999' },
    { name: 'Diamond', level: '1', color: tierColors.Diamond, seeds: '50,000+' },
  ]

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Rewards & Tiers</h1>

      {/* Current Tier Display - Blended Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tierInfo.gradient} backdrop-blur-xl border ${tierInfo.border}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-16 h-16 bg-gradient-to-br ${tierInfo.bg} rounded-2xl flex items-center justify-center border ${tierInfo.border}`}>
                  <Award className={tierInfo.text} size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{tier.name} Tier</h2>
                  <p className="text-gray-400">Level {tier.level}</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg">You've earned {rewards.seeds} seeds so far</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{rewards.seeds}</div>
              <div className="text-sm text-gray-400">Total Seeds</div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-300 mb-2">Your Benefits:</p>
            {currentBenefits.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <CheckCircle size={18} className={tierInfo.text} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* All Tiers - Blended Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">All Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allTiers.map((tierItem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tierItem.color.gradient} backdrop-blur-xl border ${tierItem.color.border} hover:border-opacity-60 transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-30"></div>
              <div className="relative p-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${tierItem.color.bg} rounded-2xl mx-auto mb-4 flex items-center justify-center border ${tierItem.color.border}`}>
                  <Award className={tierItem.color.text} size={40} />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">{tierItem.name}</h3>
                <p className="text-center text-gray-400 mb-4">Level {tierItem.level}</p>
                <p className="text-center text-sm text-gray-300 mb-4">{tierItem.seeds} seeds</p>
                <div className="space-y-2">
                  {benefits.find((b) => b.tier === tierItem.name)?.benefits.slice(0, 2).map((benefit, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className={tierItem.color.text} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rewards Info - Blended Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
        <div className="relative p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Sparkles className="text-primary" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">How Rewards Work</h3>
              <p className="text-gray-400">Earn seeds with every transaction</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                <Gift className="text-primary" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Earn Seeds</h4>
                <p className="text-gray-400 text-sm">Get 1 seed for every $1,000 you spend on the platform</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                <TrendingUp className="text-primary" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Level Up</h4>
                <p className="text-gray-400 text-sm">Progress through tiers by accumulating seeds and unlock better benefits</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                <Award className="text-primary" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Exclusive Perks</h4>
                <p className="text-gray-400 text-sm">Higher tiers unlock exclusive rewards, discounts, and premium features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rewards
