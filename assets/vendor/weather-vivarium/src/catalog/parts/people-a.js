/* People batch A — occupational & activity figures (ground layer).
   Feet on row yb, faces right, 2-frame walk/idle from (env.frame>>2)&1. Bodies
   only — weather gear (umbrella/parka/mask) is layered on by the actor system, so
   these just paint the person plus their defining prop (board, easel, briefcase,
   fishing rod…). Clothing wrapped in env.col so it dims at night; skin and light
   flashes stay plain accents. Authored facing right; the engine mirrors. */

export default [
  {
    id: "surfer", name: "Surfer", biomes: ["coast"],
    tags: ["person", "beach", "summer"], w: 6, h: 9, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#d79a63", hair = env.col("#2a1a12"), suit = env.col("#123a52");
      var board = env.col("#e05a7a"), stripe = env.col("#f0d040");
      var step = (env.frame >> 2) & 1;
      // surfboard stood upright on the near side
      P.line(x, yb - 1, x, yb - 7, board);
      P.px(x, yb - 8, board);                             // nose tip
      P.px(x, yb - 4, stripe);                            // deck stripe
      P.px(x + 1, yb - 4, suit);                          // arm tucking board
      // figure
      P.px(x + 3, yb - 6, hair);
      P.px(x + 3, yb - 5, skin);                          // head
      P.rect(x + 3, yb - 4, 1, 2, suit);                  // wetsuit torso
      P.px(x + 4, yb - 3, skin);                          // far arm
      P.px(x + 3, yb - 2, suit);
      if (step) { P.px(x + 2, yb - 1, skin); P.px(x + 2, yb, skin); P.px(x + 4, yb, skin); }
      else { P.px(x + 3, yb - 1, skin); P.px(x + 3, yb, skin); P.px(x + 4, yb, skin); }
    }
  },
  {
    id: "skier", name: "Skier", biomes: ["mountain", "tundra"],
    tags: ["person", "winter", "snow"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#dca873", hat = env.col("#c03030"), coat = env.col("#2a6ab0");
      var pants = env.col("#20304a"), ski = env.col("#e8d040"), pole = "#9aa0a6";
      var step = (env.frame >> 2) & 1;
      // skis with an upturned front tip
      P.line(x, yb, x + 4, yb, ski);
      P.line(x + 4, yb, x + 5, yb - 1, ski);
      // planted pole (angle alternates for glide feel)
      if (step) { P.line(x + 4, yb - 3, x + 5, yb, pole); }
      else { P.line(x + 4, yb - 3, x + 4, yb, pole); }
      // crouched skier
      P.px(x + 2, yb - 6, hat); P.px(x + 3, yb - 6, hat);
      P.px(x + 3, yb - 5, skin);                          // head
      P.rect(x + 3, yb - 4, 1, 2, coat);                  // torso
      P.px(x + 4, yb - 4, coat);                          // forward arm
      P.px(x + 2, yb - 3, coat);                          // trailing arm
      P.px(x + 2, yb - 2, pants); P.px(x + 3, yb - 2, pants); // bent legs
      P.px(x + 2, yb - 1, pants); P.px(x + 3, yb - 1, pants);
    }
  },
  {
    id: "snowboarder", name: "Snowboarder", biomes: ["mountain", "tundra"],
    tags: ["person", "winter", "snow"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#d79a63", hat = env.col("#30b0a0"), coat = env.col("#e07a20");
      var pants = env.col("#303848"), board = env.col("#d03060"), stripe = env.col("#f0e040");
      var step = (env.frame >> 2) & 1;
      // snowboard, both tips upturned
      P.line(x, yb, x + 5, yb, board);
      P.px(x, yb - 1, board); P.px(x + 5, yb - 1, board);
      P.px(x + 3, yb, stripe);
      // rider
      P.px(x + 3, yb - 6, hat);
      P.px(x + 3, yb - 5, skin);                          // head
      P.rect(x + 3, yb - 4, 1, 2, coat);                  // torso
      if (step) { P.px(x + 1, yb - 4, coat); P.px(x + 5, yb - 2, skin); }  // arms out
      else { P.px(x + 1, yb - 3, coat); P.px(x + 5, yb - 3, skin); }
      P.px(x + 2, yb - 2, pants); P.px(x + 4, yb - 2, pants); // bent legs
      P.px(x + 2, yb - 1, pants); P.px(x + 4, yb - 1, pants);
      P.px(x + 2, yb, pants); P.px(x + 4, yb, pants);     // boots strapped in
    }
  },
  {
    id: "farmer", name: "Farmer", biomes: ["farmland", "plains"],
    tags: ["person", "rural", "work"], w: 5, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c8894f", hat = env.col("#d9b84a"), hatb = env.col("#b8963a");
      var shirt = env.col("#c94a3a"), overall = env.col("#3a5aa8");
      var step = (env.frame >> 2) & 1;
      P.rect(x + 1, yb - 7, 3, 1, hat);                   // straw-hat brim
      P.px(x + 2, yb - 8, hatb);                          // crown
      P.px(x + 2, yb - 6, skin);                          // head
      P.px(x + 1, yb - 5, shirt); P.px(x + 2, yb - 5, shirt); P.px(x + 3, yb - 5, shirt);
      P.px(x + 3, yb - 4, skin);                          // swinging arm
      P.rect(x + 2, yb - 4, 1, 2, overall);               // overalls bib
      if (step) { P.px(x + 1, yb - 2, overall); P.px(x + 2, yb - 1, overall); P.px(x + 1, yb, overall); P.px(x + 3, yb, overall); }
      else { P.px(x + 2, yb - 2, overall); P.px(x + 2, yb - 1, overall); P.px(x + 2, yb, overall); P.px(x + 3, yb, overall); }
    }
  },
  {
    id: "fisherman", name: "Fisherman", biomes: ["coast", "lake", "wetland"],
    tags: ["person", "water", "hobby"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#cf9560", hat = env.col("#3a6a4a"), coat = env.col("#d9c24a");
      var waders = env.col("#4a6a80"), rod = "#8a6a3a", line = "#cfd6da";
      var step = (env.frame >> 2) & 1;
      // bucket hat
      P.rect(x + 1, yb - 7, 3, 1, hat); P.px(x + 1, yb - 6, hat); P.px(x + 3, yb - 6, hat);
      P.px(x + 2, yb - 6, skin);                          // face under brim
      P.rect(x + 2, yb - 5, 1, 2, coat);                  // raincoat torso
      P.px(x + 1, yb - 5, coat);                          // arm
      P.px(x + 3, yb - 4, skin);                          // hand on rod
      P.line(x + 3, yb - 4, x + 5, yb - 8, rod);          // rod up-forward
      P.line(x + 5, yb - 8, x + 5, yb - 5, line);         // dangling line
      P.px(x + 2, yb - 3, waders);
      if (step) { P.px(x + 1, yb - 2, waders); P.px(x + 3, yb - 1, waders); P.px(x + 1, yb, waders); P.px(x + 3, yb, waders); }
      else { P.px(x + 2, yb - 2, waders); P.px(x + 2, yb - 1, waders); P.px(x + 2, yb, waders); P.px(x + 3, yb, waders); }
    }
  },
  {
    id: "businessperson", name: "Businessperson", biomes: ["city"],
    tags: ["person", "commute", "work"], w: 5, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#d8a06a", hair = env.col("#2a2018"), suit = env.col("#33384a");
      var shirt = env.col("#e8e8ec"), tie = env.col("#b03040");
      var caseC = env.col("#5a3a22"), caseH = env.col("#2a1a10");
      var step = (env.frame >> 2) & 1;
      P.px(x + 1, yb - 7, hair); P.px(x + 2, yb - 7, hair);
      P.px(x + 2, yb - 6, skin);                          // head
      P.px(x + 1, yb - 5, suit); P.px(x + 3, yb - 5, suit); P.px(x + 2, yb - 5, shirt); // collar
      P.rect(x + 2, yb - 4, 1, 2, suit);                  // torso
      P.px(x + 2, yb - 4, tie);                           // tie
      P.px(x + 3, yb - 4, skin);                          // hand
      P.rect(x + 3, yb - 3, 2, 2, caseC);                 // briefcase
      P.px(x + 3, yb - 3, caseH);                         // clasp
      if (step) { P.px(x + 1, yb - 2, suit); P.px(x + 2, yb - 1, suit); P.px(x + 1, yb, suit); P.px(x + 3, yb, suit); }
      else { P.px(x + 2, yb - 2, suit); P.px(x + 2, yb - 1, suit); P.px(x + 2, yb, suit); P.px(x + 3, yb, suit); }
    }
  },
  {
    id: "street-vendor", name: "Street Vendor", biomes: ["city"],
    tags: ["person", "market", "work"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c8935c", cap = env.col("#c03838"), shirt = env.col("#2a7a5a");
      var pants = env.col("#333a48"), cart = env.col("#b0752a");
      var canopy = env.col("#d94040"), canopy2 = env.col("#e8e2d0"), wheel = "#2a2a2a", steam = "#d6dbdf";
      var step = (env.frame >> 2) & 1;
      // pushcart in front
      P.rect(x, yb - 3, 3, 2, cart);
      P.px(x, yb - 4, canopy); P.px(x + 1, yb - 4, canopy2); P.px(x + 2, yb - 4, canopy);
      P.px(x, yb, wheel); P.px(x + 2, yb, wheel);
      if (step) { P.px(x + 1, yb - 5, steam); } else { P.px(x + 1, yb - 6, steam); } // steam puff
      // vendor behind the cart
      P.px(x + 3, yb - 6, cap); P.px(x + 4, yb - 6, cap);
      P.px(x + 4, yb - 5, skin);                          // head
      P.rect(x + 4, yb - 4, 1, 2, shirt);                 // torso
      P.px(x + 3, yb - 4, skin);                          // arm to cart
      P.px(x + 4, yb - 2, pants);
      if (step) { P.px(x + 3, yb - 1, pants); P.px(x + 5, yb, pants); P.px(x + 3, yb, pants); }
      else { P.px(x + 4, yb - 1, pants); P.px(x + 4, yb, pants); P.px(x + 5, yb, pants); }
    }
  },
  {
    id: "painter", name: "Painter", biomes: ["city", "coast", "forest"],
    tags: ["person", "artist", "creative"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#dba875", beret = env.col("#b0333a"), smock = env.col("#3a6a8a");
      var pants = env.col("#4a4a52"), easel = env.col("#8a6a3a"), canvas = env.col("#e8e2d0");
      var palette = env.col("#c9a24a"), daub1 = env.col("#d94040"), daub2 = env.col("#2aa06a");
      var step = (env.frame >> 2) & 1;
      // easel + canvas
      P.line(x, yb, x + 1, yb - 6, easel);
      P.line(x + 2, yb, x + 1, yb - 6, easel);
      P.rect(x, yb - 6, 3, 4, canvas);
      P.px(x + 1, yb - 4, daub1); P.px(x + 1, yb - 5, daub2);
      // painter at the easel
      P.px(x + 4, yb - 6, beret); P.px(x + 5, yb - 6, beret);
      P.px(x + 4, yb - 5, skin);                          // head
      P.rect(x + 4, yb - 4, 1, 2, smock);                 // smock
      P.px(x + 3, yb - 4, skin);                          // brush hand toward canvas
      P.px(x + 5, yb - 3, palette);                       // palette
      P.px(x + 4, yb - 2, pants);
      if (step) { P.px(x + 3, yb - 1, pants); P.px(x + 3, yb, pants); P.px(x + 5, yb, pants); }
      else { P.px(x + 4, yb - 1, pants); P.px(x + 4, yb, pants); P.px(x + 5, yb, pants); }
    }
  },
  {
    id: "photographer", name: "Photographer", biomes: ["city", "coast", "mountain", "forest"],
    tags: ["person", "tourist", "creative"], w: 5, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c99060", hair = env.col("#241a12"), vest = env.col("#3a5a3a");
      var pants = env.col("#33384a"), cam = env.col("#1a1a1e"), lens = env.col("#5a6a72"), flash = "#f4f0d8";
      var step = (env.frame >> 2) & 1;
      P.px(x + 1, yb - 7, hair); P.px(x + 2, yb - 7, hair);
      P.px(x + 2, yb - 6, skin);                          // head
      P.rect(x + 2, yb - 6, 2, 1, cam);                   // camera to the eye
      P.px(x + 4, yb - 6, lens);                          // lens
      if (step) { P.px(x + 4, yb - 7, flash); }           // flash pop (light — undimmed)
      P.px(x + 1, yb - 5, vest); P.px(x + 2, yb - 5, vest); P.px(x + 3, yb - 5, vest);
      P.rect(x + 2, yb - 4, 1, 2, vest);                  // torso
      P.px(x + 3, yb - 4, skin);                          // hand up to camera
      P.px(x + 1, yb - 4, vest);                          // other arm
      P.px(x + 2, yb - 2, pants);
      if (step) { P.px(x + 1, yb - 1, pants); P.px(x + 1, yb, pants); P.px(x + 3, yb, pants); }
      else { P.px(x + 2, yb - 1, pants); P.px(x + 2, yb, pants); P.px(x + 3, yb, pants); }
    }
  },
  {
    id: "skateboarder", name: "Skateboarder", biomes: ["city", "coast"],
    tags: ["person", "youth", "active"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#cf9560", cap = env.col("#2a7ab0"), bill = env.col("#1a5a90");
      var shirt = env.col("#e0c030"), pants = env.col("#40465a"), deck = env.col("#8a5a2a"), wheel = "#e8e2d0";
      var step = (env.frame >> 2) & 1;
      // skateboard
      P.rect(x, yb - 1, 6, 1, deck);
      P.px(x + 1, yb, wheel); P.px(x + 4, yb, wheel);
      // rider leaning forward
      P.px(x + 2, yb - 7, cap); P.px(x + 3, yb - 7, cap); P.px(x + 4, yb - 7, bill);
      P.px(x + 3, yb - 6, skin);                          // head
      P.rect(x + 3, yb - 5, 1, 2, shirt);                 // torso
      if (step) { P.px(x + 1, yb - 5, skin); P.px(x + 5, yb - 4, skin); } // arms for balance
      else { P.px(x + 1, yb - 4, skin); P.px(x + 5, yb - 5, skin); }
      P.px(x + 2, yb - 3, pants); P.px(x + 4, yb - 3, pants); // bent legs to deck
      P.px(x + 2, yb - 2, pants); P.px(x + 4, yb - 2, pants);
    }
  },
  {
    id: "monk", name: "Monk", biomes: ["forest", "jungle", "mountain"],
    tags: ["person", "robe", "calm"], w: 4, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#cf9a63", robe = env.col("#c8622a"), robeD = env.col("#9a4520"), sash = env.col("#e8b038");
      var step = (env.frame >> 2) & 1;
      P.px(x + 1, yb - 7, skin); P.px(x + 2, yb - 7, skin); // shaved crown
      P.px(x + 1, yb - 6, skin); P.px(x + 2, yb - 6, skin);
      P.rect(x + 1, yb - 5, 2, 4, robe);                  // robe body
      P.px(x, yb - 4, robeD); P.px(x + 3, yb - 4, robeD); // draped sleeves
      P.rect(x + 1, yb - 3, 2, 1, sash);                  // sash
      P.rect(x + 1, yb - 1, 2, 1, robe);                  // hem
      if (step) { P.px(x + 1, yb, skin); } else { P.px(x + 2, yb, skin); } // sandalled foot
    }
  },
  {
    id: "cowboy", name: "Cowboy", biomes: ["desert", "plains", "savanna", "canyon"],
    tags: ["person", "western", "rural"], w: 5, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c88a55", hat = env.col("#7a5228"), hatD = env.col("#5a3c1c");
      var shirt = env.col("#c0402a"), vest = env.col("#6a4a2a"), jeans = env.col("#3a5a90"), boot = env.col("#5a3a1e");
      var step = (env.frame >> 2) & 1;
      P.rect(x, yb - 7, 5, 1, hat);                       // wide brim
      P.rect(x + 1, yb - 8, 2, 1, hatD);                  // crown
      P.px(x + 2, yb - 6, skin);                          // face
      P.px(x + 1, yb - 5, shirt); P.px(x + 2, yb - 5, shirt); P.px(x + 3, yb - 5, vest);
      P.rect(x + 2, yb - 4, 1, 2, vest);                  // vested torso
      P.px(x + 1, yb - 4, skin); P.px(x + 3, yb - 4, skin); // hands at belt
      P.px(x + 2, yb - 2, jeans);
      if (step) { P.px(x + 1, yb - 1, jeans); P.px(x + 1, yb, boot); P.px(x + 3, yb, boot); }
      else { P.px(x + 2, yb - 1, jeans); P.px(x + 2, yb, boot); P.px(x + 3, yb, boot); }
    }
  },
  {
    id: "mail-carrier", name: "Mail Carrier", biomes: ["city", "plains", "farmland"],
    tags: ["person", "postal", "work"], w: 5, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c8935c", cap = env.col("#2a4a8a"), bill = env.col("#1a3468");
      var shirt = env.col("#4a7ab0"), shorts = env.col("#3a5a90"), shoe = env.col("#2a2a2e");
      var bag = env.col("#c8a038"), strap = env.col("#8a6a20"), letter = env.col("#eae4d8");
      var step = (env.frame >> 2) & 1;
      P.px(x + 1, yb - 7, cap); P.px(x + 2, yb - 7, cap); P.px(x + 3, yb - 7, bill);
      P.px(x + 2, yb - 6, skin);                          // head
      P.px(x + 1, yb - 5, shirt); P.px(x + 2, yb - 5, shirt); P.px(x + 3, yb - 5, shirt);
      P.rect(x + 2, yb - 4, 1, 2, shirt);                 // torso
      P.px(x + 1, yb - 4, strap);                         // satchel strap
      P.rect(x, yb - 3, 2, 2, bag);                       // mailbag on hip
      P.px(x + 3, yb - 4, skin);                          // hand with letter
      P.px(x + 4, yb - 4, letter);
      P.px(x + 2, yb - 2, shorts);
      if (step) { P.px(x + 1, yb - 1, skin); P.px(x + 1, yb, shoe); P.px(x + 3, yb, shoe); }
      else { P.px(x + 2, yb - 1, skin); P.px(x + 2, yb, shoe); P.px(x + 3, yb, shoe); }
    }
  },
  {
    id: "construction-worker", name: "Construction Worker", biomes: ["city", "canyon", "desert"],
    tags: ["person", "work", "site"], w: 5, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c8894f", hat = env.col("#e8c020"), hatB = env.col("#c8a010");
      var vest = env.col("#e86a20"), stripe = env.col("#f0e8d0"), pants = env.col("#7a5a2a"), boot = env.col("#3a2a18");
      var tool = "#9aa0a6";
      var step = (env.frame >> 2) & 1;
      P.rect(x + 1, yb - 7, 3, 1, hat);                   // hard-hat brim
      P.px(x + 2, yb - 8, hatB);                          // crest
      P.px(x + 2, yb - 6, skin);                          // head
      P.px(x + 1, yb - 5, vest); P.px(x + 2, yb - 5, vest); P.px(x + 3, yb - 5, vest);
      P.rect(x + 2, yb - 4, 1, 2, vest);                  // hi-vis torso
      P.px(x + 2, yb - 3, stripe);                        // reflective band
      P.px(x + 1, yb - 4, skin); P.px(x + 3, yb - 4, skin); // arms
      P.px(x + 4, yb - 4, tool); P.px(x + 4, yb - 3, tool); // hammer at side
      P.px(x + 2, yb - 2, pants);
      if (step) { P.px(x + 1, yb - 1, pants); P.px(x + 1, yb, boot); P.px(x + 3, yb, boot); }
      else { P.px(x + 2, yb - 1, pants); P.px(x + 2, yb, boot); P.px(x + 3, yb, boot); }
    }
  }
];
