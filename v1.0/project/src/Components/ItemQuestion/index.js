import React from 'react';

import { Container, Question, CenterView, Button, ButtonText } from './styles';

export default function ItemQuestion({ number, question }) {
  return (
    <Container>
      <Question> {number+1}. {question} </Question>
    </Container>
  );
}