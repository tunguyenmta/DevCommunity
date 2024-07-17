import Header from './components/Header';
import Taglist from './components/Taglist';
import Hero from './components/hero/Hero';
import Latest from './components/Latest';
import News from './components/New';
import Book from './components/Book';
import Footer from './components/Footer';
interface TagProps {
  id: number;
  name: string;
}
interface Card {
  id: number;
  title: string;
  content: string;
  cover: {
    path: string;
    mediaType: string;
    originalName: string;
  };
  user: {
    username: string;
    avatar: {
      path: string;
      mediaType: string;
      originalName: string;
    }
  },
  totalView: number;
  createdDate: string;
  hashTagList: {
    id: number;
    name: string;
  }[];
}

interface book {
  id: number;
  cover: {
    path: string;
    mediaType: string;
    originalName: string;
  };
  href: string;
  title: string;
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

const fetchLatest = async (): Promise<Card[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/post/latest-and-greatest`, {
    headers: {
      'Cache-Control': 'no-store',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch latest');
  }
  return res.json();
};

const fetchNew = async (): Promise<Card[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/post/new-and-noteworthy`, {
    headers: {
      'Cache-Control': 'no-store',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch new posts');
  }
  return res.json();
};

const fetchBook = async (): Promise<book[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/book`, {
    headers: {
      'Cache-Control': 'no-store',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch books');
  }
  return res.json();
};

const HomePage = async () => {
  const [tags, latest, news, books] = await Promise.all([
    fetchTags(),
    fetchLatest(),
    fetchNew(),
    fetchBook()
  ]);
  return (
    <div>
      <Header />
      <Taglist tags={tags.length > 0 ? tags : []} />
      <Hero />
      <Latest cards={latest} />
      <News cards={news} />
      <Book books={books} />
      <Footer tags={tags} />
    </div>
  );
};



export default HomePage;
