/**
 * @file This module exports the Repository class.
 * @module core/repository
 *
 * @description This abstract class serves as a base for all repository implementations in the application.
 * It defines the basic CRUD operations that any repository should implement.
 */

export abstract class Repository<T> {
  abstract save(entity: T): Promise<T>;

  abstract findById(id: string): Promise<T>;
}
