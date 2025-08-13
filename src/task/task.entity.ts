import { Property, Entity, PrimaryKey } from "@mikro-orm/core";

@Entity ()
export class Task {
  @PrimaryKey()
  id!: number;

  @Property({nullable: false, unique: true})
  title!: string;

  @Property({nullable: false})
  description!: string;

  @Property({nullable: false})
  status?: string;

  @Property({ type: 'date', nullable: true })
  dueDate?: Date;
}
