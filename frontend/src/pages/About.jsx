import React from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex flex-wrap space-x-2 text-sm text-green-950 font-medium px-4 py-4">
        <a href="/" className="hover:underline">Home</a>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1" />
        </svg>
        <span>About</span>
      </div>

      {/* Hero Section */}
      <div className="text-2xl text-center pt-8 border-t border-green-950">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      {/* Main Content */}
      <div className="my-10 flex flex-col md:flex-row gap-16 px-4 md:px-16">
        <img className="w-full md:max-w-[450px] rounded-lg shadow-lg" src={assets.about_img} alt="About GreenChart" />
        
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p className="text-lg leading-relaxed">
            GreenChart was born out of a passion for sustainable fashion and a commitment to providing high-quality clothing that doesn't compromise on style or environmental responsibility. Since our founding, we've been dedicated to creating a shopping experience that combines modern convenience with timeless elegance.
          </p>
          
          <p className="text-lg leading-relaxed">
            Our journey began with a simple vision: to make sustainable fashion accessible to everyone. We carefully curate our collection to ensure that every piece meets our strict standards for quality, comfort, and environmental impact. From eco-friendly fabrics to ethical manufacturing processes, every decision we make reflects our commitment to a greener future.
          </p>
          
          <p className="text-lg leading-relaxed">
            At GreenChart, we believe that fashion should be a force for good. That's why we partner with suppliers who share our values and work tirelessly to reduce our carbon footprint while delivering exceptional products to your doorstep.
          </p>

          <b className="text-green-950 text-xl">Our Mission</b>
          <p className="text-lg leading-relaxed">
            To revolutionize the fashion industry by proving that style, sustainability, and affordability can coexist. We're committed to creating clothing that not only makes you look good but also makes you feel good about your choices.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-950 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from product selection to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sustainability */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-950 mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We prioritize eco-friendly materials and sustainable production methods to minimize our environmental impact.
              </p>
            </div>

            {/* Quality */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-950 mb-3">Quality</h3>
              <p className="text-gray-600">
                Every product is carefully selected and tested to ensure it meets our high standards for durability and comfort.
              </p>
            </div>

            {/* Innovation */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-950 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously explore new technologies and trends to bring you the latest in sustainable fashion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-950 mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Numbers that reflect our commitment to making a positive difference.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-950 mb-2">10K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-950 mb-2">500+</div>
              <p className="text-gray-600">Products</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-950 mb-2">50+</div>
              <p className="text-gray-600">Partner Brands</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-950 mb-2">3 Years</div>
              <p className="text-gray-600">Of Excellence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-xl text-center">
            <Title text1={'WHY'} text2={'CHOOSE US'} />
          </div>

          <div className="flex flex-col md:flex-row text-sm mt-12 gap-8">
            <div className="border border-green-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <img className="w-8" src={assets.quality_icon} alt="Quality Assurance" />
                <b className="text-green-950">Quality Assurance:</b>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We meticulously select and vet each product to ensure it meets our stringent quality standards. Our commitment to excellence means you receive only the finest items.
              </p>
            </div>

            <div className="border border-green-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <img className="w-8" src={assets.support_img} alt="24/7 Support" />
                <b className="text-green-950">Convenience:</b>
              </div>
              <p className="text-gray-600 leading-relaxed">
                With our user-friendly online platform, easy return policy, and fast shipping, shopping with us is effortless and enjoyable from start to finish.
              </p>
            </div>

            <div className="border border-green-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <img className="w-8" src={assets.exchange_icon} alt="Exchange Policy" />
                <b className="text-green-950">Exceptional Customer Service:</b>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Our dedicated support team is here to assist you with any questions or concerns. We believe in building lasting relationships with our customers.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default About

