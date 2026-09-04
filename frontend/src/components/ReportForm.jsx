import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, AlertTriangle, MapPin, Hash, Phone, Upload, CheckCircle2, ShieldAlert } from 'lucide-react';

const ReportForm = () => {
  const initialFormState = {
    fenceId: '',
    district: '',
    damageType: '',
    urgency: '',
    phone: '',
    image: null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Cleanup object URL to prevent memory leaks when preview changes or component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user starts interacting
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      // Generate a local object URL for thumbnail preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.district) {
      newErrors.district = 'Please select a District.';
    }
    
    if (!formData.damageType) {
      newErrors.damageType = 'Please select a Damage Type.';
    }
    
    const phoneRegex = /^07\d{8}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Sri Lankan phone number (e.g., 0712345678).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fenceId: formData.fenceId,
        district: formData.district,
        damageType: formData.damageType,
        urgency: formData.urgency,
        phone: formData.phone
      };

      const response = await axios.post('http://localhost:5000/api/faults', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        setSubmitStatus({
          type: 'success',
          message: 'Fault report submitted successfully. Thank you for protecting our wildlife.'
        });
        
        // Reset form completely
        setFormData(initialFormState);
        setImagePreview(null);
        setErrors({});
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to submit report. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2069&auto=format&fit=crop')" }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

      <div className="relative z-10 max-w-3xl w-full p-8 md:p-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/20">
          <div className="bg-white/20 p-3 rounded-xl text-white shadow-sm backdrop-blur-sm border border-white/10">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-white tracking-wide">Report a Fault</h2>
            <p className="text-gray-200 text-sm mt-1.5 font-sans font-light tracking-wide">Help the DWC manage the Human-Elephant Conflict by reporting damaged fences.</p>
          </div>
        </div>

        {submitStatus && submitStatus.type === 'success' && (
          <div className="mb-8 p-4 bg-white/20 text-white rounded-lg flex items-center gap-3 border border-green-400/50 shadow-sm backdrop-blur-md">
            <CheckCircle2 className="flex-shrink-0 text-green-300" size={24} />
            <div>
              <h4 className="font-semibold text-green-50 tracking-wide">Success</h4>
              <p className="text-sm mt-0.5 text-green-100/90">{submitStatus.message}</p>
            </div>
          </div>
        )}

        {submitStatus && submitStatus.type === 'error' && (
          <div className="mb-8 p-4 bg-white/10 text-white rounded-lg flex items-center gap-3 border border-red-500/50 shadow-sm backdrop-blur-md">
            <AlertTriangle className="flex-shrink-0 text-red-400" size={24} />
            <div>
              <h4 className="font-semibold text-red-100 tracking-wide">Submission Failed</h4>
              <p className="text-sm mt-0.5 text-red-200/90">{submitStatus.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 font-sans">
          
          {/* Row 1: Fence ID & District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fence ID / Landmark */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                Fence ID / Landmark <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                  <Hash size={18} />
                </div>
                <input
                  type="text"
                  name="fenceId"
                  value={formData.fenceId}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Post 42, Anuradhapura border"
                  className="pl-10 w-full p-3 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white transition-all outline-none backdrop-blur-sm"
                />
              </div>
            </div>

            {/* District Select */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                District <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                  <MapPin size={18} />
                </div>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`pl-10 w-full p-3 bg-white/10 border text-white rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white transition-all outline-none backdrop-blur-sm appearance-none [&>option]:text-gray-900 ${errors.district ? 'border-red-400 ring-1 ring-red-400' : 'border-white/20'}`}
                >
                  <option value="" className="text-gray-500">Select a District...</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                  <option value="Polonnaruwa">Polonnaruwa</option>
                  <option value="Ampara">Ampara</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Hambantota">Hambantota</option>
                  <option value="Monaragala">Monaragala</option>
                  <option value="Trincomalee">Trincomalee</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.district && (
                <p className="text-red-400 text-sm mt-2 font-medium flex items-center gap-1.5 bg-black/20 p-2 rounded backdrop-blur-sm border border-red-500/20">
                  <AlertTriangle size={14} /> {errors.district}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Damage Type & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Damage Type Select */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                Damage Type <span className="text-red-400">*</span>
              </label>
              <select
                name="damageType"
                value={formData.damageType}
                onChange={handleChange}
                className={`w-full p-3 bg-white/10 border text-white rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white transition-all outline-none backdrop-blur-sm appearance-none [&>option]:text-gray-900 ${errors.damageType ? 'border-red-400 ring-1 ring-red-400' : 'border-white/20'}`}
              >
                <option value="" className="text-gray-500">Select type of damage...</option>
                <option value="Broken Wire">Broken Wire</option>
                <option value="Fallen Post">Fallen Post</option>
                <option value="Power Failure">Power Failure</option>
                <option value="Overgrown Vegetation">Overgrown Vegetation</option>
                <option value="Elephant Breach">Elephant Breach</option>
                <option value="Other">Other</option>
              </select>
              {errors.damageType && (
                <p className="text-red-400 text-sm mt-2 font-medium flex items-center gap-1.5 bg-black/20 p-2 rounded backdrop-blur-sm border border-red-500/20">
                  <AlertTriangle size={14} /> {errors.damageType}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                Reporter Phone <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="07XXXXXXXX"
                  className={`pl-10 w-full p-3 bg-white/10 border text-white placeholder-white/40 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white transition-all outline-none backdrop-blur-sm ${errors.phone ? 'border-red-400 ring-1 ring-red-400' : 'border-white/20'}`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm mt-2 font-medium flex items-center gap-1.5 bg-black/20 p-2 rounded backdrop-blur-sm border border-red-500/20">
                  <AlertTriangle size={14} /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Urgency Level - Radio Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3 tracking-wide">
              Urgency Level <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className={`flex-1 flex items-center cursor-pointer p-4 border rounded-xl transition-all backdrop-blur-sm ${formData.urgency === 'Low' ? 'bg-white/20 border-white shadow-lg' : 'bg-white/5 border-white/20 hover:border-white/50 hover:bg-white/10'}`}>
                <input 
                  type="radio" 
                  name="urgency" 
                  value="Low"
                  checked={formData.urgency === 'Low'}
                  onChange={handleChange}
                  className="w-4 h-4 text-white border-white/40 bg-transparent focus:ring-white focus:ring-offset-0 focus:ring-offset-transparent" 
                  required
                />
                <span className="ml-3 font-medium text-white">Low</span>
              </label>
              
              <label className={`flex-1 flex items-center cursor-pointer p-4 border rounded-xl transition-all backdrop-blur-sm ${formData.urgency === 'Medium' ? 'bg-white/20 border-white shadow-lg' : 'bg-white/5 border-white/20 hover:border-white/50 hover:bg-white/10'}`}>
                <input 
                  type="radio" 
                  name="urgency" 
                  value="Medium"
                  checked={formData.urgency === 'Medium'}
                  onChange={handleChange}
                  className="w-4 h-4 text-white border-white/40 bg-transparent focus:ring-white focus:ring-offset-0 focus:ring-offset-transparent" 
                  required
                />
                <span className="ml-3 font-medium text-white">Medium</span>
              </label>
              
              <label className={`flex-1 flex items-center cursor-pointer p-4 border rounded-xl transition-all backdrop-blur-sm ${formData.urgency === 'Critical' ? 'bg-red-500/30 border-red-400 shadow-lg' : 'bg-white/5 border-white/20 hover:border-red-400/50 hover:bg-red-500/10'}`}>
                <input 
                  type="radio" 
                  name="urgency" 
                  value="Critical"
                  checked={formData.urgency === 'Critical'}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-500 border-white/40 bg-transparent focus:ring-red-400 focus:ring-offset-0 focus:ring-offset-transparent" 
                  required
                />
                <span className="ml-3 font-medium text-white">Critical</span>
              </label>
            </div>
          </div>

          {/* Photo Upload with Thumbnail Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3 tracking-wide">
              Photo Upload (Optional)
            </label>
            <div className="flex items-center gap-6">
              <label
                htmlFor="image-upload"
                className="cursor-pointer group flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/30 rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/60 transition-all backdrop-blur-sm"
              >
                <Camera className="w-8 h-8 text-white/60 group-hover:text-white mb-2 transition-colors" />
                <span className="text-xs font-medium text-white/80 group-hover:text-white">Add Photo</span>
                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>

              {/* Thumbnail Preview */}
              {imagePreview && (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/30 shadow-lg group">
                  <img 
                    src={imagePreview} 
                    alt="Fault preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({...prev, image: null}));
                      document.getElementById('image-upload').value = '';
                    }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"
                  >
                    <span className="text-white text-xs font-semibold border border-white/50 px-3 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors">Remove</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-white/20">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-3 py-4 px-6 border-2 border-transparent rounded-xl shadow-xl text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/30 font-bold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Report...
                </span>
              ) : (
                <>
                  <Upload size={22} />
                  Submit Fault Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
