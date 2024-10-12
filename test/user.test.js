// Import necessary modules and functions for testing
const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming your express app is exported from app.js
const User = require('../models/userModel');
const {
  registerUser,
  loginUser,
  currentUser,
} = require('../controllers/userController');

// Mocking constants and environment variables
process.env.ACCESS_TOKEN_SECRET_KEY = 'test_secret_key';

// Mocking the express-validator validationResult function
jest.mock('express-validator', () => ({
  validationResult: jest.fn().mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) }),
  body: jest.fn(),
}));

describe('User Controller', () => {
  let accessToken;

  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://localhost:27017/testDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'student',
    });

    // Generate a mock access token
    accessToken = jwt.sign(
      {
        user: {
          username: 'testuser',
          email: 'test@example.com',
          role: 'student',
          id: '1234567890',
        },
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '1d' }
    );
  });

  afterAll(async () => {
    // Disconnect mongoose after all tests are done
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clear the database after each test
    await User.deleteMany({});
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'newpassword',
        role: 'student',
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('email', userData.email);
    });

    it('should return error if email is already registered', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        role: 'student',
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('loginUser', () => {
    it('should log in an existing user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(userData)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return error if email or password is invalid', async () => {
      const userData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(userData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('currentUser', () => {
    it('should return current user information', async () => {
      const response = await request(app)
        .get('/api/users/current')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('username', 'testuser');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('role', 'student');
      expect(response.body).toHaveProperty('id', '1234567890');
    });
  });
});
