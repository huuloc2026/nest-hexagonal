import {
  PaginatedResult,
  PaginationDto,
} from 'src/shared/interface/PaginatedResult';

export interface BaseRepositoryPort<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
> {
  findAll(PaginationDto: PaginationDto): Promise<PaginatedResult<T>>;

  findById(id: string): Promise<T | null>;

  create(data: CreateDto): Promise<T>;

  update(id: string, data: UpdateDto): Promise<T>;

  delete(id: string): Promise<void>;
}
