import { cookies } from "next/headers";

export async function POST(request: Request) {
    const res = await request.json();
    if (!res.token || !res.refreshToken) {
        return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }
    cookies().set('userToken', res.token, {httpOnly: true, path: '/', maxAge: res.maxAge, sameSite: "lax"})
    cookies().set('refreshToken', res.refreshToken, {httpOnly: true, path: '/', maxAge: res.maxAge, sameSite: "lax"})
    return Response.json({accessToken: res.token, refreshToken: res.refreshToken}, {
        status: 200,
        headers:{
            'Set-Cookie': `userToken=${res.token}; refreshToken=${res.refreshToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${res.maxAge}`
        }
    })
  }
  // Add a new method for logout
export async function DELETE(request: Request) {
    // This method clears the userToken cookie
    cookies().delete('userToken');
    console.log('test')
    cookies().delete('refreshToken');
    return new Response(JSON.stringify({ message: "Logged out successfully" }), {
        status: 200,
        headers: {
            'Set-Cookie': `userToken=; refreshToken=; Path=/; SameSite=Lax; Max-Age=-1; HttpOnly`,
        },
    });
}
