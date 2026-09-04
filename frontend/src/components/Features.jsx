import { ShieldAlert, Map, Bell, Activity } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <ShieldAlert className="h-6 w-6 text-indigo-600" />,
      title: 'Community Reporting',
      description: 'Empower farmers and wildlife volunteers to report fence faults instantly. Include GPS locations, issue types, and photo evidence.'
    },
    {
      icon: <Map className="h-6 w-6 text-indigo-600" />,
      title: 'Interactive Dashboard',
      description: 'A searchable and filterable grid of monitored fence segments across zones, allowing DWC officers to track breaches in real-time.'
    },
    {
      icon: <Activity className="h-6 w-6 text-indigo-600" />,
      title: 'Dynamic Priority Scoring',
      description: 'Our system automatically calculates which broken fence section poses the highest immediate threat to nearby settlements.'
    },
    {
      icon: <Bell className="h-6 w-6 text-indigo-600" />,
      title: 'Rapid Response',
      description: 'By crowdsourcing data, we enable wildlife authorities to dispatch repair teams swiftly, reducing the 60% failure rate of community fences.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Why FenceGuard LK?</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Protecting Communities & Wildlife
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Over 60% of elephant encroachments happen because community electric fences fail. We are here to change that.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Simple Statistics Section */}
        <div className="mt-24 bg-indigo-600 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-indigo-500 text-center">
            <div className="p-10">
              <p className="text-4xl font-extrabold text-white mb-2">60%</p>
              <p className="text-indigo-100 font-medium">Fence Failure Rate Targeted</p>
            </div>
            <div className="p-10">
              <p className="text-4xl font-extrabold text-white mb-2">24/7</p>
              <p className="text-indigo-100 font-medium">Monitoring & Reporting</p>
            </div>
            <div className="p-10">
              <p className="text-4xl font-extrabold text-white mb-2">100+</p>
              <p className="text-indigo-100 font-medium">Communities Protected</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
