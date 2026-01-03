export default async (req, context) => {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    try {
        const body = await req.json();
        const { images } = body; 

        // Convert base64 images to attachments
        const attachments = images.map((img, index) => ({
            content: img.split(',')[1], 
            filename: `memory_${index + 1}.jpg`,
        }));

        const fromEmail = "onboarding@resend.dev"; // Or your verified domain
        const toEmail = "YOUR_PERSONAL_EMAIL@gmail.com"; 
        const subject = "A Message from Roshni";
        
        // HTML Body - Pure Story Context
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>"It wasn't a dream..."</h2>
                <p>Hey,</p>
                <p>I woke up thinking it was all in my head, but then I found these.</p>
                <p>I'm glad we captured this moment. Don't lose them, okay?</p>
                <br/>
                <p>- Roshni</p>
            </div>
        `;

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
                html: htmlContent,
                attachments: attachments
            })
        });

        if (!response.ok) throw new Error(await response.text());

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
