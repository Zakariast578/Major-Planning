import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";


const navItems = [
    { label: "Home", href: "/" },
    { label: "Predict", href: "/predict" },
    { label: "About", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
]

const MotionLink = motion(Link)

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg"
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
                <Link to="/" className="text-lg font-semibold text-cyan-400">
                    AI Major Predictor
                </Link>

                <nav className="hidden items-center gap-7 text-sm font-medium text-slate-100 md:flex">
                    {navItems.map(({ label, href }) => (
                        <MotionLink
                            key={href}
                            to={href}
                            whileHover={{ y: -2 }}
                            className="transition-colors hover:text-cyan-400"
                        >
                            {label}
                        </MotionLink>
                    ))}
                </nav>

                <div className="hidden md:flex">
                    <Button className="bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 text-sm font-semibold text-white shadow-md transition hover:shadow-lg">
                        Predict Now
                    </Button>
                </div>

                <button
                    type="button"
                    aria-label="Toggle navigation"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400 md:hidden"
                >
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden"
                    >
                        <motion.ul
                            initial="closed"
                            animate="open"
                            variants={{
                                open: { transition: { staggerChildren: 0.05 } },
                                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                            }}
                            className="space-y-2 border-t border-slate-700 bg-slate-900 px-5 py-4 text-sm text-slate-100"
                        >
                            {navItems.map(({ label, href }) => (
                                <motion.li
                                    key={href}
                                    variants={{
                                        open: { opacity: 1, y: 0 },
                                        closed: { opacity: 0, y: -12 },
                                    }}
                                >
                                    <MotionLink
                                        to={href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between rounded-md px-3 py-2 transition hover:bg-slate-800 hover:text-cyan-400"
                                    >
                                        {label}
                                        <span className="h-1 w-1 rounded-full bg-cyan-400" />
                                    </MotionLink>
                                </motion.li>
                            ))}
                            <motion.li
                                variants={{
                                    open: { opacity: 1, y: 0 },
                                    closed: { opacity: 0, y: -12 },
                                }}
                            >
                                <Button
                                    className="w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Predict Now
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
