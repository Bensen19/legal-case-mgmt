const express = require('express');
const cors = require('cors');
const pool = require('./db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000; // ✅ FIXED: Set correct server port

const passwordValidator = require('password-validator');
const schema = new passwordValidator();
schema.is().min(8).has().uppercase().has().lowercase().has().digits();

// User Registration
app.post('/register', async (req, res) => {
  const { name, email, password, role, specialization } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, specialization) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, specialization',
      [name, email, hashedPassword, role, specialization]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔹 Login attempt for email:", email);

    // Fetch user from database
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare raw password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Case
app.post('/cases', async (req, res) => {
  const { title, description, lawyer_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cases (title, description, lawyer_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, lawyer_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const authMiddleware = require('./middleware/authMiddleware');

// Get All Cases
app.get('/cases', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cases');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get experts
app.get('/experts', async (req, res) => {
  const { specialization, location } = req.query;
  try {
    let query = 'SELECT id, name, email, role, specialization FROM users WHERE role = \'expert\'';
    const params = [];

    if (specialization) {
      params.push(`%${specialization}%`);
      query += ` AND specialization ILIKE $${params.length}`;
    }

    if (location) {
      params.push(`%${location}%`);
      query += ` AND location ILIKE $${params.length}`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update a Case by ID
app.put('/cases/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE cases SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/cases/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM cases WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ FIXED: Correct port number
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
