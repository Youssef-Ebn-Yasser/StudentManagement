using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FooterController : ControllerBase
    {
        [HttpGet("features")]
        public IActionResult Features() => Ok(new
        {
            title = "Platform Features",
            features = new[]
            {
                "Interactive Online Courses with Video Lessons",
                "Live Zoom Meetings and Webinars",
                "Real-time Chat with Teachers and Students",
                "Assignment Submission and Grading System",
                "Quiz and Assessment Tools",
                "Multi-language Support (English/Arabic)",
                "Payment Integration (Stripe & Paymob)",
                "Progress Tracking and Certificates",
                "Mobile Responsive Design",
                "File Upload and Material Management"
            }
        });

        [HttpGet("pricing")]
        public IActionResult Pricing() => Ok(new
        {
            title = "Course Pricing",
            description = "Our courses are priced individually based on content, duration, and instructor expertise.",
            pricingInfo = new
            {
                individualCourses = "Each course has its own price based on content and duration",
                paymentMethods = new[] { "Stripe (International)", "Paymob (Egypt)", "Manual Payment" },
                currency = "EGP (Egyptian Pound)",
                features = new[]
                {
                    "Lifetime access to course content",
                    "Live interactive sessions",
                    "Assignment feedback",
                    "Certificate upon completion",
                    "24/7 support"
                }
            }
        });

        [HttpGet("blog")]
        public IActionResult Blog() => Ok(new
        {
            title = "Educational Blog",
            description = "Stay updated with the latest educational trends, tips, and insights.",
            recentPosts = new[]
            {
                new { title = "Effective Online Learning Strategies", date = "2024-01-15" },
                new { title = "How to Choose the Right Course", date = "2024-01-10" },
                new { title = "Tips for Successful Remote Learning", date = "2024-01-05" },
                new { title = "The Future of E-Learning", date = "2024-01-01" }
            }
        });

        [HttpGet("user-guides")]
        public IActionResult UserGuides() => Ok(new
        {
            title = "User Guides & Tutorials",
            guides = new[]
            {
                new { title = "Getting Started with Your First Course", category = "Student Guide" },
                new { title = "How to Create and Upload Courses", category = "Teacher Guide" },
                new { title = "Managing Your Learning Progress", category = "Student Guide" },
                new { title = "Setting Up Live Meetings", category = "Teacher Guide" },
                new { title = "Payment and Enrollment Process", category = "General" },
                new { title = "Using the Chat System", category = "General" },
                new { title = "Submitting Assignments", category = "Student Guide" },
                new { title = "Grading and Feedback System", category = "Teacher Guide" }
            }
        });

        [HttpGet("webinars")]
        public IActionResult Webinars() => Ok(new
        {
            title = "Live Webinars & Events",
            description = "Join our live educational webinars and interactive sessions.",
            upcomingWebinars = new[]
            {
                new { title = "Introduction to Online Teaching", date = "2024-02-01", time = "18:00 GMT" },
                new { title = "Advanced Course Creation Techniques", date = "2024-02-05", time = "19:00 GMT" },
                new { title = "Student Engagement Strategies", date = "2024-02-10", time = "17:00 GMT" }
            },
            features = new[]
            {
                "Live Q&A Sessions",
                "Interactive Polls and Surveys",
                "Screen Sharing Capabilities",
                "Recording and Replay Options",
                "Multi-language Support"
            }
        });

        [HttpGet("about")]
        public IActionResult About() => Ok(new
        {
            title = "About Our Platform",
            description = "We are a leading e-learning platform dedicated to providing quality education through innovative technology.",
            mission = "To make quality education accessible to everyone through our comprehensive online learning platform.",
            vision = "To become the premier destination for online education in the region.",
            stats = new
            {
                courses = "100+",
                students = "10,000+",
                teachers = "500+",
                categories = "20+"
            },
            features = new[]
            {
                "Multi-language support (English/Arabic)",
                "Advanced learning management system",
                "Secure payment processing",
                "24/7 technical support",
                "Mobile-friendly interface"
            }
        });

        [HttpGet("join-us")]
        public IActionResult JoinUs() => Ok(new
        {
            title = "Join Our Team",
            description = "Become part of our growing educational community.",
            opportunities = new[]
            {
                new { role = "Course Instructor", description = "Share your expertise and create engaging courses" },
                new { role = "Content Creator", description = "Develop educational materials and resources" },
                new { role = "Student", description = "Enroll in courses and advance your skills" },
                new { role = "Partner", description = "Collaborate with us to expand educational reach" }
            },
            benefits = new[]
            {
                "Flexible working hours",
                "Competitive compensation",
                "Professional development opportunities",
                "Access to learning resources",
                "Global network of educators"
            },
            contactEmail = "hadeer.abdelgawad44@gmail.com"
        });

        [HttpGet("privacy")]
        public IActionResult Privacy() => Ok(new
        {
            title = "Privacy Policy",
            lastUpdated = "2024-01-01",
            sections = new[]
            {
                new { title = "Information We Collect", content = "We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us." },
                new { title = "How We Use Your Information", content = "We use the information we collect to provide, maintain, and improve our services, process payments, and communicate with you." },
                new { title = "Information Sharing", content = "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent." },
                new { title = "Data Security", content = "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction." },
                new { title = "Your Rights", content = "You have the right to access, update, or delete your personal information at any time." },
                new { title = "Contact Us", content = "If you have any questions about this Privacy Policy, please contact us at privacy@platform.com" }
            }
        });

        [HttpGet("terms")]
        public IActionResult Terms() => Ok(new
        {
            title = "Terms and Conditions",
            lastUpdated = "2024-01-01",
            sections = new[]
            {
                new { title = "Acceptance of Terms", content = "By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement." },
                new { title = "User Accounts", content = "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer." },
                new { title = "Course Content", content = "All course content is provided for educational purposes only. Users may not reproduce, distribute, or create derivative works." },
                new { title = "Payment Terms", content = "Course fees are non-refundable unless otherwise specified. Payment must be completed before course access is granted." },
                new { title = "Code of Conduct", content = "Users must behave respectfully and professionally. Harassment, spam, or inappropriate content will not be tolerated." },
                new { title = "Intellectual Property", content = "All content on this platform is protected by copyright and other intellectual property laws." },
                new { title = "Limitation of Liability", content = "The platform is provided as-is without warranties. We are not liable for any damages arising from use of the service." }
            }
        });

        [HttpGet("sitemap")]
        public IActionResult Sitemap() => Ok(new
        {
            title = "Site Map",
            pages = new
            {
                main = new[]
                {
                    "/",
                    "/courses",
                    "/categories",
                    "/about",
                    "/contact"
                },
                courses = new[]
                {
                    "/courses/browse",
                    "/courses/search",
                    "/courses/category/{id}",
                    "/courses/{id}",
                    "/courses/{id}/lessons"
                },
                user = new[]
                {
                    "/login",
                    "/register",
                    "/profile",
                    "/dashboard",
                    "/my-courses"
                },
                teacher = new[]
                {
                    "/teacher/dashboard",
                    "/teacher/courses",
                    "/teacher/create-course",
                    "/teacher/students"
                },
                admin = new[]
                {
                    "/admin/dashboard",
                    "/admin/users",
                    "/admin/courses",
                    "/admin/reports"
                }
            }
        });

        [HttpPost("subscribe-newsletter")]
        public IActionResult SubscribeNewsletter([FromBody] string email)
        {
            // Add logic to save the email or send to a newsletter service
            return Ok(new
            {
                message = $"Successfully subscribed {email} to our newsletter!",
                status = "success",
                email = email,
                subscribedAt = DateTime.UtcNow
            });
        }
    }
} 