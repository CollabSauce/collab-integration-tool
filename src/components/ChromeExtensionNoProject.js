import React from 'react';

import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import BaseCardLayout from 'src/layouts/BaseCardLayout';
import ChromeExtensionNoProjectContent from 'src/components/cards/ChromeExtensionNoProjectContent';

const ChromeExtensionNoProject = () => (
  <FullToolbarLayout>
    <BaseCardLayout>
      <div className="text-center">
        <ChromeExtensionNoProjectContent />
      </div>
    </BaseCardLayout>
  </FullToolbarLayout>
);

export default ChromeExtensionNoProject;
