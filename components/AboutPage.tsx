import { BookOpenIcon, UsersIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline'

const stats = [
  { label: 'Stories Available', value: '10,000+', icon: BookOpenIcon },
  { label: 'Active Readers', value: '50,000+', icon: UsersIcon },
  { label: 'AI Models', value: '3', icon: SparklesIcon },
  { label: 'Average Rating', value: '4.8/5', icon: HeartIcon },
]

const team = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    bio: 'Former AI researcher at Google, passionate about making AI storytelling accessible to everyone.',
    image: '/team/alex.jpg',
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Product',
    bio: 'Product leader with 10+ years experience in consumer apps and content platforms.',
    image: '/team/sarah.jpg',
  },
  {
    name: 'David Kim',
    role: 'Lead Engineer',
    bio: 'Full-stack developer specializing in AI integration and scalable web applications.',
    image: '/team/david.jpg',
  },
  {
    name: 'Maria Rodriguez',
    role: 'Content Director',
    bio: 'Former editor at major publishing house, curating the best AI-generated stories.',
    image: '/team/maria.jpg',
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-12 page-transition">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 text-slide-up">
          About <span className="text-primary-600">StoryFlow</span>
        </h1>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto text-fade-in">
          We're on a mission to democratize storytelling by making AI-generated content 
          accessible, enjoyable, and meaningful for readers worldwide.
        </p>
      </div>

             {/* Stats */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {stats.map((stat, index) => (
           <div key={stat.label} className="text-center stagger-item" style={{ animationDelay: `${index * 100}ms` }}>
             <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover-lift">
               <stat.icon className="h-8 w-8 text-primary-600 mx-auto mb-3" />
               <div className="text-2xl font-bold text-secondary-900 mb-1">{stat.value}</div>
               <div className="text-secondary-600 text-sm">{stat.label}</div>
             </div>
           </div>
         ))}
       </div>

      {/* Mission */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Democratizing Storytelling</h3>
              <p className="text-secondary-600 mb-4">
                We believe everyone deserves access to high-quality stories. By leveraging AI technology, 
                we're creating a platform where anyone can discover, read, and enjoy stories that resonate with them.
              </p>
              <p className="text-secondary-600">
                Our AI models are carefully curated to produce engaging, diverse, and meaningful content 
                across all genres and styles.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Building Community</h3>
                             <p className="text-secondary-600 mb-4">
                 StoryFlow isn't just about reading—it's about connecting with fellow story lovers. 
                 Our community features allow readers to rate, review, and discuss their favorite stories.
               </p>
              <p className="text-secondary-600">
                We're building a space where human creativity and AI innovation come together to create 
                something truly special.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Meet Our Team</h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            We're a small but passionate team dedicated to revolutionizing how people discover and enjoy stories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-primary-600 text-2xl font-bold">{member.name.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-1">{member.name}</h3>
              <p className="text-primary-600 text-sm mb-3">{member.role}</p>
              <p className="text-secondary-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Innovation</h3>
              <p className="text-secondary-600">
                We constantly push the boundaries of what's possible with AI and storytelling technology.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Quality</h3>
              <p className="text-secondary-600">
                Every story on our platform meets our high standards for creativity, coherence, and engagement.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Community</h3>
              <p className="text-secondary-600">
                We believe in the power of community to shape and improve the stories we create together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 text-center">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">Get in Touch</h2>
        <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
          Have questions, suggestions, or just want to say hello? We'd love to hear from you!
        </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <a href="mailto:hello@storyflow.com" className="btn-primary btn-animate hover-lift">
             Send us an email
           </a>
           <a href="https://discord.gg/storyflow" className="btn-secondary btn-animate hover-lift">
             Join our Discord
           </a>
         </div>
      </div>
    </div>
  )
}
