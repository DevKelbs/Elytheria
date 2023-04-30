const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.post("/save_ui", passport.authenticate('jwt', { session: false }), (req, res) => {
  const elementId = req.body.elementId;
  const userId = req.user.id;
  const position = req.body.position;

  // Check if an entry for this element already exists for this user
  pool.query(
    `SELECT element_positions->'${elementId}' as pos FROM "Users" WHERE id = $1`,
    [userId]
  )
    .then((data) => {
      if (data.rows[0].pos) {
        // If it exists, update it
        return pool.query(
          `UPDATE "Users" SET element_positions = jsonb_set(element_positions, '{${elementId}}', $1::jsonb) WHERE id = $2`,
          [JSON.stringify(position), userId]
        );
      } else {
        // If it doesn't exist, insert it
        return pool.query(
          `UPDATE "Users" SET element_positions = jsonb_set(element_positions, '{${elementId}}', $1::jsonb) WHERE id = $2`,
          [JSON.stringify(position), userId]
        );
      }
    })
    .then(() => {
      res.json({ success: true });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.json({ success: false, error: error });
    });
});

router.get("/ui_positions", passport.authenticate('jwt', { session: false }), (req, res) => {
    const userId = req.user.id;
  
    pool.query(
      'SELECT element_positions FROM "Users" WHERE id = $1',
      [userId]
    )
      .then(data => {
        res.json({ success: true, element_positions: data.rows[0].element_positions });
      })
      .catch(error => {
        console.error("Error:", error);
        res.json({ success: false, error: error });
      });
  });

module.exports = router;
