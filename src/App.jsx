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
      { title: "Make the white sauce", content: "Whisk {0013}, {0014}, {0015}, {0016}, {0017}, and {0018} together until smooth. Refrigerate until ready to serve — it gets better as it sits, so make it ahead if you can.", timer: null },
      { title: "Cook the chicken", content: "Heat a large skillet or grill pan over medium-high heat with a little oil. Add chicken in a single layer and let cook undisturbed 4–5 minutes until deeply browned. Flip and cook another 4–5 minutes until charred and cooked through, 165°F internal. Rest 5 minutes, then chop into bite-sized pieces.", timer: 600 },
      { title: "Assemble", content: "Serve over rice with {0019}, drizzled generously with the white sauce.", timer: null },
    ],
    notes: "Pairs directly with the Turmeric Basmati Rice recipe. Thighs hold up better than breast and absorb the marinade more deeply. Don't rush the marinade — overnight is where most copycats fall short. Let the chicken sit undisturbed rather than stirring constantly to build the deep golden crust. White sauce keeps up to a week in the fridge.",
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
  {
    id: "demo-pollo-a-la-brasa",
    name: "Pollo a la Brasa (Peruvian Grilled Chicken) with Aji Verde",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "15 min",
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 3, unit: "tbsp", name: "soy sauce" },
      { amount: 3, unit: "tbsp", name: "lime juice, about 2 limes" },
      { amount: 2, unit: "tbsp", name: "olive oil" },
      { amount: 5, unit: null, name: "garlic cloves, minced" },
      { amount: 1.5, unit: "tsp", name: "ground cumin" },
      { amount: 1, unit: "tsp", name: "smoked paprika" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 1, unit: "tsp", name: "honey or brown sugar" },
      { amount: 1, unit: "cup", name: "fresh cilantro, packed, for the green sauce" },
      { amount: 1, unit: null, name: "jalapeño, roughly chopped, seeds removed for less heat, for the green sauce" },
      { amount: 1, unit: null, name: "garlic clove, for the green sauce" },
      { amount: 0.25, unit: "cup", name: "sour cream or Greek yogurt, for the green sauce" },
      { amount: 2, unit: "tbsp", name: "olive oil, for the green sauce" },
      { amount: 1, unit: "tbsp", name: "lime juice, for the green sauce" },
    ],
    steps: [
      { title: "Make the marinade", content: "Blend or whisk together {0002}, {0003}, {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, {0010}, and {0011} until smooth.", timer: null },
      { title: "Marinate", content: "Add the chicken to a zip-top bag and pour in the marinade. Coat well. Marinate in the fridge at least 4 hours — overnight (12–24 hours) is ideal for the deepest flavor.", timer: 14400 },
      { title: "Make aji verde", content: "Blend {0012}, {0013}, {0014}, {0015}, {0016}, and {0017} in a blender or food processor until smooth and creamy. Taste and adjust salt. Refrigerate until serving — it gets better as it sits.", timer: null },
      { title: "Grill", content: "Preheat grill to medium-high. Remove chicken from marinade, letting excess drip off, and grill about 6–7 minutes per side until charred and 165°F internal.", timer: 420 },
      { title: "Rest and serve", content: "Rest 5 minutes, then serve with the aji verde spooned generously over the top.", timer: 300 },
    ],
    notes: "The green sauce is the whole point of this dish — don't skip it. I recovered the marinade, aji verde, and marinate time in full detail; the exact final grill-time wording was cut off in the source, so the timing above is a reasonable standard estimate — check for 165°F internal to be sure.",
  },
  {
    id: "demo-chipotle-copycat",
    name: "Chipotle Chicken Copycat",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "10 min",
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 4, unit: "tbsp", name: "adobo sauce, from a can of chipotle peppers in adobo" },
      { amount: 2, unit: "tbsp", name: "olive oil" },
      { amount: 4, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tbsp", name: "ancho chili powder (or regular chili powder)" },
      { amount: 1.5, unit: "tsp", name: "ground cumin" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: "tbsp", name: "distilled white vinegar" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
    ],
    steps: [
      { title: "Blend the marinade", content: "Blend {0002}, {0003}, {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, and {0010} in a blender or food processor until smooth.", timer: null },
      { title: "Marinate", content: "Add chicken thighs to a zip-top bag or bowl. Pour marinade over and coat well. Marinate at least 30 minutes — 4 to 6 hours is ideal, overnight is even better.", timer: 1800 },
      { title: "Grill", content: "Heat grill to medium-high, 450–500°F. Remove chicken from marinade, letting excess drip off. Grill smooth-side down 4–5 minutes until dark grill marks appear. Flip and cook another 3–5 minutes until 165°F internal.", timer: 480 },
      { title: "Rest and chop", content: "Transfer to a cutting board and rest 5 minutes. Chop into bite-sized pieces, seasoning with a pinch more salt if needed. Serve in bowls, tacos, or over rice.", timer: 300 },
    ],
    notes: "Stovetop option: sear in a cast iron skillet over medium-high, 5–6 min per side, then add a splash of water and scrape the pan for all the crispy bits. Adobo sauce alone is mild-medium — blend in 1–2 whole chipotle peppers for more heat. Keeps 4–5 days in the fridge or 3 months frozen.",
  },
  {
    id: "demo-pollo-asado",
    name: "Pollo Asado (Mexican Citrus Grilled Chicken Drumsticks)",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "25 min",
    ingredients: [
      { amount: 8, unit: null, name: "chicken drumsticks, skin-on bone-in" },
      { amount: 0.5, unit: "cup", name: "fresh orange juice, about 2 oranges" },
      { amount: 0.25, unit: "cup", name: "fresh lime juice, about 4 limes" },
      { amount: 3, unit: "tbsp", name: "achiote paste (or 2 tbsp achiote powder)" },
      { amount: 3, unit: "tbsp", name: "olive oil or avocado oil" },
      { amount: 1, unit: "tbsp", name: "white wine vinegar" },
      { amount: 5, unit: null, name: "garlic cloves, minced" },
      { amount: 2, unit: "tsp", name: "ground cumin" },
      { amount: 1, unit: "tsp", name: "smoked paprika" },
      { amount: 1, unit: "tsp", name: "dried Mexican oregano (or regular oregano)" },
      { amount: 1, unit: "tsp", name: "ground coriander" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 0.5, unit: "tsp", name: "chili powder" },
      { amount: 1, unit: null, name: "lime, cut into wedges, for serving" },
    ],
    steps: [
      { title: "Make the marinade", content: "Whisk together {0002}, {0003}, {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, {0010}, {0011}, {0012}, {0013}, and {0014} until the achiote paste is fully dissolved. Or blend everything for a smoother marinade.", timer: null },
      { title: "Marinate", content: "Pat the drumsticks dry with paper towels. Score each one 2–3 times down to the bone. Place in a zip-lock bag or bowl and pour marinade over, massaging to coat evenly. Refrigerate at least 4 hours — overnight (up to 24 hours) is ideal. Don't exceed 24 hours or the citrus acid can make the meat mushy.", timer: 14400 },
      { title: "Set up the grill", content: "Preheat grill to 350–400°F with two zones — one direct heat, one indirect. Oil the grates well. Remove chicken from marinade, letting excess drip off.", timer: null },
      { title: "Indirect cook", content: "Place drumsticks on the indirect heat side. Close the lid and cook 20–25 minutes, flipping every 10 minutes, until nearly cooked through.", timer: 1350 },
      { title: "Finish and serve", content: "Move drumsticks to direct heat for the last few minutes to char the skin, until 175°F internal. Serve with lime wedges.", timer: 240 },
    ],
    notes: "I recovered nearly all of this recipe in full detail; the very last charring step was cut off in the source, so the finish above follows the standard two-zone grilling technique the rest of the recipe already sets up.",
  },
  {
    id: "demo-cuban-mojo-chicken",
    name: "Cuban Mojo Chicken",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "15 min",
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skin-on chicken thighs (or bone-in for oven)" },
      { amount: 0.33, unit: "cup", name: "fresh lime juice, about 3–4 limes" },
      { amount: 0.33, unit: "cup", name: "fresh orange juice, about 1.5 oranges" },
      { amount: 1, unit: null, name: "lime, zested" },
      { amount: 0.25, unit: "cup", name: "olive oil" },
      { amount: 6, unit: null, name: "garlic cloves, minced" },
      { amount: 2, unit: "tsp", name: "ground cumin" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 0.5, unit: "tsp", name: "red pepper flakes, optional" },
      { amount: 0.25, unit: "cup", name: "fresh cilantro, roughly chopped, for garnish" },
    ],
    steps: [
      { title: "Make the mojo marinade", content: "Whisk together {0002}, {0003}, the zest from {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, {0010}, and {0011} in a bowl until combined.", timer: null },
      { title: "Marinate", content: "Score {0001} with 2–3 shallow cuts through the skin. Place in a zip-lock bag or bowl, pour marinade over, and coat thoroughly. Marinate in the fridge at least 2 hours — 4 hours is ideal, and don't exceed 4–6 hours since the citrus acid will start to toughen the meat.", timer: 14400 },
      { title: "Cook", content: "Grill: medium-high heat, 5–7 min per side. Oven: 425°F skin-side up on a wire rack, 25–30 min for boneless (40–45 min bone-in), broil 2–3 min at the end for crispy skin. Air fryer (Breville): 390°F Air Fry, 18–22 min flipping halfway, bump to 400°F for the last 3 min.", timer: 420 },
      { title: "Rest and serve", content: "Rest 5 minutes. Garnish with {0012}. Serve with black beans, rice, or fried plantains, and a squeeze of extra lime right before eating.", timer: 300 },
    ],
    notes: "Fresh citrus only — bottled juice loses the brightness that makes mojo distinctive. Don't marinate longer than 4–6 hours; this is a stricter cap than yogurt-based marinades. A classic Cuban plate: mojo chicken + black beans + turmeric basmati rice + avocado slices.",
  },
  {
    id: "demo-turmeric-basmati-rice",
    name: "Turmeric Basmati Rice",
    category: "Sides",
    servings: 4,
    prepTime: "5 min",
    cookTime: "20 min",
    ingredients: [
      { amount: 1.5, unit: "cup", name: "basmati rice" },
      { amount: 2, unit: "tbsp", name: "butter or ghee" },
      { amount: 0.5, unit: "tsp", name: "ground turmeric" },
      { amount: 0.5, unit: "tsp", name: "ground cumin" },
      { amount: 2.25, unit: "cup", name: "chicken broth" },
      { amount: 0.5, unit: "tsp", name: "salt, adjust to broth saltiness" },
    ],
    steps: [
      { title: "Rinse", content: "Rinse {0001} in a fine-mesh strainer under cold water until the water runs clear.", timer: null },
      { title: "Bloom the spices", content: "In a pot, melt {0002} over medium heat. Add {0003} and {0004}, stir 30 seconds until fragrant.", timer: 30 },
      { title: "Toast the rice", content: "Add the rinsed rice and stir to coat in the spiced butter, toasting 1–2 minutes.", timer: 90 },
      { title: "Simmer", content: "Pour in {0005} and {0006}. Bring to a boil, then reduce heat to low, cover, and simmer 15 minutes until tender and the liquid is absorbed.", timer: 900 },
      { title: "Rest and fluff", content: "Remove from heat and rest, covered, 5 minutes. Fluff with a fork before serving.", timer: 300 },
    ],
    notes: "This is the base for Halal Guys style platters — pairs directly with the Halal Guys Chicken recipe. Basmati's long grain and fluffy texture matter here, so it's worth not substituting a shorter-grain rice. Don't lift the lid while simmering. Rice cooker version: bloom the butter and spices on the stovetop first for the best flavor, then add everything — rinsed rice, broth, salt — to the rice cooker on the white rice setting.",
  },
  {
    id: "demo-chicken-shawarma",
    name: "Slow Cooker Chicken Shawarma",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "4–6 hrs",
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 1, unit: null, name: "yellow onion, thinly sliced" },
      { amount: 0.33, unit: "cup", name: "plain Greek yogurt" },
      { amount: 3, unit: "tbsp", name: "lemon juice" },
      { amount: 3, unit: null, name: "garlic cloves, minced" },
      { amount: 2, unit: "tbsp", name: "olive oil" },
      { amount: 2, unit: "tsp", name: "smoked paprika" },
      { amount: 2, unit: "tsp", name: "ground cumin" },
      { amount: 1, unit: "tsp", name: "ground coriander" },
      { amount: 0.5, unit: "tsp", name: "cinnamon" },
      { amount: 0.5, unit: "tsp", name: "turmeric" },
      { amount: 0.5, unit: "tsp", name: "allspice" },
      { amount: 0.5, unit: "tsp", name: "cayenne pepper, optional" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
    ],
    steps: [
      { title: "Marinate", content: "Whisk together {0003}, {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, {0010}, {0011}, {0012}, {0013}, {0014}, and {0015} in a large bowl. Add chicken and coat well. Marinate at least 4 hours — overnight (8–12 hours) is the sweet spot; don't rush this step.", timer: 14400 },
      { title: "Layer the slow cooker", content: "Layer {0002} on the bottom of the slow cooker. Place the marinated chicken on top.", timer: null },
      { title: "Cook", content: "Cook on LOW for 4–6 hours or HIGH for 3–4 hours, until the chicken reaches 165°F and shreds easily.", timer: null },
      { title: "Shred and rest", content: "Remove chicken to a cutting board and roughly chop or shred. Return to the slow cooker and stir into the onions and juices. Let sit 10 minutes to absorb the flavors.", timer: 600 },
      { title: "Optional char", content: "For charred edges, spread the chicken on a foil-lined sheet pan and broil 5–7 minutes until browned and crispy.", timer: 420 },
    ],
    notes: "No allspice on hand? Substitute 1/4 tsp ground cloves plus a pinch of nutmeg. Yogurt-based marinades are gentler than pure citrus, so overnight to 24 hours is fine — past 24–36 hours it can start to get mushy. Great in pita with the same white sauce from the Halal Guys Chicken recipe.",
  },
  {
    id: "demo-karaage",
    name: "Chicken Karaage (Japanese Fried Chicken)",
    category: "Dinner",
    servings: 4,
    prepTime: "15 min + marinate",
    cookTime: "15 min",
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skin-on chicken thighs, cut into 1.5-inch pieces" },
      { amount: 3, unit: "tbsp", name: "soy sauce" },
      { amount: 2, unit: "tbsp", name: "sake (or dry sherry — don't skip, it adds a distinct flavor)" },
      { amount: 1, unit: "tbsp", name: "mirin" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 1, unit: "tbsp", name: "fresh ginger, grated" },
      { amount: 3, unit: null, name: "garlic cloves, grated or minced" },
      { amount: 0.25, unit: "tsp", name: "white pepper" },
      { amount: 0.5, unit: "cup", name: "potato starch (katakuriko) — not cornstarch, not flour" },
      { amount: 2, unit: "tbsp", name: "all-purpose flour, mixed with the potato starch for better adhesion" },
      { amount: 1, unit: "tsp", name: "water, for the hailstone effect — see notes" },
      { amount: 1, unit: null, name: "lemon, cut into wedges, for serving" },
      { amount: 0.25, unit: "cup", name: "Japanese Kewpie mayo, for serving" },
    ],
    steps: [
      { title: "Marinate", content: "Cut chicken thighs into 1.5-inch pieces, keeping the skin on for extra crunch. In a bowl combine {0002}, {0003}, {0004}, {0005}, {0006}, {0007}, and {0008}. Add chicken and toss to coat. Marinate in the fridge at least 30 minutes, up to overnight.", timer: 1800 },
      { title: "Coat", content: "Mix {0009} and {0010} together. Shake off excess marinade from the chicken and toss each piece in the starch mixture to coat thoroughly. Sprinkle {0011} over the coated pieces for the hailstone effect, then let sit 5 minutes so the starch absorbs slightly.", timer: 300 },
      { title: "Air fryer method", content: "Preheat to 390°F Air Fry. Spray the basket lightly with avocado oil, place pieces in a single layer without touching, and spray the tops. Cook 10 minutes, flip, spray again, and cook another 8–10 minutes until deep golden. For extra crispness, bump to 400°F for the last 3 minutes.", timer: 1080 },
      { title: "Double-fry hack (air fryer)", content: "Let the chicken rest 3–5 minutes after the first cook, then return to the air fryer at 400°F for 3–4 more minutes. This mimics a traditional double-fry and gives noticeably crispier results.", timer: 240 },
      { title: "Serve", content: "Serve immediately with {0012} and {0013} — karaage softens as it sits. If making ahead, re-crisp in the air fryer at 400°F for 3 minutes.", timer: null },
    ],
    notes: "Potato starch (katakuriko) makes for a lighter, airier crunch than cornstarch and is the single ingredient that makes karaage taste distinctively Japanese — find it at H-Mart or 99 Ranch. Since you debone your own thighs, keep the skin on here — it's traditional. If deep frying instead of air frying: fry at 325°F for 3–4 minutes, rest 3 minutes, then fry again at 350°F for 2–3 minutes until deep golden — this traditional double-fry method gets closer to 100% of the crispiness the air fryer approximates at 85%.",
  },
  {
    id: "demo-dtf-cucumbers",
    name: "Din Tai Fung Spicy Cucumbers (Copycat)",
    category: "Sides",
    servings: 4,
    prepTime: "10 min",
    cookTime: "4 hrs marinate",
    ingredients: [
      { amount: 4, unit: null, name: "Persian or English cucumbers, sliced into 1/2-inch rounds" },
      { amount: 1.5, unit: "tbsp", name: "kosher salt, for salting" },
      { amount: 3, unit: "tbsp", name: "rice vinegar" },
      { amount: 2, unit: "tbsp", name: "mirin" },
      { amount: 1, unit: "tbsp", name: "sugar" },
      { amount: 1, unit: "tbsp", name: "sesame oil" },
      { amount: 2, unit: null, name: "garlic cloves, minced or grated" },
      { amount: 0.25, unit: "tsp", name: "kosher salt, for the dressing" },
      { amount: 2, unit: "tbsp", name: "chili oil, drizzled at serving" },
      { amount: 1, unit: null, name: "Fresno chili pepper, thinly sliced, for garnish" },
    ],
    steps: [
      { title: "Salt the cucumbers", content: "Add sliced cucumbers to a bowl. Sprinkle with {0002} and toss. Let sit 30 minutes in the refrigerator.", timer: 1800 },
      { title: "Rinse and dry", content: "Rinse off the salt thoroughly and pat the cucumbers completely dry with paper towels.", timer: null },
      { title: "Make the dressing", content: "Whisk together {0003}, {0004}, {0005}, {0006}, {0007}, and {0008} until the sugar dissolves.", timer: null },
      { title: "Marinate", content: "Toss the dried cucumbers with the dressing. Cover and marinate in the refrigerator a minimum of 4 hours, or up to 2 days — the longer they sit, the more flavor they absorb.", timer: 14400 },
      { title: "Serve", content: "Taste and adjust seasoning. Stack the cucumbers in a layered pile on a plate. Drizzle with {0009} and top with {0010}. Serve chilled.", timer: null },
    ],
    notes: "The 4-hour marinate is the key to authentic flavor — don't rush it. The chili oil goes on at serving, not in the marinade. Persian cucumbers work best: seedless, sweet, less watery. Keeps up to 2 days in the fridge.",
  },
  {
    id: "demo-thai-cucumber-salad",
    name: "Thai Cucumber Salad (Yum Tang Gwa)",
    category: "Sides",
    servings: 4,
    prepTime: "10 min",
    cookTime: "5 min",
    ingredients: [
      { amount: 4, unit: null, name: "Persian or English cucumbers, thinly sliced into rounds or half-moons" },
      { amount: 0.5, unit: "tsp", name: "salt, for drawing moisture from cucumbers" },
      { amount: 0.25, unit: null, name: "small red onion, thinly sliced" },
      { amount: 2, unit: null, name: "Thai bird's eye chilies, thinly sliced (or 1 Fresno chili for less heat)" },
      { amount: 0.25, unit: "cup", name: "roasted peanuts, roughly chopped" },
      { amount: 0.25, unit: "cup", name: "fresh cilantro, roughly chopped" },
      { amount: 2, unit: "tbsp", name: "fresh mint leaves, optional but recommended" },
      { amount: 3, unit: "tbsp", name: "fresh lime juice, about 2 limes" },
      { amount: 2, unit: "tbsp", name: "fish sauce (or soy sauce for a vegan version)" },
      { amount: 2, unit: "tbsp", name: "sugar" },
      { amount: 1, unit: "tbsp", name: "rice vinegar" },
      { amount: 1, unit: null, name: "garlic clove, minced" },
    ],
    steps: [
      { title: "Salt the cucumbers", content: "Slice cucumbers thinly. Toss with {0002} and set aside in the fridge 10–15 minutes to keep them crisp. Drain and pat dry.", timer: 900 },
      { title: "Make the dressing", content: "In a small saucepan combine {0008}, {0009}, {0010}, {0011}, and {0012}. Heat over low, stirring until the sugar dissolves completely, about 2 minutes — or whisk cold, just make sure the sugar fully dissolves.", timer: 120 },
      { title: "Combine", content: "In a large bowl combine cucumbers, {0003}, and {0004}. Pour the dressing over and toss well to coat.", timer: null },
      { title: "Add herbs and peanuts", content: "Add {0006}, {0007}, and half the {0005}. Toss gently. Taste and adjust — more lime for brightness, more fish sauce for saltiness, more sugar for sweetness.", timer: null },
      { title: "Serve", content: "Transfer to a serving dish and top with remaining peanuts. Serve immediately for maximum crunch, or refrigerate 20–30 minutes for a more pickled flavor.", timer: null },
    ],
    notes: "Persian cucumbers are ideal — less watery than English. Roasted peanuts go on right before serving since they soften quickly once dressed. Vegan version: swap fish sauce for soy sauce or vegan fish sauce.",
  },
  {
    id: "demo-mapo-eggplant",
    name: "Mapo Eggplant (麻婆茄子)",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min",
    cookTime: "20 min",
    ingredients: [
      { amount: 1.5, unit: "lb", name: "Chinese or Japanese eggplants (3–4 small), cut into 1.5-inch pieces" },
      { amount: 0.5, unit: "lb", name: "ground pork or chicken, optional — skip for vegetarian" },
      { amount: 1.5, unit: "tbsp", name: "doubanjiang (Pixian chili bean paste) — H-Mart or 99 Ranch" },
      { amount: 4, unit: null, name: "garlic cloves, minced" },
      { amount: 1, unit: "tbsp", name: "fresh ginger, grated" },
      { amount: 3, unit: null, name: "green onions, white and green parts separated, sliced" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tsp", name: "dark soy sauce, adds color and depth" },
      { amount: 1, unit: "tbsp", name: "Shaoxing rice wine or dry sherry" },
      { amount: 1, unit: "tsp", name: "sugar" },
      { amount: 0.75, unit: "cup", name: "chicken or vegetable broth" },
      { amount: 1, unit: "tbsp", name: "cornstarch, mixed with 2 tbsp water for a slurry" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 0.5, unit: "tsp", name: "Sichuan peppercorns, toasted and ground — the numbing spice, don't skip" },
      { amount: 3, unit: "tbsp", name: "neutral oil" },
    ],
    steps: [
      { title: "Prep the eggplant", content: "Cut eggplant into 1.5-inch chunks. Optional: soak in lightly salted water 10 minutes, then drain and pat very dry to reduce oil absorption.", timer: 600 },
      { title: "Mix the sauce", content: "Mix together {0007}, {0008}, {0009}, {0010}, and {0011} in a small bowl. Set aside.", timer: null },
      { title: "Sear the eggplant", content: "Heat 2 tbsp of the {0015} in a wok over high heat until shimmering. Add eggplant in a single layer — don't stir for 2 minutes. Toss and cook another 3–4 minutes until golden and tender. Remove and set aside.", timer: 300 },
      { title: "Cook the aromatics", content: "Add the remaining 1 tbsp oil to the same pan over medium-high. Add {0002} if using and cook 2–3 minutes until browned. Add the white parts of {0006}, {0004}, and {0005}. Stir-fry 30 seconds until fragrant.", timer: 180 },
      { title: "Bloom the doubanjiang", content: "Add {0003} and stir-fry 1 minute — it will turn the oil red and fragrant. This step is key for deep flavor.", timer: 60 },
      { title: "Combine and simmer", content: "Return the eggplant to the pan. Pour the sauce over everything and toss. Bring to a simmer and cook 2–3 minutes until fully tender and the sauce has reduced slightly.", timer: 180 },
      { title: "Thicken and finish", content: "Pour in {0012} and stir constantly until the sauce thickens and coats everything glossily, about 1 minute. Remove from heat. Drizzle with {0013}, sprinkle with {0014}, and top with the green parts of the onion. Serve immediately over steamed rice.", timer: 60 },
    ],
    notes: "Chinese or Japanese eggplant absorbs sauce better than large Western eggplant — if using globe eggplant, salt and press 20 minutes first. Doubanjiang is the soul of this dish. Sichuan peppercorns create the \"ma\" numbing sensation — toast in a dry pan 2 minutes, then grind. Vegan version: skip the meat, add diced shiitake mushrooms.",
  },
  {
    id: "demo-kangkong",
    name: "Stir-Fried Kangkong (Water Spinach) with Garlic",
    category: "Sides",
    servings: 4,
    prepTime: "5 min",
    cookTime: "8 min",
    ingredients: [
      { amount: 1, unit: "lb", name: "kangkong (water spinach), stems and leaves separated" },
      { amount: 5, unit: null, name: "garlic cloves, minced" },
      { amount: 2, unit: "tbsp", name: "oyster sauce" },
      { amount: 1, unit: "tbsp", name: "Shaoxing rice wine or dry sherry" },
      { amount: 0.5, unit: "tsp", name: "sugar" },
      { amount: 2, unit: "tbsp", name: "neutral oil" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil, for finishing" },
      { amount: 1, unit: "tsp", name: "fish sauce or soy sauce" },
      { amount: 1, unit: "tsp", name: "red chili flakes or fresh chili, optional" },
    ],
    steps: [
      { title: "Prep the kangkong", content: "Trim off the tough lower stems and discard. Cut the remaining stems into 2-inch pieces, keeping them separate from the leafy tops. Wash well.", timer: null },
      { title: "Mix the sauce", content: "Mix together {0003}, {0004}, {0005}, and {0008} in a small bowl. Set aside.", timer: null },
      { title: "Stir-fry garlic", content: "Heat {0006} in a wok or large skillet over high heat until smoking. Add {0002} and stir-fry 15–20 seconds until fragrant but not brown.", timer: 20 },
      { title: "Cook the stems", content: "Add the kangkong stems first and stir-fry 1–2 minutes until slightly tender.", timer: 120 },
      { title: "Add leaves and sauce", content: "Add the leaves and pour the sauce over. Toss everything together on high heat for 1–2 minutes until the leaves are just wilted but still bright green — do not overcook, kangkong goes from perfect to mushy very quickly.", timer: 120 },
      { title: "Finish", content: "Drizzle with {0007}, toss once more, and serve immediately — kangkong does not hold well.", timer: null },
    ],
    notes: "Find kangkong (also called water spinach, ong choy, or morning glory) at H-Mart or 99 Ranch. High heat and speed are essential — this is a 5-minute cook once the pan is hot, so have everything prepped before you start.",
  },
  {
    id: "demo-caprese-pasta-salad",
    name: "Caprese Pasta Salad",
    category: "Sides",
    servings: 6,
    prepTime: "10 min",
    cookTime: "15 min",
    ingredients: [
      { amount: 12, unit: "oz", name: "short pasta (rotini, fusilli, or penne)" },
      { amount: 2, unit: "cup", name: "cherry or grape tomatoes, halved" },
      { amount: 8, unit: "oz", name: "fresh mozzarella balls (ciliegine or bocconcini), halved" },
      { amount: 0.5, unit: "cup", name: "fresh basil leaves, roughly torn" },
      { amount: 3, unit: "tbsp", name: "extra virgin olive oil" },
      { amount: 2, unit: "tbsp", name: "balsamic glaze (store-bought or reduced)" },
      { amount: 1, unit: null, name: "garlic clove, minced or grated" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 0.25, unit: "tsp", name: "red pepper flakes, optional" },
    ],
    steps: [
      { title: "Cook the pasta", content: "Bring heavily salted water to a boil. Cook {0001} until al dente. Drain, rinse under cold water, and toss immediately with a drizzle of olive oil to prevent clumping. Can be made up to 2 days ahead.", timer: null },
      { title: "Make the dressing", content: "Whisk together {0005}, {0006}, {0007}, {0008}, {0009}, and {0010} if using.", timer: null },
      { title: "Combine", content: "In a large bowl combine cooled pasta and {0002}. Pour the dressing over and toss gently. Add {0003} and fold in gently.", timer: null },
      { title: "Finish", content: "Add {0004} right before serving and toss once more. Finish with a pinch of flaky sea salt and an extra drizzle of olive oil.", timer: null },
      { title: "Serve", content: "Serve immediately at room temperature, or refrigerate 30 minutes for a cold salad. If making ahead, hold the basil and mozzarella until right before serving.", timer: null },
    ],
    notes: "Add basil last, always right before serving — it wilts and blackens quickly once cut. Rotini or fusilli are ideal since the spirals grab the dressing better than smooth shapes. If using balsamic vinegar instead of glaze, add 1 tsp honey to balance.",
  },
  {
    id: "demo-tuna-pasta-salad",
    name: "Tuna Pasta Salad",
    category: "Sides",
    servings: 6,
    prepTime: "10 min",
    cookTime: "15 min",
    ingredients: [
      { amount: 12, unit: "oz", name: "short pasta (rotini, elbow, or bowtie)" },
      { amount: 3, unit: null, name: "cans solid white albacore tuna in water (5 oz each), drained very well" },
      { amount: 0.33, unit: "cup", name: "mayonnaise" },
      { amount: 3, unit: "tbsp", name: "plain Greek yogurt (60/40 mayo-yogurt ratio)" },
      { amount: 2, unit: "tsp", name: "Dijon mustard" },
      { amount: 2, unit: "tbsp", name: "fresh lemon juice" },
      { amount: 2, unit: null, name: "celery stalks, finely diced" },
      { amount: 1, unit: null, name: "English or Persian cucumber, diced" },
      { amount: 3, unit: null, name: "green onions, sliced" },
      { amount: 2, unit: "tbsp", name: "canned jalapeños, diced" },
      { amount: 2, unit: "tbsp", name: "fresh dill (or 1 tsp dried)" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 0.25, unit: "tsp", name: "smoked paprika, for garnish" },
    ],
    steps: [
      { title: "Cook the pasta", content: "Cook {0001} in heavily salted boiling water until al dente. Drain and rinse under cold water. Toss with a drizzle of olive oil to prevent clumping. Can be done up to 2 days ahead.", timer: null },
      { title: "Drain the tuna", content: "Drain {0002} very well, pressing firmly against the can with the lid to remove as much water as possible. Break into chunks in a large bowl.", timer: null },
      { title: "Make the dressing", content: "Whisk together {0003}, {0004}, {0005}, {0006}, {0012}, and {0013} until smooth.", timer: null },
      { title: "Combine", content: "Add the cooled pasta, {0007}, {0008}, {0009}, {0010}, and {0011} to the tuna. Pour the dressing over and fold gently until everything is coated.", timer: null },
      { title: "Chill and serve", content: "Taste and adjust seasoning. Cover and refrigerate at least 30 minutes, ideally overnight. Stir well before serving, adding a splash of lemon juice or spoonful of mayo if it looks dry. Garnish with {0014}.", timer: 1800 },
    ],
    notes: "60/40 mayo-to-yogurt ratio is the sweet spot for creaminess without being too rich. Drain the tuna very well — excess water dilutes the dressing. This salad genuinely tastes better the next day as the pasta absorbs the dressing.",
  },
  {
    id: "demo-jujube-tea",
    name: "Jujube Tea with Ginger & Cinnamon",
    category: "Drinks",
    servings: 4,
    prepTime: "5 min",
    cookTime: "30 min–2 hrs",
    ingredients: [
      { amount: 20, unit: null, name: "dried jujubes (red dates)" },
      { amount: 8, unit: "cup", name: "water" },
      { amount: 1.5, unit: "oz", name: "fresh ginger, peeled and thinly sliced" },
      { amount: 2, unit: null, name: "cinnamon sticks" },
      { amount: 1, unit: "tbsp", name: "honey, or to taste" },
      { amount: 1, unit: "tbsp", name: "pine nuts, for garnish, optional" },
    ],
    steps: [
      { title: "Prep the jujubes", content: "Rinse {0001} under cool water. Score each one with a knife or slice in half — this helps release their natural sweetness into the tea.", timer: null },
      { title: "Combine and boil", content: "Add the jujubes, {0003}, and {0004} to a pot with {0002}. Bring to a boil over medium-high heat.", timer: null },
      { title: "Simmer", content: "Reduce heat to low and simmer partially covered. The longer you go, the deeper and richer the color and flavor — a minimum of 30 minutes works, 1.5–2 hours is ideal. The liquid should turn a deep reddish-brown.", timer: 5400 },
      { title: "Strain and sweeten", content: "Strain out the jujubes, ginger, and cinnamon. Taste and stir in {0005} as desired — the jujubes add natural sweetness so you may not need much.", timer: null },
      { title: "Serve", content: "Pour into cups. Float a few {0006} on top if using — they add a subtle nutty texture as you sip.", timer: null },
    ],
    notes: "A deeply warming tea drawn from Korean and Chinese tradition — tastes like chai met apple cider. Longer simmering deepens the color and flavor considerably.",
  },
  {
    id: "demo-roselle-cold-brew",
    name: "Roselle Red Dates Cold Brew",
    category: "Drinks",
    servings: 4,
    prepTime: "5 min",
    cookTime: "6 hrs–overnight",
    ingredients: [
      { amount: 3, unit: "tbsp", name: "dried roselle (hibiscus flowers)" },
      { amount: 15, unit: null, name: "red dates (jujubes), scored" },
      { amount: 1, unit: null, name: "slice fresh ginger" },
      { amount: 3, unit: null, name: "slices lemon" },
      { amount: 4, unit: "cup", name: "water, split: hot + room temperature" },
    ],
    steps: [
      { title: "Bloom", content: "Combine {0001}, {0002}, and {0003} in a pitcher or jar. Pour a small amount of hot water over them and let steep 1–2 minutes to bloom the ingredients.", timer: 120 },
      { title: "Fill", content: "Add room temperature water to fill the pitcher.", timer: null },
      { title: "Add lemon", content: "Add {0004} and stir gently.", timer: null },
      { title: "Cold brew", content: "Cover and refrigerate at least 6 hours or overnight. Serve over ice.", timer: null },
    ],
    notes: "Scoring the red dates helps release their natural sweetness. Roselle gives it a deep ruby color and tart hibiscus flavor — naturally caffeine-free. Add honey to taste if you prefer it sweeter. Find dried roselle (flor de jamaica) at Mexican or Asian grocery stores.",
  },
  {
    id: "demo-chicken-schmaltz",
    name: "Chicken Schmaltz & Gribenes (Rendered Chicken Fat)",
    category: "Pantry",
    servings: 4,
    prepTime: "5 min",
    cookTime: "45 min",
    ingredients: [
      { amount: 1, unit: "lb", name: "chicken skin, from deboned thighs or any chicken parts" },
      { amount: 2, unit: "tbsp", name: "water" },
      { amount: 1, unit: null, name: "small onion, thinly sliced, optional — adds flavor to the schmaltz" },
      { amount: 1, unit: "pinch", name: "kosher salt, for finishing the gribenes" },
    ],
    steps: [
      { title: "Cut the skin", content: "Cut chicken skin into roughly 1-inch pieces — smaller pieces render more efficiently and evenly.", timer: null },
      { title: "Start rendering", content: "Place the skin and {0002} in a heavy-bottomed pan or Dutch oven over low heat. The water prevents the skin from burning before the fat starts to render — no oil needed.", timer: null },
      { title: "Render low and slow", content: "Cook on low heat 30–40 minutes, stirring occasionally, until the pieces shrink and turn golden brown and the pan fills with clear liquid fat. Don't rush with high heat.", timer: 2100 },
      { title: "Add onion (optional)", content: "Add {0003} halfway through cooking. It caramelizes in the rendering fat and adds incredible flavor to the schmaltz.", timer: null },
      { title: "Finish the gribenes", content: "Once the skin is deep golden and crispy, remove with a slotted spoon and drain on paper towels. Sprinkle with {0004} immediately.", timer: null },
      { title: "Strain the schmaltz", content: "Strain the liquid fat through a fine mesh strainer into a clean glass jar. Let cool to room temperature, then refrigerate.", timer: null },
    ],
    notes: "Schmaltz keeps in the fridge up to 3 months, or freeze up to 1 year — use anywhere you'd use butter or oil. Gribenes are best eaten fresh and hot; they soften as they sit, so reheat in a dry pan or air fryer to re-crisp. Oven method: spread skin on a wire rack over a baking sheet, roast at 300°F for 40–50 minutes until golden and crispy, then pour the rendered fat from the pan into a jar. Reserve some raw skin instead to add directly to bone broth if you'd rather use it there — the collagen helps the broth gel.",
  },
  {
    id: "demo-chicken-bone-broth",
    name: "Chicken Bone Broth (Pressure Cooker)",
    category: "Pantry",
    servings: 8,
    prepTime: "10 min",
    cookTime: "2.5 hrs",
    ingredients: [
      { amount: 3, unit: "lb", name: "chicken bones (thigh, drumstick, carcass — raw or roasted)" },
      { amount: 2, unit: "tbsp", name: "apple cider vinegar" },
      { amount: 10, unit: "cup", name: "cold water, enough to cover bones, don't exceed max fill line" },
      { amount: 1, unit: null, name: "yellow onion, halved, no need to peel" },
      { amount: 1, unit: null, name: "whole garlic head, cut in half crosswise" },
      { amount: 2, unit: null, name: "celery stalks, roughly chopped" },
      { amount: 2, unit: null, name: "medium carrots, roughly chopped" },
      { amount: 3, unit: null, name: "slices fresh ginger" },
      { amount: 3, unit: null, name: "green onion bulbs, white parts" },
      { amount: 2, unit: null, name: "bay leaves" },
      { amount: 1, unit: "tsp", name: "black peppercorns" },
      { amount: 3, unit: null, name: "dried shiitake mushrooms, optional, adds umami" },
      { amount: 1, unit: null, name: "small piece kombu/dried kelp, optional, serious umami boost" },
      { amount: 5, unit: null, name: "red dates/jujubes, scored, optional, adds sweetness" },
    ],
    steps: [
      { title: "Roast the bones (optional but recommended)", content: "Roast bones at 425°F for 25–30 minutes until deep golden brown. Transfer directly to the pressure cooker — do not rinse. Deglaze the roasting pan with a splash of water, scrape up the browned bits, and pour that into the pressure cooker too.", timer: 1650 },
      { title: "Add everything else", content: "Add {0002} and all remaining ingredients to the pressure cooker along with {0003}. Cold water helps draw out more collagen and minerals. Do not add salt.", timer: null },
      { title: "Pressure cook", content: "Seal the lid and cook on HIGH pressure for 2–3 hours. Longer means more collagen and richer flavor.", timer: 9000 },
      { title: "Natural release", content: "Let the pressure release naturally for at least 30 minutes — don't force release.", timer: 1800 },
      { title: "Strain and chill", content: "Strain through a fine mesh strainer, lined with cheesecloth if you have it, and discard the solids. Let cool to room temperature, then refrigerate overnight. The fat will solidify on top for easy removal, and the broth should gel when cold — that's the sign it's rich in collagen.", timer: null },
    ],
    notes: "If the broth doesn't gel, simmer uncovered on the stovetop 30–60 minutes to reduce and concentrate. Don't add salt until you use the broth. Freeze in ice cube trays or 1–2 cup portions. Raw skin can go in directly alongside the bones for extra collagen. Red dates and ginger are a nod to Chinese bone broth tradition.",
  },
  {
    id: "demo-same-day-focaccia",
    name: "Same-Day Rosemary Focaccia",
    category: "Baking",
    servings: 8,
    prepTime: "20 min active + 2.5 hrs rise",
    cookTime: "25 min",
    ingredients: [
      { amount: 4, unit: "cup", name: "bread flour or all-purpose flour" },
      { amount: 2.25, unit: "tsp", name: "instant yeast" },
      { amount: 2, unit: "tsp", name: "sugar" },
      { amount: 2, unit: "tsp", name: "kosher salt" },
      { amount: 1.75, unit: "cup", name: "warm water (110°F)" },
      { amount: 0.5, unit: "cup", name: "extra virgin olive oil, for the dough" },
      { amount: 0.33, unit: "cup", name: "extra virgin olive oil, for the pan and top" },
      { amount: 3, unit: null, name: "fresh rosemary sprigs" },
      { amount: 1, unit: "tsp", name: "flaky sea salt (Maldon or fleur de sel)" },
      { amount: 3, unit: null, name: "garlic cloves, thinly sliced, optional" },
    ],
    steps: [
      { title: "Activate yeast", content: "In the bowl of a stand mixer (or large bowl) combine {0005} and {0003}. Sprinkle {0002} on top and stir gently. Let sit 5 minutes until foamy — if it doesn't foam, the yeast is dead, start over.", timer: 300 },
      { title: "Make the dough", content: "Add {0001}, {0004}, and {0006} to the yeast mixture. Mix on low with a dough hook until a shaggy dough forms, then increase to medium and knead 5–6 minutes until soft, elastic, and slightly tacky. By hand: stir until combined, then knead on a floured surface 8–10 minutes.", timer: 360 },
      { title: "First rise", content: "Coat a large bowl with olive oil, add the dough, and turn to coat. Cover and let rise in a warm spot 1 to 1.5 hours until doubled.", timer: 5400 },
      { title: "Pan and second rise", content: "Pour {0007} into a 9x13-inch baking pan generously. Transfer dough to the pan and gently stretch to fit — if it springs back, rest 10 minutes and try again. Dimple the surface all over with your fingertips, pressing nearly to the bottom. Drizzle a little more oil over the top, letting it pool in the dimples. Cover loosely and let rise another 45 minutes to 1 hour until puffy.", timer: 3300 },
      { title: "Top and bake", content: "Preheat oven to 425°F while the dough has its second rise. Once puffed, dimple again firmly. Press {0008} leaves and {0010} slices into the dimples. Sprinkle generously with {0009}. Bake 20–25 minutes until deep golden brown and the edges pull away from the pan.", timer: 1350 },
      { title: "Cool and serve", content: "Cool in the pan 10–15 minutes before transferring to a cutting board. Serve warm with extra olive oil for dipping. Best eaten same day — reheat at 350°F for 10 minutes to revive the crust.", timer: 900 },
    ],
    notes: "The olive oil quantity is not a typo — it's what creates the crispy bottom and rich flavor. The dimples are essential, hold the oil, and create the classic texture. Freezing: slice and freeze in zip-lock bags, reheat from frozen at 375°F for 12–15 minutes.",
  },
  {
    id: "demo-no-knead-focaccia",
    name: "No-Knead Same-Day Focaccia",
    category: "Baking",
    servings: 8,
    prepTime: "15 min active + rise",
    cookTime: "25 min",
    ingredients: [
      { amount: 4, unit: "cup", name: "all-purpose flour" },
      { amount: 2.25, unit: "tsp", name: "instant yeast (or active dry yeast)" },
      { amount: 2, unit: "tsp", name: "kosher salt" },
      { amount: 1, unit: "tsp", name: "honey or sugar" },
      { amount: 2, unit: "cup", name: "warm water (110°F)" },
      { amount: 0.25, unit: "cup", name: "extra virgin olive oil, for the dough" },
      { amount: 0.25, unit: "cup", name: "extra virgin olive oil, for the pan and top" },
      { amount: 3, unit: null, name: "fresh rosemary sprigs" },
      { amount: 1, unit: "tsp", name: "flaky sea salt" },
    ],
    steps: [
      { title: "Mix the dough", content: "In a large bowl, whisk {0002} (bloomed first in the warm water 5 minutes if using active dry yeast) with {0005}, {0004}, and {0003}. Add {0001} and {0006} and stir with a spatula until no dry flour remains — the dough will be very wet and sticky. Don't add more flour; that's correct for this high-hydration dough.", timer: null },
      { title: "Optional stretch and fold", content: "After 30 minutes of resting, wet your hand and pull one side of the dough up and fold it over itself. Rotate the bowl and repeat 4 times. This builds structure without kneading.", timer: 1800 },
      { title: "First rise", content: "Cover the bowl and let rise in a warm spot (a turned-off oven with the light on works well) 1.5 to 2 hours until doubled and bubbly.", timer: 6300 },
      { title: "Pan and second rise", content: "Pour {0007} into a 9x13-inch pan. Gently pour the dough in without deflating it too much, and let it spread naturally — don't force it into corners. Dimple all over with oiled fingertips. Cover and let rise 30–45 minutes until puffy.", timer: 2250 },
      { title: "Top and bake", content: "Preheat oven to 425°F. Press {0008} into the dimples and sprinkle with {0009}. Bake 20–25 minutes until deep golden brown.", timer: 1350 },
      { title: "Cool and serve", content: "Cool in the pan 10 minutes before slicing and serving.", timer: 600 },
    ],
    notes: "High hydration is what replaces kneading — the wet, sticky dough is exactly right. I recovered the ingredients and technique notes in full detail, but the exact wording of the pan/bake steps wasn't fully recoverable from the source, so I reconstructed them using the same method as the Same-Day Focaccia recipe, which uses this same high-hydration approach.",
  },
  {
    id: "demo-zucchini-bread",
    name: "Classic Moist Zucchini Bread",
    category: "Baking",
    servings: 2,
    prepTime: "20 min",
    cookTime: "55 min",
    ingredients: [
      { amount: 3, unit: "cup", name: "all-purpose flour" },
      { amount: 2, unit: "tsp", name: "ground cinnamon" },
      { amount: 1, unit: "tsp", name: "baking soda" },
      { amount: 0.5, unit: "tsp", name: "baking powder" },
      { amount: 1, unit: "tsp", name: "salt" },
      { amount: 3, unit: null, name: "large eggs, room temperature" },
      { amount: 1, unit: "cup", name: "vegetable or neutral oil" },
      { amount: 1, unit: "cup", name: "granulated sugar" },
      { amount: 0.5, unit: "cup", name: "light brown sugar, packed" },
      { amount: 2, unit: "tsp", name: "vanilla extract" },
      { amount: 2, unit: "cup", name: "zucchini, grated, about 2 medium — do not drain" },
      { amount: 0.75, unit: "cup", name: "walnuts or pecans, roughly chopped, optional" },
    ],
    steps: [
      { title: "Preheat and prep", content: "Preheat oven to 325°F. Grease two 8x4-inch loaf pans and line with parchment paper.", timer: null },
      { title: "Grate the zucchini", content: "Using the large holes of a box grater, grate {0011}. Do NOT squeeze or drain the liquid — the moisture is what makes the bread tender. Set aside.", timer: null },
      { title: "Mix dry ingredients", content: "In a large bowl, whisk together {0001}, {0002}, {0003}, {0004}, and {0005}.", timer: null },
      { title: "Mix wet ingredients", content: "In a separate bowl, whisk {0006}, {0007}, {0008}, {0009}, and {0010} until smooth.", timer: null },
      { title: "Combine", content: "Add the grated zucchini to the wet ingredients and fold to combine. Add the dry ingredients and stir just until no dry flour remains — don't overmix. Fold in {0012} if using.", timer: null },
      { title: "Bake", content: "Divide batter evenly between the two pans. Bake at 325°F for 50–60 minutes, until a toothpick comes out clean and the top springs back to the touch. Tent loosely with foil after 40 minutes if it's browning too fast.", timer: 3300 },
      { title: "Cool", content: "Cool in the pans 10 minutes, then turn out onto a wire rack. Let cool completely, at least 1 hour, before slicing.", timer: 3600 },
    ],
    notes: "Makes two loaves — eat one, freeze one. Do not drain the grated zucchini; its moisture is essential for the tender crumb.",
  },
  {
    id: "demo-chocolate-chip-cookies",
    name: "Perfect Chocolate Chip Cookies (By Weight)",
    category: "Baking",
    servings: 24,
    prepTime: "15 min + chill",
    cookTime: "12 min",
    ingredients: [
      { amount: 280, unit: "g", name: "all-purpose flour" },
      { amount: 5, unit: "g", name: "baking soda" },
      { amount: 3, unit: "g", name: "salt" },
      { amount: 227, unit: "g", name: "unsalted butter, softened to room temperature but still cool to the touch" },
      { amount: 200, unit: "g", name: "light brown sugar, packed" },
      { amount: 100, unit: "g", name: "granulated sugar" },
      { amount: 1, unit: null, name: "large egg" },
      { amount: 1, unit: null, name: "egg yolk — the extra yolk makes for a denser, chewier center" },
      { amount: 10, unit: "g", name: "pure vanilla extract" },
      { amount: 7, unit: "g", name: "honey or corn syrup, keeps the cookies chewy for days" },
      { amount: 280, unit: "g", name: "good quality dark or semi-sweet chocolate bar, roughly chopped into chunks" },
      { amount: 1, unit: "pinch", name: "flaky sea salt (Maldon), for finishing" },
    ],
    steps: [
      { title: "Whisk the dry ingredients", content: "Whisk together {0001}, {0002}, and {0003} in a medium bowl. Set aside.", timer: null },
      { title: "Cream the butter and sugars", content: "Beat {0004}, {0005}, and {0006} in a stand mixer on medium speed until smooth, about 2 minutes. Don't overbeat to pale and fluffy — that makes cakey cookies. You want it smooth like damp sand.", timer: 120 },
      { title: "Add eggs and flavor", content: "Beat in {0007}, {0008}, {0009}, and {0010} until just combined.", timer: null },
      { title: "Combine and add chocolate", content: "Add the dry ingredients to the wet ingredients and mix on low just until no dry flour remains. Fold in {0011} by hand.", timer: null },
      { title: "Chill the dough", content: "Cover and refrigerate the dough at least 30 minutes, up to 24–48 hours for deeper flavor. Chilling firms the fat so the cookies hold their shape and spread more slowly.", timer: 1800 },
      { title: "Portion and bake", content: "Preheat oven to 375°F. Scoop dough into balls (about 60g each) onto a parchment-lined sheet, spaced well apart. Bake 7 minutes.", timer: 420 },
      { title: "Bake with the pan-bang technique", content: "After 7 minutes, bang the pan firmly on the oven rack to create rippled edges. Bake 2 more minutes, bang again, then finish 2–3 more minutes. Edges should be golden brown; centers will look pale and slightly underdone — that's correct.", timer: 300 },
      { title: "Bang, salt, and cool", content: "Immediately upon removing from the oven, bang the baking sheet firmly on the counter to deflate and compress the centers. Sprinkle {0012} while still warm. Cool on the pan 5 minutes, then transfer to a wire rack.", timer: 300 },
    ],
    notes: "The pan-bang technique is the real unlock — it's a pastry-chef trick most home recipes skip. Weights are the standard baking conversion (125–135g per cup of flour); I recovered the full gram ingredient list along with the beginning and the pan-bang finishing steps in detail, but reconstructed the middle mixing steps using standard technique since the exact original wording for that section wasn't fully recoverable.",
  },
  {
    id: "demo-kikifoodies-bread",
    name: "KikiFoodies Homemade Bread Loaf",
    category: "Baking",
    servings: 1,
    prepTime: "2 hrs rise",
    cookTime: "30 min",
    ingredients: [
      { amount: 180, unit: "g", name: "water, room temperature (or warm if using active dry yeast)" },
      { amount: 3.5, unit: "g", name: "instant yeast, about 1 tsp" },
      { amount: 35, unit: "g", name: "sugar" },
      { amount: 300, unit: "g", name: "bread flour (all-purpose works but is less chewy)" },
      { amount: 16, unit: "g", name: "powdered milk (or sub with liquid milk)" },
      { amount: 4.5, unit: "g", name: "salt" },
      { amount: 30, unit: "g", name: "unsalted butter, room temperature" },
      { amount: 6.5, unit: "g", name: "neutral oil" },
    ],
    steps: [
      { title: "Mix the dough (stand mixer)", content: "Combine {0001}, {0002}, and {0003} in the mixer bowl and stir to dissolve. Add {0004}, {0005}, and {0006}. Mix on Speed 2 for 2 minutes, then Speed 4 for 2 more minutes. Add {0007} and {0008} and continue on Speed 4 for 4 minutes until smooth and elastic — test with the windowpane test: stretch a small piece, and if it stretches thin without tearing, it's ready.", timer: 480 },
      { title: "Bread machine alternative", content: "Add ingredients in this order: water, sugar, salt, oil, butter (cut into small pieces), flour, powdered milk. Make a small well in the flour and add yeast last, keeping it away from the salt and liquid. Select the DOUGH cycle only, then proceed to shaping once it ends.", timer: null },
      { title: "First rise", content: "Transfer the dough to a lightly oiled bowl. Cover and let rise in a warm spot until doubled, 1 to 1.5 hours. Skip this step if using a bread machine dough cycle — it handles the rise.", timer: 5400 },
      { title: "Shape", content: "Gently punch down the dough. On a clean surface, shape into a smooth log that fits your loaf pan. Place in a greased 8x4-inch loaf pan.", timer: null },
      { title: "Second rise", content: "Cover and let rise again until nearly doubled and just peeking above the pan rim, about 45 minutes to 1 hour. Meanwhile preheat oven to 350°F.", timer: 3000 },
      { title: "Bake", content: "Bake at 350°F for 30 minutes until golden brown, tenting loosely with foil if it browns too quickly. The loaf is done when it sounds hollow when tapped on the bottom.", timer: 1800 },
      { title: "Cool", content: "Turn out onto a wire rack and let cool at least 20 minutes before slicing.", timer: 1200 },
    ],
    notes: "Sourced from kikifoodies.com. Both stand mixer and bread machine methods are included — use whichever equipment you have. Powdered milk adds tenderness and a softer crumb; you can substitute an equal weight of liquid milk in place of some of the water if you don't have it on hand.",
  },
  {
    id: "demo-steamed-chicken-shiitake",
    name: "Chinese Steamed Chicken with Shiitake Mushrooms (香菇蒸滑雞)",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + soak",
    cookTime: "15 min",
    ingredients: [
      { amount: 1.5, unit: "lb", name: "boneless skinless chicken thighs, cut into 1-inch pieces" },
      { amount: 8, unit: null, name: "dried shiitake mushrooms (or 1 bag Trader Joe's Mushroom Medley, thawed and dried)" },
      { amount: 6, unit: null, name: "dried wood ear mushrooms, optional, adds crunch" },
      { amount: 1.5, unit: "tbsp", name: "light soy sauce" },
      { amount: 0.5, unit: "tsp", name: "dark soy sauce" },
      { amount: 1, unit: "tbsp", name: "oyster sauce" },
      { amount: 1, unit: "tbsp", name: "Shaoxing rice wine (or dry sherry)" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 1.5, unit: "tbsp", name: "cornstarch" },
      { amount: 4, unit: null, name: "slices fresh ginger" },
      { amount: 0.5, unit: "tsp", name: "sugar" },
      { amount: 0.25, unit: "tsp", name: "white pepper" },
      { amount: 1, unit: "tbsp", name: "neutral oil" },
      { amount: 2, unit: null, name: "green onions, sliced, for garnish" },
    ],
    steps: [
      { title: "Soak the mushrooms", content: "Rinse {0002} and {0003} and soak in warm water at least 20–30 minutes, or overnight in the fridge for best results. Once soft, remove and discard stems, slice shiitakes in half, and cut wood ear into bite-sized pieces. Reserve 2 tbsp of the soaking liquid. Skip this step if using Trader Joe's Mushroom Medley.", timer: 1800 },
      { title: "Marinate", content: "Pat the chicken dry. In a bowl combine {0004}, {0005}, {0006}, {0007}, {0008}, {0009}, {0010}, {0011}, {0012}, {0013}, and the 2 tbsp reserved mushroom soaking liquid. Mix well until the cornstarch dissolves. Add chicken and mushrooms, toss to coat, and marinate 20 minutes.", timer: 1200 },
      { title: "Arrange for steaming", content: "Spread the chicken and mushroom mixture in an even single layer on a shallow heatproof plate with a raised rim to catch the juices.", timer: null },
      { title: "Steam", content: "Set up a steamer: place a rack inside a wok or large pot and add 2 inches of water, bringing it to a boil. Carefully place the plate on the rack, cover tightly, and steam on high 12–15 minutes until the chicken is cooked through.", timer: 900 },
      { title: "Serve", content: "Remove carefully — the plate will be hot and full of savory broth. Scatter {0014} on top. Serve immediately over steamed jasmine rice, spooning the broth over the rice.", timer: null },
    ],
    notes: "Classic Cantonese home cooking — the mushroom soaking water going into the marinade is what gives it extra depth. Trader Joe's Mushroom Medley works as a shortcut if you don't want to soak dried mushrooms from scratch.",
  },
  {
    id: "demo-butter-basmati-rice",
    name: "Butter Basmati Rice",
    category: "Sides",
    servings: 4,
    prepTime: "5 min",
    cookTime: "20 min",
    ingredients: [
      { amount: 1.5, unit: "cup", name: "basmati rice" },
      { amount: 2, unit: "tbsp", name: "butter" },
      { amount: 2.25, unit: "cup", name: "water or chicken broth" },
      { amount: 0.5, unit: "tsp", name: "salt, adjust to taste" },
    ],
    steps: [
      { title: "Rinse", content: "Rinse {0001} in a fine-mesh strainer under cold water until the water runs clear.", timer: null },
      { title: "Toast", content: "In a pot, melt {0002} over medium heat. Add the rinsed rice and stir to coat, toasting 1–2 minutes until lightly fragrant.", timer: 90 },
      { title: "Simmer", content: "Pour in {0003} and {0004}. Bring to a boil, then reduce heat to low, cover, and simmer 15 minutes until tender and the liquid is absorbed.", timer: 900 },
      { title: "Rest and fluff", content: "Remove from heat and rest, covered, 5 minutes — this locks in the fluffy texture, so don't skip it even though it's tempting to dig in right away. Fluff with a fork before serving.", timer: 300 },
    ],
    notes: "This is the same base technique as the Turmeric Basmati Rice recipe, just without the spices — I used the same verified ratio since the two recipes share the identical method. Rice cooker version: use a slightly wetter ratio, about 1 cup rice to 1.5–1.75 cups water, and add butter directly to the bowl; let it rest 5–10 minutes after the cycle ends before opening the lid.",
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
            <h1 className="rb-title">Recipe Book</h1>
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
            All 38 recipes are back! A handful have a small flagged note where exact original wording wasn't fully recoverable — worth a quick check the first time you make those.
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
