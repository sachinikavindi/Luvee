import React, { useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for your message! We will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex flex-wrap space-x-2 text-sm text-green-950 font-medium px-4 py-4">
        <a href="/" className="hover:underline">Home</a>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m14.413 10.663-6.25 6.25a.939.939 0 1 1-1.328-1.328L12.42 10 6.836 4.413a.939.939 0 1 1 1.328-1.328l6.25 6.25a.94.94 0 0 1-.001 1.328" fill="#CBD5E1" />
        </svg>
        <span>Contact</span>
      </div>

      {/* Hero Section */}
      <div className="text-2xl text-center pt-8 border-t border-green-950">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Main Content */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 px-4 md:px-16">
        
        {/* Store Image and Info */}
        <div className="flex flex-col gap-6">
          <img className="w-full md:max-w-[480px] rounded-lg shadow-lg" src={assets.contact_img} alt="Contact GreenChart" />
          
          <div className="text-gray-600">
            <p className="text-xl font-semibold text-green-950 mb-4">Our Store</p>
            <p className="mb-2">123 Green Street, Eco District</p>
            <p className="mb-2">Colombo 03, Sri Lanka</p>
            <p className="mb-4">Tel: (+94) 11-234-5678</p>
            
            <p className="text-xl font-semibold text-green-950 mb-4">Business Hours</p>
            <p className="mb-1">Monday - Friday: 9:00 AM - 8:00 PM</p>
            <p className="mb-1">Saturday: 10:00 AM - 6:00 PM</p>
            <p className="mb-4">Sunday: 11:00 AM - 5:00 PM</p>
            
            <p className="text-xl font-semibold text-green-950 mb-4">Careers at GreenChart</p>
            <p className="mb-4">Learn more about our teams and job openings.</p>
            <button className="border border-green-950 px-8 py-4 text-sm hover:bg-green-950 hover:text-white transition-all duration-300 rounded">
              Explore Jobs
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex-1 max-w-lg">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-semibold text-green-950 mb-6">Get In Touch</h3>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="product">Product Question</option>
                  <option value="return">Returns & Exchanges</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-950 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Contact Methods Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-950 mb-4">Other Ways to Reach Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the method that works best for you. We're here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone Support */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-950 mb-3">Phone Support</h3>
              <p className="text-gray-600 mb-3">
                Speak directly with our customer service team for immediate assistance.
              </p>
              <p className="font-semibold text-green-950">(+94) 11-234-5678</p>
              <p className="text-sm text-gray-500">Mon-Fri: 9 AM - 8 PM</p>
            </div>

            {/* Email Support */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-950 mb-3">Email Support</h3>
              <p className="text-gray-600 mb-3">
                Send us detailed questions and we'll respond within 24 hours.
              </p>
              <p className="font-semibold text-green-950">support@greenchart.com</p>
              <p className="text-sm text-gray-500">Response within 24 hrs</p>
            </div>

            {/* Live Chat */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-950 mb-3">Live Chat</h3>
              <p className="text-gray-600 mb-3">
                Get instant help from our support team through live chat.
              </p>
              <button className="bg-green-950 hover:bg-green-800 text-white px-6 py-2 rounded-lg transition-colors">
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-950 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about shopping with GreenChart.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-950 mb-2">What is your return policy?</h4>
              <p className="text-gray-600">We offer a 30-day return policy for all unworn items with original tags. Items must be in original condition for a full refund.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-950 mb-2">How long does shipping take?</h4>
              <p className="text-gray-600">Standard shipping takes 3-5 business days within Colombo and 5-7 business days for other areas in Sri Lanka. Express shipping is available for next-day delivery.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-950 mb-2">Do you offer international shipping?</h4>
              <p className="text-gray-600">Currently, we only ship within Sri Lanka. We're working on expanding our shipping options to serve customers internationally.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-950 mb-2">How can I track my order?</h4>
              <p className="text-gray-600">Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the "My Orders" section.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Contact

