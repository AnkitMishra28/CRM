import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import missionImg from '../assets/image.png';
import { Target, Handshake, LineChart } from 'lucide-react';
import Marquee from 'react-fast-marquee';
import { FaMoneyCheckAlt, FaFileInvoiceDollar, FaUserTie, FaChartPie, FaCalendarCheck, FaShieldAlt } from 'react-icons/fa';
const testimonials = [
  {
    name: "Nahid Hasan",
    role: "Admin, TaskFlow BD",
    comment:
      "This system has been a game-changer for our admin team. Managing users and employees is now fully automated and effortless.",
    img: "https://i.pravatar.cc/150?img=15",
  },
  {
    name: "Sharmin Akter",
    role: "HR Manager, NextGen Solutions",
    comment:
      "Employee salaries, task tracking, and lead management — all in one place. We've saved so much time and effort. Highly recommended!",
    img: "https://i.pravatar.cc/150?img=30",
  },
  {
    name: "Tariq Mahmood",
    role: "Team Lead, SwiftTech Ltd.",
    comment:
      "The dashboard gives us a clear overview of the team's progress. Task management has never been this smooth and efficient.",
    img: "https://i.pravatar.cc/150?img=23",
  },
];


const icons = [
    { icon: <FaMoneyCheckAlt />, label: "Salary Automation" },
    { icon: <FaFileInvoiceDollar />, label: "Tax & Compliance" },
    { icon: <FaUserTie />, label: "Employee Management" },
    { icon: <FaChartPie />, label: "Reports & Analytics" },
    { icon: <FaCalendarCheck />, label: "Attendance Tracking" },
    { icon: <FaShieldAlt />, label: "Secure Access" },
  ];





const LowerMiddle = () => {

     useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  
  
   

 
  

  

  return (
    <div>

        <section className=" text-white py-20 px-6 md:px-20">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Image */}
        <div data-aos="fade-right">
          <img
            src={missionImg}
            alt="Our Mission"
            className="rounded-xl shadow-2xl w-full"
          />
        </div>

        {/* Right Content */}
        <div data-aos="fade-left">
          <h2 className="text-4xl font-bold mb-6 text-indigo-400">
            Our Mission
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Empower businesses with a seamless, secure, and intelligent PerformaSuite
            management solution that reduces workload and boosts accuracy.
          </p>

          {/* Icons and Highlights */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Target size={36} className="text-green-400" />
              <div>
                <h4 className="text-xl font-semibold">Precision First</h4>
                <p className="text-gray-400">
                  We aim to eliminate manual errors and ensure 100% accurate FollowUp processing.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Handshake size={36} className="text-yellow-400" />
              <div>
                <h4 className="text-xl font-semibold">Trust & Support</h4>
                <p className="text-gray-400">
                  Transparent operations with 24/7 support build trust with every client.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <LineChart size={36} className="text-blue-400" />
              <div>
                <h4 className="text-xl font-semibold">Growth Focused</h4>
                <p className="text-gray-400">
                  We help you focus on business while we automate your PerformaSuite workflow.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    <section className=" text-white py-24 px-6 md:px-20">
      <h2
        className="text-center text-4xl md:text-5xl font-bold mb-20 text-pink-500"
        data-aos="fade-up"
      >
        What Our Clients Say
      </h2>

      <div className="space-y-16">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center gap-10 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
            data-aos="fade-up"
          >
            <img
              src={t.img}
              alt={t.name}
              className="w-32 h-32 rounded-full border-4 border-pink-500 shadow-lg animate-bounce"
            />
            <div>
              <p className="text-lg text-gray-300 italic mb-3">"{t.comment}"</p>
              <h4 className="text-xl font-semibold text-white">{t.name}</h4>
              <p className="text-sm text-pink-300">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* <section className=" py-24 px-6 md:px-20 text-white overflow-hidden">
      <h2
        className="text-center text-4xl md:text-5xl font-bold mb-14 text-yellow-400"
        data-aos="fade-up"
      >
        Integrated With Powerful Tools
      </h2>

      <Marquee speed={60} gradient={false} pauseOnHover>
        {icons.map((item, i) => (
          <div key={i} className="flex flex-col items-center mx-12" data-aos="zoom-in">
            <div className="text-6xl text-cyan-400 mb-4 animate-pulse">
              {item.icon}
            </div>
            <p className="text-sm md:text-base text-white opacity-80">{item.label}</p>
          </div>
        ))}
      </Marquee>
    </section> */}


    </div>
  )
}

export default LowerMiddle