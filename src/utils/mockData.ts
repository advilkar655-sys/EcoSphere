export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  footprint: number; // Metric Tons CO2e
  xp: number;
  level: number;
  isSelf?: boolean;
}

export interface CommunityQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  carbonSaving: number; // kg CO2e
  category: 'transport' | 'energy' | 'diet' | 'consumption';
  participants: number;
  completed: boolean;
}

export interface LearnTopic {
  id: string;
  title: string;
  shortDesc: string;
  content: string;
  sources: string[];
  tips: string[];
}

export const initialLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Sarah Jenkins", avatar: "🌱", footprint: 2.1, xp: 4850, level: 14 },
  { rank: 2, name: "Liam O'Connor", avatar: "🚴", footprint: 3.4, xp: 4200, level: 12 },
  { rank: 3, name: "Emma Patel", avatar: "🥗", footprint: 2.8, xp: 3950, level: 11 },
  { rank: 4, name: "Kenji Sato", avatar: "☀️", footprint: 4.2, xp: 3400, level: 10 },
  { rank: 5, name: "You (Eco-Warrior)", avatar: "⚡", footprint: 5.5, xp: 1250, level: 4, isSelf: true },
  { rank: 6, name: "David Miller", avatar: "🚗", footprint: 7.9, xp: 950, level: 3 },
  { rank: 7, name: "Sofia Rodriguez", avatar: "🧥", footprint: 6.3, xp: 800, level: 2 }
];

export const communityQuests: CommunityQuest[] = [
  {
    id: "quest-1",
    title: "Transit Hero Challenge",
    description: "Replace all car commutes with public transit or cycling for 5 consecutive work days.",
    xpReward: 350,
    carbonSaving: 32.5,
    category: "transport",
    participants: 1243,
    completed: false
  },
  {
    id: "quest-2",
    title: "Dietary Shift Week",
    description: "Adopt a fully vegetarian or vegan diet for 7 days. Discover plant-based recipes.",
    xpReward: 300,
    carbonSaving: 14.7,
    category: "diet",
    participants: 952,
    completed: false
  },
  {
    id: "quest-3",
    title: "Vampire Power Cut",
    description: "Unplug all electronics and chargers from outlets when not in use for 7 days straight.",
    xpReward: 150,
    carbonSaving: 5.8,
    category: "energy",
    participants: 2109,
    completed: true
  },
  {
    id: "quest-4",
    title: "Thrift-Only Month",
    description: "Avoid purchasing any new clothing items this month. Repurpose or buy second-hand if necessary.",
    xpReward: 400,
    carbonSaving: 42.0,
    category: "consumption",
    participants: 580,
    completed: false
  }
];

export const educationalTopics: LearnTopic[] = [
  {
    id: "topic-1",
    title: "Greenhouse Gases (GHGs)",
    shortDesc: "What are GHGs and how do they impact our global climate system?",
    content: "Greenhouse gases include carbon dioxide (CO2), methane (CH4), nitrous oxide (N2O), and fluorinated gases. They act as a blanket around the Earth, trapping solar heat inside the atmosphere. This process, known as the greenhouse effect, is vital for maintaining life on Earth, but human activities (burning fossil fuels, deforestation, agriculture) have released excess GHGs. CO2 represents 80% of human GHG emissions and can persist in the atmosphere for centuries.",
    sources: ["IPCC Assessment Reports", "US Environmental Protection Agency (EPA)"],
    tips: [
      "Choose energy suppliers that draw power from renewable sources like solar, wind, and hydro.",
      "Reduce household electrical loads by switching to LED light fixtures and Energy Star appliances."
    ]
  },
  {
    id: "topic-2",
    title: "Understanding CO2e Metrics",
    shortDesc: "What does 'CO2e' mean and how do different gases compare?",
    content: "CO2e stands for Carbon Dioxide Equivalent. Since different greenhouse gases have varying degrees of warming potential (Global Warming Potential or GWP) and stay in the atmosphere for different amounts of time, CO2e is used to standardize them. For instance, methane is 28 times more potent than carbon dioxide over a 100-year timescale. By multiplying the weight of methane by 28, we convert it to its equivalent amount of carbon dioxide, creating a single, consistent metric for tracking.",
    sources: ["World Resources Institute (WRI)", "UN Framework Convention on Climate Change (UNFCCC)"],
    tips: [
      "Understand that reducing beef and dairy consumption has an outsized impact because cattle release significant methane (CH4) emissions.",
      "Minimize organic kitchen waste sending to landfills, where anaerobic decay releases methane gas."
    ]
  },
  {
    id: "topic-3",
    title: "The Paris Agreement Goal",
    shortDesc: "Why is limiting warming to 1.5°C the critical baseline?",
    content: "Adopted in 2015, the Paris Agreement is a legally binding international treaty on climate change. Its goal is to limit global warming to well below 2°C, preferably to 1.5°C, compared to pre-industrial levels. Exceeding 1.5°C increases the frequency of extreme weather events, raises sea levels, melts ice sheets, and triggers irreversible tipping points in ocean currents and ecosystems. Achieving this requires reaching global net-zero emissions by 2050.",
    sources: ["United Nations Climate Change Secretariat", "Climate Action Tracker"],
    tips: [
      "Target an individual carbon footprint of under 2.0 metric tons annually, the baseline target for sustainable global parity.",
      "Support community-level tree planting campaigns and local decarbonization policy goals."
    ]
  }
];

export interface AITip {
  category: 'transport' | 'energy' | 'diet' | 'consumption';
  tip: string;
  impact: string; // text description of savings
  savingKg: number; // numeric saving for calculation
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Generates mock AI-Coach recommendations based on highest emission categories.
 */
export function generateLocalEcoTips(
  transport: number,
  energy: number,
  diet: number,
  consumption: number
): AITip[] {
  const tips: AITip[] = [];

  // Transport Tip
  if (transport > 4) {
    tips.push({
      category: 'transport',
      tip: "Swap 2 daily car commutes with public transit or carpooling.",
      impact: "Reduces your transportation carbon footprint by ~850 kg CO2e/year.",
      savingKg: 850,
      difficulty: 'medium'
    });
  } else if (transport > 1.5) {
    tips.push({
      category: 'transport',
      tip: "Switch to a bicycle or walk for trips under 3km.",
      impact: "Saves ~320 kg CO2e/year and enhances health.",
      savingKg: 320,
      difficulty: 'easy'
    });
  } else {
    tips.push({
      category: 'transport',
      tip: "Keep tires fully inflated and practice hypermiling.",
      impact: "Improves fuel mileage by 3-5%, saving ~120 kg CO2e/year.",
      savingKg: 120,
      difficulty: 'easy'
    });
  }

  // Energy Tip
  if (energy > 3) {
    tips.push({
      category: 'energy',
      tip: "Lower your thermostat by 2°C in winter and raise it 2°C in summer.",
      impact: "Reduces home heating/cooling footprint by ~680 kg CO2e/year.",
      savingKg: 680,
      difficulty: 'easy'
    });
  } else if (energy > 1) {
    tips.push({
      category: 'energy',
      tip: "Install smart power strips to shut down vampire power draw.",
      impact: "Saves ~190 kg CO2e/year on idle household electronics.",
      savingKg: 190,
      difficulty: 'easy'
    });
  } else {
    tips.push({
      category: 'energy',
      tip: "Upgrade remaining lights to high-efficiency LED bulbs.",
      impact: "Trims household lighting energy use by 75%, saving ~80 kg CO2e/year.",
      savingKg: 80,
      difficulty: 'easy'
    });
  }

  // Diet Tip
  if (diet > 2.0) {
    tips.push({
      category: 'diet',
      tip: "Implement 'Meatless Mondays' and replace beef with poultry or legumes.",
      impact: "Saves ~450 kg CO2e/year by cutting cattle impact.",
      savingKg: 450,
      difficulty: 'easy'
    });
  } else {
    tips.push({
      category: 'diet',
      tip: "Buy locally grown, seasonal organic produce to reduce shipping impacts.",
      impact: "Reduces diet transportation impact by ~180 kg CO2e/year.",
      savingKg: 180,
      difficulty: 'medium'
    });
  }

  // Consumption Tip
  if (consumption > 1.5) {
    tips.push({
      category: 'consumption',
      tip: "Extend smartphone and laptop upgrades by 1 year.",
      impact: "Avoids high-emissions electronics manufacturing, saving ~250 kg CO2e/year.",
      savingKg: 250,
      difficulty: 'medium'
    });
  } else {
    tips.push({
      category: 'consumption',
      tip: "Host or attend clothing swap meets instead of purchasing retail items.",
      impact: "Cuts manufacturing footprint of garments, saving ~110 kg CO2e/year.",
      savingKg: 110,
      difficulty: 'medium'
    });
  }

  return tips;
}
