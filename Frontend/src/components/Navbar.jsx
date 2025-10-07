import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
]

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 12)
        handleScroll()
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <motion.header
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out ${
                isScrolled
                    ? "backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-sm py-3"
                    : "bg-transparent py-5"
            }`}
        >
            <div className="relative">
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-indigo-500/60 via-purple-500/60 to-indigo-500/60 opacity-80" />
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 md:px-12">
                    <motion.a
                        href="#home"
                        className="group flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    >
                        <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-indigo-500 transition duration-300 group-hover:from-indigo-500/30 group-hover:to-pink-500/30 dark:text-indigo-300">
                            <GraduationCap className="h-5 w-5" />
                        </span>
                        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                            StudentMajor.AI
                        </span>
                    </motion.a>

                    <motion.nav
                        className="hidden items-center gap-8 text-sm font-medium md:flex"
                        initial={false}
                    >
                        {navItems.map(({ label, href }) => (
                            <motion.a
                                key={label}
                                href={href}
                                className="relative text-gray-700 transition-all duration-300 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                            >
                                {label}
                                <span className="absolute inset-x-0 -bottom-1 h-0.5 scale-x-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                            </motion.a>
                        ))}
                    </motion.nav>

                    <div className="hidden items-center md:flex">
                        <Button
                            variant="default"
                            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-500"
                        >
                            <span className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 opacity-0 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100" />
                            <span className="relative">Get Started</span>
                        </Button>
                    </div>

                    <button
                        type="button"
                        aria-label="Toggle menu"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        className="inline-flex items-center justify-center rounded-lg border border-indigo-500/20 bg-white/70 p-2 text-gray-700 transition hover:border-indigo-500/40 hover:bg-white dark:border-gray-700/60 dark:bg-gray-900/70 dark:text-gray-200 dark:hover:border-indigo-500/40 md:hidden"
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="mt-3 origin-top md:hidden"
                    >
                        <motion.ul
                            className="mx-4 flex flex-col gap-2 rounded-2xl border border-indigo-500/10 bg-white/90 p-4 shadow-lg backdrop-blur-md dark:border-indigo-500/10 dark:bg-gray-900/80"
                            initial="closed"
                            animate="open"
                            variants={{
                                open: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
                                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                            }}
                        >
                            {navItems.map(({ label, href }) => (
                                <motion.li
                                    key={label}
                                    variants={{
                                        open: { opacity: 1, y: 0 },
                                        closed: { opacity: 0, y: -10 },
                                    }}
                                >
                                    <motion.a
                                        href={href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-gray-800 transition-colors duration-300 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-100 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {label}
                                        <span className="h-1 w-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80" />
                                    </motion.a>
                                </motion.li>
                            ))}
                            <motion.li
                                variants={{
                                    open: { opacity: 1, y: 0 },
                                    closed: { opacity: 0, y: -10 },
                                }}
                            >
                                <Button
                                    variant="default"
                                    className="mt-2 w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-500"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started
                                </Button>
                            </motion.li>
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}

export default Navbar
