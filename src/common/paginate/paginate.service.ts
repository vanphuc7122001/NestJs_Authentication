import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

interface PaginationParams {
  key: string;
  page: number;
  pageSize: number;
  search?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
  fetchFunction: (params: any) => Promise<any[]>;
}

@Injectable()
export class PaginateService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async paginate({
    key,
    page,
    pageSize,
    search,
    orderBy,
    order,
    filters,
    fetchFunction,
  }: PaginationParams) {
    const cacheKey = `${key}:page:${page}:size:${pageSize}:search:${search}:orderBy:${orderBy}:order:${order}:filters:${JSON.stringify(filters)}`;
    let value = await this.cacheManager.get(cacheKey);

    if (value) {
      return JSON.parse(value as any);
    }

    value = await fetchFunction({ search, orderBy, order, filters });
    await this.cacheManager.set(cacheKey, value, 60 * 60); // Cache for 5 minutes

    return value;
  }
}
