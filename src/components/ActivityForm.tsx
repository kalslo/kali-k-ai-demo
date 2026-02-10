import React, { useState } from 'react';
import { ExertionLevel, ActivityType, Activity } from '../types';
import { ExertionSelector } from './ExertionSelector';
import { ActivityTypeToggle } from './ActivityTypeToggle';
import { Input } from './Input';
import { Button } from './Button';
import './ActivityForm.css';

interface ActivityFormProps {
  hour: number;
  activity?: Activity;
  onSubmit: (data: ActivityFormData) => void;
  onCancel: () => void;
}

export interface ActivityFormData {
  name: string;
  hour: number;
  exertionLevel: ExertionLevel;
  type: ActivityType;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  hour,
  activity,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(activity?.name || '');
  const [exertionLevel, setExertionLevel] = useState<ExertionLevel>(
    activity?.exertionLevel || ExertionLevel.Moderate
  );
  const [type, setType] = useState<ActivityType>(activity?.type || ActivityType.Exerting);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!name.trim()) {
      setError('Please enter an activity name');
      return;
    }

    // Submit
    onSubmit({
      name: name.trim(),
      hour,
      exertionLevel,
      type,
    });
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <div className="activity-form__body">
        <ActivityTypeToggle value={type} onChange={setType} />

        <Input
          label="activity name"
          id="activity-name"
          value={name}
          onChange={e => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
          placeholder="e.g., morning walk"
        />

        <ExertionSelector value={exertionLevel} onChange={setExertionLevel} activityType={type} />
      </div>

      <div className="activity-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          cancel
        </Button>
        <Button type="submit" variant="primary">
          save
        </Button>
      </div>
    </form>
  );
};
