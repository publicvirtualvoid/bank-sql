import { Entity, Column, PrimaryColumn, OneToMany, BaseEntity } from "typeorm";
import { BankTransaction } from "./bank-transaction";

@Entity()
export class BankAccount extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  type: 'credit' | 'bank';

  @OneToMany(type => BankTransaction, transaction => transaction.account)
  transactions: BankTransaction[];
}