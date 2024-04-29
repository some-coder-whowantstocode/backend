const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user.model"); // Import User model
const Admin = require("./models/admin.model"); // Import Admin model

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/test");
app.get("/allusers", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Registration form for admin
app.post("/admin/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const data = {
      username,
      email,
      password,
    };
    const user = await Admin.create([data]);
    res.status(200).json({ user });
    // const { username, email, password } = req.body;
    // // Check if required data is provided
    // if (!username || !email || !password) {
    //   throw new Error(
    //     "Missing value. Please provide admin username, email, and password."
    //   );
    // }
    // const admin = new Admin({ username, email, password });
    // await admin.create();
    // res.status(200).json({ admin });
  } catch (error) {
    res.status(400).json({ error: "Some problem in admin register" });
  }
});

app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await Admin.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "user is not exist" });
    }
    // const isPasswordValid = await Admin.compare(password, userExist.password);

    if (password === userExist.password) {
      // If password is invalid, return an error
      return res.status(400).json({ message: "Invalid password" });
    } else {
      res.status(200).json({
        msg: "Login Successful",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "some problem in admin login page" });
  }
});

app.post("/admin/logout", (req, res) => {
  // Implement logout logic for admin
});

// Registration form for user

app.post("/user/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(res.body, "qqqqqqqqq");
    const data = {
      username,
      email,
      password,
    };
    res.status(200).json({ user });

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ msg: "email already exists" });
    }

    if (!username || !email || !password) {
      throw new Error(
        "Missing required fields. Please provide username, email, and password."
      );
    }

    // Uncomment the following code if you want to create a new user using Mongoose model
    // const user = await new User.create({ username, email, password });
    res.status(200).json({ user });
    const user = await User.create([data]);
  } catch (error) {
    // Handle errors
    res.status(400).json({ error: "some problem in user register" });
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body, "jdjj");
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "user is not exist" });
    }
    // const isPasswordValid = await User.compare(password, userExist.password);

    if (password !== userExist.password) {
      // If password is invalid, return an error
      return res.status(400).json({ message: "Invalid password" });
    } else {
      res.status(200).json({
        msg: "Login Successful",
      });
    }

    res.status(200).json({ message: "Login successful" });
    // const { email, password } = req.body;
    // User.findOne({ email: email })
    //   .then((user) => {
    //     if (user) {
    //       if (user.password === password) {
    //         res.json("Success");
    //       } else {
    //         res.json("The password is incorrect");
    //       }
    //     } else {
    //       res.json("No record exists. Please register first.");
    //     }
    //   })
    //   .catch((err) => res.json(err));
  } catch (error) {
    res.status(400).json({ error: "some problem in user login" });
  }
});

app.post("/user/logout", (req, res) => {
  // Implement logout logic for user
});

// Todo features
app.post("/user/todolist", async (req, res) => {
  try {
    // Find the user(s) by email
    const users = await User.find({ email: req.body.email });

    // If no users found, you might want to handle this case
    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    // Extract todo lists from each user and send as response
    const todoLists = users.map((user) => ({
      email: user.email,
      todo: user.todo,
    }));

    res.status(200).json(todoLists);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
});

app.post("/user/add", async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // If user does not exist, you might want to handle this case
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the new todo object
    const newTodo = {
      myTodo: req.body.todo,
      // todoId: req.body.todoId,
      // todoDate: req.body.todoDate,
      todoDate: Date.now(),
    };
    console.log(newTodo, "newTodo");
    // Add the new todo to the user's todo list
    user.todo.push(newTodo);

    // Save the updated user
    const updatedUser = await user.save();

    // Send the updated user as response
    res.send(updatedUser);
  } catch (err) {
    // Handle any errors
    res.status(500).json({ error: err.message });
  }
});

// app.post("/update/:id", async (req, res) => {
// // Implement update logic for todo
// });
// app.post("/user/delete",async (req, res) => {
//   try {
//     const deleteTodo = await User.find({ email:req.body.email });
//     let request = { myTodo: req.body.todo, todoId: req.body.todoId };
//     deleteTodo[0].todo.pop(request);
//     const userDel = await User.findByIdAndDelete(
//       { email: req.body.email },
//       { todo: addUSer[0].todo }
//     );
//     res.send(userDel);
//   } catch (error) {
//     res.status(500).json({ error: err.message });
//   }
// });
app.post("/user/edit", async (req, res) => {
  try {
    const userEdit = await User.findOne({ email: req.body.email });
    if (!userEdit) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the todo item
    userEdit.todo.forEach((todo, index) => {
      if (todo._id.toString() === req.params.id) {
        userEdit.todo[index].myTodo = req.body.todo;
      }
    });

    // Save the updated user
    const userMod = await userEdit.save();

    res.send(userMod);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/user/delete", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter out the todo to delete
    user.todo = user.todo.filter((todo) => {
      return todo._id.toString() !== req.body._id;
    });
    console.log(req.body, "h---------------");
    // Add the deleted todo to the history
    user.doneTodo.push({
      myTodo: req.body.todo,
      todoId: req.body._id,
    });

    // Save the updated user
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// app.post("/mark", (req, res) => {
//   // Implement mark logic for todo
//   res.status(500).json({ error: err.message });
// });
// app.post("/complete", (req, res) => {
//   // Implement complete logic for todo
//   try {
//   } catch (error) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/uncomplete", (req, res) => {
//   // Implement uncomplete logic for todo
//   res.status(500).json({ error: err.message });
// });

// Server
const port = 8000; // Specify the desired port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
