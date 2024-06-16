const express = require("express");
require("dotenv").config();
const { OpenAI } = require('openai');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(express.json());

const port = 5050;

const prisma = new PrismaClient();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
};

app.use(cors(corsOptions));


const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) {
            res.send({ error: "Your session has expired or does not exist!" });
            return;
        } else {
            req.userId = decoded.userId;
            next();
        }
    });
};

const guideLines = `
You just got some information about a user. Only provide exercises for as many days as: (Maximum days a week to train). Only make workoutSchedule for the maximum days provided. example: Maximum days 3-5 make 5 days of training and 2 days of restdays. Still provide the mealplan.

Please provide a comprehensive 7-day  guide that includes a workout schedule and a  meal schedule. The meal plan should include breakfast, lunch, dinner, and two snacks each day. Ensure the meal plan is specifically adapted to my goals. 

Additionally, provide a workout plan for each day that is specifically adapted to my goals includes various exercises targeting different muscle groups and incorporating both cardio and strength training.

Make it a maximum of 8000 characters long -- THIS IS IMPORTANT, but make sure to finish it so that there wont be any parseing errors -- IT ALWAYS HAS TO BE CORRECTLY JSON FORMATTED AND RFC8259 compliant.

Include a 300-400 word guide with tips on how to reach the weight goals and goals provided. This guide should cover aspects such as dietary habits, exercise recommendations, hydration, sleep, and motivation, include if the time to reach goal is possbile and a guees of how long it would take to reach the goal.

ALWAYS PROVIDE 7 DAYS and always provide both the mealschedule and the training schedule. if there should be no training on that day. The workoutExercices should always be an array!

MAKE SURE TO ALWAYS FOLLOW THE PROVIDED STRUCTURE! ON EACH DAY THERE SHOULD BE A WORKOUTSCHEDULE AND A MEALSCHEDULE!!

This is important!!: workoutSchedule Should always be of type Array with a length of 5. Each workout should be a object!

The response should be formatted as a JSON object with the following structure dont make any comments in the message i also want it RFC8259 compliant :



This is a correct example:
{
  "guide": {
    "day1": {
      mealPlan: [{
        "breakfast": {
            "ingredients": [
            {
              "ingredient": {
                "name":"name"
                "grams": "grams"
                "calories": "calories"
              }
            }
          ]
        },
        "snack1": {
          "ingredients": [
            {
              "ingredient": {
                "name":"name"
                "grams": "grams"
                "calories": "calories"
              }
            }
          ]
        },
        "lunch": {
          "ingredients": [
            {
              "ingredient": {
                "name":"name"
                "grams": "grams"
                "calories": "calories"
              }
            }
          ]
        },
        "snack2": {
            "ingredients": [
            {
              "ingredient": {
                  "name":"name"
                  "grams": "grams"
                  "calories": "calories"
              } 
            }
          ]
        },
        "dinner": {
          "ingredients": [
            {
              "ingredient": {
                "name":"name"
                "grams": "grams"
                "calories": "calories"
              }
            }
          ]
        },
      }],
      "workoutExercises": [
        {
          "exerciseName": "Bicep Curls",
          "time": "4 sets of 10 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Tricep Dips",
          "time": "4 sets of 12 reps",
          "burnedCalories": "200cal"
        },
        {
          "exerciseName": "Shoulder Press",
          "time": "3 sets of 10 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Leg Raises",
          "time": "3 sets of 15 reps",
          "burnedCalories": "160cal"
        },
        {
          "exerciseName": "Russian Twists",
          "time": "3 sets of 15 reps",
          "burnedCalories": "160cal"
        }
      ]
    }],
    },
    "day2": {
      mealPlan: [{
        "breakfast": {
            "ingredients": {
                [
                    "ingredient": {
                        "name":"name"
                        "grams": "grams"
                        "calories": "calories"
                    }
                ]
            }
        },
        "snack1": {
            "ingredients": {
                [
                    "ingredient": {
                        "name":"name"
                        "grams": "grams"
                        "calories": "calories"
                    }
                ]
            }
        },
        "lunch": {
            "ingredients": {
                [
                    "ingredient": {
                        "name":"name"
                        "grams": "grams"
                        "calories": "calories"
                    }
                ]
            }
        },
        "snack2": {
            "ingredients": {
                [
                    "ingredient": {
                        "name":"name"
                        "grams": "grams"
                        "calories": "calories"
                    }
                ]
            }
        },
        "dinner": {
            "ingredients": {
                [
                    "ingredient": {
                        "name":"name"
                        "grams": "grams"
                        "calories": "calories"
                    }
                ]
            }
        },
      }],
      "workoutExercises": [
        {
          "exerciseName": "Bicep Curls",
          "time": "4 sets of 10 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Tricep Dips",
          "time": "4 sets of 12 reps",
          "burnedCalories": "200cal"
        },
        {
          "exerciseName": "Shoulder Press",
          "time": "3 sets of 10 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Leg Raises",
          "time": "3 sets of 15 reps",
          "burnedCalories": "160cal"
        },
        {
          "exerciseName": "Russian Twists",
          "time": "3 sets of 15 reps",
          "burnedCalories": "160cal"
        }
      ]
    },
    ...
    "day7": {
      mealPlan: [{
        "breakfast": {
            "ingredients": {
                [
                    "ingredient": {
                        "name":"name"
                        "grams": "grams"
                        "calories": "calories"
                    }
                ]
            }
        },
        "snack1": {
            "ingredients": {
                [
                    "ingredient": {
                        "name":"name"
                        "grams": "grams"
                        "calories": "calories"
                    }
                ]
            }
        },
        "lunch": {
            "ingredients": {
                [
                    "ingredient": {
                        "name":"name"
                        "grams": "grams"
                        "calories": "calories"
                    }
                ]
            }
        },
        "snack2": {
            "ingredients": {
                [
                    "ingredient": {
                        "name":"name"
                        "grams": "grams"
                        "calories": "calories"
                    }
                ]
            }
        },
        "dinner": {
            "ingredients": {
                [
                    "ingredient": {
                        "name":"name"
                        "grams": "grams"
                        "calories": "calories"
                    }
                ]
            }
        },
      }],
      "workoutExercises": [
        {
          "exerciseName": "Bicep Curls",
          "time": "4 sets of 10 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Tricep Dips",
          "time": "4 sets of 12 reps",
          "burnedCalories": "200cal"
        },
        {
          "exerciseName": "Shoulder Press",
          "time": "3 sets of 10 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Leg Raises",
          "time": "3 sets of 15 reps",
          "burnedCalories": "160cal"
        },
        {
          "exerciseName": "Russian Twists",
          "time": "3 sets of 15 reps",
          "burnedCalories": "160cal"
        }
      ]
    }
  },
  "TipsToReachGoal": "A 300-400 word guide with tips on how to reach the weight loss goals."
}
  
This is a correct output example note: there should only be one object on each element in the workoutExercises Array!! :

{
  "guide": {
    "day1": {
      "mealPlan": {
        "breakfast": {
          "ingredients": [
            {
              "name": "Scrambled Eggs",
              "grams": "2 eggs",
              "calories": "140cal"
            },
            {
              "name": "Whole Grain Toast",
              "grams": "2 slices",
              "calories": "150cal"
            }
          ]
        },
        "snack1": {
          "ingredients": [
            {
              "name": "Mixed Nuts",
              "grams": "30g",
              "calories": "200cal"
            }
          ]
        },
        "lunch": {
          "ingredients": [
            {
              "name": "Tuna Salad",
              "grams": "150g",
              "calories": "200cal"
            },
            {
              "name": "Brown Rice",
              "grams": "100g",
              "calories": "120cal"
            }
          ]
        },
        "snack2": {
          "ingredients": [
            {
              "name": "Cottage Cheese",
              "grams": "150g",
              "calories": "100cal"
            }
          ]
        },
        "dinner": {
          "ingredients": [
            {
              "name": "Grilled Steak",
              "grams": "150g",
              "calories": "300cal"
            },
            {
              "name": "Quinoa",
              "grams": "150g",
              "calories": "180cal"
            },
            {
              "name": "Asparagus",
              "grams": "100g",
              "calories": "40cal"
            }
          ]
        }
      },
      "workoutExercises": [
        {
          "exerciseName": "Bench Press",
          "time": "3 sets of 12 reps",
          "burnedCalories": "250cal"
        },
        {
          "exerciseName": "Lat Pulldowns",
          "time": "3 sets of 10 reps",
          "burnedCalories": "150cal"
        },
        {
          "exerciseName": "Dumbbell Shoulder Press",
          "time": "3 sets of 10 reps",
          "burnedCalories": "200cal"
        },
        {
          "exerciseName": "Russian Twists",
          "time": "3 sets of 15 reps",
          "burnedCalories": "160cal"
        },
        {
          "exerciseName": "Plank",
          "time": "3 sets of 1 minute",
          "burnedCalories": "50cal"
        }
      ]
    },
    "day2": {
      "mealPlan": {
        "breakfast": {
          "ingredients": [
            {
              "name": "Oatmeal with Almonds",
              "grams": "100g",
              "calories": "380cal"
            },
            {
              "name": "Banana",
              "grams": "100g",
              "calories": "90cal"
            }
          ]
        },
        "snack1": {
          "ingredients": [
            {
              "name": "Greek Yogurt",
              "grams": "150g",
              "calories": "100cal"
            }
          ]
        },
        "lunch": {
          "ingredients": [
            {
              "name": "Grilled Chicken Breast",
              "grams": "150g",
              "calories": "230cal"
            },
            {
              "name": "Quinoa",
              "grams": "100g",
              "calories": "120cal"
            },
            {
              "name": "Mixed Vegetables",
              "grams": "100g",
              "calories": "50cal"
            }
          ]
        },
        "snack2": {
          "ingredients": [
            {
              "name": "Protein Shake",
              "grams": "250ml",
              "calories": "180cal"
            }
          ]
        },
        "dinner": {
          "ingredients": [
            {
              "name": "Salmon Fillet",
              "grams": "150g",
              "calories": "220cal"
            },
            {
              "name": "Sweet Potato",
              "grams": "150g",
              "calories": "130cal"
            },
            {
              "name": "Broccoli",
              "grams": "100g",
              "calories": "55cal"
            }
          ]
        }
      },
      "workoutExercises": [
        {
          "exerciseName": "Deadlifts",
          "time": "4 sets of 8 reps",
          "burnedCalories": "300cal"
        },
        {
          "exerciseName": "Barbell Rows",
          "time": "4 sets of 10 reps",
          "burnedCalories": "200cal"
        },
        {
          "exerciseName": "Hammer Curls",
          "time": "3 sets of 12 reps",
          "burnedCalories": "150cal"
        },
        {
          "exerciseName": "Lunges",
          "time": "3 sets of 15 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Russian Twists",
          "time": "3 sets of 15 reps",
          "burnedCalories": "160cal"
        }
      ]
    },
    "day3": {
      "mealPlan": {
        "breakfast": {
          "ingredients": [
            {
              "name": "Greek Yogurt Parfait",
              "grams": "150g",
              "calories": "120cal"
            },
            {
              "name": "Berries",
              "grams": "100g",
              "calories": "50cal"
            },
            {
              "name": "Granola",
              "grams": "30g",
              "calories": "120cal"
            }
          ]
        },
        "snack1": {
          "ingredients": [
            {
              "name": "Protein Bar",
              "grams": "1 bar",
              "calories": "200cal"
            }
          ]
        },
        "lunch": {
          "ingredients": [
            {
              "name": "Grilled Turkey Breast",
              "grams": "150g",
              "calories": "180cal"
            },
            {
              "name": "Quinoa Salad",
              "grams": "200g",
              "calories": "150cal"
            }
          ]
        },
        "snack2": {
          "ingredients": [
            {
              "name": "Hard-Boiled Eggs",
              "grams": "2 eggs",
              "calories": "140cal"
            }
          ]
        },
        "dinner": {
          "ingredients": [
            {
              "name": "Baked Cod",
              "grams": "150g",
              "calories": "200cal"
            },
            {
              "name": "Brown Rice",
              "grams": "150g",
              "calories": "180cal"
            },
            {
              "name": "Steamed Vegetables",
              "grams": "100g",
              "calories": "50cal"
            }
          ]
        }
      },
      "workoutExercises": "restday"
    },
    "day4": {
      "mealPlan": {
        "breakfast": {
          "ingredients": [
            {
              "name": "Protein Pancakes",
              "grams": "2 pancakes",
              "calories": "250cal"
            },
            {
              "name": "Maple Syrup",
              "grams": "30ml",
              "calories": "100cal"
            }
          ]
        },
        "snack1": {
          "ingredients": [
            {
              "name": "Fruit Smoothie",
              "grams": "250ml",
              "calories": "150cal"
            }
          ]
        },
        "lunch": {
          "ingredients": [
            {
              "name": "Shrimp Stir-Fry",
              "grams": "200g",
              "calories": "220cal"
            },
            {
              "name": "Quinoa",
              "grams": "150g",
              "calories": "180cal"
            }
          ]
        },
        "snack2": {
          "ingredients": [
            {
              "name": "Mixed Berries",
              "grams": "100g",
              "calories": "60cal"
            }
          ]
        },
        "dinner": {
          "ingredients": [
            {
              "name": "Grilled Chicken Skewers",
              "grams": "200g",
              "calories": "280cal"
            },
            {
              "name": "Couscous",
              "grams": "150g",
              "calories": "160cal"
            },
            {
              "name": "Grilled Zucchini",
              "grams": "100g",
              "calories": "40cal"
            }
          ]
        }
      },
      "workoutExercises": [
        {
          "exerciseName": "Squats",
          "time": "4 sets of 8 reps",
          "burnedCalories": "300cal"
        },
        {
          "exerciseName": "Leg Press",
          "time": "4 sets of 10 reps",
          "burnedCalories": "250cal"
        },
        {
          "exerciseName": "Lunges",
          "time": "3 sets of 15 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Calf Raises",
          "time": "3 sets of 15 reps",
          "burnedCalories": "200cal"
        },
        {
          "exerciseName": "Plank",
          "time": "3 sets of 1 minute",
          "burnedCalories": "50cal"
        }
      ]
    },
    "day5": {
      "mealPlan": {
        "breakfast": {
          "ingredients": [
            {
              "name": "Avocado Toast",
              "grams": "2 slices",
              "calories": "280cal"
            }
          ]
        },
        "snack1": {
          "ingredients": [
            {
              "name": "Mixed Nuts",
              "grams": "30g",
              "calories": "200cal"
            }
          ]
        },
        "lunch": {
          "ingredients": [
            {
              "name": "Salmon Salad",
              "grams": "200g",
              "calories": "250cal"
            },
            {
              "name": "Whole Wheat Pasta",
              "grams": "150g",
              "calories": "220cal"
            }
          ]
        },
        "snack2": {
          "ingredients": [
            {
              "name": "Yogurt with Berries",
              "grams": "150g",
              "calories": "120cal"
            }
          ]
        },
        "dinner": {
          "ingredients": [
            {
              "name": "Grilled Tofu",
              "grams": "200g",
              "calories": "220cal"
            },
            {
              "name": "Brown Rice",
              "grams": "150g",
              "calories": "180cal"
            },
            {
              "name": "Stir-Fried Vegetables",
              "grams": "150g",
              "calories": "100cal"
            }
          ]
        }
      },
      "workoutExercises": "restday"
    },
    "day6": {
      "mealPlan": {
        "breakfast": {
          "ingredients": [
            {
              "name": "Scrambled Eggs",
              "grams": "2 eggs",
              "calories": "140cal"
            },
            {
              "name": "Whole Grain Toast",
              "grams": "2 slices",
              "calories": "150cal"
            }
          ]
        },
        "snack1": {
          "ingredients": [
            {
              "name": "Mixed Nuts",
              "grams": "30g",
              "calories": "200cal"
            }
          ]
        },
        "lunch": {
          "ingredients": [
            {
              "name": "Tuna Salad",
              "grams": "150g",
              "calories": "180cal"
            },
            {
              "name": "Quinoa",
              "grams": "150g",
              "calories": "140cal"
            }
          ]
        },
        "snack2": {
          "ingredients": [
            {
              "name": "Cottage Cheese",
              "grams": "150g",
              "calories": "120cal"
            }
          ]
        },
        "dinner": {
          "ingredients": [
            {
              "name": "Grilled Steak",
              "grams": "150g",
              "calories": "250cal"
            },
            {
              "name": "Sweet Potato",
              "grams": "150g",
              "calories": "120cal"
            },
            {
              "name": "Green Beans",
              "grams": "100g",
              "calories": "40cal"
            }
          ]
        }
      },
      "workoutExercises": [
        {
          "exerciseName": "Bicep Curls",
          "time": "4 sets of 10 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Tricep Dips",
          "time": "4 sets of 12 reps",
          "burnedCalories": "200cal"
        },
        {
          "exerciseName": "Shoulder Press",
          "time": "3 sets of 10 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Leg Raises",
          "time": "3 sets of 15 reps",
          "burnedCalories": "160cal"
        },
        {
          "exerciseName": "Russian Twists",
          "time": "3 sets of 15 reps",
          "burnedCalories": "160cal"
        }
      ]
    },
    "day7": {
      "mealPlan": {
        "breakfast": {
          "ingredients": [
            {
              "name": "Egg White Omelette",
              "grams": "2 egg whites",
              "calories": "100cal"
            },
            {
              "name": "Spinach",
              "grams": "100g",
              "calories": "20cal"
            },
            {
              "name": "Whole Grain Bagel",
              "grams": "1 bagel",
              "calories": "250cal"
            }
          ]
        },
        "snack1": {
          "ingredients": [
            {
              "name": "Nut Butter with Apple Slices",
              "grams": "30g",
              "calories": "150cal"
            }
          ]
        },
        "lunch": {
          "ingredients": [
            {
              "name": "Grilled Lamb Chops",
              "grams": "200g",
              "calories": "300cal"
            },
            {
              "name": "Quinoa Salad",
              "grams": "150g",
              "calories": "180cal"
            },
            {
              "name": "Steamed Broccoli",
              "grams": "100g",
              "calories": "50cal"
            }
          ]
        },
        "snack2": {
          "ingredients": [
            {
              "name": "Mixed Berries with Greek Yogurt",
              "grams": "150g",
              "calories": "120cal"
            }
          ]
        },
        "dinner": {
          "ingredients": [
            {
              "name": "Surf and Turf",
              "grams": "150g sirloin + 150g shrimp",
              "calories": "400cal"
            },
            {
              "name": "Brown Rice",
              "grams": "150g",
              "calories": "180cal"
            },
            {
              "name": "Grilled Asparagus",
              "grams": "100g",
              "calories": "40cal"
            }
          ]
        }
      },
      "workoutExercises": "restday"
    }
  },
  "TipsToReachGoal": "To successfully gain weight and muscle, it's essential to focus on both nutrition and exercise. First, ensure you are consuming a sufficient amount of calories and macronutrients to fuel muscle growth. Increase your protein intake to support muscle repair and development, aiming for at least 1.2 to 1.7 grams of protein per kilogram of body weight. Include complex carbohydrates and healthy fats to provide energy for workouts and overall daily activities. It's crucial to eat consistently throughout the day, including pre- and post-workout meals to support recovery and optimize muscle growth. Stay hydrated and consider adding protein shakes or smoothies as convenient snacks or meal replacements. In terms of exercise, focus on compound movements targeting major muscle groups to build strength and size. For example, incorporate exercises like squats, deadlifts, bench press, and pull-ups. Prioritize progressive overload and ensure adequate recovery. Aim to train 3-5 days a week, providing sufficient rest days for muscle recovery. Adequate sleep is also crucial for optimal recovery and muscle growth. Consistency and patience are key, and with dedication, you can expect to see noticeable progress towards your weight and muscle gain goals within 6-12 months."
}
`;

const dayOutput = `
  "day1": {
      "mealPlan": {
        "breakfast": {
          "ingredients": [
            {
              "name": "Greek Yogurt Parfait",
              "grams": "150g",
              "calories": "120cal"
            },
            {
              "name": "Berries",
              "grams": "100g",
              "calories": "50cal"
            },
            {
              "name": "Granola",
              "grams": "30g",
              "calories": "120cal"
            }
          ]
        },
        "snack1": {
          "ingredients": [
            {
              "name": "Protein Bar",
              "grams": "1 bar",
              "calories": "200cal"
            }
          ]
        },
        "lunch": {
          "ingredients": [
            {
              "name": "Grilled Turkey Breast",
              "grams": "150g",
              "calories": "180cal"
            },
            {
              "name": "Quinoa Salad",
              "grams": "200g",
              "calories": "150cal"
            }
          ]
        },
        "snack2": {
          "ingredients": [
            {
              "name": "Hard-Boiled Eggs",
              "grams": "2 eggs",
              "calories": "140cal"
            }
          ]
        },
        "dinner": {
          "ingredients": [
            {
              "name": "Baked Cod",
              "grams": "150g",
              "calories": "200cal"
            },
            {
              "name": "Brown Rice",
              "grams": "150g",
              "calories": "180cal"
            },
            {
              "name": "Steamed Vegetables",
              "grams": "100g",
              "calories": "50cal"
            }
          ]
        }
      },
      "workoutExercises": [
        {
          "exerciseName": "Barbell Bench Press",
          "time": "3 sets of 12 reps",
          "burnedCalories": "250cal"
        },
        {
          "exerciseName": "Pull-Ups",
          "time": "3 sets of 10 reps",
          "burnedCalories": "150cal"
        },
          "exerciseName": "Deadlifts",
          "time": "3 sets of 10 reps",
          "burnedCalories": "200cal"
        },
        {
          "exerciseName": "Chest Flyes",
          "time": "3 sets of 12 reps",
          "burnedCalories": "180cal"
        },
        {
          "exerciseName": "Plank",
          "time": "3 sets of 1 minute",
          "burnedCalories": "50cal"
        }
      ]
    },`


app.post("/test", verifyToken, async (req, res) => {
  const  { prompt, trainerId }  = req.body;
  console.log("prompt: ", prompt)
  console.log("trainerId: ", trainerId)

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
    const userId = req.userId;

    try {
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          response_format:{"type": "json_object"},
          messages: [
              { "role": "system", "content": "You are a helpful assistant designed to output valid JSON. Here are all the guidelines you should refer to when answering: " + guideLines + "this is exactly how a day should be structured :" + dayOutput},
              { "role": "user", "content": prompt },
          ], 
          max_tokens: 4096,
      });

      console.log(" Respone from chatgpt:", response.choices[0])

      if (!response) {
        res.send({ error: "Something went wrong with creating the guide!"})
        return;
      };

      const trainer = await prisma.user.findUnique({
        where: { id: trainerId }
      });

      const user = await prisma.user.update({
        where: { id: userId },
        include: { guides: true },
        data: {
          trainer: {
            connect: {
              id: trainer ? trainer.id : "clxburs9z0000682170e7iwxo",
            },
          },
        },
      });

      if (!user) {
        res.send({ error: "User could not be found!" });
        return;
      };

      if (user.guides.length > 0) {
        res.send({ error: "User already has a guide, delete it to create a new one!" });
        return;
      };

      const guideData = JSON.parse(response.choices[0].message.content)

      if (!guideData) {
        res.send({ error: "No data provided, cannot create guide at this moment!" });
        return;
      };

      const createdGuide = await prisma.guide.create({
        data: {
          tipsToReachGoal: guideData.TipsToReachGoal,
          trainerId: trainerId,
          client: {
            connect: { id: user.id }
          }
        },
      });

      for (const [dayName, { mealPlan, workoutExercises }] of Object.entries(guideData.guide)) {
        const dayNumber = parseInt(dayName.replace("day", ""));
        const createdDay = await prisma.day.create({
          data: {
            dayNumber: dayNumber,
            guide: { connect: { id: createdGuide.id } }
          }
        });


        if (mealPlan) {
          for (const [mealType, mealPlanItem] of Object.entries(mealPlan)) {

            const createdMealplan = await prisma.mealPlan.create({
              data: {
                mealType: mealType,
                day: { connect: { id: createdDay.id } },

              }
            });

            const ingredientsData = mealPlanItem.ingredients ?
              mealPlanItem.ingredients.map(ingredient => ({
                name: ingredient.name,
                grams: ingredient.grams,
                calories: ingredient.calories,
                mealPlanId: createdMealplan.id
              })) :
              [];

            const ingredients = await prisma.ingredient.createMany({
              data: ingredientsData
            });
          }
        }

        if (Array.isArray(workoutExercises) || workoutExercises.restDay !== true || workoutExercises) {

          if (workoutExercises.length > 0) {
            for (const exercise of workoutExercises) {
              if (exercise.exerciseName) {
                await prisma.workoutExercise.create({
                  data: {
                    exerciseName: exercise.exerciseName,
                    time: exercise.time,
                    burnedCalories: exercise.burnedCalories,
                    day: { connect: { id: createdDay.id } }
                  }
                });
              }
            }
          }
        }
      }

      res.send({ success: "Guide has been created successfully!" });


    } catch (error) {
      console.error("Error with OpenAI API:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    } 

    
});

//---------------------------------------CREATE NEW USER---------------------------------------------------------

app.post("/create-new-user", async (req, res) => {
    const signUpData = req.body;

    if (!signUpData.firstName) {
        res.send({ error: "First name field cannot be left empty!" });
        return;
    }
    if (!signUpData.lastName) {
        res.send({ error: "last name field cannot be left empty!" });
        return;
    }
    if (!signUpData.userName) {
        res.send({ error: "Username field cannot be left empty!" });
        return;
    }
    if (!signUpData.email) {
        res.send({ error: "Email field cannot be left empty!" });
        return;
    }
    if (!signUpData.password) {
        res.send({ error: "First name field cannot be left empty!" });
        return;
    }

    const foundUser = await prisma.user.findUnique({
        where: { email: signUpData.email }
    });

    if (foundUser) {
        res.send({ error: "Email is already in use!" });
        return;
    }

    const adminKey = "123admin";
    const trainerKey = "123trainer";

    try {
        const hashedPassword = bcrypt.hashSync(signUpData.password, 10);

        const createdUser = await prisma.user.create({
            data: {
                firstName: signUpData.firstName,
                lastName: signUpData.lastName,
                userName: signUpData.userName,
                email: signUpData.email,
                password: hashedPassword,
                role: signUpData.adminKey === adminKey
                        ? "ADMIN"
                    : signUpData.adminKey === trainerKey
                        ? "TRAINER"
                    : "USER"
            }
        })

        res.send({ success: "Created User: " + createdUser.userName + "successfully!" })
    } catch (error) {
        console.log(error)
        return;
    }
});

//--------------------------------------LOGIN---------------------------------------------------------

app.post("/login", async (req, res) => {

    const loginData = req.body;


    if (!loginData.email) {
        res.send({ error: "Email field cannot be left empty!" })
    }

    if (!loginData.password) {
        res.send({ error: "Password field cannot be left empty!" })
    }

    const user = await prisma.user.findUnique({
        where: { email: loginData.email }
    });

    if (!user) {
        res.send({ error: "Password or email is incorrect!" });
        return;
    }

    const passwordValid = await bcrypt.compare(loginData.password, user.password);

    if (!passwordValid) {
        res.send({ error: "Password or email is incorrect!" });
        return;
    };

    const { password, ...userWithoutPass } = user;
    res.send({
        token: jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "5h" }),
        userWithoutPass
    });
});


//--------------------------------------LOGIN---------------------------------------------------------

app.get("/get-current-user", verifyToken, async (req, res) => {
    const userId = req.userId;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          trainer: {
            include: {clients:true}
          },
          clients: true, 
          sentMessages: { 
            orderBy: { createdAt: "desc"},
            include: { 
              sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                userName: true,
                email: true,
                role: true,
                profileImage: true,
                trainerId: true
              }
            }, recipient: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  userName: true,
                  email: true,
                  role: true,
                  profileImage: true,
                  trainerId: true
                }
              } 
            }
          }, 
          receivedMessages: {
            orderBy: { createdAt: "desc" },
            include: { 
              recipient: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  userName: true,
                  email: true,
                  role: true,
                  profileImage: true,
                  trainerId: true
                }
            }, sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  userName: true,
                  email: true,
                  role: true,
                  profileImage: true,
                  trainerId: true
                }
              } 
            }
          },
          guides: {
            include: {
              days: {
                include: {
                  mealPlans: {
                    include: {
                      ingredients: true },
                  },
                  exercises: true, 
                },
              },
            },
          },
        },
      });
        if (!user) {
            res.send({ error: "User could not be found!" })
        }

        const { password, ...userWithoutPass } = user;
        res.send({ success: userWithoutPass });
    } catch (error) {
        console.log("Error getting current user :", error)
        return;
    }
});


app.post("/update-message", verifyToken, async (req,res) => {
  const userId = req.userId;
  const messageId = req.body;
  console.log("messageID : " , messageId )


  try {
    const user = await prisma.user.findUnique({
      where: {id: userId}
    });

    if (!user) {
      res.send({error: "User could not be found!"});
      return;
    };

    const messageToUpdate = await prisma.message.update({
      where: {id: messageId.messageId},
      data: {
        read: true 
      }
    });

  } catch (error) {
    console.log("Error updating message", error );
    res.send({error: "Something went wrong, please try again later!"});
    return;
  }
});

// --------------------------- SEND MESSAGE ----------------------------------

app.post("/send-message", verifyToken, async (req,res ) => {
  const userId = req.userId;
  const  data  = req.body;
  console.log("send message trainer id : ", data.recieverId)
  console.log("send message content: ", data.message)


  try { 
    if (!data.message){
      res.send({error: "You need to enter a message first!"});
      return;
    };
    if (data.message.length < 20) {
      res.send({ error: "Message must be atleast 20 characters long!"});
      return;
    };

    const sender = await prisma.user.findUnique({
      where: {id: userId}
    });
    
    if (!sender) {
      res.send({error: "Could not send message, user not found!"});
      return;
    };

    const reciever = await prisma.user.findUnique({
      where: { id: data.recieverId }
    });

    if (!reciever) {
      res.send({error: "Could not send message, reciever not found!"});
      return;
    };

    if (!data.message) {
      res.send({ error: "No message entered!" });
      return;
    };
    
    const message = await prisma.message.create({
      data: {
        content: data.message,
        senderId: userId,
        recipientId: reciever.id,
      },
    });

    if (!message) {
      res.send({error: "Error sending message, please try again later!"});
      return;
    };

    if (!sender.role !== "TRAINER" || !sender.role !== "ADMIN") {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "You are a helpful assistant designed to help users with questions about fitness, health and workouts. Make it give a short answer with a maximum of 50 words!" },
          { "role": "user", "content": data.message },
        ],
        max_tokens: 4096,
      });
      console.log(response.choices[0].message)
      
      const messageFromAi = await prisma.message.create({
        data: {
          content: response.choices[0].message.content,
          senderId: reciever.id,
          recipientId: userId,
        },
      });
    }

    res.send({success: "Message recieved successfully by ai!"});

  } catch (error) {
    console.log("Error sending message : ", error);
    res.send({error: "Something went wrong, try again later!"});
    return;
  }

});

// ---------------------- GET MESSAGES  --------------------------------


app.get("/get-messages", verifyToken, async (req,res) => {
  const userId = req.userId;


  try {
    const user = await prisma.user.findUnique({
      where: { id:userId },
    });
    
    if (!user) {
      res.send({error: "User could not be found!"});
      return;
    };

    const sentMessages = await prisma.message.findMany({
      where:{ senderId: user.id },
      orderBy: [
        { read: 'asc' }, 
        { createdAt: 'desc' }
      ], 
      include: {recipient:true, sender:true}
    });

    const recievedMessages = await prisma.message.findMany({
      where: { recipientId: user.id },
      orderBy: [
        { read: 'asc' },
        { createdAt: 'desc' }
      ],
      include: { recipient: true, sender: true }
    });

    res.send({ messages: { sentMessages, recievedMessages }});

  } catch (error) {
    console.log("Error getting messages: ", error);
    res.send({error: "Something went wrong, please try again later!"});
    return;
  }
});

// ---------------------- GET ALL TRAINERS --------------------------------

app.get("/get-all-trainers", async (req, res) => {
  try {

    const trainers = await prisma.user.findMany({
      where: {role: "TRAINER"},
      include: { clients:true }
    });

    if(!trainers) {
      res.send({error: "Cannot find any trainers at this time."});
      return;
    };

    const { password, ...trainersWithoutPass } = trainers;
    res.send({ success: trainersWithoutPass });
  } catch (error) {
    console .log("Error getting trainers: ", error);
    return;
  }
});


// ----------------------- EDIT USER PROFILE -------------------------------

app.post("/edit-profile", verifyToken, async (req, res) => {

  const userId = req.userId;

  const updateData = req.body;
  console.log(updateData)

  try {
    const user = await prisma.user.findUnique({
      where: { email: updateData.email }
    });

    if (!user) {
      res.send({ error: "User not found!" });
      return;
    };



    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateData.firstName || undefined,
        lastName: updateData.lastName || undefined,
        userName: updateData.userName || undefined,
        profilemage: updateData.profilemage || undefined,

      }
    });








  } catch (error) {
    console.log("Error updating profile :", error);
    res.send({ error: "Something went wrong, try again later!" })
    return;
  }
});

app.listen(port, () => {
    console.log("Server is running on port:", port);
});
