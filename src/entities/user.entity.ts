import { compare, hash } from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';
import { BaseEntityCustom } from './base.entity';
import { UserDetailEntity } from './userDetail.entity';
@Entity(`Users`)
export class UserEntity extends BaseEntityCustom {
  @Column({ length: 500 })
  username: string;

  @Column({ length: 500 })
  password: string;

  @Column()
  avatar: string;

  @Column()
  verifyAt: Date;

  @Column()
  isActive: boolean;

  @Column({ default: 'MEMBER' })
  role: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const hashedPassword = await hash(this.password, 10);
      this.password = hashedPassword;
    }
  }

  comparePassword(candidate: string) {
    return compare(candidate, this.password);
  }

  @OneToOne(() => UserDetailEntity, (userDetail) => userDetail.user)
  userDetail: Promise<UserDetailEntity>;
}
