import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";

export default function GoogleLogin({ signType }) {
	const navigate = useNavigate();

	const { showToast } = useToast();

	const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

	// If client ID is missing, show a helpful message instead of attempting to load GSI
	if (!clientId) {
		return (
			<div className="w-full">
				<div className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background/80 px-4 text-sm font-semibold text-foreground">
					<span className="mr-2">⚠️</span>
					Google sign-in is not configured. Set `VITE_GOOGLE_CLIENT_ID` in your `.env` and restart dev server.
				</div>
			</div>
		);
	}

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;

		const handleCredentialResponse = async (response) => {
			// try {
			const id_token = response.credential;
			// POST id_token to your custom accounts/google/login/ endpoint (backend should verify)
			const res = await axios.post(
				"http://127.0.0.1:8000/api/auth/social/google/login/",
				{ id_token },
				{ headers: { "Content-Type": "application/json" } }
			);

			if (res.data.access) localStorage.setItem("access", res.data.access);
			if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);
			if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));
			if (!res.data.user && res.data) localStorage.setItem("user", JSON.stringify(res.data));

			console.log("Google signup/login response:", res.data);

			if (signType === 'signup') {
				showToast("Registered Successfully", { type: "success" })

			} else {
				showToast("Sign in successful!", { type: "success" });

			}


			navigate("/role");
			// } catch (err) {
			// 	console.error("Google login error:", err.response ?? err);
			// 	alert("Google sign-in failed. Check console and backend expectations (id_token vs access_token).");
			// }
		};



		script.onload = () => {
			let buttonText;

			if (signType === 'signup') {
				buttonText = 'signup_with';
			}
			else{
				buttonText = 'signin_with';
			}
			console.log(buttonText)

			if (window.google && window.google.accounts && window.google.accounts.id) {
				window.google.accounts.id.initialize({
					client_id: clientId,
					callback: handleCredentialResponse,
				});

				window.google.accounts.id.renderButton(
					document.getElementById("google-signup-button"),
					{ theme: "outline", size: "large", text: buttonText }
				);

				// optional: show One Tap
				// window.google.accounts.id.prompt();
			}
		};

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
			if (window.google && window.google.accounts && window.google.accounts.id) {
				try {
					window.google.accounts.id.cancel();
				} catch (e) { }
			}
		};
	}, [navigate, clientId]);

	return (
		<div>
			<div id="google-signup-button"></div>
		</div>
	);
}
