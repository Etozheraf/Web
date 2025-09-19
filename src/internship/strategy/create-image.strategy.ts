import { StorageService } from "src/storage/storage.service";

export interface CreateImageStrategy {
    create(storageService: StorageService): Promise<string>;
}

export class FileCreateImageStrategy implements CreateImageStrategy {
    private readonly file: Express.Multer.File;

    constructor(file: Express.Multer.File) {
        this.file = file;
    }

    create(storageService: StorageService): Promise<string> {
        return storageService.uploadFile(
            this.file,
            'internships',
        );
    }
}

export class UrlCreateImageStrategy implements CreateImageStrategy {
    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    create(storageService: StorageService): Promise<string> {
        return Promise.resolve(this.url);
    }
}