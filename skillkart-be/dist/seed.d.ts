import { DataSource } from 'typeorm';
export declare class DatabaseSeeder {
    private dataSource;
    constructor(dataSource: DataSource);
    seed(): Promise<void>;
    private getStepTitle;
    private getStepDescription;
    private getResourceTitle;
    private getResourceUrl;
}
