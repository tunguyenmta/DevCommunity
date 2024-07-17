import React from 'react';
import Header from '../../../home/components/Header';
import Taglist from '../../../home/components/Taglist';
import Footer from '../../../home/components/Footer';
import Hashtag from '../../components/Hashtag';
import PostList from '../../components/PostList';

interface TrendingPost {
  id: number;
  title: string;
  content: string;
  cover: string;
  totalView: number;
  createdBy: string;
  createdDate: string;
  hashTagList: {
    id: number;
    name: string;
  }[];
}

interface TagProps {
  id: number;
  name: string;
}

const fetchTags = async () => {
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


const fetchPost = async (tag: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/posts/filter-hashtag/${tag}`, {
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

const HashTagPosts = async ({ params }: {
  params: { hashtagId: string }
}) => {

  const tags: TagProps[] = await fetchTags();

  const posts = await fetchPost(params.hashtagId);
  return (
    <div className='overflow-x-hidden'>
      <Header></Header>
      <Taglist tags={tags}></Taglist>

      <Hashtag tags={posts.hashTagRelatedList} currentTag={tags.find(item => String(item.id) == params.hashtagId)}></Hashtag>
      <PostList posts={posts.posts}></PostList>
      <Footer tags={tags}></Footer>
    </div>
  );
};

export default HashTagPosts;
