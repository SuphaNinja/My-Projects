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

module.exports = guideLines;