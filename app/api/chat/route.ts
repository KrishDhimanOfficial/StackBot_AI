import axios from "axios"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await axios.post(
      "http://127.0.0.1:11434/api/chat",
      {
        model: "gemini-3-flash-preview:latest",
        messages,
        stream: false,
      }
    )

    return Response.json({
      reply: response.data.message.content,
    })
  } catch (error: any) {
    console.log(error.response?.data)

    return Response.json(
      { error: "Chat failed" },
      { status: 500 }
    )
  }
}