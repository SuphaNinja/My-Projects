const express = require("express");
require("dotenv").config();
const { OpenAI } = require('openai');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const guideLines = require("./GuideLines.js");
const dayOutput = require("./DayOutput.js");

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

const adminKey = process.env.ADMIN_KEY;
const trainerKey = process.env.TRAINER_KEY;

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

const omitPasswordFromUser = (user) => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const getUserDataWithoutPassword = (user) => {
  if (!user) return null;

  const { password, ...userWithoutPassword } = user;

  if (userWithoutPassword.sentMessages) {
    userWithoutPassword.sentMessages = userWithoutPassword.sentMessages.map(message => {
      const { sender, recipient, ...messageWithoutPassword } = message;
      return { ...messageWithoutPassword, sender: omitPasswordFromUser(sender), recipient: omitPasswordFromUser(recipient) };
    });
  }

  if (userWithoutPassword.receivedMessages) {
    userWithoutPassword.receivedMessages = userWithoutPassword.receivedMessages.map(message => {
      const { sender, recipient, ...messageWithoutPassword } = message;
      return { ...messageWithoutPassword, sender: omitPasswordFromUser(sender), recipient: omitPasswordFromUser(recipient) };
    });
  }

  return userWithoutPassword;
};

const removePasswordFromMessages = (messages) => {
  if (!messages) return [];

  return messages.map(message => ({
    ...message,
    sender: omitPasswordFromUser(message.sender),
    recipient: omitPasswordFromUser(message.recipient)
  }));
};

app.post("/create-guide", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { prompt, trainerId } = req.body;

  if (!prompt) { return res.send({ error: "Prompt is required" }) };

  try {
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

    if (!user) { return res.send({ error: "User could not be found!" }) };
    if (user.guides.length > 0) { return res.send({ error: "User already has a guide, delete it to create a new one!" }) };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      response_format: { "type": "json_object" },
      messages: [
        {
          "role": "system",
          "content": "You are a helpful assistant designed to output valid JSON. Here are all the guidelines you should refer to when answering: "
            + guideLines + "this is exactly how a day should be structured :"
            + dayOutput
        },
        { "role": "user", "content": prompt },
      ],
      max_tokens: 4096,
    });

    if (!response) { return res.send({ error: "Something went wrong with creating the guide!" }) };

    const guideData = JSON.parse(response.choices[0].message.content);

    if (!guideData) { return res.send({ error: "No data provided, cannot create guide at this moment!" }) };

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

          await prisma.ingredient.createMany({
            data: ingredientsData
          });
        }
      }

      if (Array.isArray(workoutExercises) || workoutExercises) {
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
    console.error("Error with OpenAI API Or creating guide:", error);
    res.status(500).send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

//---------------------------------------CREATE NEW USER---------------------------------------------------------

app.post("/create-new-user", async (req, res) => {
  const signUpData = req.body;

  if (!signUpData.firstName) { return res.send({ error: "First name field cannot be left empty!" }) };
  if (!signUpData.lastName) { return res.send({ error: "last name field cannot be left empty!" }) };
  if (!signUpData.userName) { return res.send({ error: "Username field cannot be left empty!" }) };
  if (!signUpData.email) { return res.send({ error: "Email field cannot be left empty!" }) };
  if (!signUpData.password) { return res.send({ error: "First name field cannot be left empty!" }) };

  try {
    const foundUser = await prisma.user.findUnique({
      where: { email: signUpData.email }
    });

    if (foundUser) { return res.send({ error: " The email you provided is already in use!" }) };

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
    });

    res.send({ success: "Created User: " + createdUser.userName + "successfully!" });

  } catch (error) {
    console.log("Error creating new user: ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

//--------------------------------------LOGIN---------------------------------------------------------

app.post("/login", async (req, res) => {
  const loginData = req.body;

  if (!loginData.email) { return res.send({ error: "Email field cannot be left empty!" }) };
  if (!loginData.password) { return res.send({ error: "Password field cannot be left empty!" }) };

  try {
    const user = await prisma.user.findUnique({
      where: { email: loginData.email }
    });

    if (!user) { return res.send({ error: "Password or email is incorrect!" }) };

    const passwordValid = await bcrypt.compare(loginData.password, user.password);
    if (!passwordValid) { return res.send({ error: "Password or email is incorrect!" }) };

    const { password, ...userWithoutPass } = user;
    res.send({
      token: jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "5h" }),
      userWithoutPass
    });

  } catch (error) {
    console.log("Error loggin in user: ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

//--------------------------------------GET CURRENT USER---------------------------------------------------------

app.post("/delete-user", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { userIdToDelete } = req.body;

  if (!userIdToDelete) { return res.send({ error: "User ID to delete has not been provided!" }) };
  if (userIdToDelete !== userId) { return res.send({ error: "Unauthorized delete request!" }) };

  try {
    const userToDelete = await prisma.user.findUnique({
      where: { id: userIdToDelete }
    });

    if (!userToDelete) { return res.send({ error: "User to delete not found!" }) };

    await prisma.user.delete({
      where: { id: userToDelete.id }
    });
    
    res.send({success: "User has been deleted successfully"})

  } catch (error) {
    console.log("Error deleting user: ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

//--------------------------------------GET CURRENT USER---------------------------------------------------------

app.get("/get-current-user", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cart: { include: { cartItems: true } },
        trainer: { include: { clients: true } },
        clients: true,
        sentMessages: { include: { sender: true, recipient: true } },
        receivedMessages: { include: { sender: true, recipient: true } },
        guides: { include: { days: { include: { mealPlans: { include: { ingredients: true } }, exercises: true } } } },
      },
    });

    if (!user) { return res.send({ error: "User could not be found!" }) };

    const userDataWithoutPassword = getUserDataWithoutPassword(user);
    res.send({ success: userDataWithoutPassword });
  } catch (error) {
    console.log("Error getting current user :", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

// --------------------------- SEND MESSAGE ----------------------------------

app.post("/send-message", verifyToken, async (req, res) => {
  const userId = req.userId;
  const data = req.body

  if (!data.message) { return res.send({ error: "You need to enter a message first!" }) };
  if (data.message.length < 20) { return res.send({ error: "Message must be atleast 20 characters long!" }) };;

  try {
    const sender = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!sender) { return res.send({ error: "Could not send message, user not found!" }) };

    const reciever = await prisma.user.findUnique({
      where: { id: data.recieverId }
    });

    if (!reciever) { return res.send({ error: "Could not send message, reciever not found!" }) };

    const message = await prisma.message.create({
      data: {
        content: data.message,
        senderId: userId,
        recipientId: reciever.id,
      },
    });

    if (!message) { return res.send({ error: "Error sending message, please try again later!" }) };

    if (sender.role !== "TRAINER") {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "You are a helpful assistant designed to help users with questions about fitness, health and workouts. Make it give a short answer with a maximum of 50 words!" },
          { "role": "user", "content": data.message },
        ],
        max_tokens: 4096,
      });

      await prisma.message.create({
        data: {
          content: response.choices[0].message.content,
          senderId: reciever.id,
          recipientId: userId,
        },
      });
    };

    res.send({ success: "Response sent by AI!" });

  } catch (error) {
    console.log("Error sending message : ", error);
    res.send({ error: "Something went wrong, try again later!" });
    return;
  }
});

// ---------------------- GET MESSAGES  --------------------------------

app.get("/get-messages", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) { return res.send({ error: "User could not be found!" }) };

    const sentMessages = await prisma.message.findMany({
      where: { senderId: user.id },
      orderBy: [
        { createdAt: 'desc' }
      ],
      include: { recipient: true, sender: true }
    });

    const recievedMessages = await prisma.message.findMany({
      where: { recipientId: user.id },
      orderBy: [
        { createdAt: 'desc' }
      ],
      include: { recipient: true, sender: true }
    });

    const noPassSentMessages = removePasswordFromMessages(sentMessages);
    const noPassReceivedMessages = removePasswordFromMessages(recievedMessages);

    res.send({ messages: { sentMessages: noPassSentMessages, recievedMessages: noPassReceivedMessages } });

  } catch (error) {
    console.log("Error getting messages: ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

// ---------------------- GET ALL TRAINERS --------------------------------

app.get("/get-all-trainers", async (req, res) => {
  const removePassFromTrainerAndClients = (trainers) => {
    if (!trainers) return [];

    return trainers.map(trainer => ({
      ...omitPasswordFromUser(trainer),
      clients: trainer.clients.map(client => omitPasswordFromUser(client))
    }));
  };

  try {
    const trainers = await prisma.user.findMany({
      where: { role: "TRAINER" },
      include: { clients: true }
    });

    if (!trainers) { return res.send({ error: "Cannot find any trainers at this time." }) };

    const passwordSafeTrainers = removePassFromTrainerAndClients(trainers);
    res.send({ success: passwordSafeTrainers });

  } catch (error) {
    console.log("Error getting trainers: ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

// ----------------------- EDIT USER PROFILE -------------------------------

app.post("/edit-profile", verifyToken, async (req, res) => {
  const userId = req.userId;
  const updateData = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: updateData.email, id: userId }
    });

    if (!user) { return res.send({ error: "User not found!" }) };

    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateData.firstName || undefined,
        lastName: updateData.lastName || undefined,
        userName: updateData.userName || undefined,
        profileImage: updateData.profileImage || undefined,
      }
    });

    res.send({ success: "Profile updated successfully!" });

  } catch (error) {
    console.log("Error updating profile :", error);
    res.send({ error: "Something went wrong, try again later!" })
    return;
  }
});

// --------------------------------- DELETE GUIDE ------------------------------------

app.post("/delete-guide", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { clientId } = req.body;

  try {
    const userTryingToDelete = await prisma.user.findUnique({
      where: { id: userId }
    });

    const guide = await prisma.guide.findFirst({
      where: { clientId: clientId },
      include: { client: true }
    });

    if (!guide) { return res.send({ error: "Guide not found!" }) };

    if (userId !== guide.clientId && userTryingToDelete.role !== "TRAINER") {
      return res.send({ error: "User is unauthorized to delete the guide!" });
    };

    await prisma.guide.delete({
      where: { id: guide.id }
    });

    const remainingGuides = await prisma.guide.findMany({
      where: { clientId: guide.clientId }
    });

    if (remainingGuides.length === 0 && guide.client.trainerId) {

      await prisma.user.update({
        where: { id: guide.clientId },
        data: { trainerId: null }
      });

      await prisma.user.update({
        where: { id: guide.client.trainerId },
        data: {
          clients: {
            disconnect: { id: guide.clientId }
          }
        }
      });

      await prisma.message.deleteMany({
        where: {
          OR: [
            {
              senderId: guide.clientId,
              recipientId: guide.client.trainerId
            },
            {
              senderId: guide.client.trainerId,
              recipientId: guide.clientId
            }
          ]
        }
      });
    }

    res.send({ success: "Guide has been deleted" });

  } catch (error) {
    console.log("Error deleting guide: ", error);
    res.send({ error: "Something went wrong, try again later!" });
    return;
  }
});

// ------------------------------ GET TRAINER -----------------------------------------

app.get("/get-current-trainer", verifyToken, async (req, res) => {
  const userId = req.userId;

  const sanitizeTrainerAndClients = (trainer) => {
    if (!trainer) return null;

    return {
      ...omitPasswordFromUser(trainer),
      clients: trainer.clients.map(client => ({
        ...omitPasswordFromUser(client),
        sentMessages: removePasswordFromMessages(client.sentMessages),
        receivedMessages: removePasswordFromMessages(client.receivedMessages)
      })),
    };
  };

  try {
    const trainer = await prisma.user.findUnique({
      where: { id: userId, role: "TRAINER" },
      include: {
        clients: {
          include: {
            sentMessages: {
              orderBy: { createdAt: "desc" },
              include: {
                sender: true,
                recipient: true
              }
            },
            receivedMessages: {
              orderBy: { createdAt: "desc" },
              include: {
                sender: true,
                recipient: true
              }
            },
            guides: {
              include: {
                days: {
                  include: {
                    mealPlans: {
                      include: {
                        ingredients: true
                      },
                    },
                    exercises: true,
                  },
                },
              },
            },
          }
        },
      },
    });

    if (!trainer) { return res.send({ error: "Trainer cannot be found!" }) };

    const noPassTrainer = sanitizeTrainerAndClients(trainer);
    res.send({ success: noPassTrainer });

  } catch (error) {
    console.log("Error getting trainer:", error);
    res.send({ error: "Something went wrong, try again later!" });
    return;
  }
});

//---------------- GET USER BY ID ----------------------------------

app.post("/get-user-by-id", async (req, res) => {
  const { userId } = req.body;

  const sanitizeUser = (user) => {
    if (!user) return null;

    return {
      ...omitPasswordFromUser(user),
      cart: user.cart,
      sentMessages: removePasswordFromMessages(user.sentMessages),
      receivedMessages: removePasswordFromMessages(user.receivedMessages),
    };
  };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cart: true,
        sentMessages: {
          orderBy: { createdAt: "desc" },
          include: {
            sender: true,
            recipient: true
          }
        },
        receivedMessages: {
          orderBy: { createdAt: "desc" },
          include: {
            sender: true,
            recipient: true
          }
        },
        guides: {
          include: {
            days: {
              include: {
                mealPlans: {
                  include: {
                    ingredients: true
                  },
                },
                exercises: true,
              },
            },
          },
        },
      },
    });

    if (!user) { return res.send({ error: "User could not be found!" }) };

    const noPassUser = sanitizeUser(user);
    res.send({ success: noPassUser });

  } catch (error) {
    console.log("Error getting user by id:", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

// ------------------------------- GET MESSAGES FROM -------------------------------

app.post("/get-messages-from-client", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { clientId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) { return res.send({ error: "User could not be found!" }) };

    if (user.role !== "TRAINER") { return res.send({ error: "Unautorized access, user is not TRAINER!" }) };

    const sentMessages = await prisma.message.findMany({
      where: { senderId: userId, recipientId: clientId },
      orderBy: [
        { createdAt: 'desc' }
      ],
      include: { recipient: true, sender: true }
    });

    const recievedMessages = await prisma.message.findMany({
      where: { senderId: clientId, recipientId: userId },
      orderBy: [
        { createdAt: 'desc' }
      ],
      include: { recipient: true, sender: true }
    });

    const noPassSentMessages = removePasswordFromMessages(sentMessages);
    const noPassRecievedMessages = removePasswordFromMessages(recievedMessages);

    res.send({ messages: { sentMessages: noPassSentMessages, recievedMessages: noPassRecievedMessages } });

  } catch (error) {
    console.log("Error getting messages from client:", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

// ------------------------------- DELETE MESSAGE -------------------------------

app.post("/delete-message", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { messageId } = req.body;

  if (!messageId) { return res.send({ error: "No messageId provided!" }) };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) { return res.send({ error: "User not found!" }) };

    const messageToDelete = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!messageToDelete) { return res.send({ error: "Message to delete could not be found!" }) };

    if (user.id !== messageToDelete.senderId && user.role !== "TRAINER") {
      return res.send({ error: "Unautorized delete request!" });
    };

    await prisma.message.delete({
      where: { id: messageToDelete.id }
    });

    res.send({ success: "Message has been deleted!" });

  } catch (error) {
    console.log("Error deleting message:", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

//----------------------------- CREATE PRODUCT ------------------------------------------

app.post("/create-new-product", verifyToken, async (req, res) => {
  const userId = req.userId;
  const productData = req.body;

  if (
    !productData.title ||
    !productData.imageUrl ||
    !productData.price ||
    !productData.rating ||
    !productData.quantity
  ) {
    return res.send({ error: "No fields can be left empty when creating a product!" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) { return res.send({ error: "User not found!" }) };
    if (user.role !== "TRAINER" || user.role !== "ADMIN") {
      return res.send({ error: "Only admins and trainers can create new products" })
    };

    await prisma.product.create({
      data: {
        title: productData.title,
        imageUrl: productData.imageUrl,
        price: productData.price,
        rating: productData.rating,
        quantity: productData.quantity,
        special: productData.special && productData.special
      }
    });

    res.send({ success: "Product has been created!" });

  } catch (error) {
    console.log("Error creating new product: ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

//----------------- GET ALL PRODUCTS AND SPECIAL PRODUCTS ----------------------

app.get("/get-all-products", async (req, res) => {
  try {
    const allProducts = await prisma.product.findMany({});

    if (!allProducts) { return res.send({ error: "No Products found" }) };

    const specialProducts = await prisma.product.findMany({
      where: { special: true }
    });

    res.send({ products: { allProducts, specialProducts } });

  } catch (error) {
    console.log("Error getting products: ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

// ------------------------------- ADD TO CART -------------------------------

app.post("/add-to-cart", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { productId } = req.body;
  const { productPrice } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { cart: true }
    });

    if (!user) { return res.send({ error: "User could not be found!" }) };

    let cartId;
    if (user.cart) {
      cartId = user.cart.id;
    } else {
      const newCart = await prisma.cart.create({
        data: {
          userId: userId
        }
      });
      cartId = newCart.id;
    };

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        productId: productId,
        cartId: cartId
      }
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + 1
        }
      });

      res.send({ success: "Product updated in cart!" });

    } else {
      await prisma.cartItem.create({
        data: {
          productId: productId,
          cartId: cartId,
          quantity: 1,
          price: productPrice
        }
      });

      res.send({ success: "Product has been added to cart!" });
    };

  } catch (error) {
    console.log("Error adding to cart: ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

// ------------------------------- UPDATE CARTITEM -------------------------------

app.post("/update-cart-item", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { cartItemId } = req.body;
  const { quantity } = req.body;

  if (!quantity) { return res.send({ error: "No quantity provided!" }) };
  if (!cartItemId) { return res.send({ error: "No cartItemId provided!" }) };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) { return res.send({ error: "User could not be found!" }) };

    const cartItemToUpdate = await prisma.cartItem.findUnique({
      where: { id: cartItemId }
    });

    if (!cartItemToUpdate) { return res.send({ error: "Cart to update could not be found!" }) };

    if (quantity < 1) {
      await prisma.cartItem.delete({
        where: { id: cartItemToUpdate.id }
      });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemToUpdate.id },
        data: {
          quantity: parseInt(quantity)
        }
      });
    };

    res.send({ success: "Cart has been updated!" });

  } catch (error) {
    console.log("Error updating cart : ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  };
});

// ------------------------------- DELETE CARTITEM -------------------------------

app.post("/delete-cart-item", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { cartItemId } = req.body;

  if (!cartItemId) { return res.send({ error: "No cartItemId provided!" }) };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) { return res.send({ error: "User could not be found!" }) };

    const cartItemToDelete = await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    if (!cartItemToDelete) { return res.send({ error: "Something went wrong when trying to delete!" }) };

    res.send({ success: "Cartitem has been deleted!" });

  } catch (error) {
    console.log("Error updating cart : ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  };
});

// ------------------------------- GET PRODUCT BY ID -------------------------------

app.post("/get-product-by-id", async (req, res) => {
  const { productId } = req.body;

  if (!productId) { return res.send({ error: "No productId provided!" }) };

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) { return res.send({ error: "Could not find product!" }) };

    res.send({ success: product })

  } catch (error) {
    console.log("Error getting product by id : ", error);
    res.send({ error: "Something went wrong, please try again later!" });
    return;
  }
});

app.listen(port, () => {
  console.log("Server is running on port:", port);
});