import { customAlphabet } from 'nanoid';

const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const nanoid = customAlphabet(ALPHABET, 10);

export const generateUniqueCode = () => nanoid();

export default generateUniqueCode;
