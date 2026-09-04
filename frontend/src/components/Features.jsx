import { ShieldAlert, Map, Bell, Activity } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <ShieldAlert className="h-6 w-6 text-emerald-400" />,
      title: 'Community Reporting',
      description: 'Empower farmers and wildlife volunteers to report fence faults instantly. Include GPS locations, issue types, and photo evidence.'
    },
    {
      icon: <Map className="h-6 w-6 text-emerald-400" />,
      title: 'Interactive Dashboard',
      description: 'A searchable and filterable grid of monitored fence segments across zones, allowing DWC officers to track breaches in real-time.'
    },
    {
      icon: <Activity className="h-6 w-6 text-emerald-400" />,
      title: 'Dynamic Priority Scoring',
      description: 'Our system automatically calculates which broken fence section poses the highest immediate threat to nearby settlements.'
    },
    {
      icon: <Bell className="h-6 w-6 text-emerald-400" />,
      title: 'Rapid Response',
      description: 'By crowdsourcing data, we enable wildlife authorities to dispatch repair teams swiftly, reducing the 60% failure rate of community fences.'
    }
  ];

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
          <h2 className="text-emerald-400 font-semibold tracking-wide uppercase text-sm mb-3">Live System Metrics</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Protecting Communities & Wildlife
          </p>
          <p className="mt-4 max-w-2xl text-lg text-gray-300 mx-auto">
            Over 60% of elephant encroachments happen because community electric fences fail. We are here to change that.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-24 bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20 text-center">
            <div className="p-10 hover:bg-white/5 transition-colors">
              <p className="text-4xl font-extrabold text-emerald-400 mb-2">60%</p>
              <p className="text-gray-300 font-medium">Fence Failure Rate Targeted</p>
            </div>
            <div className="p-10 hover:bg-white/5 transition-colors">
              <p className="text-4xl font-extrabold text-emerald-400 mb-2">24/7</p>
              <p className="text-gray-300 font-medium">Monitoring & Reporting</p>
            </div>
            <div className="p-10 hover:bg-white/5 transition-colors">
              <p className="text-4xl font-extrabold text-emerald-400 mb-2">100+</p>
              <p className="text-gray-300 font-medium">Communities Protected</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
