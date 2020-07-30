import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tests {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 32 })
  test: string;
}
