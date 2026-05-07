import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// We use the glob on the src folder to find the latest filename at build time.
// This is necessary because Vercel can't list files in 'static' at runtime.
const resumes = import.meta.glob('$lib/assets/resumes/*.pdf', { 
    eager: true 
});

export const GET: RequestHandler = async () => {
    // Extract the filenames from the keys of the glob object
    const fileList = Object.keys(resumes).map(path => path.split('/').pop() || '');

    if (fileList.length === 0) {
        throw error(404, 'No resume found in src/lib/assets/resumes');
    }

    // Sort by name descending (latest version first)
    fileList.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));

    const latest = fileList[0];

    // Redirect to the clean static URL. 
    // This assumes you have the same file in static/resume/[filename]
    throw redirect(307, `/resume/${latest}`);
};
