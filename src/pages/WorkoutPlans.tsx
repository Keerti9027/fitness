import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, WorkoutPlan, WorkoutExercise } from '../lib/localStorage';
import { Dumbbell, Calendar, Clock, Plus, ChevronRight, X, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

export default function WorkoutPlans() {
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(
    user ? storage.getWorkoutPlans(user.id) : []
  );
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    exercises: [] as WorkoutExercise[]
  });
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredPlans = workoutPlans.filter(plan => plan.dayOfWeek === selectedDay);

  const handleAddExercise = () => {
    if (!currentExercise.name) return;

    const exercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      name: currentExercise.name,
      sets: parseInt(currentExercise.sets) || undefined,
      reps: parseInt(currentExercise.reps) || undefined,
      weight: parseFloat(currentExercise.weight) || undefined,
      orderPosition: newPlan.exercises.length
    };

    setNewPlan({
      ...newPlan,
      exercises: [...newPlan.exercises, exercise]
    });

    setCurrentExercise({
      name: '',
      sets: '',
      reps: '',
      weight: ''
    });
  };

  const handleRemoveExercise = (id: string) => {
    setNewPlan({
      ...newPlan,
      exercises: newPlan.exercises.filter(ex => ex.id !== id)
    });
  };

  const handleDeletePlan = (planId: string) => {
    setPlanToDelete(planId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeletePlan = () => {
    if (!planToDelete) return;

    storage.deleteWorkoutPlan(planToDelete);
    setWorkoutPlans(workoutPlans.filter(plan => plan.id !== planToDelete));
    setPlanToDelete(null);
    setShowDeleteConfirmModal(false);
  };

  const handleSavePlan = () => {
    if (!user || !newPlan.name) return;

    const plan: WorkoutPlan = {
      id: crypto.randomUUID(),
      userId: user.id,
      name: newPlan.name,
      description: newPlan.description,
      dayOfWeek: selectedDay,
      exercises: newPlan.exercises
    };

    storage.saveWorkoutPlan(plan);
    setWorkoutPlans([...workoutPlans, plan]);
    setNewPlan({
      name: '',
      description: '',
      exercises: []
    });
    setShowAddModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workout Plans</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Plan</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto p-4 space-x-4">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedDay === day
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No workouts planned</h3>
              <p className="text-gray-600 mb-6">Create your first workout plan for {selectedDay}</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Workout
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPlans.map(plan => (
                <div key={plan.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-3 rounded-xl">
                        <Dumbbell className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {plan.exercises.map(exercise => (
                      <div key={exercise.id} className="bg-white p-4 rounded-lg">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                          {exercise.sets && <span>{exercise.sets} sets</span>}
                          {exercise.reps && <span>{exercise.reps} reps</span>}
                          {exercise.weight && <span>{exercise.weight} kg</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Workout Plan"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter plan name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter plan description"
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Exercises</h4>
            <div className="space-y-4">
              {newPlan.exercises.map(exercise => (
                <div key={exercise.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveExercise(exercise.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={currentExercise.name}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                  placeholder="Exercise name"
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  value={currentExercise.sets}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, sets: e.target.value })}
                  placeholder="Sets"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  value={currentExercise.reps}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                  placeholder="Reps"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  value={currentExercise.weight}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, weight: e.target.value })}
                  placeholder="Weight (kg)"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleAddExercise}
                  className="col-span-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Add Exercise
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePlan}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Plan
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setPlanToDelete(null);
        }}
        title="Delete Workout Plan"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this workout plan? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setPlanToDelete(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeletePlan}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}