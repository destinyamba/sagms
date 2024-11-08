const jsonData = [
  {
    _id: '67112847eaf172ac8eb0f952',
    artist_id: '671126abeaf172ac8eb0f94d',
    category: 'Cubism',
    created_at: '2013-12-01T00:00:00',
    description:
      'A whimsical dreamlike scene where floating islands drift in the sky, each with its own unique ecosystem. The colors are soft and fluid, creating a sense of weightlessness and wonder.',
    dimensions: {
      height_cm: 168,
      width_cm: 746,
    },
    images: ['https://i.imgur.com/pAEIDtR.jpg'],
    materials: ['Watercolor Paint', 'Oil Paint', 'Charcoal'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'Luminescence of Solitude',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },

  {
    _id: '67112847eaf172ac8eb0f95c',
    artist_id: '671126abeaf172ac8eb0f948',
    category: 'Impressionism',
    created_at: '2013-12-01T00:00:00',
    description:
      'A detailed painting of a soaring eagle with its wings spread wide against a sunset sky. The intricate feathers capture the light, symbolizing strength and liberation.',
    dimensions: {
      height_cm: 602,
      width_cm: 433,
    },
    images: ['https://i.imgur.com/y9KKD3P.jpg'],
    materials: ['Oil Paint', 'Charcoal'],
    provenance: 'Donated by the local community',
    title: 'The Fall of Man',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f95d',
    artist_id: '671126abeaf172ac8eb0f94b',
    category: 'Expressionism',
    created_at: '2013-12-01T00:00:00',
    description:
      'A serene landscape painting depicting a calm lake surrounded by misty mountains at dawn. Soft blues and purples dominate the scene, evoking a sense of peace and introspection.',
    dimensions: {
      height_cm: 101,
      width_cm: 664,
    },
    images: ['https://i.imgur.com/19EIRDg.jpg'],
    materials: ['Wood', 'Gouache Paint', 'Charcoal'],
    provenance: 'Purchased from ABC Gallery',
    title: 'The Fall of Man',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f95e',
    artist_id: '671126abeaf172ac8eb0f944',
    category: 'Still Life',
    created_at: '2013-12-01T00:00:00',
    description:
      'A vintage-style painting of a weathered statue in a forgotten garden, surrounded by overgrown vines and rusting metal. The artwork explores themes of memory, decay, and nostalgia.',
    dimensions: {
      height_cm: 968,
      width_cm: 411,
    },
    images: ['https://i.imgur.com/y9KKD3P.jpg'],
    materials: ['Wood', 'Acrylic Paint', 'Stone'],
    provenance: 'Donated by the local community',
    title: 'Dreamscapes in Indigo',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f95f',
    artist_id: '671126abeaf172ac8eb0f94a',
    category: 'Expressionism',
    created_at: '2013-12-01T00:00:00',
    description:
      'A vintage-style painting of a weathered statue in a forgotten garden, surrounded by overgrown vines and rusting metal. The artwork explores themes of memory, decay, and nostalgia.',
    dimensions: {
      height_cm: 727,
      width_cm: 516,
    },
    images: ['https://i.imgur.com/tOJozyh.jpg'],
    materials: ['Oil Paint', 'Stone'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'The Fall of Man',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f960',
    artist_id: '671126abeaf172ac8eb0f944',
    category: 'Cubism',
    created_at: '2013-12-01T00:00:00',
    description:
      'A cosmic landscape where a spaceship travels through vibrant nebulae and distant galaxies. The stars sparkle in deep purples and silvers, creating an ethereal, otherworldly atmosphere.',
    dimensions: {
      height_cm: 208,
      width_cm: 979,
    },
    images: ['https://i.imgur.com/vj99Xnm.jpg'],
    materials: ['Gouache Paint', 'Oil Paint', 'Metal'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'The Creation of Adam',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f961',
    artist_id: '671126abeaf172ac8eb0f94c',
    category: 'Portraiture',
    created_at: '2013-12-01T00:00:00',
    description:
      'A powerful portrait of a person emerging from a cocoon of glowing light, symbolizing transformation and personal growth. The background is filled with swirling patterns of gold and white.',
    dimensions: {
      height_cm: 414,
      width_cm: 168,
    },
    images: ['https://i.imgur.com/vj99Xnm.jpg'],
    materials: ['Watercolor Paint', 'Oil Paint', 'Metal'],
    provenance: 'Donated by the local community',
    title: 'Eclipse of Serenity',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f962',
    artist_id: '671126abeaf172ac8eb0f94c',
    category: 'Pop Art',
    created_at: '2013-12-01T00:00:00',
    description:
      'A peaceful underwater scene where vibrant coral reefs teem with life. Fish of every color dart through crystal-clear waters, with soft light filtering from above.',
    dimensions: {
      height_cm: 343,
      width_cm: 882,
    },
    images: ['https://i.imgur.com/gLfkLEt.jpg'],
    materials: ['Gouache Paint', 'Charcoal', 'Stone'],
    provenance: 'Purchased from ABC Gallery',
    title: 'Reflections of a Distant Memory',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f963',
    artist_id: '671126abeaf172ac8eb0f950',
    category: 'Abstract',
    created_at: '2013-12-01T00:00:00',
    description:
      'A surreal flower emerging from a cracked stone, surrounded by glowing lights. The petals seem to shift colors, blending reality and fantasy, representing hope and renewal.',
    dimensions: {
      height_cm: 812,
      width_cm: 947,
    },
    images: ['https://i.imgur.com/gHO35GV.jpg'],
    materials: ['Acrylic Paint', 'Watercolor Paint', 'Metal'],
    provenance: 'Donated by the local community',
    title: 'Eclipse of Serenity',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f964',
    artist_id: '671126abeaf172ac8eb0f94b',
    category: 'Cubism',
    created_at: '2013-12-01T00:00:00',
    description:
      'A powerful portrait of a person emerging from a cocoon of glowing light, symbolizing transformation and personal growth. The background is filled with swirling patterns of gold and white.',
    dimensions: {
      height_cm: 288,
      width_cm: 295,
    },
    images: ['https://i.imgur.com/VScopId.jpg'],
    materials: ['Metal', 'Wood', 'Acrylic Paint'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'Shadows of a Lost Horizon',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f965',
    artist_id: '671126abeaf172ac8eb0f94f',
    category: 'Portraiture',
    created_at: '2013-12-01T00:00:00',
    description:
      'A cosmic landscape where a spaceship travels through vibrant nebulae and distant galaxies. The stars sparkle in deep purples and silvers, creating an ethereal, otherworldly atmosphere.',
    dimensions: {
      height_cm: 152,
      width_cm: 955,
    },
    images: ['https://i.imgur.com/fwP8n32.jpg'],
    materials: ['Gouache Paint', 'Charcoal'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'The Persistence of Memory',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f953',
    artist_id: '671126abeaf172ac8eb0f94c',
    category: 'Portraiture',
    created_at: '2013-12-01T00:00:00',
    description:
      'A vibrant, abstract representation of a bustling cityscape at night. Bold strokes of neon yellows, reds, and blues swirl around dynamic shapes, reflecting the energy and chaos of urban life.',
    dimensions: {
      height_cm: 429,
      width_cm: 272,
    },
    images: ['https://i.imgur.com/XXdNu8e.jpg'],
    materials: ['Watercolor Paint', 'Acrylic Paint'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'Luminescence of Solitude',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f954',
    artist_id: '671126abeaf172ac8eb0f94f',
    category: 'Portraiture',
    created_at: '2013-12-01T00:00:00',
    description:
      'A whimsical dreamlike scene where floating islands drift in the sky, each with its own unique ecosystem. The colors are soft and fluid, creating a sense of weightlessness and wonder.',
    dimensions: {
      height_cm: 421,
      width_cm: 970,
    },
    images: ['https://i.imgur.com/9bGh3jB.jpg'],
    materials: ['Wood', 'Stone', 'Metal'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'The Last Supper',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f955',
    artist_id: '671126abeaf172ac8eb0f944',
    category: 'Still Life',
    created_at: '2013-12-01T00:00:00',
    description:
      'A detailed painting of a soaring eagle with its wings spread wide against a sunset sky. The intricate feathers capture the light, symbolizing strength and liberation.',
    dimensions: {
      height_cm: 443,
      width_cm: 985,
    },
    images: ['https://i.imgur.com/44qgKqX.jpg'],
    materials: ['Acrylic Paint', 'Metal', 'Watercolor Paint'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'The Creation of Adam',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f956',
    artist_id: '671126abeaf172ac8eb0f950',
    category: 'Impressionism',
    created_at: '2013-12-01T00:00:00',
    description:
      'A powerful portrait of a person emerging from a cocoon of glowing light, symbolizing transformation and personal growth. The background is filled with swirling patterns of gold and white.',
    dimensions: {
      height_cm: 229,
      width_cm: 309,
    },
    images: ['https://i.imgur.com/EylMgvC.jpg'],
    materials: ['Metal', 'Charcoal'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'Whispers of the Forgotten',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f957',
    artist_id: '671126abeaf172ac8eb0f948',
    category: 'Impressionism',
    created_at: '2013-12-01T00:00:00',
    description:
      'A powerful portrait of a person emerging from a cocoon of glowing light, symbolizing transformation and personal growth. The background is filled with swirling patterns of gold and white.',
    dimensions: {
      height_cm: 897,
      width_cm: 519,
    },
    images: ['https://i.imgur.com/EylMgvC.jpg'],
    materials: ['Watercolor Paint', 'Acrylic Paint'],
    provenance: 'Donated by the local community',
    title: 'The Last Supper',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f958',
    artist_id: '671126abeaf172ac8eb0f944',
    category: 'Surrealism',
    created_at: '2013-12-01T00:00:00',
    description:
      'A serene landscape painting depicting a calm lake surrounded by misty mountains at dawn. Soft blues and purples dominate the scene, evoking a sense of peace and introspection.',
    dimensions: {
      height_cm: 338,
      width_cm: 845,
    },
    images: ['https://i.imgur.com/ZoKq66D.jpg'],
    materials: ['Oil Paint', 'Gouache Paint'],
    provenance: 'Purchased from ABC Gallery',
    title: 'The Fall of Man',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f959',
    artist_id: '671126abeaf172ac8eb0f94c',
    category: 'Still Life',
    created_at: '2013-12-01T00:00:00',
    description:
      'An intricate steampunk-inspired artwork of a clockwork heart, gears and cogs spinning inside a transparent casing. The fusion of organic and mechanical elements speaks to the idea of artificial life.',
    dimensions: {
      height_cm: 225,
      width_cm: 749,
    },
    images: ['https://i.imgur.com/BkPt86Q.jpg'],
    materials: ['Gouache Paint', 'Wood'],
    provenance: 'Purchased from ABC Gallery',
    title: 'Echoes of the Eternal',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f95a',
    artist_id: '671126abeaf172ac8eb0f942',
    category: 'Landscape',
    created_at: '2013-12-01T00:00:00',
    description:
      'A detailed painting of a soaring eagle with its wings spread wide against a sunset sky. The intricate feathers capture the light, symbolizing strength and liberation.',
    dimensions: {
      height_cm: 247,
      width_cm: 422,
    },
    images: ['https://i.imgur.com/ZoKq66D.jpg'],
    materials: ['Stone', 'Metal'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'The Last Supper',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
  {
    _id: '67112847eaf172ac8eb0f95b',
    artist_id: '671126abeaf172ac8eb0f942',
    category: 'Portraiture',
    created_at: '2013-12-01T00:00:00',
    description:
      'A whimsical dreamlike scene where floating islands drift in the sky, each with its own unique ecosystem. The colors are soft and fluid, creating a sense of weightlessness and wonder.',
    dimensions: {
      height_cm: 748,
      width_cm: 215,
    },
    images: ['https://i.imgur.com/rW5gX3W.jpg'],
    materials: ['Metal', 'Watercolor Paint', 'Charcoal'],
    provenance: 'Acquired from XYZ Auction House',
    title: 'Whispers of the Forgotten',
    updated_at: 'Mon, 28 Oct 2024 20:38:12 GMT',
  },
];

const exhibitionJsonData = [
  {
    _id: '6720086a4614f216533d0532',
    artworks: [
      '671f830ba6020d8fd80dd24c',
      '671f7fe67774ba108013ab59',
      '67112847eaf172ac8eb0f966',
      '67112847eaf172ac8eb0f96f',
      '67112847eaf172ac8eb0f958',
      '67112847eaf172ac8eb0f994',
      '67112847eaf172ac8eb0f993',
      '67112847eaf172ac8eb0f985',
      '671c0bb18745ac5b6ddc419a',
      '67112847eaf172ac8eb0f987',
      '67112847eaf172ac8eb0f997',
      '67112847eaf172ac8eb0f977',
      '67112847eaf172ac8eb0f984',
      '67112847eaf172ac8eb0f99d',
      '67112847eaf172ac8eb0f989',
    ],
    created_at: '2024-10-28T21:55:54.997745+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'An assemblage of portraits that tell the stories of diverse cultures and identities.',
    provenance: 'Acquired from XYZ Auction House',
    title: 'The Power of Color',
    updated_at: '2024-10-28T21:55:54.997745+00:00',
  },
  {
    _id: '6720086a4614f216533d0548',
    artworks: [
      '67112847eaf172ac8eb0f96d',
      '67112847eaf172ac8eb0f984',
      '671f8550670694083251c17d',
      '67112847eaf172ac8eb0f988',
      '67112847eaf172ac8eb0f962',
      '67112847eaf172ac8eb0f991',
      '67112847eaf172ac8eb0f9a2',
      '67112847eaf172ac8eb0f98a',
      '67112847eaf172ac8eb0f975',
      '67112847eaf172ac8eb0f972',
      '67112847eaf172ac8eb0f99b',
      '67112847eaf172ac8eb0f98b',
    ],
    created_at: '2024-10-28T21:55:54.997745+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'A showcase of artworks that evoke serenity and solitude through minimalist expressions.',
    provenance: 'Donated by the local community',
    title: 'Elements of the Mind',
    updated_at: '2024-10-28T21:55:54.997745+00:00',
  },
  {
    _id: '6720086a4614f216533d0562',
    artworks: [
      '67112847eaf172ac8eb0f98e',
      '67112847eaf172ac8eb0f97f',
      '67112847eaf172ac8eb0f980',
      '671f820aa6020d8fd80dd243',
      '67112847eaf172ac8eb0f961',
      '67112847eaf172ac8eb0f976',
      '67112847eaf172ac8eb0f971',
      '671fa22c0891b7fb192f9cd8',
      '671f802c7774ba108013ab5a',
      '67112847eaf172ac8eb0f97a',
      '67112847eaf172ac8eb0f989',
      '67112847eaf172ac8eb0f985',
      '67112847eaf172ac8eb0f9ad',
      '67112847eaf172ac8eb0f969',
      '671f8594670694083251c182',
    ],
    created_at: '2024-10-28T21:55:54.997745+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'A collection of surreal landscapes that challenge the boundaries of reality and perception.',
    provenance: 'Donated by the local community',
    title: 'Journey Through Time',
    updated_at: '2024-10-28T21:55:54.997745+00:00',
  },
  {
    _id: '6720086a4614f216533d057e',
    artworks: [
      '671f802c7774ba108013ab5a',
      '67112847eaf172ac8eb0f98f',
      '67112847eaf172ac8eb0f999',
      '67112847eaf172ac8eb0f989',
      '67112847eaf172ac8eb0f975',
      '67112847eaf172ac8eb0f991',
      '67112847eaf172ac8eb0f969',
      '67112847eaf172ac8eb0f970',
      '671f8e174f7fbd76ed12983b',
      '67112847eaf172ac8eb0f963',
      '67112847eaf172ac8eb0f966',
      '67112847eaf172ac8eb0f977',
      '67112847eaf172ac8eb0f972',
      '671c0bb18745ac5b6ddc419a',
      '67112847eaf172ac8eb0f9b2',
    ],
    created_at: '2024-10-28T21:55:54.997745+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'A celebration of the elements—earth, fire, water, air—in various artistic forms.',
    provenance: 'Donated by the local community',
    title: 'Shadows and Light',
    updated_at: '2024-10-28T21:55:54.997745+00:00',
  },
  {
    _id: '6720086a4614f216533d0592',
    artworks: [
      '67112847eaf172ac8eb0f97f',
      '67112847eaf172ac8eb0f984',
      '671f7fe67774ba108013ab59',
      '67112847eaf172ac8eb0f9a3',
      '67112847eaf172ac8eb0f970',
      '67112847eaf172ac8eb0f99a',
      '671f8554670694083251c17f',
      '67112847eaf172ac8eb0f9a4',
      '67112847eaf172ac8eb0f96c',
      '671c0bb18745ac5b6ddc419a',
    ],
    created_at: '2024-10-28T21:55:54.997745+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'An eclectic display of surreal and impressionist pieces, bringing dreamscapes to life.',
    provenance: 'Purchased from ABC Gallery',
    title: 'Reflections of Time',
    updated_at: '2024-10-28T21:55:54.997745+00:00',
  },
  {
    _id: '6720086a4614f216533d05b0',
    artworks: [
      '67112847eaf172ac8eb0f9a2',
      '67112847eaf172ac8eb0f9ae',
      '67112847eaf172ac8eb0f9a9',
      '67112847eaf172ac8eb0f964',
      '67112847eaf172ac8eb0f972',
      '67112847eaf172ac8eb0f9ad',
      '67112847eaf172ac8eb0f98b',
      '67112847eaf172ac8eb0f9af',
      '67112847eaf172ac8eb0f9a0',
      '67112847eaf172ac8eb0f95a',
      '67112847eaf172ac8eb0f978',
    ],
    created_at: '2024-10-28T21:55:54.997745+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'A vibrant tribute to the power of colors and how they evoke emotions.',
    provenance: 'Acquired from XYZ Auction House',
    title: 'Shadows and Light',
    updated_at: '2024-10-28T21:55:54.997745+00:00',
  },
  {
    _id: '6720086a4614f216533d05cb',
    artworks: [
      '67112847eaf172ac8eb0f970',
      '67112847eaf172ac8eb0f95e',
      '671f8e174f7fbd76ed12983b',
      '67112847eaf172ac8eb0f96f',
      '67112847eaf172ac8eb0f991',
      '67112847eaf172ac8eb0f9a3',
      '67112847eaf172ac8eb0f990',
      '671f75a2a373eaac33487bbe',
      '67112847eaf172ac8eb0f98e',
      '67112847eaf172ac8eb0f997',
      '67112847eaf172ac8eb0f97b',
      '671f8552670694083251c17e',
      '67112847eaf172ac8eb0f964',
      '67112847eaf172ac8eb0f98d',
    ],
    created_at: '2024-10-28T21:55:54.997745+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'An exploration of the dynamic interplay between shadows and light, creating vivid contrasts.',
    provenance: 'Donated by the local community',
    title: 'The Essence of Form',
    updated_at: '2024-10-28T21:55:54.997745+00:00',
  },
  {
    _id: '6720086a4614f216533d05e6',
    artworks: [
      '67112847eaf172ac8eb0f972',
      '67112847eaf172ac8eb0f969',
      '67112847eaf172ac8eb0f97e',
      '67112847eaf172ac8eb0f991',
      '671f8248a6020d8fd80dd247',
      '67112847eaf172ac8eb0f96f',
      '67112847eaf172ac8eb0f9ae',
      '67112847eaf172ac8eb0f9a8',
      '67112847eaf172ac8eb0f99f',
      '67112847eaf172ac8eb0f97b',
      '67112847eaf172ac8eb0f96b',
    ],
    created_at: '2024-10-28T21:55:54.999243+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'An artistic dive into the essence of nature, capturing its raw beauty and organic forms.',
    provenance: 'Purchased from ABC Gallery',
    title: 'Dreamscapes Unbound',
    updated_at: '2024-10-28T21:55:54.999243+00:00',
  },
  {
    _id: '6720086a4614f216533d05f9',
    artworks: [
      '67112847eaf172ac8eb0f986',
      '67112847eaf172ac8eb0f954',
      '67112847eaf172ac8eb0f976',
      '671f7fe67774ba108013ab59',
      '67112847eaf172ac8eb0f9a3',
      '67112847eaf172ac8eb0f961',
      '67112847eaf172ac8eb0f958',
      '67112847eaf172ac8eb0f984',
      '671f8301a6020d8fd80dd24b',
      '67112847eaf172ac8eb0f9a1',
      '671f8248a6020d8fd80dd247',
    ],
    created_at: '2024-10-28T21:55:54.999243+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'An assemblage of portraits that tell the stories of diverse cultures and identities.',
    provenance: 'Donated by the local community',
    title: 'Echoes of Nature',
    updated_at: '2024-10-28T21:55:54.999243+00:00',
  },
  {
    _id: '6720086a4614f216533d060c',
    artworks: [
      '67112847eaf172ac8eb0f973',
      '67112847eaf172ac8eb0f981',
      '67112847eaf172ac8eb0f98a',
      '67112847eaf172ac8eb0f979',
      '67112847eaf172ac8eb0f974',
      '67112847eaf172ac8eb0f991',
      '67112847eaf172ac8eb0f9b5',
      '67112847eaf172ac8eb0f96e',
      '67112847eaf172ac8eb0f953',
      '67112847eaf172ac8eb0f99e',
      '67112847eaf172ac8eb0f957',
      '67112847eaf172ac8eb0f98e',
      '67112847eaf172ac8eb0f978',
      '67112847eaf172ac8eb0f97c',
      '67112847eaf172ac8eb0f982',
    ],
    created_at: '2024-10-28T21:55:54.999243+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'A vibrant tribute to the power of colors and how they evoke emotions.',
    provenance: 'Donated by the local community',
    title: 'Whispers of Silence',
    updated_at: '2024-10-28T21:55:54.999243+00:00',
  },
  {
    _id: '6720086a4614f216533d0623',
    artworks: [
      '67112847eaf172ac8eb0f9a3',
      '67112847eaf172ac8eb0f987',
      '67112847eaf172ac8eb0f97a',
      '67112847eaf172ac8eb0f980',
      '67112847eaf172ac8eb0f966',
      '67112847eaf172ac8eb0f9a0',
      '67112847eaf172ac8eb0f952',
      '67112847eaf172ac8eb0f98b',
      '67112847eaf172ac8eb0f995',
      '67112847eaf172ac8eb0f9b4',
      '67112847eaf172ac8eb0f98f',
      '67112847eaf172ac8eb0f982',
      '67112847eaf172ac8eb0f974',
      '67112847eaf172ac8eb0f97e',
      '671f8248a6020d8fd80dd247',
    ],
    created_at: '2024-10-28T21:55:54.999243+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'An artistic dive into the essence of nature, capturing its raw beauty and organic forms.',
    provenance: 'Acquired from XYZ Auction House',
    title: 'Echoes of Nature',
    updated_at: '2024-10-28T21:55:54.999243+00:00',
  },
  {
    _id: '6720086a4614f216533d0646',
    artworks: [
      '671f8594670694083251c182',
      '67112847eaf172ac8eb0f9a9',
      '671f8550670694083251c17d',
      '67112847eaf172ac8eb0f97b',
      '67112847eaf172ac8eb0f99d',
      '67112847eaf172ac8eb0f971',
      '67112847eaf172ac8eb0f993',
      '67112847eaf172ac8eb0f9ac',
      '67112847eaf172ac8eb0f97c',
      '67112847eaf172ac8eb0f969',
      '67112847eaf172ac8eb0f992',
      '67112847eaf172ac8eb0f967',
      '67112847eaf172ac8eb0f961',
    ],
    created_at: '2024-10-28T21:55:54.999747+00:00',
    curator_id: '671126abeaf172ac8eb0f947',
    description:
      'A celebration of the elements—earth, fire, water, air—in various artistic forms.',
    provenance: 'Purchased from ABC Gallery',
    title: 'Abstract Visions',
    updated_at: '2024-10-28T21:55:54.999747+00:00',
  },
];

export class DataService {
  pageSize: number = 12;
  getArtworks(page: number) {
    let pageStart = (page - 1) * this.pageSize;
    let pageEnd = pageStart + this.pageSize;
    return jsonData.slice(pageStart, pageEnd);
  }

  getArtwork(id: any) {
    let dataToReturn: any[] = [];
    jsonData.forEach(function (artwork) {
      if (artwork['_id'] == id) {
        dataToReturn.push(artwork);
      }
    });
    return dataToReturn;
  }

  getTotalArtworks() {
    return jsonData.length;
  }

  getExhibitions(page: number) {
    let pageStart = (page - 1) * this.pageSize;
    let pageEnd = pageStart + this.pageSize;
    return exhibitionJsonData.slice(pageStart, pageEnd);
  }

  getTotalExhibitions() {
    return exhibitionJsonData.length;
  }
}
