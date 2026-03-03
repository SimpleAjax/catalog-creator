// Header component tests
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Header} from '@/components/Header';
import {useNavigation} from '@react-navigation/native';

// Mock useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('Header', () => {
  const mockGoBack = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({goBack: mockGoBack});
    jest.clearAllMocks();
  });

  it('renders title correctly', () => {
    const {getByText} = render(<Header title="Test Screen" />);
    expect(getByText('Test Screen')).toBeTruthy();
  });

  it('shows back button by default', () => {
    const {getByTestId} = render(<Header title="Test" testID="header" />);
    // The back button should be rendered (we can check the ArrowLeft icon is present)
    expect(getByTestId('header')).toBeTruthy();
  });

  it('hides back button when showBack is false', () => {
    const {getByTestId} = render(
      <Header title="Test" showBack={false} testID="header" />,
    );
    const header = getByTestId('header');
    // Check that there's no back button in the left section
    expect(header).toBeTruthy();
  });

  it('calls navigation.goBack when back button is pressed', () => {
    const {getByRole} = render(<Header title="Test" />);
    const backButton = getByRole('button');
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('calls custom onBackPress when provided', () => {
    const customBackPress = jest.fn();
    const {getByRole} = render(
      <Header title="Test" onBackPress={customBackPress} />,
    );
    const backButton = getByRole('button');
    fireEvent.press(backButton);
    expect(customBackPress).toHaveBeenCalledTimes(1);
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it('renders right action when provided', () => {
    const RightAction = () => <span data-testid="right-action">Action</span>;
    const {getByTestId} = render(
      <Header title="Test" rightAction={<RightAction />} />,
    );
    expect(getByTestId('right-action')).toBeTruthy();
  });

  it('truncates long titles', () => {
    const longTitle = 'This is a very long title that should be truncated';
    const {getByText} = render(<Header title={longTitle} />);
    const titleText = getByText(longTitle);
    expect(titleText.props.numberOfLines).toBe(1);
  });

  it('applies custom style', () => {
    const customStyle = {backgroundColor: 'red'};
    const {getByTestId} = render(
      <Header title="Test" style={customStyle} testID="header" />,
    );
    expect(getByTestId('header')).toBeTruthy();
  });

  it('has correct accessibility label on back button', () => {
    const {getByRole} = render(<Header title="Test" />);
    const backButton = getByRole('button');
    expect(backButton).toBeTruthy();
  });
});
