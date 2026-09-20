import { set, get, del, keys } from 'idb-keyval';
import api from './api';
import { SaleCreate } from '@/hooks/useSale';

export const OFFLINE_QUEUE_KEY_PREFIX = 'offline_sale_';
export const CATALOG_CACHE_KEY = 'medicine_catalog_cache';

export async function cacheCatalog(medicines: any) {
  try {
    await set(CATALOG_CACHE_KEY, medicines);
  } catch (e) {
    console.error("Failed to cache catalog", e);
  }
}

export async function getCachedCatalog() {
  try {
    return await get(CATALOG_CACHE_KEY);
  } catch (e) {
    return null;
  }
}

export async function queueOfflineSale(sale: SaleCreate) {
  try {
    const id = Date.now().toString();
    const key = `${OFFLINE_QUEUE_KEY_PREFIX}${id}`;
    await set(key, { ...sale, offline_id: id, timestamp: new Date().toISOString() });
    return true;
  } catch (e) {
    console.error("Failed to queue offline sale", e);
    return false;
  }
}

export async function getOfflineSales() {
  try {
    const allKeys = await keys();
    const saleKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith(OFFLINE_QUEUE_KEY_PREFIX));
    
    const sales = [];
    for (const key of saleKeys) {
      const sale = await get(key);
      if (sale) sales.push(sale);
    }
    return sales;
  } catch (e) {
    return [];
  }
}

export async function syncOfflineSales() {
  if (!navigator.onLine) return;

  const sales = await getOfflineSales();
  for (const sale of sales) {
    try {
      // Remove offline metadata before sending to API
      const { offline_id, timestamp, ...saleData } = sale;
      await api.post('/sale/', saleData);
      
      // If success, remove from queue
      await del(`${OFFLINE_QUEUE_KEY_PREFIX}${offline_id}`);
    } catch (e) {
      console.error(`Failed to sync sale ${sale.offline_id}`, e);
      // We keep it in the queue for the next sync attempt
    }
  }
}

// Setup background sync listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log("Back online. Syncing offline sales...");
    syncOfflineSales();
  });
  
  // Periodically check just in case
  setInterval(() => {
    if (navigator.onLine) {
      syncOfflineSales();
    }
  }, 1000 * 60 * 5); // every 5 mins
}
