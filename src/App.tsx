import { useState } from 'react';
import './App.css';
import { Dashboard } from './components/Dashboard';
import { FootprintCalc } from './components/FootprintCalc';
import { EcoCoach } from './components/EcoCoach';
import { EcoLeague } from './components/EcoLeague';
import { LearnModule } from './components/LearnModule';
import { type LifestyleData, type FootprintResult, calculateFootprint } from './utils/calculator';
import { Leaf, LayoutDashboard, Calculator, Sparkles, Trophy, BookOpen, Compass, Award } from 'lucide-react';

const defaultLifestyle: LifestyleData = {
  transport: {
    carType: 'petrolCar',
    carDistanceWeekly: 120, // km
    publicTransitDistanceWeekly: 30, // km
    annualFlightsShort: 4, // hours
    annualFlightsLong: 2 // hours
  },
  energy: {
    electricityMonthly: 280, // kWh
    naturalGasMonthly: 450, // kWh
    hasSolar: false
  },
  diet: 'flexitarian',
  consumption: {
    clothingMonthly: 3,
    electronicsMonthly: 1
  }
};

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator' | 'coach' | 'league' | 'learn'>('dashboard');
  
  // App-level state for footprint and user profile
  const [lifestyleData, setLifestyleData] = useState<LifestyleData>(defaultLifestyle);
  const [footprint, setFootprint] = useState<FootprintResult>(calculateFootprint(defaultLifestyle));
  
  const [userXP, setUserXP] = useState<number>(1250);
  const [userLevel, setUserLevel] = useState<number>(4);

  const handleCalculationComplete = (result: FootprintResult, rawData: LifestyleData) => {
    setFootprint(result);
    setLifestyleData(rawData);
    // Add XP reward for filling out calculator
    const earnedXP = 150;
    const nextXP = userXP + earnedXP;
    const nextLevel = Math.floor(nextXP / 1000) + 1;
    setUserXP(nextXP);
    if (nextLevel > userLevel) {
      setUserLevel(nextLevel);
    }
    setActiveTab('dashboard');
  };

  const handleUpdateXP = (newXP: number, newLevel: number) => {
    setUserXP(newXP);
    setUserLevel(newLevel);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Premium Header/Navbar */}
      <header className="app-header">
        <div className="container header-container">
          <a href="#" className="app-logo" onClick={() => setActiveTab('dashboard')}>
            <Leaf className="logo-icon" size={24} />
            <span>EcoSphere</span>
          </a>

          <nav className="app-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={16} />
              <span className="nav-text">Dashboard</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              <Calculator size={16} />
              <span className="nav-text">Calculator</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'coach' ? 'active' : ''}`}
              onClick={() => setActiveTab('coach')}
            >
              <Sparkles size={16} />
              <span className="nav-text">Eco-Coach</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'league' ? 'active' : ''}`}
              onClick={() => setActiveTab('league')}
            >
              <Trophy size={16} />
              <span className="nav-text">Eco-League</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'learn' ? 'active' : ''}`}
              onClick={() => setActiveTab('learn')}
            >
              <BookOpen size={16} />
              <span className="nav-text">Learn</span>
            </button>
          </nav>

          <div className="header-stats">
            <div className="user-badge" title={`${userXP} total Climate Experience Points`}>
              <Award size={14} />
              <span>Level {userLevel} Warrior</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {userXP % 1000} / 1000 XP
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="container">
          {activeTab === 'dashboard' && (
            <Dashboard 
              footprint={footprint} 
              userXP={userXP}
              userLevel={userLevel}
              onNavigateToCalc={() => setActiveTab('calculator')}
            />
          )}

          {activeTab === 'calculator' && (
            <FootprintCalc 
              initialData={lifestyleData} 
              onCalculationComplete={handleCalculationComplete} 
            />
          )}

          {activeTab === 'coach' && (
            <EcoCoach 
              footprint={footprint}
              diet={lifestyleData.diet}
            />
          )}

          {activeTab === 'league' && (
            <EcoLeague 
              currentFootprint={footprint.total}
              userXP={userXP}
              userLevel={userLevel}
              onUpdateXP={handleUpdateXP}
            />
          )}

          {activeTab === 'learn' && (
            <LearnModule />
          )}
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="app-footer">
        <div className="container">
          <p>© 2026 EcoSphere Carbon awareness platform. Empowering community decarbonization.</p>
          <div className="footer-links">
            <a href="#" onClick={() => setActiveTab('learn')} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Compass size={12} /> Science Methodology
            </a>
            <a href="https://www.ipcc.ch/" target="_blank" rel="noopener noreferrer">IPCC Standards</a>
            <a href="https://www.epa.gov/" target="_blank" rel="noopener noreferrer">US EPA</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
