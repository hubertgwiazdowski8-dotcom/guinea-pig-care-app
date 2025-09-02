import React from 'react';
import GuineaPigCard from './GuineaPigCard';

const GuineaPigList = ({ pigs, onEdit, onDelete }) => (
  <div className="pigs-gallery">
    {pigs.map(pig => (
      <GuineaPigCard
        key={pig.id}
        pig={pig}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default GuineaPigList;