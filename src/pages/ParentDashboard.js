import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Star, Activity } from 'lucide-react';

const ParentDashboard = () => {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8080/player/getData', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setPlayerData(data.player);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load player data');
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-red-500 font-bold">{error}</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalTreasures = 12;
  const treasuresCollectedCount = playerData.treasuresCollected.length;
  const progressPercentage = ((treasuresCollectedCount / totalTreasures) * 100).toFixed(1);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="p-6 w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">SoundSense Progress Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score Card */}
          <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Total Score</h3>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{playerData.score} points</div>
          </div>

          {/* Activity Card */}
          <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Days Active</h3>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900">{playerData.days_active} days</div>
          </div>

          {/* Level Card */}
          <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Current Level</h3>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900">Level {playerData.current_level} / 2</div>
            <p className="text-gray-600 mt-2 text-lg">Total levels: 2</p>
          </div>

          {/* Treasures Card */}
          <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Treasures Collected</h3>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {treasuresCollectedCount} / {totalTreasures}
            </div>
            <p className="text-gray-600 mt-2 text-lg">Progress: {progressPercentage}%</p>
            <p className="text-gray-600 text-lg">6 treasures per level</p>
          </div>
        </div>

        {/* Last Active Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Last Activity</h3>
          <p className="text-xl text-gray-700">
            Last played on {formatDate(playerData.last_active_date)}
          </p>
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6 transform transition-all duration-300 hover:scale-102 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Overall Progress</h3>
          <div className="space-y-3">
            <p className="text-xl text-gray-700">
              • Current Level: {playerData.current_level} of 2 levels completed
            </p>
            <p className="text-xl text-gray-700">
              • Collected {treasuresCollectedCount} out of {totalTreasures} total treasures
            </p>
            <p className="text-xl text-gray-700">
              • Overall completion: {progressPercentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;