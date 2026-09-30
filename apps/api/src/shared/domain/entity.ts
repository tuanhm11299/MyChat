/**
 * An Entity is an object defined by its identity, not by its attributes.
 * Two users with the same id are the same user, even if their names differ.
 */
export abstract class Entity {
  protected constructor(public readonly id: string) {}

  equals(other: Entity): boolean {
    return other.constructor === this.constructor && other.id === this.id;
  }
}
