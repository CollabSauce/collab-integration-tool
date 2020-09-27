import React, { useMemo } from 'react';
import Select from 'react-select';

import { useStoreState } from 'src/hooks/useStoreState';
import cursorPointerSelectStyles from 'src/utils/cursorPointerSelectStyles';

const AssignSelect = ({ value, onChange, className }) => {
  const { result: memberships } = useStoreState((store) => store.getAll('membership'), [], 'membership');
  const options = useMemo(() => {
    return memberships.map((m) => ({
      value: m.user.id,
      label: `${m.user.firstName} ${m.user.lastName}`,
    }));
  }, [memberships]);

  return (
    <div className={className}>
      <p className="mb-1 text-sans-serif font-weight-semi-bold">Assign To (optional):</p>
      <Select value={value} onChange={onChange} options={options} styles={cursorPointerSelectStyles} isClearable />
    </div>
  );
};

export default AssignSelect;
