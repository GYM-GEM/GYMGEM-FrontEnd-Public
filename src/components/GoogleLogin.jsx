import { useEffect } from "react";

export default function GoogleLogin() {
  useEffect(() => {
    // Make handler global
    window.handleCredentialResponse = (response) => {
      console.log("ID Token:", response.credential);

      // Decode token OR send to backend
      fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      })
        .then((res) => res.json())
        .then((data) => console.log("User:", data))
        .catch(console.error);
    };

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "941322828706-u9qgpga2j4ml82pmod27n6meebdnm24e.apps.googleusercontent.com",
        callback: window.handleCredentialResponse,
      });

      // render google button
      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );
    }
  }, []);

  return (
    <div>
      <div id="googleBtn"></div>
    </div>
  );
}
