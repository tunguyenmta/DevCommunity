import { cookies } from "next/headers";

export async function POST(request: Request) {
    const res = await request.json();
    if (!res.token || !res.refreshToken) {
        return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }
    const resRefresh = await fetch(process.env.NEXT_PUBLIC_BASE_URL + 'api/v1/authenticate/refresh-token/' + res.refreshToken, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    }
    })
    if(resRefresh.status !== 200){
        
        return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }
    const resRefreshJson = await resRefresh.json();
    cookies().set('userToken', resRefreshJson.idToken, {maxAge: resRefreshJson.refreshTokenValidSecond, httpOnly: true , sameSite: 'lax', path: '/'});
    cookies().set('refreshToken', resRefreshJson.idRefreshToken, {maxAge: resRefreshJson.refreshTokenValidSecond, httpOnly: true, sameSite: 'lax', path: '/'});
    return Response.json({accessToken: resRefreshJson.idToken, refreshToken: resRefreshJson.idRefreshToken, maxAge: resRefreshJson.refreshTokenValidSecond}, {
        status: 200,
        headers:{
            'Set-Cookie': `userToken=${resRefreshJson.idToken}; refreshToken=${resRefreshJson.idRefreshToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${resRefreshJson.refreshTokenValidSecond}`
        }
    })
  }