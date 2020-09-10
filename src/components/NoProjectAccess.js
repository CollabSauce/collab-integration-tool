import React from 'react';

import BaseCardLayout from 'src/layouts/BaseCardLayout';
import NoProjectAccessContent from 'src/components/cards/NoProjectAccessContent';

const NoProjectAccess = () => (
  <BaseCardLayout>
    <div className="text-center">
      <NoProjectAccessContent />
    </div>
  </BaseCardLayout>
);

export default NoProjectAccess;
