// The range. Descriptions say how it tastes, never how it is built: the
// formulations are ROOK IP and do not appear here.
//
// Every bottle is a 30 ml flavour concentrate containing no nicotine, so there
// is no strength field and no mg anywhere in this file. There is nothing in the
// bottle to state a strength for. The meters describe the flavour and nothing
// else.

export const price = 200;      // ZAR, recommended retail, incl VAT
export const size = '30 ml';   // one size across the range

// The flavours that go out in the first run.
//
// The advice from the manufacturer was blunt and worth taking: launch two or
// three, prove demand, then widen. He started his own brand on one and is now
// on six. Black Ice is fixed, its concentrate is already bought. The other two
// are a commercial call, so this is the one line to edit if they change.
export const launchSlugs = ['black-ice', 'cherry-ice', 'grape-ice'];

export const products = [
  {
    slug: 'black-ice',
    name: 'Black Ice',
    short: 'Deep, ripe blackcurrant with a cold, dry finish. The boldest thing we make.',
    notes: ['Blackcurrant', 'Dark berry', 'Cold finish'],
    family: 'Dark berry',
    tint: '#4A5FA5',
    meters: { intensity: 5, sweetness: 3, cooling: 4, sharpness: 5 },
  },
  {
    slug: 'cherry-ice',
    name: 'Cherry Ice',
    short: 'Ripe red cherry with soft berry sweetness and a light chill. The one most people come back for.',
    notes: ['Red cherry', 'Raspberry', 'Sweet finish'],
    family: 'Red fruit',
    tint: '#D42A46',
    meters: { intensity: 4, sweetness: 4, cooling: 3, sharpness: 3 },
  },
  {
    slug: 'grape-ice',
    name: 'Grape Ice',
    short: 'Bright, fizzy grape with a dark, tart edge. Grape done properly.',
    notes: ['Fizzy grape', 'Concord', 'Blackcurrant'],
    family: 'Grape',
    tint: '#8B4CB8',
    meters: { intensity: 4, sweetness: 3, cooling: 3, sharpness: 3 },
  },
  {
    slug: 'lychee-ice',
    name: 'Lychee Ice',
    short: 'Juicy lychee with a crisp kiwi lift. The lightest one in the range.',
    notes: ['Fizzy lychee', 'Kiwi', 'Clean finish'],
    family: 'Light fruit',
    tint: '#F0A8C0',
    meters: { intensity: 3, sweetness: 3, cooling: 3, sharpness: 2 },
  },
  {
    slug: 'pina-colada',
    name: 'Pina Colada',
    short: 'Ripe pineapple and creamy coconut with a squeeze of lime. The only one with no ice.',
    notes: ['Pineapple', 'Coconut', 'Lime'],
    family: 'Tropical',
    tint: '#EDAE2B',
    meters: { intensity: 4, sweetness: 4, cooling: 1, sharpness: 2 },
  },
];

export const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

// What the first run actually contains, in the order given above.
export const launch = products.filter((p) => launchSlugs.includes(p.slug));

// Finished, waiting their turn. Shown as what is coming, never as buyable.
export const later = products.filter((p) => !launchSlugs.includes(p.slug));
