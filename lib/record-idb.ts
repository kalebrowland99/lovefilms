export type PendingRecording = {
  id: string;
  mime: string;
  chunks: Blob[];
  blob?: Blob;
  hostId: string;
  title: string;
  startedAt: number;
  utterances: { id: string; text: string; speaker: string; startMs: number; endMs: number; at: number }[];
  createdAt: number;
  complete: boolean;
};

const DB_NAME = 'ylf-record-audio';
const STORE = 'pending';
const VERSION = 1;

let queue: Promise<unknown> = Promise.resolve();

function run<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn);
  queue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available'));
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
  });
}

export function pendingBlob(pending: PendingRecording): Blob | undefined {
  if (pending.blob && pending.blob.size > 0) return pending.blob;
  if (pending.chunks.length) return new Blob(pending.chunks, { type: pending.mime || 'audio/webm' });
  return undefined;
}

export async function savePendingRecording(input: PendingRecording): Promise<void> {
  await run(async () => {
    const db = await openDb();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error('IndexedDB write failed'));
        tx.objectStore(STORE).put(input);
      });
    } finally {
      db.close();
    }
  });
}

export async function getPendingRecording(id: string): Promise<PendingRecording | undefined> {
  return run(async () => {
    const db = await openDb();
    try {
      return await new Promise<PendingRecording | undefined>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).get(id);
        req.onsuccess = () => resolve(req.result as PendingRecording | undefined);
        req.onerror = () => reject(req.error || new Error('IndexedDB read failed'));
      });
    } finally {
      db.close();
    }
  });
}

export async function listPendingRecordings(): Promise<PendingRecording[]> {
  return run(async () => {
    const db = await openDb();
    try {
      return await new Promise<PendingRecording[]>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).getAll();
        req.onsuccess = () => resolve((req.result as PendingRecording[]) || []);
        req.onerror = () => reject(req.error || new Error('IndexedDB list failed'));
      });
    } finally {
      db.close();
    }
  });
}

export async function deletePendingRecording(id: string): Promise<void> {
  await run(async () => {
    const db = await openDb();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error('IndexedDB delete failed'));
        tx.objectStore(STORE).delete(id);
      });
    } finally {
      db.close();
    }
  });
}
