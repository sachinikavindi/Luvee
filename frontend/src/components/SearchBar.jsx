import React, { useEffect, useRef } from "react";
import { useContext } from "react";
import App from "../App";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(AppContext);
    const inputRef = useRef(null);

    useEffect(() => {
        if (showSearch && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showSearch]);

    // Cleanup effect when component unmounts
    useEffect(() => {
        return () => {
            setSearch('');
            setShowSearch(false);
        };
    }, [setSearch, setShowSearch]);

    const handleClose = () => {
        setShowSearch(false);
        setSearch('');
    };

    return showSearch ? (
        <div className="border-t border-b bg-white text-center py-3 shadow-sm">
            <div className="inline-flex items-center justify-center border border-green-950 hover:border-black focus-within:border-green-950 px-4 py-2.5 mx-3 rounded-full w-3/4 sm:w-1/2 transition-all duration-200">
                <input
                    ref={inputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 outline-none bg-inherit text-sm placeholder-gray-400 focus:placeholder-gray-500"
                    type="text"
                    placeholder="Search"
                />
                <img className="w-5 h-5 ml-2 opacity-70 hover:opacity-100 transition-opacity" src={assets.search_icon} alt="Search" />
            </div>
            <img
                onClick={handleClose}
                className="inline w-4 h-4 ml-2 cursor-pointer hover:opacity-70 transition-opacity"
                src={assets.cross_icon}
                alt="Close search"
            />
        </div>
    ) : null;
}

export default SearchBar;