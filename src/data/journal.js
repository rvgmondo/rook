// Journal articles. Trusted HTML authored here.
//
// Same product language rule as copy.js: ROOK sells a nicotine-free flavour
// concentrate, so nothing here says nicotine, vape, e-liquid or juice.

export const articles = [
  {
    slug: 'the-three-week-test',
    title: 'The three week test',
    excerpt: 'Why nothing goes on sale here until we have lived with it for a month.',
    body: `
<p>Almost any flavour can taste good once. Give a flavour house a decent brief and you will get something back that impresses the first time you open it. That part is not hard.</p>
<p>What is hard is week three.</p>
<h2>Flavour fatigue</h2>
<p>Your nose and mouth adapt to whatever you put in front of them. Use the same aroma all day, every day, and the parts of it that stood out on Monday stop registering by Friday. By the second week you are getting the shape of the flavour without much of the detail. By the third you are going through the motions and quietly browsing for something else.</p>
<p>Anyone who has stuck with one flavour for a month knows the feeling. Very few brands design around it, because the flavour is usually signed off in a tasting session that lasts an afternoon.</p>
<h2>What we do instead</h2>
<p>Every candidate gets used properly for at least three weeks before it can go on sale. Normal days, morning to night, alongside everything else we are eating and drinking. No tasting notes, no scoring sheet. Just: are we still reaching for it.</p>
<p>Plenty do not survive that. Some go flat. Some get sweet and cloying. One dessert profile we had was genuinely excellent for ten minutes and completely unbearable by the end of the day.</p>
<p>Those go back for another round or get dropped. It is slow, and it is the reason we are launching with three rather than everything we have made.</p>
<h2>What you get out of it</h2>
<p>A bottle you finish. Not one you get halfway through and abandon in a drawer.</p>
<p>That is the whole thing we are selling. Everything else, the small batches, the local blending, the packaging, is just doing the job properly. The flavour lasting is the part we are actually proud of.</p>`,
  },
  {
    slug: 'why-we-are-launching-with-three',
    title: 'Why we are launching with three',
    excerpt: 'We have five finished. Three go out first, and there is a good reason for that.',
    body: `
<p>We have five aromas finished and signed off. Three of them are going out in the first run. The other two are sitting there, done, waiting.</p>
<p>That was not the original plan.</p>
<h2>The advice we took</h2>
<p>The plan was to launch all five at once, because that is what having five finished products makes you want to do. The manufacturer we blend with talked us out of it in about two sentences.</p>
<p>His argument: a shop has limited shelf space and no reason to trust a brand nobody has asked for yet. Turn up with five and you are asking for a whole shelf on nothing but enthusiasm. Turn up with the two or three you would personally buy, and you are asking for something a buyer can actually say yes to.</p>
<p>He started his own brand on a single flavour. He is on six now. That is the order it happens in, and he has watched a lot of people try it the other way round.</p>
<h2>Why it is better for you too</h2>
<p>A range of five from a brand you have never tried is not a choice, it is a guess. Three is a decision you can make.</p>
<p>It also means the three that land first are the three we are most confident in, rather than three good ones and two that are fine. Nobody benefits from us padding a launch.</p>
<h2>What happens to the other two</h2>
<p>They are finished, they passed the same three week test as everything else, and they go out when the first three have earned the space. Not reformulated, not quietly dropped. Just later.</p>
<p>If you want to know when, the list is the only place we will say it.</p>`,
  },
  {
    slug: 'what-cold-actually-means',
    title: 'What cold actually means',
    excerpt: 'Menthol, coolants, and the difference between minty and cold.',
    body: `
<p>Cold is not a flavour. It is a sensation, and it works through a different mechanism to taste. That is why you can have something intensely cold that barely tastes of anything at all.</p>
<h2>Two ways to get there</h2>
<p>Menthol brings its own taste with it, that sharp slightly medicinal note you know from a peppermint. It cools and it flavours at the same time, and you cannot have one without the other.</p>
<p>Synthetic coolants do the opposite. They produce cold with almost no taste of their own. Used well, they let a fruit stay cold and still taste like the fruit. Used badly, you get something that feels like breathing through a fridge and tastes of nothing.</p>
<h2>Where our range sits</h2>
<p>Most of what we make carries Ice in the name and none of it is mint. The cold is there to sharpen the fruit and clean up the finish, not to be the flavour itself.</p>
<p>Black Ice is the coldest thing we make and it still reads as blackcurrant first. Cherry Ice and Grape Ice sit lower, just enough to stop them going syrupy. Lychee Ice is lighter again. Pina Colada has no cold at all, which is rather the point of it.</p>
<h2>Reading the meter</h2>
<p>The cooling meter on each flavour page is scored against our own range, not the whole category. A full bar means the coldest thing we make. If you are used to something loaded with coolant, our coldest will read as middling to you.</p>`,
  },
];

export const articleBySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));
