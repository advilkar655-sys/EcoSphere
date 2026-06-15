import React, { useState, useMemo } from 'react';
import { type FootprintResult, EMISSION_FACTORS } from '../utils/calculator';
import { generateLocalEcoTips } from '../utils/mockData';
import { Sparkles, HelpCircle, Sliders, Send, Car, Zap, ShoppingBag } from 'lucide-react';

interface EcoCoachProps {
  footprint: FootprintResult;
  diet: string;
}

export const EcoCoach: React.FC<EcoCoachProps> = ({ footprint, diet }) => {
  // Chat Simulation State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am your AI Eco-Coach. Based on your lifestyle parameters, I can generate hyper-personalized tips or answer any questions you have about reducing your emissions."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Sandbox Adjustment States
  const [commuteSaving, setCommuteSaving] = useState(0); // km reduced weekly
  const [thermostatSaving, setThermostatSaving] = useState(0); // °C lowered
  const [meatFreeDays, setMeatFreeDays] = useState(0); // meat days replaced per week

  // Generate customized tips based on user's current footprint
  const recommendedTips = useMemo(() => {
    return generateLocalEcoTips(
      footprint.transport,
      footprint.energy,
      footprint.diet,
      footprint.consumption
    );
  }, [footprint]);

  // Handle Ask Chat Submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    // AI Response Simulation Logic
    setTimeout(() => {
      let reply = "That's a great question! Reducing carbon impact in that category requires steady habits. Try focusing on small shifts first, like switching off idle appliances or carpooling.";
      
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('car') || lowerText.includes('drive') || lowerText.includes('transport') || lowerText.includes('commute')) {
        reply = `To trim your ${footprint.transport}T transport score: 1) Group errands together to avoid multi-trips, 2) Keep vehicle tires inflated to save up to 4% on fuel, 3) If you drive a petrol car, switching just 20km weekly to transit saves ~170kg CO2e annually.`;
      } else if (lowerText.includes('diet') || lowerText.includes('food') || lowerText.includes('eat') || lowerText.includes('meat') || lowerText.includes('vegan')) {
        reply = `Your current diet is configured as '${diet}' (diet score: ${footprint.diet}T). Replacing just 2 beef meals a week with plant-based protein (beans or tofu) reduces your dietary footprint by ~250kg CO2e annually and significantly reduces methane impact!`;
      } else if (lowerText.includes('solar') || lowerText.includes('electricity') || lowerText.includes('power') || lowerText.includes('gas') || lowerText.includes('energy')) {
        reply = `Your home energy score is ${footprint.energy}T. You can save energy by: 1) Switching to LEDs (saves up to 80% on lighting), 2) Lowering your thermostat 1°C in winter (saves ~300kg CO2e/yr), 3) Unplugging power adapters to prevent standby electricity waste.`;
      } else if (lowerText.includes('buy') || lowerText.includes('shop') || lowerText.includes('clothes') || lowerText.includes('electronics')) {
        reply = `Your lifestyle score is ${footprint.consumption}T. Consider adopting a circular shopping pattern: buy second-hand clothing, repair laptops/phones rather than buying brand new, and avoid fast-fashion delivery loads.`;
      } else if (lowerText.includes('offset') || lowerText.includes('tree') || lowerText.includes('credit')) {
        reply = "Carbon offsetting is helpful but should be a secondary step. Always focus on 'Reduce and Replace' first, then fund verified Gold Standard offsets for emissions you cannot avoid.";
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  // Sandbox Carbon Calculations
  const sandboxCalculations = useMemo(() => {
    // 1. Commute saving (petrol car rate)
    const savedTransport = (commuteSaving * 52 * EMISSION_FACTORS.transport.petrolCar) / 1000;
    
    // 2. Thermostat saving (approx 340 kg CO2e per 1°C lowered annually)
    const savedEnergy = (thermostatSaving * 340) / 1000;
    
    // 3. Meat free saving (approx difference between meatHeavy and vegetarian per meal = ~1.7 kg per meal)
    const savedDiet = (meatFreeDays * 52 * 1.7) / 1000;

    const totalSaved = Number((savedTransport + savedEnergy + savedDiet).toFixed(3));
    const newTotal = Math.max(0, Number((footprint.total - totalSaved).toFixed(2)));

    return {
      totalSaved,
      newTotal,
      percentReduced: footprint.total > 0 ? Math.min(100, Math.round((totalSaved / footprint.total) * 100)) : 0
    };
  }, [commuteSaving, thermostatSaving, meatFreeDays, footprint]);

  return (
    <div className="calc-container animate-fade-in" style={{ maxWidth: '960px' }}>
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        {/* Left Side: Sandbox Simulator */}
        <div className="eco-card primary">
          <h3 className="eco-card-title">
            <Sliders size={20} /> Decarbonization Sandbox
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Simulate modifying your daily routines to discover the cumulative impact of small behavioral adjustments.
          </p>

          <div className="calc-form-step">
            {/* Slider 1: Commute */}
            <div className="form-group">
              <label className="form-label">
                <span>Reduce Weekly Driving Commute</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  -{commuteSaving} km / week
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                className="form-input-slider"
                value={commuteSaving}
                onChange={e => setCommuteSaving(Number(e.target.value))}
              />
            </div>

            {/* Slider 2: Thermostat */}
            <div className="form-group">
              <label className="form-label">
                <span>Adjust Thermostat in Winter</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  -{thermostatSaving} °C
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                className="form-input-slider"
                value={thermostatSaving}
                onChange={e => setThermostatSaving(Number(e.target.value))}
              />
            </div>

            {/* Slider 3: Diet */}
            <div className="form-group">
              <label className="form-label">
                <span>Vegetarian Meals Replacing Meat</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  {meatFreeDays} meals / week
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="21"
                step="1"
                className="form-input-slider"
                value={meatFreeDays}
                onChange={e => setMeatFreeDays(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="sandbox-comparison" style={{ marginTop: '24px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              POTENTIAL SAVINGS ESTIMATE
            </span>
            <div className="saving-badge">
              -{sandboxCalculations.totalSaved} T CO2e/yr
            </div>
            
            <div className="sectors-container" style={{ gap: '8px' }}>
              <div className="sector-bar-label" style={{ fontSize: '0.8rem' }}>
                <span>Simulated Carbon Score</span>
                <span>{sandboxCalculations.newTotal} / {footprint.total} Tons</span>
              </div>
              <div className="sector-bar-track" style={{ height: '10px' }}>
                <div 
                  className="sector-bar-fill" 
                  style={{ 
                    width: `${Math.max(10, 100 - sandboxCalculations.percentReduced)}%`,
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' 
                  }}
                ></div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 700, textAlign: 'left', marginTop: '4px' }}>
                ⭐ Cuts your personal footprint by {sandboxCalculations.percentReduced}%!
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: AI Coach Chat Box */}
        <div className="eco-card accent" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 className="eco-card-title">
            <Sparkles size={20} style={{ color: 'var(--color-accent)' }} /> AI Climate Coach
          </h3>

          {/* Chat message display area */}
          <div 
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              maxHeight: '280px', 
              paddingRight: '6px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}
          >
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: msg.sender === 'user' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255, 255, 255, 0.04)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  lineHeight: '1.4',
                  borderTopRightRadius: msg.sender === 'user' ? '2px' : '12px',
                  borderTopLeftRadius: msg.sender === 'ai' ? '2px' : '12px',
                  color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)'
                }}
              >
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div 
                style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  borderTopLeftRadius: '2px',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic'
                }}
              >
                Coach is analyzing data...
              </div>
            )}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
            <input
              type="text"
              className="form-select"
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
              placeholder="Ask: 'How do I cut down transport emissions?'..."
              value={chatInput}
              disabled={isTyping}
              onChange={e => setChatInput(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ padding: '8px 16px' }}
              disabled={isTyping || !chatInput.trim()}
            >
              <Send size={14} />
            </button>
          </form>

          {/* Suggestion tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
            <button 
              type="button" 
              className="source-tag" 
              style={{ cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'transparent' }}
              onClick={() => setChatInput("Tell me how to reduce my dietary carbon impact")}
            >
              🥗 Diet tip
            </button>
            <button 
              type="button" 
              className="source-tag" 
              style={{ cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'transparent' }}
              onClick={() => setChatInput("What is the impact of switching to solar energy?")}
            >
              ☀️ Solar energy
            </button>
            <button 
              type="button" 
              className="source-tag" 
              style={{ cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'transparent' }}
              onClick={() => setChatInput("Best ways to save CO2 from commuting")}
            >
              🚴 Transit tip
            </button>
          </div>
        </div>

      </div>

      {/* Recommended tips section below */}
      <div className="eco-card primary" style={{ marginTop: '24px' }}>
        <h4 className="eco-card-title">
          <HelpCircle size={18} /> Personalized Recommendations
        </h4>
        <div className="quick-tips-panel" style={{ marginTop: '14px' }}>
          {recommendedTips.map((tip, idx) => (
            <div key={idx} className="tip-item-card animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className={`tip-icon-box ${tip.category}`}>
                {tip.category === 'transport' && <Car size={18} />}
                {tip.category === 'energy' && <Zap size={18} />}
                {tip.category === 'diet' && <HelpCircle size={18} />}
                {tip.category === 'consumption' && <ShoppingBag size={18} />}
              </div>
              <div className="tip-details">
                <div className="tip-title">{tip.tip}</div>
                <div className="tip-desc">{tip.impact}</div>
                <div className="tip-footer">
                  <span className={`tip-difficulty ${tip.difficulty}`}>{tip.difficulty}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    -{tip.savingKg} kg CO2e/yr
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
