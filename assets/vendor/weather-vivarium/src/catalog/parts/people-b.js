/* People batch B — street-life & livelihood figures (ground layer).
   Feet on row yb, faces right, a 2-frame walk/idle from (env.frame>>2)&1 (the
   skater and busker-drummer read faster, off (env.frame>>1)&1). Bodies only —
   heavy weather gear is layered on by the actor system, so these paint the
   person plus their defining prop (guitar, cart, basket, staff, broom, balloons,
   watering can, bucket drum…). Clothing/props wrapped in env.col so they dim at
   night; bare skin and the odd bright accent (camera, water sparkle) stay plain.
   Authored facing right; the engine mirrors. */

export default [
  {
    id: "street-musician", name: "Street Musician", biomes: ["city", "coast", "plains", "wetland", "farmland", "forest", "lake"],
    tags: ["person", "music", "busker"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#cf9560", hair = env.col("#2a1a12"), shirt = env.col("#3a7a6a");
      var pants = env.col("#3a3f4a"), guitar = env.col("#b0742a"), gdark = env.col("#7a4a18"), strings = "#e8e2d0";
      var step = (env.frame >> 2) & 1;
      P.px(x + 3, yb - 7, hair); P.px(x + 4, yb - 7, hair);
      P.px(x + 3, yb - 6, skin);                          // head
      P.rect(x + 3, yb - 5, 1, 2, shirt);                 // torso
      // guitar: rounded body low-front, neck rising up-left
      P.rect(x + 1, yb - 3, 2, 2, guitar);                // body
      P.px(x + 1, yb - 4, gdark);                         // upper bout
      P.line(x + 2, yb - 4, x, yb - 6, gdark);            // neck
      P.px(x, yb - 6, strings);                           // headstock
      P.px(x + 2, yb - 3, strings);                       // soundhole glint
      P.px(x + 2, yb - 4, skin);                          // fretting arm
      if (step) { P.px(x + 3, yb - 3, skin); } else { P.px(x + 4, yb - 4, skin); } // strumming hand
      P.px(x + 3, yb - 2, pants);
      if (step) { P.px(x + 2, yb - 1, pants); P.px(x + 2, yb, pants); P.px(x + 4, yb, pants); }
      else { P.px(x + 3, yb - 1, pants); P.px(x + 3, yb, pants); P.px(x + 4, yb, pants); }
    }
  },
  {
    id: "food-vendor", name: "Food Vendor", biomes: ["city", "coast", "plains"],
    tags: ["person", "market", "work"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c8935c", cap = env.col("#d9a53a"), shirt = env.col("#c94a3a");
      var pants = env.col("#33384a"), cart = env.col("#c8c2b4"), cartD = env.col("#8a857a");
      var canopy = env.col("#e0b040"), canopy2 = env.col("#c04030"), wheel = "#2a2a2a", steam = "#d6dbdf";
      var step = (env.frame >> 2) & 1;
      // little cart out in front (to the left)
      P.rect(x, yb - 3, 3, 2, cart);
      P.px(x, yb - 3, cartD); P.px(x + 2, yb - 3, cartD);
      P.px(x, yb - 5, canopy); P.px(x + 1, yb - 5, canopy2); P.px(x + 2, yb - 5, canopy); // striped canopy
      P.px(x, yb - 4, cartD); P.px(x + 2, yb - 4, cartD);   // canopy posts
      P.px(x, yb, wheel); P.px(x + 2, yb, wheel);           // wheels
      if (step) { P.px(x + 1, yb - 6, steam); } else { P.px(x + 1, yb - 7, steam); } // steam puff
      // vendor tending it (behind, to the right)
      P.px(x + 3, yb - 6, cap); P.px(x + 4, yb - 6, cap);
      P.px(x + 4, yb - 5, skin);                            // head
      P.rect(x + 4, yb - 4, 1, 2, shirt);                   // torso
      P.px(x + 3, yb - 4, skin);                            // arm serving
      P.px(x + 4, yb - 2, pants);
      if (step) { P.px(x + 3, yb - 1, pants); P.px(x + 3, yb, pants); P.px(x + 5, yb, pants); }
      else { P.px(x + 4, yb - 1, pants); P.px(x + 4, yb, pants); P.px(x + 5, yb, pants); }
    }
  },
  {
    id: "market-seller", name: "Market Seller", biomes: ["city", "plains", "savanna", "jungle"],
    tags: ["person", "market", "work"], w: 5, h: 9, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#b07a44", cloth = env.col("#c85a9a"), wrap = env.col("#e0b83a");
      var basket = env.col("#b0803a"), basketD = env.col("#8a5f22");
      var fruit1 = env.col("#e0602a"), fruit2 = env.col("#3aa050");
      var step = (env.frame >> 2) & 1;
      // basket of produce balanced on the head
      P.rect(x + 1, yb - 8, 3, 2, basket);
      P.px(x + 1, yb - 8, basketD); P.px(x + 3, yb - 8, basketD);
      P.px(x + 2, yb - 9, fruit1); P.px(x + 1, yb - 9, fruit2); // produce piled up
      P.px(x + 2, yb - 6, skin);                          // head
      P.px(x + 3, yb - 7, skin);                          // arm steadying basket
      P.rect(x + 2, yb - 5, 1, 2, cloth);                 // torso
      P.px(x + 1, yb - 5, cloth);                         // shoulder
      P.rect(x + 1, yb - 3, 3, 1, wrap);                  // wrap skirt
      if (step) { P.px(x + 1, yb - 2, wrap); P.px(x + 3, yb - 1, wrap); P.px(x + 1, yb, skin); P.px(x + 3, yb, skin); }
      else { P.px(x + 2, yb - 2, wrap); P.px(x + 2, yb - 1, wrap); P.px(x + 2, yb, skin); P.px(x + 3, yb, skin); }
    }
  },
  {
    id: "tourist", name: "Tourist", biomes: ["city", "coast", "mountain", "forest"],
    tags: ["person", "tourist", "casual"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#d8a06a", hat = env.col("#e0d8b0"), hatB = env.col("#c8b884");
      var shirt = env.col("#3aa0c0"), shorts = env.col("#c88a3a");
      var pack = env.col("#c04030"), packD = env.col("#8a2c22"), cam = "#1a1a1e", lens = "#7a8a92", shoe = env.col("#2a2a2e");
      var step = (env.frame >> 2) & 1;
      P.rect(x + 1, yb - 7, 4, 1, hat);                   // sun-hat brim
      P.px(x + 2, yb - 8, hatB); P.px(x + 3, yb - 8, hatB); // crown
      P.px(x + 2, yb - 6, skin); P.px(x + 3, yb - 6, skin); // head
      P.rect(x, yb - 5, 1, 3, pack); P.px(x, yb - 5, packD); // backpack on the back
      P.px(x + 1, yb - 5, shirt); P.px(x + 2, yb - 5, shirt); P.px(x + 3, yb - 5, shirt);
      P.rect(x + 2, yb - 4, 2, 1, shirt);                 // torso
      P.px(x + 3, yb - 4, cam); P.px(x + 3, yb - 3, lens); // camera slung at chest
      P.px(x + 4, yb - 4, skin);                          // arm
      P.rect(x + 2, yb - 3, 2, 1, shorts);
      if (step) { P.px(x + 2, yb - 2, skin); P.px(x + 4, yb - 1, skin); P.px(x + 2, yb, shoe); P.px(x + 4, yb, shoe); }
      else { P.px(x + 3, yb - 2, skin); P.px(x + 3, yb - 1, skin); P.px(x + 3, yb, shoe); P.px(x + 4, yb, shoe); }
    }
  },
  {
    id: "skater", name: "Skater", biomes: ["city", "coast"],
    tags: ["person", "youth", "active"], w: 6, h: 9, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#cf9560", hair = env.col("#2a1a12"), shirt = env.col("#e04a6a");
      var pants = env.col("#3a4152"), deck = env.col("#2a8a9a"), wheel = "#e8e2d0";
      var fast = (env.frame >> 1) & 1;                    // quicker push cadence
      // skateboard
      P.rect(x, yb - 1, 6, 1, deck);
      P.px(x + 1, yb, wheel); P.px(x + 4, yb, wheel);
      // rider standing tall on the deck
      P.px(x + 3, yb - 8, hair); P.px(x + 4, yb - 8, hair);
      P.px(x + 3, yb - 7, skin);                          // head
      P.rect(x + 3, yb - 6, 1, 3, shirt);                 // torso
      if (fast) { P.px(x + 4, yb - 6, skin); P.px(x + 2, yb - 5, skin); } // arms swing with push
      else { P.px(x + 2, yb - 6, skin); P.px(x + 4, yb - 5, skin); }
      P.px(x + 3, yb - 3, pants); P.px(x + 3, yb - 2, pants);  // planted leg on deck
      if (fast) { P.px(x + 4, yb - 3, pants); P.px(x + 5, yb - 2, skin); } // back leg kicks out
      else { P.px(x + 2, yb - 3, pants); P.px(x + 1, yb - 2, skin); }      // foot swings under
    }
  },
  {
    id: "dancer", name: "Dancer", biomes: ["city", "coast", "plains", "savanna"],
    tags: ["person", "dance", "festive"], w: 5, h: 9, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c88a55", hair = env.col("#2a1a12"), dress = env.col("#d0409a"), dressD = env.col("#9a2a70");
      var step = (env.frame >> 2) & 1;
      P.px(x + 2, yb - 7, hair); P.px(x + 3, yb - 7, hair);
      P.px(x + 2, yb - 6, skin);                          // head
      // arms thrown up mid-move, alternating side
      if (step) { P.px(x + 1, yb - 7, skin); P.px(x, yb - 8, skin); P.px(x + 3, yb - 5, skin); }
      else { P.px(x + 3, yb - 7, skin); P.px(x + 4, yb - 8, skin); P.px(x + 1, yb - 5, skin); }
      P.rect(x + 2, yb - 5, 1, 2, dress);                 // torso
      // flared skirt swings with the step
      if (step) { P.px(x + 1, yb - 3, dress); P.rect(x + 1, yb - 2, 2, 1, dressD); }
      else { P.px(x + 3, yb - 3, dress); P.rect(x + 2, yb - 2, 2, 1, dressD); }
      if (step) { P.px(x + 1, yb - 1, skin); P.px(x + 1, yb, skin); P.px(x + 3, yb, skin); }
      else { P.px(x + 3, yb - 1, skin); P.px(x + 3, yb, skin); P.px(x + 1, yb, skin); }
    }
  },
  {
    id: "fisher", name: "Fisher", biomes: ["coast", "lake", "wetland"],
    tags: ["person", "water", "work"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#cf9560", hat = env.col("#c8a83a"), vest = env.col("#3a6a4a");
      var pants = env.col("#4a4f5a"), rod = env.col("#8a6a3a"), line = "#cfd6da", boot = env.col("#2a2a2e");
      var step = (env.frame >> 2) & 1;
      // rod slung over the shoulder: butt at the hand, tip high-back
      P.line(x + 4, yb - 4, x, yb - 8, rod);
      P.px(x, yb - 8, line);                              // rod tip
      P.line(x, yb - 8, x + 1, yb - 6, line);             // trailing line
      P.px(x + 1, yb - 7, hat); P.px(x + 2, yb - 7, hat); P.px(x + 3, yb - 7, hat); // bucket hat
      P.px(x + 2, yb - 6, skin);                          // head
      P.rect(x + 2, yb - 5, 1, 2, vest);                  // torso
      P.px(x + 4, yb - 4, skin);                          // hand gripping the rod
      P.px(x + 3, yb - 5, vest);                          // shoulder the rod rests on
      P.px(x + 2, yb - 3, pants);
      if (step) { P.px(x + 1, yb - 2, pants); P.px(x + 3, yb - 1, pants); P.px(x + 1, yb, boot); P.px(x + 3, yb, boot); }
      else { P.px(x + 2, yb - 2, pants); P.px(x + 2, yb - 1, pants); P.px(x + 2, yb, boot); P.px(x + 3, yb, boot); }
    }
  },
  {
    id: "shepherd", name: "Shepherd", biomes: ["plains", "savanna", "mountain", "tundra"],
    tags: ["person", "rural", "pastoral"], w: 5, h: 9, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c88a55", cloak = env.col("#7a6a4a"), tunic = env.col("#a8683a");
      var staff = env.col("#8a6a3a");
      var step = (env.frame >> 2) & 1;
      // tall crook staff planted at the front hand
      P.line(x + 4, yb, x + 4, yb - 8, staff);
      P.px(x + 3, yb - 8, staff); P.px(x + 3, yb - 9, staff); P.px(x + 4, yb - 9, staff); // crook hook
      // head-cloth + face
      P.rect(x + 1, yb - 8, 2, 1, cloak);
      P.px(x + 1, yb - 7, cloak); P.px(x + 2, yb - 7, skin);
      P.px(x + 2, yb - 6, skin);                          // face
      P.px(x + 1, yb - 6, cloak);                         // shoulder cloth
      P.rect(x + 1, yb - 5, 2, 2, tunic);                 // robe torso
      P.px(x + 3, yb - 5, skin);                          // hand to staff
      P.rect(x + 1, yb - 3, 2, 1, cloak);                 // robe hem
      if (step) { P.px(x + 1, yb - 2, tunic); P.px(x + 2, yb - 1, tunic); P.px(x + 1, yb, skin); P.px(x + 2, yb, skin); }
      else { P.px(x + 2, yb - 2, tunic); P.px(x + 2, yb - 1, tunic); P.px(x + 2, yb, skin); P.px(x + 3, yb, skin); }
    }
  },
  {
    id: "street-sweeper", name: "Street Sweeper", biomes: ["city"],
    tags: ["person", "work", "civic"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c8935c", cap = env.col("#d98a2a"), vest = env.col("#e0a020"), vestS = "#f0e8d0";
      var pants = env.col("#3a5a4a"), handle = env.col("#8a6a3a"), bristle = env.col("#c8a24a"), boot = env.col("#2a2a2e");
      var step = (env.frame >> 2) & 1;
      // broom: handle from the hands down-forward to bristles on the ground
      P.line(x + 3, yb - 4, x + 5, yb - 1, handle);
      P.rect(x + 4, yb, 2, 1, bristle);                   // bristle head
      if (step) { P.px(x + 5, yb - 1, bristle); }         // sweep sway
      P.px(x + 1, yb - 7, cap); P.px(x + 2, yb - 7, cap);
      P.px(x + 2, yb - 6, skin);                          // head
      P.px(x + 1, yb - 5, vest); P.px(x + 2, yb - 5, vest);
      P.px(x + 1, yb - 4, vestS);                         // reflective stripe
      P.rect(x + 2, yb - 4, 1, 2, vest);                  // torso
      P.px(x + 3, yb - 4, skin);                          // hands on the broom
      P.px(x + 2, yb - 2, pants);
      if (step) { P.px(x + 1, yb - 1, pants); P.px(x + 1, yb, boot); P.px(x + 3, yb, boot); }
      else { P.px(x + 2, yb - 1, pants); P.px(x + 2, yb, boot); P.px(x + 3, yb, boot); }
    }
  },
  {
    id: "balloon-seller", name: "Balloon Seller", biomes: ["city", "coast", "plains"],
    tags: ["person", "market", "festive"], w: 6, h: 10, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c8935c", hair = env.col("#2a1a12"), shirt = env.col("#c94a3a"), pants = env.col("#3a3f4a");
      var str = env.col("#b0b0b0");
      var b1 = env.col("#e04a5a"), b2 = env.col("#3aa0c0"), b3 = env.col("#e0a83a"), b4 = env.col("#c060b0");
      var step = (env.frame >> 2) & 1, sw = step ? 1 : 0;
      // strings up to the bunch of balloons
      P.line(x + 2, yb - 4, x + 3, yb - 8, str);
      P.disc(x + 3, yb - 9, 1, b1);
      P.disc(x + 4, yb - 8, 1, b2);
      P.disc(x + 2, yb - 8, 1, b3);
      P.px(x + 3 + sw, yb - 10, b4);                      // top balloon bobs on the wind
      // seller below, arm raised to the strings
      P.px(x + 1, yb - 6, hair);
      P.px(x + 1, yb - 5, skin);                          // head
      P.rect(x + 1, yb - 4, 1, 2, shirt);                 // torso
      P.px(x + 2, yb - 4, skin);                          // raised arm
      P.px(x + 1, yb - 2, pants);
      if (step) { P.px(x, yb - 1, pants); P.px(x, yb, pants); P.px(x + 2, yb, pants); }
      else { P.px(x + 1, yb - 1, pants); P.px(x + 1, yb, pants); P.px(x + 2, yb, pants); }
    }
  },
  {
    id: "commuter", name: "Commuter", biomes: ["city"],
    tags: ["person", "commute", "work"], w: 6, h: 9, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#d8a06a", hair = env.col("#2a2018"), coat = env.col("#3a4a5a");
      var scarf = env.col("#c0403a"), caseC = env.col("#5a3a22"), caseH = "#2a1a10", shoe = env.col("#2a2a2e");
      var umb = env.col("#2a3a6a"), umbR = env.col("#e8e2d0");
      var step = (env.frame >> 2) & 1;
      P.px(x + 2, yb - 7, hair); P.px(x + 3, yb - 7, hair);
      P.px(x + 2, yb - 6, skin);                          // head
      P.px(x + 2, yb - 5, scarf);                         // scarf
      P.rect(x + 2, yb - 4, 1, 2, coat);                  // coat torso
      P.px(x + 1, yb - 4, coat);                          // back arm
      P.px(x + 3, yb - 4, skin);                          // hand with case
      P.rect(x + 3, yb - 3, 2, 2, caseC);                 // briefcase
      P.px(x + 3, yb - 3, caseH);                         // clasp
      P.px(x + 2, yb - 2, coat);
      if (step) { P.px(x + 1, yb - 1, coat); P.px(x + 1, yb, shoe); P.px(x + 3, yb, shoe); }
      else { P.px(x + 2, yb - 1, coat); P.px(x + 2, yb, shoe); P.px(x + 3, yb, shoe); }
      // umbrella comes out only in bad weather
      if (env.rough) {
        P.line(x + 2, yb - 6, x + 2, yb - 8, umbR);       // shaft over the head
        P.rect(x, yb - 9, 5, 1, umb);                     // canopy
        P.px(x, yb - 8, umb); P.px(x + 4, yb - 8, umb);   // canopy tips
        P.px(x + 2, yb - 8, umbR);                        // ferrule
      }
    }
  },
  {
    id: "gardener", name: "Gardener", biomes: ["farmland", "city", "plains", "forest"],
    tags: ["person", "garden", "work"], w: 7, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c8894f", hat = env.col("#d9b84a"), shirt = env.col("#4a8a4a");
      var apron = env.col("#7a5a3a"), pants = env.col("#5a6a4a"), can = env.col("#5a9aa8"), canD = env.col("#3a6a76"), water = "#9ad0e0";
      var step = (env.frame >> 2) & 1;
      P.rect(x + 1, yb - 7, 3, 1, hat);                   // sun-hat brim
      P.px(x + 2, yb - 6, skin);                          // head
      P.px(x + 1, yb - 5, shirt); P.px(x + 2, yb - 5, shirt);
      P.rect(x + 2, yb - 4, 1, 2, apron);                 // apron torso
      P.px(x + 3, yb - 4, skin);                          // arm to the can
      // watering can, spout forward
      P.rect(x + 4, yb - 4, 2, 2, can);                   // can body
      P.px(x + 3, yb - 5, canD); P.px(x + 4, yb - 5, canD); // top handle
      P.px(x + 6, yb - 4, canD);                          // spout tip
      // sprinkling water
      if (step) { P.px(x + 6, yb - 3, water); P.px(x + 6, yb - 1, water); }
      else { P.px(x + 6, yb - 2, water); P.px(x + 5, yb, water); }
      P.px(x + 2, yb - 2, pants);
      if (step) { P.px(x + 1, yb - 1, pants); P.px(x + 1, yb, pants); P.px(x + 3, yb, pants); }
      else { P.px(x + 2, yb - 1, pants); P.px(x + 2, yb, pants); P.px(x + 3, yb, pants); }
    }
  },
  {
    id: "busker-drummer", name: "Bucket Drummer", biomes: ["city", "coast"],
    tags: ["person", "music", "busker"], w: 6, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#b07a44", hair = env.col("#241a12"), shirt = env.col("#c85a3a");
      var pants = env.col("#3a3f4a"), bucket = env.col("#c8c2b4"), bucketD = env.col("#8a857a"), stick = env.col("#caa46a"), boot = env.col("#2a2a2e");
      var hit = (env.frame >> 1) & 1;                     // quick drumming beat
      // upturned bucket drum out front
      P.rect(x, yb - 2, 3, 2, bucket);
      P.px(x, yb - 2, bucketD); P.px(x + 2, yb - 2, bucketD);
      P.rect(x, yb - 3, 3, 1, bucketD);                   // rim
      // drummer behind the drum
      P.px(x + 3, yb - 7, hair); P.px(x + 4, yb - 7, hair);
      P.px(x + 4, yb - 6, skin);                          // head
      P.rect(x + 4, yb - 5, 1, 2, shirt);                 // torso
      // sticks alternate: one striking the drum, one raised
      if (hit) {
        P.px(x + 3, yb - 4, skin); P.px(x + 2, yb - 3, stick); P.px(x + 1, yb - 3, stick);
        P.px(x + 5, yb - 5, skin); P.px(x + 5, yb - 6, stick);
      } else {
        P.px(x + 3, yb - 5, skin); P.px(x + 2, yb - 6, stick); P.px(x + 1, yb - 6, stick);
        P.px(x + 5, yb - 4, skin); P.px(x + 5, yb - 3, stick);
      }
      P.px(x + 4, yb - 2, pants);
      P.px(x + 3, yb - 1, pants); P.px(x + 4, yb - 1, pants);
      P.px(x + 3, yb, boot); P.px(x + 4, yb, boot);       // feet tapping in place
    }
  }
];
