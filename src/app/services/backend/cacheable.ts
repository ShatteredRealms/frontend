import { Subject } from "rxjs";
import { FetchType } from "./fetch";

export interface ICacheUpdate<T> {
  item?: T;
  added: boolean;
}

export interface ICacheError {
  error: any;
  cause: any;
}

export class MapCached<T> {
  static readonly USED_CACHES = new Set<string>();

  protected readonly _update$ = new Subject<ICacheUpdate<T>>();
  readonly onUpdated = this._update$.asObservable();

  protected readonly _error$ = new Subject<ICacheError>();
  readonly onError = this._error$.asObservable();

  protected _itemsCache = {
    fetchType: FetchType.NEVER,
    fetched: 0,
    values: new Map<string, T>()
  }

  maxAge = 1000 * 60 * 1; // 5 minutes

  constructor(
    protected name: string,
    protected key: keyof T,
    protected getItemAction: (id: string) => Promise<T>,
    protected getItemsAction: () => Promise<T[]>,
  ) {
    if (MapCached.USED_CACHES.has(this.name)) {
      throw new Error(`Cache with name ${this.name} already exists`);
    } else {
      MapCached.USED_CACHES.add(this.name);
    }

    if (typeof (key) !== 'string') {
      throw new Error('Key must be a string property that identifies the item');
    }

    this._loadCache();
  }

  protected _addCacheItem(item: T) {
    this._itemsCache.values.set(item[this.key] as string, item);
    this._saveCache();
  }

  protected _removeCacheItem(itemId: string) {
    this._itemsCache.values.delete(itemId);
    this._saveCache();
  }

  protected _replaceCacheItems(items: T[]) {
    this._itemsCache.values.clear();
    items.forEach((item) => {
      this._itemsCache.values.set(item[this.key] as string, item);
    });
    this._itemsCache.fetched = Date.now();
    this._saveCache();
  }

  protected _saveCache() {
    localStorage.setItem(this.name, JSON.stringify({
      values: [...this._itemsCache.values],
      fetched: this._itemsCache.fetched,
    }));
  }

  protected _loadCache(): boolean {
    const cache = localStorage.getItem(this.name);
    if (cache) {
      try {
        const parsed = JSON.parse(cache);
        this._itemsCache.fetchType = FetchType.CACHE;
        this._itemsCache.fetched = parsed.fetched;
        this._itemsCache.values = new Map(parsed.values);
        return true
      } catch (e) {
        this._error$.next({ error: e, cause: 'loading cache' });
        return false;
      }
    }
    return false
  }

  protected _isCacheFresh() {
    return (Date.now() - this._itemsCache.fetched) < this.maxAge;
  }

  remove(itemId: string): boolean {
    const item = this._itemsCache.values.get(itemId);
    if (!item) {
      return false;
    }
    this._removeCacheItem(itemId);
    this._update$.next({ item, added: false });
    return true;
  }

  add(item: T) {
    this._addCacheItem(item);
    this._update$.next({ item, added: true });
  }

  getAll(fetchType = FetchType.AUTO): Promise<Map<string, T>> {
    return new Promise(async (resolve, reject) => {
      if (fetchType === FetchType.SERVER
        || this._itemsCache.fetchType === FetchType.NEVER
        || !this._isCacheFresh()) {
        this.getItemsAction().then((items) => {
          this._replaceCacheItems(items);
          this._update$.next({ added: true });
          resolve(this._itemsCache.values);
        }).catch((e) => {
          reject(e);
        });
        return;
      }
      resolve(this._itemsCache.values);
    });
  }

  get(itemId: string, fetchType = FetchType.AUTO): Promise<T> {
    const original = this._itemsCache.values.get(itemId);
    return new Promise(async (resolve, reject) => {
      if ((this._itemsCache.values.has(itemId) && fetchType <= FetchType.CACHE)
        || (this._isCacheFresh() && fetchType === FetchType.AUTO)) {
        resolve(this._itemsCache.values.get(itemId)!);
        return;
      }
      this.getItemAction(itemId).then((item) => {
        this._addCacheItem(item);
        if (!original || original != item) {
          this._update$.next({ item, added: true });
        }
        resolve(item);
      }).catch((e) => {
        reject(e);
      });
    });
  }
}
