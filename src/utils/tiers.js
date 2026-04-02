// StockAlert plan system — Free / Pro / Business

export const PLANS = {
  free: {
    id: 'free',
    name: 'Gratuit',
    nameFr: 'Gratuit',
    nameEn: 'Free',
    price: 0,
    priceCFA: 0,
    limits: {
      maxProducts: 30,
      maxWorkers: 0,          // no workers on free
      transactionHistoryDays: 30,
      canExportExcel: false,
      canPrintReports: true,  // basic print is free
      canUseBulkImport: false,
      canUseCategories: true, // categories are free
      canUseWhatsApp: true,   // 1 WhatsApp alert is free
      canSeeAnalytics: false,
      canUseMultiLocation: false,
      canUseSuppliers: false,
      canUseCustomerCredit: false,
      canUseBarcodeScanner: false,
      canUseInvoices: false,
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    nameFr: 'Pro',
    nameEn: 'Pro',
    price: 3,    // USD
    priceCFA: 2000,
    limits: {
      maxProducts: 500,
      maxWorkers: 3,
      transactionHistoryDays: 365,
      canExportExcel: true,
      canPrintReports: true,
      canUseBulkImport: true,
      canUseCategories: true,
      canUseWhatsApp: true,
      canSeeAnalytics: true,
      canUseMultiLocation: false,
      canUseSuppliers: false,      // coming soon
      canUseCustomerCredit: false, // coming soon
      canUseBarcodeScanner: false, // coming soon
      canUseInvoices: false,       // coming soon
    }
  },
  business: {
    id: 'business',
    name: 'Business',
    nameFr: 'Business',
    nameEn: 'Business',
    price: 12,
    priceCFA: 8000,
    limits: {
      maxProducts: -1,  // unlimited
      maxWorkers: 10,
      transactionHistoryDays: -1,  // unlimited
      canExportExcel: true,
      canPrintReports: true,
      canUseBulkImport: true,
      canUseCategories: true,
      canUseWhatsApp: true,
      canSeeAnalytics: true,
      canUseMultiLocation: false,  // coming soon
      canUseSuppliers: false,      // coming soon
      canUseCustomerCredit: false, // coming soon
      canUseBarcodeScanner: false, // coming soon
      canUseInvoices: false,       // coming soon
    }
  }
};

// Get a user's plan — for now everyone is 'free'
// Later: read from user_profiles.plan column in Supabase
export const getUserPlan = (profile) => {
  const planId = profile?.plan || 'free';
  return PLANS[planId] || PLANS.free;
};

// Check if user can do something
export const canDo = (profile, feature) => {
  const plan = getUserPlan(profile);
  return plan.limits[feature] === true || plan.limits[feature] === -1 || plan.limits[feature] > 0;
};

// Check product limit
export const isAtProductLimit = (profile, currentProductCount) => {
  const plan = getUserPlan(profile);
  if (plan.limits.maxProducts === -1) return false; // unlimited
  return currentProductCount >= plan.limits.maxProducts;
};

// Check worker limit
export const isAtWorkerLimit = (profile, currentWorkerCount) => {
  const plan = getUserPlan(profile);
  if (plan.limits.maxWorkers === -1) return false;
  return currentWorkerCount >= plan.limits.maxWorkers;
};

// Get product limit for a user's plan
export const getProductLimit = (profile) => {
  const plan = getUserPlan(profile);
  return plan.limits.maxProducts === -1 ? 'Unlimited' : plan.limits.maxProducts;
};

// Human-readable limit message
export const getLimitMessage = (feature, lang = 'fr') => {
  const messages = {
    fr: {
      maxProducts: 'Limite de 30 produits atteinte. Passez à Pro pour plus.',
      maxWorkers: 'Ajout de travailleurs disponible en Pro.',
      canExportExcel: 'Export Excel disponible en Pro.',
      canUseBulkImport: 'Import en masse disponible en Pro.',
      canSeeAnalytics: 'Analytics disponible en Pro.',
      canUseMultiLocation: 'Multi-boutique disponible prochainement.',
      canUseSuppliers: 'Gestion fournisseurs disponible prochainement.',
      canUseCustomerCredit: 'Crédit client disponible prochainement.',
      canUseBarcodeScanner: 'Scanner code-barres disponible prochainement.',
      canUseInvoices: 'Factures disponibles prochainement.',
    },
    en: {
      maxProducts: '30 product limit reached. Upgrade to Pro for more.',
      maxWorkers: 'Adding workers is available on Pro.',
      canExportExcel: 'Excel export available on Pro.',
      canUseBulkImport: 'Bulk import available on Pro.',
      canSeeAnalytics: 'Analytics available on Pro.',
      canUseMultiLocation: 'Multi-location coming soon.',
      canUseSuppliers: 'Supplier management coming soon.',
      canUseCustomerCredit: 'Customer credit coming soon.',
      canUseBarcodeScanner: 'Barcode scanner coming soon.',
      canUseInvoices: 'Invoices coming soon.',
    }
  };
  return messages[lang]?.[feature] || 'Fonctionnalité non disponible.';
};