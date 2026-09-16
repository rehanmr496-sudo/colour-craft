import { ColoringBook } from '../types';

// Crisp black-and-white thick line art SVG data URLs
const createLineArtSvg = (content: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
    <rect width="600" height="800" fill="#ffffff"/>
    <rect x="20" y="20" width="560" height="760" rx="16" fill="none" stroke="#222222" stroke-width="8"/>
    <rect x="36" y="36" width="528" height="728" rx="8" fill="none" stroke="#444444" stroke-width="3" stroke-dasharray="8 6"/>
    ${content}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Cover Page Art: Happy T-Rex in astronaut helmet
const coverSvg = createLineArtSvg(`
  <!-- Stars & planets in background -->
  <circle cx="100" cy="120" r="30" fill="none" stroke="#111" stroke-width="8"/>
  <ellipse cx="100" cy="120" rx="50" ry="12" fill="none" stroke="#111" stroke-width="7" transform="rotate(-20 100 120)"/>
  <circle cx="500" cy="180" r="18" fill="none" stroke="#111" stroke-width="7"/>
  <path d="M 450,90 L 460,110 L 480,110 L 465,125 L 472,145 L 450,132 L 428,145 L 435,125 L 420,110 L 440,110 Z" fill="none" stroke="#111" stroke-width="6"/>
  <path d="M 120,680 L 128,695 L 145,695 L 132,705 L 138,720 L 120,710 L 102,720 L 108,705 L 95,695 L 112,695 Z" fill="none" stroke="#111" stroke-width="6"/>

  <!-- T-Rex Astronaut -->
  <!-- Helmet -->
  <circle cx="300" cy="280" r="110" fill="#fff" stroke="#111" stroke-width="9"/>
  <ellipse cx="300" cy="280" rx="90" ry="90" fill="none" stroke="#333" stroke-width="4"/>
  <!-- Cute Dino Head inside helmet -->
  <path d="M 230,280 C 230,210 320,190 350,230 C 370,250 390,270 380,310 C 360,330 300,340 250,330 Z" fill="#fff" stroke="#111" stroke-width="8"/>
  <!-- Eye -->
  <circle cx="310" cy="240" r="14" fill="#111"/>
  <circle cx="306" cy="236" r="4" fill="#fff"/>
  <!-- Smile with tooth -->
  <path d="M 280,300 Q 330,320 360,290" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/>
  <polygon points="320,305 328,320 336,308" fill="#fff" stroke="#111" stroke-width="5"/>

  <!-- Spacesuit Body -->
  <path d="M 210,380 C 190,460 210,560 240,620 L 360,620 C 390,560 410,460 390,380 Z" fill="#fff" stroke="#111" stroke-width="9"/>
  <!-- Chest badge with rocket -->
  <rect x="270" y="420" width="60" height="50" rx="8" fill="none" stroke="#111" stroke-width="6"/>
  <path d="M 300,430 L 315,455 L 285,455 Z" fill="none" stroke="#111" stroke-width="5"/>
  <!-- Belt -->
  <rect x="230" y="520" width="140" height="24" rx="6" fill="none" stroke="#111" stroke-width="7"/>
  <circle cx="300" cy="532" r="8" fill="none" stroke="#111" stroke-width="5"/>

  <!-- Little Dino Arms holding banner -->
  <path d="M 230,420 Q 180,440 180,480" fill="none" stroke="#111" stroke-width="9" stroke-linecap="round"/>
  <path d="M 370,420 Q 420,440 420,480" fill="none" stroke="#111" stroke-width="9" stroke-linecap="round"/>

  <!-- Chunky space boots -->
  <path d="M 230,620 L 230,690 C 200,690 190,720 250,720 L 280,720 L 280,620 Z" fill="#fff" stroke="#111" stroke-width="8"/>
  <path d="M 320,620 L 320,720 L 350,720 C 410,720 400,690 370,690 L 370,620 Z" fill="#fff" stroke="#111" stroke-width="8"/>
`);

// Page 1: Rocket Boots Liftoff
const page1Svg = createLineArtSvg(`
  <!-- Rocket dinosaur launching -->
  <ellipse cx="300" cy="360" rx="90" ry="130" fill="#fff" stroke="#111" stroke-width="8"/>
  <!-- Helmet -->
  <circle cx="300" cy="200" r="80" fill="#fff" stroke="#111" stroke-width="8"/>
  <circle cx="280" cy="190" r="12" fill="#111"/>
  <circle cx="276" cy="186" r="3" fill="#fff"/>
  <path d="M 280,230 Q 320,245 340,220" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/>
  
  <!-- Rocket Boots with flames -->
  <rect x="210" y="480" width="60" height="80" rx="10" fill="#fff" stroke="#111" stroke-width="8"/>
  <rect x="330" y="480" width="60" height="80" rx="10" fill="#fff" stroke="#111" stroke-width="8"/>
  <!-- Flame blasts -->
  <path d="M 215,565 Q 240,680 270,565" fill="none" stroke="#111" stroke-width="8"/>
  <path d="M 335,565 Q 360,680 390,565" fill="none" stroke="#111" stroke-width="8"/>
  <path d="M 225,565 Q 240,640 255,565" fill="none" stroke="#333" stroke-width="4"/>
  <path d="M 345,565 Q 360,640 375,565" fill="none" stroke="#333" stroke-width="4"/>

  <!-- Clouds of space smoke -->
  <path d="M 120,680 Q 180,620 250,660 Q 320,610 390,660 Q 460,620 520,680" fill="none" stroke="#111" stroke-width="8"/>
  
  <!-- Little moon -->
  <circle cx="480" cy="140" r="50" fill="#fff" stroke="#111" stroke-width="8"/>
  <circle cx="460" cy="120" r="10" fill="none" stroke="#111" stroke-width="5"/>
  <circle cx="490" cy="160" r="8" fill="none" stroke="#111" stroke-width="5"/>
`);

// Page 2: Stegosaurus in Asteroid Belt
const page2Svg = createLineArtSvg(`
  <!-- Stegosaurus in Space -->
  <ellipse cx="300" cy="420" rx="150" ry="90" fill="#fff" stroke="#111" stroke-width="8"/>
  <!-- Head with space helmet -->
  <circle cx="150" cy="430" r="55" fill="#fff" stroke="#111" stroke-width="8"/>
  <circle cx="140" cy="420" r="9" fill="#111"/>
  <path d="M 120,445 Q 140,460 160,445" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/>
  
  <!-- Stego Back Plates -->
  <polygon points="210,335 230,270 250,335" fill="#fff" stroke="#111" stroke-width="7"/>
  <polygon points="260,330 285,250 310,330" fill="#fff" stroke="#111" stroke-width="7"/>
  <polygon points="320,335 345,260 370,335" fill="#fff" stroke="#111" stroke-width="7"/>
  <polygon points="380,345 405,280 425,355" fill="#fff" stroke="#111" stroke-width="7"/>

  <!-- Tail with Spikes -->
  <path d="M 445,430 Q 520,410 540,380" fill="none" stroke="#111" stroke-width="8"/>
  <line x1="520" y1="390" x2="540" y2="350" stroke="#111" stroke-width="7" stroke-linecap="round"/>
  <line x1="535" y1="400" x2="565" y2="380" stroke="#111" stroke-width="7" stroke-linecap="round"/>

  <!-- Floating Asteroid Rocks -->
  <path d="M 80,180 Q 110,150 140,170 Q 170,210 130,240 Q 90,230 80,180 Z" fill="#fff" stroke="#111" stroke-width="7"/>
  <path d="M 440,150 Q 480,120 510,150 Q 540,190 490,220 Q 430,200 440,150 Z" fill="#fff" stroke="#111" stroke-width="7"/>
  <path d="M 240,620 Q 280,590 320,620 Q 350,670 290,690 Q 220,660 240,620 Z" fill="#fff" stroke="#111" stroke-width="7"/>
`);

// Page 3: Pterodactyl Soaring Past Saturn
const page3Svg = createLineArtSvg(`
  <!-- Giant Saturn with rings -->
  <circle cx="420" cy="220" r="80" fill="#fff" stroke="#111" stroke-width="8"/>
  <ellipse cx="420" cy="220" rx="140" ry="30" fill="none" stroke="#111" stroke-width="9" transform="rotate(-20 420 220)"/>
  <ellipse cx="420" cy="220" rx="160" ry="40" fill="none" stroke="#444" stroke-width="4" stroke-dasharray="8 6" transform="rotate(-20 420 220)"/>

  <!-- Flying Pterodactyl with wings -->
  <ellipse cx="240" cy="460" rx="40" ry="70" fill="#fff" stroke="#111" stroke-width="8" transform="rotate(30 240 460)"/>
  <!-- Beak & Crest in glass bubble -->
  <circle cx="170" cy="380" r="55" fill="#fff" stroke="#111" stroke-width="8"/>
  <polygon points="150,380 90,410 160,420" fill="#fff" stroke="#111" stroke-width="7"/>
  <polygon points="170,340 190,290 200,340" fill="#fff" stroke="#111" stroke-width="7"/>
  <circle cx="150" cy="375" r="8" fill="#111"/>

  <!-- Wide Wings -->
  <path d="M 210,430 Q 80,360 40,300 Q 140,430 200,480" fill="#fff" stroke="#111" stroke-width="8"/>
  <path d="M 270,430 Q 400,380 480,340 Q 380,460 290,490" fill="#fff" stroke="#111" stroke-width="8"/>

  <!-- Stars -->
  <polygon points="80,120 90,140 110,140 95,155 100,175 80,162 60,175 65,155 50,140 70,140" fill="none" stroke="#111" stroke-width="6"/>
  <polygon points="280,120 290,140 310,140 295,155 300,175 280,162 260,175 265,155 250,140 270,140" fill="none" stroke="#111" stroke-width="6"/>
`);

// Page 4: Triceratops Crater Exploration
const page4Svg = createLineArtSvg(`
  <!-- Triceratops with 3 horns -->
  <ellipse cx="300" cy="450" rx="130" ry="90" fill="#fff" stroke="#111" stroke-width="8"/>
  <!-- Frill & Head -->
  <ellipse cx="180" cy="420" rx="70" ry="70" fill="#fff" stroke="#111" stroke-width="8"/>
  <circle cx="160" cy="380" r="12" fill="#fff" stroke="#111" stroke-width="7"/>
  <circle cx="210" cy="380" r="12" fill="#fff" stroke="#111" stroke-width="7"/>
  <circle cx="185" cy="450" r="10" fill="#fff" stroke="#111" stroke-width="7"/>
  <circle cx="180" cy="415" r="9" fill="#111"/>

  <!-- Cute alien friend in a flying saucer -->
  <ellipse cx="450" cy="220" rx="70" ry="25" fill="#fff" stroke="#111" stroke-width="8"/>
  <circle cx="450" cy="190" r="35" fill="#fff" stroke="#111" stroke-width="7"/>
  <!-- Alien face with antenna -->
  <circle cx="450" cy="190" r="8" fill="#111"/>
  <line x1="450" y1="155" x2="450" y2="135" stroke="#111" stroke-width="6"/>
  <circle cx="450" cy="130" r="8" fill="#111"/>

  <!-- Lunar crater ground -->
  <path d="M 40,650 Q 180,590 320,630 Q 460,580 560,650" fill="none" stroke="#111" stroke-width="9"/>
  <ellipse cx="160" cy="670" rx="50" ry="18" fill="none" stroke="#111" stroke-width="6"/>
  <ellipse cx="440" cy="680" rx="60" ry="20" fill="none" stroke="#111" stroke-width="6"/>
`);

// Page 5: Team Star Party & Bedtime Celebration
const page5Svg = createLineArtSvg(`
  <!-- Team constellation picnic banner -->
  <path d="M 60,160 Q 300,240 540,160" fill="none" stroke="#111" stroke-width="6" stroke-dasharray="10 8"/>
  <!-- Pennant flags -->
  <polygon points="120,175 150,225 180,185" fill="#fff" stroke="#111" stroke-width="6"/>
  <polygon points="220,190 250,245 280,198" fill="#fff" stroke="#111" stroke-width="6"/>
  <polygon points="320,198 350,245 380,190" fill="#fff" stroke="#111" stroke-width="6"/>
  <polygon points="420,185 450,225 480,175" fill="#fff" stroke="#111" stroke-width="6"/>

  <!-- Central T-Rex holding a star mug -->
  <ellipse cx="300" cy="440" rx="90" ry="110" fill="#fff" stroke="#111" stroke-width="8"/>
  <circle cx="300" cy="300" r="70" fill="#fff" stroke="#111" stroke-width="8"/>
  <circle cx="280" cy="290" r="10" fill="#111"/>
  <path d="M 280,330 Q 310,345 330,325" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/>

  <!-- Sleeping cap on Dino head -->
  <path d="M 250,255 Q 300,180 370,190 L 360,260 Z" fill="#fff" stroke="#111" stroke-width="7"/>
  <circle cx="375" cy="190" r="14" fill="#fff" stroke="#111" stroke-width="6"/>

  <!-- Picnic Blanket with craters -->
  <rect x="140" y="580" width="320" height="90" rx="10" fill="#fff" stroke="#111" stroke-width="8"/>
  <line x1="220" y1="580" x2="220" y2="670" stroke="#444" stroke-width="4" stroke-dasharray="6 6"/>
  <line x1="300" y1="580" x2="300" y2="670" stroke="#444" stroke-width="4" stroke-dasharray="6 6"/>
  <line x1="380" y1="580" x2="380" y2="670" stroke="#444" stroke-width="4" stroke-dasharray="6 6"/>

  <!-- Crescent moon smiling -->
  <path d="M 460,90 A 40,40 0 1,0 520,150 A 30,30 0 1,1 460,90 Z" fill="#fff" stroke="#111" stroke-width="7"/>
`);

export const SAMPLE_BOOK: ColoringBook = {
  id: 'sample-space-dinosaurs',
  childName: 'Leo',
  theme: 'Space Dinosaurs',
  bookTitle: "Leo's Space Dinosaur Adventure",
  bookSubtitle: '5 thick-line printable scenes exploring galaxies, asteroids, and starry craters!',
  coverImagePrompt: "A happy cartoon T-Rex wearing a round astronaut helmet, waving hello from the moon with thick clean black outlines, coloring book style for kids.",
  coverImageUrl: coverSvg,
  coverStatus: 'ready',
  coverError: null,
  imageResolution: '1K',
  createdAt: Date.now(),
  pages: [
    {
      pageNumber: 1,
      title: 'Scene 1: Rocket Boots Blast-Off!',
      description: 'Rex straps on his twin rocket boots and launches into the starry cosmos.',
      imagePrompt: "Cute T-Rex dinosaur wearing high-tech rocket boots blasting off into space with smoke clouds and floating stars, thick clean black outlines, coloring book style for kids.",
      imageUrl: page1Svg,
      status: 'ready',
      errorMessage: null,
    },
    {
      pageNumber: 2,
      title: 'Scene 2: Floating Through Asteroids',
      description: 'Sammy the Stegosaurus balances gently on floating space rocks and cosmic berries.',
      imagePrompt: "Friendly Stegosaurus floating peacefully among smooth round asteroids and sparkling star dust, thick bold black outlines, coloring book page for children.",
      imageUrl: page2Svg,
      status: 'ready',
      errorMessage: null,
    },
    {
      pageNumber: 3,
      title: 'Scene 3: Gliding Around the Ringed Planet',
      description: 'Penny the Pterodactyl loops through Saturn’s shining rings and says hello to the stars.',
      imagePrompt: "Happy Pterodactyl dinosaur flying with wide wings past a giant ringed planet Saturn with clean bold lines and white background, coloring book style.",
      imageUrl: page3Svg,
      status: 'ready',
      errorMessage: null,
    },
    {
      pageNumber: 4,
      title: 'Scene 4: The Crater Alien Friendship',
      description: 'Toby the Triceratops shares moon cookies with a friendly three-eyed alien visitor.',
      imagePrompt: "Cute Triceratops dinosaur with round horns sitting on moon craters waving at a small smiling alien in a saucer, thick bold lines, coloring page.",
      imageUrl: page4Svg,
      status: 'ready',
      errorMessage: null,
    },
    {
      pageNumber: 5,
      title: 'Scene 5: Cosmic Starlight Picnic & Bedtime',
      description: 'The whole dinosaur space crew gathers on their picnic blanket under a smiling crescent moon.',
      imagePrompt: "Group of cute baby dinosaurs having a stargazing picnic with sleeping hats and crescent moon, thick black outlines, printable coloring page for kids.",
      imageUrl: page5Svg,
      status: 'ready',
      errorMessage: null,
    },
  ],
};
