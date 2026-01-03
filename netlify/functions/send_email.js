export default async (req, context) => {
    // Only allow POST
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await req.json();
        const { images, userMessage } = body; 

        // 1. Process Photos
        const attachments = images.map((img, index) => ({
            content: img.split(',')[1], 
            filename: `memory_${index + 1}.jpg`,
        }));

        // 2. Sender Details (Display Name + Domain)
        // This format: "Name <email@domain.com>" helps avoid spam filters
        const fromEmail = "Gift For Malkin <onboarding@resend.dev>"; 
        
        // 3. Recipient (From Netlify Env)
        const toEmail = Netlify.env.get("RECIPIENT_EMAIL"); 
        if (!toEmail) {
            throw new Error("RECIPIENT_EMAIL not set in Netlify");
        }

        const subject = "A Message from Roshni";
        
        // 4. Email Body
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>"It wasn't a dream..."</h2>
                <p>Hey,</p>
                <p>I woke up thinking it was all in my head, but then I found these.</p>
                <p>I'm glad we captured this moment.</p>
                <br/>
                <hr style="border: 0; border-top: 1px solid #eee;"/>
                <p><strong>Your Personal Note:</strong></p>
                <p style="background: #f9f9f9; padding: 10px; border-left: 4px solid #007AFF; font-style: italic;">
                    "${userMessage || '(No note added)'}"
                </p>
            </div>
        `;

        // 5. Send via Resend
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

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
