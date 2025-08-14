import React from "react";
import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import NewsletterBox from "../components/NewsletterBox";

const Home = () => {
    return (
      
        <div className="w-full">
           <MainBanner/>
          <Categories/>
          <LatestCollection/>
         <BestSeller/>
         <NewsletterBox/>
         
      </div>
     
    )
 }
 
 export default Home;
 