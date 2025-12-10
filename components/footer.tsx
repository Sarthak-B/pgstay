import { Home, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  company: [
    { name: "About Us", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Refunds", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Safety", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ],
  students: [
    { name: "Find PGs", href: "#" },
    { name: "Roommate Finder", href: "#" },
    { name: "Student Discounts", href: "#" },
    { name: "Moving Guide", href: "#" },
  ],
  owners: [
    { name: "List Property", href: "#" },
    { name: "Owner Dashboard", href: "#" },
    { name: "Pricing Plans", href: "#" },
    { name: "Partner with Us", href: "#" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/", label: "Facebook" },
  { icon: Twitter, href: "https://x.com/", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/PGStay.in", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/", label: "LinkedIn" },
]

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xl font-bold text-background">PGStay</span>
            </a>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              India's most trusted platform for student accommodation. Find verified PGs and rooms near your campus.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-background mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-background mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Students Links */}
          <div>
            <h3 className="font-semibold text-background mb-4">For Students</h3>
            <ul className="space-y-3">
              {footerLinks.students.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Owners Links */}
          <div>
            <h3 className="font-semibold text-background mb-4">For Owners</h3>
            <ul className="space-y-3">
              {footerLinks.owners.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 py-8 border-t border-background/20">
          <div className="flex items-center gap-2 text-background/70 text-sm">
            <Mail className="w-4 h-4" />
            <span>support@PGStay.in</span>
          </div>
          <div className="flex items-center gap-2 text-background/70 text-sm">
            <Phone className="w-4 h-4" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2 text-background/70 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Uttarakhand, India</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-background/60 text-sm">© {new Date().getFullYear()} PGStay. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">
                Terms
              </a>
              <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">
                Privacy
              </a>
              <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
