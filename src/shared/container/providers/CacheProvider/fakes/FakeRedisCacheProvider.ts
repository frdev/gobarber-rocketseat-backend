import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private cache = {};

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = value;
  }

  public async recover<T>(key: string): Promise<T | null> {
    return this.cache[key] || null;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }
}
