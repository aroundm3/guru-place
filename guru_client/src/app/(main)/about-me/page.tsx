"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutMe() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <>
      <div className="min-h-screen py-12 px-4 lg:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="md:flex">
              <motion.div
                className="md:w-1/3 bg-gray-100 p-8 flex items-center justify-center"
                variants={fadeInUp}
              >
                <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src="/images/profile.jpg"
                    alt="Profile Picture"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>

              <motion.div className="md:w-2/3 p-8" variants={fadeInUp}>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Hello, I'm [Your Name]
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Welcome to my personal space! I'm a passionate [Your
                  Profession] with a love for creating beautiful and functional
                  digital experiences. With [X] years of experience in the
                  industry, I've had the privilege of working with amazing teams
                  and clients from around the world.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Skills
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Web Development",
                        "UI/UX Design",
                        "Mobile Development",
                        "Cloud Computing",
                      ].map((skill, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                          <span className="text-gray-600">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Contact
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                        <span className="text-gray-600">
                          Email: your.email@example.com
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                        <span className="text-gray-600">
                          Location: City, Country
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <motion.div
                  className="mt-8 pt-6 border-t border-gray-200"
                  variants={fadeInUp}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    My Journey
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    My journey in [Your Field] began [brief background]. Since
                    then, I've been on an exciting path of continuous learning
                    and growth, always eager to take on new challenges and push
                    the boundaries of what's possible.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    When I'm not coding or designing, you can find me
                    [hobbies/interests]. I believe in [personal philosophy or
                    values].
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <motion.div className="mt-12 text-center" variants={fadeInUp}>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Let's Connect
            </h3>
            <div className="flex justify-center space-x-6">
              {["github", "linkedin", "twitter", "dribbble"].map(
                (social, index) => (
                  <a
                    key={index}
                    href={`https://${social}.com/yourusername`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-indigo-600 transition-colors duration-300"
                  >
                    <span className="sr-only">{social}</span>
                    <i className={`fab fa-${social} text-2xl`}></i>
                  </a>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
