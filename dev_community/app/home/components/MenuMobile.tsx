import Link from "next/link"
import { AiFillHome } from "react-icons/ai"
import { CgFacebook } from "react-icons/cg"
import { IoClose } from "react-icons/io5"
import { MdArticle } from "react-icons/md"
import { RxComponent2 } from "react-icons/rx"
import { TbBrandGithub } from "react-icons/tb";
import { GrLinkedin } from "react-icons/gr";
import { FaXTwitter } from "react-icons/fa6";



const MenuMobile = ({ showMenu, handleShowMenu }: any) => {

    return (
        <div className={showMenu ? 'modal-overlay' : ''}>
            <div className={showMenu ? ' h-full bg-white shadow-md fixed top-0 left-0 block md:hidden px-6 pt-2 z-[100] ease-in duration-300'
                : 'h-full bg-blue3 shadow-md fixed top-0 -left-[100%] block md:hidden px-6 pt-2 z-[100] ease-in duration-300 '
            }>
                <div className="flex flex-col items-center h-full py-10">
                    <Link href="/" className="flex justify-between items-center cursor-pointer border-b-2 w-full py-5">
                        <span className="font-medium text-[15px] font-inter">Home</span>
                        <AiFillHome className="w-6 h-6" />
                    </Link>
                    <Link href="/articles" className="flex justify-between items-center border-b-2 w-full cursor-pointer py-5">
                        <span className="font-medium text-[15px] font-inter">Articles</span>
                        <MdArticle className="w-6 h-6" />
                    </Link>
                    <Link href="/showcomponents" className="flex justify-between items-center border-b-2 w-full cursor-pointer py-5">
                        <span className="font-medium text-[15px] font-inter">Components</span>
                        <RxComponent2 className="w-6 h-6" />
                    </Link>
                    <span className="absolute right-4 top-4 " onClick={handleShowMenu}>
                        <IoClose className="text-4xl bg-blue-400 rounded-md transition-all ease-in hover:bg-red-500 hover:-rotate-90 cursor-pointer" />
                    </span>
                    <div className="flex gap-5 pointer-events-none py-5">
                        <Link href='#'>
                            <div className=" bg-blue-800 rounded-full p-2 border-2 border-gray-400"><TbBrandGithub className="text-2xl text-white" /></div>
                        </Link>
                        <Link href='#'>
                            <div className=" bg-blue-800 rounded-full p-2 border-2 border-gray-400"><CgFacebook className="text-2xl text-white" /></div></Link>
                        <Link href='#'>
                            <div className=" bg-blue-800 rounded-full p-2 border-2 border-gray-400"><GrLinkedin className="text-2xl text-white" /></div>
                        </Link>
                        <Link href='#'>
                            <div className=" bg-blue-800 rounded-full p-2 border-2 border-gray-400"><FaXTwitter className="text-2xl text-white" /></div>
                        </Link>
                    </div>
                    <Link href='#'>
                        <p className="text-sm w-72 tracking-wide text-textGreen text-center mt-2">mymail@developer.me</p>
                    </Link>

                </div>
            </div>
        </div>
    )
}

export default MenuMobile