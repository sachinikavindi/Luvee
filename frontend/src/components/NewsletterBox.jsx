import React from "react";

const onSubmitHandler = (event) =>{
    event.preventDefault();
}

const NewsletterBox = () =>{
    return(
        <div className="flex flex-col items-center justify-center text-center space-y-2 pt-12 pb-12">
           <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</h1>
            <p className="md:text-lg text-black/70 pb-2">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts
            </p>
            <form onSubmit={onSubmitHandler} className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
                <input
                    className="border border-green-950 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-black"
                    type="text"
                    placeholder="Enter your email id"
                    required
                />
                <button type="submit" className="md:px-12 px-8 h-full text-white bg-green-950 hover:bg-black transition-all cursor-pointer rounded-md rounded-l-none">
                    Subscribe
                </button>
            </form>
        </div>
    )
}

export default NewsletterBox