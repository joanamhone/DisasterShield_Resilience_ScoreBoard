import React, { useState } from 'react';
import { useEmergencyKit, KitItem } from '../../contexts/EmergencyKitContext';
import { Plus, Minus, Check, Package, Droplets, Zap, Heart, Shield, Loader2 } from 'lucide-react';

const EmergencyKitBuilder: React.FC = () => {
  const { kitItems, isLoading, updateItemQuantity } = useEmergencyKit();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Water & Food', 'First Aid & Medical', 'Power & Communication', 'Tools & Supplies', 'Personal Items', 'Pets'];

  const filteredItems = selectedCategory === 'All' 
    ? kitItems 
    : kitItems.filter(item => item.category === selectedCategory);

  const getCompletionPercentage = (item: KitItem) => {
    if (item.recommended_quantity === 0) return 100;
    return Math.min(100, (item.quantity / item.recommended_quantity) * 100);
  };

  const getOverallCompletion = () => {
    if (kitItems.length === 0) return 0;
    const totalRecommended = kitItems.reduce((sum, item) => sum + item.recommended_quantity, 0);
    const totalCurrent = kitItems.reduce((sum, item) => sum + Math.min(item.quantity, item.recommended_quantity), 0);
    if (totalRecommended === 0) return 100;
    return Math.round((totalCurrent / totalRecommended) * 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Water & Food': return <Droplets className="text-secondary" size={20} />;
      case 'First Aid & Medical': return <Heart className="text-error" size={20} />;
      case 'Power & Communication': return <Zap className="text-warning" size={20} />;
      case 'Tools & Supplies': return <Package className="text-accent" size={20} />;
      case 'Personal Items': return <Shield className="text-primary" size={20} />;
      case 'Pets': return <Shield className="text-green-500" size={20} />;
      default: return <Package className="text-text-secondary" size={20} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const overallCompletion = getOverallCompletion();

  return (
    <div className="space-y-6">
      {/* Header with overall progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">Emergency Kit Builder</h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{overallCompletion}%</div>
            <div className="text-sm text-text-secondary">Complete</div>
          </div>
        </div>
        <div className="w-full bg-border h-3 rounded-full mb-4">
          <div 
            className="h-3 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${overallCompletion}%` }}
          />
        </div>
        <p className="text-text-secondary">
          Build your comprehensive emergency kit by tracking essential supplies.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-border'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Kit items */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          const completion = getCompletionPercentage(item);
          const isComplete = item.quantity >= item.recommended_quantity;
          
          return (
            <div key={item.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  {getCategoryIcon(item.category)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-text-primary">{item.item_name}</h3>
                      {item.essential && (
                        <span className="bg-error text-white text-xs px-2 py-1 rounded-full">Essential</span>
                      )}
                      {isComplete && <Check className="text-success" size={16} />}
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{item.description}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">{item.quantity} / {item.recommended_quantity} {item.unit}</span>
                  <span className={`font-medium ${isComplete ? 'text-success' : 'text-text-secondary'}`}>{Math.round(completion)}%</span>
                </div>
                <div className="w-full bg-border h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${isComplete ? 'bg-success' : 'bg-primary'}`}
                    style={{ width: `${Math.min(completion, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 0} className="w-8 h-8 rounded-full bg-surface hover:bg-border disabled:opacity-50 flex items-center justify-center">
                    <Minus size={16} />
                  </button>
                  <span className="font-medium text-text-primary min-w-[3rem] text-center">{item.quantity}</span>
                  <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-surface hover:bg-border flex items-center justify-center">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-sm text-text-tertiary">Target: {item.recommended_quantity} {item.unit}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyKitBuilder;
