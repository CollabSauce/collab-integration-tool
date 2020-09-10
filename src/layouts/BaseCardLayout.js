import React from 'react';

import { Card, CardBody, Col, Row } from 'reactstrap';

const BaseCardLayout = ({ children, noLogo }) => (
  <Row className="flex-center py-6">
    <Col sm={11} md={10} lg={8} xl={6} className="col-xxl-5">
      <Card>
        <CardBody className="fs--1 font-weight-normal py-5">{children}</CardBody>
      </Card>
    </Col>
  </Row>
);

export default BaseCardLayout;
