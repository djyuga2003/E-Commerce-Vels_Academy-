// Store-wide settings — change these in one place to rebrand the shop.
export const STORE_NAME = 'EduCart';
export const STORE_TAGLINE = 'School essentials, delivered.';

// Used by Intl.NumberFormat to format every price on the site.
export const CURRENCY = 'INR';
export const LOCALE = 'en-IN';

export const MAX_QUANTITY_PER_ITEM = 99;

// Options for the "Class" dropdown on the checkout form.
export const SCHOOL_CLASSES = Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`);
