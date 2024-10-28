import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const HomeNavbar = ({ loggedInUser, handleLogout }) => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const toggleNavbar = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    return (
        <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-pink-500 shadow-sm shadow-purple-700">
            <div className="container px-4 mx-auto relative lg:text-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center flex-shrink-0">
                        <span className="text-xl font-semibold gradient-to-r from-pink-500 to-purple-700 ">SpeechTherapyAI</span>
                    </div>
                    <ul className="hidden lg:flex items-center justify-end w-full space-x-4 relative">
                        <li>
                            <button
                                onClick={() => navigate('/parents')}
                                className="py-3 px-6 border-2 border-transparent rounded-lg text-white font-semibold transition-transform duration-300 ease-in-out bg-gradient-to-r from-pink-500 to-purple-700 
      hover:border-pink-500 hover:shadow-sm hover:shadow-purple-700 transform hover:scale-105"
                            >
                                Parent Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="py-3 px-6 border-2 border-transparent rounded-lg text-white font-semibold transition-transform duration-300 ease-in-out bg-gradient-to-r from-pink-500 to-purple-700 
      hover:border-pink-500 hover:shadow-sm hover:shadow-purple-700 transform hover:scale-105"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>





                    <div className="lg:hidden md:flex flex-col justify-end">
                        <button onClick={toggleNavbar}>
                            {mobileDrawerOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
                {mobileDrawerOpen && (
                    <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                        <ul className="hidden lg:flex ml-6 space-x-8 items-center w-full">
                            <div className="flex space-x-8">
                                <li>
                                    <button onClick={() => navigate('/child')} className="hover:text-purple-500">Children</button>
                                </li>
                                <li>
                                    <button onClick={() => navigate('/parents')} className="hover:text-purple-500">Parents</button>
                                </li>
                            </div>
                            <li className="ml-auto">
                                <button onClick={handleLogout} className="hover:text-purple-500">Logout</button>
                            </li>
                        </ul>

                    </div>
                )}
            </div>
        </nav>
    );
};

export default HomeNavbar;
