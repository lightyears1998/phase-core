import {
    Entity, PrimaryColumn, Column
} from "typeorm";


@Entity({ name: "app_metadata" })
export class AppMetadataEntity {
    @PrimaryColumn()
    key: string

    @Column({ nullable: true })
    value: string
}
