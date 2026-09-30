import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

/**
 * Database shape of the `users` table. This is NOT the domain User: it only
 * describes columns. user.mapper.ts converts between the two, so database
 * details never leak into business code.
 */
@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email: string;

  @Column({ name: 'display_name', type: 'varchar', length: 50 })
  displayName: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
