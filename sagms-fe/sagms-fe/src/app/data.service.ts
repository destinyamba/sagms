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

export class DataService {
  pageSize: number = 12;
  getArtworks(page: number) {
    let pageStart = (page - 1) * this.pageSize;
    let pageEnd = pageStart + this.pageSize;
    return jsonData.slice(pageStart, pageEnd);
  }

  getTotalArtworks() {
    return jsonData.length;
  }
}
