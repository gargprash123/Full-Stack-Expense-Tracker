import { pool } from "../libs/database.js";
import { comparePassword, createJWT, hashPassword } from "../libs/index.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const signupUser = async (req, res) => {
  
  try {
    const { firstName, email, password } = req.body;

    if (!(firstName || email || password)) {
      return res.status(404).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const userExist = await pool.query({
      text: "SELECT EXISTS (SELECT * FROM tbluser WHERE email = $1)",
      values: [email],
    });

    if (userExist.rows[0].userExist) {
      return res.status(409).json({
        status: "failed",
        message: "Email Address already exists. Try Login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await pool.query({
      text: `INSERT INTO tbluser (firstname, email, password) VALUES ($1, $2, $3) RETURNING *`,
      values: [firstName, email, hashedPassword],
    });

    user.rows[0].password = undefined;

    res.status(201).json({
      status: "success",
      message: "User account created successfully",
      user: user.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email || password)) {
      return res.status(404).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const result = await pool.query({
      text: `SELECT * FROM tbluser WHERE email = $1`,
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password.",
      });
    }

    const isMatch = await comparePassword(password, user?.password);

    if (!isMatch) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    const token = createJWT(user.id);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

//google signin
export const googleSignIn = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ status: "failed", message: "Google token is required." });
  }

  try {
    // Verify the token from Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: google_id, email, given_name: firstName } = payload;

    // Check if user exists with this Google ID
    let userResult = await pool.query(`SELECT * FROM tbluser WHERE google_id = $1`, [google_id]);
    let user = userResult.rows[0];

    if (!user) {
      // If no user with Google ID, check if user exists with this email
      let emailUserResult = await pool.query(`SELECT * FROM tbluser WHERE email = $1`, [email]);
      let emailUser = emailUserResult.rows[0];

      if (emailUser) {
        // Email exists! Link this Google ID to the existing account
        userResult = await pool.query(
          `UPDATE tbluser SET google_id = $1, updatedat = CURRENT_TIMESTAMP WHERE email = $2 RETURNING *`,
          [google_id, email]
        );
        user = userResult.rows[0];
      } else {
        // No user exists. Create a new user.
        userResult = await pool.query(
          `INSERT INTO tbluser (firstname, email, google_id) VALUES ($1, $2, $3) RETURNING *`,
          [firstName, email, google_id]
        );
        user = userResult.rows[0];
      }
    }

    // Create our own JWT and send back the same response as signinUser
    const jwtToken = createJWT(user.id);
    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Login successfully",
      user,
      token: jwtToken,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: "Google sign-in failed. Please try again." });
  }
};