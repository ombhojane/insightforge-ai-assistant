'use client';

import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [fadeIn, setFadeIn] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  const handleSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate a successful subscription (Replace with actual API call if needed)
      setSubscriptionStatus('Thank you for subscribing!');
      setEmail('');
    } else {
      setSubscriptionStatus('Please enter a valid email address.');
    }
  };

  useEffect(() => {
    setFadeIn(true);

    const handleScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    };
    
    const observer = new IntersectionObserver(handleScroll, {
      threshold: 0.1,
    });

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    if (howItWorksRef.current) {
      observer.observe(howItWorksRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
      if (howItWorksRef.current) {
        observer.unobserve(howItWorksRef.current);
      }
    };
  }, []);

  return (
    <>
      <head>
        <title>AI Assistant for ERP Management</title>
        <meta property="og:title" content="AI Assistant for ERP Management" />
        <link rel="icon" href='/forge.ico'/>
      </head>

      <header className="flex items-center justify-between p-5 bg-gray-800 bg-opacity-30 text-white w-full fixed top-0 z-50 shadow-md transition-opacity duration-300 ease-in-out">
        <div className="flex items-center">
          <img src="/Insights.forge.png" alt="Logo" className="h-8 w-8 mr-2" />
          <a href="/" className="text-lg font-bold text-green-500">Insights</a>
          <span className="text-lg font-bold text-white">.Forge</span>
        </div>
        <nav className="space-x-6">
          <Link href="#hero" className="hover:text-green-500 transition-colors duration-300 ease-in-out">Home</Link>
          <Link href="#features" className="hover:text-green-500 transition-colors duration-300 ease-in-out">Features</Link>
          <Link href="#use-cases" className="hover:text-green-500 transition-colors duration-300 ease-in-out">FAQs</Link>
          <Link href="#blog" className="hover:text-green-500 transition-colors duration-300 ease-in-out">Blogs</Link>
          <Link href="#newsletter" className="hover:text-green-500 transition-colors duration-300 ease-in-out">Newsletter</Link>
          <Link href="/signup" className="hover:text-green-500 transition-colors duration-300 ease-in-out">Sign Up</Link>
          <Link href="/login" className="hover:text-green-500 transition-colors duration-300 ease-in-out">Log In</Link>
        </nav>
      </header>

      <main className={`flex flex-col items-center justify-center min-h-screen p-24 pt-32 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <section id="hero" className="flex flex-col items-center justify-center text-center mb-40 p-10 relative">
          <div className="relative z-10 p-20">
            <h1 className="text-5xl font-bold mb-8 animate-fade-in-down">
              <span className="text-green">Welcome to</span> <span className="text-green-500">Insights</span><span className="text-white">.Forge</span>
            </h1>
            <p className="text-xl mb-8">Your AI-powered assistant for efficient ERP management. Upload files and get actionable insights with ease.</p>
            <div className="space-x-6">
              <Link href="/signup" className="px-6 py-3 bg-green-500 text-white rounded-lg transition-transform transform hover:scale-110">GET STARTED</Link>
            </div>
          </div>
        </section>

        <section id="features" ref={featuresRef} className="text-center mb-40 px-20 py-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-green-500">Features</h2>
            <div className="flex flex-wrap justify-center gap-12">
              <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg animate-slide-in-left">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Advanced Analytics</h3>
                <p className="text-lg">Our AI Assistant utilizes state-of-the-art algorithms to provide in-depth analytics on your ERP data. Gain valuable insights to drive strategic decision-making and optimize your operations. Our advanced tools ensure you stay ahead in your industry.</p>
              </div>
              <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg animate-slide-in-left">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">File Upload</h3>
                <p className="text-lg">Easily upload various types of files including CSVs, images, and PDFs. Our system supports multiple formats to ensure that your data can be analyzed effectively, regardless of its source. Seamlessly integrate your data into our platform.</p>
              </div>
              <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg animate-slide-in-left">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Interactive Chatbot</h3>
                <p className="text-lg">Engage with our interactive chatbot to query and analyze your data. The chatbot is designed to understand your questions and provide accurate responses, making data interaction intuitive and user-friendly. Get instant feedback on your data queries.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" ref={howItWorksRef} className="text-center mb-40 px-80 py-60 relative">
          <div className="absolute inset-0 bg-gradient-to-l from-gray-900 to-black opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-green-500">How It Works</h2>
            <p className="text-lg max-w-4xl mx-auto">Using our AI Assistant is straightforward and efficient. Upload your files through our intuitive interface, and our AI will process them using advanced OCR and LLAMA models. The system extracts relevant information and presents it in a user-friendly format. Interact with our chatbot to ask specific questions about the data, such as trends, anomalies, or detailed analytics. The chatbot provides clear and actionable insights, helping you make informed decisions and improve your ERP processes.</p>
          </div>
        </section>

        <section id="key-features" className="text-center mb-40 px-20 py-10 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-30"></div>
          <div className="relative z-10 p-8">
            <h2 className="text-4xl font-bold mb-12 text-green-500 animate-fade-in-down">Key Features</h2>
            <div className="flex flex-wrap justify-center gap-12">
              <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Real-Time Analytics</h3>
                <p className="text-lg">Get instant insights and analytics on your data as soon as it's processed. Our real-time analytics engine ensures that you can make informed decisions quickly.</p>
              </div>
              <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Advanced Data Visualization</h3>
                <p className="text-lg">Visualize your data with interactive charts, graphs, and dashboards. Our advanced data visualization tools help you understand trends and patterns with ease.</p>
              </div>
              <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Customizable Reports</h3>
                <p className="text-lg">Generate and customize reports to meet your specific needs. Our platform offers flexible reporting options to cater to various business requirements.</p>
              </div>
              <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Seamless Integration</h3>
                <p className="text-lg">Integrate effortlessly with other systems and tools. Our platform supports a wide range of integrations to ensure smooth data flow and connectivity.</p>
              </div>
              <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">AI-Powered Insights</h3>
                <p className="text-lg">Leverage AI to gain deeper insights from your data. Our AI algorithms analyze patterns and provide actionable recommendations to enhance your business operations.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="additional-info" className="text-center mb-40 px-80 py-60 relative">
          <div className="absolute inset-0 bg-gradient-to-1 from bg-gray-900 opacity-30" ></div>
          <div className="relative z-10 p-8">
            <h2 className="text-4xl font-bold mb-12 text-green-500 animate-fade-in-down">Additional Information</h2>
            <p className="text-lg max-w-3xl mx-auto">Our AI Assistant not only helps you manage ERP data but also integrates with other systems to enhance overall business intelligence. With customizable settings and scalable solutions, it adapts to the unique needs of your organization. Stay ahead of the competition with real-time analytics and automated insights that drive growth and efficiency.</p>
          </div>
        </section>

        <section id="use-cases" className="text-center mb-40 px-20 py-10 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-30"></div>
          <div className="relative z-10 p-8">
            <h2 className="text-4xl font-bold mb-12 text-green-500 animate-fade-in-down">Use Cases</h2>
            <div className="space-y-12">
              <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Inventory and Supply Chain Optimization</h3>
                <p className="text-lg">Q: "Based on current trends and upcoming events, how should we adjust our inventory and supplier orders for the next quarter?"</p>
                <p className="text-lg">A: The assistant analyzes sales data, market trends, event calendars, and supplier performance to provide comprehensive inventory and ordering recommendations.</p>
              </div>
              <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Financial Planning and Analysis</h3>
                <p className="text-lg">Q: "How would a 10% increase in marketing spend impact our profitability, considering seasonal trends and competitor activities?"</p>
                <p className="text-lg">A: The system runs scenario analyses, considering historical data, market conditions, and competitive landscape to forecast the financial impact.</p>
              </div>
              <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Customer Behavior and Marketing Effectiveness</h3>
                <p className="text-lg">Q: "What customer segments are most responsive to our recent marketing campaign, and how has this affected their purchasing patterns?"</p>
                <p className="text-lg">A: The assistant combines CRM data, marketing campaign results, and sales data to provide insights on customer segmentation and behavior changes.</p>
              </div>
              <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Human Resources and Staffing Optimization</h3>
                <p className="text-lg">Q: "Based on historical data and predicted foot traffic, what should our staffing levels be for each department next month?"</p>
                <p className="text-lg">A: By analyzing sales data, foot traffic patterns, and labor efficiency metrics, the system offers data-driven staffing recommendations.</p>
              </div>
              <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-4">Competitive Analysis and Market Positioning</h3>
                <p className="text-lg">Q: "How does our product mix and pricing strategy compare to our top competitors, and where are the opportunities for differentiation?"</p>
                <p className="text-lg">A: The assistant analyzes market data, competitor information, and internal sales data to provide strategic insights on market positioning.</p>
              </div>
            </div>
          </div>
        </section>


        <section id="blog" className="text-center mb-40 px-20 py-10">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-green-500">Read Relevant Blogs</h2>
            <p className="text-lg mb-8">Stay informed with the latest insights and tips on ERP management and AI. Our blog covers a range of topics to help you optimize your operations and make informed decisions.</p>
            
            <div className="flex flex-wrap justify-center gap-12">

              <article className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-2">Understanding ERP Systems</h3>
                <p className="text-lg mb-4">An in-depth look at how ERP systems work and their benefits for businesses. Learn the fundamentals of ERP and how it can streamline your operations.</p>
                <a href="https://www.investopedia.com/terms/e/erp.asp" className="text-blue-500 hover:underline">Read More</a>
              </article>

              <article className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-2">AI in Business Intelligence</h3>
                <p className="text-lg mb-4">Explore the role of artificial intelligence in business intelligence. Discover how AI can enhance data analysis and decision-making processes.</p>
                <a href="https://emerj.com/ai-sector-overviews/ai-in-business-intelligence-applications/" className="text-blue-500 hover:underline">Read More</a>
              </article>

              <article className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-2">Top 5 ERP Trends for 2024</h3>
                <p className="text-lg mb-4">Stay ahead of the curve with our roundup of the top ERP trends for 2024. Learn about emerging technologies and practices shaping the future of ERP.</p>
                <a href="https://www.techtarget.com/searcherp/feature/ERP-trends-for-this-year-and-beyond" className="text-blue-500 hover:underline">Read More</a>
              </article>

              <article className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-2">The Future of ERP: What to Expect in the Next Decade</h3>
                <p className="text-lg mb-4">Dive into predictions and trends that will shape the ERP landscape over the next ten years. Explore emerging technologies, industry shifts, and what businesses can do to prepare.</p>
                <a href="https://www.arionerp.com/news/productivity/future-trends-in-erp-predictions-for-the-next-decade.html" className="text-blue-500 hover:underline">Read More</a>
              </article>

              <article className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-2">How to Integrate AI into Your Existing ERP System</h3>
                <p className="text-lg mb-4">A practical guide on integrating AI technologies into your current ERP system to enhance its capabilities. Includes best practices, common pitfalls, and real-world examples.</p>
                <a href="https://blog.n8n.io/erp-ai-chatbot/" className="text-blue-500 hover:underline">Read More</a>
              </article>

              <article className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-green-500 mb-2">Top 10 Metrics to Track in Your ERP System</h3>
                <p className="text-lg mb-4">Learn about the most important metrics to monitor in your ERP system to ensure optimal performance and efficiency. This guide covers key indicators and how they can help improve your business processes.</p>
                <a href="https://www.dynamicssquare.com/blog/top-kpi-for-success-of-erp-implementation/" className="text-blue-500 hover:underline">Read More</a>
              </article>

            </div>
          </div>
        </section>

        {/* Newsletter Subscription Section */}
        <section id="newsletter" className="text-center mb-40 px-20 py-10">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-green-500">Subscribe to Our Newsletter</h2>
            <p className="text-lg mb-8">Want to stay updated? Enter your email below to receive the latest blog posts and industry news.</p>
            <form onSubmit={handleSubscription} className="flex flex-col items-center gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-4 py-2 border border-gray-300 text-black rounded-lg"
              />
              <button type="submit" className="px-6 py-3 bg-green-500 text-blue rounded-lg">Subscribe</button>
            </form>
            {subscriptionStatus && <p className="mt-4 text-lg">{subscriptionStatus}</p>}
          </div>
        </section>
          
        <footer className="text-center p-8 text-white">
          <p>&copy; {new Date().getFullYear()} Insights.Forge. All rights reserved.</p>
        </footer>
      </main>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: url('/hero.jpg') no-repeat center center fixed;
          background-size: cover;
          font-family: Arial, sans-serif;
        }

                @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate {
          animation-duration: 1s;
          animation-fill-mode: both;
        }

        .animate-slide-in-left {
          animation-name: slide-in-left;
        }

        .animate-fade-in-down {
          animation-name: fade-in-down;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}
