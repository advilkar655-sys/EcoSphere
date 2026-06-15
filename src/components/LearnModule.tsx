import React, { useState } from 'react';
import { educationalTopics } from '../utils/mockData';
import { BookOpen, HelpCircle, ExternalLink, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export const LearnModule: React.FC = () => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>("topic-1");
  
  // Equivalency Calculator State
  const [savingValue, setSavingValue] = useState<number>(500); // kg CO2e

  const toggleAccordion = (id: string) => {
    setExpandedTopic(prev => (prev === id ? null : id));
  };

  // Equivalency translations based on EPA equations
  // 1 kg CO2e is approx:
  // - 2.5 miles driven by an average passenger vehicle
  // - 0.0165 tree seedlings grown for 10 years (or ~1 tree saves 60 kg/yr)
  // - 120 smartphones charged
  const equivalencies = React.useMemo(() => {
    return {
      carDistance: Number((savingValue * 2.5).toFixed(0)),
      treeSeedlings: Number((savingValue * 0.0165).toFixed(1)),
      phoneCharges: Number((savingValue * 121.6).toFixed(0))
    };
  }, [savingValue]);

  return (
    <div className="calc-container animate-fade-in" style={{ maxWidth: '820px' }}>
      
      {/* Upper Panel: Equivalency Simulator */}
      <div className="eco-card accent" style={{ marginBottom: '24px' }}>
        <h3 className="eco-card-title">
          <RefreshCw size={20} style={{ color: 'var(--color-accent)' }} /> Carbon Equivalency Translator
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Solve the carbon abstraction problem! Type a carbon saving value in kilograms to translate it into concrete, real-world actions.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '1 1 200px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>CO2e Emissions Reduced</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="number"
                min="1"
                max="50000"
                className="form-select"
                style={{ width: '100%', paddingRight: '50px' }}
                value={savingValue}
                onChange={e => setSavingValue(Math.max(1, Number(e.target.value)))}
              />
              <span 
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  fontSize: '0.85rem', 
                  color: 'var(--text-secondary)',
                  fontWeight: 'bold' 
                }}
              >
                kg
              </span>
            </div>
          </div>

          <div style={{ flex: '2 1 300px', display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '14px' }}>
            {/* Equiv 1: Cars */}
            <div 
              style={{ 
                flex: 1, 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.05)', 
                borderRadius: '8px', 
                padding: '12px', 
                textAlign: 'center' 
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>🚗</span>
              <h5 style={{ fontSize: '1.1rem', margin: '4px 0 2px', color: 'var(--color-secondary)' }}>
                {equivalencies.carDistance.toLocaleString()}
              </h5>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                Miles Driven Avoided
              </span>
            </div>

            {/* Equiv 2: Trees */}
            <div 
              style={{ 
                flex: 1, 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.05)', 
                borderRadius: '8px', 
                padding: '12px', 
                textAlign: 'center' 
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>🌲</span>
              <h5 style={{ fontSize: '1.1rem', margin: '4px 0 2px', color: 'var(--color-secondary)' }}>
                {equivalencies.treeSeedlings.toLocaleString()}
              </h5>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                Trees Grown for 10 yrs
              </span>
            </div>

            {/* Equiv 3: Phones */}
            <div 
              style={{ 
                flex: 1, 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.05)', 
                borderRadius: '8px', 
                padding: '12px', 
                textAlign: 'center' 
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>🔋</span>
              <h5 style={{ fontSize: '1.1rem', margin: '4px 0 2px', color: 'var(--color-secondary)' }}>
                {equivalencies.phoneCharges.toLocaleString()}
              </h5>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                Phones Charged
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion list */}
      <div className="eco-card primary">
        <h3 className="eco-card-title">
          <BookOpen size={20} /> Climate Science & Metrics Academy
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Explore micro-learning articles explaining the science behind carbon footprint accounting and global temperature targets.
        </p>

        <div className="flashcards-grid">
          {educationalTopics.map(topic => {
            const isOpen = expandedTopic === topic.id;
            return (
              <div key={topic.id} className="topic-accordion-item">
                <div 
                  className="topic-accordion-header" 
                  onClick={() => toggleAccordion(topic.id)}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', color: isOpen ? 'var(--color-primary)' : '#fff' }}>
                      {topic.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {topic.shortDesc}
                    </p>
                  </div>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {isOpen && (
                  <div className="topic-accordion-body animate-fade-in">
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                      {topic.content}
                    </p>

                    <h5 style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', marginTop: '16px', marginBottom: '8px' }}>
                      Key Reduction Tips
                    </h5>
                    <ul style={{ listStyleType: 'circle', paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {topic.tips.map((tip, idx) => (
                        <li key={idx} style={{ marginBottom: '6px' }}>{tip}</li>
                      ))}
                    </ul>

                    <div className="learn-sources">
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <HelpCircle size={12} /> Reputable References:
                      </span>
                      {topic.sources.map((src, idx) => (
                        <span key={idx} className="source-tag">
                          {src} <ExternalLink size={10} style={{ marginLeft: '2px', opacity: 0.6 }} />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
