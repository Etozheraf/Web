import { StorageService } from "src/storage/storage.service";

export interface UpdateImageStrategy {
    update(storageService: StorageService, currentInternshipUrl?: string): Promise<string | undefined>;
}

export class FileUpdateImageStrategy implements UpdateImageStrategy {
    private readonly file?: Express.Multer.File;

    constructor(file?: Express.Multer.File) {
        this.file = file;
    }

    update(storageService: StorageService, currentInternshipUrl?: string): Promise<string | undefined> {
        if (!this.file) {
            return Promise.resolve(undefined);
        }

        if (currentInternshipUrl) {
            storageService.deleteFile(currentInternshipUrl);
        }
        return storageService.uploadFile(this.file, 'internships');
    }
}

export class UrlUpdateImageStrategy implements UpdateImageStrategy {
    private readonly url?: string;

    constructor(url?: string) {
        this.url = url;
    }

    update(storageService: StorageService, currentInternshipUrl?: string): Promise<string | undefined> {
        if (!this.url) {
            return Promise.resolve(undefined);
        }

        if (currentInternshipUrl) {
            storageService.deleteFile(currentInternshipUrl);
        }
        return Promise.resolve(this.url);
    }
}