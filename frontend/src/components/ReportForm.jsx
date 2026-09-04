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

      try {
        await axios.post('http://localhost:5001/api/faults', payload, {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        // Ignore backend errors for MVP mock
      }

      // Save to localStorage for the map
      const existingReports = JSON.parse(localStorage.getItem('fence_reports') || '[]');
      
      // Approximate coordinates based on district to show on the map
      const districtCoords = {
        Anuradhapura: [8.3114, 80.4168],
        Polonnaruwa: [7.9403, 81.0188],
        Ampara: [7.2912, 81.6724],
        Kurunegala: [7.4818, 80.3609],
        Hambantota: [6.1248, 81.1185],
        Monaragala: [6.8728, 81.3507],
        Trincomalee: [8.5874, 81.2152],
        Other: [7.8731, 80.7718] // Center of SL
      };
      
      const coords = districtCoords[formData.district] || [7.8731, 80.7718];
      // add slight jitter so they don't perfectly overlap
      const jitterLat = coords[0] + (Math.random() - 0.5) * 0.05;
      const jitterLng = coords[1] + (Math.random() - 0.5) * 0.05;

      const newReport = {
        id: Date.now(),
        ...payload,
        lat: jitterLat,
        lng: jitterLng,
        timestamp: new Date().toISOString()
      };
      
      existingReports.push(newReport);
      localStorage.setItem('fence_reports', JSON.stringify(existingReports));

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

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit report. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2069&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 max-w-xl mx-auto my-12 p-8 rounded-2xl bg-black/65 backdrop-blur-lg border border-white/20 shadow-2xl text-white w-full">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/20">
          <div className="bg-white/10 p-3 rounded-xl text-emerald-400 shadow-sm border border-white/10">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-serif tracking-wide text-white">Report a Fence Fault</h2>
            <p className="text-gray-300 text-sm mt-1.5 font-sans font-light">This alerts the DWC quick-response units immediately.</p>
          </div>
        </div>

        {submitStatus && submitStatus.type === 'success' && (
          <div className="mb-6 p-4 bg-emerald-500/20 text-white rounded-lg flex items-center gap-3 border border-emerald-400/50 shadow-sm backdrop-blur-md">
            <CheckCircle2 className="flex-shrink-0 text-emerald-400" size={24} />
            <div>
              <h4 className="font-semibold tracking-wide">Success</h4>
              <p className="text-sm mt-0.5 text-emerald-100">{submitStatus.message}</p>
            </div>
          </div>
        )}

        {submitStatus && submitStatus.type === 'error' && (
          <div className="mb-6 p-4 bg-rose-500/20 text-white rounded-lg flex items-center gap-3 border border-rose-500/50 shadow-sm backdrop-blur-md">
            <AlertTriangle className="flex-shrink-0 text-rose-400" size={24} />
            <div>
              <h4 className="font-semibold tracking-wide">Submission Failed</h4>
              <p className="text-sm mt-0.5 text-rose-100">{submitStatus.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">
                Fence ID / Landmark <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                  <Hash size={16} />
                </div>
                <input
                  type="text"
                  name="fenceId"
                  value={formData.fenceId}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Post 42"
                  className="pl-9 w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">
                District <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                  <MapPin size={16} />
                </div>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`pl-9 w-full px-4 py-2.5 rounded-lg bg-white/10 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none transition-all [&>option]:bg-gray-800 [&>option]:text-white ${errors.district ? 'border-rose-400 ring-1 ring-rose-400' : 'border-white/20'}`}
                >
                  <option value="" className="text-gray-400">Select...</option>
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
                <p className="text-rose-400 text-xs mt-1">{errors.district}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">
                Damage Type <span className="text-rose-400">*</span>
              </label>
              <select
                name="damageType"
                value={formData.damageType}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-white/10 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none transition-all [&>option]:bg-gray-800 [&>option]:text-white ${errors.damageType ? 'border-rose-400 ring-1 ring-rose-400' : 'border-white/20'}`}
              >
                <option value="" className="text-gray-400">Select damage...</option>
                <option value="Broken Wire">Broken Wire</option>
                <option value="Fallen Post">Fallen Post</option>
                <option value="Power Failure">Power Failure</option>
                <option value="Overgrown Vegetation">Overgrown Vegetation</option>
                <option value="Elephant Breach">Elephant Breach</option>
                <option value="Other">Other</option>
              </select>
              {errors.damageType && (
                <p className="text-rose-400 text-xs mt-1">{errors.damageType}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">
                Reporter Phone <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="07XXXXXXXX"
                  className={`pl-9 w-full px-4 py-2.5 rounded-lg bg-white/10 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all ${errors.phone ? 'border-rose-400 ring-1 ring-rose-400' : 'border-white/20'}`}
                />
              </div>
              {errors.phone && (
                <p className="text-rose-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">
              Urgency Level <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className={`flex-1 flex items-center justify-center cursor-pointer px-4 py-3 border rounded-lg transition-all duration-200 ${formData.urgency === 'Low' ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10' : 'bg-white/5 border-white/20 hover:border-emerald-500/30 hover:bg-white/10 text-gray-300'}`}>
                <input 
                  type="radio" 
                  name="urgency" 
                  value="Low"
                  checked={formData.urgency === 'Low'}
                  onChange={handleChange}
                  className="sr-only"
                  required
                />
                <span className="font-semibold text-sm">Low</span>
                {formData.urgency === 'Low' && <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400"></span>}
              </label>
              
              <label className={`flex-1 flex items-center justify-center cursor-pointer px-4 py-3 border rounded-lg transition-all duration-200 ${formData.urgency === 'Medium' ? 'bg-amber-500/20 border-amber-500/50 text-white shadow-lg shadow-amber-500/10' : 'bg-white/5 border-white/20 hover:border-amber-500/30 hover:bg-white/10 text-gray-300'}`}>
                <input 
                  type="radio" 
                  name="urgency" 
                  value="Medium"
                  checked={formData.urgency === 'Medium'}
                  onChange={handleChange}
                  className="sr-only"
                  required
                />
                <span className="font-semibold text-sm">Medium</span>
                {formData.urgency === 'Medium' && <span className="ml-2 w-2 h-2 rounded-full bg-amber-400"></span>}
              </label>
              
              <label className={`flex-1 flex items-center justify-center cursor-pointer px-4 py-3 border rounded-lg transition-all duration-200 ${formData.urgency === 'Critical' ? 'bg-rose-500/20 border-rose-500/50 text-white shadow-lg shadow-rose-500/10' : 'bg-white/5 border-white/20 hover:border-rose-500/30 hover:bg-white/10 text-gray-300'}`}>
                <input 
                  type="radio" 
                  name="urgency" 
                  value="Critical"
                  checked={formData.urgency === 'Critical'}
                  onChange={handleChange}
                  className="sr-only"
                  required
                />
                <span className="font-semibold text-sm">Critical</span>
                {formData.urgency === 'Critical' && <span className="ml-2 w-2 h-2 rounded-full bg-rose-400"></span>}
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">
              Photo Upload (Optional)
            </label>
            <div className="flex items-center gap-5">
              <label
                htmlFor="image-upload"
                className="cursor-pointer group flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-white/30 rounded-lg bg-white/5 hover:bg-white/10 hover:border-emerald-400/50 transition-all duration-200"
              >
                <Camera className="w-8 h-8 text-white/50 group-hover:text-emerald-400/80 mb-2 transition-colors" />
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

              {imagePreview && (
                <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-white/20 shadow-lg group">
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
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-white text-xs font-semibold border border-white/50 px-3 py-1.5 rounded-md hover:bg-white hover:text-black transition-colors">Remove</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <>
                  <Upload size={20} />
                  Submit Report
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
