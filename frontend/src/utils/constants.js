export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL || '';
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
export const HACKATHON_END_DATE = '2025-12-01T10:00:00+05:30';

export const CATEGORIES = [
  'Electronics',
  'Books',
  'Clothing',
  'Furniture',
  'Sports',
  'Other',
];

export const ITEM_CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
