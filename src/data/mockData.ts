import { DuckleteProfile, FAQItem, ScheduleEvent, SportInfo, Team } from '../types';

export const SPORTS_DATA: SportInfo[] = [
  {
    id: 'rapids-sprint',
    name: 'Duck Rapids Sprint 50m',
    dutchName: 'Snelle Stroming Sprint',
    tagline: 'High-velocity 50-meter hydro-flume downhill dash',
    description: 'The premier speed contest of the Badeendlympics. Eight rubber ducks are released simultaneously from the hydraulic floodgate down an Olympic-grade 50-meter turbulent flume. Victory requires maximum streamlined hull design and exceptional wave piercing.',
    iconName: 'Zap',
    badgeColor: 'bg-amber-500 text-slate-950',
    accentBg: 'from-amber-500/20 to-yellow-400/5',
    poolDepth: '1.80m',
    currentSpeed: '4.2 m/s',
    duckSpec: 'Standard Class (80g - 100g), Unweighted Keel',
    scoringSystem: 'High-speed laser photo-finish with 1/1000th second precision',
    worldRecord: {
      holder: 'Flash McQuack',
      team: 'Orange Wave Squad (NED)',
      record: '11.42s',
      year: '2025'
    },
    rules: [
      'No internal mechanical propulsion or concealed chemical thrusters allowed.',
      'Ducks must clear the starting gate at the exact blow of the acoustic whistle.',
      'Capsizing results in a 2.0 second time penalty unless the duck self-rights within 3 meters.',
      'Hull dimensions must strictly conform to 85mm x 95mm maximum bounding box.'
    ],
    trackDetails: {
      length: '50.0 meters Olympic Flume',
      obstacles: '3 Artificial Class-II Rapids & Surge Drop',
      arena: 'AquaPark Rapids Flume Stadium'
    },
    keyTechnique: 'Hydrodynamic Beak Alignment & Wave Crest Surfing'
  },
  {
    id: 'quack-diving',
    name: 'Artistic Quack Diving & Synchrony',
    dutchName: 'Synchroon Duiken & Kwaken',
    tagline: 'Acrobatic plunge, splash symmetry and acoustic resonance',
    description: 'A dazzling blend of hydro-ballet and high-board launching. Pairs of rubber ducks dive from the 5-meter and 10-meter aquatic towers, evaluated on launch trajectory, mid-air rotation, entry water displacement, and the harmonic resonance of their internal squeak valve upon impact.',
    iconName: 'Waves',
    badgeColor: 'bg-sky-500 text-white',
    accentBg: 'from-sky-500/20 to-blue-400/5',
    poolDepth: '5.00m Olympic Dive Basin',
    currentSpeed: 'Calm water with acoustic acoustic sensors',
    duckSpec: 'Artistic Class (90g), Dual Harmonic Squeaker Chamber',
    scoringSystem: 'Panel of 5 International Duck Federation Judges (Difficulty × Execution Score)',
    worldRecord: {
      holder: 'Duo Quack Royale',
      team: 'Golden Quackers (BEL)',
      record: '98.75 pts',
      year: '2024'
    },
    rules: [
      'Duos must launch within 0.15s of each other for valid synchronization bonus.',
      'Squeak on water entry must register between 75dB and 92dB at the poolside microphone.',
      'Rotations are capped at 3 full somersaults per dive attempt.',
      'Zero-splash "Rip Entry" grants an automatic +5 execution score.'
    ],
    trackDetails: {
      length: '10m / 5m Dive Platform Towers',
      obstacles: 'Acoustic Sound Catchers & High-Speed Optical Splash Analyzers',
      arena: 'Royal Dive Pavilion & Crystal Pool'
    },
    keyTechnique: 'Micro-Weight Balance & Acoustic Plunge Resonance'
  },
  {
    id: 'hydro-tug',
    name: 'Giant Hydro Tug-of-War',
    dutchName: 'De Grote Hydro Touwtrekkerij',
    tagline: 'Brute buoyancy and multi-duck tethered torque battle',
    description: 'Teams of 4 specialized heavyweight ducks are harnessed via micro-braided marine cable across opposing hydro-jets. The objective is to drag the center illuminated yellow buoy past the marker line using purely fluid drag resistance, surface grip, and wave countering.',
    iconName: 'Anchor',
    badgeColor: 'bg-yellow-600 text-white',
    accentBg: 'from-yellow-600/20 to-amber-500/5',
    poolDepth: '2.20m',
    currentSpeed: 'Dual Opposing Variable Jets (0-600 L/min)',
    duckSpec: 'Heavyweight Anchor Class (120g - 140g allowed ballast)',
    scoringSystem: 'Best 2 out of 3 pulls (3-minute round time limit)',
    worldRecord: {
      holder: 'Team Titan Float',
      team: 'Nordic Bill Titans (NOR)',
      record: '18.3s Full Pull',
      year: '2025'
    },
    rules: [
      'Each team must consist of 4 registered ducks with certified harness clasps.',
      'Center buoy crossing the 1.5m adversary line triggers an instant victory.',
      'Submerging below 20cm water line for more than 5 seconds yields a stall warning.',
      'Any line entanglement with pool dividers requires a referee restart.'
    ],
    trackDetails: {
      length: '12m Tension Pull Channel',
      obstacles: 'Opposing Vortex Current Jets & Center Optical Buoy Line',
      arena: 'Hydro-Power Coliseum'
    },
    keyTechnique: 'Deep Hull Ballast Anchoring & Wave Resistance Stance'
  },
  {
    id: 'pond-water-polo',
    name: 'High-Velocity Pond Water Polo',
    dutchName: 'Eenden Waterpolo & Goal Rush',
    tagline: 'Fast-paced 4v4 duck-ball navigation and goal striking',
    description: 'An electrifying team sport played across a 25-meter miniature arena. Ducks navigate water currents and gentle air blowers to maneuver a neon micro-sphere into the opponent’s floating goal net, featuring goalkeepers with custom flotation shields.',
    iconName: 'Shield',
    badgeColor: 'bg-emerald-500 text-slate-950',
    accentBg: 'from-emerald-500/20 to-teal-400/5',
    poolDepth: '1.50m',
    currentSpeed: 'Calm arena with directional pulse jets',
    duckSpec: 'Agile Polo Spec (75g - 85g), High Friction Wing Flanks',
    scoringSystem: 'Total goals in two 8-minute halves',
    worldRecord: {
      holder: 'Amsterdam Duck Devils',
      team: 'Canal Crusaders (NED)',
      record: '14 Goals in Single Match',
      year: '2025'
    },
    rules: [
      '4 active outfield ducks and 1 goalie duck in the goal pocket.',
      'Contact between ducks is permitted as long as it does not deliberately overturn the rival.',
      'Shot clock is 30 seconds per offensive possession before a shot must be taken.',
      'A duck that flips upside down must be re-floated by the pool marshal.'
    ],
    trackDetails: {
      length: '25m x 15m Floating Water Polo Pitch',
      obstacles: 'Perimeter Float Bumpers & 1.2m Floating Goal Cages',
      arena: 'AquaPark Main Aquatic Center'
    },
    keyTechnique: 'Hull Nudging, Current Banking & Goal Line Rebounds'
  },
  {
    id: 'whirlpool-slalom',
    name: 'Whirlpool Obstacle Slalom',
    dutchName: 'Kolken & Boeien Slalom',
    tagline: 'Extreme agility through 12 revolving eddies and gate buoys',
    description: 'The supreme test of duck pilotage and hydrodynamic cunning. Ducks must navigate 12 alternating green and red slalom gates positioned around turbulent artificial whirlpools, cascading water curtains, and rubber lily pad chicanes without missing a gate.',
    iconName: 'Compass',
    badgeColor: 'bg-cyan-500 text-slate-950',
    accentBg: 'from-cyan-500/20 to-blue-500/5',
    poolDepth: '2.00m',
    currentSpeed: '3.8 m/s with 4 Cyclonic Whirlpool Generators',
    duckSpec: 'Slalom Pro Class (85g), Fin-Tuned Rudder Keel',
    scoringSystem: 'Time elapsed + 5-second penalty per touched/missed gate',
    worldRecord: {
      holder: 'Kwak Norris',
      team: 'Alpine Torrent Racers (AUT)',
      record: '24.18s',
      year: '2025'
    },
    rules: [
      'Red gates must be navigated on the left; Green gates must be navigated on the right.',
      'Touching an inflatable buoy adds a 2.0-second time penalty.',
      'Missing a gate entirely adds a strict 10.0-second time penalty.',
      'Passing through the center eye of a whirlpool is allowed if gates are maintained.'
    ],
    trackDetails: {
      length: '40m S-Curved Slalom Course',
      obstacles: '12 Slalom Gates, 4 Whirlpool Vortices, Water Spray Curtain',
      arena: 'Whirlpool Slalom Basin'
    },
    keyTechnique: 'Eddy Line Surfing & Counter-Vortex Slingshotting'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-nl-orange',
    name: 'Orange Wave Squad',
    country: 'Netherlands',
    countryCode: 'NL',
    captain: 'Sir Quacks-a-Lot',
    mascotName: 'Willem de Eend',
    duckColor: '#F59E0B',
    accessory: 'crown',
    category: 'Pro Float',
    registeredSports: ['rapids-sprint', 'pond-water-polo', 'whirlpool-slalom'],
    gold: 4,
    silver: 2,
    bronze: 1,
    totalPoints: 128,
    members: [
      { id: 'm1', name: 'Sir Quacks-a-Lot', role: 'Captain & Sprint Ace', duckNumber: 1 },
      { id: 'm2', name: 'Kees van de Plas', role: 'Slalom Specialist', duckNumber: 7 },
      { id: 'm3', name: 'Anouk Kwak', role: 'Water Polo Striker', duckNumber: 10 },
      { id: 'm4', name: 'Bram de Dobber', role: 'Goalkeeper Duck', duckNumber: 99 }
    ],
    bio: 'Reigning European Rubber Duck champions hailing from the canals of Utrecht. Renowned for their razor-sharp breakaways and patriotic bright orange beaks.',
    stats: {
      speed: 98,
      buoyancy: 95,
      hydroDynamics: 94,
      quackVolume: 88
    }
  },
  {
    id: 'team-be-quackers',
    name: 'Golden Quackers',
    country: 'Belgium',
    countryCode: 'BE',
    captain: 'Madame Splash',
    mascotName: 'Gaston le Canard',
    duckColor: '#FCD34D',
    accessory: 'medal',
    category: 'Pro Float',
    registeredSports: ['quack-diving', 'rapids-sprint', 'hydro-tug'],
    gold: 3,
    silver: 4,
    bronze: 2,
    totalPoints: 115,
    members: [
      { id: 'm5', name: 'Madame Splash', role: 'Captain & Dive Icon', duckNumber: 4 },
      { id: 'm6', name: 'Jean-Luc Feather', role: 'Synchronized Wing', duckNumber: 8 },
      { id: 'm7', name: 'Benoit Buoy', role: 'Anchor Heavyweight', duckNumber: 77 },
      { id: 'm8', name: 'Chloe Ripple', role: 'Speedster', duckNumber: 23 }
    ],
    bio: 'Masters of poise and acoustic harmony. Their synchronized high-platform diving routines are legendary worldwide for flawless splashless entries.',
    stats: {
      speed: 90,
      buoyancy: 98,
      hydroDynamics: 96,
      quackVolume: 92
    }
  },
  {
    id: 'team-aut-alpine',
    name: 'Alpine Torrent Racers',
    country: 'Austria',
    countryCode: 'AT',
    captain: 'Kwak Norris',
    mascotName: 'Franz the Floater',
    duckColor: '#EF4444',
    accessory: 'headband',
    category: 'Pro Float',
    registeredSports: ['whirlpool-slalom', 'rapids-sprint'],
    gold: 3,
    silver: 1,
    bronze: 3,
    totalPoints: 96,
    members: [
      { id: 'm9', name: 'Kwak Norris', role: 'Captain & Slalom World Record Holder', duckNumber: 0 },
      { id: 'm10', name: 'Heidi Downstream', role: 'Rapid Navigator', duckNumber: 12 },
      { id: 'm11', name: 'Hansi Glider', role: 'Curve Specialist', duckNumber: 33 }
    ],
    bio: 'Trained in freezing mountain rivers and raging alpine currents. They fear no whirlpool and can execute turnbacks at dizzying G-forces.',
    stats: {
      speed: 96,
      buoyancy: 91,
      hydroDynamics: 99,
      quackVolume: 85
    }
  },
  {
    id: 'team-nor-titans',
    name: 'Nordic Bill Titans',
    country: 'Norway',
    countryCode: 'NO',
    captain: 'Thor Quackson',
    mascotName: 'Odin the Unsinkable',
    duckColor: '#38BDF8',
    accessory: 'snorkel',
    category: 'Heavyweight Buoy',
    registeredSports: ['hydro-tug', 'pond-water-polo'],
    gold: 2,
    silver: 3,
    bronze: 1,
    totalPoints: 88,
    members: [
      { id: 'm12', name: 'Thor Quackson', role: 'Captain & Heavy Anchor', duckNumber: 9 },
      { id: 'm13', name: 'Astrid Current', role: 'Tug Strategist', duckNumber: 2 },
      { id: 'm14', name: 'Bjorn the Broad', role: 'Resistance Wall', duckNumber: 44 },
      { id: 'm15', name: 'Freja Splash', role: 'Polo Center', duckNumber: 17 }
    ],
    bio: 'The heavyweight juggernauts of the competition. Specially ballasted with eco-friendly marine clay to withstand the fiercest water jets.',
    stats: {
      speed: 82,
      buoyancy: 100,
      hydroDynamics: 88,
      quackVolume: 96
    }
  },
  {
    id: 'team-uk-fleet',
    name: 'Royal Bath Armada',
    country: 'United Kingdom',
    countryCode: 'GB',
    captain: 'Lord Featherington',
    mascotName: 'Her Majesty’s Duck',
    duckColor: '#FBBF24',
    accessory: 'goggles',
    category: 'Open Classic',
    registeredSports: ['rapids-sprint', 'quack-diving', 'pond-water-polo', 'whirlpool-slalom'],
    gold: 2,
    silver: 2,
    bronze: 4,
    totalPoints: 84,
    members: [
      { id: 'm16', name: 'Lord Featherington', role: 'Captain & Sprint Veteran', duckNumber: 3 },
      { id: 'm17', name: 'Pip Squeak', role: 'Diver', duckNumber: 5 },
      { id: 'm18', name: 'Winston Quackill', role: 'Tactician', duckNumber: 21 },
      { id: 'm19', name: 'Archie Float', role: 'Winger', duckNumber: 14 }
    ],
    bio: 'Historic team with classic yellow rubber heritage since 1974. Dignified, polite on the water, yet fiercely competitive on the final turn.',
    stats: {
      speed: 89,
      buoyancy: 94,
      hydroDynamics: 90,
      quackVolume: 90
    }
  },
  {
    id: 'team-de-turbo',
    name: 'Berlin Turbo Ente',
    country: 'Germany',
    countryCode: 'DE',
    captain: 'Duck von Drake',
    mascotName: 'Blitz Ente',
    duckColor: '#10B981',
    accessory: 'cape',
    category: 'Pro Float',
    registeredSports: ['rapids-sprint', 'whirlpool-slalom', 'hydro-tug'],
    gold: 2,
    silver: 1,
    bronze: 2,
    totalPoints: 76,
    members: [
      { id: 'm20', name: 'Duck von Drake', role: 'Captain & Hydro-Engineer', duckNumber: 100 },
      { id: 'm21', name: 'Max Strömung', role: 'Slalom Master', duckNumber: 11 },
      { id: 'm22', name: 'Klaus Kraft', role: 'Power Anchor', duckNumber: 55 }
    ],
    bio: 'Precision-engineered hydrodynamic contours and laser-tested buoyancy profiles. Not a single millimeter of drag is wasted.',
    stats: {
      speed: 94,
      buoyancy: 92,
      hydroDynamics: 97,
      quackVolume: 84
    }
  }
];

export const STAR_DUCKLETES: DuckleteProfile[] = [
  {
    id: 'ducklete-1',
    name: 'Sir Quacks-a-Lot',
    nickname: 'The Flying Beak',
    teamId: 'team-nl-orange',
    teamName: 'Orange Wave Squad',
    country: 'Netherlands',
    specialty: 'rapids-sprint',
    ageInFloatingDays: 1420,
    weightGrams: 88,
    duckModel: 'AeroFloat Mk-IV (Custom Gold Trim)',
    stats: {
      speed: 99,
      buoyancy: 94,
      agility: 95,
      flotationSteer: 96
    },
    achievements: [
      '2024 Olympic Sprint Champion',
      'Undefeated in 14 Flume Heats',
      'Honorary Grand Marshall of the Amsterdam Canal Parade'
    ],
    signatureMove: 'The Beak-First Wave Breaker',
    quote: '"If you are not creating a wake, you are just taking a bath."',
    avatarColor: '#F59E0B',
    avatarAccessory: 'crown'
  },
  {
    id: 'ducklete-2',
    name: 'Kwak Norris',
    nickname: 'The Vortex Tamer',
    teamId: 'team-aut-alpine',
    teamName: 'Alpine Torrent Racers',
    country: 'Austria',
    specialty: 'whirlpool-slalom',
    ageInFloatingDays: 1980,
    weightGrams: 85,
    duckModel: 'Alpine Slalom Keel v3',
    stats: {
      speed: 97,
      buoyancy: 92,
      agility: 100,
      flotationSteer: 99
    },
    achievements: [
      'Current Whirlpool Slalom World Record (24.18s)',
      '3x European Slalom Gold Winner',
      'Survives Niagara Flume with zero scuffs'
    ],
    signatureMove: 'Cyclonic Slingshot J-Turn',
    quote: '"Whirlpools do not spin me. I spin the whirlpools."',
    avatarColor: '#EF4444',
    avatarAccessory: 'headband'
  },
  {
    id: 'ducklete-3',
    name: 'Madame Splash',
    nickname: 'The Swan of the Basin',
    teamId: 'team-be-quackers',
    teamName: 'Golden Quackers',
    country: 'Belgium',
    specialty: 'quack-diving',
    ageInFloatingDays: 1100,
    weightGrams: 90,
    duckModel: 'Acoustic Resonance Pure 90',
    stats: {
      speed: 88,
      buoyancy: 99,
      agility: 98,
      flotationSteer: 94
    },
    achievements: [
      'Perfect 10.0 Dive Score at Brussels Cup',
      'Lowest Measured Water Splash Entry (0.4ml)',
      'Pioneered the Inverted Triple Wing Corkscrew'
    ],
    signatureMove: 'The Zero-Displacement Rip Plunge',
    quote: '"True grace is entering the deep without disturbing a single bubble."',
    avatarColor: '#FCD34D',
    avatarAccessory: 'medal'
  },
  {
    id: 'ducklete-4',
    name: 'Thor Quackson',
    nickname: 'The Hammer of the Fjord',
    teamId: 'team-nor-titans',
    teamName: 'Nordic Bill Titans',
    country: 'Norway',
    specialty: 'hydro-tug',
    ageInFloatingDays: 2200,
    weightGrams: 135,
    duckModel: 'Nordic Heavy Hull Armor 135',
    stats: {
      speed: 80,
      buoyancy: 100,
      agility: 82,
      flotationSteer: 92
    },
    achievements: [
      'Held opposing jet of 550 L/min for 4 continuous minutes',
      'Undefeated anchor in Tug of War since 2023',
      'Heaviest legal duck in the championship'
    ],
    signatureMove: 'Deep Keel Grounding Lockdown',
    quote: '"Stand firm as the northern ice, and the current shall bend."',
    avatarColor: '#38BDF8',
    avatarAccessory: 'snorkel'
  },
  {
    id: 'ducklete-5',
    name: 'Lord Featherington',
    nickname: 'The Dapper Drifter',
    teamId: 'team-uk-fleet',
    teamName: 'Royal Bath Armada',
    country: 'United Kingdom',
    specialty: 'pond-water-polo',
    ageInFloatingDays: 3100,
    weightGrams: 82,
    duckModel: 'Windsor Classic 1974 Edition',
    stats: {
      speed: 89,
      buoyancy: 95,
      agility: 91,
      flotationSteer: 94
    },
    achievements: [
      '500+ Career Polo Matches with 0 yellow cards',
      'Author of "The Etiquette of High-Tension Flumes"',
      'Longest continuous active career in duck sports'
    ],
    signatureMove: 'Gentlemanly Curve Pass',
    quote: '"Victory is splendid, but proper sportsmanship is eternal."',
    avatarColor: '#FBBF24',
    avatarAccessory: 'goggles'
  },
  {
    id: 'ducklete-6',
    name: 'Duck von Drake',
    nickname: 'The Hydro Mathematician',
    teamId: 'team-de-turbo',
    teamName: 'Berlin Turbo Ente',
    country: 'Germany',
    specialty: 'rapids-sprint',
    ageInFloatingDays: 1650,
    weightGrams: 86,
    duckModel: 'AeroDynamic Polymer X-1',
    stats: {
      speed: 95,
      buoyancy: 93,
      agility: 94,
      flotationSteer: 98
    },
    achievements: [
      'Designer of the patent-pending micro-vortex underside',
      'Silver Medal Rapids Sprint 2025',
      'Calculated the exact optimal line through Slalom Gate 7'
    ],
    signatureMove: 'Laminar Flow Vectoring',
    quote: '"Water is not an obstacle; it is a fluid differential equation to be solved."',
    avatarColor: '#10B981',
    avatarAccessory: 'cape'
  }
];

export const SCHEDULE_DATA: ScheduleEvent[] = [
  // Day 1
  {
    id: 'sch-101',
    title: 'Grand Opening Parade & Flaming Rubber Cauldron Lighting',
    sportId: 'rapids-sprint',
    day: 1,
    date: 'Friday, Aug 28, 2026',
    time: '10:00 - 11:30',
    stage: 'Ceremony',
    arena: 'Main Olympic Aquatic Amphitheater',
    status: 'upcoming',
    participatingTeams: ['All 24 National Squads & 1,200 Mascot Ducks'],
    description: 'The monumental duck fleet parade across the Olympic lagoon, culminating in the release of the Golden Giant Duck and the lighting of the ceremonial LED Water Fountain.'
  },
  {
    id: 'sch-102',
    title: 'Duck Rapids Sprint 50m - Qualifying Heats 1 to 4',
    sportId: 'rapids-sprint',
    day: 1,
    date: 'Friday, Aug 28, 2026',
    time: '12:30 - 14:00',
    stage: 'Heats',
    arena: 'Rapids Flume Stadium',
    status: 'upcoming',
    participatingTeams: ['Orange Wave Squad', 'Golden Quackers', 'Royal Bath Armada', 'Berlin Turbo Ente'],
    description: '32 ducks battle the high-speed flume currents in 4 preliminary heats. Top 2 from each heat advance to the semifinals.'
  },
  {
    id: 'sch-103',
    title: 'Synchronized Quack Diving - 5m Platform Preliminaries',
    sportId: 'quack-diving',
    day: 1,
    date: 'Friday, Aug 28, 2026',
    time: '15:00 - 17:00',
    stage: 'Heats',
    arena: 'Royal Dive Pavilion',
    status: 'upcoming',
    participatingTeams: ['Golden Quackers', 'Royal Bath Armada', 'Nordic Bill Titans'],
    description: 'Duo synchronized plunges scored on acoustic squeak pitch harmony and water entry perfection.'
  },
  {
    id: 'sch-104',
    title: 'Pond Water Polo - Group Stage Match 1 & 2',
    sportId: 'pond-water-polo',
    day: 1,
    date: 'Friday, Aug 28, 2026',
    time: '18:00 - 19:45',
    stage: 'Heats',
    arena: 'Main Aquatic Center',
    status: 'upcoming',
    participatingTeams: ['Orange Wave Squad', 'Nordic Bill Titans', 'Royal Bath Armada', 'Berlin Turbo Ente'],
    description: 'Opening clashes in the 4v4 goal frenzy. Fast-paced swimming and tactical duck nudging.'
  },

  // Day 2
  {
    id: 'sch-201',
    title: 'Whirlpool Obstacle Slalom - Time Trials (12 Gates)',
    sportId: 'whirlpool-slalom',
    day: 2,
    date: 'Saturday, Aug 29, 2026',
    time: '09:30 - 12:00',
    stage: 'Quarterfinals',
    arena: 'Whirlpool Slalom Basin',
    status: 'upcoming',
    participatingTeams: ['Alpine Torrent Racers', 'Berlin Turbo Ente', 'Orange Wave Squad'],
    description: 'High-tension solo time trials navigating around 4 active artificial whirlpool vortices and red/green gate buoys.'
  },
  {
    id: 'sch-202',
    title: 'Giant Hydro Tug-of-War - Round of 8 Clashes',
    sportId: 'hydro-tug',
    day: 2,
    date: 'Saturday, Aug 29, 2026',
    time: '13:00 - 15:30',
    stage: 'Quarterfinals',
    arena: 'Hydro-Power Coliseum',
    status: 'upcoming',
    participatingTeams: ['Nordic Bill Titans', 'Golden Quackers', 'Berlin Turbo Ente', 'Royal Bath Armada'],
    description: 'Head-to-head torque battles against 500 L/min opposing hydraulic jet nozzles.'
  },
  {
    id: 'sch-203',
    title: 'Duck Rapids Sprint 50m - Semifinals & B-Final',
    sportId: 'rapids-sprint',
    day: 2,
    date: 'Saturday, Aug 29, 2026',
    time: '16:00 - 17:30',
    stage: 'Semifinals',
    arena: 'Rapids Flume Stadium',
    status: 'upcoming',
    participatingTeams: ['Orange Wave Squad', 'Alpine Torrent Racers', 'Berlin Turbo Ente'],
    description: 'The fastest 8 remaining ducks vie for the 4 coveted spots in Sunday’s Grand Final.'
  },
  {
    id: 'sch-204',
    title: 'Pond Water Polo - Semifinals',
    sportId: 'pond-water-polo',
    day: 2,
    date: 'Saturday, Aug 29, 2026',
    time: '18:30 - 20:00',
    stage: 'Semifinals',
    arena: 'Main Aquatic Center',
    status: 'upcoming',
    participatingTeams: ['Orange Wave Squad', 'Nordic Bill Titans'],
    description: 'Clash of titans for the championship match tickets.'
  },

  // Day 3
  {
    id: 'sch-301',
    title: 'Giant Hydro Tug-of-War - Gold & Bronze Finals',
    sportId: 'hydro-tug',
    day: 3,
    date: 'Sunday, Aug 30, 2026',
    time: '10:00 - 11:30',
    stage: 'Grand Final',
    arena: 'Hydro-Power Coliseum',
    status: 'upcoming',
    participatingTeams: ['Nordic Bill Titans', 'Golden Quackers'],
    description: 'The climactic final pull for the Heavyweight Buoy Golden Trophy.'
  },
  {
    id: 'sch-302',
    title: 'Synchronized Quack Diving - 10m Tower Grand Finale',
    sportId: 'quack-diving',
    day: 3,
    date: 'Sunday, Aug 30, 2026',
    time: '12:00 - 13:30',
    stage: 'Grand Final',
    arena: 'Royal Dive Pavilion',
    status: 'upcoming',
    participatingTeams: ['Golden Quackers', 'Royal Bath Armada'],
    description: 'The highest-difficulty routines featuring reverse 2.5 twist entries and synchronized squeak solos.'
  },
  {
    id: 'sch-303',
    title: 'Whirlpool Obstacle Slalom - Championship Run',
    sportId: 'whirlpool-slalom',
    day: 3,
    date: 'Sunday, Aug 30, 2026',
    time: '14:00 - 15:30',
    stage: 'Grand Final',
    arena: 'Whirlpool Slalom Basin',
    status: 'upcoming',
    participatingTeams: ['Alpine Torrent Racers', 'Orange Wave Squad'],
    description: 'Kwak Norris defends his world title against the surging Dutch squad.'
  },
  {
    id: 'sch-304',
    title: 'Duck Rapids Sprint 50m - Olympic Grand Final',
    sportId: 'rapids-sprint',
    day: 3,
    date: 'Sunday, Aug 30, 2026',
    time: '16:00 - 17:00',
    stage: 'Grand Final',
    arena: 'Rapids Flume Stadium',
    status: 'upcoming',
    participatingTeams: ['Sir Quacks-a-Lot', 'Kwak Norris', 'Jean-Luc Feather', 'Duck von Drake'],
    description: 'The marquee race of the entire Badeendlympics. The fastest ducks on earth fight for eternal golden glory.'
  },
  {
    id: 'sch-305',
    title: 'Medal Ceremony, Golden Duck Award & Closing Waterworks',
    sportId: 'rapids-sprint',
    day: 3,
    date: 'Sunday, Aug 30, 2026',
    time: '18:00 - 20:00',
    stage: 'Ceremony',
    arena: 'Main Olympic Aquatic Amphitheater',
    status: 'upcoming',
    participatingTeams: ['All Champions & Spectators'],
    description: 'Bestowing of the Golden Rubber Trophies, National Anthem Quacks, and 10,000 duck victory drop.'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is the BADEENDLYMPICS?',
    answer: 'The BADEENDLYMPICS is the world premier international sporting tournament for competitive rubber ducks and their human captains. Founded on values of fair floating, sportsmanship, and hydro-athletic excellence, over 24 nations compete in 5 specialized aquatic disciplines.',
    category: 'Rules'
  },
  {
    id: 'faq-2',
    question: 'Can anyone sign up a team or custom duck?',
    answer: 'Yes! The Open Classic and Junior Quackers divisions are open to public teams, clubs, universities, and corporate flotillas. Register your team through our Sign Up portal, select your sports, configure your mascot duck, and receive your Official Team Pass.',
    category: 'Registration'
  },
  {
    id: 'faq-3',
    question: 'What are the official duck weight and size regulations?',
    answer: 'Standard Sprint and Polo ducks must weigh between 80g and 100g with maximum dimensions of 85mm x 95mm x 90mm. Heavyweight Tug-of-War ducks may weigh up to 140g. All ducks undergo laser inspection and keel ballast screening before heats.',
    category: 'Rules'
  },
  {
    id: 'faq-4',
    question: 'Where is the venue and how do I watch live?',
    answer: 'The championship is held at the Olympic Aquatic Basin in Utrecht / Almere Watersports Complex. Spectator entry to the grandstands is free of charge, with lakeside food stalls, merchandise kiosks, and giant floating jumbotron screens.',
    category: 'Venue'
  },
  {
    id: 'faq-5',
    question: 'Are motorized or remote-controlled ducks permitted?',
    answer: 'Strictly prohibited! The BADEENDLYMPICS celebrates pure hydrodynamics, natural current riding, and buoyancy craft. Any concealed micro-propellers, chemical effervescent thrusters, or magnetic tracking leads to immediate disqualification by the chief referee.',
    category: 'Rules'
  },
  {
    id: 'faq-6',
    question: 'What is the "Golden Quack of Honor" prize?',
    answer: 'In addition to Gold, Silver, and Bronze medals for each sport, the overall championship flotilla takes home the coveted 24k Gold-Leaf Bath Duck Trophy, and the Fair Play Quack is awarded to the team with the most dignified sportsmanship.',
    category: 'Rules'
  }
];
