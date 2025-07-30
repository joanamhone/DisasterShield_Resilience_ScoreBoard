import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// --- A more detailed list of default items ---
const defaultKitItems = [
    // Water & Food
    { name: 'Water', category: 'Water & Food', unit: 'liters', description: '1 gallon (approx 4L) per person per day', essential: true, type: 'perPerson', amount: 4 },
    { name: 'Non-perishable Food', category: 'Water & Food', unit: 'days supply', description: 'Canned goods, dried fruits, energy bars', essential: true, type: 'perPerson', amount: 3 },
    { name: 'Manual Can Opener', category: 'Water & Food', unit: 'piece', description: 'Essential for accessing canned food', essential: true, type: 'perHousehold', amount: 1 },
    
    // First Aid & Medical
    { name: 'First-Aid Kit', category: 'First Aid & Medical', unit: 'kit', description: 'Bandages, antiseptic, pain relievers', essential: true, type: 'perHousehold', amount: 1 },
    { name: 'Prescription Medications', category: 'First Aid & Medical', unit: 'days supply', description: 'A supply for all essential medications', essential: true, type: 'conditional', condition: 'hasVulnerableMembers', amount: 7 },
    { name: 'Thermometer', category: 'First Aid & Medical', unit: 'piece', description: 'Digital thermometer for health monitoring', essential: false, type: 'perHousehold', amount: 1 },
    
    // Power & Communication
    { name: 'Flashlights', category: 'Power & Communication', unit: 'pieces', description: 'LED flashlights with extra batteries', essential: true, type: 'perPerson', amount: 1 },
    { name: 'Battery-powered Radio', category: 'Power & Communication', unit: 'piece', description: 'Weather radio with NOAA alerts', essential: true, type: 'perHousehold', amount: 1 },
    { name: 'Power Bank', category: 'Power & Communication', unit: 'pieces', description: 'Portable chargers for mobile devices', essential: true, type: 'perHousehold', amount: 1 },
    
    // Tools & Supplies
    { name: 'Multi-tool', category: 'Tools & Supplies', unit: 'piece', description: 'Swiss army knife or similar', essential: true, type: 'perHousehold', amount: 1 },
    { name: 'Duct Tape', category: 'Tools & Supplies', unit: 'roll', description: 'For repairs and securing items', essential: true, type: 'perHousehold', amount: 1 },

    // Personal Items
    { name: 'Cash', category: 'Personal Items', unit: 'local currency', description: 'Small bills for emergency purchases', essential: true, type: 'perHousehold', amount: 100 },
    { name: 'Important Documents', category: 'Personal Items', unit: 'set', description: 'Copies in waterproof container', essential: true, type: 'perHousehold', amount: 1 },
    
    // Conditional Pet items
    { name: 'Pet Food', category: 'Pets', unit: 'days supply', description: 'Food and water for your pets', essential: true, type: 'conditional', condition: 'hasPets', amount: 3 },
];

// --- Interfaces ---
export interface KitItem {
  id: string;
  item_name: string;
  quantity: number;
  recommended_quantity: number;
  category: string;
  unit: string;
  description: string;
  essential: boolean;
}

interface EmergencyKitContextType {
  kitItems: KitItem[];
  isLoading: boolean;
  updateItemQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  addItem: (itemName: string, category: string) => Promise<void>; // Add this
  deleteItem: (itemId: string) => Promise<void>; // And this
}

const EmergencyKitContext = createContext<EmergencyKitContextType | undefined>(undefined);

export const EmergencyKitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [kitItems, setKitItems] = useState<KitItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const populateInitialKit = useCallback(async (userId: string) => {
    const householdSize = user?.householdSize || 1;
    const hasVulnerable = !!user?.vulnerableMembersDescription;
    const hasPets = (user?.numberOfPets || 0) > 0;

    const itemsToInsert = defaultKitItems
      .filter(item => {
        if (item.condition === 'hasVulnerableMembers' && !hasVulnerable) return false;
        if (item.condition === 'hasPets' && !hasPets) return false;
        return true;
      })
      .map(item => {
        let recommendation = 0;
        if (item.type === 'perPerson') recommendation = Math.ceil(item.amount * householdSize);
        if (item.type === 'perHousehold') recommendation = item.amount;
        if (item.condition) recommendation = item.amount;

        return {
          user_id: userId,
          item_name: item.name,
          category: item.category,
          unit: item.unit,
          description: item.description,
          essential: item.essential,
          recommended_quantity: recommendation,
          quantity: 0,
        };
      });

    const { data: newItems, error } = await supabase
        .from('emergency_kit_items')
        .insert(itemsToInsert)
        .select();

    if (error) {
        console.error("Error populating initial kit:", error);
        return [];
    }
    
    return newItems || [];
  }, [user]);

  const fetchKitItems = useCallback(async () => {
    if (!user) {
      setKitItems([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      let { data, error } = await supabase
        .from('emergency_kit_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length === 0) {
        const populatedData = await populateInitialKit(user.id);
        setKitItems(populatedData);
      } else {
        setKitItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching kit items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, populateInitialKit]);

  useEffect(() => {
    fetchKitItems();
  }, [fetchKitItems]);

  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    const quantity = Math.max(0, newQuantity);
    setKitItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
    await supabase
        .from('emergency_kit_items')
        .update({ quantity })
        .eq('id', itemId);
  };

  // --- NEW FUNCTION TO ADD CUSTOM ITEMS ---
  const addItem = async (itemName: string, category: string) => {
      if (!user || !itemName.trim()) return;

      const newItem = {
          user_id: user.id,
          item_name: itemName.trim(),
          category,
          quantity: 1, // Custom items start with a quantity of 1
          recommended_quantity: 1,
          essential: false, // Custom items are not essential by default
          unit: 'piece',
          description: 'Custom item added by user.'
      };

      const { data, error } = await supabase
          .from('emergency_kit_items')
          .insert(newItem)
          .select()
          .single();

      if (error) {
          console.error("Error adding item:", error);
          return;
      }
      
      if (data) {
          setKitItems(prev => [...prev, data]);
      }
  };

  // --- NEW FUNCTION TO DELETE CUSTOM ITEMS ---
  const deleteItem = async (itemId: string) => {
      if (!user) return;
      
      setKitItems(prev => prev.filter(item => item.id !== itemId));
      
      await supabase
          .from('emergency_kit_items')
          .delete()
          .eq('id', itemId);
  };

  return (
    <EmergencyKitContext.Provider value={{ kitItems, isLoading, updateItemQuantity, addItem, deleteItem }}>
      {children}
    </EmergencyKitContext.Provider>
  );
};

export const useEmergencyKit = () => {
  const context = useContext(EmergencyKitContext);
  if (context === undefined) {
    throw new Error('useEmergencyKit must be used within an EmergencyKitProvider');
  }
  return context;
};
