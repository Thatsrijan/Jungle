export default async (req, context) => {
    // Only allow POST requests
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await req.json();
        const { images } = body;

        // Prepare attachments for Resend
        // We strip the "data:image/jpeg;base64," part to get just the clean buffer
        const attachments = images.map((img, index) => ({
            content: img.split(',')[1], 
            filename: `memory_${index + 1}.jpg`,
        }));

        // --- EDIT YOUR EMAIL DETAILS HERE ---
        const fromEmail = "onboarding@resend.dev"; // Or your verified domain
        const toEmail = "srijan.gupta872@gmail.com"; // Where you want to receive the photos
        const subject = "Photos from the Jungle";
        // ------------------------------------

        // Call Resend API directly (using Node.js native fetch)
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${Netlify.env.get("RESEND_API_KEY")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [toEmail],
                subject: subject,
                html: "<p><strong>Roshni:</strong> It wasn't a dream. Here are the memories we kept.</p>",
                attachments: attachments
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error("Email Failed:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
