import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import { authenticate } from '../middlewares';

const jwt = require('jsonwebtoken');
const secretKey = process.env.AUTH_SECRET_KEY || 'ct3kpaBx2FRlwZEakQb9D4gYalEWrrly5BUyTuWGJFU=';
const router = express.Router();

// Routes
router.get<{}, MessageResponse>('/authenticated', authenticate, (req, res) => {
    res.json({
        message: 'Authenticated',
    });
});

router.post('/login', (req, res) => {
    const user = {
        id: 1,
        username: 'john.doe'
    };
    
    const accessToken = jwt.sign({ user }, secretKey, { expiresIn: '1h', algorithm: 'HS256' });
    const refreshToken = jwt.sign({ user }, secretKey, { expiresIn: '1d', algorithm: 'HS256' });
    
    res
    .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000
      })
    .header('Authorization', accessToken)
    .send(user);
});

router.post('/refresh', (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.');
    }
  
    try {
      const decoded = jwt.verify(refreshToken, secretKey);
      const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });
  
      res
        .header('Authorization', accessToken)
        .send(decoded.user);
    } catch (error) {
      return res.status(400).send('Invalid refresh token.');
    }
});

export default router;
