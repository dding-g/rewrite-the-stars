'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
	const [authStatus, setAuthStatus] = useState<any>(null);
	const [cookieStatus, setCookieStatus] = useState<any>(null);

	const checkAuth = async () => {
		try {
			const response = await fetch('/api/debug/auth');
			const data = await response.json();
			setAuthStatus(data);
		} catch (error) {
			setAuthStatus({ error: error instanceof Error ? error.message : 'Unknown error' });
		}
	};

	const checkCookies = async () => {
		try {
			const response = await fetch('/api/debug/cookie');
			const data = await response.json();
			setCookieStatus(data);
		} catch (error) {
			setCookieStatus({ error: error instanceof Error ? error.message : 'Unknown error' });
		}
	};

	const setTestCookie = async () => {
		try {
			const response = await fetch('/api/debug/cookie', { method: 'POST' });
			const data = await response.json();
			alert(JSON.stringify(data));
			checkCookies(); // 쿠키 설정 후 다시 확인
		} catch (error) {
			alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
		}
	};

	useEffect(() => {
		checkAuth();
		checkCookies();
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Auth Status */}
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Auth Status</h2>
						<button 
							onClick={checkAuth}
							className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Check Auth
						</button>
						<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
							{JSON.stringify(authStatus, null, 2)}
						</pre>
					</div>

					{/* Cookie Status */}
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Cookie Status</h2>
						<div className="space-x-2 mb-4">
							<button 
								onClick={checkCookies}
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
							>
								Check Cookies
							</button>
							<button 
								onClick={setTestCookie}
								className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
							>
								Set Test Cookie
							</button>
						</div>
						<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
							{JSON.stringify(cookieStatus, null, 2)}
						</pre>
					</div>
				</div>

				<div className="mt-8 bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">Client Side Cookies</h2>
					<pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
						{typeof window !== 'undefined' ? document.cookie : 'Loading...'}
					</pre>
				</div>
			</div>
		</div>
	);
}