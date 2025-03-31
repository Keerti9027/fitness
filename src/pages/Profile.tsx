import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../lib/localStorage';
import { User, Camera, Edit2, Award, Target, Save, X } from 'lucide-react';

interface ProfileFormData {
  fullName: string;
  username: string;
  height: string;
  weight: string;
  goal: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user ? storage.getUserProfile(user.id) : undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: profile?.fullName || '',
    username: profile?.username || '',
    height: profile?.height?.toString() || '',
    weight: profile?.weight?.toString() || '',
    goal: profile?.goal || ''
  });

  const achievements = [
    { title: "Workout Warrior", description: "Completed 10 workouts", icon: Award },
    { title: "Diet Master", description: "Logged 30 days of meals", icon: Target },
    { title: "Progress Tracker", description: "Logged progress for 2 months", icon: Target },
  ];

  useEffect(() => {
    if (user) {
      const userProfile = storage.getUserProfile(user.id);
      setProfile(userProfile);
      setFormData({
        fullName: userProfile?.fullName || '',
        username: userProfile?.username || '',
        height: userProfile?.height?.toString() || '',
        weight: userProfile?.weight?.toString() || '',
        goal: userProfile?.goal || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!user) return;

    const updatedProfile = {
      ...profile,
      fullName: formData.fullName,
      username: formData.username,
      height: parseFloat(formData.height) || undefined,
      weight: parseFloat(formData.weight) || undefined,
      goal: formData.goal
    };

    storage.saveUserProfile(user.id, updatedProfile);
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName || '',
      username: profile?.username || '',
      height: profile?.height?.toString() || '',
      weight: profile?.weight?.toString() || '',
      goal: profile?.goal || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-3xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile?.fullName || 'Your Name'}</h1>
                <p className="text-indigo-100">{user?.email}</p>
              </div>
            </div>
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 p-3 rounded-full transition-colors"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-b-3xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Info</h2>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter height"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter weight"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Fitness Goal</label>
                      <select
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select a goal</option>
                        <option value="weight-loss">Weight Loss</option>
                        <option value="muscle-gain">Muscle Gain</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="endurance">Endurance</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-medium">{profile?.username || 'Not set'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Height</p>
                        <p className="font-medium">{profile?.height || '--'} cm</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-medium">{profile?.weight || '--'} kg</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Fitness Goal</p>
                      <p className="font-medium">{profile?.goal || 'Not set'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                      <achievement.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}