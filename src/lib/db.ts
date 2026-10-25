import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Review } from '@/types';

interface ReviewSignalDB extends DBSchema {
  reviews: {
    key: string;
    value: Review;
    indexes: {
      'by-category': string;
      'by-rating': number;
      'by-date': string;
    };
  };
  meta: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'review_signal_workspace';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ReviewSignalDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<ReviewSignalDB> | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return null;
  }
  if (!dbPromise) {
    dbPromise = openDB<ReviewSignalDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('reviews')) {
          const reviewStore = db.createObjectStore('reviews', { keyPath: 'id' });
          reviewStore.createIndex('by-category', 'category');
          reviewStore.createIndex('by-rating', 'rating');
          reviewStore.createIndex('by-date', 'date');
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta');
        }
      },
    });
  }
  return dbPromise;
}

/**
 * 批次儲存評論資料集至 IndexedDB
 */
export async function saveReviewsToDB(reviews: Review[], datasetName?: string): Promise<boolean> {
  try {
    const db = await getDB();
    if (!db) return false;

    const tx = db.transaction(['reviews', 'meta'], 'readwrite');
    await tx.objectStore('reviews').clear();

    for (const review of reviews) {
      await tx.objectStore('reviews').put(review);
    }

    if (datasetName) {
      await tx.objectStore('meta').put(datasetName, 'activeDatasetName');
    }
    await tx.objectStore('meta').put(Date.now(), 'lastSavedTimestamp');

    await tx.done;
    return true;
  } catch (error) {
    console.error('IndexedDB save failed:', error);
    return false;
  }
}

/**
 * 從 IndexedDB 載入所有評論
 */
export async function loadReviewsFromDB(): Promise<{ reviews: Review[]; datasetName: string | null } | null> {
  try {
    const db = await getDB();
    if (!db) return null;

    const tx = db.transaction(['reviews', 'meta'], 'readonly');
    const reviews = await tx.objectStore('reviews').getAll();
    const datasetName = await tx.objectStore('meta').get('activeDatasetName');

    if (!reviews || reviews.length === 0) {
      return null;
    }

    return {
      reviews,
      datasetName: datasetName || '本機持久化資料集',
    };
  } catch (error) {
    console.warn('IndexedDB load failed or not available:', error);
    return null;
  }
}

/**
 * 更新單一評論（手動標籤、分類或研究員筆記）
 */
export async function updateReviewInDB(reviewId: string, updates: Partial<Review>): Promise<boolean> {
  try {
    const db = await getDB();
    if (!db) return false;

    const tx = db.transaction('reviews', 'readwrite');
    const store = tx.objectStore('reviews');
    const existing = await store.get(reviewId);

    if (existing) {
      const merged: Review = { ...existing, ...updates };
      await store.put(merged);
    }
    await tx.done;
    return true;
  } catch (error) {
    console.error('Failed to update review in IndexedDB:', error);
    return false;
  }
}

/**
 * 清除資料庫所有評論
 */
export async function clearReviewsInDB(): Promise<boolean> {
  try {
    const db = await getDB();
    if (!db) return false;

    const tx = db.transaction(['reviews', 'meta'], 'readwrite');
    await tx.objectStore('reviews').clear();
    await tx.objectStore('meta').clear();
    await tx.done;
    return true;
  } catch (error) {
    console.error('Failed to clear IndexedDB:', error);
    return false;
  }
}
