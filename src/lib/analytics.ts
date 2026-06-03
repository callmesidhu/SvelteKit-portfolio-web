interface IpapiResponse {
	city?: string;
	region?: string;
	country_name?: string;
	country?: string;
}

interface GeolocationDbResponse {
	city?: string;
	state?: string;
	country_name?: string;
}

export async function getVisitorLocation(): Promise<string> {
	if (typeof window === 'undefined') return 'Someone';
	if (typeof sessionStorage !== 'undefined') {
		const cached = sessionStorage.getItem('visitor_location');
		if (cached) return cached;
	}
	try {
		// Try primary IP geolocation API (ipapi.co)
		const res = await fetch('https://ipapi.co/json/');
		if (res.ok) {
			const data = (await res.json()) as IpapiResponse;
			if (data && data.city) {
				const region = data.region ? `, ${data.region}` : '';
				const country = data.country_name ? `, ${data.country_name}` : '';
				const formatted = `${data.city}${region}${country}`;
				if (typeof sessionStorage !== 'undefined') {
					sessionStorage.setItem('visitor_location', formatted);
				}
				return formatted;
			}
		}
	} catch (e) {
		// Try secondary fallback (geolocation-db)
		try {
			const res = await fetch('https://geolocation-db.com/json/');
			if (res.ok) {
				const data = (await res.json()) as GeolocationDbResponse;
				if (data && data.city && data.city !== 'Not Found') {
					const stateStr = data.state && data.state !== 'null' ? `${data.state}, ` : '';
					const formatted = `${data.city}, ${stateStr}${data.country_name || ''}`;
					if (typeof sessionStorage !== 'undefined') {
						sessionStorage.setItem('visitor_location', formatted);
					}
					return formatted;
				}
			}
		} catch (err2) {
			console.warn('Fallback geolocation failed:', err2);
		}
	}
	return 'Someone';
}
