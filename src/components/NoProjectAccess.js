import React from 'react';

import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import BaseCardLayout from 'src/layouts/BaseCardLayout';
import NoProjectAccessContent from 'src/components/cards/NoProjectAccessContent';

const NoProjectAccess = () => (
  <FullToolbarLayout>
    <BaseCardLayout>
      <div className="text-center">
        <NoProjectAccessContent />
      </div>
    </BaseCardLayout>
  </FullToolbarLayout>
);

export default NoProjectAccess;
