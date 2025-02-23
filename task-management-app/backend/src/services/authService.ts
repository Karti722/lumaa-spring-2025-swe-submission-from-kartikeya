import { User } from '../models/userModel';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePasswords } from '../utils/bcrypt';

export const registerUser = async (username: string, password: string) => {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, password: hashedPassword });
    return await newUser.save();
};

export const loginUser = async (username: string, password: string) => {
    const user = await User.findOne({ username });
    if (!user || !(await comparePasswords(password, user.password))) {
        throw new Error('Invalid username or password');
    }
    const token = generateToken(user.id);
    return { user, token };
};