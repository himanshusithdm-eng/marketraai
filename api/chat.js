export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body;

    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SAMBANOVA_API_KEY}`
      },
      body: JSON.stringify({
        model: "Meta-Llama-3.1-8B-Instruct",
        messages: [
          {
            role: "system",
            content: "You are Ambivora AI, a helpful digital marketing assistant. Reply in simple Hinglish."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({
        reply: "SambaNova error: " + JSON.stringify(data)
      });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No reply received."
    });

  } catch (error) {
    return res.status(200).json({
      reply: "Server error: " + error.message
    });
  }
}
