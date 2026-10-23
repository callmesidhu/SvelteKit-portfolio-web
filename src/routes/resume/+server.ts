import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	redirect(302, '/resume/callmesidhu_resumeV6.pdf');
};
