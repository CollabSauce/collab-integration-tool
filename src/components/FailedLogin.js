import React from 'react';

import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import BaseCardLayout from 'src/layouts/BaseCardLayout';
import FailedLoginContent from 'src/components/cards/FailedLoginContent';

const FailedLogin = () => (
  <FullToolbarLayout>
    <BaseCardLayout>
      <div className="text-center">
        <FailedLoginContent />
      </div>
    </BaseCardLayout>
  </FullToolbarLayout>
);

export default FailedLogin;
