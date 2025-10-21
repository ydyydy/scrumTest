import { UniqueEntityID } from './UniqueEntityID';

export abstract class EntityRoot<T> {
  protected readonly _id: UniqueEntityID;

  protected readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    // eslint-disable-next-line no-underscore-dangle
    this._id = id || new UniqueEntityID();
    this.props = props;
  }

  public equals(object?: EntityRoot<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!EntityRoot.isEntityRoot(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }

  public static isEntityRoot(v: unknown): v is EntityRoot<unknown> {
    return v instanceof EntityRoot;
  }
}
