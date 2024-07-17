import TrendingPost from "./TrendingPost";
import Carousel from "./Carousel";

const fetchHotPosts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/post/hot-topic`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch hot posts");
  }
  return res.json();
};

const fetchComponentPopular = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/v1/home/outstanding/component/popular?size=7`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch popular components");
  }
  return res.json();
};
const Hero = async () => {

  const hotPosts = await fetchHotPosts();
  const popularComponents = await fetchComponentPopular();
  return (
    <div className="px-6 md:px-150px py-40px bg-gradient-linear1 h-auto">
      <TrendingPost posts={hotPosts}></TrendingPost>
      <div className="md:block hidden">
        <Carousel components={popularComponents}></Carousel>
      </div>
    </div>
  );
};

export default Hero;
