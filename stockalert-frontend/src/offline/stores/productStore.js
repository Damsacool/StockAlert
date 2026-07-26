import { openDb } from '../db';

const STORE_NAME = 'products';

const withStore = async (mode, callback) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const result = callback(store);

    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const replaceAll = async (products) => {
  const db = await openDb();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  await new Promise((resolve, reject) => {
    store.clear();
    products.forEach((product) => store.put(product));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getAll = async () => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const upsert = async (product) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(product);

    request.onsuccess = () => resolve(product);
    request.onerror = () => reject(request.error);
  });
};

export const updateStock = async (productId, quantity) => {
  const products = await getAll();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND');
  }

  const updated = { ...product, stock: product.stock + quantity };
  await upsert(updated);
  return updated;
};
