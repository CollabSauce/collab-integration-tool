import React, { useMemo } from 'react';
import Select from 'react-select';

import { useStoreState } from 'src/hooks/useStoreState';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import cursorPointerSelectStyles from 'src/utils/cursorPointerSelectStyles';
import { MemberRoleTypes } from 'src/store/jsdata/models/Membership';
import { INVITE_MEMBERS_VALUE_SELECT, DASHBOARD_URL } from 'src/constants';

const AssignSelect = ({ value, onChange, className }) => {
  const { result: currentUser } = useCurrentUser();
  const { result: memberships } = useStoreState((store) => store.getAll('membership'), [], 'membership');
  const isAdminOfOrg = useMemo(() => {
    return memberships.find((m) => m.user === currentUser && m.role === MemberRoleTypes.ADMIN);
    // eslint-disable-next-line
  }, [memberships, currentUser]);
  const options = useMemo(() => {
    const membs = memberships.map((m) => ({
      value: m.user.id,
      label: `${m.user.firstName} ${m.user.lastName}`,
    }));

    if (isAdminOfOrg) {
      membs.push({
        value: INVITE_MEMBERS_VALUE_SELECT,
        label: (
          <a href={`${DASHBOARD_URL}/members`} target="_blank" rel="noopener noreferrer">
            Add Additional Members
          </a>
        ),
      });
    }

    return membs;
  }, [memberships, isAdminOfOrg]);

  return (
    <div className={className}>
      <p className="mb-1 text-sans-serif font-weight-semi-bold">Assign To (optional):</p>
      <Select value={value} onChange={onChange} options={options} styles={cursorPointerSelectStyles} isClearable />
    </div>
  );
};

export default AssignSelect;
