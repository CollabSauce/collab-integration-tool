import React from 'react';
import * as BootstrapRangeSlider from 'react-bootstrap-range-slider';
import { Input } from 'reactstrap';

const RangeSlider = (props) => <BootstrapRangeSlider {...props} />;

export const RangeInputBox = (props) => (
  <div className="col-3 px-0 collab-sauce-range-slider">
    <Input type="number" value={props.value} onChange={props.onChange} className="px-2 fs--2" />
  </div>
);

export default RangeSlider;
