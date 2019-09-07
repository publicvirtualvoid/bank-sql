import { Entity, Column, PrimaryColumn, ManyToOne, BaseEntity } from "typeorm";
import { BankAccount } from "./bank-account";

@Entity()
export class BankTransaction extends BaseEntity {
  /** Financial Institution Transaction ID */
  @PrimaryColumn()
  fitId: string;

  @Column()
  date: Date;

  @Column('decimal')
  amount: number;

  @Column()
  name: string;

  @Column()
  memo: string;

  /** Account balance after transaction */
  @Column()
  balance: number;

  @ManyToOne(type => BankAccount, account => account.transactions)
  account: BankAccount;

  accountId?: number;
}