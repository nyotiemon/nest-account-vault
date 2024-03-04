import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"
import * as bcrypt from 'bcrypt';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    email: string;

    @Column()
    name: string;

    @Column({name: 'google_id'})
    googleId: string;

    @Column({name:'hash_pwd'})
    password: string;

    @Column()
    verified: Date;

    @Column({name: 'login_count'})
    loginCount: number;

    @CreateDateColumn({name:'created_at'})
    createdAt: Date;

    static NewAccount(email: string, name: string, plainPassword: string): Account {
        var newAccount = new Account();
        newAccount.email = email;
        newAccount.name = name;

        const hashedPassword = bcrypt.hashSync(plainPassword, 10);
        newAccount.password = hashedPassword;

        return newAccount
    }
}