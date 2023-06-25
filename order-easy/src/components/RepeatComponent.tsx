/** @jsxImportSource @emotion/react */
import { VFlow } from "bold-ui";
import React, { ReactNode } from "react";

interface RepeatComponentProps {
  times: number;
  children: (index: number) => ReactNode;
  addVFlow?: boolean;
}

export function RepeatComponent(props: RepeatComponentProps) {
  const { times, children, addVFlow } = props;

  const addChildVFlow = (content: ReactNode) => <VFlow>{content}</VFlow>;

  const repeatedContent = Array.from({ length: times }, (_, index) => (
    <React.Fragment key={index}>{children(index + 1)}</React.Fragment>
  ));

  return <>{addVFlow ? addChildVFlow(repeatedContent) : repeatedContent}</>;
}
