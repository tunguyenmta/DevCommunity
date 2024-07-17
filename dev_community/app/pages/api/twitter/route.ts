import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { TwitterApi } from "twitter-api-v2";

interface TwitterConfig {
  consumer_key: string;
  consumer_secret: string;
  access_token: string;
  access_token_secret: string;
}

const twitterConfig: TwitterConfig = {
  consumer_key: process.env.NEXT_PUBLIC_TWITTER_CONSUMER_KEY!,
  consumer_secret: process.env.NEXT_PUBLIC_TWITTER_CONSUMER_SECRET!,
  access_token: process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN!,
  access_token_secret: process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET!,
};



const oauth = new OAuth({
  consumer: { key: twitterConfig.consumer_key, secret: twitterConfig.consumer_secret },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string: string, key: string) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  },
});
// export async function POST(request: Request) {
//   const client = new TwitterApi({
//     appKey: process.env.NEXT_PUBLIC_TWITTER_CONSUMER_KEY!,
//     appSecret: process.env.NEXT_PUBLIC_TWITTER_CONSUMER_SECRET!,
//     accessToken: process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN!,
//     accessSecret: process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET!,
//   });
  
//   try {
//     await client.v1.tweet('hello');
//     console.log(`Tweeted: hello`);
//   } catch (error) {
//     console.error("Failed to post tweet:", error);
//   }
//   // const res = await request.json();

 
//   // const { url } = res;
//   // console.log(url)

//   // if (!url) {
//   //   return new Response(JSON.stringify({ message: 'URL is required' }), { status: 400 }); 
//   // }
//   // const request_data = {
//   //   url: 'https://api.twitter.com/2/tweets',
//   //   method: 'POST',
//   //   data: {
//   //     text: `Check this out: ${url}`,
//   //   },
//   // };

//   // const token = {
//   //   key: twitterConfig.access_token,
//   //   secret: twitterConfig.access_token_secret,
//   // };

//   // const headers = oauth.toHeader(oauth.authorize(request_data, token));
//   // console.log(headers)
//   // try {
//   //   const response = await fetch(request_data.url, {
//   //     method: 'POST',
//   //     headers: {
//   //       ...headers,
//   //       'Content-Type': 'application/json',
//   //     },
//   //     body: JSON.stringify(request_data.data),
//   //   });

//   //   const data = await response.json();
//   //   console.log(data)
//   //   return new Response(JSON.stringify(data), { status: response.status }); 
//   // } catch (error:any) {
//   //   return new Response(JSON.stringify({ message: error.message }), { status: 500 });
//   // }
// }
export async function POST(request: Request) {
  const res = await request.json();
  let url = res.url;
  const client = new TwitterApi({
    appKey: process.env.NEXT_PUBLIC_TWITTER_CONSUMER_KEY!,
    appSecret: process.env.NEXT_PUBLIC_TWITTER_CONSUMER_SECRET!,
    accessToken: process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.NEXT_PUBLIC_TWITTER_ACCESS_TOKEN_SECRET!,
  });

  // For v2, ensure you're using a client with the appropriate access
  const rwClient = client.readWrite;

  try {
    // Using the v2 endpoint to post a tweet
    const { data } = await rwClient.v2.tweet('hello');
    console.log(`Tweeted: hello`, data);
  } catch (error) {
    console.error("Failed to post tweet:", error);
  }
}