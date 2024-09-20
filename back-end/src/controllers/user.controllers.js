import { User } from "../models/user.models.js";
import { UserDrawing } from "../models/userDrawingSchema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while login",
    });
  }
};

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    if (!password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const newUser = await User.create({
      name: name.toLowerCase(),
      email,
      password,
    });
    const userID = `USID${newUser._id.toString().slice(-4).toUpperCase()}`;
    newUser.userID = userID;
    await newUser.save();
    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      return res.status(404).json({
        success: false,
        message:
          "Something went wrong while registering. Please try again later.",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User registered succssfully",
      data: createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating User",
      error: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        code: 400,
        success: false,
        message: "Invalid User, Register",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!loggedInUser) {
      return res.status(500).json({
        success: false,
        message: "Error fetching user details",
      });
    }
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while logging in",
      error: error.message,
    });
  }
};

const userLogout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: "",
        },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while logging out"));
  }
};

const userDrawing = async (req, res) => {
  try {
    const userID = req.user._id;
    const { newDrawings } = req.body;
    if (!newDrawings || newDrawings.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No drawings data provided by the user",
      });
    }

    for (const drawing of newDrawings) {
      if (!drawing.type || !drawing.coordinates) {
        return res.status(400).json({
          success: false,
          message: "Each drawing must have a type and coordinates",
        });
      }
    }

    let userDrawingDataAvailableOrCreating = await UserDrawing.findOne({
      userID,
    });

    if (!userDrawingDataAvailableOrCreating) {
      userDrawingDataAvailableOrCreating = new UserDrawing({
        userID: userID,
        drawings: newDrawings,
      });
    } else {
      userDrawingDataAvailableOrCreating.drawings.push(...newDrawings);
    }

    await userDrawingDataAvailableOrCreating.save();

    return res.status(200).json({
      success: true,
      message: "Drawing data saved successfully",
      data: userDrawingDataAvailableOrCreating,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error saving drawing data",
      error: error.message,
    });
  }
};

const getDrawings = async (req, res) => {
  const userID = req.user._id;
  try {
    const userDataAvailable = await UserDrawing.findOne({ userID: userID });

    if (!userDataAvailable) {
      return res.status(404).json({
        success: false,
        message: "No drawing data available for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: userDataAvailable,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting drawing data",
      error: error.message,
    });
  }
};

export { userRegister, userLogin, userLogout, userDrawing, getDrawings };
