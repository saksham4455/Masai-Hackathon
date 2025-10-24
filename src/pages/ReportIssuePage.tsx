import { useState } from 'react';
import { Upload, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { localStorageService, Issue } from '../lib/localStorage';
import { IssueMap } from '../components/IssueMap';

type ReportIssuePageProps = {
  onNavigate: (page: string) => void;
};

export function ReportIssuePage({ onNavigate }: ReportIssuePageProps) {
  const { user } = useAuth();
  const [issueType, setIssueType] = useState('pothole');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(40.7128);
  const [longitude, setLongitude] = useState<number>(-74.006);
  const [locationSet, setLocationSet] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationSet(true);
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationSet(true);
        },
        (error) => {
          setError('Unable to get your location. Please click on the map to set location.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please click on the map to set location.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!locationSet) {
      setError('Please set a location on the map or use your current location');
      setLoading(false);
      return;
    }

    try {
      let photoUrl = null;

      if (photo) {
        // Convert image to base64 synchronously
        photoUrl = photoPreview; // Use the already loaded preview
      }

      const { issue, error: createError } = await localStorageService.createIssue({
        user_id: user?.id || '',
        issue_type: issueType as Issue['issue_type'],
        description,
        photo_url: photoUrl,
        latitude,
        longitude,
        status: 'pending',
      });

      if (createError) throw createError;

      setSuccess(true);
      setTimeout(() => {
        onNavigate('my-complaints');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit issue');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please log in to report an issue</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Report an Issue</h1>
          <p className="text-gray-600">Help improve your city by reporting problems</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3 text-green-700">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-medium">Issue reported successfully!</p>
              <p className="text-sm">Redirecting to your complaints...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-red-700">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Type
              </label>
              <select
                id="issueType"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pothole">Pothole</option>
                <option value="garbage">Garbage</option>
                <option value="streetlight">Streetlight Failure</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide details about the issue..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                {photo && <span className="text-sm text-gray-600">{photo.name}</span>}
              </div>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mt-4 max-w-xs rounded-lg border-2 border-gray-200"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Use My Current Location</span>
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Or click on the map to set the location
                </p>
              </div>
              <IssueMap
                issues={locationSet ? [{
                  id: 'temp',
                  user_id: user.id,
                  issue_type: issueType as any,
                  description: 'Selected location',
                  latitude,
                  longitude,
                  status: 'pending',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }] : []}
                center={{ lat: latitude, lng: longitude }}
                onLocationSelect={handleLocationSelect}
                height="400px"
              />
              {locationSet && (
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Location set: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
