import { useState, useEffect, useMemo } from "react";

const STORAGE_KEY = "thomas-recipe-book";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Drink", "Other"];

const DEFAULT_RECIPES = [
  {
    id: "demo-1",
    name: "Classic Oatmeal Bowl",
    category: "Breakfast",
    servings: 1,
    prepTime: "5 min",
    cookTime: "5 min",
    favorite: false,
    ingredients: [
      { amount: 0.5, unit: "cup", name: "rolled oats" },
      { amount: 1, unit: "cup", name: "water or milk" },
      { amount: 1, unit: "tbsp", name: "honey" },
      { amount: 0.5, unit: "cup", name: "fresh berries" },
    ],
    steps: ["Bring liquid to a boil.", "Add oats, reduce heat, cook 3–5 min.", "Top with honey and berries."],
    notes: "Great for intermittent fasting — break your fast gently.",
  },
  {
    id: "demo-2",
    name: "Jujube Tea with Ginger & Cinnamon",
    category: "Drink",
    servings: 4,
    prepTime: "5 min",
    cookTime: "1.5–2 hrs",
    favorite: false,
    ingredients: [
      { amount: 20, unit: "", name: "dried jujubes (red dates)" },
      { amount: 8, unit: "cup", name: "water" },
      { amount: 1.5, unit: "oz", name: "fresh ginger, peeled and sliced thin" },
      { amount: 2, unit: "", name: "cinnamon sticks" },
      { amount: 1, unit: "tbsp", name: "honey (or to taste)" },
      { amount: 1, unit: "tbsp", name: "pine nuts, for garnish (optional)" },
    ],
    steps: [
      "Rinse jujubes under cool water. Score each one with a knife or slice in half to help release their natural sweetness.",
      "Add jujubes, ginger, and cinnamon sticks to a pot with water. Bring to a boil over medium-high heat.",
      "Reduce heat to low and simmer partially covered for 1.5–2 hours. Liquid should turn a deep reddish-brown.",
      "Strain out the jujubes, ginger, and cinnamon. Stir in honey to taste.",
      "Pour into cups. Float a few pine nuts on top if using. Serve hot or refrigerate for iced tea.",
    ],
    notes: "Keeps in the fridge for up to a week. Slow cooker option: cook on high for 4 hours. More ginger = more heat; more jujubes = sweeter. The cooked jujubes are edible — pop them in your mouth as you sip.",
  },
  {
    id: "demo-3",
    name: "Din Tai Fung Spicy Cucumbers (Copycat)",
    category: "Snack",
    servings: 4,
    prepTime: "10 min",
    cookTime: "4 hrs marinate",
    favorite: false,
    ingredients: [
      { amount: 4, unit: "", name: "Persian or English cucumbers, sliced into ½-inch rounds" },
      { amount: 1.5, unit: "tbsp", name: "kosher salt (for salting)" },
      { amount: 3, unit: "tbsp", name: "rice vinegar" },
      { amount: 2, unit: "tbsp", name: "mirin" },
      { amount: 1, unit: "tbsp", name: "sugar" },
      { amount: 1, unit: "tbsp", name: "sesame oil" },
      { amount: 2, unit: "", name: "garlic cloves, minced or grated" },
      { amount: 0.25, unit: "tsp", name: "kosher salt (for dressing)" },
      { amount: 2, unit: "tbsp", name: "chili oil (drizzled at serving)" },
      { amount: 1, unit: "", name: "Fresno chili pepper, thinly sliced (garnish)" },
    ],
    steps: [
      "Add sliced cucumbers to a bowl. Sprinkle with 1½ tbsp kosher salt and toss to combine. Let sit for 30 minutes in the refrigerator.",
      "Rinse off the salt mixture thoroughly and pat the cucumbers completely dry with paper towels.",
      "In a small bowl, whisk together rice vinegar, mirin, sugar, sesame oil, garlic, and ¼ tsp salt until sugar dissolves.",
      "Toss the dried cucumbers with the dressing. Cover and marinate in the refrigerator for a minimum of 4 hours, or up to 2 days. The longer they sit, the more flavor they absorb.",
      "To serve: taste for seasoning and add more salt if needed. Stack cucumbers in a layered pile on a plate. Drizzle with chili oil and top with sliced Fresno chili. Serve chilled.",
    ],
    notes: "The 4-hour marinate is the key to authentic flavor — don't rush it. The chili oil goes on at serving, not in the marinade. Persian cucumbers work best: seedless, sweet, less watery. You can assemble the cucumber tower up to 1 hour before serving; add the chili oil and pepper right before eating. Keeps up to 2 days in the fridge.",
  },
  {
    id: "demo-4",
    name: "Sigeumchi Namul (Korean Spinach)",
    category: "Snack",
    servings: 4,
    prepTime: "5 min",
    cookTime: "5 min",
    favorite: false,
    ingredients: [
      { amount: 10, unit: "oz", name: "fresh spinach, roots trimmed and washed" },
      { amount: 1, unit: "tsp", name: "salt (for blanching water)" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tbsp", name: "toasted sesame oil" },
      { amount: 2, unit: "", name: "garlic cloves, minced" },
      { amount: 2, unit: "", name: "green onions, thinly sliced" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds" },
    ],
    steps: [
      "Bring a large pot of water to a boil. Add 1 tsp salt. Blanch spinach for exactly 30 seconds, stirring with a spoon.",
      "Drain immediately and rinse under cold running water 2–3 times to stop cooking and remove any dirt. Squeeze out excess water firmly with your hands.",
      "Cut the spinach a few times into bite-sized pieces.",
      "In a mixing bowl, combine soy sauce, sesame oil, garlic, and green onions. Add the spinach and mix thoroughly by hand until every leaf is coated.",
      "Transfer to a serving dish and sprinkle with sesame seeds. Serve at room temperature or chilled.",
    ],
    notes: "Can be made with baby spinach (skip the cutting step). Keeps in the fridge up to 4 days. For a spicier version, add 1 tsp gochugaru. Great in bibimbap. Don't over-blanch — 30 seconds keeps it vibrant green and slightly crisp.",
  },
  {
    id: "demo-5",
    name: "Gamja Jorim (Korean Braised Potatoes)",
    category: "Snack",
    servings: 4,
    prepTime: "10 min",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 1.5, unit: "lb", name: "Yukon Gold or baby potatoes, cut into 1-inch pieces" },
      { amount: 1, unit: "tbsp", name: "neutral oil" },
      { amount: 3, unit: "tbsp", name: "soy sauce" },
      { amount: 2, unit: "tbsp", name: "mirin" },
      { amount: 1, unit: "tbsp", name: "sugar" },
      { amount: 0.5, unit: "cup", name: "water" },
      { amount: 3, unit: "", name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds" },
      { amount: 2, unit: "", name: "green onions, sliced (garnish)" },
    ],
    steps: [
      "Rinse potato pieces in cold water to remove excess starch. Pat dry.",
      "In a small bowl, mix soy sauce, mirin, sugar, water, and garlic until sugar dissolves.",
      "Heat oil in a nonstick pan over medium-high heat. Add potatoes and sauté 4–5 minutes, stirring occasionally, until they start to turn golden on the edges.",
      "Pour in the sauce and bring to a simmer. Cook uncovered for 7–8 minutes, stirring occasionally, until potatoes are fork-tender and the sauce has thickened into a sticky glaze. If the sauce reduces too fast, add a splash more water.",
      "Finish with sesame oil and toss to coat. Transfer to a plate and garnish with sesame seeds and green onions. Serve warm or at room temperature.",
    ],
    notes: "Yukon Gold and baby potatoes hold their shape best. Avoid russets unless you soak them in water first to draw out starch. For a spicy version, add 1–2 tsp gochugaru to the sauce. Stores 3–4 days in the fridge — great cold or reheated.",
  },
  {
    id: "demo-6",
    name: "Mayak Gyeran (Korean Marinated Eggs)",
    category: "Snack",
    servings: 6,
    prepTime: "15 min",
    cookTime: "6 min + overnight",
    favorite: false,
    ingredients: [
      { amount: 6, unit: "", name: "large eggs, room temperature" },
      { amount: 1, unit: "tsp", name: "white vinegar (for boiling)" },
      { amount: 0.5, unit: "cup", name: "soy sauce" },
      { amount: 0.5, unit: "cup", name: "water" },
      { amount: 3, unit: "tbsp", name: "honey (or rice syrup)" },
      { amount: 3, unit: "", name: "garlic cloves, minced" },
      { amount: 3, unit: "", name: "green onions, sliced" },
      { amount: 1, unit: "", name: "red chili pepper, thinly sliced" },
      { amount: 1, unit: "", name: "green chili pepper, thinly sliced" },
      { amount: 1, unit: "tbsp", name: "toasted sesame seeds" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil (for serving)" },
    ],
    steps: [
      "Fill a pot with enough water to cover eggs. Add vinegar and bring to a boil. Carefully lower in eggs and simmer for exactly 6 minutes for a jammy yolk.",
      "Immediately transfer eggs to a bowl of ice water and let sit for at least 10 minutes. Peel carefully.",
      "In a container or jar, combine soy sauce, water, honey, garlic, green onions, chili peppers, and sesame seeds. Stir until honey is dissolved.",
      "Place peeled eggs into the container. Make sure eggs are fully submerged — weigh them down with plastic wrap if needed. Cover and refrigerate overnight (minimum 6 hours).",
      "Serve over hot steamed rice with a spoonful of marinade spooned on top. Drizzle with sesame oil. Cut in half to reveal the jammy yolk.",
    ],
    notes: "Mayak means 'drug' in Korean — named for how addictive these are. The marinade can be reused for a second batch within the same week. Keeps 3–5 days in the fridge. For hard-boiled eggs, cook 10 minutes. Great on ramen, bibimbap, or eaten straight as a snack.",
  },

  {
    id: "demo-7",
    name: "Gungoguma (Viral Korean Roasted Sweet Potato)",
    category: "Snack",
    servings: 2,
    prepTime: "2 min",
    cookTime: "45 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "", name: "Korean or Japanese sweet potatoes (purple skin, yellow flesh)" },
    ],
    steps: [
      "Preheat oven to 375°F. Wash the sweet potatoes and trim off both ends, exposing about a quarter-inch of flesh on each side.",
      "Place sweet potatoes directly on the oven rack (or a baking sheet). Roast at 375°F for 20 minutes.",
      "While the potatoes roast, prepare an ice bath: fill a large bowl with cold water and ice cubes.",
      "After 20 minutes, remove potatoes from the oven and immediately transfer them to the ice bath using tongs. Let them sit for exactly 2 minutes. Crank oven temperature up to 425°F.",
      "Remove potatoes from the ice bath and return them to the oven. Roast at 425°F for another 25 minutes.",
      "Remove from oven and let rest 2–3 minutes. The skin should peel off effortlessly with your fingers. Eat as-is or serve with kimchi, a pinch of salt, or chili crisp.",
    ],
    notes: "Korean sweet potatoes (goguma) have purple skin and yellow flesh — find them at H-Mart or Asian grocery stores. Regular garnet sweet potatoes work too. The ice bath creates a pocket between skin and flesh making it peel-off-in-seconds easy. The main benefit is texture and peelability — great for meal prep if you're using the flesh for bowls or mash. Pairs well with kimchi per the original creator.",
  },

  {
    id: "demo-8",
    name: "Chipotle Chicken Copycat",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "10 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 4, unit: "tbsp", name: "adobo sauce (from a can of chipotle peppers in adobo)" },
      { amount: 2, unit: "tbsp", name: "olive oil" },
      { amount: 4, unit: "", name: "garlic cloves, minced" },
      { amount: 1, unit: "tbsp", name: "ancho chili powder (or regular chili powder)" },
      { amount: 1.5, unit: "tsp", name: "ground cumin" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: "tbsp", name: "distilled white vinegar" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
    ],
    steps: [
      "Blend adobo sauce, olive oil, garlic, ancho chili powder, cumin, oregano, vinegar, salt, and pepper in a blender or food processor until smooth.",
      "Add chicken thighs to a zip-top bag or bowl. Pour marinade over and coat well. Marinate in the fridge for at least 30 minutes — 4 to 6 hours is ideal, overnight is even better.",
      "Heat grill to medium-high (450–500°F). Remove chicken from marinade and let excess drip off. Grill smooth-side down for 4–5 minutes until dark grill marks appear. Flip and cook another 3–5 minutes until internal temp reaches 165°F.",
      "Transfer to a cutting board and rest 5 minutes. Chop into bite-sized pieces. Season with a pinch more salt if needed. Serve in bowls, tacos, or over rice.",
    ],
    notes: "Stovetop option: Sear in a cast iron skillet over medium-high, 5–6 min per side. Add a splash of water and scrape the pan for all the crispy bits. Spice level: adobo sauce alone is mild-medium. For more heat, blend in 1–2 whole chipotle peppers. Ancho chili powder is smokier than regular — worth finding in the Mexican foods aisle. Meal prep: keeps 4–5 days in fridge or 3 months frozen. Great for burrito bowls with cilantro lime rice, corn salsa, black beans, and guac.",
  },

  {
    id: "demo-9",
    name: "Gà Nướng Xả (Vietnamese Lemongrass Grilled Chicken)",
    category: "Dinner",
    servings: 4,
    prepTime: "15 min + marinate",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 3, unit: "", name: "lemongrass stalks, white/pale parts only, finely minced" },
      { amount: 4, unit: "", name: "garlic cloves, minced" },
      { amount: 1, unit: "", name: "shallot, minced" },
      { amount: 2, unit: "tbsp", name: "fish sauce" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1.5, unit: "tbsp", name: "honey or brown sugar" },
      { amount: 1, unit: "tbsp", name: "neutral oil" },
      { amount: 0.5, unit: "tsp", name: "Chinese five-spice powder" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "tsp", name: "chili garlic sauce (optional, for heat)" },
    ],
    steps: [
      "Peel off the tough outer layers of the lemongrass stalks and trim the tops, keeping only the pale lower third. Mince as finely as possible — you want almost a paste. A food processor works great: pre-slice into small rounds first, then pulse with garlic and shallot until finely minced.",
      "In a large bowl combine the lemongrass-garlic-shallot paste with fish sauce, soy sauce, honey, oil, five-spice, black pepper, and chili garlic sauce if using. Mix well.",
      "Add chicken thighs and coat thoroughly. Marinate in the fridge for at least 2 hours — overnight is ideal. The sugar caramelizes into that signature char.",
      "Preheat grill to medium heat (not high — the sugar and lemongrass burn easily). Scrape off excess lemongrass pieces from the chicken before grilling to prevent charring. Lightly oil the grates. Grill 5–7 minutes per side until internal temp reaches 165°F.",
      "Rest 5 minutes, then slice or serve whole. Serve over jasmine rice or rice vermicelli with fresh cucumber, cilantro, mint, and nuoc cham on the side.",
    ],
    notes: "No lemongrass? Sub 1 tbsp lemon zest + 1 tsp fresh grated ginger per stalk. Frozen minced lemongrass or jarred lemongrass paste also work well. Five-spice is the secret to authentic flavor — don't skip it. Grill on medium, not high — the marinade burns easily. Quick nuoc cham: mix 3 tbsp fish sauce + 2 tbsp lime juice + 2 tbsp sugar + 4 tbsp water + 1 minced garlic + sliced chili. Serve as Cơm Gà Nướng (rice bowl), Bún Gà Nướng (noodle bowl), or in a Bánh Mì.",
  },

  {
    id: "demo-10",
    name: "Pollo a la Brasa (Peruvian Grilled Chicken)",
    category: "Dinner",
    servings: 4,
    prepTime: "15 min + marinate",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 3, unit: "tbsp", name: "soy sauce" },
      { amount: 3, unit: "tbsp", name: "lime juice (about 2 limes)" },
      { amount: 2, unit: "tbsp", name: "olive oil" },
      { amount: 5, unit: "", name: "garlic cloves, minced" },
      { amount: 1.5, unit: "tsp", name: "ground cumin" },
      { amount: 1, unit: "tsp", name: "smoked paprika" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 1, unit: "tsp", name: "honey or brown sugar" },
      { amount: 1, unit: "cup", name: "fresh cilantro, packed (for green sauce)" },
      { amount: 1, unit: "", name: "jalapeño, roughly chopped, seeds removed (for green sauce)" },
      { amount: 1, unit: "", name: "garlic clove (for green sauce)" },
      { amount: 0.25, unit: "cup", name: "sour cream or Greek yogurt (for green sauce)" },
      { amount: 2, unit: "tbsp", name: "olive oil (for green sauce)" },
      { amount: 1, unit: "tbsp", name: "lime juice (for green sauce)" },
      { amount: 1, unit: "pinch", name: "salt and pepper to taste (for green sauce)" },
    ],
    steps: [
      "Blend or whisk together soy sauce, lime juice, olive oil, garlic, cumin, smoked paprika, oregano, black pepper, salt, and honey until smooth.",
      "Add chicken thighs to a zip-top bag and pour in the marinade. Coat well. Marinate in the fridge for at least 4 hours — overnight (12–24 hours) is ideal for the deepest flavor.",
      "Make the aji verde: Blend cilantro, jalapeño, garlic clove, sour cream, olive oil, lime juice, salt and pepper in a blender or food processor until smooth and creamy. Taste and adjust seasoning. Refrigerate until serving — it gets better as it sits.",
      "Preheat grill to medium-high. Remove chicken from marinade and let excess drip off. Grill 5–7 minutes per side until nicely charred and internal temp reaches 165°F. Rest 5 minutes before slicing.",
      "Slice chicken and serve with aji verde drizzled on top or on the side. Pairs perfectly with rice, fries, or a simple salad.",
    ],
    notes: "Oven method: Roast at 425°F on a wire rack for 30–35 minutes, then broil 2–3 minutes for char. Soy sauce is authentic — Chinese immigration to Peru in the 19th century made it a classic ingredient. For more authentic flavor, add 1 tbsp aji amarillo or aji panca paste to the marinade. The aji verde is incredible on fries, rice, or as a salad dressing — make a double batch. Chicken keeps 4–5 days in the fridge; green sauce keeps 1 week.",
  },

  {
    id: "demo-11",
    name: "Slow Cooker Chicken Shawarma",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "4–6 hrs",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 1, unit: "", name: "yellow onion, thinly sliced" },
      { amount: 0.33, unit: "cup", name: "plain Greek yogurt" },
      { amount: 3, unit: "tbsp", name: "lemon juice" },
      { amount: 3, unit: "", name: "garlic cloves, minced" },
      { amount: 2, unit: "tbsp", name: "olive oil" },
      { amount: 2, unit: "tsp", name: "smoked paprika" },
      { amount: 2, unit: "tsp", name: "ground cumin" },
      { amount: 1, unit: "tsp", name: "ground coriander" },
      { amount: 0.5, unit: "tsp", name: "cinnamon" },
      { amount: 0.5, unit: "tsp", name: "turmeric" },
      { amount: 0.5, unit: "tsp", name: "allspice" },
      { amount: 0.5, unit: "tsp", name: "cayenne pepper (optional)" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
    ],
    steps: [
      "In a large bowl, whisk together Greek yogurt, lemon juice, garlic, olive oil, and all spices. Add chicken thighs and coat well. Marinate in the fridge for at least 4 hours or overnight — this step is key.",
      "Layer sliced onion on the bottom of the slow cooker. Place marinated chicken on top.",
      "Cook on LOW for 4–6 hours or HIGH for 3–4 hours, until chicken reaches 165°F and shreds easily.",
      "Remove chicken to a cutting board and roughly chop or shred. Return to slow cooker and stir into the onions and juices. Let sit 10 minutes to absorb flavors.",
      "Optional: For charred edges, spread chicken on a foil-lined sheet pan and broil 5–7 minutes until browned and crispy. Serve in warm pita or over rice with cucumber, tomato, red onion, and a yogurt sauce.",
    ],
    notes: "Serve as a pita wrap, rice bowl, or salad. Quick yogurt sauce: mix 1 cup Greek yogurt + 1 minced garlic clove + 1 tbsp lemon juice + salt + a little grated cucumber. The broiling step at the end is optional but adds that authentic charred shawarma texture. Keeps 4–5 days in the fridge, 3 months frozen.",
  },
  {
    id: "demo-12",
    name: "Slow Cooker Buffalo Chicken",
    category: "Dinner",
    servings: 6,
    prepTime: "5 min",
    cookTime: "3–6 hrs",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 0.75, unit: "cup", name: "Frank's RedHot buffalo sauce (or your favorite)" },
      { amount: 2, unit: "tbsp", name: "unsalted butter, cut into pats" },
      { amount: 1, unit: "", name: "packet ranch seasoning (or 2 tbsp homemade)" },
      { amount: 1, unit: "tsp", name: "garlic powder" },
      { amount: 0.5, unit: "tsp", name: "onion powder" },
    ],
    steps: [
      "Place chicken thighs in the bottom of the slow cooker in a single layer.",
      "Sprinkle ranch seasoning, garlic powder, and onion powder over the chicken. Pour buffalo sauce over top and add butter pats.",
      "Cook on HIGH for 3–4 hours or LOW for 5–6 hours, until chicken shreds easily with a fork.",
      "Shred chicken directly in the slow cooker using two forks. Stir to coat with the sauce. Let sit on warm 15 minutes for the chicken to absorb the juices.",
      "Serve on sandwiches, in wraps, over rice, on salads, in quesadillas, or as a dip with crackers.",
    ],
    notes: "One of the most versatile meal prep recipes out there. Thighs stay juicier than breasts in the slow cooker. Dial down the heat by using less hot sauce and stirring in a tablespoon of sour cream or ranch dressing at the end. Keeps 4–5 days in the fridge, 3 months frozen. Great for wraps, quesadillas, pizza, nachos, loaded fries, or stuffed in a baked potato.",
  },

  {
    id: "demo-13",
    name: "Roselle Red Dates Cold Brew",
    category: "Drink",
    servings: 4,
    prepTime: "5 min",
    cookTime: "6 hrs–overnight",
    favorite: false,
    ingredients: [
      { amount: 3, unit: "tbsp", name: "dried roselle (hibiscus flowers)" },
      { amount: 15, unit: "", name: "red dates (jujubes), scored" },
      { amount: 1, unit: "", name: "slice fresh ginger" },
      { amount: 3, unit: "", name: "slices lemon" },
      { amount: 4, unit: "cup", name: "water (split: hot + room temp)" },
    ],
    steps: [
      "Combine roselle, scored red dates, and ginger in a pitcher or jar. Pour a small amount of hot water over them and let steep for 1–2 minutes to bloom the ingredients.",
      "Add room temperature water to fill the pitcher.",
      "Add lemon slices and stir gently.",
      "Cover and refrigerate for at least 6 hours or overnight. Serve over ice.",
    ],
    notes: "Scoring the red dates helps release their natural sweetness into the brew. The hot water bloom at the start extracts flavor quickly before the cold steep does the rest. Roselle gives it a deep ruby color and tart hibiscus flavor — naturally caffeine-free. Add honey to taste if you prefer it sweeter. Find dried roselle (flor de jamaica) at Mexican or Asian grocery stores.",
  },

  {
    id: "demo-14",
    name: "Eomuk Bokkeum (Korean Fish Cake Stir-Fry)",
    category: "Snack",
    servings: 4,
    prepTime: "5 min",
    cookTime: "10 min",
    favorite: false,
    ingredients: [
      { amount: 8, unit: "oz", name: "Korean fish cake sheets (eomuk/odeng), frozen section at H-Mart" },
      { amount: 0.5, unit: "", name: "yellow onion, thinly sliced" },
      { amount: 1, unit: "", name: "carrot, cut into matchsticks" },
      { amount: 3, unit: "", name: "green onions, cut into 1-inch pieces" },
      { amount: 3, unit: "", name: "garlic cloves, minced" },
      { amount: 1, unit: "tbsp", name: "neutral oil" },
      { amount: 2, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tbsp", name: "mirin or rice wine" },
      { amount: 1, unit: "tsp", name: "sugar" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds" },
      { amount: 2, unit: "tbsp", name: "water" },
      { amount: 1, unit: "tsp", name: "gochugaru or gochujang (optional, for spicy version)" },
    ],
    steps: [
      "Briefly blanch fish cake sheets in boiling water for 30 seconds. Drain and let cool. This removes excess oil and softens them. Cut into thin strips or bite-sized pieces.",
      "In a small bowl, mix soy sauce, mirin, sugar, and sesame oil until sugar dissolves. Set aside.",
      "Heat oil in a skillet or wok over medium-high heat. Add garlic, onion, and carrot. Stir-fry for 1–2 minutes until slightly softened.",
      "Add fish cake and green onions. Stir-fry for 1–2 minutes.",
      "Pour sauce over everything and add 2 tbsp water directly to the pan. The water creates steam that helps the sauce absorb evenly and keeps the fish cake from drying out. Stir quickly and cook for about 1 minute until sauce is absorbed and everything is well coated. Remove from heat, sprinkle with sesame seeds, and serve.",
    ],
    notes: "For the spicy version, add 1 tsp gochugaru or a small spoonful of gochujang to the sauce. Find fish cake sheets in the frozen section at H-Mart or 99 Ranch — thin rectangular sheets work best. A splash of water during stir-frying prevents the fish cake from hardening in the fridge later. Keeps 3–4 days refrigerated — actually tastes better the next day as the sauce soaks in. Serve cold or lightly reheated.",
  },

  {
    id: "demo-15",
    name: "Dakgalbi (Korean Spicy Chicken Stir-Fry)",
    category: "Dinner",
    servings: 4,
    prepTime: "15 min + marinate",
    cookTime: "20 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs, cut into bite-sized pieces" },
      { amount: 3, unit: "tbsp", name: "gochujang (Korean red chili paste)" },
      { amount: 1, unit: "tbsp", name: "gochugaru (Korean red pepper flakes)" },
      { amount: 0.5, unit: "tsp", name: "curry powder" },
      { amount: 2, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tbsp", name: "mirin or rice wine" },
      { amount: 1, unit: "tbsp", name: "brown sugar" },
      { amount: 1, unit: "tbsp", name: "sesame oil" },
      { amount: 4, unit: "", name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "fresh ginger, grated" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "cup", name: "Korean rice cakes (tteokbokki tteok), soaked in water 10 min" },
      { amount: 1, unit: "", name: "small Korean sweet potato, cut into wedges" },
      { amount: 2, unit: "cup", name: "green cabbage, roughly chopped" },
      { amount: 0.5, unit: "", name: "yellow onion, sliced" },
      { amount: 0.5, unit: "cup", name: "perilla (kkaennip) or basil leaves" },
      { amount: 2, unit: "tbsp", name: "neutral oil" },
      { amount: 0.5, unit: "cup", name: "shredded mozzarella (optional, for cheese dakgalbi)" },
    ],
    steps: [
      "Mix gochujang, gochugaru, curry powder, soy sauce, mirin, brown sugar, sesame oil, garlic, ginger, and black pepper in a bowl. Add chicken and coat well. Marinate at least 30 minutes — 1 hour is better.",
      "Soak rice cakes in water for 10 minutes. Drain and set aside.",
      "Heat oil in a large cast iron skillet over medium-high heat. Add sweet potato, onion, cabbage, and rice cakes. Stir-fry 3–4 minutes until slightly softened.",
      "Add marinated chicken on top and stir everything together. Cook on medium-high for 6–8 minutes, stirring often, until chicken is cooked through and rice cakes are tender. If the pan gets too dry, add a splash of water.",
      "Add perilla leaves and stir for the last minute of cooking. Optional: push everything to the sides and pile mozzarella in the center. Cover with a lid for 1–2 minutes until melted. Serve with rice and kimchi.",
      "Bonus fried rice: Once you've eaten most of the dish, add 1 cup cooked rice to the pan with remaining sauce. Stir-fry over medium heat until the rice is coated and slightly crispy. Drizzle sesame oil and top with crumbled seaweed and sesame seeds.",
    ],
    notes: "Originating from Chuncheon, Korea — this is a legendary dish. Curry powder is the authentic Chuncheon-style secret ingredient. Perilla leaves (kkaennip) are traditional — find at H-Mart, or substitute with fresh basil. Cheese dakgalbi (with mozzarella) is the modern restaurant version and is incredible. Cast iron skillet gives the best caramelized edges. Keeps 2–3 days in the fridge.",
  },
  {
    id: "demo-16",
    name: "Gochujang Chicken Thighs",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 3, unit: "tbsp", name: "gochujang (Korean red chili paste)" },
      { amount: 1, unit: "tbsp", name: "gochugaru (Korean red pepper flakes)" },
      { amount: 2, unit: "tbsp", name: "soy sauce" },
      { amount: 2, unit: "tbsp", name: "brown sugar" },
      { amount: 1, unit: "tbsp", name: "toasted sesame oil" },
      { amount: 1, unit: "tbsp", name: "rice vinegar" },
      { amount: 4, unit: "", name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "fresh ginger, grated" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "tbsp", name: "neutral oil (for cooking)" },
      { amount: 2, unit: "", name: "green onions, sliced (garnish)" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds (garnish)" },
    ],
    steps: [
      "In a bowl, combine gochujang, gochugaru, soy sauce, brown sugar, sesame oil, rice vinegar, garlic, ginger, and black pepper. Mix well.",
      "Add chicken thighs and coat thoroughly. Marinate at least 30 minutes in the fridge — up to 8 hours for deeper flavor.",
      "Stovetop: Heat neutral oil in a cast iron or heavy skillet over medium-high heat. Add chicken and cook undisturbed 4–5 minutes until a caramelized crust forms. Flip and cook another 4–5 minutes until 165°F internal. Don't rush the flip — it'll release when ready.",
      "Oven option: Roast at 425°F on a wire rack for 25–30 minutes, then broil 2–3 minutes for char.",
      "Rest 5 minutes before slicing. Garnish with green onions and sesame seeds. Serve over jasmine rice with cucumber salad or pickled radish.",
    ],
    notes: "The sugar in gochujang caramelizes fast — medium-high heat is the sweet spot. Don't try to flip early or the crust will tear — let it release naturally. Can be grilled: 4–5 min per side at 400°F. Oven works great too at 425°F. Freeze in the marinade for up to 2 months — thaw and cook straight from fridge. Pairs well with your DTF cucumbers or kongnamul banchan.",
  },
  {
    id: "demo-17",
    name: "Dak Bulgogi (Korean BBQ Chicken)",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "10 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs" },
      { amount: 3, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tbsp", name: "mirin" },
      { amount: 1, unit: "tbsp", name: "brown sugar" },
      { amount: 1, unit: "tbsp", name: "honey" },
      { amount: 1, unit: "tbsp", name: "toasted sesame oil" },
      { amount: 4, unit: "", name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "fresh ginger, grated" },
      { amount: 0.5, unit: "", name: "Asian pear or kiwi, grated (natural tenderizer)" },
      { amount: 1, unit: "tbsp", name: "lemon juice" },
      { amount: 1, unit: "tsp", name: "gochugaru (optional, for light heat)" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "", name: "yellow onion, thinly sliced" },
      { amount: 2, unit: "", name: "green onions, sliced (garnish)" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds (garnish)" },
    ],
    steps: [
      "Whisk together soy sauce, mirin, brown sugar, honey, sesame oil, garlic, ginger, grated pear, lemon juice, gochugaru, and black pepper until sugar dissolves.",
      "Cut chicken thighs into 2-inch strips or keep whole (strips get crispier edges; whole thighs are easier to cook). Add to marinade along with sliced onion. Marinate at least 30 minutes — overnight is best. Don't marinate longer than 24 hours as soy sauce will start to cure the meat.",
      "Grill method: Heat grill to medium-high. Grill chicken 4–5 min per side until nicely charred and 165°F internal. Baste with reserved marinade in the last 2 minutes for a glossy finish.",
      "Stovetop method: Heat a cast iron or heavy skillet over medium-high. Cook in batches in a single layer, 3–4 min per side. Add reserved marinade by the tablespoon if the pan gets dry — it'll caramelize into a sticky glaze.",
      "Rest 5 minutes. Slice into bite-sized pieces. Garnish with green onions and sesame seeds. Serve over rice in lettuce wraps with ssamjang, kimchi, and perilla leaves.",
    ],
    notes: "Dak = chicken, Bulgogi = fire meat. Grated Asian pear is the traditional tenderizer — find at H-Mart. Kiwi also works. The lemon juice adds a brightness that's slightly non-traditional but delicious. For full Korean BBQ experience: serve with ssam (lettuce wraps), ssamjang, pickled radish (danmuji), and your banchan. Boil leftover marinade in a small saucepan for 2–3 min and use as a glaze/dipping sauce. Keeps 4–5 days in fridge.",
  },

  {
    id: "demo-18",
    name: "Chinese Steamed Chicken with Shiitake Mushrooms (香菇蒸滑雞)",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + soak",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 1.5, unit: "lb", name: "boneless skinless chicken thighs, cut into 1-inch pieces" },
      { amount: 8, unit: "", name: "dried shiitake mushrooms (or 1 bag TJ's Mushroom Medley, thawed and dried)" },
      { amount: 6, unit: "", name: "dried wood ear mushrooms (optional, adds crunch)" },
      { amount: 1.5, unit: "tbsp", name: "light soy sauce" },
      { amount: 0.5, unit: "tsp", name: "dark soy sauce" },
      { amount: 1, unit: "tbsp", name: "oyster sauce" },
      { amount: 1, unit: "tbsp", name: "Shaoxing rice wine (or dry sherry)" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 1.5, unit: "tbsp", name: "cornstarch" },
      { amount: 4, unit: "", name: "slices fresh ginger" },
      { amount: 0.5, unit: "tsp", name: "sugar" },
      { amount: 0.25, unit: "tsp", name: "white pepper" },
      { amount: 1, unit: "tbsp", name: "neutral oil" },
      { amount: 2, unit: "", name: "green onions, sliced (garnish)" },
    ],
    steps: [
      "Rinse dried shiitake and wood ear mushrooms. Soak in warm water for at least 20–30 minutes, or overnight for best results. Once soft, remove and discard stems, slice shiitakes in half, cut wood ear into bite-sized pieces. Reserve 2 tbsp of the soaking liquid. (Skip this step if using TJ's Mushroom Medley — see notes.)",
      "Pat chicken dry. In a bowl combine light soy sauce, dark soy sauce, oyster sauce, Shaoxing wine, sesame oil, cornstarch, ginger, sugar, white pepper, neutral oil, and 2 tbsp reserved mushroom soaking liquid. Mix well until cornstarch dissolves. Add chicken and mushrooms, toss to coat. Marinate 20 minutes.",
      "Spread the chicken and mushroom mixture in an even single layer on a shallow heatproof plate with a raised rim to catch the juices.",
      "Set up your steamer: place a rack inside a wok or large pot and add 2 inches of water. Bring to a boil. Carefully place the plate on the rack, cover tightly, and steam on high for 12–15 minutes until chicken is cooked through.",
      "Remove carefully — the plate will be hot and full of savory broth. Scatter green onions on top. Serve immediately over steamed jasmine rice, spooning all the broth over the rice.",
    ],
    notes: "The cornstarch in the marinade gives the chicken a silky texture — this is the 'waat gai' (slippery chicken) effect in Cantonese cooking.\n\nMushroom soaking water is packed with umami — always add it to the marinade, don't discard it.\n\nAlways use dried shiitake, not fresh — the drying process concentrates umami in a way fresh can't match.\n\nTJ's Mushroom Medley shortcut: Skip the soaking step. Thaw and pat the mushrooms very dry (they release a lot of water). Replace the 2 tbsp soaking liquid with 2 tbsp chicken broth. To compensate for the lighter flavor of frozen vs. dried: add an extra 1/2 tsp oyster sauce, a pinch of MSG (or mushroom powder), or a few drops of mushroom soy sauce. Cuts prep to about 10 minutes.\n\nUse a shallow plate with a lip — not a deep bowl — so steam penetrates evenly. Optional: lay a few slices of lap cheong (Chinese sausage) on top before steaming for a classic Cantonese upgrade. Add 5–6 scored jujubes to the marinade for subtle sweetness.",
  },

  {
    id: "demo-19",
    name: "Japchae (Korean Glass Noodle Stir-Fry)",
    category: "Dinner",
    servings: 4,
    prepTime: "20 min",
    cookTime: "30 min",
    favorite: false,
    ingredients: [
      { amount: 8, unit: "oz", name: "dangmyeon (Korean sweet potato glass noodles) — or kelp noodles, see notes" },
      { amount: 0.5, unit: "lb", name: "beef sirloin or chicken thighs, thinly sliced into strips" },
      { amount: 2, unit: "cup", name: "fresh spinach, stems on" },
      { amount: 1, unit: "", name: "medium carrot, julienned" },
      { amount: 1, unit: "", name: "yellow onion, thinly sliced" },
      { amount: 1, unit: "", name: "red bell pepper, thinly sliced" },
      { amount: 4, unit: "", name: "shiitake mushrooms, stems removed and sliced (or TJ's Mushroom Medley)" },
      { amount: 3, unit: "", name: "garlic cloves, minced" },
      { amount: 3, unit: "tbsp", name: "neutral oil (divided)" },
      { amount: 1.5, unit: "tbsp", name: "toasted sesame oil (divided)" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds" },
      { amount: 2, unit: "", name: "green onions, sliced (garnish)" },
      { amount: 3, unit: "tbsp", name: "soy sauce (for sauce)" },
      { amount: 1.5, unit: "tbsp", name: "brown sugar (for sauce)" },
      { amount: 1, unit: "tbsp", name: "mirin (for sauce)" },
      { amount: 1, unit: "tbsp", name: "oyster sauce (secret umami boost, for sauce)" },
      { amount: 1, unit: "tbsp", name: "sesame oil (for sauce)" },
      { amount: 0.25, unit: "cup", name: "water (for sauce)" },
      { amount: 0.5, unit: "tbsp", name: "soy sauce (beef marinade)" },
      { amount: 1, unit: "tsp", name: "sesame oil (beef marinade)" },
      { amount: 0.5, unit: "tbsp", name: "sugar (beef marinade)" },
      { amount: 0.5, unit: "tbsp", name: "garlic, minced (beef marinade)" },
    ],
    steps: [
      "Marinate the beef: combine beef with 0.5 tbsp soy sauce, 1 tsp sesame oil, 0.5 tbsp sugar, and 0.5 tbsp garlic. Mix and set aside.",
      "Make the sauce: whisk together 3 tbsp soy sauce, brown sugar, mirin, oyster sauce, 1 tbsp sesame oil, and water until sugar dissolves. Set aside.",
      "Cook the noodles: soak dangmyeon in hot water for 20–30 minutes until softened, or boil 6 minutes until just al dente. Drain, rinse under cold water, cut into 6-inch lengths with scissors. Toss with 0.5 tbsp sesame oil to prevent sticking. Set aside.",
      "Cook each vegetable separately in a lightly oiled pan over medium-high heat, seasoning each with a pinch of salt: blanch spinach 5–10 seconds then squeeze dry; stir-fry carrots 1–2 min; stir-fry onion and bell pepper 2 min; stir-fry mushrooms 2 min. Set all aside.",
      "In the same pan, stir-fry marinated beef over medium-high heat 2–3 minutes until just cooked. Keep the juices in the pan.",
      "Add noodles to the pan with the beef juices. Pour sauce over and toss over medium heat 2–3 minutes until noodles are glossy and sauce is absorbed.",
      "Add all vegetables and beef back to the pan. Toss gently to combine. Finish with 1 tbsp sesame oil and sesame seeds. Taste and adjust soy or sugar as needed. Serve warm or at room temperature.",
    ],
    notes: "Kelp noodle sub: Soak kelp noodles in warm water + 1–2 tsp baking soda for 30–45 min until soft. Rinse well, then toss with lemon juice 10 min. Rinse again. Toss in sauce BEFORE stir-frying so they absorb flavor. They are slightly more slippery than dangmyeon — use slightly less sesame oil so sauce clings better.\n\nCooking each ingredient separately is the authentic method and makes a big difference in texture and color — don't skip it.\n\nOyster sauce is the secret umami booster used by Korean-American chefs — highly recommended.\n\nJapchae tastes great at room temperature — perfect for meal prep, potlucks, and gatherings. Keeps 3–4 days in the fridge. Reheat in a pan with a splash of water over low heat.",
  },

  {
    id: "demo-20",
    name: "Kkakdugi (Korean Cubed Radish Kimchi)",
    category: "Snack",
    servings: 8,
    prepTime: "15 min + 1 hr salt",
    cookTime: "1–2 days ferment",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "Korean radish (mu) or daikon, peeled and cut into 3/4-inch cubes" },
      { amount: 2.5, unit: "tbsp", name: "coarse sea salt (or 2 tbsp kosher salt)" },
      { amount: 1, unit: "tsp", name: "sugar (for salting)" },
      { amount: 4, unit: "tbsp", name: "gochugaru (Korean red pepper flakes)" },
      { amount: 4, unit: "", name: "garlic cloves, minced" },
      { amount: 1, unit: "tsp", name: "fresh ginger, grated" },
      { amount: 2, unit: "tbsp", name: "fish sauce (or soy sauce for vegan)" },
      { amount: 1, unit: "tsp", name: "sugar (for seasoning)" },
      { amount: 3, unit: "", name: "green onions, cut into 1-inch pieces" },
    ],
    steps: [
      "Place radish cubes in a large bowl. Add salt and 1 tsp sugar, toss well to coat. Let sit at room temperature for 1 hour, tossing once halfway through. The radish will release a lot of liquid.",
      "Drain the liquid — do not rinse. The radish should be slightly softened but still firm.",
      "Wear gloves. Add gochugaru, garlic, ginger, fish sauce, and 1 tsp sugar to the radish. Mix thoroughly with your hands until every cube is evenly coated red.",
      "Add green onions and fold in gently.",
      "Pack tightly into a clean glass jar or airtight container, pressing down firmly to remove air pockets. Leave 1 inch of space at the top — it will expand as it ferments.",
      "Leave at room temperature for 1–2 days (taste after 24 hours). Once it reaches your desired tanginess, seal and refrigerate. Flavor deepens over 1–2 weeks in the fridge.",
    ],
    notes: "Korean radish (mu) is ideal — shorter, rounder, and denser than daikon. Daikon is a near-perfect substitute. Find Korean radish at H-Mart. Always wear gloves — gochugaru stains everything. Room temperature fermentation: 1 day in summer, 2 days in winter. Tastes best after 1–2 weeks in the fridge as flavors fully develop. Keeps for months refrigerated. Pairs with everything: rice, soups, Korean BBQ, ramen.",
  },
  {
    id: "demo-21",
    name: "Chicken-Mu (Korean Sweet Pickled Daikon)",
    category: "Snack",
    servings: 8,
    prepTime: "10 min",
    cookTime: "8 hrs chill",
    favorite: false,
    ingredients: [
      { amount: 1, unit: "lb", name: "daikon radish, peeled and cut into 1/2-inch cubes" },
      { amount: 0.5, unit: "cup", name: "white sugar" },
      { amount: 0.5, unit: "cup", name: "white vinegar" },
      { amount: 0.5, unit: "cup", name: "water" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
    ],
    steps: [
      "Peel and cut daikon into uniform 1/2-inch cubes. Pack into a clean mason jar or airtight container.",
      "In a bowl, whisk together sugar, white vinegar, water, and salt until sugar and salt are completely dissolved — no heating needed.",
      "Pour brine over the daikon cubes until fully submerged. Seal with the lid.",
      "Refrigerate for at least 8 hours before serving. The longer they sit, the more pickled and flavorful they become. Best at 24–48 hours.",
    ],
    notes: "This is the sweet, tangy white daikon served with Korean fried chicken — no spice, no fermentation, just clean and refreshing. The brine-to-radish ratio matters: make sure radish is fully submerged. For a slightly less sweet version, reduce sugar to 1/3 cup. Keeps up to 2 weeks in the fridge. Great alongside fried chicken, Korean BBQ, dakgalbi, or as a palate cleanser between bites.\n\nSpicy version: Add 1–2 tsp gochugaru to the brine before pouring over the daikon. For more heat, add 1 sliced fresh red chili or Fresno pepper to the jar. You can also add 1 tsp gochujang for a deeper, slightly smoky heat — whisk it into the brine until dissolved. Start mild and adjust to taste since the spice intensifies as it pickles.",
  },

  {
    id: "demo-22",
    name: "Garlic Herb Grilled Chicken Drumsticks",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "30 min",
    favorite: false,
    ingredients: [
      { amount: 8, unit: "", name: "chicken drumsticks, skin-on" },
      { amount: 0.33, unit: "cup", name: "plain Greek yogurt" },
      { amount: 3, unit: "tbsp", name: "avocado or neutral oil (high smoke point for grilling)" },
      { amount: 1, unit: "", name: "lemon, juice and zest" },
      { amount: 5, unit: "", name: "garlic cloves, minced" },
      { amount: 1.5, unit: "tsp", name: "smoked paprika" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: "tsp", name: "onion powder" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 0.5, unit: "tsp", name: "chili flakes or cayenne (optional, for heat)" },
    ],
    steps: [
      "Pat drumsticks completely dry with paper towels — essential for crispy skin. Score each drumstick 2–3 times down to the bone with a knife to help the marinade penetrate and speed up cooking.",
      "In a large bowl mix Greek yogurt, oil, lemon juice and zest, garlic, smoked paprika, oregano, onion powder, salt, pepper, and chili flakes if using. Add drumsticks and coat thoroughly, working marinade under the skin. Marinate at least 30 minutes — 2–4 hours is ideal. Overnight is great.",
      "Preheat grill to medium (375–400°F). Set up two zones: one side on medium-high (direct heat), one side with burners off or coals pushed aside (indirect heat). Oil the grates well.",
      "Shake off excess marinade and place drumsticks on the indirect heat side. Close the lid and cook 20–25 minutes, flipping every 10 minutes, until nearly cooked through.",
      "Move drumsticks to direct heat. Grill 5–7 minutes, turning every 2–3 minutes, until skin is charred and crispy and internal temp reaches 185°F. Watch closely — the yogurt can darken quickly.",
      "Rest 5–10 minutes before serving. Squeeze fresh lemon over the top. Serve with chicken-mu pickled daikon, a simple salad, or grilled vegetables.",
    ],
    notes: "185°F is the target for dark meat — not 165°F. The higher temp breaks down the collagen and fat, making drumsticks fall-off-the-bone tender and self-basting. Always use a meat thermometer.\n\nPat dry before marinating — removing surface moisture is the key to crispy skin.\n\nAvocado oil over olive oil for grilling — higher smoke point means less burning.\n\nTwo-zone grilling is the secret: indirect heat first to cook through, then direct heat to crisp the skin. Prevents burnt outside/raw inside.\n\nOven method: Wire rack on a baking sheet, 400°F convection roast 40–45 min. Broil 3–4 min at the end.\n\nMake it Korean: Swap this yogurt marinade for your gochujang chicken marinade — same two-zone technique applies perfectly.\n\nToom upgrade: Replace the 5 garlic cloves + avocado oil + lemon juice with 3–4 tbsp of toom (Lebanese garlic sauce). Toom is already emulsified so it clings to the skin even better and gives a creamier, more even garlic crust. Reduce kosher salt by half since toom already contains salt — taste the marinade before adding chicken and adjust.",
  },

  {
    id: "demo-23",
    name: "Halal Guys Style Chicken & White Sauce",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "10 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skinless chicken thighs, cut into 1-inch pieces" },
      { amount: 3, unit: "tbsp", name: "olive oil (for marinade)" },
      { amount: 2, unit: "tbsp", name: "lemon juice" },
      { amount: 1, unit: "tbsp", name: "white vinegar" },
      { amount: 5, unit: "", name: "garlic cloves, minced" },
      { amount: 2, unit: "tsp", name: "ground cumin" },
      { amount: 2, unit: "tsp", name: "ground coriander" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: "tsp", name: "ground turmeric" },
      { amount: 0.5, unit: "tsp", name: "smoked paprika" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 1, unit: "cup", name: "mayonnaise (for white sauce)" },
      { amount: 2, unit: "tbsp", name: "plain Greek yogurt (for white sauce)" },
      { amount: 1, unit: "tbsp", name: "white vinegar (for white sauce)" },
      { amount: 1, unit: "tsp", name: "lemon juice (for white sauce)" },
      { amount: 1, unit: "tsp", name: "sugar (for white sauce)" },
      { amount: 0.25, unit: "tsp", name: "garlic powder (for white sauce)" },
      { amount: 1, unit: "", name: "shredded lettuce, chopped tomato, warm pita (for serving)" },
    ],
    steps: [
      "Combine olive oil, lemon juice, vinegar, garlic, cumin, coriander, oregano, turmeric, paprika, salt, and pepper in a bowl. Add chicken and toss to coat thoroughly. Cover and marinate in the fridge for at least 1 hour — overnight (up to 24 hours) is best.",
      "Whisk together mayonnaise, Greek yogurt, vinegar, lemon juice, sugar, and garlic powder in a bowl until smooth. Cover and refrigerate — the flavor improves as it sits, so make this ahead if possible.",
      "Heat a large skillet or grill pan over medium-high heat with a little oil. Add chicken in a single layer and let cook undisturbed for 4–5 minutes until deeply browned. Flip and cook another 4–5 minutes until charred and cooked through (165°F internal). Rest 5 minutes, then chop into bite-sized pieces.",
      "Serve chicken over rice (try the Turmeric Basmati Rice recipe), drizzled generously with white sauce. Add red hot sauce if using. Serve with lettuce, tomato, and warm pita on the side.",
    ],
    notes: "Thighs are the secret weapon — they hold up better than breast and absorb the marinade more deeply, giving that signature juiciness.\n\nDon't rush the marinade — overnight (up to 24 hours, even up to 48) is where most copycats fall short. This oil-based marinade is more forgiving than a yogurt-based one.\n\nThe char is essential — let chicken sit undisturbed in the pan rather than stirring constantly. This builds the deep golden-brown crust that defines the dish.\n\nWhite sauce is the real star — make it at least 30 minutes ahead so the flavors meld. Keeps up to a week in the fridge — make a double batch.\n\nRed hot sauce (quick version): Blend 1/4 cup white vinegar, 2 tbsp hot sauce (sriracha or Frank's), 1 tbsp tomato paste, a pinch of cayenne and sugar.",
  },
  {
    id: "demo-24",
    name: "Turmeric Basmati Rice",
    category: "Dinner",
    servings: 4,
    prepTime: "5 min",
    cookTime: "20 min",
    favorite: false,
    ingredients: [
      { amount: 1.5, unit: "cup", name: "basmati rice" },
      { amount: 2, unit: "tbsp", name: "butter or ghee" },
      { amount: 0.5, unit: "tsp", name: "ground turmeric" },
      { amount: 0.5, unit: "tsp", name: "ground cumin" },
      { amount: 2.25, unit: "cup", name: "chicken broth" },
      { amount: 0.5, unit: "tsp", name: "salt (adjust to broth saltiness)" },
    ],
    steps: [
      "Rinse basmati rice in a fine-mesh strainer under cold water until water runs clear.",
      "In a pot, melt butter over medium heat. Add turmeric and cumin, stir 30 seconds until fragrant.",
      "Add rinsed rice and stir to coat in the spiced butter, toasting for 1–2 minutes.",
      "Pour in chicken broth and salt. Bring to a boil, then reduce heat to low, cover, and simmer 15 minutes until tender and liquid is absorbed.",
      "Remove from heat and rest, covered, for 5 minutes. Fluff with a fork before serving.",
    ],
    notes: "This is the golden turmeric rice base for Halal Guys style platters — pairs directly with the Halal Guys Chicken & White Sauce recipe.\n\nBasmati is non-negotiable here — its long grain and fluffy texture is part of the authentic experience, don't substitute shorter grain rice.\n\nSame technique as your Butter Basmati Rice recipe, just with turmeric and cumin bloomed in the butter first.\n\nDon't lift the lid while simmering — disrupts even cooking. The rest period at the end is essential for fluffy texture.",
  },

  {
    id: "demo-25",
    name: "Pollo Asado (Mexican Citrus Grilled Chicken Drumsticks)",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "30 min",
    favorite: false,
    ingredients: [
      { amount: 8, unit: "", name: "chicken drumsticks, skin-on bone-in" },
      { amount: 0.5, unit: "cup", name: "fresh orange juice (about 2 oranges)" },
      { amount: 0.25, unit: "cup", name: "fresh lime juice (about 4 limes)" },
      { amount: 3, unit: "tbsp", name: "achiote paste (or 2 tbsp achiote powder)" },
      { amount: 3, unit: "tbsp", name: "olive oil or avocado oil" },
      { amount: 1, unit: "tbsp", name: "white wine vinegar" },
      { amount: 5, unit: "", name: "garlic cloves, minced" },
      { amount: 2, unit: "tsp", name: "ground cumin" },
      { amount: 1, unit: "tsp", name: "smoked paprika" },
      { amount: 1, unit: "tsp", name: "dried Mexican oregano (or regular oregano)" },
      { amount: 1, unit: "tsp", name: "ground coriander" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 0.5, unit: "tsp", name: "chili powder" },
      { amount: 1, unit: "", name: "lime, cut into wedges (for serving)" },
    ],
    steps: [
      "Whisk together orange juice, lime juice, achiote paste, oil, vinegar, garlic, cumin, smoked paprika, oregano, coriander, salt, pepper, and chili powder until achiote paste is fully dissolved. Or blend everything in a blender for a smoother marinade.",
      "Pat drumsticks dry with paper towels. Score each drumstick 2–3 times down to the bone. Place in a zip-lock bag or bowl and pour marinade over. Massage to coat evenly. Refrigerate for at least 4 hours — overnight (up to 24 hours) is ideal. Don't exceed 24 hours as the citrus acid can make the meat mushy.",
      "Preheat grill to 350–400°F. Set up two zones — one side direct heat, one side indirect. Oil the grates well. Remove chicken from marinade and let excess drip off.",
      "Place drumsticks on indirect heat side. Close lid and cook 20–25 minutes, flipping every 10 minutes, until nearly cooked through.",
      "Move drumsticks to direct heat. Grill 5–7 minutes, turning every 2–3 minutes, until skin is charred and internal temp reaches 185°F. The achiote marinade caramelizes into a beautiful deep red crust.",
      "Rest 5–10 minutes before serving. Squeeze lime wedges over the top. Serve with warm corn tortillas, pico de gallo, guacamole, or over rice for a bowl.",
    ],
    notes: "Achiote paste gives the signature deep red-orange color and earthy flavor — find it at Mexican grocery stores or H-Mart. If unavailable, sub with 2 tbsp achiote powder or 1 tbsp smoked paprika + 1 tsp turmeric as a last resort.\n\nFresh citrus only — bottled juice is more bitter and won't give the same bright flavor. Great use for extra limes.\n\nDon't exceed 24 hours marinating — unlike yogurt-based marinades, the high citrus acid starts to break down the texture past that point.\n\n185°F internal temp for dark meat — same as your Garlic Herb Drumstick recipe. Lets collagen break down fully for fall-off-the-bone texture.\n\nOven method: Wire rack on a baking sheet, 425°F for 35–45 minutes. Broil 3–4 minutes at the end for char.\n\nServe as tacos with warm corn tortillas, pico de gallo, guacamole, and pickled red onion — or as a rice bowl similar to your Halal Guys platter setup.",
  },

  {
    id: "demo-26",
    name: "Caprese Pasta Salad",
    category: "Lunch",
    servings: 6,
    prepTime: "10 min",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 12, unit: "oz", name: "short pasta (rotini, fusilli, or penne)" },
      { amount: 2, unit: "cup", name: "cherry or grape tomatoes, halved" },
      { amount: 8, unit: "oz", name: "fresh mozzarella balls (ciliegine or bocconcini), halved" },
      { amount: 0.5, unit: "cup", name: "fresh basil leaves, roughly torn" },
      { amount: 3, unit: "tbsp", name: "extra virgin olive oil" },
      { amount: 2, unit: "tbsp", name: "balsamic glaze (store-bought or reduced)" },
      { amount: 1, unit: "", name: "garlic clove, minced or grated" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 0.25, unit: "tsp", name: "red pepper flakes (optional)" },
      { amount: 1, unit: "pinch", name: "flaky sea salt, for finishing" },
    ],
    steps: [
      "Bring a large pot of heavily salted water to a boil. Cook pasta until al dente per package instructions. Drain and rinse under cold water to stop cooking. Toss immediately with a small drizzle of olive oil to prevent clumping. Can be made up to 2 days ahead and refrigerated.",
      "In a small bowl whisk together olive oil, balsamic glaze, garlic, salt, pepper, and red pepper flakes if using.",
      "In a large bowl combine cooled pasta and cherry tomatoes. Pour dressing over and toss gently to coat. Add mozzarella and fold in gently.",
      "Add basil right before serving and toss once more. Finish with flaky sea salt and an extra drizzle of olive oil.",
      "Serve immediately at room temperature, or refrigerate 30 minutes for a cold salad. If making ahead, hold the basil and mozzarella until right before serving — basil wilts and blackens quickly, and mozzarella can get watery if it sits too long in the dressing.",
    ],
    notes: "Add basil last — always right before serving, not while assembling ahead of time. It wilts and turns black quickly once cut and dressed.\n\nPasta shape matters: Rotini or fusilli are ideal — the spirals grab the dressing. Avoid smooth shapes that let the dressing slide off.\n\nBalsamic glaze vs balsamic vinegar: Glaze is sweeter and thicker — coats the pasta better. If using straight balsamic vinegar, add 1 tsp honey to balance.\n\nMake ahead tip: Dress lightly and hold extra dressing on the side — pasta absorbs it as it sits. Add remaining dressing right before serving. Cold pasta firms up — let it sit at room temp 10–15 min before assembling if it feels too stiff.\n\nAdd-ins: Prosciutto, salami, sun-dried tomatoes, roasted red peppers, arugula, avocado, or grilled chicken for extra protein.",
  },

  {
    id: "demo-27",
    name: "Tuna Pasta Salad",
    category: "Lunch",
    servings: 6,
    prepTime: "10 min",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 12, unit: "oz", name: "short pasta (rotini, elbow, or bowtie)" },
      { amount: 3, unit: "", name: "cans solid white albacore tuna in water (5 oz each), drained very well" },
      { amount: 0.33, unit: "cup", name: "mayonnaise" },
      { amount: 3, unit: "tbsp", name: "plain Greek yogurt (60/40 mayo-yogurt ratio)" },
      { amount: 2, unit: "tsp", name: "Dijon mustard" },
      { amount: 2, unit: "tbsp", name: "fresh lemon juice" },
      { amount: 2, unit: "", name: "celery stalks, finely diced" },
      { amount: 1, unit: "", name: "English or Persian cucumber, diced (Persian preferred — less water)" },
      { amount: 3, unit: "", name: "green onions, sliced" },
      { amount: 2, unit: "tbsp", name: "canned jalapeños, diced (great sub for red onion)" },
      { amount: 2, unit: "tbsp", name: "fresh dill (or 1 tsp dried)" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 0.25, unit: "tsp", name: "smoked paprika (for garnish)" },
    ],
    steps: [
      "Cook pasta in heavily salted boiling water until al dente. Drain and rinse under cold water. Toss with a small drizzle of olive oil to prevent clumping. Can be done up to 2 days ahead.",
      "Drain tuna very well — press firmly against the can with the lid to remove as much water as possible. Break into chunks in a large bowl.",
      "In a small bowl whisk together mayonnaise, Greek yogurt, Dijon mustard, lemon juice, salt, and pepper until smooth.",
      "Add cooled pasta, celery, cucumber, green onions, jalapeños, and dill to the tuna. Pour dressing over and fold gently until everything is well coated.",
      "Taste and adjust — more lemon for brightness, more mayo for creaminess, more salt if needed. Cover and refrigerate at least 30 minutes before serving, ideally overnight. Before serving stir well and add a splash of lemon juice or spoonful of mayo if it looks dry. Garnish with smoked paprika and extra green onion.",
    ],
    notes: "60/40 mayo to yogurt ratio is the sweet spot — creamy enough to coat the pasta but lighter and brighter than all mayo. For equal parts (50/50) the salad is tangier and lighter, good if you prefer a less rich version. All mayo = classic diner style.\n\nDrain tuna as dry as possible — excess water dilutes the dressing and makes the salad watery as it sits.\n\nJalapeños substitute red onion well — they add the same sharp, punchy quality with a little heat. Adjust amount to your spice preference.\n\nPersian cucumbers preferred over English — less water content so the salad stays less watery as it sits. If using English cucumber, salt the diced pieces for 10 minutes and pat dry first.\n\nPasta absorbs dressing as it sits — always hold extra dressing on the side to loosen before serving.\n\nBest after overnight — flavors meld significantly. Great Sunday meal prep.\n\nOptional add-ins: sweet relish, diced pickles, hard boiled eggs (mayak gyeran sliced on top is incredible), capers, corn, peas, cherry tomatoes, or avocado.\n\nRed onion substitutes: shallots (closest), white/yellow onion soaked in cold water 10 min, extra green onions, pickled onions, or capers.",
  },

  {
    id: "demo-28",
    name: "Chicken Schmaltz & Gribenes (Rendered Chicken Fat)",
    category: "Other",
    servings: 4,
    prepTime: "5 min",
    cookTime: "45 min",
    favorite: false,
    ingredients: [
      { amount: 1, unit: "lb", name: "chicken skin (from deboned thighs or any chicken parts)" },
      { amount: 2, unit: "tbsp", name: "water" },
      { amount: 1, unit: "", name: "small onion, thinly sliced (optional, adds flavor to schmaltz)" },
      { amount: 1, unit: "pinch", name: "kosher salt (for finishing gribenes)" },
    ],
    steps: [
      "Cut chicken skin into roughly 1-inch pieces — smaller pieces render more efficiently and evenly.",
      "Place skin and water in a heavy-bottomed pan or Dutch oven over low heat. The water prevents the skin from burning before the fat starts to render. No oil needed.",
      "Cook on low heat for 30–40 minutes, stirring occasionally, until the skin pieces shrink and turn golden brown and the pan fills with clear liquid fat. Don't rush with high heat — low and slow is essential.",
      "Optional: Add sliced onion halfway through cooking. It caramelizes in the rendering fat and adds incredible flavor to the schmaltz.",
      "Once skin is deep golden and crispy (gribenes), remove with a slotted spoon and drain on paper towels. Sprinkle with kosher salt immediately.",
      "Strain the liquid fat (schmaltz) through a fine mesh strainer into a clean glass jar. Let cool to room temperature, then refrigerate.",
    ],
    notes: "Schmaltz keeps in the fridge up to 3 months, or freeze up to 1 year. Use anywhere you'd use butter or oil — frying eggs, fried rice, sautéing vegetables, roasting potatoes, or anywhere you want rich chicken flavor.\n\nGribenes (crispy skin cracklins) are best eaten fresh while still hot and crispy. Eat as a snack, crumble over rice bowls, soups, or salads. They soften as they sit — reheat in a dry pan or air fryer to re-crisp.\n\nOven method: Spread skin pieces on a wire rack over a baking sheet. Roast at 300°F for 40–50 minutes until golden and crispy. Pour rendered fat from the pan into a jar.\n\nFor bone broth: Reserve some raw skin to add directly to your pressure cooker — the collagen in the skin helps the broth gel when cold.\n\nThe onion is optional but traditional — schmaltz rendered with onion has a deeper, more savory flavor perfect for Asian cooking and fried rice.",
  },
  {
    id: "demo-29",
    name: "Chicken Bone Broth (Pressure Cooker)",
    category: "Other",
    servings: 8,
    prepTime: "10 min",
    cookTime: "2.5 hrs",
    favorite: false,
    ingredients: [
      { amount: 3, unit: "lb", name: "chicken bones (thigh, drumstick, carcass — raw or roasted)" },
      { amount: 2, unit: "tbsp", name: "apple cider vinegar" },
      { amount: 10, unit: "cup", name: "cold water (enough to cover bones, don't exceed max fill line)" },
      { amount: 1, unit: "", name: "yellow onion, halved (no need to peel)" },
      { amount: 1, unit: "", name: "whole garlic head, cut in half crosswise" },
      { amount: 2, unit: "", name: "celery stalks, roughly chopped" },
      { amount: 2, unit: "", name: "medium carrots, roughly chopped" },
      { amount: 3, unit: "", name: "slices fresh ginger" },
      { amount: 3, unit: "", name: "green onion bulbs (white parts)" },
      { amount: 2, unit: "", name: "bay leaves" },
      { amount: 1, unit: "tsp", name: "black peppercorns" },
      { amount: 3, unit: "", name: "dried shiitake mushrooms (optional, adds umami)" },
      { amount: 1, unit: "", name: "small piece kombu/dried kelp (optional, serious umami boost)" },
      { amount: 5, unit: "", name: "red dates/jujubes, scored (optional, adds sweetness and nutrients)" },
    ],
    steps: [
      "Optional but recommended: Roast bones at 425°F for 25–30 minutes until deep golden brown. Transfer directly to pressure cooker — do not rinse. Deglaze the roasting pan with a splash of water, scrape up all the browned bits, and pour into the pressure cooker. This step adds significant depth and color.",
      "Add all remaining ingredients to the pressure cooker. Cold water helps draw out more collagen and minerals from the bones. Add apple cider vinegar — it helps break down the bones and extract collagen. Do not add salt.",
      "Seal the lid and cook on HIGH pressure for 2–3 hours (120–180 minutes). Longer = more collagen and richer flavor.",
      "Natural release for at least 30 minutes — don't force release. Let pressure come down on its own.",
      "Strain through a fine mesh strainer lined with cheesecloth if you have it. Discard solids.",
      "Let cool to room temperature. Refrigerate overnight — the fat will solidify on top for easy removal. The broth should gel when cold — this means it's rich in collagen. Skim fat before using or keep it for added richness.",
    ],
    notes: "The broth should gel like Jello when cold — that's the collagen, exactly what you want. If it doesn't gel, simmer uncovered on the stovetop for 30–60 minutes to reduce and concentrate.\n\nDon't add salt until you use the broth — easier to control seasoning in whatever dish you're making.\n\nFreeze in ice cube trays or 1–2 cup portions. Ice cube broth is great for deglazing pans, adding to rice (use instead of water in your Zojirushi), or quick soups.\n\nRoasted vs raw bones: Roasted = richer, darker, more complex flavor. Raw = lighter, more neutral, better for delicate Asian soups and clear broths.\n\nChicken skin in the broth: Add raw skin directly to the pressure cooker alongside the bones — it's high in collagen and helps the broth gel better.\n\nRed dates and ginger are a nod to Chinese bone broth tradition — you already have jujubes from your tea recipes. The ginger also cuts any gamey flavor.",
  },

  {
    id: "demo-30",
    name: "Perfect Chocolate Chip Cookies (By Weight)",
    category: "Dessert",
    servings: 24,
    prepTime: "15 min + chill",
    cookTime: "12 min",
    favorite: false,
    ingredients: [
      { amount: 280, unit: "g", name: "all-purpose flour" },
      { amount: 5, unit: "g", name: "baking soda" },
      { amount: 3, unit: "g", name: "salt" },
      { amount: 227, unit: "g", name: "unsalted butter, softened to room temperature (still cool to touch)" },
      { amount: 200, unit: "g", name: "light brown sugar, packed" },
      { amount: 100, unit: "g", name: "granulated sugar" },
      { amount: 1, unit: "", name: "large egg" },
      { amount: 1, unit: "", name: "egg yolk (extra yolk = chewier, denser center)" },
      { amount: 10, unit: "g", name: "pure vanilla extract" },
      { amount: 7, unit: "g", name: "honey or corn syrup (keeps cookies chewy for days)" },
      { amount: 280, unit: "g", name: "good quality dark or semi-sweet chocolate bar, roughly chopped into chunks" },
      { amount: 1, unit: "pinch", name: "flaky sea salt (Maldon), for finishing" },
    ],
    steps: [
      "In a medium bowl whisk together flour, baking soda, and salt. Set aside.",
      "Beat butter, brown sugar, and granulated sugar in a stand mixer with paddle attachment on medium speed until smooth — about 2 minutes. Do not overbeat to pale and fluffy — that creates cakey cookies. You want it smooth like damp sand.",
      "Add egg, egg yolk, vanilla extract, and honey. Beat on medium until just combined, about 1 minute.",
      "Add dry ingredients and mix on low until just combined — no dry streaks. Do NOT overmix. Fold in chocolate chunks with a spatula.",
      "Optional but highly recommended: Cover and refrigerate dough 1–72 hours. Longer chill = deeper flavor and chewier center.",
      "Preheat oven to 375°F (190°C). Line two baking sheets with parchment. Scoop dough into balls (about 55–60g each) and place 2 inches apart. Slightly press down with your fingers.",
      "Bake at 375°F for 9–12 minutes. After 7 minutes, bang the pan firmly on the oven rack to create rippled edges. Bake 2 more minutes, bang again, then finish 2–3 more minutes. Edges should be golden brown; centers will look pale and slightly underdone — that is correct.",
      "Immediately upon removing from oven, bang the baking sheet firmly on the counter to deflate and compress the centers. Sprinkle flaky salt while surface is still warm. Cool on the pan 5 minutes, then transfer to a wire rack.",
    ],
    notes: "Weigh everything including liquids — zero out (tare) the scale between each ingredient for best accuracy.\n\nBrown sugar heavy ratio — more brown sugar than white gives chewiness and butterscotch depth. White sugar creates the crispy edges. Don't swap the ratios.\n\nExtra egg yolk is the secret to a dense, fudgy center without being cakey.\n\nChop chocolate bars, don't use chips — chips contain stabilizers that prevent melting. Chopped chocolate creates puddles of molten chocolate. Use Ghirardelli 60%, Lindt, or any quality bar.\n\nPan banging trick — after 7 minutes, bang the pan on the oven rack, bake 2 more minutes, bang again, then finish 2–3 more minutes. Creates rippled edges and chewy compressed centers.\n\nDon't overbake — pull when edges are golden but centers look pale and slightly underdone. They continue cooking on the hot pan.\n\nChill for best results — refrigerate dough 1–72 hours for deeper flavor, chewier center, and less spreading. Bake from fridge, add 2–3 min to bake time.\n\nFlaky salt — add immediately out of the oven while surface is still buttery so it sticks.\n\nFreeze dough balls: scoop, freeze flat on a tray, then store in a bag up to 3 months. Bake from frozen, adding 2–3 minutes.",
  },

  {
    id: "demo-31",
    name: "Chicken Karaage (Japanese Fried Chicken)",
    category: "Dinner",
    servings: 4,
    prepTime: "15 min + marinate",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skin-on chicken thighs, cut into 1.5-inch bite-sized pieces" },
      { amount: 3, unit: "tbsp", name: "soy sauce" },
      { amount: 2, unit: "tbsp", name: "sake (or dry sherry — don't skip, adds distinct flavor)" },
      { amount: 1, unit: "tbsp", name: "mirin" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 1, unit: "tbsp", name: "fresh ginger, grated" },
      { amount: 3, unit: "", name: "garlic cloves, grated or minced" },
      { amount: 0.25, unit: "tsp", name: "white pepper" },
      { amount: 0.5, unit: "cup", name: "potato starch (katakuriko) — not cornstarch, not flour" },
      { amount: 2, unit: "tbsp", name: "all-purpose flour (mixed with potato starch for better adhesion)" },
      { amount: 1, unit: "tsp", name: "water (for hailstone effect — see notes)" },
      { amount: 1, unit: "quart", name: "neutral oil for deep frying (or avocado oil spray for air fryer)" },
      { amount: 1, unit: "", name: "lemon, cut into wedges (for serving)" },
      { amount: 0.25, unit: "cup", name: "Japanese Kewpie mayo (for serving)" },
    ],
    steps: [
      "Cut chicken thighs into 1.5-inch pieces — keep the skin on for extra crunch. In a bowl combine soy sauce, sake, mirin, sesame oil, ginger, garlic, and white pepper. Add chicken and toss to coat. Marinate in the fridge for at least 30 minutes — 2 hours is ideal. Take chicken out 15 minutes before cooking to come to room temperature.",
      "In a shallow bowl whisk together potato starch and flour. For the hailstone effect: sprinkle 1 tsp water over the starch mixture and toss with a fork to create small clumps — these fry into extra crunchy bits. Shake off excess marinade from chicken, then dredge each piece thoroughly in the starch mixture, pressing to adhere. Set on a plate.",
      "DEEP FRY METHOD: Heat oil in a heavy-bottomed pot to 325°F. Fry chicken in batches (don't crowd) for 3–4 minutes until pale golden. Remove and rest on a wire rack for 5 minutes. Raise oil temp to 375°F. Return chicken for a second fry of 1–2 minutes until deep golden and crispy. Drain on wire rack, not paper towels.",
      "AIR FRYER METHOD (Breville): Preheat to 390°F on Air Fry. Spray basket with avocado oil. Place pieces in a single layer — don't touch. Spray tops with avocado oil. Cook 10 minutes, flip, spray again, cook 8–10 more minutes. Rest 3–5 minutes, then return to air fryer at 400°F for 3–4 minutes to mimic the second fry.",
      "Serve immediately with lemon wedges, Kewpie mayo, and shredded cabbage. Squeeze lemon over right before eating.",
    ],
    notes: "Potato starch (katakuriko) is non-negotiable for authentic karaage — find it at H-Mart or 99 Ranch. Cornstarch works as a backup but gives a slightly less distinctive crust.\n\nSake is also non-negotiable — it tenderizes the meat and adds a flavor that's hard to replicate. Dry sherry is the closest substitute.\n\nHailstone effect: sprinkling 1 tsp water into the starch creates small clumps that fry into extra crunchy nuggets — a modern trick for maximum texture.\n\nDouble fry is the key to restaurant-quality karaage: first fry cooks the chicken through at lower temp, second fry at higher temp creates the shatteringly crispy crust. Don't skip it.\n\nDrain on a wire rack, not paper towels — paper traps steam underneath and softens the crust.\n\nAir fryer note: You get about 85% of deep-fried crispiness. The double air fry step (rest + return at 400°F) closes the gap significantly.\n\nSkin-on thighs are traditional — the skin provides extra crunch and the thigh meat stays juicy. Since you debone thighs yourself, keep the skin on for karaage.\n\nServe immediately — karaage softens as it sits. If making ahead, re-crisp in the air fryer at 400°F for 3 minutes.",
  },

  {
    id: "demo-32",
    name: "Cuban Mojo Chicken",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min + marinate",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "lb", name: "boneless skin-on chicken thighs (or bone-in for oven)" },
      { amount: 0.33, unit: "cup", name: "fresh lime juice (about 3–4 limes)" },
      { amount: 0.33, unit: "cup", name: "fresh orange juice (about 1.5 oranges)" },
      { amount: 1, unit: "", name: "lime, zested" },
      { amount: 0.25, unit: "cup", name: "olive oil" },
      { amount: 6, unit: "", name: "garlic cloves, minced" },
      { amount: 2, unit: "tsp", name: "ground cumin" },
      { amount: 1, unit: "tsp", name: "dried oregano" },
      { amount: 1, unit: "tsp", name: "kosher salt" },
      { amount: 0.5, unit: "tsp", name: "black pepper" },
      { amount: 0.5, unit: "tsp", name: "red pepper flakes (optional)" },
      { amount: 0.25, unit: "cup", name: "fresh cilantro, roughly chopped (for garnish)" },
    ],
    steps: [
      "Whisk together lime juice, orange juice, lime zest, olive oil, garlic, cumin, oregano, salt, pepper, and red pepper flakes in a bowl until combined.",
      "Score chicken with 2–3 shallow cuts through the skin. Place in a zip-lock bag or bowl, pour marinade over, and coat thoroughly. Marinate in the fridge for at least 2 hours — 4 hours is ideal. Do not exceed 6 hours as citrus acid will over-tenderize.",
      "GRILL: Preheat to medium-high. Remove chicken, let excess drip off. Grill 5–7 minutes per side until caramelized and 165°F internal. Rest 5 minutes.",
      "OVEN: Preheat to 425°F. Place chicken skin-side up on a wire rack over a baking sheet. Roast 25–30 min for boneless, 40–45 min for bone-in. Broil 2–3 minutes at the end for crispy skin.",
      "AIR FRYER (Breville): Preheat to 390°F Air Fry. Single layer, spray with avocado oil. Cook 10 min, flip, spray again, cook 8–10 more minutes. Bump to 400°F last 3 min for crispy skin.",
      "Rest 5 minutes before serving. Garnish with cilantro. Serve with black beans, rice, or fried plantains. Squeeze extra lime over the top right before eating.",
    ],
    notes: "Fresh citrus only — bottled juice loses the brightness that makes mojo distinctive. Great use for extra limes.\n\nDon't marinate longer than 4–6 hours — citrus acid is aggressive and will start to cook and toughen the meat past that point. Stricter cap than yogurt-based marinades.\n\nScore the chicken — 2–3 shallow cuts through the skin helps the marinade penetrate deeper.\n\nA classic Cuban plate: mojo chicken + black beans + turmeric basmati rice + avocado slices.\n\nLeftovers work great in tacos, rice bowls, or shredded into a sandwich with pickled jalapeños.",
  },

  {
    id: "demo-33",
    name: "Mapo Eggplant (麻婆茄子)",
    category: "Dinner",
    servings: 4,
    prepTime: "10 min",
    cookTime: "20 min",
    favorite: false,
    ingredients: [
      { amount: 1.5, unit: "lb", name: "Chinese or Japanese eggplants (3–4 small), cut into 1.5-inch pieces" },
      { amount: 0.5, unit: "lb", name: "ground pork or chicken (optional — skip for vegetarian)" },
      { amount: 1.5, unit: "tbsp", name: "doubanjiang (Pixian chili bean paste) — H-Mart or 99 Ranch" },
      { amount: 4, unit: "", name: "garlic cloves, minced" },
      { amount: 1, unit: "tbsp", name: "fresh ginger, grated" },
      { amount: 3, unit: "", name: "green onions, white and green parts separated, sliced" },
      { amount: 1, unit: "tbsp", name: "soy sauce" },
      { amount: 1, unit: "tsp", name: "dark soy sauce (adds color and depth)" },
      { amount: 1, unit: "tbsp", name: "Shaoxing rice wine or dry sherry" },
      { amount: 1, unit: "tsp", name: "sugar" },
      { amount: 0.75, unit: "cup", name: "chicken or vegetable broth (homemade broth works great here)" },
      { amount: 1, unit: "tbsp", name: "cornstarch mixed with 2 tbsp water (slurry)" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 0.5, unit: "tsp", name: "Sichuan peppercorns, toasted and ground (the numbing spice)" },
      { amount: 3, unit: "tbsp", name: "neutral oil" },
    ],
    steps: [
      "Cut eggplant into 1.5-inch chunks. Optional: soak in lightly salted water for 10 minutes, then drain and pat very dry — removes bitterness and reduces oil absorption.",
      "Mix together soy sauce, dark soy sauce, Shaoxing wine, sugar, and broth in a small bowl. Set aside.",
      "Heat 2 tbsp oil in a wok or large skillet over high heat until shimmering. Add eggplant in a single layer — don't stir for 2 minutes. Toss and cook another 3–4 minutes until golden and tender. Remove and set aside.",
      "Add remaining 1 tbsp oil to the same pan over medium-high. Add ground meat if using and cook 2–3 minutes until browned. Add white parts of green onions, garlic, and ginger. Stir-fry 30 seconds until fragrant.",
      "Add doubanjiang and stir-fry 1 minute — it will turn the oil red and fragrant. This step is key for deep flavor.",
      "Return eggplant to the pan. Pour sauce over everything and toss to combine. Bring to a simmer and cook 2–3 minutes until eggplant is fully tender and sauce has reduced slightly.",
      "Pour in cornstarch slurry and stir constantly until sauce thickens and coats everything glossily, about 1 minute. Remove from heat. Drizzle with sesame oil, sprinkle with Sichuan peppercorns, and top with green parts of green onions. Serve immediately over steamed rice.",
    ],
    notes: "Chinese or Japanese eggplant is essential — thinner skin, sweeter flesh, absorbs sauce better than large Western eggplant. Find at H-Mart or 99 Ranch. If using globe eggplant, salt and press 20 min first.\n\nDoubanjiang is the soul of this dish — the fermented broad bean chili paste from Sichuan. Already in your pantry staples list.\n\nSichuan peppercorns create the 'ma' numbing sensation. Toast in dry pan 2 min, then grind. Find at H-Mart.\n\nVegan version: Skip meat, add diced shiitake mushrooms for texture and umami. Use vegetable broth.\n\nUse your homemade chicken broth here — makes a noticeable difference in sauce depth.",
  },
  {
    id: "demo-34",
    name: "Stir-Fried Kangkong (Water Spinach) with Garlic",
    category: "Snack",
    servings: 4,
    prepTime: "5 min",
    cookTime: "8 min",
    favorite: false,
    ingredients: [
      { amount: 1, unit: "lb", name: "kangkong (water spinach), stems and leaves separated" },
      { amount: 5, unit: "", name: "garlic cloves, minced" },
      { amount: 2, unit: "tbsp", name: "oyster sauce" },
      { amount: 1, unit: "tbsp", name: "Shaoxing rice wine or dry sherry" },
      { amount: 0.5, unit: "tsp", name: "sugar" },
      { amount: 2, unit: "tbsp", name: "neutral oil" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil (for finishing)" },
      { amount: 1, unit: "tsp", name: "fish sauce or soy sauce" },
      { amount: 1, unit: "tsp", name: "red chili flakes or fresh chili (optional)" },
    ],
    steps: [
      "Trim kangkong by cutting off the tough lower stems and discarding. Cut remaining stems into 2-inch pieces, separating from the leafy tops. Wash well.",
      "Mix together oyster sauce, Shaoxing wine, sugar, and fish sauce in a small bowl. Set aside.",
      "Heat oil in a wok or large skillet over high heat until smoking. Add garlic and stir-fry 15–20 seconds until fragrant but not brown.",
      "Add kangkong stems first and stir-fry 1–2 minutes until slightly tender.",
      "Add leaves and pour sauce over. Toss everything together on high heat for 1–2 minutes until leaves are just wilted but still bright green. Do not overcook — kangkong goes from perfect to mushy very quickly.",
      "Drizzle with sesame oil, toss once more, and serve immediately. Kangkong does not hold well — serve right away.",
    ],
    notes: "Find kangkong (also called water spinach, ong choy, or morning glory) at H-Mart, 99 Ranch, or any Asian grocery. It's usually sold in large bunches.\n\nHigh heat and speed are essential — this is a 5-minute cook once the pan is hot. Have everything prepped before you start.\n\nStemmed first approach: stems go in before leaves since they take longer to cook. This is the key to even texture.\n\nDo not overcook — kangkong wilts fast. The moment the leaves turn bright green and glossy, it's done.\n\nServe with steamed rice. Pairs well with your karaage, dakgalbi, or any grilled chicken for a complete meal.",
  },
  {
    id: "demo-35",
    name: "Hobak Namul (Korean Stir-Fried Zucchini Banchan)",
    category: "Snack",
    servings: 4,
    prepTime: "10 min",
    cookTime: "8 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "", name: "medium zucchini (Korean aehobak if available, regular zucchini works great)" },
      { amount: 0.5, unit: "tsp", name: "kosher salt (for drawing moisture)" },
      { amount: 4, unit: "", name: "garlic cloves, minced" },
      { amount: 2, unit: "", name: "green onions, sliced (white and green parts separated)" },
      { amount: 1, unit: "tsp", name: "neutral oil" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 0.5, unit: "tsp", name: "gochugaru (Korean red pepper flakes, optional for heat)" },
      { amount: 1, unit: "tsp", name: "toasted sesame seeds" },
      { amount: 1, unit: "tsp", name: "soy sauce or fish sauce" },
    ],
    steps: [
      "Slice zucchini into thin half-moons (about 1/4 inch thick). Toss with salt and let sit 5–10 minutes to draw out moisture. Pat dry with paper towels.",
      "Heat neutral oil in a skillet or wok over medium-high heat. Add zucchini and white parts of green onions. Stir-fry 2–3 minutes until slightly softened and starting to take on a little color.",
      "Add garlic and gochugaru if using. Stir-fry 30 seconds until fragrant.",
      "Add soy sauce and toss to coat. Cook 1–2 more minutes until zucchini is tender but still has a slight bite — do not overcook.",
      "Remove from heat. Drizzle with sesame oil, sprinkle with sesame seeds and green parts of green onions. Serve warm or at room temperature.",
    ],
    notes: "Korean aehobak (round, pale green Korean zucchini) is the traditional choice — sweeter and more tender than regular zucchini. Find at H-Mart. Regular zucchini works perfectly fine.\n\nThe salting step is important — draws out excess moisture so the zucchini stir-fries instead of steaming.\n\nDon't overcook — zucchini should be tender but still have a slight bite and vibrant color. Overcooked zucchini goes mushy and watery.\n\nThis banchan is great in bibimbap, served alongside rice and soup, or as a light side with any of your Korean chicken recipes.\n\nKeeps in the fridge 3–4 days. Serve cold or at room temperature.",
  },
  {
    id: "demo-36",
    name: "Thai Cucumber Salad (Yum Tang Gwa)",
    category: "Snack",
    servings: 4,
    prepTime: "10 min",
    cookTime: "5 min",
    favorite: false,
    ingredients: [
      { amount: 4, unit: "", name: "Persian or English cucumbers, thinly sliced into rounds or half-moons" },
      { amount: 0.5, unit: "tsp", name: "salt (for drawing moisture from cucumbers)" },
      { amount: 0.25, unit: "", name: "small red onion, thinly sliced" },
      { amount: 2, unit: "", name: "Thai bird eye chilies, thinly sliced (or 1 Fresno chili for less heat)" },
      { amount: 0.25, unit: "cup", name: "roasted peanuts, roughly chopped" },
      { amount: 0.25, unit: "cup", name: "fresh cilantro, roughly chopped" },
      { amount: 2, unit: "tbsp", name: "fresh mint leaves (optional but highly recommended)" },
      { amount: 3, unit: "tbsp", name: "fresh lime juice (about 2 limes)" },
      { amount: 2, unit: "tbsp", name: "fish sauce (or soy sauce for vegan)" },
      { amount: 2, unit: "tbsp", name: "sugar" },
      { amount: 1, unit: "tbsp", name: "rice vinegar" },
      { amount: 1, unit: "", name: "garlic clove, minced" },
    ],
    steps: [
      "Slice cucumbers thinly. Toss with salt and set aside in the fridge for 10–15 minutes to keep them crisp. Drain and pat dry.",
      "Make the dressing: In a small saucepan combine lime juice, fish sauce, sugar, rice vinegar, and garlic. Heat over low heat stirring until sugar dissolves completely, about 2 minutes. Remove from heat and let cool. (Or whisk cold — just make sure sugar fully dissolves.)",
      "In a large bowl combine cucumbers, red onion, and chilies. Pour dressing over and toss well to coat.",
      "Add cilantro, mint, and half the peanuts. Toss gently. Taste and adjust — more lime for brightness, more fish sauce for saltiness, more sugar for sweetness.",
      "Transfer to a serving dish. Top with remaining peanuts. Serve immediately for maximum crunch, or refrigerate 20–30 minutes for a more pickled flavor.",
    ],
    notes: "The sweet-sour-salty-spicy balance is the heart of this salad — adjust each element to taste. Thai palates lean sweeter; reduce sugar if you prefer less sweet.\n\nPersian cucumbers are ideal — less watery than English. Chill them in the fridge before slicing for extra crunch.\n\nRoasted peanuts go on right before serving — they soften quickly once dressed.\n\nFresh herbs are essential for authentic Thai flavor — cilantro alone is fine, but cilantro + mint + Thai basil is the full experience.\n\nPairs perfectly with your Vietnamese lemongrass chicken, pollo asado, karaage, or any grilled protein.\n\nVegan version: Swap fish sauce for soy sauce or vegan fish sauce. Great use for your extra limes.",
  },

  {
    id: "demo-37",
    name: "KikiFoodies Homemade Bread Loaf (1 Loaf)",
    category: "Other",
    servings: 1,
    prepTime: "2 hrs rise",
    cookTime: "30 min",
    favorite: false,
    ingredients: [
      { amount: 180, unit: "g", name: "water (room temperature, or warm if using active dry yeast)" },
      { amount: 3.5, unit: "g", name: "instant yeast (about 1 tsp)" },
      { amount: 35, unit: "g", name: "sugar" },
      { amount: 300, unit: "g", name: "bread flour (AP flour works but is less chewy)" },
      { amount: 16, unit: "g", name: "powdered milk (or sub with liquid milk — see notes)" },
      { amount: 4.5, unit: "g", name: "salt" },
      { amount: 30, unit: "g", name: "unsalted butter, room temperature" },
      { amount: 6.5, unit: "g", name: "neutral oil" },
    ],
    steps: [
      "STAND MIXER: Combine water, instant yeast, and sugar in the mixer bowl. Stir to dissolve. Add bread flour, powdered milk, and salt. Mix on Speed 2 for 2 minutes, then Speed 4 for 2 more minutes. Add butter and oil, continue on Speed 4 for 4 minutes until dough is smooth and elastic. Test with the windowpane test: stretch a small piece — if it stretches thin without tearing, it's ready.",
      "BREAD MACHINE: Add ingredients in this order — water, sugar, salt, oil, butter (cut into small pieces), flour, powdered milk. Make a small well in the flour and add yeast last (keep away from salt and liquid until mixing starts). Select DOUGH cycle only. When cycle ends, proceed to Step 3.",
      "Transfer dough to a lightly oiled bowl. Cover with plastic wrap or a damp cloth. Let rise in a warm spot until doubled in size — 1 to 1.5 hours. (Skip if using bread machine dough cycle — it handles this.)",
      "Gently punch down the dough. On a clean surface, shape into a smooth log that fits your loaf pan. Place in a greased 8x4 inch loaf pan.",
      "Cover and let rise again until nearly doubled and just peeking above the pan rim — about 45 minutes to 1 hour. Meanwhile preheat oven to 350°F (175°C).",
      "Bake at 350°F for 30 minutes until golden brown. If the top browns too quickly, tent loosely with foil. Bread is done when it sounds hollow when tapped on the bottom.",
      "Remove from pan immediately and cool completely on a wire rack before slicing — at least 1 hour. Slicing hot bread compresses the crumb and makes it gummy.",
    ],
    notes: "Recipe source: kikifoodies.com — halved from original 2-loaf recipe.\n\nAlways use gram measurements — cups pack in too much flour and make the dough stiff.\n\nBread machine order matters: liquids first, dry ingredients next, yeast last in a small well away from salt. Use DOUGH cycle only — not the full bake cycle.\n\nPowdered milk sub: Replace powdered milk and water with 180g (¾ cup) whole milk. Omit powdered milk entirely.\n\nActive dry yeast: Proof in warm water (110°F) with a pinch of sugar for 5–10 minutes until foamy before adding.\n\nWindowpane test: Stretch a small piece — if it stretches thin without tearing, gluten is fully developed.\n\nStorage: Wrap in plastic wrap at room temp up to 4–5 days. Do not refrigerate. Freeze wrapped tightly up to 3 months.",
  },

  {
    id: "demo-38",
    name: "Osaka-Style Okonomiyaki (Japanese Savory Pancake)",
    category: "Dinner",
    servings: 2,
    prepTime: "15 min",
    cookTime: "20 min",
    favorite: false,
    ingredients: [
      { amount: 0.75, unit: "cup", name: "all-purpose flour" },
      { amount: 0.5, unit: "tsp", name: "baking powder" },
      { amount: 0.5, unit: "tsp", name: "salt" },
      { amount: 0.75, unit: "cup", name: "dashi stock (or chicken broth or water in a pinch)" },
      { amount: 2, unit: "", name: "large eggs" },
      { amount: 1, unit: "tsp", name: "potato starch + 1 tbsp water (sub for nagaimo/mountain yam)" },
      { amount: 4, unit: "cup", name: "green cabbage, finely shredded and bone dry" },
      { amount: 3, unit: "", name: "green onions, sliced" },
      { amount: 4, unit: "", name: "slices pork belly or bacon (or shrimp or cooked chicken)" },
      { amount: 2, unit: "tbsp", name: "neutral oil (for cooking)" },
      { amount: 4, unit: "tbsp", name: "Worcestershire sauce (for okonomiyaki sauce)" },
      { amount: 2, unit: "tbsp", name: "ketchup (for okonomiyaki sauce)" },
      { amount: 1, unit: "tbsp", name: "oyster sauce (for okonomiyaki sauce)" },
      { amount: 1, unit: "tsp", name: "sugar (for okonomiyaki sauce)" },
      { amount: 2, unit: "tbsp", name: "Japanese Kewpie mayo (for serving)" },
      { amount: 1, unit: "tbsp", name: "aonori/dried seaweed flakes (for serving)" },
      { amount: 2, unit: "tbsp", name: "bonito flakes/katsuobushi (for serving — they dance from the heat)" },
    ],
    steps: [
      "Make the okonomiyaki sauce: Whisk together Worcestershire sauce, ketchup, oyster sauce, and sugar until sugar dissolves. Set aside. Can be made ahead and refrigerated for weeks.",
      "Make the batter: In a large bowl whisk together flour, baking powder, salt, dashi, eggs, and potato starch slurry until just combined. Do not overmix — a few lumps are fine. Rest batter 10 minutes.",
      "Dry the cabbage well — this is critical. Wet cabbage makes soggy okonomiyaki. Use a salad spinner or pat thoroughly with paper towels. Shred into roughly 1-inch pieces (not too fine — larger pieces create better texture and airiness). Fold cabbage and green onions into the batter until just coated.",
      "Heat oil in a non-stick skillet or cast iron over medium heat. Pour half the batter into the pan and shape into a round about ¾ inch thick — don't press it flat, the height is important. Lay pork belly or bacon strips on top. Cook undisturbed for 5 minutes until underside is golden brown.",
      "Flip carefully using a wide spatula — support the whole pancake. Cook another 5 minutes until the other side is golden and pancake is cooked through. Press gently — if it springs back, it's done.",
      "Transfer to a plate. Drizzle generously with okonomiyaki sauce, then Kewpie mayo in a zigzag pattern. Sprinkle with aonori and top with bonito flakes — they'll wave in the heat. Serve immediately.",
    ],
    notes: "Dry cabbage is the most important step — any excess moisture prevents browning and creates a soggy pancake. Salad spinner is ideal.\n\nDashi stock is the authentic base and adds real umami depth. Instant dashi powder (hondashi) from H-Mart dissolves in hot water in seconds — worth buying. Chicken broth works as a substitute.\n\nNagaimo (Japanese mountain yam) is traditional and makes the batter incredibly light and fluffy — grate about 2 tbsp and add to the batter. Find at H-Mart. The potato starch + water substitute works well without it.\n\nDon't press down on the pancake while cooking — the height and airiness is what makes the inside soft and the outside crispy.\n\nProtein options: pork belly is traditional, bacon is the easiest substitute, shrimp works great, or use sliced cooked chicken from your meal prep.\n\nWeight loss version: Skip the pork belly, use shrimp or chicken, go light on mayo. The cabbage base is already very low calorie and high volume.\n\nTenkasu (tempura bits) can be folded into the batter for extra crunch and richness — find at H-Mart in the Japanese section.",
  },

  {
    id: "demo-39",
    name: "Ono Hawaiian BBQ Mac Salad (Copycat)",
    category: "Lunch",
    servings: 8,
    prepTime: "15 min",
    cookTime: "15 min + overnight",
    favorite: false,
    ingredients: [
      { amount: 1, unit: "lb", name: "elbow macaroni" },
      { amount: 2, unit: "tbsp", name: "apple cider vinegar (add while pasta is hot)" },
      { amount: 1.5, unit: "cup", name: "Best Foods/Hellmann's mayo (divided — 1 cup hot, 0.5 cup cold)" },
      { amount: 0.25, unit: "cup", name: "whole milk" },
      { amount: 1, unit: "tsp", name: "sugar" },
      { amount: 0.5, unit: "tsp", name: "onion powder (or 2 tbsp grated white onion)" },
      { amount: 1, unit: "can", name: "solid white albacore tuna in water (5 oz), drained very well and finely flaked" },
      { amount: 0.25, unit: "cup", name: "shredded carrot (finely grated)" },
      { amount: 2, unit: "", name: "hard boiled eggs, finely chopped (optional but good)" },
      { amount: 1, unit: "tsp", name: "salt, plus more to taste" },
      { amount: 0.5, unit: "tsp", name: "white pepper (use white not black — classic Hawaiian mac)" },
    ],
    steps: [
      "Cook macaroni in heavily salted water for 2–3 minutes PAST the package instructions until noticeably soft and swollen — not al dente. This is intentional. Hawaiian mac salad uses overcooked pasta that absorbs the dressing. Drain very well.",
      "While pasta is still hot, immediately toss with apple cider vinegar, grated carrot, onion powder, salt, and white pepper. The heat opens the pasta so it absorbs these flavors deeply.",
      "Add 1 cup of mayo and milk to the hot pasta and toss thoroughly until completely coated. The warm pasta will absorb most of the mayo — this is the double-dress technique and is the key to authentic texture. Let cool to room temperature.",
      "Cover and refrigerate at least 4 hours — overnight is strongly preferred. The pasta will absorb the dressing and the salad will look dry when you open it. That is correct.",
      "Before serving, add remaining ½ cup mayo. Fold in the well-drained, finely flaked tuna and chopped hard boiled eggs if using. Tuna should be broken down fine — almost unrecognizable, adding umami rather than chunks. Taste and adjust salt.",
      "Serve cold. The final salad should be very creamy, slightly sweet, and dense — not light or fluffy.",
    ],
    notes: "The tuna is the confirmed secret ingredient — Ono's allergen chart lists fish in the mac salad. Use it finely flaked so it melts into the dressing rather than chunking up. Drain very thoroughly.\n\nBest Foods/Hellmann's mayo is the correct brand — it has a specific flavor profile essential to authentic Hawaiian mac salad. Kewpie can be used for a slightly richer, tangier version.\n\nOvercooked pasta is intentional and non-negotiable — al dente pasta won't absorb the dressing and will taste dry and separated.\n\nDouble-dress technique: dress hot with 1 cup mayo, refrigerate, then add remaining mayo cold before serving. This is the most commonly missed step.\n\nMake overnight — it tastes dramatically better after sitting. The pasta fully absorbs the dressing and the flavors meld.\n\nWhite pepper instead of black — gives a cleaner heat without the visible specks.\n\nServe alongside teriyaki chicken, kalua pork, or your grilled chicken recipes for a full Hawaiian plate lunch.",
  },

  {
    id: "demo-40",
    name: "Haemul Pajeon (Korean Seafood & Green Onion Pancake)",
    category: "Snack",
    servings: 2,
    prepTime: "10 min",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 1, unit: "cup", name: "all-purpose flour" },
      { amount: 3, unit: "tbsp", name: "potato starch" },
      { amount: 0.5, unit: "tsp", name: "baking powder" },
      { amount: 0.5, unit: "tsp", name: "garlic powder" },
      { amount: 0.5, unit: "tsp", name: "onion powder" },
      { amount: 0.5, unit: "tsp", name: "salt" },
      { amount: 1, unit: "cup", name: "ice cold water (or sparkling water for extra crispiness)" },
      { amount: 1, unit: "", name: "large egg, beaten separately" },
      { amount: 8, unit: "", name: "green onions, roots trimmed and cut in half lengthwise then into 3-inch pieces" },
      { amount: 0.5, unit: "lb", name: "mixed seafood — shrimp (halved), squid rings, or clams (any combo)" },
      { amount: 1, unit: "", name: "red chili pepper, thinly sliced (optional garnish)" },
      { amount: 3, unit: "tbsp", name: "neutral oil (divided, for frying)" },
      { amount: 2, unit: "tbsp", name: "soy sauce (for dipping sauce)" },
      { amount: 1, unit: "tbsp", name: "rice vinegar (for dipping sauce)" },
      { amount: 0.5, unit: "tsp", name: "sesame oil (for dipping sauce)" },
      { amount: 0.5, unit: "tsp", name: "sesame seeds (for dipping sauce)" },
      { amount: 0.25, unit: "tsp", name: "gochugaru (for dipping sauce)" },
    ],
    steps: [
      "Make dipping sauce: Whisk together soy sauce, rice vinegar, sesame oil, sesame seeds, and gochugaru in a small bowl. Set aside.",
      "Make batter: Whisk together flour, potato starch, baking powder, garlic powder, onion powder, and salt. Add ice cold water and mix until just combined — a few lumps are fine. Do NOT overmix. Batter should be thin and pourable.",
      "Pat seafood very dry with paper towels — excess moisture prevents browning. Cut shrimp in half lengthwise, slice squid into rings.",
      "Heat 1.5 tbsp oil in a large non-stick skillet over medium-high heat. Lay green onions flat in the pan in an even layer. Pour ¾ of the batter over the green onions. Arrange seafood evenly on top. Add sliced red chili if using. Pour remaining batter over the seafood to bind everything.",
      "Cook undisturbed for 4–5 minutes until the bottom is deep golden and the edges look set. Drizzle the beaten egg over the top and let it set for 30 seconds.",
      "Flip carefully using a wide spatula — support the whole pancake. Add remaining 1.5 tbsp oil to the edges of the pan so it runs underneath. Cook another 4–5 minutes until the second side is golden and crispy. Press lightly — the pancake should feel firm.",
      "Slide onto a cutting board and cut into pieces. Serve immediately with dipping sauce.",
    ],
    notes: "Ice cold water is key to a light, crispy batter — warm water develops gluten and makes it chewy. Some recipes use sparkling water for extra crispiness.\n\nPat seafood completely dry — moisture is the enemy of a crispy pancake. It prevents browning and causes splattering.\n\nThe beaten egg drizzled on top is a technique from Omnivore's Cookbook that creates a crispier finish.\n\nGreen onions are the star — use more than you think you need. They soften and sweeten as they cook.\n\nAdd oil to the edges when flipping — it runs underneath and crisps the second side. Don't skip this.\n\nTraditionally paired with makgeolli (Korean milky rice wine) or soju. Koreans say pajeon tastes best on rainy days.\n\nSeafood options: shrimp, squid, clams, mussels, oysters — any combination works. Shrimp-only is the easiest.",
  },
  {
    id: "demo-41",
    name: "Hobak Jeon (Korean Zucchini Fritters)",
    category: "Snack",
    servings: 4,
    prepTime: "15 min",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 2, unit: "", name: "medium zucchini, sliced into ¼-inch rounds" },
      { amount: 0.5, unit: "tsp", name: "kosher salt (for drawing moisture)" },
      { amount: 0.33, unit: "cup", name: "all-purpose flour (for dredging)" },
      { amount: 3, unit: "", name: "large eggs, beaten" },
      { amount: 1, unit: "tsp", name: "sesame oil (add to beaten egg for flavor)" },
      { amount: 0.25, unit: "tsp", name: "salt (for egg mixture)" },
      { amount: 3, unit: "tbsp", name: "neutral oil (for frying, divided)" },
      { amount: 1, unit: "", name: "red chili pepper, thinly sliced into rounds (optional garnish)" },
      { amount: 2, unit: "tbsp", name: "soy sauce (for dipping sauce)" },
      { amount: 1, unit: "tbsp", name: "rice vinegar (for dipping sauce)" },
      { amount: 0.5, unit: "tsp", name: "sesame oil (for dipping sauce)" },
      { amount: 0.5, unit: "tsp", name: "sesame seeds (for dipping sauce)" },
    ],
    steps: [
      "Slice zucchini into ¼-inch rounds. Sprinkle with salt and let sit 5–10 minutes to draw out moisture. Pat very dry with paper towels — dry zucchini browns properly; wet zucchini steams.",
      "Make dipping sauce: Combine soy sauce, rice vinegar, sesame oil, and sesame seeds. Set aside.",
      "Beat eggs with sesame oil and a pinch of salt in a shallow bowl. Place flour in a separate shallow bowl or plate.",
      "Set up an assembly line: salted/dried zucchini → flour → egg → pan. Dredge each zucchini round in flour on both sides, shake off excess, then dip in beaten egg coating both sides.",
      "Heat 1.5 tbsp oil in a large non-stick pan over medium heat. Working in batches, place zucchini directly from the egg into the pan. If using red chili garnish, press a small slice on top while the egg is still wet.",
      "Cook 1–2 minutes until the underside is lightly golden. Flip and cook another 1–2 minutes on the other side. Do not overcook — the zucchini should be tender inside with a pale golden egg crust, not dark brown.",
      "Transfer to a wire rack or paper towel-lined plate. Repeat with remaining zucchini, adding more oil between batches. Serve warm with dipping sauce.",
    ],
    notes: "The flour-then-egg method (not a batter) is what makes hobak jeon distinct from a pancake — each slice gets a thin, delicate egg crust rather than a thick batter coating.\n\nDry the zucchini well after salting — this is the most important step. Wet zucchini steams instead of browning.\n\nMedium-low heat is key — high heat sets the egg too fast and burns before the zucchini cooks through. Aim for a pale golden color, not deep brown.\n\nThe red chili round pressed into the top is the classic Korean presentation — makes them look beautiful and festive.\n\nGreat served as banchan alongside rice and soup. Also works well as a light snack with the dipping sauce.\n\nKorean aehobak (round pale green zucchini) is traditional — sweeter and more tender. Find at H-Mart. Regular zucchini works perfectly.\n\nKeeps in the fridge 3–4 days. Re-crisp in a dry pan or air fryer (Breville 375°F, 3–4 minutes).",
  },
  {
    id: "demo-42",
    name: "Ube Crinkle Cookies",
    category: "Snack",
    servings: 24,
    prepTime: "1 hr 15 min (incl. chilling)",
    cookTime: "12 min",
    favorite: false,
    ingredients: [
      { amount: 280, unit: "g", name: "all-purpose flour" },
      { amount: 2, unit: "tsp", name: "baking powder" },
      { amount: 0.5, unit: "tsp", name: "salt" },
      { amount: 113, unit: "g", name: "unsalted butter, softened" },
      { amount: 150, unit: "g", name: "granulated sugar" },
      { amount: 100, unit: "g", name: "brown sugar" },
      { amount: 2, unit: "", name: "large eggs" },
      { amount: 1.5, unit: "tsp", name: "ube extract" },
      { amount: 60, unit: "g", name: "ube halaya (jam), optional" },
      { amount: 1, unit: "tsp", name: "vanilla extract" },
      { amount: 30, unit: "ml", name: "neutral oil (vegetable or canola)" },
      { amount: 150, unit: "g", name: "powdered sugar (for rolling)" },
      { amount: 50, unit: "g", name: "granulated sugar (for rolling)" },
    ],
    steps: [
      "Whisk together the flour, baking powder, and salt in a bowl. Set aside.",
      "In a stand mixer or with a hand mixer, cream the butter, granulated sugar, and brown sugar together until light and fluffy, about 2–3 minutes.",
      "Beat in the eggs one at a time, then mix in the ube extract, ube halaya, vanilla extract, and oil until fully combined and evenly purple.",
      "Add the dry ingredients to the wet mixture in two additions, mixing on low speed just until no streaks of flour remain. Don't overmix.",
      "Cover and refrigerate the dough for at least 1 hour (up to 24 hours). This is important — a warm dough will spread too much and won't crinkle properly.",
      "Preheat oven to 350°F (175°C). Line baking sheets with parchment paper.",
      "Scoop dough into balls of about 1.5 tablespoons each. Roll each ball first in granulated sugar, then generously in powdered sugar until fully coated in a thick white layer.",
      "Arrange cookies 2 inches apart on the lined sheets. Bake for 11–13 minutes, until the edges are set but the centers still look slightly underdone and the tops have visibly crackled.",
      "Let the cookies cool on the pan for 5 minutes before transferring to a wire rack. They'll firm up as they cool — pulling them slightly early keeps the centers chewy.",
    ],
    notes: "AIR FRYER (Breville Smart Oven Air Fryer): Use the \"Bake\" or \"Cookie\" function at 325°F for about 9–10 minutes, checking at 8 — air fryer ovens tend to run hot and bake faster than a conventional oven. Don't overcrowd the basket/tray; leave space for airflow.\n\nINGREDIENT NOTES: Ube extract varies quite a bit in strength and color by brand — start with the amount above and add a few more drops if the color looks pale after mixing. If you can't find ube halaya, you can omit it, but the extract-only version will be lighter in flavor and color; consider bumping the extract slightly to compensate. Find both at H-Mart or 99 Ranch in the Filipino/international aisle.\n\nSTORAGE: Dough can be frozen in portioned balls (uncoated) for up to 3 months — roll in sugar/powdered sugar straight from frozen and add 1–2 minutes to bake time.",
  },
  {
    id: "demo-43",
    name: "Microwave Mug Cake (Chocolate, + Variations)",
    category: "Snack",
    servings: 1,
    prepTime: "5 min",
    cookTime: "90 sec",
    favorite: false,
    ingredients: [
      { amount: 30, unit: "g", name: "all-purpose flour" },
      { amount: 35, unit: "g", name: "granulated sugar" },
      { amount: 15, unit: "g", name: "cocoa powder" },
      { amount: 0.25, unit: "tsp", name: "baking powder" },
      { amount: 1, unit: "", name: "pinch of salt" },
      { amount: 45, unit: "ml", name: "milk" },
      { amount: 30, unit: "ml", name: "neutral oil" },
      { amount: 0.25, unit: "tsp", name: "vanilla extract" },
      { amount: 1, unit: "tbsp", name: "chocolate chips, optional" },
    ],
    steps: [
      "Whisk the flour, sugar, cocoa powder, baking powder, and salt together directly in a large mug.",
      "Add the milk, oil, and vanilla extract. Stir until just combined and no dry streaks remain — don't overmix or the texture turns tough and rubbery.",
      "Fold in chocolate chips if using.",
      "Microwave on high for 60–90 seconds. Wattages vary a lot, so start checking at 60 seconds — it's done when the top looks set but still slightly moist; it will firm up as it cools.",
      "Let sit for 1–2 minutes before eating — it's very hot straight out of the microwave and the texture settles as it cools slightly.",
    ],
    notes: "THE #1 MISTAKE: overcooking. A dry, rubbery mug cake is almost always from too much microwave time — pull it when the top still looks a little underdone.\n\nVANILLA / FUNFETTI VERSION: Omit the cocoa powder and add 15g (2 tbsp) extra flour to keep the dry-to-wet ratio balanced. Stir in sprinkles at the end for funfetti.\n\nMATCHA VERSION: Omit the cocoa powder, keep the extra 15g flour swap as in the vanilla version, and whisk in 1 tsp matcha powder with the dry ingredients. Reduce sugar slightly to 30g if you want the matcha flavor more pronounced.\n\nUBE VERSION: Omit the cocoa powder, keep the extra 15g flour swap, and add 1/2 tsp ube extract and 1 tbsp ube halaya (jam) with the wet ingredients. Uses the same ube extract/halaya from the Ube Crinkle Cookies recipe. Color may look pale before microwaving and will look more even once baked — a few extra drops of extract deepens it.\n\nBANANA VERSION: Omit the cocoa powder, keep the extra 15g flour swap, and mash in 2–3 tbsp ripe banana with the wet ingredients. Cut the milk back to about 30ml since the banana adds moisture. A pinch of cinnamon is a nice addition here.\n\nAIR FRYER: Not recommended for mug cakes — the direct microwave method is what gives the quick, evenly-cooked texture. An air fryer/oven bake would need a completely different (longer, drier) approach.\n\nUse a mug at least 12oz to give the batter room to rise without overflowing.",
  },
  {
    id: "demo-44",
    name: "Hot and Sour Soup",
    category: "Dinner",
    servings: 4,
    prepTime: "15 min",
    cookTime: "15 min",
    favorite: false,
    ingredients: [
      { amount: 6, unit: "cup", name: "low-sodium chicken broth (or vegetable broth)" },
      { amount: 6, unit: "", name: "dried shiitake mushrooms, rehydrated and sliced (or 8 oz fresh)" },
      { amount: 14, unit: "oz", name: "firm tofu, cut into thin strips" },
      { amount: 1, unit: "cup", name: "bamboo shoots, julienned" },
      { amount: 3, unit: "tbsp", name: "soy sauce" },
      { amount: 4, unit: "tbsp", name: "black rice vinegar (or 1.5x regular rice vinegar)" },
      { amount: 1.5, unit: "tsp", name: "white pepper, plus more to taste" },
      { amount: 1, unit: "tsp", name: "sugar" },
      { amount: 4, unit: "tbsp", name: "cornstarch" },
      { amount: 4, unit: "tbsp", name: "water (to mix with cornstarch)" },
      { amount: 2, unit: "", name: "large eggs, lightly beaten" },
      { amount: 1, unit: "tsp", name: "toasted sesame oil" },
      { amount: 1, unit: "tbsp", name: "chili oil or chili crisp, to taste" },
      { amount: 2, unit: "", name: "scallions, thinly sliced" },
    ],
    steps: [
      "If using dried shiitake, soak in hot water for 20 minutes until soft, then slice thinly. Save the soaking liquid — you can strain and add a splash to the broth for extra flavor.",
      "Bring the broth to a simmer in a large pot. Add the sliced mushrooms, tofu, and bamboo shoots. Simmer for 5 minutes to let flavors meld.",
      "Stir in the soy sauce, black rice vinegar, white pepper, and sugar. Taste and adjust — add more vinegar for tang or more white pepper for heat.",
      "Mix the cornstarch with the water until smooth. While stirring the soup in a circular motion, slowly pour in the slurry. Simmer 1–2 minutes until slightly thickened and glossy.",
      "Reduce heat to low so the soup is barely simmering. Slowly drizzle in the beaten eggs in a thin stream while gently stirring in one direction with a fork or chopstick to create delicate ribbons. Don't overstir or the egg will break into small bits instead of ribbons.",
      "Remove from heat. Stir in the sesame oil. Ladle into bowls and top with chili oil and scallions. Serve immediately while hot.",
    ],
    notes: "VARIATIONS\nProtein: add thin strips of pork loin or shredded chicken during the simmer step for a heartier soup.\nVegetarian: use vegetable broth and skip the egg if fully vegan, or keep the egg for veg-only.\n\nINGREDIENT SOURCING (H-Mart / 99 Ranch)\nBlack rice vinegar (Chinkiang vinegar) and white pepper are usually in the Chinese sauces/spices aisle — this is what gives the soup its signature depth versus using only rice vinegar.\nDried shiitake and bamboo shoots (canned, julienned) are typically stocked near other dried goods/canned Asian vegetables.\n\nSTORAGE\nBest eaten fresh since the tofu and egg texture degrade on reheating, but leftovers keep in the fridge for up to 3 days — reheat gently on the stovetop, not boiling.\n\nThis is a standard/classic version of hot and sour soup assembled from common technique, not sourced from one specific recipe author — treat exact ratios as a solid starting point you can adjust to taste.",
  },
  {
    id: "demo-45",
    name: "Microwave Mochi (Mochiko-Based)",
    category: "Snack",
    servings: 8,
    prepTime: "10 min",
    cookTime: "5 min",
    favorite: false,
    ingredients: [
      { amount: 130, unit: "g", name: "mochiko (sweet rice flour, e.g. Blue Star / Koda Farms)" },
      { amount: 65, unit: "g", name: "sugar" },
      { amount: 180, unit: "ml", name: "water" },
      { amount: 40, unit: "g", name: "cornstarch or potato starch, for dusting" },
      { amount: 1, unit: "tsp", name: "vanilla extract (optional, for plain version)" },
      { amount: 8, unit: "", name: "small filling pieces (chocolate, strawberry, or sweetened red bean)" },
    ],
    steps: [
      "In a microwave-safe bowl, whisk together the mochiko, sugar, and water until smooth with no lumps. Add vanilla if using. It should look like a thin pancake batter.",
      "Cover the bowl loosely (a plate or damp paper towel works) and microwave on high for 1 minute.",
      "Take it out and stir well with a wet spatula — it'll be partially set and lumpy, that's normal.",
      "Cover again and microwave for another 1 minute.",
      "Stir again. The dough should now look mostly translucent with a few opaque streaks.",
      "Microwave in 20–30 second bursts until the dough is fully translucent, glossy, and very sticky/stretchy — no white opaque patches left.",
      "Dust a work surface heavily with cornstarch or potato starch. Turn the hot dough out onto it and dust the top too. Let it cool for 3–5 minutes until safe to touch but still warm and pliable.",
      "With starch-dusted hands, divide dough into 8 pieces. Flatten each into a disc, place a piece of filling in the center, and pinch/gather the edges to seal. Roll into a ball, seam-side down.",
      "Use a dry pastry brush to knock off excess starch before serving — too much makes them taste chalky.",
    ],
    notes: "FLAVOR VARIATIONS (this is where jello-based mochi fails — build flavor into the dough itself, not just the filling)\n\nMATCHA: whisk 1-2 tsp matcha powder into the dry mochiko before adding water.\n\nBLACK SESAME: swap filling for black sesame paste (toasted black sesame + sugar + a little oil, ground into a paste); optional 1 tsp toasted sesame oil in the dough.\n\nBROWN SUGAR / KUROZATO: replace the sugar with dark brown sugar for a caramel-y, less one-note sweetness.\n\nUBE: swap water for ube extract + a splash of coconut milk, use ube halaya as filling.\n\nSTORAGE: best eaten same day at room temp. Refrigerating makes mochi hard (starch retrogradation) — if you must store, freeze individually wrapped and thaw briefly at room temp, or microwave 5-10 sec to soften.\n\nWHY THIS BEATS JELLO MOCHI: jello mochi is a gelatin gummy dusted in starch — it never had rice flavor to begin with. Mochiko dough has a subtle toasted-rice sweetness on its own, which is why traditional mochi doesn't need much flavoring to taste like something.\n\nMochiko is commonly stocked at H-Mart in the flour/baking aisle (Blue Star brand is the standard).",
  },
];

const UNITS = ["cup", "tbsp", "tsp", "oz", "lb", "g", "ml", "l", "piece", "slice", "clove", ""];

function fractionStr(n) {
  if (!n && n !== 0) return "";
  const whole = Math.floor(n);
  const frac = n - whole;
  const fracs = { 0.25: "¼", 0.5: "½", 0.75: "¾", 0.333: "⅓", 0.667: "⅔", 0.125: "⅛" };
  const closeFrac = Object.keys(fracs).find((f) => Math.abs(frac - parseFloat(f)) < 0.05);
  if (whole && closeFrac) return `${whole} ${fracs[closeFrac]}`;
  if (closeFrac) return fracs[closeFrac];
  const rounded = Math.round(n * 100) / 100;
  return rounded % 1 === 0 ? String(rounded) : String(rounded);
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, style = {} }) => {
  const icons = {
    search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    plus: "M12 5v14M5 12h14",
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    "heart-fill": "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
    clock: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 5v5l3 3",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    chevron: "M9 18l6-6-6-6",
    back: "M19 12H5M12 19l-7-7 7-7",
    x: "M18 6L6 18M6 6l12 12",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    check: "M20 6L9 17l-5-5",
  };
  const filled = name === "heart-fill" || name === "star-fill";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={icons[name] || icons.x} />
    </svg>
  );
};

// ─── Styled primitives ────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f5ede0;
    --surface: #fdf6ee;
    --card: #fffaf4;
    --card-hover: #fff3e6;
    --border: #dfc49a;
    --border-light: #cfaa78;
    --gold: #a06820;
    --gold-light: #7a4e10;
    --gold-dim: #b8882e;
    --cream: #2e1a06;
    --muted: #8a6e4a;
    --danger: #c0392b;
    --success: #27ae60;
    --text: #2e1a06;
    --text-dim: #6a4a20;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Lato', sans-serif; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .app {
    min-height: 100vh;
    background: radial-gradient(ellipse at top, #fdefd8 0%, #f5ede0 60%);
    position: relative;
  }

  /* Subtle grain */
  .app::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0; opacity: 0.4;
  }

  .header {
    background: linear-gradient(180deg, #fdefd8 0%, transparent 100%);
    border-bottom: 1px solid var(--border);
    padding: 12px 16px;
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(12px);
    display: flex; flex-direction: column; gap: 10px;
  }

  .header-row1 {
    display: flex; align-items: center; gap: 8px;
  }

  .header-row2 {
    display: flex; align-items: center; gap: 8px;
  }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    color: var(--gold-light);
    letter-spacing: 0.02em;
    flex: 1;
  }

  .header-title span { color: var(--muted); font-style: italic; font-size: 0.75rem; display: block; font-family: 'Lato', sans-serif; margin-top: 1px; }

  .search-bar {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    display: flex; align-items: center;
    gap: 8px; padding: 8px 12px;
    color: var(--muted);
    transition: border-color 0.2s;
  }
  .search-bar:focus-within { border-color: var(--gold-dim); }
  .search-bar input {
    background: none; border: none; outline: none;
    color: var(--text); font-family: 'Lato', sans-serif;
    font-size: 0.9rem; width: 100%;
  }
  .search-bar input::placeholder { color: var(--muted); }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 12px; border-radius: 8px;
    font-family: 'Lato', sans-serif; font-size: 0.8rem; font-weight: 700;
    cursor: pointer; border: none; transition: all 0.2s;
    letter-spacing: 0.03em; white-space: nowrap;
  }
  .btn-gold {
    background: linear-gradient(135deg, var(--gold) 0%, #7a4e10 100%);
    color: #fff;
  }
  .btn-gold:hover { background: linear-gradient(135deg, #b8882e 0%, var(--gold) 100%); transform: translateY(-1px); }
  .btn-ghost {
    background: transparent; color: var(--muted);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { border-color: var(--gold-dim); color: var(--gold); }
  .btn-danger { background: var(--danger); color: white; }
  .btn-danger:hover { background: #e74c3c; }

  .category-tabs {
    display: flex; gap: 6px; padding: 10px 12px;
    overflow-x: auto; scrollbar-width: none;
    border-bottom: 1px solid var(--border);
    -webkit-overflow-scrolling: touch;
  }
  .category-tabs::-webkit-scrollbar { display: none; }
  .cat-tab {
    padding: 5px 14px; border-radius: 20px;
    font-size: 0.8rem; font-weight: 700;
    cursor: pointer; border: 1px solid var(--border);
    background: var(--surface); color: var(--muted);
    white-space: nowrap; transition: all 0.15s;
    letter-spacing: 0.05em;
  }
  .cat-tab:hover { border-color: var(--gold-dim); color: var(--gold); }
  .cat-tab.active {
    background: linear-gradient(135deg, var(--gold) 0%, #7a4e10 100%);
    color: #fff; border-color: transparent;
  }

  .main { padding: 12px 12px; position: relative; z-index: 1; }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  @media (min-width: 600px) {
    .main { padding: 24px 28px; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .header { padding: 20px 28px 16px; flex-direction: row; align-items: center; gap: 16px; }
    .header-row1 { flex: 1; }
    .header-row2 { min-width: 0; }
  }

  .recipe-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .recipe-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .recipe-card:hover { background: var(--card-hover); border-color: var(--gold-dim); transform: translateY(-2px); }
  .recipe-card:hover::before { opacity: 1; }

  .card-cat {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
    color: var(--gold-dim); text-transform: uppercase; margin-bottom: 8px;
  }
  .card-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem; color: var(--cream);
    line-height: 1.3; margin-bottom: 12px;
  }
  .card-meta { display: flex; gap: 12px; color: var(--muted); font-size: 0.78rem; }
  .card-meta span { display: flex; align-items: center; gap: 4px; }

  .card-actions {
    position: absolute; top: 14px; right: 14px;
    display: flex; gap: 6px;
  }
  .icon-btn {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; padding: 5px; cursor: pointer;
    display: flex; align-items: center;
    color: var(--muted); transition: all 0.15s;
  }
  .icon-btn:hover { border-color: var(--gold-dim); color: var(--gold); }
  .icon-btn.fav { color: #e05050; border-color: #5a2020; }
  .icon-btn.fav:hover { background: #2a1010; }
  .icon-btn.del:hover { color: var(--danger); border-color: var(--danger); background: #2a0f0f; }

  /* Detail panel */
  .detail-overlay {
    position: fixed; inset: 0;
    background: rgba(60,30,0,0.35);
    z-index: 200; display: flex; align-items: flex-start; justify-content: flex-end;
    backdrop-filter: blur(4px);
  }
  .detail-panel {
    width: 100vw; height: 100vh;
    background: var(--surface);
    border-left: 1px solid var(--border);
    overflow-y: auto; padding: 16px;
    animation: slideIn 0.25s ease;
    box-shadow: -8px 0 32px rgba(100,60,0,0.12);
  }

  @media (min-width: 600px) {
    .detail-panel { width: min(580px, 100vw); padding: 28px; }
  }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

  .detail-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 24px; }
  .detail-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem; color: var(--cream); flex: 1; line-height: 1.2;
  }
  .detail-cat {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
    color: var(--gold); text-transform: uppercase; margin-bottom: 6px;
  }

  .detail-meta {
    display: flex; gap: 20px; margin-bottom: 24px;
    padding: 16px; background: var(--card); border-radius: 10px;
    border: 1px solid var(--border);
  }
  .meta-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .meta-label { font-size: 0.7rem; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
  .meta-val { font-size: 0.95rem; font-weight: 700; color: var(--gold-light); }

  .servings-ctrl {
    display: flex; align-items: center; gap: 10px;
  }
  .servings-ctrl button {
    width: 28px; height: 28px;
    background: var(--card); border: 1px solid var(--border);
    color: var(--gold); font-size: 1rem; font-weight: 700;
    border-radius: 6px; cursor: pointer; display: flex;
    align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .servings-ctrl button:hover { border-color: var(--gold); background: var(--card-hover); }

  .section-title {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em;
    color: var(--gold-dim); text-transform: uppercase;
    margin-bottom: 12px; margin-top: 24px;
    padding-bottom: 6px; border-bottom: 1px solid var(--border);
  }

  .ing-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .ing-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px; border-radius: 7px;
    background: var(--card); border: 1px solid var(--border);
    font-size: 0.88rem;
  }
  .ing-amount { color: var(--gold-light); font-weight: 700; min-width: 60px; }
  .ing-name { color: var(--text); flex: 1; }

  .step-list { display: flex; flex-direction: column; gap: 10px; }
  .step-item {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 12px; border-radius: 8px;
    background: var(--card); border: 1px solid var(--border);
    font-size: 0.88rem; line-height: 1.5; color: var(--text-dim);
  }
  .step-num {
    font-family: 'Playfair Display', serif;
    color: var(--gold); font-size: 1.1rem; font-weight: 700;
    min-width: 24px;
  }

  .notes-box {
    margin-top: 16px; padding: 14px; background: var(--card);
    border-radius: 8px; border: 1px solid var(--border);
    color: var(--muted); font-size: 0.85rem; font-style: italic;
    line-height: 1.6;
  }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(60,30,0,0.4);
    z-index: 300; display: flex; align-items: center; justify-content: center;
    padding: 20px; backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; width: 100%;
    max-height: 92vh; overflow-y: auto; padding: 16px;
    animation: fadeUp 0.2s ease;
  }

  @media (min-width: 600px) {
    .modal { width: min(680px, 100%); padding: 28px; }
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; color: var(--cream); margin-bottom: 24px;
  }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .form-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; color: var(--gold-dim); text-transform: uppercase; }
  .form-input {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; padding: 9px 12px;
    color: var(--text); font-family: 'Lato', sans-serif; font-size: 0.9rem;
    outline: none; transition: border-color 0.15s;
  }
  .form-input:focus { border-color: var(--gold-dim); }
  .form-select { appearance: none; cursor: pointer; }
  textarea.form-input { resize: vertical; min-height: 72px; }

  .ing-row {
    display: grid; grid-template-columns: 80px 80px 1fr 32px; gap: 8px;
    align-items: center; margin-bottom: 8px;
  }
  .step-input-row { display: grid; grid-template-columns: 1fr 32px; gap: 8px; margin-bottom: 8px; }

  .remove-btn {
    background: none; border: 1px solid var(--border); border-radius: 6px;
    color: var(--muted); cursor: pointer; padding: 5px; display: flex;
    align-items: center; justify-content: center; transition: all 0.15s;
  }
  .remove-btn:hover { border-color: var(--danger); color: var(--danger); }

  .add-row-btn {
    background: none; border: 1px dashed var(--border); border-radius: 8px;
    color: var(--muted); cursor: pointer; padding: 8px;
    font-size: 0.82rem; width: 100%; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .add-row-btn:hover { border-color: var(--gold-dim); color: var(--gold); }

  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); }

  .empty-state {
    text-align: center; padding: 60px 20px; color: var(--muted);
  }
  .empty-state h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--text-dim); margin-bottom: 8px; }
  .empty-state p { font-size: 0.9rem; }

  .sort-select {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 28px 7px 10px;
    color: var(--text); font-family: 'Lato', sans-serif; font-size: 0.8rem;
    cursor: pointer; outline: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a6e4a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 8px center;
    transition: border-color 0.15s;
  }
  .sort-select:focus { border-color: var(--gold-dim); }

  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--card); border: 1px solid var(--gold-dim);
    border-radius: 10px; padding: 12px 18px;
    color: var(--gold-light); font-size: 0.88rem;
    display: flex; align-items: center; gap: 8px;
    z-index: 500; animation: fadeUp 0.2s ease;
    box-shadow: 0 8px 32px rgba(100,60,0,0.15);
  }
`;

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function RecipeBook() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [activeCategory, setActiveCategory] = useState("All");
  const [detailId, setDetailId] = useState(null);
  const [servingsOverride, setServingsOverride] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && saved.length > 0) {
        // Merge: add any default recipes not already saved
        const savedIds = new Set(saved.map(r => r.id));
        const missing = DEFAULT_RECIPES.filter(r => !savedIds.has(r.id));
        setRecipes(missing.length > 0 ? [...saved, ...missing] : saved);
      } else {
        setRecipes(DEFAULT_RECIPES);
      }
    } catch {
      setRecipes(DEFAULT_RECIPES);
    }
  }, []);

  // Persist
  useEffect(() => {
    if (recipes.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    }
  }, [recipes]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const filtered = useMemo(() => {
    const result = recipes.filter((r) => {
      const matchCat = activeCategory === "All" || r.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
    return result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "category") return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      if (sortBy === "favorites") return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
      return 0; // "added" — keep original order
    });
  }, [recipes, search, activeCategory, sortBy]);

  const detail = recipes.find((r) => r.id === detailId);
  const detailServings = detailId ? (servingsOverride[detailId] ?? detail?.servings ?? 1) : 1;
  const servingsRatio = detail ? detailServings / (detail.servings || 1) : 1;

  const toggleFav = (id, e) => {
    e?.stopPropagation();
    setRecipes((rs) => rs.map((r) => r.id === id ? { ...r, favorite: !r.favorite } : r));
  };

  const deleteRecipe = (id) => {
    setRecipes((rs) => rs.filter((r) => r.id !== id));
    if (detailId === id) setDetailId(null);
    setConfirmDelete(null);
    showToast("Recipe removed");
  };

  const addRecipe = (data) => {
    const newR = { ...data, id: `r-${Date.now()}`, favorite: false };
    setRecipes((rs) => [newR, ...rs]);
    setShowAdd(false);
    showToast("Recipe saved!");
  };

  const syncDefaults = () => {
    setRecipes((rs) => {
      const defaultIds = new Set(DEFAULT_RECIPES.map(r => r.id));
      const userRecipes = rs.filter(r => !defaultIds.has(r.id));
      return [...userRecipes, ...DEFAULT_RECIPES];
    });
    showToast("Default recipes updated!");
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="header-row1">
            <div className="header-title">
              The Recipe Book
              <span>{recipes.length} recipes saved</span>
            </div>
            <button className="btn btn-ghost" onClick={syncDefaults} title="Sync default recipes" style={{ fontSize: "0.72rem", padding: "6px 10px" }}>
              ↻ Sync
            </button>
            <button className="btn btn-gold" onClick={() => setShowAdd(true)}>
              <Icon name="plus" size={14} /> Add
            </button>
          </div>
          <div className="header-row2">
            <div className="search-bar">
              <Icon name="search" size={15} />
              <input placeholder="Search recipes…" value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex" }}>
                  <Icon name="x" size={13} />
                </button>
              )}
            </div>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} title="Sort recipes">
              <option value="added">Recent</option>
              <option value="name">A–Z</option>
              <option value="category">Category</option>
              <option value="favorites">Favorites</option>
            </select>
          </div>
        </header>

        {/* Category Tabs */}
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`cat-tab ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
          <button className={`cat-tab ${activeCategory === "Favorites" ? "active" : ""}`} onClick={() => setActiveCategory("Favorites")}
            style={{ color: activeCategory === "Favorites" ? undefined : "#c05050", borderColor: activeCategory === "Favorites" ? undefined : "#5a2020" }}>
            ♥ Favorites
          </button>
        </div>

        {/* Grid */}
        <main className="main">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No recipes found</h3>
              <p>{search ? `Nothing matches "${search}"` : "Add your first recipe above."}</p>
            </div>
          ) : (
            <div className="grid">
              {filtered
                .filter((r) => activeCategory !== "Favorites" || r.favorite)
                .map((r) => (
                  <div key={r.id} className="recipe-card" onClick={() => setDetailId(r.id)}>
                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                      <button className={`icon-btn ${r.favorite ? "fav" : ""}`} onClick={(e) => toggleFav(r.id, e)} title={r.favorite ? "Unfavorite" : "Favorite"}>
                        <Icon name={r.favorite ? "heart-fill" : "heart"} size={13} />
                      </button>
                      <button className="icon-btn del" onClick={(e) => { e.stopPropagation(); setConfirmDelete(r.id); }} title="Delete">
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                    <div className="card-cat">{r.category}</div>
                    <div className="card-name">{r.name}</div>
                    <div className="card-meta">
                      {r.prepTime && <span><Icon name="clock" size={12} />{r.prepTime}</span>}
                      <span><Icon name="users" size={12} />{r.servings} serving{r.servings !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </main>

        {/* Detail Panel */}
        {detail && (
          <div className="detail-overlay" onClick={() => setDetailId(null)}>
            <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
              <div className="detail-header">
                <div style={{ flex: 1 }}>
                  <div className="detail-cat">{detail.category}</div>
                  <div className="detail-title">{detail.name}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className={`icon-btn ${detail.favorite ? "fav" : ""}`} onClick={() => toggleFav(detail.id)}>
                    <Icon name={detail.favorite ? "heart-fill" : "heart"} size={16} />
                  </button>
                  <button className="icon-btn" onClick={() => setDetailId(null)}>
                    <Icon name="x" size={16} />
                  </button>
                </div>
              </div>

              <div className="detail-meta">
                {detail.prepTime && (
                  <div className="meta-item">
                    <span className="meta-label">Prep</span>
                    <span className="meta-val">{detail.prepTime}</span>
                  </div>
                )}
                {detail.cookTime && (
                  <div className="meta-item">
                    <span className="meta-label">Cook</span>
                    <span className="meta-val">{detail.cookTime}</span>
                  </div>
                )}
                <div className="meta-item" style={{ flex: 1 }}>
                  <span className="meta-label">Servings</span>
                  <div className="servings-ctrl">
                    <button onClick={() => setServingsOverride((s) => ({ ...s, [detail.id]: Math.max(1, detailServings - 1) }))}>−</button>
                    <span className="meta-val">{detailServings}</span>
                    <button onClick={() => setServingsOverride((s) => ({ ...s, [detail.id]: detailServings + 1 }))}>+</button>
                  </div>
                </div>
              </div>

              {detail.ingredients?.length > 0 && (
                <>
                  <div className="section-title">Ingredients</div>
                  <ul className="ing-list">
                    {detail.ingredients.map((ing, i) => (
                      <li key={i} className="ing-item">
                        <span className="ing-amount">{fractionStr(ing.amount * servingsRatio)} {ing.unit}</span>
                        <span className="ing-name">{ing.name}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {detail.steps?.length > 0 && (
                <>
                  <div className="section-title">Instructions</div>
                  <div className="step-list">
                    {detail.steps.map((step, i) => (
                      <div key={i} className="step-item">
                        <span className="step-num">{i + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {detail.notes && (
                <>
                  <div className="section-title">Notes</div>
                  <div className="notes-box">{detail.notes}</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Add Recipe Modal */}
        {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={addRecipe} />}

        {/* Delete confirm */}
        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-title">Delete Recipe?</div>
              <p style={{ color: "var(--muted)", marginBottom: 20, fontSize: "0.9rem" }}>This can't be undone.</p>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => deleteRecipe(confirmDelete)}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="toast">
            <Icon name="check" size={15} />
            {toast}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Add Recipe Modal ─────────────────────────────────────────────────────────
function AddModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Dinner");
  const [servings, setServings] = useState(2);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [notes, setNotes] = useState("");
  const [ingredients, setIngredients] = useState([{ amount: "", unit: "cup", name: "" }]);
  const [steps, setSteps] = useState([""]);

  const addIng = () => setIngredients((i) => [...i, { amount: "", unit: "cup", name: "" }]);
  const removeIng = (idx) => setIngredients((i) => i.filter((_, j) => j !== idx));
  const updateIng = (idx, field, val) => setIngredients((i) => i.map((ing, j) => j === idx ? { ...ing, [field]: val } : ing));

  const addStep = () => setSteps((s) => [...s, ""]);
  const removeStep = (idx) => setSteps((s) => s.filter((_, j) => j !== idx));
  const updateStep = (idx, val) => setSteps((s) => s.map((st, j) => j === idx ? val : st));

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      category,
      servings: parseInt(servings) || 1,
      prepTime, cookTime, notes,
      ingredients: ingredients.filter((i) => i.name.trim()).map((i) => ({
        ...i, amount: parseFloat(i.amount) || 0
      })),
      steps: steps.filter((s) => s.trim()),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">New Recipe</div>

        <div className="form-group">
          <label className="form-label">Recipe Name *</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spicy Salmon Bowl" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Servings</label>
            <input className="form-input" type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Prep Time</label>
            <input className="form-input" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="e.g. 10 min" />
          </div>
          <div className="form-group">
            <label className="form-label">Cook Time</label>
            <input className="form-input" value={cookTime} onChange={(e) => setCookTime(e.target.value)} placeholder="e.g. 20 min" />
          </div>
        </div>

        <div className="section-title" style={{ marginTop: 8 }}>Ingredients</div>
        {ingredients.map((ing, i) => (
          <div key={i} className="ing-row">
            <input className="form-input" placeholder="Amt" value={ing.amount} onChange={(e) => updateIng(i, "amount", e.target.value)} />
            <select className="form-input form-select" value={ing.unit} onChange={(e) => updateIng(i, "unit", e.target.value)}>
              {UNITS.map((u) => <option key={u} value={u}>{u || "—"}</option>)}
            </select>
            <input className="form-input" placeholder="Ingredient" value={ing.name} onChange={(e) => updateIng(i, "name", e.target.value)} />
            <button className="remove-btn" onClick={() => removeIng(i)}><Icon name="x" size={13} /></button>
          </div>
        ))}
        <button className="add-row-btn" onClick={addIng}><Icon name="plus" size={13} /> Add ingredient</button>

        <div className="section-title">Instructions</div>
        {steps.map((step, i) => (
          <div key={i} className="step-input-row">
            <input className="form-input" placeholder={`Step ${i + 1}`} value={step} onChange={(e) => updateStep(i, e.target.value)} />
            <button className="remove-btn" onClick={() => removeStep(i)}><Icon name="x" size={13} /></button>
          </div>
        ))}
        <button className="add-row-btn" onClick={addStep}><Icon name="plus" size={13} /> Add step</button>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="form-label">Notes</label>
          <textarea className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tips, substitutions, sourcing notes…" />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" onClick={handleSave} disabled={!name.trim()}>Save Recipe</button>
        </div>
      </div>
    </div>
  );
}
