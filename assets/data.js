// Honeyworth product line. Edit freely: everything on the site renders from this list.
// Every product is the same three-ingredient Energy Gel, packed for a different kind of mover.
// That makes the checkout data double as the playbook's audience test (run vs ride vs match vs everyday).
const HW_NUTRITION = [["Calories", "110"], ["Carbohydrate", "30 g"], ["Sugars", "29 g"], ["Sodium", "100 mg"], ["Potassium", "45 mg"], ["Calcium", "16 mg"], ["Magnesium", "4 mg"], ["Fat", "0 g"], ["Protein", "0 g"]];
const HW_INGREDIENTS = ["Canadian honey", "organic Canadian maple syrup", "pink Himalayan salt"];

window.HW_PRODUCTS = [
  {
    id: "original",
    name: "Energy Gel - Honey + Maple + Sea Salt",
    short: "Energy Gel",
    hero: ["REAL", "FUEL"],
    accent: "#E2A93B",
    sky: ["#C98A2E", "#F1D9A4"],
    price: { 20: 49, 40: 89 },
    oneLiner: "Honey, maple syrup and sea salt in one pocket-size sachet. 30g of carbs, nothing artificial.",
    desc: "Most energy gels feel like sports products. Honeyworth goes back to the source: three ingredients you already know, in a single-serving sachet you can tear open mid-session. Take one every 30 minutes and keep moving.",
    tagline: "Take it. Pocket it. Move.",
  },
  {
    id: "run",
    name: "Run Box - Energy Gel",
    short: "Run",
    hero: ["LONG", "RUN"],
    accent: "#7FA36B",
    sky: ["#2F5A3F", "#A9C29A"],
    price: { 20: 49, 40: 89 },
    oneLiner: "Long-run fuel that fits in a shorts pocket. One sachet every 30 minutes.",
    desc: "The same honey, maple and sea salt gel, boxed for runners. Slip two in your pocket for a long run, tear one open every half hour and stop overthinking your fuel.",
    tagline: "Take it. Pocket it. Run.",
  },
  {
    id: "ride",
    name: "Ride Box - Energy Gel",
    short: "Ride",
    hero: ["LONG", "RIDE"],
    accent: "#C8743A",
    sky: ["#8E4A22", "#E2B184"],
    price: { 20: 49, 40: 89 },
    oneLiner: "Jersey-pocket fuel for the long stuff. Tear, take, keep pedalling.",
    desc: "The same three-ingredient gel, boxed for cyclists. Easy to open on the bike, easy to stash in a jersey pocket, and simple enough to understand at 60 kilometres in.",
    tagline: "Take it. Pocket it. Ride.",
  },
  {
    id: "match",
    name: "Match Box - Energy Gel",
    short: "Match",
    hero: ["FULL", "TIME"],
    accent: "#8DB86A",
    sky: ["#3E6B34", "#C9DCAA"],
    price: { 20: 49, 40: 89 },
    oneLiner: "Half-time fuel for the whole squad. Honey, maple, sea salt.",
    desc: "The same Honeyworth gel, boxed for soccer and team sport. One before kick-off, one at half-time. No mixing, no shaker bottles, nothing to explain.",
    tagline: "Take it. Pocket it. Play.",
  },
  {
    id: "move",
    name: "Everyday Box - Energy Gel",
    short: "Everyday",
    hero: ["KEEP", "MOVING"],
    accent: "#8FB5B8",
    sky: ["#4F7C83", "#E5D8BC"],
    price: { 20: 49, 40: 89 },
    oneLiner: "For hikes, gym sessions, travel days and everything in between.",
    desc: "The same three-ingredient gel for people who just move. Runs, rides, hikes, lifts, airports. Keep a few in every bag and fuel without the complicated identity.",
    tagline: "Take it. Pocket it. Move.",
  },
].map((p) => ({ ...p, nutrition: HW_NUTRITION, ingr: HW_INGREDIENTS }));
