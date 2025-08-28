import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function PublicFooter() {
    const year = new Date().getFullYear();
    const currentHour = new Date().getHours();
    const isDaytime = currentHour > 6 && currentHour < 18;

    const footerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: 'beforeChildren',
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.footer 
            className="relative mt-24 w-full overflow-hidden border-t border-slate-200/50 bg-gradient-to-b from-white/80 to-slate-50/50 backdrop-blur-sm dark:border-slate-800/50 dark:from-slate-900/80 dark:to-slate-950/80"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={footerVariants}
        >
            {/* Animated background elements */}
            <motion.div 
                className="absolute -top-1/2 -right-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-r from-blue-100/20 to-purple-100/20 blur-3xl dark:from-blue-900/10 dark:to-purple-900/10"
                animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                }}
                transition={{ 
                    duration: 15, 
                    repeat: Infinity, 
                    repeatType: 'reverse',
                    ease: 'easeInOut'
                }}
            />
            
            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* Brand Section */}
                    <motion.div 
                        className="space-y-4"
                        variants={itemVariants}
                    >
                        <div className="flex items-center space-x-2">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                                WorkApp
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Connecting skilled professionals with clients who need their expertise.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { icon: <Github className="h-5 w-5" />, href: '#' },
                                { icon: <Twitter className="h-5 w-5" />, href: '#' },
                                { icon: <Linkedin className="h-5 w-5" />, href: '#' },
                                { icon: <Mail className="h-5 w-5" />, href: '#' }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    variants={itemVariants}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links Sections */}
                    {[
                        {
                            title: 'Company',
                            links: [
                                { name: 'About Us', href: '#' },
                                { name: 'Careers', href: '#' },
                                { name: 'Blog', href: '#' },
                                { name: 'Press', href: '#' }
                            ]
                        },
                        {
                            title: 'Resources',
                            links: [
                                { name: 'Help Center', href: '#' },
                                { name: 'Community', href: '#' },
                                { name: 'Guides', href: '#' },
                                { name: 'Webinars', href: '#' }
                            ]
                        },
                        {
                            title: 'Legal',
                            links: [
                                { name: 'Privacy Policy', href: '#' },
                                { name: 'Terms of Service', href: '#' },
                                { name: 'Cookie Policy', href: '#' },
                                { name: 'GDPR', href: '#' }
                            ]
                        }
                    ].map((section, index) => (
                        <motion.div 
                            key={section.title} 
                            className="space-y-4"
                            variants={itemVariants}
                            transition={{ delay: 0.1 * (index + 1) }}
                        >
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <motion.li 
                                        key={linkIndex}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                    >
                                        <a 
                                            href={link.href}
                                            className="text-sm text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                                        >
                                            {link.name}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <motion.div 
                    className="mt-12 border-t border-slate-200/50 pt-8 text-center text-sm text-slate-500 dark:border-slate-800/50 dark:text-slate-500"
                    variants={itemVariants}
                >
                    <p>© {year} WorkApp. All rights reserved.</p>
                    <p className="mt-2 text-xs">
                        Made with ❤️ for a better work experience
                    </p>
                </motion.div>
            </div>
        </motion.footer>
    );
}


