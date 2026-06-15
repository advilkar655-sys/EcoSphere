import React, { useState } from 'react';
import { type FootprintResult } from '../utils/calculator';
import { Leaf, Compass, TrendingDown, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  footprint: FootprintResult;
  userXP: number;
  userLevel: number;
  onNavigateToCalc: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  footprint,
  userXP,
  userLevel,
  onNavigateToCalc
}) => {
  // Goal Settings
  const [targetScore, setTargetScore] = useState<number>(3.5); // Target in Tons CO2e
  const [goalsChecked, setGoalsChecked] = useState<Record<string, boolean>>({
    goal1: false,
    goal2: true,
    goal3: false
  });

  const handleGoalToggle = (key: string) => {
    setGoalsChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine score color and label based on carbon level
  const scoreConfig = React.useMemo(() => {
    if (footprint.total <= 3.0) {
      return { color: 'var(--color-primary)', label: 'Eco-Champion', desc: 'Your carbon output is aligned with sustainability guidelines.' };
    } else if (footprint.total <= 7.0) {
      return { color: 'var(--color-accent)', label: 'Moderate Impact', desc: 'You are close to the average household but have optimization potential.' };
    } else {
      return { color: 'var(--color-danger)', label: 'High Carbon Load', desc: 'Your footprint exceeds sustainable levels. EcoCoach can help you plan reductions.' };
    }
  }, [footprint.total]);

  // Math for SVG Circle Stroke Offset
  // Circumference = 2 * PI * r = 2 * 3.14159 * 70 = 439.8
  const strokeDashoffset = React.useMemo(() => {
    const maxScale = 15; // Max scale representing 15 Metric Tons
    const percentage = Math.min(100, (footprint.total / maxScale) * 100);
    const circumference = 2 * Math.PI * 70;
    return circumference - (percentage / 100) * circumference;
  }, [footprint.total]);

  // Recharts Sector Data Formatting
  const chartData = React.useMemo(() => {
    return [
      { name: 'Transport', value: footprint.transport, color: '#3b82f6' },
      { name: 'Home Energy', value: footprint.energy, color: '#f59e0b' },
      { name: 'Nutrition', value: footprint.diet, color: '#10b981' },
      { name: 'Consumption', value: footprint.consumption, color: '#a855f7' }
    ];
  }, [footprint]);

  // Historical comparative data (Mocking trajectory)
  const historicalData = [
    { year: '2024', footprint: 7.8, target: 7.8 },
    { year: '2025', footprint: 6.2, target: 5.5 },
    { year: 'Current', footprint: footprint.total, target: targetScore },
  ];

  return (
    <div className="dashboard-grid animate-fade-in">
      
      {/* COLUMN 1: Score Circle Gauge & Section Breakdowns */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Card 1: Score Gauge */}
        <div className="eco-card primary metrics-summary-box">
          <h3 className="eco-card-title" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>
            <Leaf size={18} /> Carbon Score Summary
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            <span>⭐ Level {userLevel} Warrior</span>
            <span>•</span>
            <span>{userXP.toLocaleString()} XP</span>
          </div>
          
          <div className="score-ring-container">
            <svg className="score-svg" width="180" height="180">
              <circle className="score-bg-circle" cx="90" cy="90" r="70" />
              <circle
                className="score-fill-circle"
                cx="90"
                cy="90"
                r="70"
                stroke={scoreConfig.color}
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="score-text-center">
              <span className="score-number">{footprint.total}</span>
              <span className="score-unit">Tons CO2e/yr</span>
            </div>
          </div>

          <div 
            className="score-label" 
            style={{ 
              backgroundColor: `rgba(var(--color-${footprint.total <= 3.0 ? 'primary' : footprint.total <= 7.0 ? 'accent' : 'danger'}-hsl), 0.1)`, 
              color: scoreConfig.color,
              border: `1px solid hsla(var(--color-${footprint.total <= 3.0 ? 'primary' : footprint.total <= 7.0 ? 'accent' : 'danger'}-hsl), 0.25)`
            }}
          >
            {scoreConfig.label}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.4' }}>
            {scoreConfig.desc}
          </p>

          <button 
            className="btn btn-secondary" 
            style={{ marginTop: '20px', width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '10px' }}
            onClick={onNavigateToCalc}
          >
            Recalculate Footprint
          </button>
        </div>

        {/* Card 2: Sector Breakdowns (Custom progress bars) */}
        <div className="eco-card">
          <h3 className="eco-card-title">
            <Compass size={18} /> Category Breakdowns
          </h3>
          <div className="sectors-container">
            {chartData.map(sector => {
              const pct = footprint.total > 0 ? Math.round((sector.value / footprint.total) * 100) : 0;
              return (
                <div key={sector.name} className="sector-bar-group">
                  <div className="sector-bar-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: sector.color }}></span>
                      {sector.name}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {sector.value} T ({pct}%)
                    </span>
                  </div>
                  <div className="sector-bar-track">
                    <div 
                      className="sector-bar-fill" 
                      style={{ width: `${pct}%`, backgroundColor: sector.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* COLUMN 2: Goals, Progress Trajectory & Reduction Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Card 1: Goal Tracker Slider & Charts */}
        <div className="eco-card primary">
          <h3 className="eco-card-title">
            <Target size={18} /> Climate Target Trajectory
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">
                <span>Set Reduction Target</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{targetScore} Tons CO2e</span>
              </label>
              <input
                type="range"
                min="1.5"
                max="8.0"
                step="0.1"
                className="form-input-slider"
                value={targetScore}
                onChange={e => setTargetScore(Number(e.target.value))}
              />
            </div>
            
            <div style={{ textAlign: 'center', padding: '10px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current Delta</span>
              <h4 style={{ fontSize: '1.25rem', color: footprint.total - targetScore <= 0 ? 'var(--color-primary)' : 'var(--color-accent)' }}>
                {footprint.total - targetScore <= 0 ? 'Goal Reached!' : `+${(footprint.total - targetScore).toFixed(2)} Tons`}
              </h4>
            </div>
          </div>

          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="footprint" name="Actual Footprint (Tons)" radius={[4, 4, 0, 0]}>
                  {historicalData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.year === 'Current' ? 'var(--color-primary)' : 'rgba(16, 185, 129, 0.3)'} 
                    />
                  ))}
                </Bar>
                <Bar dataKey="target" name="Target Objective (Tons)" fill="var(--color-accent)" opacity={0.7} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Personal Action Plan Goal List */}
        <div className="eco-card">
          <h3 className="eco-card-title">
            <TrendingDown size={18} /> Personal Active Goals
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            Check off actions in your custom path plan. Verifying completions earns you XP points.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Goal 1 */}
            <label 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 16px', 
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: goalsChecked.goal1 ? 0.6 : 1
              }}
            >
              <input 
                type="checkbox" 
                checked={goalsChecked.goal1} 
                onChange={() => handleGoalToggle('goal1')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: goalsChecked.goal1 ? 'var(--text-muted)' : '#fff', textDecoration: goalsChecked.goal1 ? 'line-through' : 'none' }}>
                  Commute by bike 2 times / week
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saves ~320 kg CO2e annually</p>
              </div>
              <span className="source-tag" style={{ color: 'var(--color-secondary)' }}>+100 XP</span>
            </label>

            {/* Goal 2 */}
            <label 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 16px', 
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: goalsChecked.goal2 ? 0.6 : 1
              }}
            >
              <input 
                type="checkbox" 
                checked={goalsChecked.goal2} 
                onChange={() => handleGoalToggle('goal2')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: goalsChecked.goal2 ? 'var(--text-muted)' : '#fff', textDecoration: goalsChecked.goal2 ? 'line-through' : 'none' }}>
                  Upgrade lighting fixtures to LEDs
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saves ~80 kg CO2e annually</p>
              </div>
              <span className="source-tag" style={{ color: 'var(--color-secondary)' }}>+50 XP</span>
            </label>

            {/* Goal 3 */}
            <label 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 16px', 
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: goalsChecked.goal3 ? 0.6 : 1
              }}
            >
              <input 
                type="checkbox" 
                checked={goalsChecked.goal3} 
                onChange={() => handleGoalToggle('goal3')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: goalsChecked.goal3 ? 'var(--text-muted)' : '#fff', textDecoration: goalsChecked.goal3 ? 'line-through' : 'none' }}>
                  Adopt vegetarian diet model
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saves ~1,800 kg CO2e annually</p>
              </div>
              <span className="source-tag" style={{ color: 'var(--color-secondary)' }}>+300 XP</span>
            </label>
          </div>
        </div>

      </div>

    </div>
  );
};
