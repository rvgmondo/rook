// Every word on the site, in one file.
//
// VOICE: ROOK is a South African flavour house. Warm, confident,
// straightforward. Lead with what the thing tastes like or does for the
// customer. Never publish the formulation. No luxury, premium, craft, curated,
// journey or story. No exclamation marks. No health claims.
//
// WHAT WE SELL, AND THE WORDS FOR IT
//
// ROOK sells a 30 ml flavour concentrate. It contains no nicotine. It is not
// mixed, and it is not ready to use as supplied: the buyer does their own
// mixing. That is the whole product, and the language has to match it exactly.
//
//   Say:      aroma, flavour concentrate, ROOK liquids, the range, a bottle
//   Never:    nicotine, nic salt, mg, vape, vaping, e-liquid, juice, pod,
//             MTL, sub ohm, device, throat hit, coil
//
// This is not a style preference. Describing a nicotine-free concentrate in
// nicotine language would make the site wrong about its own product, and would
// put warnings and strengths on a page for a substance that is not in the
// bottle. Accuracy runs both ways.
//
// Equally: never imply it is safe to eat, drink or apply to skin, and never
// dress it up as a food product. It is a concentrated flavouring for adults to
// mix. Plain, accurate, and no further.

export const prelaunch = {
  bar: 'Launching soon. Join the list and get first pick of the first batch.',
  eyebrow: 'Launching soon in South Africa',
  headline: 'Flavour that holds up',
  lede: 'Most flavour is brilliant on day one and boring by day ten. We are about to launch three aromas built to taste as good in week three as they did in the first hour. Have a look at what is coming.',
  cta: 'See the range',
  cta_alt: 'Get notified',
  promo_b_tag: 'First batch',
  promo_b_head: 'Be first in line',
  promo_b_stat: '',
  promo_b_body: 'The first run is in production. Join the list and you will get the launch email before anyone else, plus first pick while stock lasts.',
  news_body: 'One email when we launch, then a short note when a new aroma lands. Nothing else, and one click to leave.',
  shop_lede: 'This is the range we are launching with. Nothing is on sale yet. Pick the ones you want and we will email you the moment they are in stock.',
};

export const home = {
  eyebrow: 'Flavour concentrate, made in South Africa',
  headline: 'Flavour that holds up',
  lede: 'Most flavour is brilliant on day one and boring by day ten. Ours is built to taste as good in week three as it did in the first hour. Three aromas, 30 ml a bottle, blended here in Gauteng.',
  cta: 'See the range',
  cta_alt: 'Help me choose',
  range_tag: 'Our flavours',
  range_lede: 'Concentrated aroma, 30 ml a bottle. Mixed by you, to your own taste.',
  promo_a_tag: 'New to us',
  promo_a_head: 'Not sure which<br>one to get',
  promo_a_body: 'Tell us what you like and we will point you at the closest thing we make. Takes a minute.',
  promo_a_cta: 'Help me choose',
  promo_b_tag: 'Coming soon',
  promo_b_head: 'More of the range',
  promo_b_stat: 'Soon',
  promo_b_body: 'Two more aromas are finished and waiting their turn. Join the list and you will hear when they land.',
  how_tag: 'Why buy from us',
  how_steps: [
    { n: '01', h: 'Blended in South Africa', p: 'Made in Gauteng by a licensed manufacturer, in small batches, to our own formulations. Not imported and relabelled.' },
    { n: '02', h: 'Tested for weeks, not minutes', p: 'Every aroma lives with us for at least three weeks before it goes on sale. If it gets boring, it does not make the shelf.' },
    // Replaces the old "full 60 ml bottles" claim. That argued value from size,
    // which no longer holds at 30 ml and would now argue against us. Three
    // flavours done properly is both true and the better position.
    { n: '03', h: 'Three, not thirty', p: 'We would rather launch three aromas we would buy ourselves than a wall of options where four are good and the rest fill a shelf.' },
  ],
  faq_tag: 'Good to know',
  faq: [
    { q: 'What exactly am I buying?', a: 'A 30 ml bottle of concentrated aroma. It is a flavouring, not a finished product, and it is not mixed. You do your own mixing, to your own taste.' },
    { q: 'Is there nicotine in it?', a: 'No. There is none in the bottle and we do not add any. What you mix into it afterwards is entirely up to you and nothing to do with us.' },
    { q: 'How strong is it?', a: 'Concentrated, so it goes further than it looks. Start light, taste, and work up. Each flavour page has an intensity reading to tell you what you are dealing with before you open it.' },
    { q: 'How long does a 30 ml bottle last?', a: 'That depends entirely on how heavily you mix. Used at a sensible rate it lasts most people a good while, which is the point of buying it concentrated.' },
    { q: 'When will I get it?', a: 'Order before noon on a working day and it goes out the same day. Main centres are usually next day, everywhere else two to three. R95 courier, free over R600, tracking emailed when it is collected.' },
    { q: 'What if I do not like it?', a: 'Unopened and sealed, send it back within 30 days for a refund. We cannot take back an opened bottle, but message us anyway and we will help you find something that suits you better.' },
    { q: 'Is the packaging discreet?', a: 'Yes. Plain matte black mailer, no branding on the outside, nothing that says what is inside.' },
  ],
  brands: ['MADE IN SOUTH AFRICA', 'SMALL BATCHES', '30 ML BOTTLES', 'SAME DAY DISPATCH', 'TRACKED COURIER', 'FREE OVER R600', 'ADULTS 18+'],
  news_head: 'Newsletter',
  news_body: 'A short note when a new aroma lands and when something is running low. Nothing else, and one click to leave.',
  bar: [
    { i: 'truck', t: 'Free delivery on orders over R600' },
    { i: 'shield', t: 'All prices shown include VAT' },
    { i: 'globe', t: 'Courier countrywide, tracked' },
  ],
};

// Site-wide bits used by the layout.
export const site = {
  name: 'ROOK',
  tagline: 'Flavour concentrate, made in South Africa. Flavour that holds up.',
  email: 'hello@rookvapes.co.za',
  sales: 'sales@rookvapes.co.za',
  instagram: 'https://www.instagram.com/rook.vapes',
  tiktok: 'https://www.tiktok.com/@rook.vapes',
  nav: [
    { url: '/shop/', text: 'Shop' },
    { url: '/flavours/', text: 'Flavours' },
    { url: '/about/', text: 'About' },
    { url: '/journal/', text: 'Journal' },
    { url: '/wholesale/', text: 'Wholesale' },
    { url: '/help/', text: 'Help' },
  ],
};
