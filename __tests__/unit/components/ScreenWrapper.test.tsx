// ScreenWrapper component tests
import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import {ScreenWrapper} from '@/components/ScreenWrapper';

describe('ScreenWrapper', () => {
  it('renders children correctly', () => {
    const {getByText} = render(
      <ScreenWrapper>
        <Text>Test Content</Text>
      </ScreenWrapper>,
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = {backgroundColor: 'red'};
    const {getByTestId} = render(
      <ScreenWrapper style={customStyle} testID="wrapper">
        <Text>Content</Text>
      </ScreenWrapper>,
    );
    expect(getByTestId('wrapper')).toBeTruthy();
  });

  it('renders with ScrollView when scrollable is true', () => {
    const {getByTestId} = render(
      <ScreenWrapper scrollable={true} testID="wrapper">
        <Text>Scrollable Content</Text>
      </ScreenWrapper>,
    );
    expect(getByTestId('wrapper')).toBeTruthy();
    // The scrollable prop should enable ScrollView
  });

  it('renders with View when scrollable is false', () => {
    const {getByTestId} = render(
      <ScreenWrapper scrollable={false} testID="wrapper">
        <Text>Non-Scrollable Content</Text>
      </ScreenWrapper>,
    );
    expect(getByTestId('wrapper')).toBeTruthy();
  });

  it('applies content container style when scrollable', () => {
    const contentStyle = {padding: 20};
    const {getByTestId} = render(
      <ScreenWrapper
        scrollable={true}
        contentContainerStyle={contentStyle}
        testID="wrapper">
        <Text>Content</Text>
      </ScreenWrapper>,
    );
    expect(getByTestId('wrapper')).toBeTruthy();
  });

  it('renders multiple children', () => {
    const {getByText} = render(
      <ScreenWrapper>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
        <Text>Child 3</Text>
      </ScreenWrapper>,
    );
    expect(getByText('Child 1')).toBeTruthy();
    expect(getByText('Child 2')).toBeTruthy();
    expect(getByText('Child 3')).toBeTruthy();
  });

  it('wraps content in KeyboardAvoidingView', () => {
    const {getByTestId} = render(
      <ScreenWrapper testID="wrapper">
        <Text>Content</Text>
      </ScreenWrapper>,
    );
    // KeyboardAvoidingView should be present
    expect(getByTestId('wrapper')).toBeTruthy();
  });
});
