export type MenuItem = {
  name: string;
  description: string;
  priceLkr: number;
};

export type MenuCategory = {
  title: string;
  items: MenuItem[];
};

const menuData: MenuCategory[] = [
  {
    title: "Starters",
    items: [
      {
        name: "Crispy Cassava Chips",
        description: "Golden-fried manioc chips served with chili-lime dip.",
        priceLkr: 750,
      },
      {
        name: "Spiced River Prawns",
        description: "Pan-seared prawns with garlic, curry leaves, and black pepper.",
        priceLkr: 1450,
      },
      {
        name: "Woodfired Vegetable Soup",
        description: "Seasonal vegetables simmered in a light herb broth.",
        priceLkr: 680,
      },
    ],
  },
  {
    title: "Main Courses",
    items: [
      {
        name: "Heritage Rice and Curry",
        description: "Steamed rice with five curries, sambol, and papadam.",
        priceLkr: 1650,
      },
      {
        name: "Grilled River Fish",
        description: "Local fish grilled over charcoal with coconut relish.",
        priceLkr: 2400,
      },
      {
        name: "Tree House Chicken Kottu",
        description: "Chopped roti stir-fried with chicken, vegetables, and egg.",
        priceLkr: 1850,
      },
      {
        name: "Forest Garden Noodles",
        description: "Wok-tossed noodles with mushrooms, greens, and soy-ginger.",
        priceLkr: 1550,
      },
    ],
  },
  {
    title: "Beverages",
    items: [
      {
        name: "King Coconut Cooler",
        description: "Fresh king coconut water served chilled.",
        priceLkr: 550,
      },
      {
        name: "Passionfruit Mint Fizz",
        description: "Passionfruit juice, mint leaves, and soda.",
        priceLkr: 790,
      },
      {
        name: "Ceylon Tea Pot",
        description: "Single-estate black tea served hot with jaggery.",
        priceLkr: 620,
      },
    ],
  },
  {
    title: "Desserts",
    items: [
      {
        name: "Watalappan",
        description: "Classic jaggery coconut custard with cashews.",
        priceLkr: 690,
      },
      {
        name: "Banana Fritter Trio",
        description: "Caramelized banana fritters with palm syrup.",
        priceLkr: 720,
      },
    ],
  },
];

export default menuData;
