import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs';
import path from 'path';

export const GET: RequestHandler = async () => {
    try {
        // In Vercel/Production, the static folder might be in different locations
        // We try a few common locations to find the downloads directory
        const possiblePaths = [
            path.resolve('static/downloads'),
            path.join(process.cwd(), 'static/downloads'),
            // Fallback for some adapter environments
            path.join(process.cwd(), '.svelte-kit/output/client/downloads')
        ];

        let downloadsDir = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                downloadsDir = p;
                break;
            }
        }
        
        if (!downloadsDir) {
            console.error('Resume directory not found. Searched in:', possiblePaths);
            throw error(404, 'Resume directory not found');
        }

        const files = fs.readdirSync(downloadsDir)
            .filter(file => file.toLowerCase().endsWith('.pdf'))
            .map(file => ({
                name: file,
                fullPath: path.join(downloadsDir, file),
                time: fs.statSync(path.join(downloadsDir, file)).mtime.getTime()
            }))
            .sort((a, b) => {
                // First try sorting by modification time
                const timeDiff = b.time - a.time;
                if (Math.abs(timeDiff) > 1000) return timeDiff; // Only trust time if difference > 1s
                
                // Fallback: Natural sort by filename descending (e.g., v2.4 > v2.3)
                return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' });
            });

        if (files.length === 0) {
            throw error(404, 'No resume found');
        }

        const latestFile = files[0];
        const fileBuffer = fs.readFileSync(latestFile.fullPath);

        // Return the file directly with inline header to open in browser
        return new Response(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${latestFile.name}"`,
                'Cache-Control': 'no-cache'
            }
        });
    } catch (e: any) {
        if (e.status) throw e;
        console.error('Error serving latest resume:', e);
        throw error(500, 'Internal Server Error');
    }
};
