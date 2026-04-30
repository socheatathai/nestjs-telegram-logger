import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mail: string;

  @Column()
  name: string;

  @Column('int')
  age: number;

  @Column({ default: true })
  isActive: boolean;
}
