import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity() //new db tabale
export class Post {
  @PrimaryKey() //primary key - autoincrement id generated by postgres
  id!: number;

  @Property({ type: "date" }) //tabale column
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: "text" })
  title!: string;
}
