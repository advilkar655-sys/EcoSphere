import React, { useState } from 'react';
import { type LifestyleData, calculateFootprint, type FootprintResult } from '../utils/calculator';
import { Car, Zap, Utensils, ShoppingBag, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FootprintCalcProps {
  initialData: LifestyleData;
  onCalculationComplete: (result: FootprintResult, rawData: LifestyleData) => void;
}

export const FootprintCalc: React.FC<FootprintCalcProps> = ({ initialData, onCalculationComplete }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<LifestyleData>(initialData);

  const steps = [
    { label: 'Mobility', icon: <Car size={18} /> },
    { label: 'Energy', icon: <Zap size={18} /> },
    { label: 'Nutrition', icon: <Utensils size={18} /> },
    { label: 'Lifestyle', icon: <ShoppingBag size={18} /> }
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      const result = calculateFootprint(formData);
      onCalculationComplete(result, formData);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSliderChange = (
    category: 'transport' | 'energy' | 'consumption',
    field: string,
    value: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSelectChange = (
    category: 'transport' | 'diet',
    field: string | null,
    value: string
  ) => {
    if (category === 'diet') {
      setFormData(prev => ({
        ...prev,
        diet: value as LifestyleData['diet']
      }));
    } else if (field) {
      setFormData(prev => ({
        ...prev,
        transport: {
          ...prev.transport,
          [field]: value
        }
      }));
    }
  };

  const handleToggleChange = (category: 'energy', field: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field as keyof typeof prev['energy']]
      }
    }));
  };

  return (
    <div className="calc-container animate-fade-in">
      <div className="calc-steps-header">
        {steps.map((step, idx) => (
          <button
            key={idx}
            className={`step-node ${activeStep === idx ? 'active' : ''} ${
              activeStep > idx ? 'completed' : ''
            }`}
            onClick={() => setActiveStep(idx)}
            disabled={idx > activeStep && !calculateFootprint(formData).total}
          >
            <div className="step-node-circle">
              {activeStep > idx ? <CheckCircle2 size={18} /> : step.icon}
            </div>
            <span className="step-node-label">{step.label}</span>
          </button>
        ))}
      </div>

      <div className="eco-card primary">
        <h3 className="eco-card-title">
          {steps[activeStep].icon} {steps[activeStep].label} Survey
        </h3>

        {activeStep === 0 && (
          <div className="calc-form-step">
            <div className="form-group">
              <label className="form-label">
                <span>Personal Vehicle Type</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                  {formData.transport.carType === 'none'
                    ? 'None'
                    : formData.transport.carType === 'petrolCar'
                    ? 'Petrol Car'
                    : formData.transport.carType === 'dieselCar'
                    ? 'Diesel Car'
                    : 'Electric Vehicle (EV)'}
                </span>
              </label>
              <select
                className="form-select"
                value={formData.transport.carType}
                onChange={e => handleSelectChange('transport', 'carType', e.target.value)}
              >
                <option value="none">No Private Car / Walk / Bicycle</option>
                <option value="petrolCar">Petrol Engine Passenger Car</option>
                <option value="dieselCar">Diesel Engine Passenger Car</option>
                <option value="electricCar">Battery Electric Car (BEV)</option>
              </select>
            </div>

            {formData.transport.carType !== 'none' && (
              <div className="form-group">
                <label className="form-label">
                  <span>Weekly Car Driving Distance</span>
                  <span>{formData.transport.carDistanceWeekly} km</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  className="form-input-slider"
                  value={formData.transport.carDistanceWeekly}
                  onChange={e =>
                    handleSliderChange('transport', 'carDistanceWeekly', Number(e.target.value))
                  }
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <span>Weekly Public Transit (Bus/Train)</span>
                <span>{formData.transport.publicTransitDistanceWeekly} km</span>
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                className="form-input-slider"
                value={formData.transport.publicTransitDistanceWeekly}
                onChange={e =>
                  handleSliderChange('transport', 'publicTransitDistanceWeekly', Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Short-Haul Flights (&lt; 1,500km)</span>
                <span>{formData.transport.annualFlightsShort} flight hours / yr</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                className="form-input-slider"
                value={formData.transport.annualFlightsShort}
                onChange={e =>
                  handleSliderChange('transport', 'annualFlightsShort', Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Long-Haul Flights (&gt; 1,500km)</span>
                <span>{formData.transport.annualFlightsLong} flight hours / yr</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="2"
                className="form-input-slider"
                value={formData.transport.annualFlightsLong}
                onChange={e =>
                  handleSliderChange('transport', 'annualFlightsLong', Number(e.target.value))
                }
              />
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="calc-form-step">
            <div className="form-group">
              <label className="form-label">
                <span>Monthly Electricity Consumption</span>
                <span>{formData.energy.electricityMonthly} kWh</span>
              </label>
              <input
                type="range"
                min="0"
                max="1500"
                step="10"
                className="form-input-slider"
                value={formData.energy.electricityMonthly}
                onChange={e =>
                  handleSliderChange('energy', 'electricityMonthly', Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Monthly Natural Gas Usage</span>
                <span>{formData.energy.naturalGasMonthly} kWh</span>
              </label>
              <input
                type="range"
                min="0"
                max="2000"
                step="20"
                className="form-input-slider"
                value={formData.energy.naturalGasMonthly}
                onChange={e =>
                  handleSliderChange('energy', 'naturalGasMonthly', Number(e.target.value))
                }
              />
            </div>

            <div className="form-group" style={{ flexDirection: 'row', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ fontWeight: 600 }}>Rooftop Solar PV Installation</span>
              <label className="form-toggle-label">
                <input
                  type="checkbox"
                  className="form-toggle-input"
                  checked={formData.energy.hasSolar}
                  onChange={() => handleToggleChange('energy', 'hasSolar')}
                />
                <div className="form-toggle-switch"></div>
              </label>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="calc-form-step">
            <div className="form-group">
              <label className="form-label">
                <span>Dietary Habit Pattern</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                  {formData.diet.charAt(0).toUpperCase() + formData.diet.slice(1)}
                </span>
              </label>
              <select
                className="form-select"
                value={formData.diet}
                onChange={e => handleSelectChange('diet', null, e.target.value)}
              >
                <option value="vegan">Vegan (No animal products)</option>
                <option value="vegetarian">Vegetarian (Dairy/eggs, no meat)</option>
                <option value="flexitarian">Flexitarian (Occasional poultry/seafood, low red meat)</option>
                <option value="meatHeavy">Meat-Heavy (Frequent beef, pork, and dairy)</option>
              </select>
            </div>

            <div className="eco-card" style={{ background: 'rgba(255, 255, 255, 0.01)', borderStyle: 'dashed', marginTop: '16px' }}>
              <h4 style={{ color: 'var(--color-secondary)', fontSize: '0.95rem', marginBottom: '8px' }}>Eco-Insight: Diet & Methane</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Red meat consumption (specifically beef and lamb) carries a high climate load. A single high-meat diet creates over 4x the daily carbon emissions of a vegan diet due to enteric fermentation (methane) and land clearing.
              </p>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="calc-form-step">
            <div className="form-group">
              <label className="form-label">
                <span>New Clothes Purchased (Monthly)</span>
                <span>{formData.consumption.clothingMonthly} items</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                className="form-input-slider"
                value={formData.consumption.clothingMonthly}
                onChange={e =>
                  handleSliderChange('consumption', 'clothingMonthly', Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>New Electronics Purchased (Monthly)</span>
                <span>{formData.consumption.electronicsMonthly} items</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                className="form-input-slider"
                value={formData.consumption.electronicsMonthly}
                onChange={e =>
                  handleSliderChange('consumption', 'electronicsMonthly', Number(e.target.value))
                }
              />
            </div>
          </div>
        )}

        <div className="calc-navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePrev}
            disabled={activeStep === 0}
            style={{ opacity: activeStep === 0 ? 0.4 : 1 }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button className="btn btn-primary" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Calculate Carbon Score' : 'Next Step'}{' '}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
