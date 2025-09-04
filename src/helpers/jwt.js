import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido');
    }
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};