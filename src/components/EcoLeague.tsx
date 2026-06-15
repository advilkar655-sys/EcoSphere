import React, { useState } from 'react';
import { initialLeaderboard, communityQuests, type LeaderboardUser, type CommunityQuest } from '../utils/mockData';
import { Trophy, Users, Award, Check, UploadCloud, X, Zap } from 'lucide-react';

interface EcoLeagueProps {
  currentFootprint: number;
  userXP: number;
  userLevel: number;
  onUpdateXP: (newXP: number, newLevel: number) => void;
}

export const EcoLeague: React.FC<EcoLeagueProps> = ({
  currentFootprint,
  userXP,
  userLevel,
  onUpdateXP
}) => {
  const [tab, setTab] = useState<'quests' | 'leaderboard'>('quests');
  const [quests, setQuests] = useState<CommunityQuest[]>(communityQuests);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(
    initialLeaderboard.map(u => (u.isSelf ? { ...u, footprint: currentFootprint, xp: userXP, level: userLevel } : u))
  );

  // Modal State for Uploading Proof
  const [activeQuestModal, setActiveQuestModal] = useState<CommunityQuest | null>(null);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync leaderboard whenever user stats update
  React.useEffect(() => {
    setLeaderboard(prev => {
      const updated = prev.map(u => 
        u.isSelf ? { ...u, footprint: currentFootprint, xp: userXP, level: userLevel } : u
      );
      // Re-sort by XP descending
      return updated.sort((a, b) => b.xp - a.xp).map((u, idx) => ({ ...u, rank: idx + 1 }));
    });
  }, [currentFootprint, userXP, userLevel]);

  // Open Proof Modal
  const openProofModal = (quest: CommunityQuest) => {
    setActiveQuestModal(quest);
    setFileUploaded(false);
    setIsVerifying(false);
  };

  // Drag over handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFileUploaded(true);
  };

  // Submit and verify image simulation
  const handleVerifyProof = () => {
    if (!activeQuestModal) return;
    setIsVerifying(true);

    // Mocks Gemini Multimodal Vision API verification of uploaded file
    setTimeout(() => {
      const addedXP = activeQuestModal.xpReward;
      const targetXP = userXP + addedXP;
      
      // Level calculation: 1 level per 1000 XP
      const targetLevel = Math.floor(targetXP / 1000) + 1;
      const levelUpOccurred = targetLevel > userLevel;

      // Update quest completion status
      setQuests(prev => prev.map(q => q.id === activeQuestModal.id ? { ...q, completed: true } : q));
      
      // Update XP
      onUpdateXP(targetXP, targetLevel);
      
      setIsVerifying(false);
      setActiveQuestModal(null);
      
      // Notify user
      setNotification(`🎉 Quest Verified! Gemini Vision confirmed your receipt/ticket. You earned +${addedXP} XP! ${
        levelUpOccurred ? `⭐ LEVEL UP! You reached Level ${targetLevel}!` : ''
      }`);
      
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }, 2500);
  };

  return (
    <div className="calc-container animate-fade-in" style={{ maxWidth: '800px' }}>
      
      {/* Show verification alerts */}
      {notification && (
        <div 
          className="eco-card accent" 
          style={{ 
            borderColor: 'var(--color-primary)', 
            background: 'rgba(16, 185, 129, 0.08)',
            marginBottom: '20px',
            padding: '16px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Award style={{ color: 'var(--color-primary)' }} />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs selectors */}
      <div 
        style={{ 
          display: 'flex', 
          background: 'rgba(255, 255, 255, 0.02)', 
          padding: '4px', 
          borderRadius: '10px', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: '24px'
        }}
      >
        <button
          className={`nav-btn ${tab === 'quests' ? 'active' : ''}`}
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => setTab('quests')}
        >
          <Users size={16} /> Active Quests
        </button>
        <button
          className={`nav-btn ${tab === 'leaderboard' ? 'active' : ''}`}
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => setTab('leaderboard')}
        >
          <Trophy size={16} /> Leaderboard
        </button>
      </div>

      {tab === 'quests' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {quests.map(quest => (
            <div 
              key={quest.id} 
              className={`eco-card ${quest.completed ? '' : 'primary'}`}
              style={{ opacity: quest.completed ? 0.75 : 1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span 
                    style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      color: 'var(--text-secondary)',
                      fontWeight: 700
                    }}
                  >
                    {quest.category} challenge
                  </span>
                  <h4 style={{ fontSize: '1.15rem', marginTop: '6px', color: '#fff' }}>
                    {quest.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    {quest.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.95rem' }}>
                    +{quest.xpReward} XP
                  </div>
                  <div style={{ color: 'var(--color-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
                    -{quest.carbonSaving} kg CO2e
                  </div>
                </div>
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '18px', 
                  paddingTop: '14px', 
                  borderTop: '1px solid rgba(255, 255, 255, 0.04)' 
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  👥 {quest.participants.toLocaleString()} eco-citizens participating
                </span>
                
                {quest.completed ? (
                  <span 
                    style={{ 
                      color: 'var(--color-secondary)', 
                      fontSize: '0.9rem', 
                      fontWeight: 700, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px' 
                    }}
                  >
                    <Check size={16} /> Completed
                  </span>
                ) : (
                  <button 
                    className="claim-xp-btn"
                    onClick={() => openProofModal(quest)}
                  >
                    Submit Proof
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="eco-card primary">
          <h3 className="eco-card-title">
            <Trophy size={20} /> Eco-Warrior Rankings
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Earn XP by completing challenges to climb the ranks and motivate your community peers.
          </p>

          <div className="leaderboard-list">
            {leaderboard.map(user => (
              <div key={user.rank} className={`leaderboard-row ${user.isSelf ? 'self' : ''}`}>
                <div className="rank-badge">{user.rank}</div>
                <div className="user-avatar">{user.avatar}</div>
                <div className="user-name-info">
                  <div className="leaderboard-name">
                    {user.name} {user.isSelf && <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem' }}>(You)</span>}
                  </div>
                  <div className="leaderboard-level">Level {user.level} Climate Saver</div>
                </div>
                <div className="leaderboard-stats">
                  <div className="leaderboard-score">{user.footprint} T CO2e/yr</div>
                  <div className="leaderboard-xp">{user.xp.toLocaleString()} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proof Submission Modal */}
      {activeQuestModal && (
        <div className="modal-overlay">
          <div className="eco-card primary modal-content" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} style={{ color: 'var(--color-primary)' }} /> Submit Quest Proof
              </h3>
              <button 
                onClick={() => setActiveQuestModal(null)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Upload an image of your action (e.g. transit bus pass, vegetarian meal prep, or energy bill) for automated AI verification.
            </p>

            <div 
              className="file-upload-zone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => setFileUploaded(true)}
            >
              <UploadCloud size={32} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
              {fileUploaded ? (
                <div>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 700, fontSize: '0.9rem' }}>
                    ✔ receipt_capture.jpg selected!
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Click to replace file</p>
                </div>
              ) : (
                <div>
                  <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                    Drag and drop file here, or click to upload
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Supports PNG, JPG, PDF up to 5MB</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '10px' }} 
                onClick={() => setActiveQuestModal(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '10px' }} 
                disabled={!fileUploaded || isVerifying}
                onClick={handleVerifyProof}
              >
                {isVerifying ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} className="animate-float" /> Scanning...
                  </span>
                ) : 'Claim XP'}
              </button>
            </div>

            {isVerifying && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textAlign: 'center', marginTop: '14px', fontStyle: 'italic' }}>
                EcoSphere Vision API analyzing proof verification...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
