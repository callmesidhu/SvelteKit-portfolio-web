import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs';
import path from 'path';

export const GET: RequestHandler = async () => {
    try {
        const downloadsDir = path.resolve('static/downloads');
        
        if (!fs.existsSync(downloadsDir)) {
            throw error(404, 'Downloads directory not found');
        }

        const files = fs.readdirSync(downloadsDir)
            .filter(file => file.toLowerCase().endsWith('.pdf'))
            .map(file => ({
                name: file,
                time: fs.statSync(path.join(downloadsDir, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        if (files.length === 0) {
            throw error(404, 'No resume found');
        }

        // Redirect to the latest file
        throw redirect(307, `/downloads/${files[0].name}`);
    } catch (e: any) {
        if (e.status === 307) throw e;
        console.error('Error finding latest resume:', e);
        throw error(500, 'Internal Server Error');
    }
};
