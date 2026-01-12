import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function GoogleLogin({ signType, onStart, onComplete, redirectToLogin }) {
	const navigate = useNavigate();
	const { showToast } = useToast();
	const buttonRef = useRef(null);
	const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

	// Use refs for callbacks to avoid re-triggering useEffect
	const onStartRef = useRef(onStart);
	const onCompleteRef = useRef(onComplete);

	useEffect(() => {
		onStartRef.current = onStart;
		onCompleteRef.current = onComplete;
	}, [onStart, onComplete]);

	// If client ID is missing, show a helpful message
	if (!clientId) {
		return (
			<div className="w-full">
				<div className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background/80 px-4 text-sm font-semibold text-foreground">
					<span className="mr-2">⚠️</span>
					Google sign-in is not configured.
				</div>
			</div>
		);
	}

	useEffect(() => {
		let isMounted = true;

		const handleCredentialResponse = async (response) => {
			if (onStartRef.current) onStartRef.current();
			try {
				const id_token = response.credential;
				const res = await axios.post(
					`${VITE_API_URL}/api/auth/social/google/login/`,
					{ id_token },
					{ headers: { "Content-Type": "application/json" } }
				);

				if (!isMounted) return;

				localStorage.setItem("access", res.data.access);
				localStorage.setItem("refresh", res.data.refresh);
				localStorage.setItem("user", JSON.stringify(res.data.account));

				const user = res.data.account || {};
				console.log("Google Login Success. User:", user);

				// sensitive check: ensure profiles exists and has at least one item
				const hasProfiles = user.profiles && Array.isArray(user.profiles) && user.profiles.length > 0;
				console.log("Has Profiles:", hasProfiles);

				// If signup and redirectToLogin is true, redirect to login page
				if (signType === 'signup' && redirectToLogin) {
					showToast("Account created successfully! Please sign in.", { type: "success" });
					// Clear the stored credentials since we want them to login manually
					localStorage.removeItem("access");
					localStorage.removeItem("refresh");
					localStorage.removeItem("user");
					navigate("/login");
					return;
				}

				if (hasProfiles) {
					// User already has profiles -> go to home
					showToast("Sign in successful!", { type: "success" });
					navigate("/");
				} else {
					// User has no profiles/roles -> go to role selection to create one
					if (signType === 'signup') {
						showToast("Registered Successfully", { type: "success" });
					} else {
						showToast("Please create a profile", { type: "info" });
					}
					navigate("/role");
				}
			} catch (error) {
				if (!isMounted) return;
				console.error("Error during login:", error);
				showToast("Login failed. Please try again.", { type: "error" });
			} finally {
				if (isMounted && onCompleteRef.current) onCompleteRef.current();
			}
		};

		const initializeGoogle = () => {
			if (window.google?.accounts?.id && buttonRef.current) {
				const buttonText = signType === 'signup' ? 'signup_with' : 'signin_with';

				window.google.accounts.id.initialize({
					client_id: clientId,
					callback: handleCredentialResponse,
				});

				window.google.accounts.id.renderButton(
					buttonRef.current,
					{ theme: "outline", size: "large", text: buttonText, width: "100%" }
				);
			}
		};

		// Check if script already exists
		let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

		if (!script) {
			script = document.createElement("script");
			script.src = "https://accounts.google.com/gsi/client";
			script.async = true;
			script.defer = true;
			script.onload = initializeGoogle;
			document.body.appendChild(script);
		} else {
			// If script exists but window.google is not yet available, wait for it
			if (window.google?.accounts?.id) {
				initializeGoogle();
			} else {
				script.addEventListener('load', initializeGoogle);
			}
		}

		return () => {
			isMounted = false;
			if (script) {
				script.removeEventListener('load', initializeGoogle);
			}
			if (window.google?.accounts?.id) {
				try {
					window.google.accounts.id.cancel();
				} catch (e) { }
			}
		};
	}, [navigate, clientId, signType]);

	return (
		<div className="w-full">
			<div ref={buttonRef} className="w-full min-h-[44px]"></div>
		</div>
	);
}
