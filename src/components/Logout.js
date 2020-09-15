import React from 'react';

import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import BaseCardLayout from 'src/layouts/BaseCardLayout';
import LogoutContent from 'src/components/cards/LogoutContent';

const Logout = () => (
  <FullToolbarLayout>
    <BaseCardLayout>
      <div className="text-center">
        <LogoutContent />
      </div>
    </BaseCardLayout>
  </FullToolbarLayout>
);

export default Logout;
