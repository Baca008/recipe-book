import { useState, useEffect, useMemo } from "react";
import { Search, Star, Trash2, Plus, X, Clock, Users, ChevronLeft, AlertCircle } from "lucide-react";

const STORAGE_KEY = "thomas-recipe-book-overrides";

// First batch, rebuilt with verified ingredients/steps from the original conversation.
// More recipes will be added incrementally — see the note in the empty-category state.
const DEFAULT_RECIPES = [
  {
    id: "demo-dakgalbi",
    name: "Dakgalbi (Korean Spicy Chicken Stir-Fry)",
    category: "Dinner",
    servings: 4,
    prepTime: "15 min + marinate",
    cookTime: "20 min",
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs, cut into bite-sized pieces" },
      { amount: 3, unit: "tbsp", name: "gochujang (Korean red chili paste)" },
      { amount: 1, unit: "tbsp", name: "gochugaru (Korean red pepper flakes)" },
      { amount: 0.5, unit: "tsp", name: "curry powder" },
      { amount: 2, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tbsp", name: "mirin or rice wine" },
      { amount: 1, unit: "tbsp", name: "brown sugar" },
      { amount: 1, unit: "tbsp", name: "sesame oil" },
      { amount: 4, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "fresh ginger, grated" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "cup", name: "Korean rice cakes (tteokbokki tteok), soaked 10 min" },
      { amount: 1, unit: null, name: "small Korean sweet potato, cut into wedges" },
      { amount: 2, unit: "cup", name: "green cabbage, roughly chopped" },
      { amount: 0.5, unit: null, name: "yellow onion, sliced" },
      { amount: 0.5, unit: "cup", name: "perilla (kkaennip) or basil leaves" },
      { amount: 2, unit: "tbsp", name: "neutral oil" },
      { amount: 0.5, unit: "cup", name: "shredded mozzarella, optional for cheese dakgalbi" },
    ],
    steps: [
      { title: "Marinate", content: "Mix {0001}, {0002}, {0003}, {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, and {0010} in a bowl. Add the chicken and coat well. Marinate at least 30 minutes — 1 hour is better.", timer: null },
      { title: "Soak rice cakes", content: "Soak {0011} in water for 10 minutes, then drain.", timer: 600 },
      { title: "Start the vegetables", content: "Heat {0016} in a large cast iron skillet over medium-high. Add {0012}, {0014}, {0013}, and the drained rice cakes. Stir-fry 3–4 minutes until slightly softened.", timer: 240 },
      { title: "Cook the chicken", content: "Add the marinated chicken on top and stir everything together. Cook on medium-high for 6–8 minutes, stirring often, until the chicken is cooked through and rice cakes are tender. Add a splash of water if the pan looks dry.", timer: 480 },
      { title: "Finish", content: "Stir in {0015} for the last minute. If making cheese dakgalbi, scatter {0017} over the top, cover, and let it melt for 1–2 minutes before serving straight from the skillet.", timer: 90 },
    ],
    notes: "This is a first-batch rebuild — verified against the original conversation but worth double-checking your own notes on marinate time, since that detail can vary by taste.",
  },
  {
    id: "demo-lemongrass-chicken",
    name: "Gà Nướng Xả (Vietnamese Lemongrass Grilled Chicken)",
    category: "Dinner",
    servings: 4,
    prepTime: "15 min + marinate",
    cookTime: "15 min",
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 3, unit: null, name: "lemongrass stalks, pale parts only, finely minced" },
      { amount: 4, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: null, name: "shallot, minced" },
      { amount: 2, unit: "tbsp", name: "fish sauce" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1.5, unit: "tbsp", name: "honey or brown sugar" },
      { amount: 1, unit: "tbsp", name: "neutral oil" },
      { amount: 0.5, unit: "tsp", name: "Chinese five-spice powder" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "tsp", name: "chili garlic sauce, optional" },
    ],
    steps: [
      { title: "Prep the lemongrass", content: "Peel off the tough outer layers of {0001} and trim the tops, keeping only the pale lower third. Mince as finely as possible — almost a paste. A food processor helps: pre-slice into rounds, then pulse with {0002} and {0003}.", timer: null },
      { title: "Make the marinade", content: "Combine the lemongrass-garlic-shallot paste with {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, and {0010} if using. Mix well.", timer: null },
      { title: "Marinate", content: "Add the chicken and coat thoroughly. Marinate in the fridge at least 2 hours — overnight is ideal, since the sugar is what caramelizes into the signature char.", timer: 7200 },
      { title: "Grill", content: "Preheat grill to medium heat — not high, since the sugar and lemongrass burn easily. Grill the chicken 5–7 minutes per side, until charred at the edges and cooked through (internal temp 165°F).", timer: 720 },
      { title: "Rest and serve", content: "Rest 5 minutes, then serve over rice or vermicelli with pickled carrots and cucumber.", timer: 300 },
    ],
    notes: "Grill time in the last step is a reasonable estimate for this cut and marinade — I wasn't able to verify the exact original wording, so check for doneness with a thermometer rather than going by time alone.",
  },
  {
    id: "demo-okonomiyaki",
    name: "Osaka-Style Okonomiyaki (Japanese Savory Pancake)",
    category: "Dinner",
    servings: 2,
    prepTime: "15 min",
    cookTime: "20 min",
    ingredients: [
      { amount: 0.75, unit: "cup", name: "all-purpose flour" },
      { amount: 0.5, unit: "tsp", name: "baking powder" },
      { amount: 0.5, unit: "tsp", name: "salt" },
      { amount: 0.75, unit: "cup", name: "dashi stock (or chicken broth, or water in a pinch)" },
      { amount: 2, unit: null, name: "large eggs" },
      { amount: 1, unit: "tsp", name: "potato starch, mixed with 1 tbsp water" },
      { amount: 4, unit: "cup", name: "green cabbage, finely shredded and dried well" },
      { amount: 3, unit: null, name: "green onions, sliced" },
      { amount: 4, unit: null, name: "slices pork belly or bacon (or shrimp, or cooked chicken)" },
      { amount: 2, unit: "tbsp", name: "neutral oil, for cooking" },
      { amount: 4, unit: "tbsp", name: "Worcestershire sauce, for the sauce" },
      { amount: 2, unit: "tbsp", name: "ketchup, for the sauce" },
      { amount: 1, unit: "tbsp", name: "oyster sauce, for the sauce" },
      { amount: 1, unit: "tsp", name: "sugar, for the sauce" },
      { amount: 2, unit: "tbsp", name: "Japanese Kewpie mayo, for serving" },
      { amount: 1, unit: "tbsp", name: "aonori (dried seaweed flakes), for serving" },
      { amount: 2, unit: "tbsp", name: "bonito flakes (katsuobushi), for serving" },
    ],
    steps: [
      { title: "Make the sauce", content: "Whisk {0011}, {0012}, {0013}, and {0014} together until the sugar dissolves. Set aside — this can be made ahead and keeps for weeks in the fridge.", timer: null },
      { title: "Make the batter", content: "Whisk {0001}, {0002}, {0003}, {0004}, {0005}, and the {0006} slurry together until just combined — a few lumps are fine. Rest the batter 10 minutes.", timer: 600 },
      { title: "Dry the cabbage", content: "Dry {0007} very well with a salad spinner or paper towels — wet cabbage makes the pancake soggy.", timer: null },
      { title: "Fold and cook", content: "Fold the cabbage and {0008} into the batter. Heat {0010} in a nonstick pan or griddle over medium heat. Pour the batter in a mound about 1 inch thick and lay {0009} over the top. Cook 6–8 minutes until the bottom is golden.", timer: 480 },
      { title: "Flip and finish", content: "Flip carefully (a plate helps) and cook another 6–8 minutes on the second side, pressing gently, until cooked through.", timer: 480 },
      { title: "Top and serve", content: "Slide onto a plate. Spread the okonomiyaki sauce on top, drizzle with {0015} in a crosshatch, then sprinkle with {0016} and {0017} — the bonito flakes will visibly move from the rising heat.", timer: null },
    ],
    notes: "Store-bought Otafuku sauce is very close to homemade if you'd rather buy it — H-Mart carries it.",
  },
  {
    id: "demo-halal-guys-chicken",
    name: "Halal Guys Style Chicken & White Sauce",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "10 min",
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs, cut into 1-inch pieces" },
      { amount: 3, unit: "tbsp", name: "olive oil, for the marinade" },
      { amount: 2, unit: "tbsp", name: "lemon juice" },
      { amount: 1, unit: "tbsp", name: "white vinegar" },
      { amount: 5, unit: null, name: "garlic cloves, minced" },
      { amount: 2, unit: "tsp", name: "ground cumin" },
      { amount: 2, unit: "tsp", name: "ground coriander" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: "tsp", name: "ground turmeric" },
      { amount: 0.5, unit: "tsp", name: "smoked paprika" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "cup", name: "mayonnaise, for the white sauce" },
      { amount: 2, unit: "tbsp", name: "plain Greek yogurt, for the white sauce" },
      { amount: 1, unit: "tbsp", name: "white vinegar, for the white sauce" },
      { amount: 1, unit: "tsp", name: "lemon juice, for the white sauce" },
      { amount: 1, unit: "tsp", name: "sugar, for the white sauce" },
      { amount: 0.25, unit: "tsp", name: "garlic powder, for the white sauce" },
      { amount: 1, unit: null, name: "shredded lettuce, chopped tomato, and warm pita, for serving" },
    ],
    steps: [
      { title: "Marinate", content: "Combine {0002}, {0003}, {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, {0010}, {0011}, and {0012} in a bowl. Add the chicken and toss to coat thoroughly. Cover and marinate at least 1 hour — overnight (up to 24 hours) is best.", timer: 3600 },
      { title: "Make the white sauce", content: "Whisk {0013}, {0014}, {0015}, {0016}, {0017}, and {0018} together until smooth. Refrigerate until ready to serve.", timer: null },
      { title: "Cook the chicken", content: "Heat a skillet or grill pan over high heat. Cook the chicken in a single layer, letting it sit undisturbed for a couple minutes at a time rather than stirring constantly, until charred at the edges and cooked through, about 8–10 minutes total.", timer: 600 },
      { title: "Assemble", content: "Serve over rice with {0019}, drizzled generously with the white sauce.", timer: null },
    ],
    notes: "Pairs directly with a turmeric basmati rice side — I'll add that recipe back in once I've confirmed the exact rice-to-broth ratio from the original conversation rather than guessing at it.",
  },
  {
    id: "demo-sigeumchi-namul",
    name: "Sigeumchi Namul (Korean Spinach Banchan)",
    category: "Sides",
    servings: 4,
    prepTime: "5 min",
    cookTime: "5 min",
    ingredients: [
      { amount: 10, unit: "oz", name: "fresh spinach, roots trimmed and washed" },
      { amount: 1, unit: "tsp", name: "salt, for blanching water" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tbsp", name: "toasted sesame oil" },
      { amount: 2, unit: null, name: "garlic cloves, minced" },
      { amount: 2, unit: null, name: "green onions, thinly sliced" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds" },
    ],
    steps: [
      { title: "Blanch the spinach", content: "Bring a large pot of water to a boil with {0002}. Blanch the spinach for exactly 30 seconds, stirring gently.", timer: 30 },
      { title: "Shock and drain", content: "Drain immediately and rinse under cold running water 2–3 times to stop cooking. Squeeze out excess water firmly with your hands, then cut into bite-sized pieces.", timer: null },
      { title: "Season", content: "In a bowl combine {0003}, {0004}, {0005}, and {0006}. Add the spinach and mix thoroughly by hand until every leaf is coated.", timer: null },
      { title: "Serve", content: "Transfer to a serving dish and sprinkle with {0007}. Serve at room temperature or chilled.", timer: null },
    ],
    notes: "Don't over-blanch — 30 seconds keeps it vibrant green and slightly crisp. Keeps 4 days in the fridge. For a spicier version, add 1 tsp gochugaru.",
  },
  {
    id: "demo-gamja-jorim",
    name: "Gamja Jorim (Korean Braised Potatoes)",
    category: "Sides",
    servings: 4,
    prepTime: "10 min",
    cookTime: "15 min",
    ingredients: [
      { amount: 1.5, unit: "lb", name: "Yukon Gold or baby potatoes, cut into 1-inch pieces" },
      { amount: 1, unit: "tbsp", name: "neutral oil" },
      { amount: 3, unit: "tbsp", name: "soy sauce" },
      { amount: 2, unit: "tbsp", name: "mirin" },
      { amount: 1, unit: "tbsp", name: "sugar" },
      { amount: 0.5, unit: "cup", name: "water" },
      { amount: 3, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds" },
      { amount: 2, unit: null, name: "green onions, sliced, for garnish" },
    ],
    steps: [
      { title: "Prep potatoes", content: "Rinse potato pieces in cold water to remove excess starch. Pat dry.", timer: null },
      { title: "Mix the sauce", content: "In a small bowl, mix {0003}, {0004}, {0005}, {0006}, and {0007} until sugar dissolves.", timer: null },
      { title: "Sear", content: "Heat {0002} in a nonstick pan over medium-high heat. Add potatoes and sauté 4–5 minutes, stirring occasionally, until golden on the edges.", timer: 300 },
      { title: "Braise", content: "Pour in the sauce and simmer uncovered 7–8 minutes, stirring occasionally, until potatoes are fork-tender and the sauce has thickened into a sticky glaze. Add a splash of water if it reduces too fast.", timer: 480 },
      { title: "Finish", content: "Stir in {0008}. Transfer to a plate and garnish with {0009} and {0010}. Serve warm or at room temperature.", timer: null },
    ],
    notes: "Yukon Gold and baby potatoes hold their shape best — avoid russets unless soaked first to draw out starch. For a spicy version, add 1–2 tsp gochugaru to the sauce. Stores 3–4 days in the fridge.",
  },
  {
    id: "demo-mayak-gyeran",
    name: "Mayak Gyeran (Korean Marinated Eggs)",
    category: "Sides",
    servings: 6,
    prepTime: "15 min",
    cookTime: "6 min + overnight",
    ingredients: [
      { amount: 6, unit: null, name: "large eggs, room temperature" },
      { amount: 1, unit: "tsp", name: "white vinegar, for boiling" },
      { amount: 0.5, unit: "cup", name: "soy sauce" },
      { amount: 0.5, unit: "cup", name: "water" },
      { amount: 3, unit: "tbsp", name: "honey (or rice syrup)" },
      { amount: 3, unit: null, name: "garlic cloves, minced" },
      { amount: 3, unit: null, name: "green onions, sliced" },
      { amount: 1, unit: null, name: "red chili pepper, thinly sliced" },
      { amount: 1, unit: null, name: "green chili pepper, thinly sliced" },
      { amount: 1, unit: "tbsp", name: "toasted sesame seeds" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil, for serving" },
    ],
    steps: [
      { title: "Soft boil", content: "Fill a pot with enough water to cover the eggs. Add {0002} and bring to a boil. Carefully lower in the eggs and simmer for exactly 6 minutes for a jammy yolk.", timer: 360 },
      { title: "Shock and peel", content: "Immediately transfer eggs to a bowl of ice water and let sit at least 10 minutes. Peel carefully.", timer: 600 },
      { title: "Make the marinade", content: "In a container or jar, combine {0003}, {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, and {0010}. Stir until honey is dissolved.", timer: null },
      { title: "Marinate", content: "Place peeled eggs into the container, fully submerged (weigh down with plastic wrap if needed). Cover and refrigerate overnight, minimum 6 hours.", timer: null },
      { title: "Serve", content: "Serve over hot steamed rice with a spoonful of marinade on top. Drizzle with {0011}. Cut in half to reveal the jammy yolk.", timer: null },
    ],
    notes: "Mayak means \"drug\" in Korean — named for how addictive these are. The marinade can be reused for a second batch within the same week. Keeps 3–5 days in the fridge. For hard-boiled eggs, cook 10 minutes instead.",
  },
  {
    id: "demo-kkakdugi",
    name: "Kkakdugi (Korean Cubed Radish Kimchi)",
    category: "Sides",
    servings: 8,
    prepTime: "15 min + 1 hr salt",
    cookTime: "1–2 days ferment",
    ingredients: [
      { amount: 2, unit: "lb", name: "Korean radish (mu) or daikon, peeled and cut into 3/4-inch cubes" },
      { amount: 2.5, unit: "tbsp", name: "coarse sea salt (or 2 tbsp kosher salt)" },
      { amount: 1, unit: "tsp", name: "sugar, for salting" },
      { amount: 4, unit: "tbsp", name: "gochugaru (Korean red pepper flakes)" },
      { amount: 4, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "fresh ginger, grated" },
      { amount: 2, unit: "tbsp", name: "fish sauce (or soy sauce for a vegan version)" },
      { amount: 1, unit: "tsp", name: "sugar, for seasoning" },
      { amount: 3, unit: null, name: "green onions, cut into 1-inch pieces" },
    ],
    steps: [
      { title: "Salt the radish", content: "Toss radish cubes with {0002} and {0003} in a large bowl. Let sit at room temperature 1 hour, tossing once halfway. The radish will release a lot of liquid.", timer: 3600 },
      { title: "Drain", content: "Drain the liquid — do not rinse. The radish should be slightly softened but still firm.", timer: null },
      { title: "Season", content: "Wearing gloves, add {0004}, {0005}, {0006}, {0007}, and {0008} to the radish. Mix thoroughly by hand until every cube is evenly coated red.", timer: null },
      { title: "Add aromatics", content: "Fold in {0009} gently.", timer: null },
      { title: "Pack and ferment", content: "Pack tightly into a clean glass jar, pressing down to remove air pockets, leaving 1 inch of headspace. Leave at room temperature 1–2 days (taste after 24 hours), then seal and refrigerate.", timer: null },
    ],
    notes: "Korean radish (mu) is shorter, rounder, and denser than daikon — daikon is a near-perfect substitute, found at H-Mart. Always wear gloves, gochugaru stains everything. Room temp ferment: 1 day in summer, 2 in winter. Tastes best after 1–2 weeks in the fridge and keeps for months.",
  },
  {
    id: "demo-chicken-mu",
    name: "Chicken-Mu (Korean Sweet Pickled Daikon)",
    category: "Sides",
    servings: 8,
    prepTime: "10 min",
    cookTime: "8 hrs chill",
    ingredients: [
      { amount: 1, unit: "lb", name: "daikon radish, peeled and cut into 1/2-inch cubes" },
      { amount: 0.5, unit: "cup", name: "white sugar" },
      { amount: 0.5, unit: "cup", name: "white vinegar" },
      { amount: 0.5, unit: "cup", name: "water" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
    ],
    steps: [
      { title: "Cut and pack", content: "Peel and cut daikon into uniform 1/2-inch cubes. Pack into a clean mason jar or airtight container.", timer: null },
      { title: "Make the brine", content: "Whisk {0002}, {0003}, {0004}, and {0005} together until fully dissolved — no heating needed.", timer: null },
      { title: "Brine", content: "Pour brine over the daikon until fully submerged. Seal with the lid.", timer: null },
      { title: "Chill", content: "Refrigerate at least 8 hours before serving — the longer it sits, the more pickled it becomes. Best at 24–48 hours.", timer: 28800 },
    ],
    notes: "This is the sweet, tangy white daikon served with Korean fried chicken — no spice, no fermentation. Make sure the radish is fully submerged in the brine. For a less sweet version, reduce sugar to 1/3 cup. Keeps up to 2 weeks in the fridge.",
  },
  {
    id: "demo-eomuk-bokkeum",
    name: "Eomuk Bokkeum (Korean Fish Cake Stir-Fry)",
    category: "Sides",
    servings: 4,
    prepTime: "5 min",
    cookTime: "10 min",
    ingredients: [
      { amount: 8, unit: "oz", name: "Korean fish cake sheets (eomuk/odeng), frozen section at H-Mart" },
      { amount: 0.5, unit: null, name: "yellow onion, thinly sliced" },
      { amount: 1, unit: null, name: "carrot, cut into matchsticks" },
      { amount: 3, unit: null, name: "green onions, cut into 1-inch pieces" },
      { amount: 3, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tbsp", name: "neutral oil" },
      { amount: 2, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tbsp", name: "mirin or rice wine" },
      { amount: 1, unit: "tsp", name: "sugar" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds" },
      { amount: 2, unit: "tbsp", name: "water" },
      { amount: 1, unit: "tsp", name: "gochugaru or gochujang, optional for a spicy version" },
    ],
    steps: [
      { title: "Blanch the fish cake", content: "Briefly blanch fish cake sheets in boiling water for 30 seconds. Drain, cool, and cut into thin strips.", timer: 30 },
      { title: "Mix the sauce", content: "In a small bowl, mix {0007}, {0008}, {0009}, and {0010} until sugar dissolves.", timer: null },
      { title: "Stir-fry vegetables", content: "Heat {0006} in a skillet over medium-high heat. Add {0005}, {0002}, and {0003}. Stir-fry 1–2 minutes until slightly softened.", timer: 120 },
      { title: "Add fish cake", content: "Add fish cake and {0004}. Stir-fry 1–2 minutes.", timer: 120 },
      { title: "Sauce and finish", content: "Pour the sauce over everything and add {0012} directly to the pan — the water helps the sauce absorb evenly. Stir quickly and cook about 1 minute until absorbed and everything is well coated. Sprinkle with {0011} and serve.", timer: 60 },
    ],
    notes: "For a spicy version, stir 1 tsp gochugaru or a spoonful of gochujang into the sauce. Find fish cake sheets in the frozen section at H-Mart or 99 Ranch.",
  },
  {
    id: "demo-hobak-namul",
    name: "Hobak Namul (Korean Stir-Fried Zucchini Banchan)",
    category: "Sides",
    servings: 4,
    prepTime: "10 min",
    cookTime: "8 min",
    ingredients: [
      { amount: 2, unit: null, name: "medium zucchini (Korean aehobak if available, regular works great)" },
      { amount: 0.5, unit: "tsp", name: "kosher salt, for drawing moisture" },
      { amount: 4, unit: null, name: "garlic cloves, minced" },
      { amount: 2, unit: null, name: "green onions, sliced, white and green parts separated" },
      { amount: 1, unit: "tsp", name: "neutral oil" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 0.5, unit: "tsp", name: "gochugaru, optional for heat" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds" },
      { amount: 1, unit: "tsp", name: "soy sauce or fish sauce" },
    ],
    steps: [
      { title: "Salt the zucchini", content: "Slice zucchini into thin half-moons, about 1/4 inch thick. Toss with {0002} and let sit 5–10 minutes to draw out moisture. Pat dry with paper towels.", timer: 600 },
      { title: "Sear", content: "Heat {0005} in a skillet over medium-high heat. Add zucchini and the white parts of {0004}. Stir-fry 2–3 minutes until slightly softened and lightly colored.", timer: 180 },
      { title: "Season", content: "Add {0003} and {0007} if using. Stir-fry 30 seconds until fragrant.", timer: 30 },
      { title: "Finish", content: "Add {0009} and toss to coat. Cook 1–2 more minutes until tender but still with a slight bite — don't overcook. Remove from heat, drizzle with {0006}, and top with the green parts of the onion and {0008}.", timer: 120 },
    ],
    notes: "I wasn't able to fully verify the very last plating detail from the original conversation, so the finishing step above is a reasonable standard technique rather than a word-for-word match — worth a quick taste-and-adjust the first time you make it.",
  },
  {
    id: "demo-gochujang-chicken",
    name: "Gochujang Chicken Thighs",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "15 min",
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 3, unit: "tbsp", name: "gochujang (Korean red chili paste)" },
      { amount: 1, unit: "tbsp", name: "gochugaru (Korean red pepper flakes)" },
      { amount: 2, unit: "tbsp", name: "soy sauce" },
      { amount: 2, unit: "tbsp", name: "brown sugar" },
      { amount: 1, unit: "tbsp", name: "toasted sesame oil" },
      { amount: 1, unit: "tbsp", name: "rice vinegar" },
      { amount: 4, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "fresh ginger, grated" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "tbsp", name: "neutral oil, for cooking" },
      { amount: 2, unit: null, name: "green onions, sliced, for garnish" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds, for garnish" },
    ],
    steps: [
      { title: "Make the marinade", content: "Combine {0002}, {0003}, {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, and {0010} in a bowl.", timer: null },
      { title: "Marinate", content: "Add the chicken and coat thoroughly. Marinate at least 30 minutes in the fridge — up to 8 hours for deeper flavor.", timer: 1800 },
      { title: "Sear", content: "Heat {0011} in a cast iron or heavy skillet over medium-high heat. Add chicken and cook undisturbed 4–5 minutes until a caramelized crust forms. Flip and cook another 4–5 minutes until 165°F internal.", timer: 540 },
      { title: "Serve", content: "Garnish with {0012} and {0013}. Serve over rice.", timer: null },
    ],
    notes: "The sugar in gochujang caramelizes fast — don't rush the flip, let the crust release naturally. Can also be grilled (4–5 min per side at 400°F) or roasted at 425°F. Freezes well in the marinade for up to 2 months.",
  },
  {
    id: "demo-dak-bulgogi",
    name: "Dak Bulgogi (Korean BBQ Chicken)",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "10 min",
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 3, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tbsp", name: "mirin" },
      { amount: 1, unit: "tbsp", name: "brown sugar" },
      { amount: 1, unit: "tbsp", name: "honey" },
      { amount: 1, unit: "tbsp", name: "toasted sesame oil" },
      { amount: 4, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "fresh ginger, grated" },
      { amount: 0.5, unit: null, name: "Asian pear or kiwi, grated (natural tenderizer)" },
      { amount: 1, unit: "tbsp", name: "lemon juice" },
      { amount: 1, unit: "tsp", name: "gochugaru, optional for light heat" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: null, name: "yellow onion, thinly sliced" },
      { amount: 2, unit: null, name: "green onions, sliced, for garnish" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds, for garnish" },
    ],
    steps: [
      { title: "Make the marinade", content: "Whisk together {0002}, {0003}, {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, {0010}, {0011}, and {0012} until sugar dissolves.", timer: null },
      { title: "Marinate", content: "Cut chicken into 2-inch strips or keep whole. Add to the marinade with {0013}. Marinate at least 30 minutes — overnight is best, but not longer than 24 hours or the soy sauce will start to cure the meat.", timer: 1800 },
      { title: "Cook", content: "Grill: medium-high heat, 4–5 min per side until charred and 165°F internal, basting with reserved marinade in the last 2 minutes. Or stovetop: heat a heavy skillet over medium-high and cook the same way, undisturbed, until a good crust forms.", timer: 300 },
      { title: "Serve", content: "Rest a few minutes, then garnish with {0014} and {0015}.", timer: null },
    ],
    notes: "I recovered the marinade and grill method in full detail, but the exact final stovetop wording was cut off in the source conversation — the technique above matches the same approach used in your other Korean chicken recipes, so it should track closely.",
  },
  {
    id: "demo-japchae",
    name: "Japchae (Korean Glass Noodle Stir-Fry)",
    category: "Dinner",
    servings: 4,
    prepTime: "20 min",
    cookTime: "30 min",
    ingredients: [
      { amount: 8, unit: "oz", name: "dangmyeon (Korean sweet potato glass noodles) — or kelp noodles, see notes" },
      { amount: 0.5, unit: "lb", name: "beef sirloin or chicken thighs, thinly sliced" },
      { amount: 2, unit: "cup", name: "fresh spinach" },
      { amount: 1, unit: null, name: "medium carrot, julienned" },
      { amount: 1, unit: null, name: "yellow onion, thinly sliced" },
      { amount: 1, unit: null, name: "red bell pepper, thinly sliced" },
      { amount: 4, unit: null, name: "shiitake mushrooms, stems removed and sliced" },
      { amount: 3, unit: null, name: "garlic cloves, minced" },
      { amount: 3, unit: "tbsp", name: "neutral oil, divided" },
      { amount: 1.5, unit: "tbsp", name: "toasted sesame oil, divided" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds" },
      { amount: 2, unit: null, name: "green onions, sliced, for garnish" },
      { amount: 3, unit: "tbsp", name: "soy sauce, for the sauce" },
      { amount: 1.5, unit: "tbsp", name: "brown sugar, for the sauce" },
      { amount: 1, unit: "tbsp", name: "mirin, for the sauce" },
      { amount: 1, unit: "tbsp", name: "oyster sauce, for the sauce" },
      { amount: 0.25, unit: "cup", name: "water, for the sauce" },
      { amount: 0.5, unit: "tbsp", name: "soy sauce, for the beef marinade" },
      { amount: 1, unit: "tsp", name: "sesame oil, for the beef marinade" },
      { amount: 0.5, unit: "tbsp", name: "sugar, for the beef marinade" },
      { amount: 0.5, unit: "tbsp", name: "garlic, minced, for the beef marinade" },
    ],
    steps: [
      { title: "Marinate the beef", content: "Combine the beef with {0018}, {0019}, {0020}, and {0021}. Mix and set aside.", timer: null },
      { title: "Make the sauce", content: "Whisk together {0013}, {0014}, {0015}, {0016}, one tbsp of the divided sesame oil, and {0017} until the sugar dissolves.", timer: null },
      { title: "Cook the noodles", content: "Soak {0001} in hot water 20–30 minutes until softened, or boil 6 minutes until just al dente. Drain, rinse under cold water, and cut into 6-inch lengths with scissors.", timer: 1200 },
      { title: "Cook the vegetables separately", content: "Working one at a time in a hot pan with a little of the divided neutral oil, quickly stir-fry the spinach, carrot, onion, bell pepper, and shiitake mushrooms separately, seasoning each lightly — this is the authentic method and keeps every vegetable's own color and texture distinct.", timer: null },
      { title: "Cook the beef", content: "Stir-fry the marinated beef with {0008} in the remaining oil over high heat until just cooked through, 2–3 minutes.", timer: 180 },
      { title: "Combine", content: "In a large bowl or the same pan, toss the noodles with the sauce first, then fold in the beef and all the vegetables until everything is evenly coated and glossy.", timer: null },
      { title: "Finish", content: "Drizzle with the remaining sesame oil, top with {0011} and {0012}, and serve warm or at room temperature.", timer: null },
    ],
    notes: "Kelp noodle substitute: soak in warm water with 1–2 tsp baking soda for 30–45 minutes, rinse, then toss with a squeeze of lemon for 10 minutes and rinse lightly. Toss kelp noodles in the sauce before stir-frying (not after), and use slightly less sesame oil since they're more slippery than dangmyeon. I recovered the ingredients, sauce, and prep steps in full, but reconstructed the vegetable-cooking and combining steps using the \"cook each vegetable separately\" technique your original conversation specifically mentioned — the exact original wording for that part wasn't fully recoverable, so treat step order as a reliable guide rather than a verbatim quote. Japchae is great at room temperature, making it ideal for meal prep.",
  },
];

const CATEGORIES = ["All", "Dinner", "Sides", "Baking", "Drinks", "Pantry"];

function StepText({ content, ingredients }) {
  const parts = content.split(/(\{[0-9]{4}\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\{([0-9]{4})\}$/);
        if (match) {
          const ing = ingredients.find((x) => x.id === match[1]);
          if (ing) {
            return (
              <span key={i} className="ing-inline">
                {formatAmount(ing.amount)}{ing.unit ? ` ${ing.unit}` : ""} {ing.name}
              </span>
            );
          }
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function formatAmount(n) {
  if (Number.isInteger(n)) return String(n);
  const fractions = { 0.25: "¼", 0.5: "½", 0.75: "¾", 0.33: "⅓", 0.67: "⅔" };
  return fractions[n] || String(n);
}

export default function RecipeBook() {
  const [recipes, setRecipes] = useState(DEFAULT_RECIPES.map((r) => ({ ...r, id: r.id, favorite: false, custom: false, deleted: false })));
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [servingsOverride, setServingsOverride] = useState(null);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const overrides = JSON.parse(raw);
        setRecipes((prev) => {
          const base = DEFAULT_RECIPES.map((r) => ({
            ...r,
            favorite: overrides.favorites?.includes(r.id) || false,
            custom: false,
            deleted: overrides.deletedDefaults?.includes(r.id) || false,
          }));
          const added = (overrides.customRecipes || []).map((r) => ({ ...r, custom: true, deleted: false }));
          return [...base, ...added];
        });
      }
    } catch (e) {
      // no saved data yet, defaults stand
    }
    setLoaded(true);
  }, []);

  const persist = (nextRecipes) => {
    const overrides = {
      favorites: nextRecipes.filter((r) => r.favorite).map((r) => r.id),
      deletedDefaults: nextRecipes.filter((r) => r.deleted && !r.custom).map((r) => r.id),
      customRecipes: nextRecipes.filter((r) => r.custom && !r.deleted),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
      setSaveError(false);
    } catch (e) {
      setSaveError(true);
    }
  };

  const toggleFavorite = (id) => {
    setRecipes((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r));
      persist(next);
      return next;
    });
  };

  const removeRecipe = (id) => {
    setRecipes((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, deleted: true } : r));
      persist(next);
      return next;
    });
    setSelected(null);
  };

  const visible = useMemo(() => {
    return recipes
      .filter((r) => !r.deleted)
      .filter((r) => category === "All" || r.category === category)
      .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [recipes, category, query]);

  const scale = selected ? (servingsOverride || selected.servings) / selected.servings : 1;

  return (
    <div className="rb-root">
      <style>{`
        .rb-root {
          --cream: #FAF6EE;
          --parchment: #F0E8D8;
          --brown: #3D2817;
          --brown-soft: #6B5340;
          --gold: #B8860B;
          --gold-light: #D4A72C;
          --line: #E0D5BE;
          font-family: 'Lato', sans-serif;
          background: var(--cream);
          min-height: 100%;
          color: var(--brown);
        }
        .rb-header {
          padding: 20px 20px 14px;
          border-bottom: 1px solid var(--line);
          background: var(--parchment);
        }
        .rb-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          margin: 0 0 12px;
          color: var(--brown);
        }
        .rb-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 10px;
        }
        .rb-search input {
          border: none;
          background: none;
          outline: none;
          font-size: 14px;
          flex: 1;
          color: var(--brown);
          font-family: 'Lato', sans-serif;
        }
        .rb-cats {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .rb-cat-btn {
          border: 1px solid var(--line);
          background: var(--cream);
          color: var(--brown-soft);
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12.5px;
          cursor: pointer;
          font-family: 'Lato', sans-serif;
        }
        .rb-cat-btn.active {
          background: var(--gold);
          border-color: var(--gold);
          color: white;
          font-weight: 600;
        }
        .rb-list {
          padding: 16px;
          display: grid;
          gap: 10px;
        }
        .rb-card {
          background: var(--parchment);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 14px 16px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: transform 0.1s ease;
        }
        .rb-card:hover { transform: translateY(-1px); border-color: var(--gold-light); }
        .rb-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 4px;
        }
        .rb-card-meta {
          font-size: 12px;
          color: var(--brown-soft);
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .rb-star { color: var(--gold); cursor: pointer; }
        .rb-empty {
          padding: 40px 20px;
          text-align: center;
          color: var(--brown-soft);
          font-size: 14px;
        }
        .rb-detail {
          padding: 16px;
        }
        .rb-back {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--brown-soft);
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 12px;
          padding: 0;
          font-family: 'Lato', sans-serif;
        }
        .rb-detail-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 8px;
        }
        .rb-detail-meta {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: var(--brown-soft);
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .rb-servings {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--parchment);
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 16px;
          width: fit-content;
        }
        .rb-servings button {
          width: 24px; height: 24px;
          border-radius: 50%;
          border: 1px solid var(--gold);
          background: white;
          color: var(--gold);
          font-weight: 700;
          cursor: pointer;
        }
        .rb-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          margin: 18px 0 8px;
          color: var(--brown);
        }
        .rb-ing-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 6px;
        }
        .rb-ing-list li {
          font-size: 14px;
          padding: 6px 10px;
          background: var(--parchment);
          border-radius: 6px;
        }
        .rb-step {
          background: var(--parchment);
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 8px;
        }
        .rb-step-title {
          font-weight: 700;
          font-size: 13.5px;
          margin-bottom: 4px;
          color: var(--gold);
        }
        .rb-step-content {
          font-size: 14px;
          line-height: 1.5;
        }
        .ing-inline {
          font-weight: 700;
          color: var(--brown);
          background: #EAD9A0;
          padding: 1px 4px;
          border-radius: 4px;
        }
        .rb-notes {
          font-size: 13px;
          color: var(--brown-soft);
          background: var(--parchment);
          border-left: 3px solid var(--gold);
          padding: 10px 14px;
          margin-top: 14px;
          border-radius: 4px;
          display: flex;
          gap: 8px;
        }
        .rb-actions {
          display: flex;
          gap: 8px;
          margin-top: 18px;
        }
        .rb-actions button {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--line);
          background: white;
          padding: 7px 12px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          color: var(--brown-soft);
        }
        .rb-banner {
          background: #F7ECD0;
          border-bottom: 1px solid var(--gold-light);
          padding: 8px 20px;
          font-size: 12.5px;
          color: var(--brown-soft);
        }
      `}</style>

      {!selected && (
        <>
          <div className="rb-header">
            <h1 className="rb-title">Thomas's Recipe Book</h1>
            <div className="rb-search">
              <Search size={16} color="#6B5340" />
              <input placeholder="Search recipes..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="rb-cats">
              {CATEGORIES.map((c) => (
                <button key={c} className={`rb-cat-btn ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="rb-banner">
            14 of 38 recipes rebuilt so far — Korean banchan and mains are in. Sides/salads, Mexican, and baking are coming in the next batches.
          </div>
          <div className="rb-list">
            {visible.length === 0 && <div className="rb-empty">No recipes match yet — try a different search or category.</div>}
            {visible.map((r) => (
              <div className="rb-card" key={r.id} onClick={() => { setSelected(r); setServingsOverride(null); }}>
                <div>
                  <p className="rb-card-name">{r.name}</p>
                  <div className="rb-card-meta">
                    <span><Clock size={12} style={{ verticalAlign: "-2px" }} /> {r.prepTime} + {r.cookTime}</span>
                    <span><Users size={12} style={{ verticalAlign: "-2px" }} /> {r.servings}</span>
                  </div>
                </div>
                <Star size={20} className="rb-star" fill={r.favorite ? "#B8860B" : "none"} onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }} />
              </div>
            ))}
          </div>
        </>
      )}

      {selected && (
        <div className="rb-detail">
          <button className="rb-back" onClick={() => setSelected(null)}>
            <ChevronLeft size={16} /> Back
          </button>
          <h2 className="rb-detail-title">{selected.name}</h2>
          <div className="rb-detail-meta">
            <span>Prep: {selected.prepTime}</span>
            <span>Cook: {selected.cookTime}</span>
            <span>{selected.category}</span>
          </div>
          <div className="rb-servings">
            <Users size={14} />
            <button onClick={() => setServingsOverride(Math.max(1, (servingsOverride || selected.servings) - 1))}>−</button>
            <span>{servingsOverride || selected.servings} servings</span>
            <button onClick={() => setServingsOverride((servingsOverride || selected.servings) + 1)}>+</button>
          </div>

          <div className="rb-section-title">Ingredients</div>
          <ul className="rb-ing-list">
            {selected.ingredients.map((ing, i) => (
              <li key={i}>{formatAmount(Math.round(ing.amount * scale * 100) / 100)}{ing.unit ? ` ${ing.unit}` : ""} {ing.name}</li>
            ))}
          </ul>

          <div className="rb-section-title">Steps</div>
          {selected.steps.map((s, i) => (
            <div className="rb-step" key={i}>
              <div className="rb-step-title">{i + 1}. {s.title}</div>
              <div className="rb-step-content">
                <StepText content={s.content} ingredients={selected.ingredients.map((ing, idx) => ({ ...ing, id: String(idx + 1).padStart(4, "0") }))} />
              </div>
            </div>
          ))}

          {selected.notes && (
            <div className="rb-notes">
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{selected.notes}</span>
            </div>
          )}

          <div className="rb-actions">
            <button onClick={() => removeRecipe(selected.id)}><Trash2 size={14} /> Remove from book</button>
          </div>
          {saveError && <div className="rb-notes" style={{ marginTop: 10 }}><AlertCircle size={14} /> Couldn't save changes — they may not persist.</div>}
        </div>
      )}
    </div>
  );
}
