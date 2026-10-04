import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldCheck } from 'lucide-react';

/**
 * Universal Error Boundary
 * Prevents any component runtime error from causing a blank white screen.
 * Displays a clean, reassuring recovery screen in Marathi and English.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[KrushiMitra ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[360px] p-6 sm:p-8 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl border border-amber-200 shadow-xl p-6 sm:p-7 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>सुरक्षित पुनर्प्राप्ती (Safe Recovery)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                घटक लोड करताना तात्पुरती अडचण आली
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                तुमचा डेटा व माहिती सुरक्षित आहे. पेज पुन्हा लोड करून किंवा खालील बटनावर क्लिक करून काम सुरू ठेवू शकता.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>पुन्हा प्रयत्न करा (Retry)</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-all cursor-pointer"
              >
                <span>पेज रीलोड करा</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
