// Every launch detail lives here. Anything marked TBA is a placeholder:
// swap it for the real value and the whole site updates.

export const SITE = {
  name: "Layer Machines",
  ticker: "$MACHINE",
  supply: 4444,
  chain: "Layer",
  standard: "ERC-404",
  /** Token that fees are paid out in. TBA until confirmed. */
  feeToken: "ETH",
  /** Share of every buy routed to lit machines, in percent. Placeholder. */
  feePct: 3,
  /** Set to a real URL to switch every "Buy" button on. */
  buyUrl: "" as string,
  docsUrl: "" as string,
  x: "" as string,
  telegram: "" as string,
  contract: "" as string,
} as const;

export const SUPPLY_TEXT = SITE.supply.toLocaleString("en-US");

export type Machine = {
  id: string;
  name: string;
  tagline: string;
  shell: string;
  screen: string;
  extra: string;
  /** Accent colour pulled from the art, used for glows and chips. */
  accent: string;
  img: string;
};

// The six archetypes from the lineup art. Names are suggestions; edit freely.
export const MACHINES: Machine[] = [
  {
    id: "0001",
    name: "The Original",
    tagline: "Factory white. Prints the first receipt.",
    shell: "Bone",
    screen: "Layer mark",
    extra: "Receipt printer",
    accent: "#f2f2f2",
    img: "/art/m0001.png",
  },
  {
    id: "0002",
    name: "Night Shift",
    tagline: "Green text, cold coffee, never logs off.",
    shell: "Graphite",
    screen: "Terminal",
    extra: "Coffee mug",
    accent: "#3ddc6f",
    img: "/art/m0002.png",
  },
  {
    id: "0003",
    name: "Broadcast",
    tagline: "Always on air. Always smiling.",
    shell: "Sky",
    screen: "Pixel smile",
    extra: "Antenna",
    accent: "#7cc4f2",
    img: "/art/m0003.png",
  },
  {
    id: "0004",
    name: "Sweetheart",
    tagline: "Saves everything it loves to floppy.",
    shell: "Blush",
    screen: "Heart",
    extra: "Floppy disk",
    accent: "#f36b9a",
    img: "/art/m0004.png",
  },
  {
    id: "0005",
    name: "Bull Run",
    tagline: "Charts only go one way on this screen.",
    shell: "Mint",
    screen: "Bar chart",
    extra: "Sticky note",
    accent: "#2fd3a0",
    img: "/art/m0005.png",
  },
  {
    id: "0006",
    name: "Arcade",
    tagline: "Eats the dots. Waters the cactus.",
    shell: "Apricot",
    screen: "Chomper",
    extra: "Desk cactus",
    accent: "#f2a65a",
    img: "/art/m0006.png",
  },
];

export const STEPS = [
  {
    n: "01",
    verb: "Own",
    title: `Hold a whole ${SITE.ticker}`,
    body: `Every whole token in your wallet is a machine. Buy 1, one machine boots up. Buy 0.6, it waits as a frame and completes on your next buy.`,
    lines: ["1.00 TOKEN", "= 1 MACHINE", "FRACTIONS QUEUE"],
  },
  {
    n: "02",
    verb: "Rent",
    title: "Put it to work",
    body: "Lease your machine out instead of letting it idle. Renters run it for a fixed term, you keep the deed and collect the rent.",
    lines: ["TERM-BASED", "DEED STAYS YOURS", "RENT ON TOP"],
  },
  {
    n: "03",
    verb: "Earn",
    title: "Get printed",
    body: `A cut of every buy is paid to machines that are switched on. Receipts stack up; claim them whenever you like.`,
    lines: ["FEE ON EVERY BUY", "SPLIT ACROSS MACHINES", "CLAIM ANYTIME"],
  },
];

export const FAQ = [
  {
    q: "What is ERC-404?",
    a: `A token and an NFT in one contract. ${SITE.ticker} trades like a normal token, and each whole unit you hold shows up as a machine NFT. Sell below a whole token and that machine leaves your wallet.`,
  },
  {
    q: "How many machines are there?",
    a: `${SUPPLY_TEXT}. One for every whole ${SITE.ticker} in supply. When the supply is all minted, no more machines can exist.`,
  },
  {
    q: "What happens if I buy a fraction?",
    a: "Nothing is lost. The fraction sits in your balance and your next buy tops it up. The moment you cross a whole number, a machine lands in your wallet.",
  },
  {
    q: "How does renting work?",
    a: "You list a machine for a term and a price. A renter runs it for that term. You keep ownership the whole time and the machine comes back when the term ends. Full rules land in the docs.",
  },
  {
    q: "Where do earnings come from?",
    a: `A share of every ${SITE.ticker} buy is routed to machines. No inflation, no emissions schedule: if people buy, machines get paid.`,
  },
  {
    q: "Which machine will I get?",
    a: "A random one. Shell, screen and desk extras are drawn per machine, so some combos are rarer than others.",
  },
];
