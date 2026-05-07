import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Vite glob to find all PDF resumes in the assets folder.
// This is resolved at build time, ensuring it works perfectly on Vercel 
// where the filesystem isn't directly accessible at runtime.
const resumes = import.meta.glob('$lib/assets/resumes/*.pdf', { 
    query: '?url', 
    eager: true 
});

export const GET: RequestHandler = async () => {
    // Map the globbed results into a clean list of filenames and their Vite URLs
    const fileList = Object.entries(resumes).map(([filePath, module]) => ({
        name: filePath.split('/').pop() || '',
        url: (module as any).default as string
    }));

    if (fileList.length === 0) {
        console.error('No resumes found in src/lib/assets/resumes/');
        throw error(404, 'No resume found');
    }

    // Sort by name descending (e.g., callmesidhuV3.4.pdf > callmesidhuV2.1.pdf)
    // The { numeric: true } option ensures v10 > v2.
    fileList.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' }));

    const latest = fileList[0];

    // Redirect to the latest version's hashed URL. 
    // Browsers will open this inline in a new tab as requested.
    throw redirect(307, latest.url);
};
