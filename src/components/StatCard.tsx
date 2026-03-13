import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  description: string;
  loading?: boolean;
  isLive?: boolean;
  color?: 'green' | 'blue' | 'purple';
}

export default function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  description, 
  loading = false, 
  isLive = false,
  color = 'blue'
}: StatCardProps) {
  const colorClasses = {
    green: {
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-300',
      badge: 'text-green-300'
    },
    blue: {
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-300',
      badge: 'text-blue-300'
    },
    purple: {
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-300',
      badge: 'text-purple-300'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 stats-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${classes.iconBg} rounded-xl`}>
          <div className={classes.iconColor}>
            {icon}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse live-indicator"></div>
              <span className="text-green-300 text-sm font-medium">LIVE</span>
            </>
          )}
          {!isLive && (
            <div className={`${classes.badge} text-sm font-medium`}>{title}</div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold mb-2">
          {loading ? (
            <div className="animate-pulse bg-white/20 h-10 w-20 rounded mx-auto skeleton"></div>
          ) : (
            <span className="tabular-nums stat-number">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
          )}
        </div>
        <p className="text-blue-200 text-sm font-medium">{subtitle}</p>
        <p className="text-blue-300 text-xs mt-1">{description}</p>
      </div>
    </div>
  );
}