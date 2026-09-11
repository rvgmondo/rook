// Static page content, ported from the brand copy. Bodies are trusted HTML
// (authored here, not user input). `after` renders below an injected block
// (the range on /flavours, the form on /contact).
//
// Product language rule, same as copy.js: ROOK sells a 30 ml nicotine-free
// flavour concentrate that is not mixed and not ready to use as supplied.
// Nothing here says nicotine, vape, e-liquid, juice, pod, MTL or mg, because
// none of those describe what is in the bottle.

export const pages = {
  about: {
    title: 'About',
    excerpt: 'A South African flavour house, blending concentrated aroma in Gauteng.',
    body: `
<p>ROOK is a South African flavour house. We make concentrated aroma in 30 ml bottles, blended in Gauteng by a licensed manufacturer.</p>
<p>Rook is the Afrikaans word for smoke. Short, local, easy to remember.</p>
<h2>What we are trying to get right</h2>
<p>One thing, mostly. Flavour that does not wear out.</p>
<p>Plenty of flavour tastes great for the first day and then quietly stops registering. You keep using it, you stop enjoying it, and by the time the bottle is half empty you are already looking at what else is on the shelf. That is the problem we set out to fix.</p>
<p>So every aroma lives with us for at least three weeks before it goes on sale. Not a quick taste at the bench, three weeks of ordinary use. If it starts feeling flat, it goes back for another round, or it does not make the shelf at all. That is the reason our range grows slowly.</p>
<h2>How we work</h2>
<p>We develop our own blends with a flavour house rather than picking something off a catalogue and putting our name on it. Every formulation is ours, made to our brief, and it stays in house.</p>
<p>Everything is made here in South Africa. Small batches, licensed facility, proper quality control.</p>
<h2>Three to start</h2>
<p>We have five finished and three go out first. That was the advice of the people who blend for us, and it was good advice: prove the first three, then widen. The other two are done and waiting their turn.</p>
<h2>Who it is for</h2>
<p>Adults. Our bottles hold a concentrated flavouring that is sold unmixed and is not ready to use as supplied, and there is no nicotine in any of them. Not for anyone under 18, and not for children under any circumstances. Keep it out of their reach.</p>`,
  },

  flavours: {
    title: 'Help me choose',
    excerpt: 'Tell us what you like and we will point you at the closest thing we make.',
    body: `
<p>Two quick things to check, then pick a direction. Takes about a minute.</p>
<h2>First, what you are getting</h2>
<p>Every ROOK bottle is 30 ml of concentrated aroma. It is a flavouring and it arrives unmixed, so it is not ready to use as supplied. There is no nicotine in it.</p>
<p>Because it is concentrated it goes further than the bottle size suggests. Start lighter than you think you need, taste, and work up from there.</p>`,
    after: `
<h2>How to read the meters</h2>
<p>Every flavour page has four meters, scored against our own range rather than the whole category. A full bar for cooling means the coldest thing we make, not the coldest thing you have ever had.</p>
<ul>
<li><strong>Intensity.</strong> How loud the flavour is.</li>
<li><strong>Sweetness.</strong> How sweet it reads.</li>
<li><strong>Cooling.</strong> How cold the finish is.</li>
<li><strong>Sharpness.</strong> How dry and sharp the finish is, against how round and soft.</li>
</ul>
<h2>Which three are launching</h2>
<p>Black Ice, Cherry Ice and Grape Ice go out in the first run. Lychee Ice and Pina Colada are finished and follow later. All five are on the <a href="/shop/">range page</a> so you can see where the first three sit.</p>
<h2>Still stuck</h2>
<p>Send us a message through the <a href="/contact/">contact form</a>. Tell us what you like and what you like about it, and we will tell you which of ours comes closest.</p>`,
  },

  help: {
    title: 'Delivery, returns and questions',
    excerpt: 'Same day dispatch before noon. Courier countrywide. Thirty days on unopened bottles.',
    body: `
<h2>Delivery</h2>
<p>Order before noon on a working day and it goes out the same day. After noon, the next working day.</p>
<ul>
<li><strong>Main centres.</strong> Usually next working day.</li>
<li><strong>Everywhere else.</strong> Two to three working days.</li>
<li><strong>Cost.</strong> R95, or free on orders over R600.</li>
<li><strong>Tracking.</strong> Emailed as soon as the courier collects.</li>
<li><strong>Packaging.</strong> Plain matte black mailer, no branding outside.</li>
</ul>
<p>South Africa only, by The Courier Guy or Pudo. Someone 18 or older needs to sign for it.</p>
<h2>Returns</h2>
<p>Unopened and sealed, you have 30 days. Message us first and we will tell you where to send it.</p>
<p>Damaged or wrong item, that is on us. Send a photo and we will replace it and cover the courier both ways.</p>
<p>We cannot take back an opened bottle, for the reason you would expect with a consumable. Message us anyway. If a flavour is not working for you we would like to know, and we will help you find one that does.</p>
<h2 id="faq">Questions</h2>
<h3>What exactly am I buying?</h3>
<p>A 30 ml bottle of concentrated aroma. It is a flavouring, it arrives unmixed, and it is not ready to use as supplied.</p>
<h3>Is there nicotine in it?</h3>
<p>No. There is none in the bottle and we do not add any.</p>
<h3>How long does a 30 ml bottle last?</h3>
<p>It depends entirely on how heavily you mix it. Used at a sensible rate it lasts a good while, which is rather the point of buying it concentrated.</p>
<h3>What is in it?</h3>
<p>Propylene glycol, vegetable glycerine and food grade flavouring. No nicotine. Our flavour formulations are our own and we do not publish them.</p>
<h3>How many flavours are there?</h3>
<p>Five are finished. Three are going out in the first run and the other two follow. All five are on the <a href="/shop/">range page</a>.</p>
<h3>Do you ship outside South Africa?</h3>
<p>Not yet. We would rather set it up properly than have a parcel destroyed at a border.</p>
<h3>Do you do wholesale?</h3>
<p>Yes. Email <a href="mailto:sales@rookvapes.co.za">sales@rookvapes.co.za</a> with your shop name and we will send trade pricing.</p>
<h3>Can I order if I am under 18?</h3>
<p>No. See the <a href="/age-policy/">age policy</a>.</p>`,
  },

  contact: {
    title: 'Contact',
    excerpt: 'A person reads everything. Usually a reply within one working day.',
    body: `
<p>A person reads all of it. You will usually hear back within one working day and always within two.</p>
<p>If you want a flavour recommendation, tell us what you like at the moment and what you like about it. That helps us a lot more than knowing what you are after.</p>`,
    after: `
<h2>Or go direct</h2>
<ul>
<li><strong>General.</strong> <a href="mailto:hello@rookvapes.co.za">hello@rookvapes.co.za</a></li>
<li><strong>Orders.</strong> <a href="mailto:sales@rookvapes.co.za">sales@rookvapes.co.za</a>, with your order number.</li>
<li><strong>Wholesale.</strong> <a href="mailto:sales@rookvapes.co.za">sales@rookvapes.co.za</a>, shop name in the first line.</li>
<li><strong>Social.</strong> <a href="https://www.instagram.com/rook.vapes" rel="noopener nofollow">Instagram</a> and <a href="https://www.tiktok.com/@rook.vapes" rel="noopener nofollow">TikTok</a>, both @rook.vapes.</li>
</ul>
<p>We are based in Gauteng. There is no walk in counter.</p>`,
  },

  wholesale: {
    title: 'Stock ROOK',
    excerpt: 'Trade pricing for South African retailers. 30 ml concentrated aroma, blended locally.',
    body: `
<p>If you run a shop in South Africa and you want to carry ROOK, this page is for you.</p>
<h2>What you would be stocking</h2>
<p>Concentrated aroma in 30 ml glass bottles, sold unmixed. Recommended retail is R200. The range is on the <a href="/shop/">shop page</a>.</p>
<p>We are launching with three and holding two back. Stockists hear about the next two before anyone else.</p>
<h2>Why it sells</h2>
<p>Local product at a local price, with no import lead time and no exchange rate surprises.</p>
<p>Every flavour goes through at least three weeks of real use before approval, checking specifically that it does not get boring. That is the line your staff can give a customer, and it is why people come back for a second bottle instead of trying something else.</p>
<h2>Terms</h2>
<ul>
<li>Trade pricing on request, tiered by volume.</li>
<li>Minimum first order applies. We will tell you what it is when you ask.</li>
<li>Blended in Gauteng by a licensed manufacturer.</li>
<li>Delivery countrywide by The Courier Guy or Pudo.</li>
<li>We do not undercut our stockists on our own site. Our RRP is our price.</li>
</ul>
<h2>Get pricing</h2>
<p>Email <a href="mailto:sales@rookvapes.co.za">sales@rookvapes.co.za</a> with your shop name and where you are based, or use the <a href="/contact/">contact form</a>. A person replies, usually within one working day.</p>`,
  },

  'age-policy': {
    title: 'Age policy',
    excerpt: 'Adults 18 and over only. What we check, when, and what the check is not.',
    body: `
<p>ROOK sells concentrated flavouring for adults. Nobody under 18 may buy from this site and nothing on it is built to appeal to anyone under 18.</p>
<p>There is no nicotine in what we sell. We restrict it to adults anyway, because a concentrated flavouring sold unmixed is not a product for children to handle.</p>
<h2>What we check</h2>
<ul>
<li><strong>At the door.</strong> A date of birth before the site shows you anything. Enter one under 18 and the visit ends.</li>
<li><strong>At checkout.</strong> You confirm in writing that you are 18 or older and that the order is for you.</li>
<li><strong>On delivery.</strong> Signature required from someone 18 or older. Couriers may ask for ID.</li>
<li><strong>In marketing.</strong> No cartoons, no games, no youth imagery, no influencers with young audiences, nothing near a school.</li>
</ul>
<h2>What this is not</h2>
<p>The age gate is a self declared check. It is not identity verification and we are not going to pretend otherwise. If South African law introduces a hard verification requirement we will implement one.</p>
<h2>If you are a parent</h2>
<p>If you believe a minor has ordered from this site, email <a href="mailto:hello@rookvapes.co.za">hello@rookvapes.co.za</a> with whatever you know. We will cancel the order, refund it and block the account.</p>
<h2>Handling</h2>
<p>Our bottles hold a concentrated flavouring. Keep them out of reach of children, store them closed, and do not treat the contents as food or drink. We make no health claims about our products.</p>`,
  },

  terms: {
    title: 'Terms',
    excerpt: 'The terms that apply when you use this site or buy from ROOK.',
    body: `
<p><strong>Placeholder.</strong> These terms must be reviewed by an attorney and checked against South African consumer law before launch.</p>
<h2>Who we are</h2>
<p>ROOK is a South African flavour house based in Gauteng. Company registration number and registered address to be added.</p>
<h2>What we sell</h2>
<p>Concentrated flavouring in 30 ml bottles, sold unmixed and containing no nicotine. It is not supplied ready to use.</p>
<h2>Orders and payment</h2>
<p>Prices are in South African Rand and include VAT. An order is a request to buy; we confirm by email when it is accepted.</p>
<h2>Age</h2>
<p>You must be 18 or older to use this site or buy from us. See the <a href="/age-policy/">age policy</a>.</p>`,
  },

  privacy: {
    title: 'Privacy',
    excerpt: 'What we collect, why, and your rights under POPIA.',
    body: `
<p><strong>Placeholder.</strong> This policy must be reviewed by an attorney and checked against POPIA before launch.</p>
<h2>What we collect</h2>
<p>The email address you give the waitlist, and, when we launch, the details needed to fulfil an order. The age gate stores only that this browser confirmed it is 18 or older, not your date of birth.</p>
<h2>Why</h2>
<p>To tell you when we launch, to process orders, and to meet our legal obligations as a retailer.</p>
<h2>Your rights</h2>
<p>You can ask what we hold, ask us to correct or delete it, and unsubscribe from any email with one click. Email <a href="mailto:hello@rookvapes.co.za">hello@rookvapes.co.za</a>.</p>`,
  },
};
