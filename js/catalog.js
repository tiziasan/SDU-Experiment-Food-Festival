/* ------------------------------------------------------------------
   Nudge2Green - product catalogue
   IMPORTANT (study integrity): this file contains NO CO2 / sustainability
   information on purpose. The shop must not prime the behaviour we
   measure. Footprints are joined offline via data/co2_factors.csv,
   keyed on the same product ids.
   Prices are in DKK, typical Danish discount-supermarket level.
------------------------------------------------------------------- */

const CATEGORIES = [
  { id: 'veg',    da: 'Frugt & grønt',   en: 'Fruit & veg',    emoji: '🥬' },
  { id: 'meat',   da: 'Kød & fisk',      en: 'Meat & fish',    emoji: '🥩' },
  { id: 'dairy',  da: 'Mejeri & æg',     en: 'Dairy & eggs',   emoji: '🥛' },
  { id: 'plant',  da: 'Plantebaseret',   en: 'Plant-based',    emoji: '🌱' },
  { id: 'pantry', da: 'Kolonial',        en: 'Pantry',         emoji: '🥫' },
  { id: 'bread',  da: 'Brød',            en: 'Bread',          emoji: '🍞' },
  { id: 'frozen', da: 'Frost',           en: 'Frozen',         emoji: '❄️' },
  { id: 'ready',  da: 'Færdigretter',    en: 'Ready meals',    emoji: '🍱' }
];

/* id, cat, emoji, name (da/en), size (da/en), price DKK */
const PRODUCTS = [
  /* ---------- Frugt & grønt ---------- */
  { id:'v01', cat:'veg', emoji:'🥔', da:'Kartofler',            en:'Potatoes',              sda:'2 kg pose',    sen:'2 kg bag',      price:16.95 },
  { id:'v02', cat:'veg', emoji:'🍠', da:'Søde kartofler',       en:'Sweet potatoes',        sda:'1 kg',         sen:'1 kg',          price:19.95 },
  { id:'v03', cat:'veg', emoji:'🥕', da:'Gulerødder',           en:'Carrots',               sda:'1 kg pose',    sen:'1 kg bag',      price:9.95  },
  { id:'v04', cat:'veg', emoji:'🧅', da:'Løg',                  en:'Onions',                sda:'1 kg net',     sen:'1 kg net',      price:12.95 },
  { id:'v05', cat:'veg', emoji:'🧄', da:'Hvidløg',              en:'Garlic',                sda:'3 stk',        sen:'3 pcs',         price:9.95  },
  { id:'v06', cat:'veg', emoji:'🥦', da:'Broccoli',             en:'Broccoli',              sda:'ca. 350 g',    sen:'approx. 350 g', price:12.95 },
  { id:'v07', cat:'veg', emoji:'🍅', da:'Tomater',              en:'Tomatoes',              sda:'500 g',        sen:'500 g',         price:14.95 },
  { id:'v08', cat:'veg', emoji:'🍒', da:'Cherrytomater',        en:'Cherry tomatoes',       sda:'250 g',        sen:'250 g',         price:12.95 },
  { id:'v09', cat:'veg', emoji:'🥒', da:'Agurk',                en:'Cucumber',              sda:'1 stk',        sen:'1 pc',          price:9.95  },
  { id:'v10', cat:'veg', emoji:'🥬', da:'Salathoved',           en:'Head of lettuce',       sda:'1 stk',        sen:'1 pc',          price:12.95 },
  { id:'v11', cat:'veg', emoji:'🍄', da:'Champignon',           en:'Mushrooms',             sda:'250 g bakke',  sen:'250 g tray',    price:12.95 },
  { id:'v12', cat:'veg', emoji:'🫑', da:'Peberfrugt',           en:'Bell peppers',          sda:'3 stk',        sen:'3 pcs',         price:19.95 },
  { id:'v13', cat:'veg', emoji:'🥒', da:'Squash',               en:'Courgette',             sda:'1 stk',        sen:'1 pc',          price:9.95  },
  { id:'v14', cat:'veg', emoji:'🥬', da:'Frisk spinat',         en:'Fresh spinach',         sda:'175 g',        sen:'175 g',         price:14.95 },
  { id:'v15', cat:'veg', emoji:'🧅', da:'Porrer',               en:'Leeks',                 sda:'2 stk',        sen:'2 pcs',         price:12.95 },
  { id:'v16', cat:'veg', emoji:'🥑', da:'Avocado',              en:'Avocado',               sda:'2 stk',        sen:'2 pcs',         price:16.95 },
  { id:'v17', cat:'veg', emoji:'🍋', da:'Citron',               en:'Lemons',                sda:'2 stk',        sen:'2 pcs',         price:8.95  },
  { id:'v18', cat:'veg', emoji:'🌿', da:'Frisk persille',       en:'Fresh parsley',         sda:'potte',        sen:'pot',           price:14.95 },

  /* ---------- Kød & fisk ---------- */
  { id:'m01', cat:'meat', emoji:'🥩', da:'Hakket oksekød 8-12%',   en:'Minced beef 8-12%',     sda:'500 g',   sen:'500 g',   price:34.95 },
  { id:'m02', cat:'meat', emoji:'🥩', da:'Hakket oksekød 4-7%',    en:'Minced beef 4-7%',      sda:'400 g',   sen:'400 g',   price:39.95 },
  { id:'m03', cat:'meat', emoji:'🐖', da:'Hakket svinekød',        en:'Minced pork',           sda:'500 g',   sen:'500 g',   price:27.95 },
  { id:'m04', cat:'meat', emoji:'🥩', da:'Hakket okse/svin',       en:'Minced beef & pork',    sda:'500 g',   sen:'500 g',   price:29.95 },
  { id:'m05', cat:'meat', emoji:'🍗', da:'Kyllingebryst',          en:'Chicken breast',        sda:'600 g',   sen:'600 g',   price:44.95 },
  { id:'m06', cat:'meat', emoji:'🍗', da:'Kyllingelår',            en:'Chicken thighs',        sda:'1 kg',    sen:'1 kg',    price:39.95 },
  { id:'m07', cat:'meat', emoji:'🐔', da:'Hel kylling',            en:'Whole chicken',         sda:'ca. 1,1 kg', sen:'approx. 1.1 kg', price:44.95 },
  { id:'m08', cat:'meat', emoji:'🍖', da:'Svinekoteletter',        en:'Pork chops',            sda:'600 g',   sen:'600 g',   price:39.95 },
  { id:'m09', cat:'meat', emoji:'🥩', da:'Oksebøffer',             en:'Beef steaks',           sda:'2 x 150 g', sen:'2 x 150 g', price:59.95 },
  { id:'m10', cat:'meat', emoji:'🥓', da:'Bacon i tern',           en:'Diced bacon',           sda:'200 g',   sen:'200 g',   price:17.95 },
  { id:'m11', cat:'meat', emoji:'🌭', da:'Medisterpølse',          en:'Danish pork sausage',   sda:'500 g',   sen:'500 g',   price:27.95 },
  { id:'m12', cat:'meat', emoji:'🐟', da:'Laksefilet',             en:'Salmon fillet',         sda:'2 x 130 g', sen:'2 x 130 g', price:49.95 },
  { id:'m13', cat:'meat', emoji:'🐟', da:'Torskefilet, frost',     en:'Cod fillet, frozen',    sda:'400 g',   sen:'400 g',   price:39.95 },
  { id:'m14', cat:'meat', emoji:'🦐', da:'Rejer, pillede',         en:'Peeled prawns',         sda:'200 g',   sen:'200 g',   price:34.95 },
  { id:'m15', cat:'meat', emoji:'🥫', da:'Tun i vand',             en:'Tuna in water',         sda:'185 g dåse', sen:'185 g tin', price:12.95 },

  /* ---------- Mejeri & æg ---------- */
  { id:'d01', cat:'dairy', emoji:'🥛', da:'Letmælk',            en:'Semi-skimmed milk',   sda:'1 l',       sen:'1 l',       price:12.50 },
  { id:'d02', cat:'dairy', emoji:'🥛', da:'Sødmælk, øko',       en:'Whole milk, organic', sda:'1 l',       sen:'1 l',       price:15.95 },
  { id:'d03', cat:'dairy', emoji:'🥚', da:'Æg, frilands',       en:'Free-range eggs',     sda:'10 stk',    sen:'10 pcs',    price:27.95 },
  { id:'d04', cat:'dairy', emoji:'🧈', da:'Smør',               en:'Butter',              sda:'200 g',     sen:'200 g',     price:21.95 },
  { id:'d05', cat:'dairy', emoji:'🧀', da:'Revet mozzarella',   en:'Grated mozzarella',   sda:'200 g',     sen:'200 g',     price:17.95 },
  { id:'d06', cat:'dairy', emoji:'🧀', da:'Danbo 45+ i skiver', en:'Danbo cheese slices', sda:'400 g',     sen:'400 g',     price:34.95 },
  { id:'d07', cat:'dairy', emoji:'🧀', da:'Flødeost naturel',   en:'Cream cheese',        sda:'200 g',     sen:'200 g',     price:14.95 },
  { id:'d08', cat:'dairy', emoji:'🥛', da:'Piskefløde',         en:'Whipping cream',      sda:'250 ml',    sen:'250 ml',    price:12.95 },
  { id:'d09', cat:'dairy', emoji:'🥛', da:'Creme fraiche 18%',  en:'Sour cream 18%',      sda:'200 ml',    sen:'200 ml',    price:9.95  },
  { id:'d10', cat:'dairy', emoji:'🥣', da:'Yoghurt naturel',    en:'Plain yoghurt',       sda:'1 kg',      sen:'1 kg',      price:17.95 },
  { id:'d11', cat:'dairy', emoji:'🥣', da:'Skyr naturel',       en:'Skyr, plain',         sda:'450 g',     sen:'450 g',     price:16.95 },
  { id:'d12', cat:'dairy', emoji:'🧀', da:'Feta',               en:'Feta',                sda:'200 g',     sen:'200 g',     price:16.95 },
  { id:'d13', cat:'dairy', emoji:'🧀', da:'Revet parmesan',     en:'Grated parmesan',     sda:'100 g',     sen:'100 g',     price:24.95 },

  /* ---------- Plantebaseret ---------- */
  { id:'p01', cat:'plant', emoji:'🧊', da:'Tofu, fast',              en:'Firm tofu',             sda:'200 g',     sen:'200 g',     price:19.95 },
  { id:'p02', cat:'plant', emoji:'🌱', da:'Plantefars (hakket)',     en:'Plant-based mince',     sda:'250 g',     sen:'250 g',     price:24.95 },
  { id:'p03', cat:'plant', emoji:'🧆', da:'Falafler',                en:'Falafel',               sda:'250 g',     sen:'250 g',     price:19.95 },
  { id:'p04', cat:'plant', emoji:'🍔', da:'Vegetarbøffer',           en:'Veggie burger patties', sda:'2 stk',     sen:'2 pcs',     price:24.95 },
  { id:'p05', cat:'plant', emoji:'🥛', da:'Havredrik',               en:'Oat drink',             sda:'1 l',       sen:'1 l',       price:12.95 },
  { id:'p06', cat:'plant', emoji:'🫘', da:'Kikærter',                en:'Chickpeas',             sda:'400 g dåse',sen:'400 g tin', price:7.95  },
  { id:'p07', cat:'plant', emoji:'🫘', da:'Kidneybønner',            en:'Kidney beans',          sda:'400 g dåse',sen:'400 g tin', price:7.95  },
  { id:'p08', cat:'plant', emoji:'🫘', da:'Røde linser',             en:'Red lentils',           sda:'500 g',     sen:'500 g',     price:14.95 },

  /* ---------- Kolonial ---------- */
  { id:'k01', cat:'pantry', emoji:'🍚', da:'Jasminris',           en:'Jasmine rice',        sda:'1 kg',       sen:'1 kg',       price:22.95 },
  { id:'k02', cat:'pantry', emoji:'🍝', da:'Spaghetti',           en:'Spaghetti',           sda:'500 g',      sen:'500 g',      price:9.95  },
  { id:'k03', cat:'pantry', emoji:'🍝', da:'Penne',               en:'Penne',               sda:'500 g',      sen:'500 g',      price:9.95  },
  { id:'k04', cat:'pantry', emoji:'🥫', da:'Flåede tomater',      en:'Chopped tomatoes',    sda:'400 g dåse', sen:'400 g tin',  price:6.95  },
  { id:'k05', cat:'pantry', emoji:'🥫', da:'Tomatpuré',           en:'Tomato purée',        sda:'140 g',      sen:'140 g',      price:5.95  },
  { id:'k06', cat:'pantry', emoji:'🥥', da:'Kokosmælk',           en:'Coconut milk',        sda:'400 ml',     sen:'400 ml',     price:11.95 },
  { id:'k07', cat:'pantry', emoji:'🫙', da:'Rapsolie',            en:'Rapeseed oil',        sda:'1 l',        sen:'1 l',        price:24.95 },
  { id:'k08', cat:'pantry', emoji:'🫒', da:'Olivenolie',          en:'Olive oil',           sda:'500 ml',     sen:'500 ml',     price:34.95 },
  { id:'k09', cat:'pantry', emoji:'🍛', da:'Rød karrypasta',      en:'Red curry paste',     sda:'110 g',      sen:'110 g',      price:14.95 },
  { id:'k10', cat:'pantry', emoji:'🧂', da:'Bouillonterninger',   en:'Stock cubes',         sda:'6 stk',      sen:'6 pcs',      price:9.95  },
  { id:'k11', cat:'pantry', emoji:'🍶', da:'Soyasauce',           en:'Soy sauce',           sda:'150 ml',     sen:'150 ml',     price:14.95 },
  { id:'k12', cat:'pantry', emoji:'🌯', da:'Tortillas',           en:'Tortillas',           sda:'8 stk',      sen:'8 pcs',      price:14.95 },
  { id:'k13', cat:'pantry', emoji:'🧂', da:'Krydderiblanding',    en:'Spice mix',           sda:'30 g',       sen:'30 g',       price:8.95  },

  /* ---------- Brød ---------- */
  { id:'b01', cat:'bread', emoji:'🍞', da:'Rugbrød',        en:'Rye bread',        sda:'950 g',  sen:'950 g',  price:14.95 },
  { id:'b02', cat:'bread', emoji:'🍞', da:'Grovbrød',       en:'Wholegrain loaf',  sda:'750 g',  sen:'750 g',  price:16.95 },
  { id:'b03', cat:'bread', emoji:'🍔', da:'Burgerboller',   en:'Burger buns',      sda:'4 stk',  sen:'4 pcs',  price:12.95 },
  { id:'b04', cat:'bread', emoji:'🥖', da:'Flutes',         en:'Baguettes',        sda:'2 stk',  sen:'2 pcs',  price:10.95 },

  /* ---------- Frost ---------- */
  { id:'f01', cat:'frozen', emoji:'🫛', da:'Frosne ærter',           en:'Frozen peas',            sda:'450 g', sen:'450 g', price:9.95  },
  { id:'f02', cat:'frozen', emoji:'🥦', da:'Frosne blandingsgrønt',  en:'Frozen mixed veg',       sda:'1 kg',  sen:'1 kg',  price:17.95 },
  { id:'f03', cat:'frozen', emoji:'🍟', da:'Pommes frites',          en:'Oven chips',             sda:'1 kg',  sen:'1 kg',  price:16.95 },
  { id:'f04', cat:'frozen', emoji:'🥬', da:'Frossen spinat',         en:'Frozen spinach',         sda:'450 g', sen:'450 g', price:11.95 },

  /* ---------- Færdigretter ---------- */
  { id:'r01', cat:'ready', emoji:'🍕', da:'Frossen pizza, pepperoni', en:'Frozen pizza, pepperoni', sda:'350 g', sen:'350 g', price:24.95 },
  { id:'r02', cat:'ready', emoji:'🍝', da:'Lasagne, frost',           en:'Lasagne, frozen',         sda:'400 g', sen:'400 g', price:29.95 },
  { id:'r03', cat:'ready', emoji:'🥡', da:'Wok-mix m. kylling, frost',en:'Chicken wok mix, frozen', sda:'800 g', sen:'800 g', price:39.95 },
  { id:'r04', cat:'ready', emoji:'🍡', da:'Frikadeller, færdigstegte',en:'Ready-cooked meatballs',  sda:'400 g', sen:'400 g', price:34.95 },
  { id:'r05', cat:'ready', emoji:'🐟', da:'Paneret fiskefilet, frost',en:'Breaded fish fillet',     sda:'400 g', sen:'400 g', price:29.95 },
  { id:'r06', cat:'ready', emoji:'🥗', da:'Færdigsalat m. kylling',   en:'Ready salad w. chicken',  sda:'200 g', sen:'200 g', price:34.95 }
];
