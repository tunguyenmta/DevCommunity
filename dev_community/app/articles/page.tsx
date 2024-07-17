
import React from 'react';
import Header from '../home/components/Header';
import Taglist from '../home/components/Taglist';
import Footer from '../home/components/Footer';
import Hero from './components/Hero';
import Hashtag from './components/Hashtag';
import PostList from './components/PostList';

interface TrendingPost {
  id: number;
  title: string;
  content: string;
  cover: string;
  totalView: number;
  user:{
    username: string;
    avatar: {
      path: string
      originName: string
      mediaType: string
    }
  }
  createdDate: string;
  hashTagList: {
    name: string;
    id: number;
  }[];
}
interface TagProps {
  id: number;
  name: string;
}

interface Post {
  id: number,
  title: string,
  content: string,
  cover: string,
  totalView: number,
  createdBy: string,
  createdDate: string,
  user: {
    username: string;
    avatar: string;
  };
  hashTagList: {
    name: string,
    id: number,
  }[],
  readMediumTime: number,
  totalComment: number,

}

const fetchTags = async (): Promise<TagProps[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/hash-tags/post`, {
    headers: {
      'Cache-Control': 'no-store',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch tags');
  }
  return res.json();
};

const fetchPostTrending = async (): Promise<TrendingPost[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/post/hot-topic`, {
    headers: {
      'Cache-Control': 'no-store',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch trending posts');
  }
  return res.json();
};

const fetchPost = async (): Promise<Post[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/posts`, {
    headers: {
      'Cache-Control': 'no-store',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
};

const Trending = async () => {
  const listTrending: TrendingPost[] = await fetchPostTrending();
  let listTags: { name: string; id: number }[] = [];
  listTrending.forEach((d) => {
    d.hashTagList.map((tag) => {
      if (!listTags.find((t) => t.id === tag.id)) {
        listTags.push(tag);
      }
    });
  });

  const tags = await fetchTags();
  const posts = await fetchPost();
  return (
    <div>
      <Header></Header>
      <Taglist tags={tags}></Taglist>
      {listTrending.length > 0 && <Hero></Hero>}
      <Hashtag tags={listTags}></Hashtag>
      <PostList posts={posts}></PostList>
      <Footer tags={tags}></Footer>
    </div>
  );
};

export default Trending;
