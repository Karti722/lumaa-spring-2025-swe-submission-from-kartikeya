// Configuration constants
export const API_URL = typeof __API_URL__ !== 'undefined' ? __API_URL__ : 'http://localhost:5000';

// Declare the webpack-injected constant
declare const __API_URL__: string;
