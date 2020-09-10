import React from 'react';

import BaseCardLayout from 'src/layouts/BaseCardLayout';
import FailedLoginContent from 'src/components/cards/FailedLoginContent';

const FailedLogin = () => (
  <BaseCardLayout>
    <div className="text-center">
      <FailedLoginContent />
    </div>
  </BaseCardLayout>
);

export default FailedLogin;
