import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../lib/localStorage';
import { User, Camera, Edit2, Award, Target } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const profile = user ? storage.getUserProfile(user.id) : undefined;
  const [isEditing, setIsEditing] = useState(false);

  const achievements = [
    { title: "Workout Warrior", description: "Completed 10 workouts", icon: Award },
    { title: "Diet Master", description: "Logged 30 days of meals", icon: Target },
  ];

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
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-b-3xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Info</h2>
              <div className="space-y-4">
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