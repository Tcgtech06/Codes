'use client';

import { useEffect, useState } from 'react';
import { Eye, TrendingUp, Building2 } from 'lucide-react';
import { useVisitorStats } from '@/hooks/useVisitorStats';
import StatCard from '@/components/StatCard';

export default function ClientOnlyStats() {
  const [mounted, setMounted] = useState(false);
  const { stats, loading: statsLoading } = useVisitorStats();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return placeholder with same structure to avoid layout shift
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Eye size={32} />}
          title="LIVE"
          value={0}
          subtitle="Active Visitors"
          description="Currently browsing"
          loading={true}
          isLive={true}
          color="green"
        />
        <StatCard
          icon={<TrendingUp size={32} />}
          title="ALL TIME"
          value={0}
          subtitle="Total Visitors"
          description="Since launch"
          loading={true}
          color="blue"
        />
        <StatCard
          icon={<Building2 size={32} />}
          title="DATABASE"
          value={0}
          subtitle="Companies Listed"
          description="Verified businesses"
          loading={true}
          color="purple"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={<Eye size={32} />}
        title="LIVE"
        value={stats.liveVisitors}
        subtitle="Active Visitors"
        description="Currently browsing"
        loading={statsLoading}
        isLive={true}
        color="green"
      />
      <StatCard
        icon={<TrendingUp size={32} />}
        title="ALL TIME"
        value={stats.totalVisitors}
        subtitle="Total Visitors"
        description="Since launch"
        loading={statsLoading}
        color="blue"
      />
      <StatCard
        icon={<Building2 size={32} />}
        title="DATABASE"
        value={stats.totalCompanies}
        subtitle="Companies Listed"
        description="Verified businesses"
        loading={statsLoading}
        color="purple"
      />
    </div>
  );
}
