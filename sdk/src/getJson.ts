import { readFileSync } from 'fs';

export default function getjson(fileName: string): any {
    return JSON.parse(readFileSync(fileName).toString('utf-8'));
}